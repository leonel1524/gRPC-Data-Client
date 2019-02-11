# ADempiere Data Client for gRPC
ADempiere Data Client write in Javascript for gRPC service, use it for connect with
[ADempiere-gRPC-Server](https://github.com/erpcya/adempiere-gRPC-Server).

## Requirements
- [Envoy Proxy](https://www.envoyproxy.io/)
- [Envoy Pre-configured Proxy](https://github.com/erpcya/gRPC-Envoy-Proxy)

## Using it

``` bash
# installing via NPM
npm install @adempiere/grpc-data-client
```
``` bash
# installing via Yarn
yarn add @adempiere/grpc-data-client
```

## A Example
### Declare Data
```javascript
const Data = require('@adempiere/grpc-data-client');
let data = new Data(GRPC_HOST, 'Version Epale');
```
### Declare Data with specific language
```javascript
const Data = require('@adempiere/grpc-data-client');
let data = new Data(GRPC_HOST, 'Version Epale', 'es_VE');
```

### Request a simple Object based on Table and UUID
```javascript
//  Request a single Object
data.requestObject('AD_Element', '8cc49692-fb40-11e8-a479-7a0060f0aa01')
.then(valueObject => {
  console.log("Object with single UUID");
    //  Value
  let map = valueObject.getValuesMap();
  console.log("ColumnName: " + map.get("ColumnName").getStringvalue());
  console.log("Name: " + map.get("Name").getStringvalue());
  console.log("Display Type: " + map.get("AD_Reference_ID").getIntvalue());
  console.log("Value Type: " + map.get("AD_Reference_ID").getValuetype());
})
.catch(err => console.log("Error: " + err.message));
```

Output
```
Object with single UUID
ColumnName: HR_JobOpening_ID
Name: Job Openings
Display Type: 13
Value Type: 0
```

### Request a simple Object based on Criteria for search
```javascript
//  Request a Object from criteria
let criteria = data.getCriteria('C_BPartner');
criteria.setWhereclause("AD_Client_ID = 11");
data.requestObjectFromCriteria(criteria)
.then(valueObject => {
  console.log("Object with criteria C_BPartner table");
  //  Value
  let map = valueObject.getValuesMap();
  console.log("Value: " + map.get("Value").getStringvalue());
  console.log("Name: " + map.get("Name").getStringvalue());
  if(map.get("Name2")) {
      console.log("Name2: " + map.get("Name2").getStringvalue());
  }
  if(map.get("Description")) {
      console.log("Description: " + map.get("Description").getStringvalue());
  }
  console.log("IsVendor: " + map.get("IsVendor").getBooleanvalue());
  console.log("IsCustomer: " + map.get("IsCustomer").getBooleanvalue());
})
.catch(err => console.log("Error: " + err.message));
```

Output
```
Object with criteria C_BPartner table
Value: GardenUser
Name: GardenUser BP
IsVendor: true
IsCustomer: true
```

### Request a Object LIst from criteria (User example)
```javascript
//  Request a Object LIst from criteria
let criteriaForList = data.getCriteria('AD_User');
criteriaForList.setWhereclause("IsLoginUser = 'Y'");
data.requestObjectListFromCriteria(criteriaForList)
.then(valueObject => {
  console.log("Request a Object List from criteria for User table");
  console.log("Record Quantity: " + valueObject.getRecordcount());
  //  Value
  for(var i = 0; i < valueObject.getRecordsList().length; i++) {
    let values = valueObject.getRecordsList()[i];
    let map = values.getValuesMap();
    console.log("Value: " + map.get("Value").getStringvalue());
    console.log("Name: " + map.get("Name").getStringvalue());
    if(map.get("EMail")) {
        console.log("EMail: " + map.get("EMail").getStringvalue());
    }
    if(map.get("Description")) {
      console.log("Description: " + map.get("Description").getStringvalue());
    }
  }
})
.catch(err => console.log("Error: " + err.message));
```

Output
```
quest a Object List from criteria for User table
Record Quantity: 5
Value: GardenAdmin
Name: GardenAdmin
EMail: admin @ gardenworld.com
Description: GardenAdmin
Value: GardenUser
Name: GardenUser
EMail: user @ gardenworld.com
Description: GardenUser
Value: WebService
Name: WebService
Value: SuperUser
Name: SuperUser
Description: Super User with Access to all levels
Value: System
Name: System
Description: ** Do not change **
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
