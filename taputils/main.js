module.exports = function() {

  var tu = {};

  tu.getSchema = function(rec, name, id) {
    var schema = {
      "type": "SCHEMA",
      "stream": name,
      "key_properties": [id],
      "schema": {
        "type": "object",
        "properties": inferSchema(rec)
      }
    }
    return schema;
  }

  tu.printSchema = function(rec, name, id) {
    var schema = this.getSchema(rec, name, id);
    console.log(JSON.stringify(schema));
    return schema;
  }

  tu.convertRec = function(rec, schema) {
    var keys = Object.keys(schema.schema.properties);
    var record = {};
    keys.forEach( function(key) {
      record[key] = rec[key];
    });
    return record;
  }

  tu.getRecord = function(rec) {
    return {
      type: "RECORD",
      stream: "people",
      record: rec
    };
  }

  function inferSchema(rec) {
    var keys = Object.keys(rec);
    var properties = {};
    keys.forEach( function(key) {
      properties[key] = inferDatatype(key);
    });
    return properties;
  }

  function isDate(name) {
    var dates = ['created', 'edited', 'created_at', 'updated_at'];
    return dates.indexOf(name) > -1;
  }

  function isCollection(name) {
    var collections = ['planets', 'films', 'species', 'vehicles', 'starships'];
    return collections.indexOf(name) > -1;
  }

  function inferDatatype(name) {
    var type = "";
    if (isDate(name)) {
      type = {"type":"string", "format":"date-time"}
    }
    if (isCollection(name)) {
      type = {"type":"array","items":{"type":"string"}};
    }
    else {
      type = {"type":"string"};
    }
    return type;
  }

  return tu;

}
