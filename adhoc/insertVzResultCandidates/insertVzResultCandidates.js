
var connection = require("../../app/connection.js");

var vzResultCandToInsert = require("./vzResultCandToInsert.json");

console.log("vzResultCand to insert", vzResultCandToInsert);

for ( index in vzResultCandToInsert["vzResultCand"] )
{
    console.log("vzResultCand to insert", vzResultCandToInsert["vzResultCand"][index]);
    connection.vzResultCand.create(vzResultCandToInsert["vzResultCand"][index]).then(itisdone);
    function itisdone() { console.log("insert #" + index + " finished"); }
}

function itisdone() { console.log("insert finished"); }
