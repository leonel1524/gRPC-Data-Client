# ADempiere Data Client for gRPC
ADempiere Data Client write in Javascript for gRPC service, use it for connect with
[ADempiere-gRPC-Server](https://github.com/erpcya/adempiere-gRPC-Server).
## Using it

``` bash
# installing
npm install @adempiere/grpc-data-client --save
```

## A Example
### Declare Dictionary
```javascript
const Data = require('@adempiere/grpc-data-client');
let data = new Data('Version Epale', GRPC_HOST);
```
### Declare Dictionary with specific language
```javascript
const Data = require('@adempiere/grpc-data-client');
let data = new Data('Version Epale', GRPC_HOST, 'es_VE');
```

### Request a simple Object based on Table and UUID
```javascript
//  Value Object Request
data.requestObject('AD_Element', '8cc49692-fb40-11e8-a479-7a0060f0aa01')
.then(valueObject => {
  console.log("Value Object: " + valueObject);
})
.catch(err => {
  console.log("Error " + err.code + ": " + err.message);
});
```
## Recreate proto stup class (only for contribute to project)
For recreate stup class you must have follow:
- [protobuf](https://github.com/protocolbuffers/protobuf/releases)
- [protoc](https://github.com/grpc/grpc-web/releases)
- Also you can see it: [gRPC-web](https://github.com/grpc/grpc-web)
- [gRPC](https://grpc.io/docs/tutorials/basic/web.html)
After installed it just go to source code folder an run it:
```
protoc proto/data.proto \
--js_out=import_style=commonjs:src/grpc \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:src/grpc
```
The result is generated on: src/grpc folder
