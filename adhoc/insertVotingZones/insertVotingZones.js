var connection = require("../../app/connection.js");

var votingZonesToInsert = require("./votingZonesToInsert.json");

for ( index in votingZonesToInsert["zones"] )
{
    console.log("voting zone to insert", votingZonesToInsert["zones"][index]);
    connection.votingZone.create(votingZonesToInsert["zones"][index]).then(itisdone);
    function itisdone() { console.log("insert #" + index + " finished"); }
}
