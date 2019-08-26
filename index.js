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

  //  List all references from window
  listReferencesRequest(request) {
    return this.getService().listReferencesRequest(request);
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
  convertValue(value) {
    const { Value } = require('./src/grpc/proto/businessdata_pb.js');
    var valueConverted = new Value();

    // evaluate type value
    if(typeof(value) === 'number') {
      if (Number.isInteger(value)) {
        valueConverted.setIntvalue(value);
        valueConverted.setValuetype(Value.ValueType.INTEGER);
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
    var convertedValue = this.convertValue(parameter.value)
    keyValue.setValue(convertedValue);
    //  Return converted value
    return keyValue;
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
    const { Selection } = require('./src/grpc/proto/businessdata_pb.js');
    var selection = new Selection();
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
  requestProcess(RunBusinessProcessRequest) {
    return this.getService().runBusinessProcess(RunBusinessProcessRequest);
  }

  /**
  * Request Browser
  */
  requestBrowser(ListBrowserItemsRequest) {
    return this.getService().listBrowserItems(ListBrowserItemsRequest);
  }

  /**
   * Load gRPC Connection
   * @return {object} requestService Return request for get data
   */
  getService() {
    const grpc_promise = require('grpc-promise');
    const { DataServicePromiseClient } = require('./src/grpc/proto/businessdata_grpc_web_pb.js');
    var requestService = new DataServicePromiseClient(this.host);
    grpc_promise.promisifyAll(requestService);
    //  Return request for get data
    return requestService;
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
    criteria.setTablename(tableName);
    //  Return criteria
    return criteria;
  }

}

module.exports = BusinessData;
