
function StarWars() {
  var https = require('https');
  var tu2 = require('taputils');
  var tu = new tu2();

  console.log(tu);

  var options = {
    host: 'swapi.co',
    port: 443,
    path: 'api/people/?page=1',
    headers: {
      "Content-Type": "application/json"
    }
  };

  var schema = {};
  const PK = 'name';
  const STREAM = 'people';

  /*
  function getSchema(rec, id) {
    var schema = {
      "type": "SCHEMA",
      "stream": "people",
      "key_properties": [id],
      "schema": {
        "type": "object",
        "properties": inferSchema(rec)
      }
    }
    return schema;
  }

  function printSchema(rec, name, id) {
    var schema = getSchema(rec, PK);
    console.log(JSON.stringify(schema));
    return schema;
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

  function getRecord(rec) {
    return {
      type: "RECORD",
      stream: "people",
      record: rec
    };
  }

  function convertRec(rec, schema) {
    var keys = Object.keys(schema.schema.properties);
    var record = {};
    keys.forEach( function(key) {
      record[key] = rec[key];
    });
    return record;
  }

  */

  function requestData(page) {
    options.path = `/api/people/?page=${page}`;
    var req = https.request(options, function(res) {
      var response = "";

      res.on('data', function(d) {
        response += d;
      });

      res.on('end', function(d) {

        var records = JSON.parse(response).results;
        var more = JSON.parse(response).next != null;
        if (page == 1 && records.length > 0) {
          schema = tu.printSchema(records[0], STREAM, PK);
        }
        records.forEach( function(rec) {
          console.log(JSON.stringify(tu.getRecord(tu.convertRec(rec, schema))));
        });

        if (more) {
          requestData(page+1);
        }

      });
    });

    req.end();

    req.on('error', function(e) {
        console.error(e);
    });
  }

  var pd = {};

  pd.getPeople = function() {
    requestData(1);
  }

  return pd;
}

var sw = new StarWars();
sw.getPeople();
