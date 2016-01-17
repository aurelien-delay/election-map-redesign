(function()
{
    'use strict';

    angular.module('app.settings', [])
        .factory( 'accessSettingsDB', getSettingsServices );

    function getSettingsServices($http)
    {
        // --- return functions to read/write in appart DB ---
        return {
            get: getSettings
        };

        // --- implement all functions linked to return ---
        function getSettings()
        {
            console.log("call settings DB");
            return $http.get('/api/settings/');
        }
    }
})();
