/**
 * @fileoverview gRPC-Web generated client stub for data
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.data = require('./businessdata_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.data.BusinessDataServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.data.BusinessDataServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.GetEntityRequest,
 *   !proto.data.Entity>}
 */
const methodInfo_BusinessDataService_GetEntity = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.Entity,
  /** @param {!proto.data.GetEntityRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.Entity.deserializeBinary
);


/**
 * @param {!proto.data.GetEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.Entity)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.Entity>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.getEntity =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/GetEntity',
      request,
      metadata || {},
      methodInfo_BusinessDataService_GetEntity,
      callback);
};


/**
 * @param {!proto.data.GetEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.Entity>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.getEntity =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/GetEntity',
      request,
      metadata || {},
      methodInfo_BusinessDataService_GetEntity);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.CreateEntityRequest,
 *   !proto.data.Entity>}
 */
const methodInfo_BusinessDataService_CreateEntity = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.Entity,
  /** @param {!proto.data.CreateEntityRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.Entity.deserializeBinary
);


/**
 * @param {!proto.data.CreateEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.Entity)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.Entity>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.createEntity =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/CreateEntity',
      request,
      metadata || {},
      methodInfo_BusinessDataService_CreateEntity,
      callback);
};


/**
 * @param {!proto.data.CreateEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.Entity>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.createEntity =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/CreateEntity',
      request,
      metadata || {},
      methodInfo_BusinessDataService_CreateEntity);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.UpdateEntityRequest,
 *   !proto.data.Entity>}
 */
const methodInfo_BusinessDataService_UpdateEntity = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.Entity,
  /** @param {!proto.data.UpdateEntityRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.Entity.deserializeBinary
);


/**
 * @param {!proto.data.UpdateEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.Entity)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.Entity>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.updateEntity =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/UpdateEntity',
      request,
      metadata || {},
      methodInfo_BusinessDataService_UpdateEntity,
      callback);
};


/**
 * @param {!proto.data.UpdateEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.Entity>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.updateEntity =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/UpdateEntity',
      request,
      metadata || {},
      methodInfo_BusinessDataService_UpdateEntity);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.DeleteEntityRequest,
 *   !proto.data.Empty>}
 */
const methodInfo_BusinessDataService_DeleteEntity = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.Empty,
  /** @param {!proto.data.DeleteEntityRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.Empty.deserializeBinary
);


/**
 * @param {!proto.data.DeleteEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.deleteEntity =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/DeleteEntity',
      request,
      metadata || {},
      methodInfo_BusinessDataService_DeleteEntity,
      callback);
};


/**
 * @param {!proto.data.DeleteEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.Empty>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.deleteEntity =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/DeleteEntity',
      request,
      metadata || {},
      methodInfo_BusinessDataService_DeleteEntity);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.RollbackEntityRequest,
 *   !proto.data.Entity>}
 */
const methodInfo_BusinessDataService_RollbackEntity = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.Entity,
  /** @param {!proto.data.RollbackEntityRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.Entity.deserializeBinary
);


/**
 * @param {!proto.data.RollbackEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.Entity)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.Entity>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.rollbackEntity =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/RollbackEntity',
      request,
      metadata || {},
      methodInfo_BusinessDataService_RollbackEntity,
      callback);
};


/**
 * @param {!proto.data.RollbackEntityRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.Entity>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.rollbackEntity =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/RollbackEntity',
      request,
      metadata || {},
      methodInfo_BusinessDataService_RollbackEntity);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.ListEntitiesRequest,
 *   !proto.data.ListEntitiesResponse>}
 */
const methodInfo_BusinessDataService_ListEntities = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.ListEntitiesResponse,
  /** @param {!proto.data.ListEntitiesRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.ListEntitiesResponse.deserializeBinary
);


/**
 * @param {!proto.data.ListEntitiesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.ListEntitiesResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.ListEntitiesResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.listEntities =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/ListEntities',
      request,
      metadata || {},
      methodInfo_BusinessDataService_ListEntities,
      callback);
};


/**
 * @param {!proto.data.ListEntitiesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.ListEntitiesResponse>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.listEntities =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/ListEntities',
      request,
      metadata || {},
      methodInfo_BusinessDataService_ListEntities);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.GetLookupItemRequest,
 *   !proto.data.LookupItem>}
 */
const methodInfo_BusinessDataService_GetLookupItem = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.LookupItem,
  /** @param {!proto.data.GetLookupItemRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.LookupItem.deserializeBinary
);


/**
 * @param {!proto.data.GetLookupItemRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.LookupItem)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.LookupItem>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.getLookupItem =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/GetLookupItem',
      request,
      metadata || {},
      methodInfo_BusinessDataService_GetLookupItem,
      callback);
};


/**
 * @param {!proto.data.GetLookupItemRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.LookupItem>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.getLookupItem =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/GetLookupItem',
      request,
      metadata || {},
      methodInfo_BusinessDataService_GetLookupItem);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.ListLookupItemsRequest,
 *   !proto.data.ListLookupItemsResponse>}
 */
const methodInfo_BusinessDataService_ListLookupItems = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.ListLookupItemsResponse,
  /** @param {!proto.data.ListLookupItemsRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.ListLookupItemsResponse.deserializeBinary
);


/**
 * @param {!proto.data.ListLookupItemsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.ListLookupItemsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.ListLookupItemsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.listLookupItems =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/ListLookupItems',
      request,
      metadata || {},
      methodInfo_BusinessDataService_ListLookupItems,
      callback);
};


/**
 * @param {!proto.data.ListLookupItemsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.ListLookupItemsResponse>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.listLookupItems =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/ListLookupItems',
      request,
      metadata || {},
      methodInfo_BusinessDataService_ListLookupItems);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.RunCalloutRequest,
 *   !proto.data.Callout>}
 */
const methodInfo_BusinessDataService_RunCallout = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.Callout,
  /** @param {!proto.data.RunCalloutRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.Callout.deserializeBinary
);


/**
 * @param {!proto.data.RunCalloutRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.Callout)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.Callout>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.runCallout =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/RunCallout',
      request,
      metadata || {},
      methodInfo_BusinessDataService_RunCallout,
      callback);
};


/**
 * @param {!proto.data.RunCalloutRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.Callout>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.runCallout =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/RunCallout',
      request,
      metadata || {},
      methodInfo_BusinessDataService_RunCallout);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.RunBusinessProcessRequest,
 *   !proto.data.BusinessProcess>}
 */
const methodInfo_BusinessDataService_RunBusinessProcess = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.BusinessProcess,
  /** @param {!proto.data.RunBusinessProcessRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.BusinessProcess.deserializeBinary
);


/**
 * @param {!proto.data.RunBusinessProcessRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.BusinessProcess)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.BusinessProcess>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.runBusinessProcess =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/RunBusinessProcess',
      request,
      metadata || {},
      methodInfo_BusinessDataService_RunBusinessProcess,
      callback);
};


/**
 * @param {!proto.data.RunBusinessProcessRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.BusinessProcess>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.runBusinessProcess =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/RunBusinessProcess',
      request,
      metadata || {},
      methodInfo_BusinessDataService_RunBusinessProcess);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.ListBrowserItemsRequest,
 *   !proto.data.ListBrowserItemsResponse>}
 */
const methodInfo_BusinessDataService_ListBrowserItems = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.ListBrowserItemsResponse,
  /** @param {!proto.data.ListBrowserItemsRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.ListBrowserItemsResponse.deserializeBinary
);


/**
 * @param {!proto.data.ListBrowserItemsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.ListBrowserItemsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.ListBrowserItemsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.listBrowserItems =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/ListBrowserItems',
      request,
      metadata || {},
      methodInfo_BusinessDataService_ListBrowserItems,
      callback);
};


/**
 * @param {!proto.data.ListBrowserItemsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.ListBrowserItemsResponse>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.listBrowserItems =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/ListBrowserItems',
      request,
      metadata || {},
      methodInfo_BusinessDataService_ListBrowserItems);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.ListActivitiesRequest,
 *   !proto.data.ListActivitiesResponse>}
 */
const methodInfo_BusinessDataService_ListActivities = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.ListActivitiesResponse,
  /** @param {!proto.data.ListActivitiesRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.ListActivitiesResponse.deserializeBinary
);


/**
 * @param {!proto.data.ListActivitiesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.ListActivitiesResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.ListActivitiesResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.listActivities =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/ListActivities',
      request,
      metadata || {},
      methodInfo_BusinessDataService_ListActivities,
      callback);
};


/**
 * @param {!proto.data.ListActivitiesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.ListActivitiesResponse>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.listActivities =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/ListActivities',
      request,
      metadata || {},
      methodInfo_BusinessDataService_ListActivities);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.ListRecentItemsRequest,
 *   !proto.data.ListRecentItemsResponse>}
 */
const methodInfo_BusinessDataService_ListRecentItems = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.ListRecentItemsResponse,
  /** @param {!proto.data.ListRecentItemsRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.ListRecentItemsResponse.deserializeBinary
);


/**
 * @param {!proto.data.ListRecentItemsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.ListRecentItemsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.ListRecentItemsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.listRecentItems =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/ListRecentItems',
      request,
      metadata || {},
      methodInfo_BusinessDataService_ListRecentItems,
      callback);
};


/**
 * @param {!proto.data.ListRecentItemsRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.ListRecentItemsResponse>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.listRecentItems =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/ListRecentItems',
      request,
      metadata || {},
      methodInfo_BusinessDataService_ListRecentItems);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.ListReferencesRequest,
 *   !proto.data.ListReferencesResponse>}
 */
const methodInfo_BusinessDataService_ListReferences = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.ListReferencesResponse,
  /** @param {!proto.data.ListReferencesRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.ListReferencesResponse.deserializeBinary
);


/**
 * @param {!proto.data.ListReferencesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.ListReferencesResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.ListReferencesResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.listReferences =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/ListReferences',
      request,
      metadata || {},
      methodInfo_BusinessDataService_ListReferences,
      callback);
};


/**
 * @param {!proto.data.ListReferencesRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.ListReferencesResponse>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.listReferences =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/ListReferences',
      request,
      metadata || {},
      methodInfo_BusinessDataService_ListReferences);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.GetDefaultValueRequest,
 *   !proto.data.Value>}
 */
const methodInfo_BusinessDataService_GetDefaultValue = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.Value,
  /** @param {!proto.data.GetDefaultValueRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.Value.deserializeBinary
);


/**
 * @param {!proto.data.GetDefaultValueRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.Value)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.Value>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.BusinessDataServiceClient.prototype.getDefaultValue =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.BusinessDataService/GetDefaultValue',
      request,
      metadata || {},
      methodInfo_BusinessDataService_GetDefaultValue,
      callback);
};


/**
 * @param {!proto.data.GetDefaultValueRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.Value>}
 *     A native promise that resolves to the response
 */
proto.data.BusinessDataServicePromiseClient.prototype.getDefaultValue =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.BusinessDataService/GetDefaultValue',
      request,
      metadata || {},
      methodInfo_BusinessDataService_GetDefaultValue);
};


module.exports = proto.data;

