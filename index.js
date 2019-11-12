/*************************************************************************************
 * Product: ADempiere gRPC Dictionary Client                       		               *
 * Copyright (C) 2012-2018 E.R.P. Consultores y Asociados, C.A.                      *
 * Contributor(s): Yamel Senih ysenih@erpya.com				  		                         *
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
    var requestService = new BusinessDataServicePromiseClient(this.host);
    grpc_promise.promisifyAll(requestService);
    //  Return request for get data
    return requestService;
  }

  /**
   * Get or request a Entity data from tableName and uuid
   * @param {GetEntityRequest} Entity request for create
   * @return {Entity} Entity with records.
   */
  getEntity(getEntityRequest) {
    return this.getService().getEntity(getEntityRequest);
  }

  /**
   * delete a Entity from delete entity request
   * @param {DeleteEntityRequest} request for delete a entity
   * @return {Empty} empty for deleted and throw for error.
   */
  deleteEntity(deleteEntityRequest) {
    return this.getService().deleteEntity(deleteEntityRequest);
  }

  /**
  * Create a entity from CreateEntityRequest object
  * @param {CreateEntityRequest} Entity Request for create
  * @return {Entity} Entity created.
  */
  createEntity(createEntityRequest) {
    return this.getService().createEntity(createEntityRequest);
  }

  /**
  * Create a entity from UpdateEntityRequest object
  * @param {UpdateEntityRequest} Entity Request for update
  * @return {Entity} Entity updated.
  */
  updateEntity(updateEntityRequest) {
    return this.getService().updateEntity(updateEntityRequest);
  }

  /**
  * Request Object from Criteria
  */
  requestObjectFromCriteria(criteria) {
    return this.getService().getEntity(this.getRequestEntityFromCriteria(criteria));
  }

  /**
  * Request Object from Criteria
  */
  getDefaultValue(criteria) {
    return this.getService().getDefaultValue(this.getDefaultValueRequestFromCriteria(criteria));
  }

  //  List all references from window
  listReferencesRequest(request) {
    return this.getService().listReferences(request);
  }

  /**
  * Request Object List from Criteria
  */
 requestObjectListFromCriteria(criteria, pageToken = false) {
    return this.getService().listEntities(this.getRequestEntityListFromCriteria(criteria, pageToken));
  }

  /**
  * Request Lookup from Reference
  */
  requestLookupFromReference(reference, fieldValue) {
    var criteria = this.getCriteria(reference.tableName)
    criteria.setQuery(reference.directQuery)
    //  Add value
    const { Value } = require('./src/grpc/proto/businessdata_pb.js');
    var value = new Value();
    if(typeof(fieldValue) === 'number') {
      value.setIntvalue(fieldValue)
      value.setValuetype(Value.ValueType.INTEGER)
    } else {
      value.setStringvalue(fieldValue)
      value.setValuetype(Value.ValueType.STRING)
    }
    criteria.addValues(value)
    return this.getService().getLookupItem(this.getListLookupItemsRequestCriteria(criteria));
  }

  /**
   * Return value converted, compatible with grpc
   * @param {mixed} value
   */
  convertValueToGRPC(value) {
    const { Value } = require('./src/grpc/proto/businessdata_pb.js');
    var valueConverted = new Value();

    // evaluate type value
    if (value === undefined || value === null) {
      valueConverted.setValuetype(Value.ValueType.NULL);
    } else if(typeof(value) === 'number') {
      if (Number.isInteger(value)) {
        if(String(value).length > 11) {
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
    } else if(typeof(value) === 'boolean') {
      valueConverted.setBooleanvalue(value);
      valueConverted.setValuetype(Value.ValueType.BOOLEAN);
    } else if(Object.prototype.toString.call(value) === '[object Date]') {
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
   * @param {integer} keyFind
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
   * Convert a parameter defined by columnName and value to Value Object
   * @param {string} parameter.columnName
   * @param {mixed}  parameter.value
   * parameter {
   *   columnName,
   *   value
   * }
   * @returns KeyValue Object
   */
  convertParameter(parameter) {
    const { KeyValue } = require('./src/grpc/proto/businessdata_pb.js');
    var keyValue = new KeyValue();
    keyValue.setKey(parameter.columnName);

    keyValue.setValue(
      this.convertValueToGRPC(
        parameter.value
      )
    );
    //  Return converted value
    return keyValue;
  }

  /**
   * Convert a parameter defined by columnName and value to Value Object
   * TODO: Add support to operator with parameter
   * @param {string} conditionParameters.columnName
   * @param {mixed}  conditionParameters.value
   * @param {mixed}  conditionParameters.valueTo
   * @param {array}  conditionParameters.values
   * @returns Object
   */
  convertCondition(conditionParameters) {
    const { Condition } = require('./src/grpc/proto/businessdata_pb.js');
    var conditionInstance = new Condition();

    conditionInstance.setColumnname(conditionParameters.columnName);

    // set value and value to
    if (conditionParameters.hasOwnProperty('value')) {
      conditionInstance.setValue(
        this.convertValueToGRPC(
          conditionParameters.value
        )
      );
    }
    if (conditionParameters.hasOwnProperty('valueTo')) {
      conditionInstance.setValueto(
        this.convertValueToGRPC(
          conditionParameters.valueTo
        )
      );
    }

    // set operator
    if (typeof conditionParameters.value === 'string') {
      conditionInstance.setOperator(Condition.Operator.LIKE); // 2
    } else {
      conditionInstance.setOperator(Condition.Operator.EQUAL); // 0
    }

    if (conditionParameters.values && conditionParameters.values.length) {
      conditionInstance.setOperator(Condition.Operator.IN); // 11
      conditionParameters.values.forEach(itemValue => {
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
   * @param {integer} keyFind
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
   *
   * [
   *   {
   *    selectionId: keyColumn Value,
   *    selectionValues: [
   *      { columname, value },
   *      { columname, value },
   *      { columname, value }
   *    ]
   *  },
   *  {
   *    selectionId: keyColumn Value,
   *    selectionValues: [
   *      { columname, value },
   *      { columname, value }
   *    ]
   *  }
   * ]
   *
   * Return a list of KeyValue Object
   */
  convertSelection(record) {
    const { KeyValueSelection } = require('./src/grpc/proto/businessdata_pb.js');
    var selection = new KeyValueSelection();
    // set selection id from record
    selection.setSelectionid(record.selectionId);
    //  Convert values to selection
    record.selectionValues.forEach(columnValue => {
      selection.addValues(this.convertParameter(columnValue));
    });
    return selection;
  }

  /**
  * Request Lookup List from Reference
  */
  requestLookupListFromReference(reference) {
    var criteria = this.getCriteria(reference.tableName)
    criteria.setQuery(reference.query)
    return this.getService().listLookupItems(this.getListLookupItemsRequestCriteria(criteria));
  }

  /**
  * Request Process
  */
  requestProcess(runBusinessProcessRequest) {
    return this.getService().runBusinessProcess(runBusinessProcessRequest);
  }

  /**
  * Request Browser
  */
  requestBrowser(listBrowserItemsRequest) {
    return this.getService().listBrowserItems(listBrowserItemsRequest);
  }

  /**
  * Rollback last Entity operation
  */
  rollbackEntityRequest(rollbackEntityRequest) {
    return this.getService().rollbackEntity(rollbackEntityRequest);
  }

  /**
   * Get Client Request
   * @param {string} tableName, Table name from request
   * @param {string} uuid, Universally Unique IDentifier from record
   * @return {object} Return request for get data
   */
  getEntityRequest(tableName, uuid) {
    const { ClientRequest, GetEntityRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new GetEntityRequest();
    request.setUuid(uuid);
    request.setClientrequest(clientRequest);
    request.setCriteria(this.getCriteria(tableName));
    //  return
    return request;
  }

  /**
   * Get Client Request
   * @param {string} criteria
   * @return {object} request for get data
   */
  getRequestEntityFromCriteria(criteria) {
    const { ClientRequest, GetEntityRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new GetEntityRequest();
    request.setClientrequest(clientRequest);
    request.setCriteria(criteria);
    //  return
    return request;
  }

  /**
   * Get Client Request
   * @param {string} criteria
   * @return {object} request for get data
   */
  getDefaultValueRequestFromCriteria(criteria) {
    const { ClientRequest, GetDefaultValueRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new GetDefaultValueRequest();
    request.setClientrequest(clientRequest);
    request.setCriteria(criteria);
    //  return
    return request;
  }

  /**
   * Get Entity List Request
   * @param {Criteria} criteria
   * @param {string}  pageToken, Token from request next page list
   * @return {ListEntitiesRequest} Return request for get data
   */
  getRequestEntityListFromCriteria(criteria, pageToken) {
    const { ClientRequest, ListEntitiesRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new ListEntitiesRequest();
    request.setClientrequest(clientRequest);
    request.setCriteria(criteria);

    if (pageToken) {
      request.setPageToken(pageToken);
    }
    //  return
    return request;
  }

  /**
   * Get List
   * @param {string} criteria
   * @return {object} Return request for get data
   */
  getListLookupItemsRequestCriteria(criteria) {
    const { ClientRequest, ListLookupItemsRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new ListLookupItemsRequest();
    request.setClientrequest(clientRequest);
    request.setCriteria(criteria);
    //  return
    return request;
  }

  // Get Process request from
  getProcessRequest() {
    const { RunBusinessProcessRequest, ClientRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new RunBusinessProcessRequest();
    request.setClientrequest(clientRequest);
    //  return
    return request;
  }

  // Get Process request from
  getProcessActivityRequest() {
    const { ListActivitiesRequest, ClientRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new ListActivitiesRequest();
    request.setClientrequest(clientRequest);
    //  return
    return request;
  }

  // Get Rollback Entity Request
  getRollbackEntityRequest() {
    const { RollbackEntityRequest, ClientRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new RollbackEntityRequest();
    request.setClientrequest(clientRequest);
    //  return
    return request;
  }

  /**
   * Get all event type or get key value type from value
   * @param {integer} keyFind
   */
  getEventType(keyFind) {
    const { RollbackEntityRequest } = require('./src/grpc/proto/businessdata_pb.js');
    if (keyFind !== undefined) {
      return Object.keys(RollbackEntityRequest.EventType).find(key => RollbackEntityRequest.EventType[key] === keyFind);
    } else {
      return RollbackEntityRequest.EventType;
    }
  }

  /**
  * Request Process Activity List
  */
  requestProcessActivity() {
    return this.getService().listActivities(
      this.getProcessActivityRequest()
    );
  }

  // Get Browser request from
  getBrowserRequest() {
    const { ListBrowserItemsRequest, ClientRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new ListBrowserItemsRequest();
    request.setClientrequest(clientRequest);
    //  return
    return request;
  }

  // Get Create entity request
  getCreateEntityRequest() {
    const { CreateEntityRequest, ClientRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new CreateEntityRequest();
    request.setClientrequest(clientRequest);
    //  return
    return request;
  }

  // Get Update entity request
  getUpdateEntityRequest() {
    const { UpdateEntityRequest, ClientRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new UpdateEntityRequest();
    request.setClientrequest(clientRequest);
    //  return
    return request;
  }

  // Get Delete entity request
  getDeleteEntityRequest() {
    const { DeleteEntityRequest, ClientRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new DeleteEntityRequest();
    request.setClientrequest(clientRequest);
    //  return
    return request;
  }

  // Get Recent Item request from
  getRecentItemRequest() {
    const { ListRecentItemsRequest, ClientRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new ListRecentItemsRequest();
    request.setClientrequest(clientRequest);
    //  return
    return request;
  }

  // Get references request from
  getReferencesRequest() {
    const { ListReferencesRequest, ClientRequest } = require('./src/grpc/proto/businessdata_pb.js');
    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);
    let request = new ListReferencesRequest();
    request.setClientrequest(clientRequest);
    //  return
    return request;
  }

  /**
  * Request Recent Items Activity List
  */
  requestRecentItems() {
    return this.getService().listRecentItems(
      this.getRecentItemRequest()
    );
  }

  /**
   * Get Criteria from Table Name
   * @return {string} criteria
   */
  getCriteria(tableName) {
    const { Criteria } = require('./src/grpc/proto/businessdata_pb.js');
    let criteria = new Criteria();
    if(tableName) {
      criteria.setTablename(tableName);
    }
    //  Return criteria
    return criteria;
  }

  /**
   * Run callout request
   * @param {string} calloutParameters.windowUuid
   * @param {string} calloutParameters.tabUuid
   * @param {string} calloutParameters.tableName
   * @param {string} calloutParameters.columnName
   * @param {mixed}  calloutParameters.value
   * @param {string} calloutParameters.callout
   * @param {array}  calloutParameters.attributesList
   */
  runCalloutRequest(calloutParameters) {
    const { ClientRequest, RunCalloutRequest } = require('./src/grpc/proto/businessdata_pb.js');
    const { windowUuid, windowNo, tabUuid, tableName, columnName, value, oldValue, callout, attributesList = [] } = calloutParameters;

    let clientRequest = new ClientRequest();
    clientRequest.setSessionuuid(this.sessionUuid);
    clientRequest.setLanguage(this.language);

    let calloutRequestInstance = new RunCalloutRequest();
    calloutRequestInstance.setClientrequest(clientRequest);
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
        const convertedAttribute = this.convertParameter(attribute);
        calloutRequestInstance.addAttributes(convertedAttribute);
      });
    }

    return this.getService().runCallout(calloutRequestInstance);
  }

}

module.exports = BusinessData;
