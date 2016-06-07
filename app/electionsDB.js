
module.exports = {
    readElections : readElections
}

function readElections(connection, settingsName, res)
{
    // --- send DB request and wait for resolve before sending reply ---
    var promise = readElectionsDB(connection, settingsName);
    promise.then( returnElections );

    function returnElections(elections)
    {
        console.log("return elections");
        res.json(elections);
    }
}

function readElectionsDB(connection, settingsName)
{
    console.log("read elections attached to settings '" + settingsName + "'");
    // --- return all fields, search for several elections attached to one settings ---
    var findQuery = { where: {settingsName: settingsName} };
    var promise = connection.election.findAll(findQuery);
    return promise;
}
