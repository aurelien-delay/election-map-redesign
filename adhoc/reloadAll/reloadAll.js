var connection = require("../../app/connection.js");

// drop and re-create all tables
connection.sequelize.sync({force: true}).then( okToInsert );

function okToInsert()
{
    console.log("sync finished");
    // fill tables with json file content
    insertOneFile("settings.json", "settings", connection.settings);
    insertOneFile("parties.json", "parties", connection.party);
    insertOneFile("elections.json", "elections", connection.election);
    insertOneFile("votingZones.json", "zones", connection.votingZone);
    insertOneFile("vzResult_Dep2015.json", "vzResults", connection.vzResult);
    insertOneFile("vzResult_Reg2015.json", "vzResults", connection.vzResult);
    insertOneFile("vzResultCand_Dep2015.json", "vzResultCand", connection.vzResultCand);
    insertOneFile("vzResultCand_Reg2015.json", "vzResultCand", connection.vzResultCand);
}


// --- internal functions ---
function insertOneFile(filename, listName, DB)
{
    var file = require("./"+ filename );
    var rowList = file[listName];

    console.log(rowList.lentgh, "rows to insert from", filename);

    for ( index in rowList )
    {
        console.log("row to insert", rowList[index]);
        DB.create(rowList[index]).then(itisdone);
        function itisdone() { console.log("insert row finished"); }
    }
}
