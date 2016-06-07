
var Q = require('q');

module.exports = {
    readElectionResults: readElectionResults
}

function readElectionResults(connection, election_id, res)
{
    var promise = readAllResults(connection, election_id);
    promise.then( returnResults );

    function returnResults(data)
    {
        console.log("Got all the general and candidates results. reply. XXXX");
        res.json(data);
    }
}

function readAllResults(connection, election_id)
{
    console.log("read all results (general + candidate in foreign table) for election", election_id);
    // --- return all fields, search for several results  with input election ---
    var findQuery = { where: {election_id: election_id}, include: [{model: connection.vzResultCand}] };
    var promise = connection.vzResult.findAll(findQuery);

    return promise;
}
