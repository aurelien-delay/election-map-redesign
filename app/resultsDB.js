
var Q = require('q');

module.exports = {
    readElectionResults : readElectionResults
}

function readElectionResults(connection, election_id, res)
{
    // --- this is a search in 2 steps : first the general results, then all the candidates results ---
    console.log("Starting general results search.");

    // --- step 1 : the general result for the input voting zone/election ---
    var promiseGen = readAllGenResult(connection, election_id);
    promiseGen.then( searchCandResults );

    function searchCandResults(genResults)
    {
        console.log("Got the general results, starting candidate results search.");
        // --- loop on all voting zones in general results, and search the corresponding candidates results ---
        var candPromises = [];
        for ( vz in genResults )
        {
            var promiseCand = readCandResults(connection, genResults[vz].vz_result_id);
            candPromises.push(promiseCand);
            promiseCand.then( mergeWithGenResult );
            function mergeWithGenResult(candResults) { genResults[vz].dataValues.candidateResults = candResults; }
        }

        Q.all(candPromises).then(returnAllResults);

        function returnAllResults()
        {
            console.log("Got all the general and candidates results. reply.");
            res.json(genResults);
        }
    }
}

function readAllGenResult(connection, election_id)
{
    console.log("read all general results for election", election_id);
    // --- return all fields, search for several results  with input election ---
    var findQuery = { where: {election_id: election_id} };
    var promise = connection.vzResult.findAll(findQuery);
    return promise;
}

function readCandResults( connection, vz_result_id )
{
    console.log("read candidate results linked to one voting zone result", vz_result_id);
    // --- return all fields, search for several results  with input voting zone general result ID ---
    var findQuery = { where: {vz_result_id: vz_result_id} };
    var promise = connection.vzResultCand.findAll(findQuery);
    return promise;
}
