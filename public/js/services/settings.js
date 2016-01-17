(function()
{
    'use strict';

    angular.module('app.settings', [])
        .factory( 'accessSettingsDB', getSettingsServices );

    function getSettingsServices($http)
    {
        // --- return functions to read in settings DB ---
        return {
            get: getSettings
        };

        // --- implement all functions linked to return ---
        function getSettings(settingsName)
        {
            console.log("call settings DB with name", settingsName);
            return $http.get('/api/settings/' + settingsName);
        }
    }
})();
