(function()
{
    'use strict';

    angular.module('app.votingZones', [])
        .factory( 'accessVotingZonesDB', getVotingZonesServices );

    function getVotingZonesServices($http)
    {
        // --- return functions to read in voting zones DB ---
        return {
            getIDs: getVotingZoneIDs,
            getOne: getVotingZone

        };

        // --- implement all functions linked to return ---
        function getVotingZoneIDs(settingsName)
        {
            console.log("call voting zones DB with settings name", settingsName);
            return $http.get('/api/votingzonesid/' + settingsName);
        }

        function getVotingZone(vz_id)
        {
            console.log("call voting zones DB with ID", vz_id);
            return $http.get('/api/votingzone/' + vz_id);
        }
    }
})();
