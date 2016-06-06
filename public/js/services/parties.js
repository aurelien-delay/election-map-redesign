(function()
{
    'use strict';

    angular.module('app.parties', [])
        .factory( 'accessPartiesDB', getPartiesServices );

    function getPartiesServices($http)
    {
        // --- return functions to read in parties DB ---
        return {
            get: getParties
        };

        // --- implement all functions linked to return ---
        function getParties()
        {
            console.log("call all parties DB");
            return $http.get('/api/parties/');
        }
    }
})();
