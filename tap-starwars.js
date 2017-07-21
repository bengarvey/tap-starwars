
function StarWars() {
  var https = require('https');
  var tutils = require('taputils');
  var tu = new tutils();

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
