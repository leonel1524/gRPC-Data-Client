/**
 * @fileoverview gRPC-Web generated client stub for data
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.data = require('./data_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.data.DataServiceClient =
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
proto.data.DataServicePromiseClient =
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
 *   !proto.data.ValueObjectRequest,
 *   !proto.data.ValueObject>}
 */
const methodInfo_DataService_RequestObject = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.ValueObject,
  /** @param {!proto.data.ValueObjectRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.ValueObject.deserializeBinary
);


/**
 * @param {!proto.data.ValueObjectRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.ValueObject)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.ValueObject>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.DataServiceClient.prototype.requestObject =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.DataService/RequestObject',
      request,
      metadata || {},
      methodInfo_DataService_RequestObject,
      callback);
};


/**
 * @param {!proto.data.ValueObjectRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.ValueObject>}
 *     A native promise that resolves to the response
 */
proto.data.DataServicePromiseClient.prototype.requestObject =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.DataService/RequestObject',
      request,
      metadata || {},
      methodInfo_DataService_RequestObject);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.ValueObjectRequest,
 *   !proto.data.ValueObjectList>}
 */
const methodInfo_DataService_RequestObjectList = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.ValueObjectList,
  /** @param {!proto.data.ValueObjectRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.ValueObjectList.deserializeBinary
);


/**
 * @param {!proto.data.ValueObjectRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.ValueObjectList)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.ValueObjectList>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.DataServiceClient.prototype.requestObjectList =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.DataService/RequestObjectList',
      request,
      metadata || {},
      methodInfo_DataService_RequestObjectList,
      callback);
};


/**
 * @param {!proto.data.ValueObjectRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.ValueObjectList>}
 *     A native promise that resolves to the response
 */
proto.data.DataServicePromiseClient.prototype.requestObjectList =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.DataService/RequestObjectList',
      request,
      metadata || {},
      methodInfo_DataService_RequestObjectList);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.ValueObjectRequest,
 *   !proto.data.ValueObject>}
 */
const methodInfo_DataService_RequestLookup = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.ValueObject,
  /** @param {!proto.data.ValueObjectRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.ValueObject.deserializeBinary
);


/**
 * @param {!proto.data.ValueObjectRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.ValueObject)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.ValueObject>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.DataServiceClient.prototype.requestLookup =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.DataService/RequestLookup',
      request,
      metadata || {},
      methodInfo_DataService_RequestLookup,
      callback);
};


/**
 * @param {!proto.data.ValueObjectRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.ValueObject>}
 *     A native promise that resolves to the response
 */
proto.data.DataServicePromiseClient.prototype.requestLookup =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.DataService/RequestLookup',
      request,
      metadata || {},
      methodInfo_DataService_RequestLookup);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.ValueObjectRequest,
 *   !proto.data.ValueObjectList>}
 */
const methodInfo_DataService_RequestLookupList = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.ValueObjectList,
  /** @param {!proto.data.ValueObjectRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.ValueObjectList.deserializeBinary
);


/**
 * @param {!proto.data.ValueObjectRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.ValueObjectList)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.ValueObjectList>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.DataServiceClient.prototype.requestLookupList =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.DataService/RequestLookupList',
      request,
      metadata || {},
      methodInfo_DataService_RequestLookupList,
      callback);
};


/**
 * @param {!proto.data.ValueObjectRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.ValueObjectList>}
 *     A native promise that resolves to the response
 */
proto.data.DataServicePromiseClient.prototype.requestLookupList =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.DataService/RequestLookupList',
      request,
      metadata || {},
      methodInfo_DataService_RequestLookupList);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.data.CalloutRequest,
 *   !proto.data.CalloutResponse>}
 */
const methodInfo_DataService_RequestCallout = new grpc.web.AbstractClientBase.MethodInfo(
  proto.data.CalloutResponse,
  /** @param {!proto.data.CalloutRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.data.CalloutResponse.deserializeBinary
);


/**
 * @param {!proto.data.CalloutRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.data.CalloutResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.data.CalloutResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.data.DataServiceClient.prototype.requestCallout =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/data.DataService/RequestCallout',
      request,
      metadata || {},
      methodInfo_DataService_RequestCallout,
      callback);
};


/**
 * @param {!proto.data.CalloutRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.data.CalloutResponse>}
 *     A native promise that resolves to the response
 */
proto.data.DataServicePromiseClient.prototype.requestCallout =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/data.DataService/RequestCallout',
      request,
      metadata || {},
      methodInfo_DataService_RequestCallout);
};


module.exports = proto.data;

