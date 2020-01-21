/*************************************************************************************
 * Product: ADempiere gRPC Business Data Client                                      *
 * Copyright (C) 2012-2018 E.R.P. Consultores y Asociados, C.A.                      *
 * Contributor(s): Yamel Senih ysenih@erpya.com                                      *
 * This program is free software: you can redistribute it and/or modify              *
 * it under the terms of the GNU General Public License as published by              *
 * the Free Software Foundation, either version 3 of the License, or                 *
 * (at your option) any later version.                                               *
 * This program is distributed in the hope that it will be useful,                   *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of                    *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                     *
 * GNU General Public License for more details.                                      *
 * You should have received a copy of the GNU General Public License                 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.            *
 ************************************************************************************/
class BusinessData {

  /**
   * Constructor, No authentication required
   * @param {string} host
   * @param {string} sessionUuid
   * @param {string} language Languaje i18n
   */
  constructor(host, sessionUuid, language = 'en_US') {
    this.sessionUuid = sessionUuid;
    this.host = host;
    this.language = language;
  }

  /**
   * Load gRPC Connection
   * @return {object} requestService Return request for get data
   */
  getService() {
    const grpc_promise = require('grpc-promise');
    const { BusinessDataServicePromiseClient } = require('./src/grpc/proto/businessdata_grpc_web_pb.js');
    const requestService = new BusinessDataServicePromiseClient(this.host);
    grpc_promise.promisifyAll(requestService);
    //  Return request for get data
    return requestService;
  }

  getClientRequest() {
    const { ClientRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    return clientRequest
  }

  /**
   * Checks if value is empty. Deep-checks arrays and objects
   * Note: isEmpty([]) == true, isEmpty({}) == true, isEmpty([{0:false},"",0]) == true, isEmpty({0:1}) == false
   * @param   {boolean|array|object|number|string} value
   * @returns {boolean}
   */
  isEmptyValue(value) {
    if (value === undefined || value == null) {
      return true
    } else if (value === -1 || value === '-1') {
      return true
    } else if (typeof value === 'string') {
      return Boolean(!value.trim().length)
    } else if (typeof value === 'function' || typeof value === 'number' || typeof value === 'boolean' || Object.prototype.toString.call(value) === '[object Date]') {
      return false
    } else if (Object.prototype.toString.call(value) === '[object Map]' && value.size === 0) {
      return true
    } else if (Array.isArray(value)) {
      return Boolean(!value.length)
    } else if (typeof value === 'object') {
      return Boolean(!Object.keys(value).length)
    }

    return true
  }

  /**
   * convert the value obtained from gRPC according to the type of value
   * @param {object} valueToConvert
   * @returns {mixed}
   */
  convertValueFromGRPC(valueToConvert) {
    const { Value } = require('./src/grpc/proto/businessdata_pb.js');

    if (valueToConvert === undefined || valueToConvert === null) {
      return undefined;
    }

    var returnValue;
    switch (valueToConvert.getValuetype()) {
      // data type Null or undefined
      default:
      case Value.ValueType.NULL:
        returnValue = undefined;
        break;
      // data type Number (integer)
      case Value.ValueType.INTEGER:
        returnValue = valueToConvert.getIntvalue();
        break;
      // data type Number (integer)
      case Value.ValueType.LONG:
        returnValue = valueToConvert.getLongvalue();
        break;
      // data type Number (float)
      case Value.ValueType.DOUBLE:
        returnValue = valueToConvert.getDoublevalue();
        break;
      // data type Boolean
      case Value.ValueType.BOOLEAN:
        returnValue = valueToConvert.getBooleanvalue();
        break;
      // data type String
      case Value.ValueType.STRING:
        returnValue = valueToConvert.getStringvalue();
        break;
      // data type Date
      case Value.ValueType.DATE:
        returnValue = new Date(valueToConvert.getLongvalue());
        break;
    }
    return returnValue;
  }

  /**
   * Convert values map to compatible format
   * @param {map} mapToConvert
   * @param {string} returnType
   * @param {string} keyName, used in array pairs, default value is 'key'
   */
  convertValuesMap({ mapToConvert, returnType = 'map', keyName = 'key' }) {
    let returnValues;
    switch (returnType) {
      case 'object':
        returnValues = {};
        mapToConvert.forEach((value, key) => {
          returnValues[key] = this.convertValueFromGRPC(value);
        });
        break;

      case 'array':
        returnValues = [];
        mapToConvert.forEach((value, key) => {
          const item = {}
          item[keyName] = key;
          item.value = this.convertValueFromGRPC(value);
          returnValues.push(item);
        });
        break;

      default:
      case 'map':
        returnValues = new Map();
        mapToConvert.forEach((value, key) => {
          returnValues.set(key, this.convertValueFromGRPC(value));
        });
        break;
    }

    return returnValues;
  }

  convertEntity({ entityToConvert, formatToConvert = 'object' }) {
    if (entityToConvert) {
      return {
        id: entityToConvert.getId(),
        uuid: entityToConvert.getUuid(),
        tableName: entityToConvert.getTablename(),
        values: this.convertValuesMap({
          mapToConvert: entityToConvert.getValuesMap(),
          returnType: formatToConvert
        })
      };
    }
    return {
      id: undefined,
      uuid: undefined,
      tableName: undefined,
      values: undefined
    };
  }

  /**
   * Create a entity from CreateEntityRequest object
   * @param {string} tableName
   * @param {array}  attributesList
   * @return {Entity} Entity created.
   */
  createEntity({ tableName, attributesList = [], isConvert = true, formatToConvert = 'object' }) {
    const { CreateEntityRequest } = require('./src/grpc/proto/businessdata_pb.js');

    const request = new CreateEntityRequest();
    request.setClientrequest(this.getClientRequest());
    request.setTablename(tableName);

    if (attributesList && attributesList.length) {
      attributesList.forEach(attribute => {
        const convertedAttribute = this.convertParameter({
          columnName: attribute.columnName,
          value: attribute.value
        });
        request.addAttributes(convertedAttribute);
      });
    }

    return this.getService().createEntity(request)
      .then(responseCreateEntity => {
        if (isConvert) {
          return this.convertEntity({
            entityToConvert: responseCreateEntity,
            formatToConvert
          });
        }
        return responseCreateEntity;
      });
  }

  /**
   * Create a entity from UpdateEntityRequest object
   * @param {string} tableName
   * @param {number} recordId
   * @param {string} recordUuid
   * @param {array}  attributesList
   * @return {Entity} Entity updated.
   */
  updateEntity({ tableName, recordId, recordUuid, attributesList = [], isConvert = true, formatToConvert = 'object' }) {
    const { UpdateEntityRequest } = require('./src/grpc/proto/businessdata_pb.js');

    const request = new UpdateEntityRequest();
    request.setClientrequest(this.getClientRequest());
    request.setTablename(tableName);
    if (recordId !== undefined && recordId !== null) {
      request.setRecordid(recordId);
    }
    request.setUuid(recordUuid);

    if (attributesList && attributesList.length) {
      attributesList.forEach(attribute => {
        const convertedAttribute = this.convertParameter(attribute);
        request.addAttributes(convertedAttribute);
      });
    }

    return this.getService().updateEntity(request)
      .then(responseUpdateEntity => {
        if (isConvert) {
          return this.convertEntity({
            entityToConvert: responseUpdateEntity,
            formatToConvert
          })
        }
        return responseUpdateEntity;
      });
  }

  /**
   * Get Client Request
   * @param {string} tableName, Table name from request
   * @param {string} recordUuid, Universally Unique IDentifier from record
   * @param {number} recordId, IDentifier from record
   * @return {object} Entity with records
   */
  requestEntity({ tableName, recordUuid, recordId, isConvert = true, formatToConvert = 'object' }) {
    const { GetEntityRequest } = require('./src/grpc/proto/businessdata_pb.js');

    const request = new GetEntityRequest();
    request.setClientrequest(this.getClientRequest());
    if (recordId !== undefined && recordId !== null) {
      request.setRecordid(recordId);
    }
    request.setUuid(recordUuid);
    request.setCriteria(
      this.convertCriteriaToGRPC({ tableName })
    );

    return this.getService().getEntity(request)
    .then(getEntityResponse => {
      if (isConvert) {
        return this.convertEntity({
          entityToConvert: getEntityResponse,
          formatToConvert
        })
      }
      return getEntityResponse;
    });
  }

  /**
   * Get entities list
   * @param {string} tableName
   * @param {string} query
   * @param {string} whereClause
   * @param {array}  conditionsList
   * @param {string} orderByClause
   * @param {string} nextPageToken
   * @returns {ListEntitiesResponse}
   */
  requestEntitiesList({ tableName, query, whereClause, conditionsList = [], orderByClause, pageToken, pageSize, isConvert = true, formatToConvert = 'object' }) {
    const { ListEntitiesRequest } = require('./src/grpc/proto/businessdata_pb.js');

    const request = new ListEntitiesRequest();
    request.setClientrequest(this.getClientRequest());

    const criteriaForList = this.convertCriteriaToGRPC({ tableName, query, whereClause, conditionsList, orderByClause });
    request.setCriteria(criteriaForList);
    request.setPageToken(pageToken);
    request.setPageSize(pageSize);

    return this.getService().listEntities(request)
      .then(entitiesListResponse => {
        if (isConvert) {
          return {
            recordCount: entitiesListResponse.getRecordcount(),
            recordsList: entitiesListResponse.getRecordsList().map(entityItem => {
              return this.convertEntity({
                entityToConvert: entityItem,
                formatToConvert
              });
            }),
            nextPageToken: entitiesListResponse.getNextPageToken(),
          };
        }
        return entitiesListResponse;
      });
  }

  /**
   * Delete a entity request
   * @param {string} tableName
   * @param {number} recordId
   * @param {string} recordUuid
   * @return {Empty} empty for deleted and throw for error.
   */
  deleteEntity({ tableName, recordId, recordUuid }) {
    const { DeleteEntityRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const request = new DeleteEntityRequest();
    request.setClientrequest(this.getClientRequest());

    request.setTablename(tableName);
    // do not compare if there is a value because 0 is false
    if (recordId !== undefined && recordId !== null) {
      request.setRecordid(recordId);
    }
    request.setUuid(recordUuid);

    return this.getService().deleteEntity(request);
  }

  /**
   * Rollback last Entity operation
   * @param {string} tableName
   * @param {string} recordId
   * @param {string} eventTypeExecuted
   */
  rollbackEntityRequest({ tableName, recordId, eventTypeExecuted, isConvert = true, formatToConvert = 'object' }) {
    const { RollbackEntityRequest } = require('./src/grpc/proto/businessdata_pb.js');

    const rollbackRequest = new RollbackEntityRequest();
    rollbackRequest.setClientrequest(this.getClientRequest());
    rollbackRequest.setTablename(tableName);
    rollbackRequest.setRecordid(recordId);

    // set event type
    let eventType = this.getEventType(); // all events
    eventType = eventType[eventTypeExecuted];
    rollbackRequest.setEventtype(eventType);

    return this.getService().rollbackEntity(rollbackRequest)
      .then(rollBackResponse => {
        if (isConvert) {
          return this.convertEntity({
            entityToConvert: rollBackResponse,
            formatToConvert
          });
        }
        return rollBackResponse;
      });
  }

  /**
   * Get all event type or get key value type from value
   * @param {number} keyFind
   */
  getEventType(keyFind) {
    const { RollbackEntityRequest } = require('./src/grpc/proto/businessdata_pb.js');
    if (keyFind !== undefined) {
      return Object.keys(RollbackEntityRequest.EventType).find(key => RollbackEntityRequest.EventType[key] === keyFind);
    }
    return RollbackEntityRequest.EventType;
  }

  /**
   * Get Criteria from Table Name
   * @param {string} tableName
   * @param {string} query
   * @param {string} whereClause
   * @param {array}  conditionsList
   * @param {string} orderByClause
   * @return {Criteria} instance
   * TODO: Add support to orderByColumnsList
   */
  convertCriteriaToGRPC({ tableName, query, whereClause, referenceUuid, conditionsList = [], orderByClause, valuesList = [], orderByColumnList = [], limit }) {
    const { Criteria } = require('./src/grpc/proto/businessdata_pb.js');
    const criteria = new Criteria();

    criteria.setTablename(tableName);
    criteria.setQuery(query);
    criteria.setWhereclause(whereClause);
    criteria.setReferenceuuid(referenceUuid);

    // add values
    if (valuesList && valuesList.length) {
      valuesList.forEach(itemValue => {
        const value = this.convertValueToGRPC(itemValue);
        criteria.addValues(value);
      })
    }

    // add conditions
    if (conditionsList && conditionsList.length) {
      conditionsList.forEach(itemCondition => {
        const convertCondition = this.convertConditionToGRPC(itemCondition);
        criteria.addConditions(convertCondition);
      })
    }

    criteria.setOrderbyclause(orderByClause);
    criteria.setLimit(limit)

    //  Return criteria
    return criteria;
  }

  /**
   * Convert criteria to json structure
   * @param {Criteria} criteriaToConvert
   * TODO: Add convert condition from gRPC and order by column from gRPC
   */
  convertCriteriaFromGRPC(criteriaToConvert) {
    return {
      tableName: criteriaToConvert.getTablename(),
      query: criteriaToConvert.getQuery(),
      whereClause: criteriaToConvert.getWhereclause(),
      orderByClause: criteriaToConvert.getOrderbyclause(),
      referenceUuid: criteriaToConvert.getReferenceuuid(),
      conditionsList: criteriaToConvert.getConditionsList().map(condition => {
        return condition;
      }),
      valuesList: criteriaToConvert.getValuesList().map(value => {
        return this.convertValueFromGRPC(value);
      }),
      orderByColumnList: criteriaToConvert.getOrderbycolumnList().map(orderBy => {
        return orderBy;
      }),
      limit: criteriaToConvert.getLimit()
    };
  }

  /**
   * Request Object from query
   * @param {string} query
   */
  getDefaultValue(query) {
    const { GetDefaultValueRequest } = require('./src/grpc/proto/businessdata_pb.js');
    defaultValueInstance = new GetDefaultValueRequest();
    defaultValueInstance.setClientrequest(clientRequest);
    defaultValueInstance.setQuery(query);

    return this.getService().getDefaultValue(defaultValueInstance)
      .then(defaultValueResponse => {
        return this.convertValueFromGRPC(defaultValueResponse);
      });
  }

  /**
   * Request context info value
   * @param {string} uuid
   * @param {string} query
   */
  getContextInfoValue({ uuid, query, isConvert = true }) {
    const { GetContextInfoValueRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const requestInstance = new GetContextInfoValueRequest();
    requestInstance.setClientrequest(this.getClientRequest());
    requestInstance.setQuery(query);
    requestInstance.setUuid(uuid);

    return this.getService().getContextInfoValue(requestInstance)
      .then(contextInfoResponse => {
        if (isConvert) {
          return {
            messageText: contextInfoResponse.getMessagetext(),
            messageTip: contextInfoResponse.getMessagetip()
          };
        }
        return contextInfoResponse;
      });
  }

  convertPrivateAccess(privateAccessToConvert) {
    if (privateAccessToConvert) {
      return {
        tableName: privateAccessToConvert.getTablename(),
        recordId: privateAccessToConvert.getRecordid(),
        userUuid: privateAccessToConvert.getUseruuid()
      };
    }
    return {
      tableName: undefined,
      recordId: undefined,
      userUuid: undefined
    };
  }

  /**
   * Get Private Access
   * @param {string} tableName
   * @param {string} userUuid
   * @param {number} recordId
   * TODO: Add support with userId and recordUuid
   */
  getPrivateAccess({ tableName, recordId, userUuid, isConvert = true }) {
    const { GetPrivateAccessRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const privateAccessInstance = new GetPrivateAccessRequest();
    privateAccessInstance.setClientrequest(this.getClientRequest());
    privateAccessInstance.setTablename(tableName);
    privateAccessInstance.setRecordid(recordId);
    privateAccessInstance.setUseruuid(userUuid);

    return this.getService().getPrivateAccess(privateAccessInstance)
      .then(privateAccessResponse => {
        if (isConvert) {
          return this.convertPrivateAccess(privateAccessResponse);
        }
        return privateAccessResponse;
      });
  }

  /**
   * Lock Private Access
   * @param {string} tableName
   * @param {string} userUuid
   * @param {number} recordId
   * TODO: Add support with userId and recordUuid
   */
  lockPrivateAccess({ tableName, recordId, userUuid, isConvert = true }) {
    const { LockPrivateAccessRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const requestInstance = new LockPrivateAccessRequest();
    requestInstance.setClientrequest(this.getClientRequest());
    requestInstance.setTablename(tableName);
    requestInstance.setRecordid(recordId);
    requestInstance.setUseruuid(userUuid);

    return this.getService().lockPrivateAccess(requestInstance)
      .then(privateAccessResponse => {
        if (isConvert) {
          return this.convertPrivateAccess(privateAccessResponse);
        }
        return privateAccessResponse;
      });
  }

  /**
   * Lock Private Access
   * @param {string} tableName
   * @param {string} userUuid
   * @param {number} recordId
   * TODO: Add support with userId and recordUuid
   */
  unlockPrivateAccess({ tableName, recordId, userUuid, isConvert = true }) {
    const { UnlockPrivateAccessRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const requestInstance = new UnlockPrivateAccessRequest();

    requestInstance.setClientrequest(this.getClientRequest());
    requestInstance.setTablename(tableName);
    requestInstance.setRecordid(recordId);
    requestInstance.setUseruuid(userUuid);

    return this.getService().unlockPrivateAccess(requestInstance)
      .then(privateAccessResponse => {
        if (isConvert) {
          return this.convertPrivateAccess(privateAccessResponse);
        }
        return privateAccessResponse;
      });
  }

  /**
   * List all references from window
   * @param {string}  tableName
   * @param {string}  windowUuid
   * @param {string}  recordUuid
   * @param {number}  recordId
   */
  requestListReferences({ windowUuid, tableName, recordId, recordUuid, pageToken, pageSize, isConvert = true }) {
    const { ListReferencesRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const requestReference = new ListReferencesRequest();
    requestReference.setClientrequest(this.getClientRequest());

    requestReference.setWindowuuid(windowUuid);
    requestReference.setTablename(tableName);
    requestReference.setUuid(recordUuid);
    if (recordId !== undefined && recordId !== null) {
      requestReference.setRecordid(recordId);
    }
    requestReference.setPageToken(pageToken);
    requestReference.setPageSize(pageSize);

    return this.getService().listReferences(requestReference)
      .then(referenceResponse => {
        if (isConvert) {
          return {
            recordCount: referenceResponse.getRecordcount(),
            referencesList: referenceResponse.getReferencesList().map(referenceItem => {
              return {
                uuid: referenceItem.getUuid(),
                windowUuid: referenceItem.getWindowuuid(),
                displayName: referenceItem.getDisplayname(),
                tableName: referenceItem.getTablename(),
                whereClause: referenceItem.getWhereclause(),
                recordCount: referenceItem.getRecordcount(),
              }
            }),
            nextPageToken: referenceResponse.getNextPageToken()
          }
        }
        return referenceResponse;
      });
  }

  /**
   * Get Report Output from criteria
   * @param {string}  printFormatUuid
   * @param {string}  reportViewUuid
   * @param {boolean} isSummary
   * @param {string}  reportName
   * @param {string}  reportType
   */
  getReportOutput({ parametersList = [], tableName, printFormatUuid, reportViewUuid, isSummary, reportName, reportType, isConvert = true }) {
    const { GetReportOutputRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const reportOutputInstance = new GetReportOutputRequest();
    reportOutputInstance.setClientrequest(this.getClientRequest());
    reportOutputInstance.setPrintformatuuid(printFormatUuid);
    reportOutputInstance.setIssummary(isSummary);
    reportOutputInstance.setReporttype(reportType);
    if (reportViewUuid) {
      reportOutputInstance.setReportviewuuid(reportViewUuid);
    }
    if (reportName) {
      reportOutputInstance.setReportname(reportName);
    }

    const criteriaForReport = this.convertCriteriaToGRPC({ tableName });
    if (parametersList && parametersList.length) {
      parametersList.forEach(parameterItem => {
        let valueTo;
        let isAddCodition = true;
        if (parameterItem.isRange) {
          valueTo = parametersList.find(param => param.columnName === `${parameterItem.columnName}_To`).value;
          if (!this.isEmptyValue(valueTo)) {
            parameterItem.valueTo = valueTo;
          } else {
            isAddCodition = false;
          }
        }

        if (isAddCodition) {
          const convertedCondition = this.convertConditionToGRPC(parameterItem);
          criteriaForReport.addConditions(convertedCondition);
        }
      });
    }
    reportOutputInstance.setCriteria(criteriaForReport);

    return this.getService().getReportOutput(reportOutputInstance)
      .then(reportOutputResponse => {
        if (isConvert) {
          return this.convertReportOutput(reportOutputResponse);
        }
        return reportOutputResponse;
      });
  }

  /**
   * Request Lookup from Reference
   * @param {string} tableName
   * @param {string} directQuery
   * @param {string|number} value current value to get display column
   */
  requestLookupFromReference({ tableName, directQuery, value }) {
    const criteriaForLookup = this.convertCriteriaToGRPC({
      tableName,
      query: directQuery,
      valuesList: [ value ]
    });

    const { GetLookupItemRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const requestLookup = new GetLookupItemRequest();
    requestLookup.setClientrequest(this.getClientRequest());
    requestLookup.setCriteria(criteriaForLookup);

    return this.getService().getLookupItem(requestLookup)
      .then(lookupItemRepsonse => {
        return this.convertLookupFromGRPC(lookupItemRepsonse);
      });
  }

  convertLookupFromGRPC(lookupToConvert) {
    if (lookupToConvert) {
      return {
        id: lookupToConvert.getId(),
        uuid: lookupToConvert.getUuid(),
        tableName: lookupToConvert.getTablename(),
        values: this.convertValuesMap({
          mapToConvert: lookupToConvert.getValuesMap(),
          returnType: 'object'
        })
      };
    }
    return {
      id: undefined,
      uuid: undefined,
      tableName: undefined,
      values: undefined
    };
  }

  /**
   * Request Lookup List from Reference
   * @param {string} tableName
   * @param {string} query
   * @param {string} nextPageToken
   */
  requestListLookupFromReference({ tableName, query, pageToken, pageSize }) {
    const { ListLookupItemsRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const criteriaForLookup = this.convertCriteriaToGRPC({ tableName, query });

    const requestLookup = new ListLookupItemsRequest();
    requestLookup.setClientrequest(this.getClientRequest());
    requestLookup.setCriteria(criteriaForLookup);
    requestLookup.setPageToken(pageToken);
    requestLookup.setPageSize(pageSize);

    return this.getService().listLookupItems(requestLookup)
      .then(lookupsListRepsonse => {
        return {
          recordCount: lookupsListRepsonse.getRecordcount(),
          recordsList: lookupsListRepsonse.getRecordsList().map(lookupItem => {
            return this.convertLookupFromGRPC(lookupItem);
          }),
          nextPageToken: lookupsListRepsonse.getNextPageToken()
        };
      });
  }

  /**
   * Return value converted, compatible with grpc
   * @param {mixed} value
   * @returns {Value}
   */
  convertValueToGRPC(value) {
    const { Value } = require('./src/grpc/proto/businessdata_pb.js');
    const valueConverted = new Value();

    // evaluate type value
    if (value === undefined || value === null) {
      valueConverted.setValuetype(Value.ValueType.NULL);
    } else if (typeof(value) === 'number') {
      if (Number.isInteger(value)) {
        if (String(value).length > 11) {
          valueConverted.setLongvalue(value);
          valueConverted.setValuetype(Value.ValueType.LONG);
        } else {
          valueConverted.setIntvalue(value);
          valueConverted.setValuetype(Value.ValueType.INTEGER);
        }
      } else {
        valueConverted.setDoublevalue(value);
        valueConverted.setValuetype(Value.ValueType.DOUBLE);
      }
    } else if (typeof(value) === 'boolean') {
      valueConverted.setBooleanvalue(value);
      valueConverted.setValuetype(Value.ValueType.BOOLEAN);
    } else if (Object.prototype.toString.call(value) === '[object Date]') {
      valueConverted.setLongvalue(value.getTime());
      valueConverted.setValuetype(Value.ValueType.DATE);
    } else {
      valueConverted.setStringvalue(value);
      valueConverted.setValuetype(Value.ValueType.STRING);
    }

    return valueConverted;
  }

  /**
   * Get all values type or get key value type from value
   * @param {number} keyFind
   */
  getValueTypes(keyFind) {
    const { Value } = require('./src/grpc/proto/businessdata_pb.js');
    if (keyFind !== undefined) {
      return Object.keys(Value.ValueType).find(key => Value.ValueType[key] === keyFind);
    } else {
      return Value.ValueType;
    }
  }

  /**
   * Convert a parameter defined by columnName and value to Value Object
   * @param {string} columnName
   * @param {mixed}  value
   * @returns KeyValue Object
   */
  convertParameter({ columnName, value }) {
    const { KeyValue } = require('./src/grpc/proto/businessdata_pb.js');
    const keyValue = new KeyValue();
    keyValue.setKey(columnName);

    keyValue.setValue(
      this.convertValueToGRPC(
        value
      )
    );
    //  Return converted value
    return keyValue;
  }

  /**
   * Convert a parameter defined by columnName and value to Value Object
   * TODO: Add support to operator with parameter
   * @param {string} columnName
   * @param {mixed}  value
   * @param {mixed}  valueTo
   * @param {array}  values
   * @returns Object
   */
  convertConditionToGRPC({ columnName, value, valueTo, values = [] }) {
    const { Condition } = require('./src/grpc/proto/businessdata_pb.js');
    const conditionInstance = new Condition();

    conditionInstance.setColumnname(columnName);

    // set value and value to
    if (value !== undefined && value !== null) {
      conditionInstance.setValue(
        this.convertValueToGRPC(value)
      );
    }
    if (valueTo !== undefined && valueTo !== null) {
      conditionInstance.setValueto(
        this.convertValueToGRPC(valueTo)
      );
    }

    // set operator
    if (typeof value === 'string') {
      conditionInstance.setOperator(Condition.Operator.LIKE); // 2
    } else if (valueTo !== undefined && valueTo !== null) {
      conditionInstance.setOperator(Condition.Operator.BETWEEN) // 8
    } else {
      conditionInstance.setOperator(Condition.Operator.EQUAL); // 0
    }

    if (values && values.length) {
      conditionInstance.setOperator(Condition.Operator.IN); // 11
      values.forEach(itemValue => {
        conditionInstance.addValues(
          this.convertValueToGRPC(
            itemValue
          )
        );
      });
    }

    //  Return converted condition
    return conditionInstance;
  }

  /**
   * Get all operator or get key value type from value
   * @param {number} keyFind
   */
  getOperators(keyFind) {
    const { Condition } = require('./src/grpc/proto/businessdata_pb.js');
    if (keyFind !== undefined) {
      return Object.keys(Condition.Operator).find(key => Condition.Operator[key] === keyFind);
    } else {
      return Condition.Operator;
    }
  }

  /**
   * Convert a list of parameter defined by columnName and value to Value Object
   * @param {number} selectionId keyColumn Value
   * @param {string} selectionUuid TODO: Add support to uuid record
   * @param {array}  selectionValues [{ columName, value }]
   *
   * Return a list of KeyValue Object
   */
  convertSelection({ selectionId, selectionUuid, selectionValues = [] }) {
    const { KeyValueSelection } = require('./src/grpc/proto/businessdata_pb.js');
    const selectionInstance = new KeyValueSelection();
    // set selection id from record
    selectionInstance.setSelectionid(selectionId);
    //  Convert values to selection
    selectionValues.forEach(selectionItem => {
      const convertedSelection = this.convertParameter({
        columnName: selectionItem.columnName,
        value: selectionItem.value
      });
      selectionInstance.addValues(convertedSelection);
    });
    return selectionInstance;
  }

  /**
   * Request a process to run
   * @param {string}  uuid, uuid from process to run
   * @param {number}  tableName, table name of tab, used only window
   * @param {number}  recordId, record identifier, used only window
   * @param {string}  recordUuid, // TODO: Add record uuid
   * @param {array}   parameters, parameters from process [{ columnName, value }]
   * @param {array}   selection, selection records, used only browser
        [{
          selectionId,
          selectionValues: [{ columnName, value }]
        }]
   */
  requestRunProcess({ uuid, reportType, printFormatUuid, parametersList, tableName, recordId, recordUuid, selectionsList = [], isConvert = true }) {
    const { RunBusinessProcessRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const processRequest = new RunBusinessProcessRequest();
    processRequest.setClientrequest(this.getClientRequest());

    //  Fill Request process
    processRequest.setUuid(uuid);
    // report export type
    if (reportType) {
      processRequest.setReporttype(reportType);
    }
    if (printFormatUuid) {
      processRequest.setPrintformatuuid(printFormatUuid);
    }
    // process params
    if (parametersList && parametersList.length) {
      parametersList.forEach(parameterItem => {
        const convertedParameter = this.convertParameter({
          columnName: parameterItem.columnName,
          value: parameterItem.value
        });
        processRequest.addParameters(convertedParameter);
      });
    }

    // record in window
    if (tableName) {
      processRequest.setTablename(tableName);
      processRequest.setRecordid(recordId);
    }

    // browser selection list records
    if (selectionsList && selectionsList.length) {
      selectionsList.forEach(record => {
        // selection format = { selectionId: number, selectionValues: array }
        const convertedRecord = this.convertSelection(record);
        processRequest.addSelections(convertedRecord);
      });
    }

    return this.getService().runBusinessProcess(processRequest)
      .then(runProcessResponse => {
        if (isConvert) {
          return this.convertProcessLog(runProcessResponse);
        }
        return runProcessResponse;
      });
  }

  convertProcessLog(processLogToConvert) {
    if (processLogToConvert) {
      return {
        uuid: processLogToConvert.getUuid(),
        instanceUuid: processLogToConvert.getInstanceuuid(),
        isError: processLogToConvert.getIserror(),
        summary: processLogToConvert.getSummary(),
        resultTableName: processLogToConvert.getResulttablename(),
        isProcessing: processLogToConvert.getIsprocessing(),
        lastRun: processLogToConvert.getLastrun(),
        logsList: processLogToConvert.getLogsList().map(log => {
          return {
            recordId: log.getRecordid(),
            log: log.getLog()
          };
        }),
        parametersList: this.convertValuesMap({
          mapToConvert: processLogToConvert.getParametersMap(),
          returnType: 'object'
        }),
        output: this.convertReportOutput(processLogToConvert.getOutput())
      };
    }
    return {
      uuid: undefined,
      instanceUuid: undefined,
      isError: undefined,
      summary: undefined,
      resultTableName: undefined,
      isProcessing: undefined,
      lastRun: undefined,
      logsList: undefined,
      parametersList: undefined,
      output: undefined
    };
  }

  convertReportOutput(reportOutputToConvert) {
    if (reportOutputToConvert) {
      return {
        uuid: reportOutputToConvert.getUuid(),
        name: reportOutputToConvert.getName(),
        description: reportOutputToConvert.getDescription(),
        fileName: reportOutputToConvert.getFilename(),
        output: reportOutputToConvert.getOutput(),
        mimeType: reportOutputToConvert.getMimetype(),
        dataCols: reportOutputToConvert.getDatacols(),
        dataRows: reportOutputToConvert.getDatarows(),
        headerName: reportOutputToConvert.getHeadername(),
        footerName: reportOutputToConvert.getFootername(),
        printFormatUuid: reportOutputToConvert.getPrintformatuuid(),
        reportViewUuid: reportOutputToConvert.getReportviewuuid(),
        tableName: reportOutputToConvert.getTablename(),
        outputStream: reportOutputToConvert.getOutputstream(),
        outputStream_asB64: reportOutputToConvert.getOutputstream_asB64(),
        outputStream_asU8: reportOutputToConvert.getOutputstream_asU8(),
        reportType: reportOutputToConvert.getReporttype()
      };
    }
    return {
      uuid: undefined,
      name: undefined,
      description: undefined,
      fileName: undefined,
      output: undefined,
      mimeType: undefined,
      dataCols: undefined,
      dataRows: undefined,
      headerName: undefined,
      footerName: undefined,
      printFormatUuid: undefined,
      reportViewUuid: undefined,
      tableName: undefined,
      outputStream: undefined,
      outputStream_asB64: undefined,
      outputStream_asU8: undefined,
      reportType: undefined
    };
  }

  /**
   * Request Browser Search
   * @param {string} uuid Of browser
   * @param {array}  parametersList
   * @param {string} query
   * @param {string} whereClause
   * @param {string} orderByClause
   * @param {string} pageToken
   */
  requestListBrowserSearch({ uuid, parametersList = [], query, whereClause, orderByClause, pageToken, pageSize, isConvert = true, formatToConvert = 'object' }) {
    const { ListBrowserItemsRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const browserRequest = new ListBrowserItemsRequest();
    browserRequest.setClientrequest(this.getClientRequest());

    //  Fill Request browser
    browserRequest.setUuid(uuid);
    browserRequest.setPageToken(pageToken);
    browserRequest.setPageSize(pageSize);

    // isQueryCriteria fields parameters list
    if (parametersList && parametersList.length) {
      parametersList.forEach(parameterItem => {
        const convertedParameter = this.convertParameter({
          columnName: parameterItem.columnName,
          value: parameterItem.value
        });
        browserRequest.addParameters(convertedParameter);
      });
    }

    const browserCriteria = this.convertCriteriaToGRPC({ query, whereClause, orderByClause });
    browserRequest.setCriteria(browserCriteria);

    return this.getService().listBrowserItems(browserRequest)
      .then(browserSearchResponse => {
        if (isConvert) {
          return {
            recordCount: browserSearchResponse.getRecordcount(),
            recordsList: browserSearchResponse.getRecordsList().map(entityItem => {
              return this.convertEntity({
                entityToConvert: entityItem,
                formatToConvert
              });
            }),
            nextPageToken: browserSearchResponse.getNextPageToken()
          };
        }
        return browserSearchResponse;
      });
  }

  /**
   * Request Processes Logs List
   */
  requestListProcessesLogs({ pageToken, pageSize, isConvert = true }) {
    const { ListProcessLogsRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const request = new ListProcessLogsRequest();
    request.setClientrequest(this.getClientRequest());
    request.setPageToken(pageToken);
    request.setPageSize(pageSize);
    //  return
    return this.getService().listProcessLogs(request)
      .then(processLogsResponse => {
        if (isConvert) {
          return {
            recordCount: processLogsResponse.getRecordcount(),
            processLogsList: processLogsResponse.getProcesslogsList().map(processItem => {
              return this.convertProcessLog(processItem);
            }),
            nextPageToken: processLogsResponse.getNextPageToken()
          };
        }
        return processLogsResponse;
      });
  }

  /**
   * Request Recent Items Activity List
   */
  requestListRecentItems({ pageToken, pageSize, isConvert = true }) {
    const { ListRecentItemsRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const request = new ListRecentItemsRequest();
    request.setClientrequest(this.getClientRequest());
    request.setPageToken(pageToken);
    request.setPageSize(pageSize);
    return this.getService().listRecentItems(request)
      .then(recentItemsResponse => {
        if (isConvert) {
          return {
            recordCount: recentItemsResponse.getRecordcount(),
            recentItemsList: recentItemsResponse.getRecentitemsList().map(recentItem => {
              return {
                menuUuid: recentItem.getMenuuuid(),
                menuName: recentItem.getMenuname(),
                menuDescription: recentItem.getMenudescription(),
                windowUuid: recentItem.getWindowuuid(),
                tabUuid: recentItem.getTabuuid(),
                tableId: recentItem.getTableid(),
                recordId: recentItem.getRecordid(),
                displayName: recentItem.getDisplayname(),
                recordUuid: recentItem.getRecorduuid(),
                updated: new Date(recentItem.getUpdated()),
                referenceUuid: recentItem.getReferenceuuid(),
                action: recentItem.getAction()
              }
            }),
            nextPageToken: recentItemsResponse.getNextPageToken()
          };
        }
        return recentItemsResponse;
      });
  }

  /**
   * Request Favorites List
   * @param {string} userUuid
   */
  requestListFavorites({ userUuid, pageToken, pageSize, isConvert = true }) {
    const { ListFavoritesRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const requestInstance = new ListFavoritesRequest();
    requestInstance.setClientrequest(this.getClientRequest());
    requestInstance.setUseruuid(userUuid);
    requestInstance.setPageToken(pageToken);
    requestInstance.setPageSize(pageSize);

    return this.getService().listFavorites(requestInstance)
      .then(favoritesResponse => {
        if (isConvert) {
          return {
            recordCount: favoritesResponse.getRecordcount(),
            favoritesList: favoritesResponse.getFavoritesList().map(favoriteItem => {
              return {
                menuUuid: favoriteItem.getMenuuuid(),
                menuName: favoriteItem.getMenuname(),
                menuDescription: favoriteItem.getMenudescription(),
                referenceUuid: favoriteItem.getReferenceuuid(),
                action: favoriteItem.getAction()
              }
            }),
            nextPageToken: favoritesResponse.getNextPageToken()
          }
        }
        return favoritesResponse;
      });
  }

  /**
   * Request Dashboards List
   * @param {string} roleUuid
   */
  requestListDashboards({ roleUuid, pageToken, pageSize }) {
    const { ListDashboardsRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const request = new ListDashboardsRequest();
    request.setClientrequest(this.getClientRequest());
    request.setRoleuuid(roleUuid);
    request.setPageToken(pageToken);
    request.setPageSize(pageSize);

    return this.getService().listDashboards(request)
      .then(dashboardResponse => {
        return {
          recordCount: dashboardResponse.getRecordcount(),
          dashboardsList: dashboardResponse.getDashboardsList().map(dashboardItem => {
            return {
              windowUuid: dashboardItem.getWindowuuid(),
              browserUuid: dashboardItem.getBrowseruuid(),
              dashboardName: dashboardItem.getDashboardname(),
              dashboardDescription: dashboardItem.getDashboarddescription(),
              dashboardHtml: dashboardItem.getDashboardhtml(),
              columnNo: dashboardItem.getColumnno(),
              lineNo: dashboardItem.getLineno(),
              isCollapsible: dashboardItem.getIscollapsible(),
              isOpenByDefault: dashboardItem.getIsopenbydefault(),
              isEventRequired: dashboardItem.getIseventrequired(),
              fileName: dashboardItem.getFilename()
            };
          }),
          nextPageToken: dashboardResponse.getNextPageToken()
        };
      });
  }

  /**
   * Get languages flagged as System Language or Base Language
   */
  requestListLanguages({ pageToken, pageSize }) {
    const { ListLanguagesRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const request = new ListLanguagesRequest();

    request.setClientrequest(this.getClientRequest());
    request.setPageToken(pageToken);
    request.setPageSize(pageSize);

    return this.getService().listLanguages(request)
      .then(languageResponse => {
        return {
          recordCount: languageResponse.getRecordcount(),
          languagesList: languageResponse.getLanguagesList().map(languageItem => {
            return {
              language: languageItem.getLanguage(),
              languageName: languageItem.getLanguagename(),
              languageISO: languageItem.getLanguageiso(),
              countryCode: languageItem.getCountrycode(),
              isBaseLanguage: languageItem.getIsbaselanguage(),
              isSystemLanguage: languageItem.getIssystemlanguage(),
              isDecimalPoint: languageItem.getIsdecimalpoint(),
              datePattern: languageItem.getDatepattern(),
              timePattern: languageItem.getTimepattern()
            };
          }),
          nextPageToken: languageResponse.getNextPageToken()
        };
      });
  }

  // Get languages flagged as System Language or Base Language
  requestTranslations({
    tableName,
    recordUuid,
    recordId,
    language,
    pageToken,
    pageSize
  }) {
    const { ListTranslationsRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const request = new ListTranslationsRequest();

    request.setClientrequest(this.getClientRequest());
    request.setPageToken(pageToken);
    request.setPageSize(pageSize);
    //  Set values
    request.setTablename(tableName);
    request.setRecorduuid(recordUuid);
    request.setRecordid(recordId);
    request.setLanguage(language);

    return this.getService().listTranslations(request)
      .then(translationResponse => {
        return {
          recordCount: translationResponse.getRecordcount(),
          translationsList: translationResponse.getTranslationsList().map(translationItem => {
            return {
              language: translationItem.getLanguage(),
              translationUuid: translationItem.getTranslationuuid(),
              values: this.convertValuesMap({
                mapToConvert: translationItem.getValuesMap(),
                returnType: 'object'
              }),
            };
          }),
          nextPageToken: translationResponse.getNextPageToken()
        };
      });
  }

  /**
   * Request Print Formats List
   * @param {string} tableName
   * @param {string} reportViewUuid
   * @param {string} processUuid
   */
  requestListPrintFormats({ tableName, reportViewUuid, processUuid, pageToken, pageSize, isConvert = true }) {
    const { ListPrintFormatsRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const requestInstance = new ListPrintFormatsRequest();
    requestInstance.setClientrequest(this.getClientRequest());
    requestInstance.setTablename(tableName);
    requestInstance.setReportviewuuid(reportViewUuid);
    requestInstance.setProcessuuid(processUuid);
    requestInstance.setPageToken(pageToken);
    requestInstance.setPageSize(pageSize);

    return this.getService().listPrintFormats(requestInstance)
      .then(printFormatResponse => {
        if (isConvert) {
          return {
            recordCount: printFormatResponse.getRecordcount(),
            printFormatsList: printFormatResponse.getPrintformatsList().map(printFormatItem => {
              return {
                uuid: printFormatItem.getUuid(),
                name: printFormatItem.getName(),
                description: printFormatItem.getDescription(),
                tableName: printFormatItem.getTablename(),
                isDefault: printFormatItem.getIsdefault(),
                reportViewUuid: printFormatItem.getReportviewuuid()
              }
            }),
            nextPageToken: printFormatResponse.getNextPageToken()
          };
        }
        return printFormatResponse;
      });
  }

  /**
   * Request Report Views List
   * @param {string}  tableName
   * @param {string}  processUuid
   * @param {boolean} isConvert, default value is true
   */
  requestListReportViews({ tableName, processUuid, pageToken, pageSize, isConvert = true }) {
    const { ListReportViewsRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const requestInstance = new ListReportViewsRequest();
    requestInstance.setClientrequest(this.getClientRequest());
    requestInstance.setTablename(tableName);
    requestInstance.setProcessuuid(processUuid);
    requestInstance.setPageToken(pageToken);
    requestInstance.setPageSize(pageSize);

    return this.getService().listReportViews(requestInstance)
      .then(reportViewsResponse => {
        if (isConvert) {
          return {
            recordCount: reportViewsResponse.getRecordcount(),
            reportViewsList: reportViewsResponse.getReportviewsList().map(reportViewItem => {
              return {
                uuid: reportViewItem.getUuid(),
                name: reportViewItem.getName(),
                description: reportViewItem.getDescription(),
                tableName: reportViewItem.getTablename()
              }
            }),
            nextPageToken: reportViewsResponse.getNextPageToken()
          };
        }
        return reportViewsResponse;
      });
  }

  /**
   * Request Favorites List
   * @param {string} tableName
   */
  requestListDrillTables({ tableName, pageToken, pageSize }) {
    const { ListDrillTablesRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const requestInstance = new ListDrillTablesRequest();
    requestInstance.setClientrequest(this.getClientRequest());
    requestInstance.setTablename(tableName);
    requestInstance.setPageToken(pageToken);
    requestInstance.setPageSize(pageSize);

    return this.getService().listDrillTables(requestInstance)
      .then(drillTableResponse => {
        return {
          recordCount: drillTableResponse.getRecordcount(),
          drillTablesList: drillTableResponse.getDrilltablesList().map(itemDrillTable => {
            return {
              tableName: itemDrillTable.getTablename(),
              printName: itemDrillTable.getPrintname()
            }
          }),
          nextPageToken: drillTableResponse.getNextPageToken()
        }
      });
  }

  /**
   * Request Pending Documents List
   * @param {string} userUuid
   * @param {string} roleUuid
   */
  requestListPendingDocuments({ userUuid, roleUuid, pageToken, pageSize, isConvert = true }) {
    const { ListPendingDocumentsRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const requestInstance = new ListPendingDocumentsRequest();
    requestInstance.setClientrequest(this.getClientRequest());
    requestInstance.setUseruuid(userUuid);
    requestInstance.setRoleuuid(roleUuid);
    requestInstance.setPageToken(pageToken);
    requestInstance.setPageSize(pageSize);

    return this.getService().listPendingDocuments(requestInstance)
      .then(pendingDocumentsResponse => {
        if (isConvert) {
          return {
            recordCount: pendingDocumentsResponse.getRecordcount(),
            pendingDocumentsList: pendingDocumentsResponse.getPendingdocumentsList().map(document => {
              return {
                windowUuid: document.getWindowuuid(),
                formUuid: document.getFormuuid(),
                documentName: document.getDocumentname(),
                documentDescription: document.getDocumentdescription(),
                sequence: document.getSequence(),
                recordCount: document.getRecordcount(),
                criteria: this.convertCriteriaFromGRPC(
                  document.getCriteria()
                )
              }
            }),
            nextPageToken: pendingDocumentsResponse.getNextPageToken()
          };
        }

        return pendingDocumentsResponse;
      });
  }

  /**
   * Run callout request
   * @param {string}  windowUuid
   * @param {string}  tabUuid
   * @param {string}  tableName
   * @param {string}  columnName
   * @param {mixed}   value
   * @param {string}  callout
   * @param {array}   attributesList
   * @returns {Entity}
   */
  runCalloutRequest({ windowUuid, windowNo, tabUuid, tableName, columnName, value, oldValue, callout, attributesList = [], isConvert = true }) {
    const { RunCalloutRequest } = require('./src/grpc/proto/businessdata_pb.js');

    const calloutRequestInstance = new RunCalloutRequest();
    calloutRequestInstance.setClientrequest(this.getClientRequest());
    calloutRequestInstance.setWindowuuid(windowUuid);
    calloutRequestInstance.setWindowno(windowNo);
    calloutRequestInstance.setTabuuid(tabUuid);
    calloutRequestInstance.setTablename(tableName);
    calloutRequestInstance.setColumnname(columnName);
    calloutRequestInstance.setValue(
      this.convertValueToGRPC(
        value
      )
    );
    calloutRequestInstance.setOldvalue(
      this.convertValueToGRPC(
        oldValue
      )
    );
    calloutRequestInstance.setCallout(callout);

    if (attributesList.length) {
      attributesList.forEach(attribute => {
        const convertedAttribute = this.convertParameter({
          columnName: attribute.columnName,
          value: attribute.value
        });
        calloutRequestInstance.addAttributes(convertedAttribute);
      });
    }

    return this.getService().runCallout(calloutRequestInstance)
      .then(calloutResponse => {
        if (isConvert) {
          return {
            result: calloutResponse.getResult(),
            values: this.convertValuesMap({
              mapToConvert: calloutResponse.getValuesMap(),
              returnType: 'object'
            })
          };
        }
        return calloutResponse;
      });
  }

  /**
   * Get all event type or get key value type from value
   * @param {number} keyFind
   */
  getEventTypeRecordLog(keyFind) {
    const { RecordLog } = require('./src/grpc/proto/businessdata_pb.js');
    if (keyFind !== undefined) {
      return Object.keys(RecordLog.EventType).find(key => RecordLog.EventType[key] === keyFind);
    }
    return RecordLog.EventType;
  }

  convertRecordLog(recordLogToConvert) {
    if (recordLogToConvert) {
      return {
        logUuid: recordLogToConvert.getLoguuid(),
        recordId: recordLogToConvert.getRecordid(),
        tableName: recordLogToConvert.getTablename(),
        columnName: recordLogToConvert.getColumnname(),
        displayColumnName: recordLogToConvert.getDisplaycolumnname(),
        sessionUuid: recordLogToConvert.getSessionuuid(),
        userUuid: recordLogToConvert.getUseruuid(),
        userName: recordLogToConvert.getUsername(),
        transactionName: recordLogToConvert.getTransactionname(),
        oldValue: this.convertValueFromGRPC(recordLogToConvert.getOldvalue()),
        newValue: this.convertValueFromGRPC(recordLogToConvert.getNewvalue()),
        oldDisplayValue: recordLogToConvert.getOlddisplayvalue(),
        newDisplayValue: recordLogToConvert.getNewdisplayvalue(),
        description: recordLogToConvert.getDescription(),
        eventType: recordLogToConvert.getEventType(),
        eventTypeName: this.getEventTypeRecordLog(recordLogToConvert.getEventType()),
        logDate: recordLogToConvert.getLogdate()
      }
    }
    return {
      logUuid: undefined,
      recordId: undefined,
      tableName: undefined,
      columnName: undefined,
      displayColumnName: undefined,
      sessionUuid: undefined,
      userUuid: undefined,
      userName: undefined,
      transactionName: undefined,
      oldValue: undefined,
      oldDisplayValue: undefined,
      newValue: undefined,
      newDisplayValue: undefined,
      description: undefined,
      eventType: undefined,
      logDate: undefined
    }
  }

  /**
   * Request Records Logs List
   */
  requestListRecordsLogs({ tableName, recordId, pageToken, pageSize, isConvert = true }) {
    const { ListRecordLogsRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const request = new ListRecordLogsRequest();

    request.setClientrequest(this.getClientRequest());
    request.setTablename(tableName);
    request.setRecordid(recordId);
    request.setPageToken(pageToken);
    request.setPageSize(pageSize);

    //  return
    return this.getService().listProcessLogs(request)
      .then(recordLogsResponse => {
        if (isConvert) {
          return {
            recordCount: recordLogsResponse.getRecordcount(),
            recordLogsList: recordLogsResponse.getRecordlogsList().map(recordItem => {
              return this.convertRecordLog(recordItem);
            }),
            nextPageToken: recordLogsResponse.getNextPageToken()
          };
        }
        return recordLogsResponse;
      });
  }

   /**
   * Get all workflow state or get key value type from value
   * @param {number} keyFind
        RUNNING: 0,
        COMPLETED: 1,
        ABORTED: 2,
        TERMINATED: 3,
        SUSPENDED: 4,
        NOT_STARTED: 5,
   */
  getWorkflowState(keyFind) {
    const { WorkflowProcess } = require('./src/grpc/proto/businessdata_pb.js');
    if (keyFind !== undefined) {
      return Object.keys(WorkflowProcess.WorkflowState).find(key => WorkflowProcess.WorkflowState[key] === keyFind);
    }
    return WorkflowProcess.WorkflowState;
  }

  /**
   * Get all workflow priority or get key value type from value
   * @param {number} keyFind
        URGENT: 0,
        HIGH: 1,
        MEDIUM: 2,
        LOW: 3,
        MINOR: 4,
   */
  getWorkflowPriority(keyFind) {
    const { WorkflowProcess } = require('./src/grpc/proto/businessdata_pb.js');
    if (keyFind !== undefined) {
      return Object.keys(WorkflowProcess.Priority).find(key => WorkflowProcess.Priority[key] === keyFind);
    }
    return WorkflowProcess.Priority;
  }

  /**
   * Get all workflow event type or get key value type from value
   * @param {number} keyFind
        PROCESS_CREATED = 0;
        PROCESS_COMPLETED = 1;
        STATE_CHANGED = 2;
   */
  getWorkflowEventType(keyFind) {
    const { WorkflowEvent } = require('./src/grpc/proto/businessdata_pb.js');
    if (keyFind !== undefined) {
      return Object.keys(WorkflowEvent.EventType).find(key => WorkflowEvent.EventType[key] === keyFind);
    }
    return WorkflowEvent.EventType;
  }

  convertWorkflowProcess(workflowProcessToConvert) {
    if (workflowProcessToConvert) {
      return {
        processUuid: workflowProcessToConvert.getProcessuuid(),
        workflowUuid: workflowProcessToConvert.getWorkflowuuid(),
        workflowName: workflowProcessToConvert.getWorkflowname(),
        recordId: workflowProcessToConvert.getRecordid(),
        tableName: workflowProcessToConvert.getTablename(),
        userUuid: workflowProcessToConvert.getUseruuid(),
        userName: workflowProcessToConvert.getUsername(),
        responsibleUuid: workflowProcessToConvert.getResponsibleuuid(),
        responsibleName: workflowProcessToConvert.getResponsiblename(),
        message: workflowProcessToConvert.getMessage(),
        textMessage: workflowProcessToConvert.getTextmessage(),
        processed: workflowProcessToConvert.getProcessed(),
        workflowState: workflowProcessToConvert.getWorkflowstate(),
        workflowStateName: this.getWorkflowState(workflowProcessToConvert.getWorkflowstate()),
        priority: workflowProcessToConvert.getPriority(),
        priorityName: this.getWorkflowPriority(workflowProcessToConvert.getPriority()),
        workflowEventsList: workflowProcessToConvert.getWorkfloweventsList().map(itemEvent => {
          return this.convertWorkflowEvent(itemEvent);
        }),
        logDate: workflowProcessToConvert.getLongdate()
      }
    }
    return {
      processUuid: undefined,
      workflowUuid: undefined,
      workflowName: undefined,
      recordId: undefined,
      tableName: undefined,
      userUuid: undefined,
      userName: undefined,
      responsibleUuid: undefined,
      responsibleName: undefined,
      message: undefined,
      textMessage: undefined,
      processed: undefined,
      workflowState: undefined,
      workflowStateName: undefined,
      priority: undefined,
      priorityName: undefined,
      workflowEventsList: undefined,
      logDate: undefined
    }
  }

  convertWorkflowEvent(workflowEventToConvert) {
    if (workflowEventToConvert) {
      return {
        workflowUuid: workflowEventToConvert.getWorkflowuuid(),
        workflowName: workflowEventToConvert.getWorkflowname(),
        nodeUuid: workflowEventToConvert.getNodeuuid(),
        nodeName: workflowEventToConvert.getNodename(),
        recordId: workflowEventToConvert.getRecordid(),
        tableName: workflowEventToConvert.getTablename(),
        userUuid: workflowEventToConvert.getUseruuid(),
        userName: workflowEventToConvert.getUsername(),
        responsibleUuid: workflowEventToConvert.getResponsibleuuid(),
        responsibleName: workflowEventToConvert.getResulttablename(),
        textMessage: workflowEventToConvert.getTextmessage(),
        timeElapsed: workflowEventToConvert.getTimeelapsed(),
        attributeName: workflowEventToConvert.getAttributename(),
        oldValue: this.convertValueFromGRPC(workflowEventToConvert.getOldvalue()),
        newValue: this.convertValueFromGRPC(workflowEventToConvert.getNewvalue()),
        workflowState: workflowEventToConvert.getWorkflowstate(),
        workflowStateName: this.getWorkflowState(workflowEventToConvert.getWorkflowState()),
        eventType: workflowEventToConvert.getEventType(),
        eventTypeName: this.getWorkflowEventType(workflowEventToConvert.getWorkfloweventtype()),
        logDate: workflowEventToConvert.getLongdate()
      }
    }

    return {
      workflowUuid: undefined,
      workflowName: undefined,
      nodeUuid: undefined,
      nodeName: undefined,
      recordId: undefined,
      tableName: undefined,
      userUuid: undefined,
      userName: undefined,
      responsibleUuid: undefined,
      responsibleName: undefined,
      textMessage: undefined,
      timeElapsed: undefined,
      attributeName: undefined,
      oldValue: undefined,
      newValue: undefined,
      workflowState: undefined,
      eventType: undefined,
      logDate: undefined
    }
  }

  /**
   * Request Workflows Logs List
   */
  requestListWorkflowsLogs({ tableName, recordId, pageToken, pageSize, isConvert = true }) {
    const { ListWorkflowLogsRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const request = new ListWorkflowLogsRequest();

    request.setClientrequest(this.getClientRequest());
    request.setTablename(tableName);
    request.setRecordid(recordId);
    request.setPageToken(pageToken);
    request.setPageSize(pageSize);

    //  return
    return this.getService().listWorkflowLogs(request)
      .then(workflowLogsResponse => {
        if (isConvert) {
          return {
            recordCount: workflowLogsResponse.getRecordcount(),
            workflowLogsList: workflowLogsResponse.getWorkflowLogsList().map(workflowItem => {
              return this.convertWorkflowProcess(workflowItem);
            }),
            nextPageToken: workflowLogsResponse.getNextPageToken()
          };
        }
        return workflowLogsResponse;
      });
  }

}

module.exports = BusinessData;
