
module.exports = {
    readParties : readParties
}

function readParties(connection, res)
{
    // --- send DB request and wait for resolve before sending reply ---
    var promise = readPartiesDB(connection);
    promise.then( returnParties );

    function returnParties(parties)
    {
        console.log("return parties", parties);
        res.json(parties);
    }
}

function readPartiesDB(connection)
{
    console.log("read all parties");
    // --- return all fields, search for all parties ---
    var promise = connection.party.findAll();
    return promise;
}
