function StarWars() {
  var https = require('https');

  var options = {
    host: 'swapi.co',
    port: 443,
    path: 'api/people/?page=1',
    headers: {
      "Content-Type": "application/json"
    }
  };

  var schema = {
    "type": "SCHEMA",
    "stream": "people",
    "key_properties": ["name"],
    "schema": {
      "type": "object",
      "properties": {
        "name": {"type":"string"},
        "height": {"type":"string"},
        "mass": {"type":"string"},
        "hair_color": {"type":"string"},
        "skin_color": {"type":"string"},
        "eye_color": {"type":"string"},
        "gender": {"type":"string"},
        "homeworld": {"type":"string"},
        "created": {"type":"string", "format": "date-time"},
        "edited": {"type":"string", "format": "date-time"},
        "url": {"type":"string"}
      }
    }
  };

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
        records.forEach( function(rec) {
          console.log(JSON.stringify(getRecord(convertRec(rec, schema))));
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
    console.log(JSON.stringify(schema));
    requestData(1);
  }

  return pd;
}

var sw = new StarWars();
sw.getPeople();
