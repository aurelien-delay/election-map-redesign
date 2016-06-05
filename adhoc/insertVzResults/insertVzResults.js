
var connection = require("../../app/connection.js");

var vzResultsToInsert = require("./vzResultsToInsert.json");

console.log("vzResults to insert", vzResultsToInsert);

for ( index in vzResultsToInsert["vzResults"] )
{
    console.log("vzResult to insert", vzResultsToInsert["vzResults"][index]);
    connection.vzResult.create(vzResultsToInsert["vzResults"][index]).then(itisdone);
    function itisdone() { console.log("insert #" + index + " finished"); }
}

function itisdone() { console.log("insert finished"); }
