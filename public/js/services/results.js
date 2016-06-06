(function()
{
    'use strict';

    angular.module('app.results', [])
        .factory( 'accessResultsDB', getResultsServices );

    function getResultsServices($http)
    {
        // --- return functions to read in parties DB ---
        return {
            get: getElectionResults
        };

        // --- implement all functions linked to return ---
        function getElectionResults(election_id)
        {
            return $http.get('/api/results/' + election_id);
        }
    }
})();
