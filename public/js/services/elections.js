(function()
{
    'use strict';

    angular.module('app.elections', [])
        .factory( 'accessElectionsDB', getElectionsServices );

    function getElectionsServices($http)
    {
        // --- return functions to read in elections DB ---
        return {
            get: getElections
        };

        // --- implement all functions linked to return ---
        function getElections(settingsName)
        {
            console.log("call elections DB attached to settings", settingsName);
            return $http.get('/api/elections/' + settingsName);
        }
    }
})();
