/*************************************************************************************
 * Product: ADempiere gRPC Business Data Client Convert Utils                        *
 * Copyright (C) 2012-2020 E.R.P. Consultores y Asociados, C.A.                      *
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com                      *
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

const convertUtils = {

    /**
     * convert the value obtained from gRPC according to the type of value
     * @param {object} value
     * @returns {mixed}
     */
    convertValueFromGRPC(value) {
      const { Value } = require('./grpc/proto/businessdata_pb.js');

      if (value === undefined || value === null) {
        return undefined;
      }

      var returnValue;
      switch (value.getValuetype()) {
        case Value.ValueType.INTEGER:
          returnValue = convertUtils.getIntegerFromValue(value);
          break;
        // data type Number (float)
        case Value.ValueType.DECIMAL:
          returnValue = convertUtils.getDecimalFromValue(value);
          break;
        // data type Boolean
        case Value.ValueType.BOOLEAN:
          returnValue = convertUtils.getBooleanFromValue(value);
          break;
        // data type String
        case Value.ValueType.STRING:
          returnValue = convertUtils.getStringFromValue(value);
          break;
        // data type Date
        case Value.ValueType.DATE:
          returnValue = convertUtils.getDateFromValue(value);
          break;
      }
      return returnValue;
    },

    /**
  	 * Get Decimal from Value
  	 * @param value
  	 * @return
  	 */
  	getDecimalFromValue(value) {
      var decimalValue = value.getDecimalvalue();
      if (!decimalValue) {
  			return undefined;
  		}
      //  Convert it
      return Number(decimalValue.getDecimalvalue());
  	},
    /**
  	 * Get Date from a value
  	 * @param value value to convert
  	 * @return
  	 */
  	getDateFromValue(value) {
      if (!value || value.getLongvalue() === 0) {
  			return undefined;
  		}
  		if(value.getLongvalue() > 0) {
        return new Date(value.getLongvalue());
  		}
  	},

  	/**
  	 * Get String from a value
  	 * @param value
  	 * @param uppercase
  	 * @return
  	 */
  	getStringFromValue(value, uppercase) {
  		var stringValue = value.getStringvalue();
  		if (!value) {
  			return undefined;
  		}
  		//	To Upper case
  		if(uppercase) {
  			stringValue = stringValue.toUpperCase();
  		}
  		return stringValue;
  	},

  	/**
  	 * Get integer from a value
  	 * @param value
  	 * @return
  	 */
  	getIntegerFromValue(value) {
      if (value === undefined || value === null) {
  			return undefined;
  		}
  		return value.getIntvalue();
  	},

  	/**
  	 * Get Boolean from a value
  	 * @param value
  	 * @return
  	 */
  	getBooleanFromValue(value) {
      if (!value) {
  			return false;
  		}
  		return value.getBooleanvalue();
  	},

    /**
     * Get value from Integer
     * @param value
     * @return
     */
    getValueFromInteger(value) {
      const { Value } = require('./grpc/proto/businessdata_pb.js');
      var convertedValue = new Value();
      convertedValue.setValuetype(Value.ValueType.INTEGER);
      if (value !== undefined && value !== null) {
        if (String(value).length < 11) {
          convertedValue.setIntvalue(value);
        } else {
          convertedValue = convertUtils.getValueFromDecimal(value);
        }
  		}
      return convertedValue;
    },

    /**
     * Get value from a string
     * @param value
     * @return
     */
    getValueFromString(value) {
      const { Value } = require('./grpc/proto/businessdata_pb.js');
      var convertedValue = new Value
      convertedValue.setValuetype(Value.ValueType.STRING);
      if (value) {
        convertedValue.setStringvalue(String(value));
      }
      return convertedValue;
    },

    /**
     * Get value from a boolean value
     * @param value
     * @return
     */
    getValueFromBoolean(value) {
      const { Value } = require('./grpc/proto/businessdata_pb.js');
      var convertedValue = new Value();
      convertedValue.setValuetype(Value.ValueType.BOOLEAN);
      if (typeof value === 'string') {
        if (value.trim() === 'Y') {
          value = false;
        } else {
          value = true;
        }
      }
      convertedValue.setBooleanvalue(Boolean(value));
      return convertedValue;
    },

    /**
     * Get value from a date
     * @param value
     * @return
     */
    getValueFromDate(value) {
      const { Value } = require('./grpc/proto/businessdata_pb.js');
      var convertedValue = new Value();
      if (Object.prototype.toString.call(value) === '[object Date]') {
        value = value.getTime();
        convertedValue.setLongvalue(value);
      }
      convertedValue.setValuetype(Value.ValueType.DATE);
      return convertedValue;
    },

    /**
     * Get value from big decimal
     * @param value
     * @return
     */
    getValueFromDecimal(value) {
      const { Value } = require('./grpc/proto/businessdata_pb.js');
      var convertedValue = new Value();
      var convertedDecimalValue = convertUtils.getDecimalInstance();
      if(value !== undefined && value !== null) {
        if (Number.isInteger(value)) {
          value = value.toFixed(2);
        }
        convertedDecimalValue.setDecimalvalue(value.toString());
        //  Set scale
        var scale = value.toString().indexOf(".");
        if (scale == -1){
           scale = 0;
        } else {
           scale = value.toString().length - scale - 1;
        }
        convertedDecimalValue.setScale(scale);
      }
      convertedValue.setValuetype(Value.ValueType.DECIMAL);
      convertedValue.setDecimalvalue(convertedDecimalValue);
      return convertedValue;
    },
    getDecimalInstance() {
      const { Decimal } = require('./grpc/proto/businessdata_pb.js');
      return new Decimal();
    },
    /**
     * Return value converted, compatible with grpc
     * @param {mixed} value
     * @returns {Value}
     */
    convertValueToGRPC({ value, valueType }) {
      const { Value } = require('./grpc/proto/businessdata_pb.js');
      var convertedValue;
      if (valueType) {
        switch (Value.ValueType[valueType]) {
          // data type Number (integer)
          case Value.ValueType.INTEGER:
            convertedValue = convertUtils.getValueFromInteger(value);
            break;
          // data type Number (float)
          case Value.ValueType.DECIMAL:
            convertedValue = convertUtils.getValueFromDecimal(value);
            break;
          // data type Boolean
          case Value.ValueType.BOOLEAN:
            convertedValue = convertUtils.getValueFromBoolean(value);
            break;
          // data type String
          case Value.ValueType.STRING:
            convertedValue = convertUtils.getValueFromString(value);
            break;
          // data type Date
          case Value.ValueType.DATE:
            convertedValue = convertUtils.getValueFromDate(value);
            break;
        }
        return convertedValue;
      }
      // evaluate type value
      if (value === undefined || value === null) {
        return convertUtils.getValueFromString(value);
      }
      if (typeof(value) === 'number') {
        if (valueType === 'DOUBLE') {
          convertedValue = convertUtils.getValueFromDecimal(value);
        } else {
          convertedValue = convertUtils.getValueFromInteger(value);
        }
      } else if (typeof(value) === 'boolean') {
        convertedValue = convertUtils.getValueFromBoolean(value);
      } else if (Object.prototype.toString.call(value) === '[object Date]') {
        convertedValue = convertUtils.getValueFromDate(value);
      } else {
        convertedValue = convertUtils.getValueFromString(value);
      }
      return convertedValue;
    },

    /**
     * Get all values type or get key value type from value
     * @param {number} keyFind
     */
    getValueTypes(keyFind) {
      const { Value } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(Value.ValueType).find(key => Value.ValueType[key] === keyFind);
      } else {
        return Value.ValueType;
      }
    },

    /**
     * Convert a parameter defined by columnName and value to Value Object
     * @param {string} columnName
     * @param {mixed}  value
     * @returns KeyValue Object
     */
    convertParameterToGRPC({ columnName, value, valueType }) {
      const { KeyValue } = require('./grpc/proto/businessdata_pb.js');
      const keyValue = new KeyValue();
      keyValue.setKey(columnName);

      keyValue.setValue(
        convertUtils.convertValueToGRPC({
          value,
          valueType
        })
      );
      //  Return converted value
      return keyValue;
    },

    /**
     * Convert a list of parameter defined by columnName and value to Value Object
     * @param {number} selectionId keyColumn Value
     * @param {string} selectionUuid TODO: Add support to uuid record
     * @param {array}  selectionValues [{ columName, value }]
     * Return a list of KeyValue Object
     */
    convertSelectionToGRPC({ selectionId, selectionUuid, selectionValues = [] }) {
      const { KeyValueSelection } = require('./grpc/proto/businessdata_pb.js');
      const selectionInstance = new KeyValueSelection();

      // set selection id from record
      selectionInstance.setSelectionid(selectionId);
      //  Convert values to selection
      selectionValues.forEach(selectionItem => {
        const convertedSelection = convertUtils.convertParameterToGRPC({
          columnName: selectionItem.columnName,
          value: selectionItem.value
        });
        selectionInstance.addValues(convertedSelection);
      });
      return selectionInstance;
    },

    /**
     * Convert values map to compatible format
     * @param {map} mapToConvert
     * @param {string} returnType
     * @param {string} keyName, used in array pairs, default value is 'key'
     */
    convertValuesMapFromGRPC({ mapToConvert, returnType = 'map', keyName = 'key' }) {
      let returnValues;
      switch (returnType) {
        case 'object':
          returnValues = {};
          mapToConvert.forEach((value, key) => {
            returnValues[key] = convertUtils.convertValueFromGRPC(value);
          });
          break;

        case 'array':
          returnValues = [];
          mapToConvert.forEach((value, key) => {
            const item = {}
            item[keyName] = key;
            item.value = convertUtils.convertValueFromGRPC(value);
            returnValues.push(item);
          });
          break;

        default:
        case 'map':
          returnValues = new Map();
          mapToConvert.forEach((value, key) => {
            returnValues.set(key, convertUtils.convertValueFromGRPC(value));
          });
          break;
      }

      return returnValues;
    },

    convertLookupFromGRPC(lookupToConvert) {
      if (lookupToConvert) {
        return {
          id: lookupToConvert.getId(),
          uuid: lookupToConvert.getUuid(),
          tableName: lookupToConvert.getTablename(),
          values: convertUtils.convertValuesMapFromGRPC({
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
    },

    convertEntityFromGRPC({ entityToConvert, formatToConvert = 'object' }) {
      if (entityToConvert) {
        return {
          id: entityToConvert.getId(),
          uuid: entityToConvert.getUuid(),
          tableName: entityToConvert.getTablename(),
          values: convertUtils.convertValuesMapFromGRPC({
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
    },

    /**
     * Get all event type or get key value type from value
     * @param {number} valueMatch
     * @param {string} keyMatch
     * @returns {number|string|object}
        INSERT = 0;
        UPDATE = 1;
        DELETE = 2;
     */
    getRollbackEntityRequestEventType({ keyMatch, valueMatch }) {
      const { RollbackEntityRequest } = require('./grpc/proto/businessdata_pb.js');
      const { EventType } = RollbackEntityRequest;
      if (keyMatch !== undefined) {
        // return value
        return EventType[keyMatch];
      } else if (valueMatch !== undefined) {
        // retrun key
        return Object.keys(EventType).find(keyItem => EventType[keyItem] === valueMatch);
      }
      // return all event type list
      return EventType;
    },

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
          return convertUtils.convertValueFromGRPC(value);
        }),
        orderByColumnList: criteriaToConvert.getOrderbycolumnList().map(orderBy => {
          return orderBy;
        }),
        limit: criteriaToConvert.getLimit()
      };
    },

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
      const { Criteria } = require('./grpc/proto/businessdata_pb.js');
      const criteria = new Criteria();

      criteria.setTablename(tableName);
      criteria.setQuery(query);
      criteria.setWhereclause(whereClause);
      criteria.setReferenceuuid(referenceUuid);

      // add values
      if (valuesList && valuesList.length) {
        valuesList.forEach(itemValue => {
          const value = convertUtils.convertValueToGRPC({ value: itemValue });
          criteria.addValues(value);
        });
      }

      // add conditions
      if (conditionsList && conditionsList.length) {
        conditionsList.forEach(itemCondition => {
          const convertCondition = convertUtils.convertConditionToGRPC(itemCondition);
          criteria.addConditions(convertCondition);
        });
      }

      criteria.setOrderbyclause(orderByClause);
      criteria.setLimit(limit);

      //  Return criteria
      return criteria;
    },

    /**
     * Get all operator or get key value type from value
     * @param {number} keyToFind
     */
    getConditionOperators(keyToFind) {
      const { Condition } = require('./grpc/proto/businessdata_pb.js');
      if (keyToFind !== undefined) {
        return Object.keys(Condition.Operator).find(key => Condition.Operator[key] === keyToFind);
      } else {
        return Condition.Operator;
      }
    },

    /**
     * Convert a parameter defined by columnName and value to Value Object
     * TODO: Add support to operator with parameter
     * @param {string} columnName
     * @param {mixed}  value
     * @param {mixed}  valueTo
     * @param {array}  values
     * @returns Object
     */
    convertConditionToGRPC({ columnName, value, valueTo, values = [], operator = 'EQUAL' }) {
      const { Condition } = require('./grpc/proto/businessdata_pb.js');
      const conditionInstance = new Condition();

      conditionInstance.setColumnname(columnName);

      // set operator
      conditionInstance.setOperator(Condition.Operator.EQUAL); // 0
      if (operator) {
        conditionInstance.setOperator(Condition.Operator[operator]); // 2
      }

      // set value and value to
      if (value !== undefined && value !== null) {
        conditionInstance.setValue(
          convertUtils.convertValueToGRPC({ value })
        );
      }
      if (valueTo !== undefined && valueTo !== null) {
        conditionInstance.setValueto(
          convertUtils.convertValueToGRPC({ value: valueTo })
        );
      }
      // set values
      if (values && values.length) {
        values.forEach(itemValue => {
          const convertedValue = convertUtils.convertValueToGRPC({ value: itemValue });
          conditionInstance.addValues(convertedValue);
        });
      }

      //  Return converted condition
      return conditionInstance;
    },

    convertPrivateAccessFromGRPC(privateAccessToConvert) {
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
    },

    convertRecordReferenceInfoFromGRPC(recordReferenceInfoToConvert) {
      if (recordReferenceInfoToConvert) {
        return {
          uuid: recordReferenceInfoToConvert.getUuid(),
          windowUuid: recordReferenceInfoToConvert.getWindowuuid(),
          displayName: recordReferenceInfoToConvert.getDisplayname(),
          tableName: recordReferenceInfoToConvert.getTablename(),
          whereClause: recordReferenceInfoToConvert.getWhereclause(),
          recordCount: recordReferenceInfoToConvert.getRecordcount()
        };
      }
      return {
        uuid: undefined,
        windowUuid: undefined,
        displayName: undefined,
        tableName: undefined,
        whereClause: undefined,
        recordCount: undefined,
      };
    },

    convertLanguageFromGRPC(languageToConvert) {
      if (languageToConvert) {
        return {
          language: languageToConvert.getLanguage(),
          languageName: languageToConvert.getLanguagename(),
          languageISO: languageToConvert.getLanguageiso(),
          countryCode: languageToConvert.getCountrycode(),
          isBaseLanguage: languageToConvert.getIsbaselanguage(),
          isSystemLanguage: languageToConvert.getIssystemlanguage(),
          isDecimalPoint: languageToConvert.getIsdecimalpoint(),
          datePattern: languageToConvert.getDatepattern(),
          timePattern: languageToConvert.getTimepattern()
        };
      }
      return {
        language: undefined,
        languageName: undefined,
        languageISO: undefined,
        countryCode: undefined,
        isBaseLanguage: undefined,
        isSystemLanguage: undefined,
        isDecimalPoint: undefined,
        datePattern: undefined,
        timePattern: undefined,
      };
    },

    convertTranslationFromGRPC(translationToConvert) {
      if (translationToConvert) {
        return {
          language: translationToConvert.getLanguage(),
          translationUuid: translationToConvert.getTranslationuuid(),
          values: convertUtils.convertValuesMapFromGRPC({
            mapToConvert: translationToConvert.getValuesMap(),
            returnType: 'object'
          })
        };
      }
      return {
        language: undefined,
        translationUuid: undefined,
        values: undefined
      };
    },

    convertProcessLogFromGRPC(processLogToConvert) {
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
          parametersList: convertUtils.convertValuesMapFromGRPC({
            mapToConvert: processLogToConvert.getParametersMap(),
            returnType: 'object'
          }),
          output: convertUtils.convertReportOutputFromGRPC(processLogToConvert.getOutput())
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
    },

    convertReportOutputFromGRPC(reportOutputToConvert) {
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
    },

    convertPrintFromatFromGRPC(printFromatToConvert) {
      if (printFromatToConvert) {
        return {
          printFormatUuid: printFromatToConvert.getUuid(),
          name: printFromatToConvert.getName(),
          description: printFromatToConvert.getDescription(),
          tableName: printFromatToConvert.getTablename(),
          isDefault: printFromatToConvert.getIsdefault(),
          reportViewUuid: printFromatToConvert.getReportviewuuid()
        };
      }
      return {
        printFormatUuid: undefined,
        name: undefined,
        description: undefined,
        tableName: undefined,
        isDefault: undefined,
        reportViewUuid: undefined
      };
    },

    convertReportViewFromGRPC(reportViewToConvert) {
      if (reportViewToConvert) {
        return {
          reportViewUuid: reportViewToConvert.getUuid(),
          name: reportViewToConvert.getName(),
          description: reportViewToConvert.getDescription(),
          tableName: reportViewToConvert.getTablename()
        };
      }
      return {
        reportViewUuid: undefined,
        name: undefined,
        description: undefined,
        tableName: undefined
      };
    },

    convertDrillTableFromGRPC(drillTableToConvert) {
      if (drillTableToConvert) {
        return {
          tableName: drillTableToConvert.getTablename(),
          printName: drillTableToConvert.getPrintname()
        };
      }
      return {
        tableName: undefined,
        printName: undefined
      };
    },

    convertDashboardFromGRPC(dashboardToConvert) {
      if (dashboardToConvert) {
        return {
          windowUuid: dashboardToConvert.getWindowuuid(),
          browserUuid: dashboardToConvert.getBrowseruuid(),
          dashboardName: dashboardToConvert.getDashboardname(),
          dashboardDescription: dashboardToConvert.getDashboarddescription(),
          dashboardHtml: dashboardToConvert.getDashboardhtml(),
          columnNo: dashboardToConvert.getColumnno(),
          lineNo: dashboardToConvert.getLineno(),
          isCollapsible: dashboardToConvert.getIscollapsible(),
          isOpenByDefault: dashboardToConvert.getIsopenbydefault(),
          isEventRequired: dashboardToConvert.getIseventrequired(),
          fileName: dashboardToConvert.getFilename()
        };
      }
      return {
        windowUuid: undefined,
        browserUuid: undefined,
        dashboardName: undefined,
        dashboardDescription: undefined,
        dashboardHtml: undefined,
        columnNo: undefined,
        lineNo: undefined,
        isCollapsible: undefined,
        isOpenByDefault: undefined,
        isEventRequired: undefined,
        fileName: undefined,
      }
    },

    convertFavoriteFromGRPC(favoriteToConvert) {
      if (favoriteToConvert) {
        return {
          menuUuid: favoriteToConvert.getMenuuuid(),
          menuName: favoriteToConvert.getMenuname(),
          menuDescription: favoriteToConvert.getMenudescription(),
          referenceUuid: favoriteToConvert.getReferenceuuid(),
          action: favoriteToConvert.getAction()
        };
      }
      return {
        menuUuid: undefined,
        menuName: undefined,
        menuDescription: undefined,
        referenceUuid: undefined,
        action: undefined
      };;
    },

    convertRecentItemFromGRPC(recentItemToConvert) {
      if (recentItemToConvert) {
        return {
          menuUuid: recentItemToConvert.getMenuuuid(),
          menuName: recentItemToConvert.getMenuname(),
          menuDescription: recentItemToConvert.getMenudescription(),
          windowUuid: recentItemToConvert.getWindowuuid(),
          tabUuid: recentItemToConvert.getTabuuid(),
          tableId: recentItemToConvert.getTableid(),
          recordId: recentItemToConvert.getRecordid(),
          displayName: recentItemToConvert.getDisplayname(),
          recordUuid: recentItemToConvert.getRecorduuid(),
          updated: new Date(recentItemToConvert.getUpdated()),
          referenceUuid: recentItemToConvert.getReferenceuuid(),
          action: recentItemToConvert.getAction()
        };
      }
      return {
        menuUuid: undefined,
        menuName: undefined,
        menuDescription: undefined,
        windowUuid: undefined,
        tabUuid: undefined,
        tableId: undefined,
        recordId: undefined,
        displayName: undefined,
        recordUuid: undefined,
        updated: undefined,
        referenceUuid: undefined,
        action: undefined,
      };
    },

    convertPendingDocumentFromGRPC(pendingDocumentToConvert) {
      if (pendingDocumentToConvert) {
        return {
          windowUuid: pendingDocumentToConvert.getWindowuuid(),
          formUuid: pendingDocumentToConvert.getFormuuid(),
          documentName: pendingDocumentToConvert.getDocumentname(),
          documentDescription: pendingDocumentToConvert.getDocumentdescription(),
          sequence: pendingDocumentToConvert.getSequence(),
          recordCount: pendingDocumentToConvert.getRecordcount(),
          criteria: convertUtils.convertCriteriaFromGRPC(
            pendingDocumentToConvert.getCriteria()
          )
        };
      }
      return {
        windowUuid: undefined,
        formUuid: undefined,
        documentName: undefined,
        documentDescription: undefined,
        sequence: undefined,
        recordCount: undefined,
        criteria: undefined
      };
    },

    /**
     * Get all event type or get key value type from value
     * @param {number} keyFind
     */
    getRecordLogEventType(keyFind) {
      const { RecordLog } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(RecordLog.EventType).find(key => RecordLog.EventType[key] === keyFind);
      }
      return RecordLog.EventType;
    },

    convertRecordLogFromGRPC(recordLogToConvert) {
      if (recordLogToConvert) {
        return {
          logId: recordLogToConvert.getLogid(),
          recordId: recordLogToConvert.getRecordid(),
          tableName: recordLogToConvert.getTablename(),
          sessionUuid: recordLogToConvert.getSessionuuid(),
          userUuid: recordLogToConvert.getUseruuid(),
          userName: recordLogToConvert.getUsername(),
          transactionName: recordLogToConvert.getTransactionname(),
          eventType: recordLogToConvert.getEventtype(),
          eventTypeName: convertUtils.getRecordLogEventType(recordLogToConvert.getEventtype()),
          logDate: new Date(recordLogToConvert.getLogdate()),
          changeLogs: recordLogToConvert.getChangelogsList().map(changeLog => {
            return {
              columnName: changeLog.getColumnname(),
              displayColumnName: changeLog.getDisplaycolumnname(),
              oldValue: changeLog.getOldvalue(),
              newValue: changeLog.getNewvalue(),
              oldDisplayValue: changeLog.getOlddisplayvalue(),
              newDisplayValue: changeLog.getNewdisplayvalue(),
              description: changeLog.getDescription()
            }
          })
        };
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
      };
    },

    /**
     * Get all confidential type or get key value type from value
     * @param {number} keyFind
          PUBLIC: 0,
          PARTER: 1,
          INTERNAL: 2,
     */
    getRecordChatsConfidentialType(keyFind) {
      const { RecordChat } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(RecordChat.ConfidentialType).find(key => RecordChat.ConfidentialType[key] === keyFind);
      }
      return RecordChat.ConfidentialType;
    },

    /**
     * Get all moderation type or get key value type from value
     * @param {number} keyFind
          NOT_MODERATED: 0,
          BEFORE_PUBLISHING: 1,
          AFTER_PUBLISHING: 2,
     */
    getRecordChatsModerationType(keyFind) {
      const { RecordChat } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(RecordChat.ModerationType).find(key => RecordChat.ModerationType[key] === keyFind);
      }
      return RecordChat.ModerationType;
    },

    convertRecordChatsFromGRPC(recordChatToConvert) {
      if (recordChatToConvert) {
        return {
          chatUuid: recordChatToConvert.getChatuuid(),
          recordId: recordChatToConvert.getRecordid(),
          tableName: recordChatToConvert.getTablename(),
          chatTypeUuid: recordChatToConvert.getChattypeuuid(),
          description: recordChatToConvert.getDescription(),
          confidentialType: recordChatToConvert.getConfidentialtype(),
          confidentialTypeName: convertUtils.getRecordChatsConfidentialType(
            recordChatToConvert.getConfidentialtype()
          ),
          moderationType: recordChatToConvert.getModerationtype(),
          moderationTypeName: convertUtils.getRecordChatsModerationType(
            recordChatToConvert.getModerationtype()
          ),
          logDate: new Date(recordChatToConvert.getLogdate())
        };
      }
      return {
        chatUuid: undefined,
        recordId: undefined,
        tableName: undefined,
        chatTypeUuid: undefined,
        description: undefined,
        confidentialType: undefined,
        confidentialTypeName: undefined,
        moderationType: undefined,
        moderationTypeName: undefined,
        logDate: undefined
      };
    },

    /**
     * Get all confidential type or get key value type from value
     * @param {number} keyFind
          PUBLIC = 0;
          PARTER = 1;
          INTERNAL = 2;
     */
    getChatEntryConfidentialType(keyFind) {
      const { ChatEntry } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(ChatEntry.ConfidentialType).find(key => ChatEntry.ConfidentialType[key] === keyFind);
      }
      return ChatEntry.ConfidentialType;
    },

    /**
     * Get all moderation status or get key value type from value
     * @param {number} keyFind
          NOT_DISPLAYED = 0;
          PUBLISHED = 1;
          SUSPICIUS = 2;
          TO_BE_REVIEWED = 3;
     */
    getChatEntryModeratorStatus(keyFind) {
      const { ChatEntry } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(ChatEntry.ModeratorStatus).find(key => ChatEntry.ModeratorStatus[key] === keyFind);
      }
      return ChatEntry.ModeratorStatus;
    },

    /**
     * Get all chat entry type or get key value type from value
     * @param {number} keyFind
          NOTE_FLAT = 0;
          FORUM_THREADED = 1;
          WIKI = 2;
     */
    getChatEntryChatEntryType(keyFind) {
      const { ChatEntry } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(ChatEntry.ChatEntryType).find(key => ChatEntry.ChatEntryType[key] === keyFind);
      }
      return ChatEntry.ChatEntryType;
    },

    convertChatEntryFromGRPC(chatEntryToConvert) {
      if (chatEntryToConvert) {
        return {
          chatUuid: chatEntryToConvert.getChatuuid(),
          chatEntryUuid: chatEntryToConvert.getChatentryuuid(),
          subject: chatEntryToConvert.getSubject(),
          characterData: chatEntryToConvert.getCharacterdata(),
          userUuid: chatEntryToConvert.getUseruuid(),
          userName: chatEntryToConvert.getUsername(),
          chatEntryType: chatEntryToConvert.getChatentrytype(),
          chatEntryTypeName: convertUtils.getChatEntryChatEntryType(
            chatEntryToConvert.getChatentrytype()
          ),
          confidentialType: chatEntryToConvert.getConfidentialtype(),
          confidentialTypeName: convertUtils.getChatEntryConfidentialType(
            chatEntryToConvert.getConfidentialtype()
          ),
          moderatorStatus: chatEntryToConvert.getModeratorstatus(),
          moderatorStatusName: convertUtils.getChatEntryModeratorStatus(
            chatEntryToConvert.getModeratorstatus()
          ),
          logDate: new Date(chatEntryToConvert.getLogdate())
        };
      }
      return {
        chatUuid: undefined,
        chatEntryUuid: undefined,
        subject: undefined,
        characterData: undefined,
        userUuid: undefined,
        userName: undefined,
        chatEntryType: undefined,
        chatEntryTypeName: undefined,
        confidentialType: undefined,
        confidentialTypeName: undefined,
        moderatorStatus: undefined,
        moderatorStatusName: undefined,
        logDate: undefined
      };
    },
    convertCreateChatEntryFromGRPC(createChatEntry) {
      if (createChatEntry) {
        return {
          tableName: createChatEntry.getTablename(),
          recordId: createChatEntry.getRecordid(),
          comment: createChatEntry.getComment(),
        };
      }
      return {
        tableName: undefined,
        recordId: undefined,
        comment: undefined
      };
    },
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
    getWorkflowProcessWorkflowState(keyFind) {
      const { WorkflowProcess } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(WorkflowProcess.WorkflowState).find(key => WorkflowProcess.WorkflowState[key] === keyFind);
      }
      return WorkflowProcess.WorkflowState;
    },

    /**
     * Get all workflow priority or get key value type from value
     * @param {number} keyFind
          URGENT: 0,
          HIGH: 1,
          MEDIUM: 2,
          LOW: 3,
          MINOR: 4,
     */
    getWorkflowProcessWorkflowPriority(keyFind) {
      const { WorkflowProcess } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(WorkflowProcess.Priority).find(key => WorkflowProcess.Priority[key] === keyFind);
      }
      return WorkflowProcess.Priority;
    },

    convertWorkflowProcessFomGRPC(workflowProcessToConvert) {
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
          textMessage: workflowProcessToConvert.getTextmessage(),
          processed: workflowProcessToConvert.getProcessed(),
          workflowStateName: convertUtils.getWorkflowProcessWorkflowState(workflowProcessToConvert.getWorkflowstate()),
          workflowState: workflowProcessToConvert.getWorkflowstate(),
          priority: workflowProcessToConvert.getPriority(),
          priorityName: convertUtils.getWorkflowProcessWorkflowPriority(
            workflowProcessToConvert.getPriority()
          ),
          workflowEventsList: workflowProcessToConvert.getWorkfloweventsList().map(itemEvent => {
            return convertUtils.convertWorkflowEventFromGRPC(itemEvent);
          }),
          logDate: new Date(workflowProcessToConvert.getLogdate())
        };
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
      };
    },

    /**
     * Get all workflow event type or get key value type from value
     * @param {number} keyFind
          PROCESS_CREATED = 0;
          PROCESS_COMPLETED = 1;
          STATE_CHANGED = 2;
     */
    getWorkflowEventWorkflowEventType(keyFind) {
      const { WorkflowEvent } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(WorkflowEvent.EventType).find(key => WorkflowEvent.EventType[key] === keyFind);
      }
      return WorkflowEvent.EventType;
    },

    convertWorkflowEventFromGRPC(workflowEventToConvert) {
      if (workflowEventToConvert) {
        return {
          nodeUuid: workflowEventToConvert.getNodeuuid(),
          nodeName: workflowEventToConvert.getNodename(),
          recordId: workflowEventToConvert.getRecordid(),
          tableName: workflowEventToConvert.getTablename(),
          userUuid: workflowEventToConvert.getUseruuid(),
          userName: workflowEventToConvert.getUsername(),
          responsibleUuid: workflowEventToConvert.getResponsibleuuid(),
          responsibleName: workflowEventToConvert.getResponsiblename(),
          textMessage: workflowEventToConvert.getTextmessage(),
          timeElapsed: workflowEventToConvert.getTimeelapsed(),
          attributeName: workflowEventToConvert.getAttributename(),
          oldValue: workflowEventToConvert.getOldvalue(),
          newValue: workflowEventToConvert.getNewvalue(),
          workflowState: workflowEventToConvert.getWorkflowstate(),
          workflowStateName: convertUtils.getWorkflowProcessWorkflowState(workflowEventToConvert.getWorkflowstate()),
          eventType: workflowEventToConvert.getEventtype(),
          eventTypeName: convertUtils.getWorkflowEventWorkflowEventType(workflowEventToConvert.getEventtype()),
          logDate: new Date(workflowEventToConvert.getLogdate())
        };
      }

      return {
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
        eventTypeName: undefined,
        logDate: undefined
      };
    },

    /**
     * Get all workflow event type or get key value type from value
     * @param {number} keyFind
          DAY = 0;
          HOUR = 1;
          MINUTE = 2;
          MONTH = 3;
          SECOND = 4;
          YEAR = 5;
     */
    getWorkflowDefinitionDurationUnit(keyFind) {
      const { WorkflowDefinition } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(WorkflowDefinition.DurationUnit).find(key => WorkflowDefinition.DurationUnit[key] === keyFind);
      }
      return WorkflowDefinition.DurationUnit;
    },


    /**
     * Get all workflow definition publush status or get key value type from value
     * @param {number} keyFind
          RELEASED = 0;
          TEST = 1;
          UNDER_REVISION = 2;
          VOID = 3;
     */
    getWorkflowDefinitionPublishStatus(keyFind) {
      const { WorkflowDefinition } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(WorkflowDefinition.PublishStatus).find(key => WorkflowDefinition.PublishStatus[key] === keyFind);
      }
      return WorkflowDefinition.PublishStatus;
    },

    /**
     * Get all workflow definition duration unit or get key value type from value
     * @param {number} keyFind
          DAY = 0;
          HOUR = 1;
          MINUTE = 2;
          MONTH = 3;
          SECOND = 4;
          YEAR = 5;
     */
    getWorkflowDefinitionDurationUnit(keyFind) {
      const { WorkflowDefinition } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(WorkflowDefinition.DurationUnit).find(key => WorkflowDefinition.DurationUnit[key] === keyFind);
      }
      return WorkflowDefinition.DurationUnit;
    },

    convertWorkflowDefinitionFromGRPC(workflowDefinitionToConvert) {
      if (workflowDefinitionToConvert) {
        return {
          workflowUuid: workflowDefinitionToConvert.getWorkflowuuid(),
          value: workflowDefinitionToConvert.getValue(),
          name: workflowDefinitionToConvert.getName(),
          description: workflowDefinitionToConvert.getDescription(),
          help: workflowDefinitionToConvert.getHelp(),
          tableName: workflowDefinitionToConvert.getTablename(),
          responsibleUuid: workflowDefinitionToConvert.getResponsibleuuid(),
          priority: workflowDefinitionToConvert.getPriority(),
          validFrom: workflowDefinitionToConvert.getValidfrom(),
          isDefault: workflowDefinitionToConvert.getIsdefault(),
          isValid: workflowDefinitionToConvert.getIsvalid(),
          publishStatus: workflowDefinitionToConvert.getPublishstatus(),
          publishStatusName: convertUtils.getWorkflowDefinitionPublishStatus(
            workflowDefinitionToConvert.getPublishstatus()
          ),
          durationUnit: workflowDefinitionToConvert.getDurationunit(),
          durationUnitName: convertUtils.getWorkflowDefinitionDurationUnit(
            workflowDefinitionToConvert.getDurationunit()
          ),
          startNode: convertUtils.convertWorkflowNodeFromGRPC(workflowDefinitionToConvert.getStartnode()),
          workflowNodesList: workflowDefinitionToConvert.getWorkflownodesList().map(itemWorkflowNode => {
            return convertUtils.convertWorkflowNodeFromGRPC(itemWorkflowNode);
          })
        };
      }
      return {
        workflowUuid: undefined,
        value: undefined,
        name: undefined,
        description: undefined,
        help: undefined,
        tableName: undefined,
        responsibleUuid: undefined,
        responsibleName: undefined,
        priority: undefined,
        validFrom: undefined,
        isDefault: undefined,
        isValid: undefined,
        publishStatus: undefined,
        publishStatusName: undefined,
        durationUnit: undefined,
        durationUnitName: undefined,
        startNode: undefined,
        workflowNodesList: undefined
      };
    },

    /**
     * Get all workflow node action or get key value type from value
     * @param {number} keyFind
        USER_CHOICE = 0;
        DOCUMENT_ACTION = 1;
        SUB_WORKFLOW = 2;
        EMAIL = 3;
        APPS_PROCESS = 4;
        SMART_VIEW = 5;
        APPS_REPORT = 6;
        SMART_BROWSE = 7;
        APPS_TASK = 8;
        SET_VARIABLE = 9;
        USER_WINDOW = 10;
        USER_FORM = 11;
        WAIT_SLEEP = 12;
     */
    getWorkflowNodeAction(keyFind) {
      const { WorkflowNode } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(WorkflowNode.Action).find(key => WorkflowNode.Action[key] === keyFind);
      }
      return WorkflowNode.Action;
    },

    convertWorkflowNodeFromGRPC(workflowNodeToConvert) {
      if (workflowNodeToConvert) {
        return {
          nodeUuid: workflowNodeToConvert.getNodeuuid(),
          value: workflowNodeToConvert.getValue(),
          name: workflowNodeToConvert.getName(),
          description: workflowNodeToConvert.getDescription(),
          help: workflowNodeToConvert.getHelp(),
          responsibleUuid: workflowNodeToConvert.getResponsibleuuid(),
          documentActionValue: workflowNodeToConvert.getDocumentactionvalue(),
          documentActionName: workflowNodeToConvert.getDocumentactionname(),
          priority: workflowNodeToConvert.getPriority(),
          action: workflowNodeToConvert.getAction(),
          actionName: convertUtils.getWorkflowNodeAction(
            workflowNodeToConvert.getAction()
          ),
          transitionsList: workflowNodeToConvert.getTransitionsList().map(itemTransition => {
            return convertUtils.convertWorkflowTransitionFromGRPC(itemTransition);
          })
        }
      }
      // Workflow Node
      return {
        nodeUuid: undefined,
        value: undefined,
        name: undefined,
        description: undefined,
        help: undefined,
        responsibleUuid: undefined,
        responsibleName: undefined,
        documentActionValue: undefined,
        documentActionName: undefined,
        priority: undefined,
        action: undefined,
        actionName: undefined,
        transitionsList: undefined
      };
    },

    convertWorkflowTransitionFromGRPC(workflowTransitionToConvert) {
      if (workflowTransitionToConvert) {
        return {
          nodeNextUuid: workflowTransitionToConvert.getNodenextuuid(),
          description: workflowTransitionToConvert.getDescription(),
          isStdUserWorkflow: workflowTransitionToConvert.getIsstduserworkflow(),
          sequence: workflowTransitionToConvert.getSequence(),
          workflowConditionsList: workflowTransitionToConvert.getWorkflowconditionsList().map(conditionItem => {
            return convertUtils.convertWorkflowConditionFromGRPC(conditionItem);
          })
        };
      }
      return {
        nodeNextUuid: undefined,
        description: undefined,
        isStdUserWorkflow: undefined,
        sequence: undefined,
        workflowConditionsList: undefined
      };
    },

    /**
     * Get all workflow condition, condition type action or get key value type from value
     * @param {number} keyFind
        AND = 0;
        OR = 1;
     */
    getWorkflowConditionConditionType() {
      const { WorkflowCondition } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(WorkflowCondition.ConditionType).find(key => WorkflowCondition.ConditionType[key] === keyFind);
      }
      return WorkflowCondition.ConditionType;
    },

    /**
     * Get all workflow condition, condition type action or get key value type from value
     * @param {number} keyFind
        EQUAL = 0;
        NOT_EQUAL = 1;
        LIKE = 2;
        GREATER = 4;
        GREATER_EQUAL = 5;
        LESS = 6;
        LESS_EQUAL = 7;
        BETWEEN = 8;
        SQL = 9;
     */
    getWorkflowConditionOperation() {
      const { WorkflowCondition } = require('./grpc/proto/businessdata_pb.js');
      if (keyFind !== undefined) {
        return Object.keys(WorkflowCondition.Operation).find(key => WorkflowCondition.Operation[key] === keyFind);
      }
      return WorkflowCondition.Operation;
    },

    convertWorkflowConditionFromGRPC(workflowConditionToConvert) {
      if (workflowConditionToConvert) {
        return {
          sequence: workflowConditionToConvert.getSequence(),
          columName: workflowConditionToConvert.getColumnname(),
          value: workflowConditionToConvert.getValue(),
          conditionType: workflowConditionToConvert.getConditiontype(),
          conditionTypeName: convertUtils.getWorkflowConditionConditionType(
            workflowConditionToConvert.getConditiontype()
          ),
          operation: workflowConditionToConvert.getOperation(),
          operationName: convertUtils.getWorkflowConditionOperation(
            workflowConditionToConvert.getOpetation()
          )
        };
      }
      return {
        sequence: undefined,
        columName: undefined,
        value: undefined,
        conditionType: undefined,
        conditionTypeName: undefined,
        operation: undefined,
        operationName: undefined
      };
    },

    convertDocumentAction(documentActionToConvert) {
      if (documentActionToConvert) {
        return {
          value: documentActionToConvert.getValue(),
          name: documentActionToConvert.getName(),
          description: documentActionToConvert.getDescription()
        };
      }
      return {
        value: undefined,
        name: undefined,
        description: undefined
      };
    },

    convertDocumentStatus(documentStatusToConvert) {
      if (documentStatusToConvert) {
        return {
          value: documentStatusToConvert.getValue(),
          name: documentStatusToConvert.getName(),
          description: documentStatusToConvert.getDescription()
        };
      }
      return {
        value: undefined,
        name: undefined,
        description: undefined
      };
    }
  }

  module.exports = convertUtils
