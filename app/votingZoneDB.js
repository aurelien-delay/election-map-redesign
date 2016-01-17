
module.exports = {
    readVotingZonesID : readVotingZonesID,
    readOneVotingZone : readOneVotingZone
}

function readVotingZonesID(connection, settingsName, res)
{
    // --- send DB request and wait for resolve before sending reply ---
    var promise = readVotingZonesIDDB(connection, settingsName);
    promise.then( returnVotingZonesID );

    function returnVotingZonesID(votingZoneIDs)
    {
        console.log("return voting zone ID", votingZoneIDs );
        res.json(votingZoneIDs);
    }
}

function readVotingZonesIDDB(connection, settingsName)
{
    console.log("read voting zone IDs matching settings name '" + settingsName + "'");
    // --- return just the voting zone ID, search for all voting zones matching the input settings name ---
    var findQuery = { attributes: ['vz_id'], where: {settingsName: settingsName} };
    var promise = connection.votingZone.findAll(findQuery);
    return promise;
}


function readOneVotingZone(connection, vz_id, res)
{
    // --- send DB request and wait for resolve before sending reply ---
    var promise = readOneVotingZoneDB(connection, vz_id);
    promise.then( returnVotingZone );

    function returnVotingZone(votingZone)
    {
        console.log("return voting zone", votingZone );
        res.json(votingZone);
    }
}

function readOneVotingZoneDB(connection, vz_id)
{
    console.log("read voting zone with ID '" + vz_id + "'");
    // --- return all fields, search for the voting zone matching the input ID ---
    var findQuery = { where: {vz_id: vz_id} };
    var promise = connection.votingZone.findOne(findQuery);
    return promise;
}
