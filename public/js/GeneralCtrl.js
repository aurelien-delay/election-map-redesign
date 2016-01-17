(function () {

    'use strict';

    angular.module('app.generalCtrl', [])
        // --- controller ---
        .controller('GeneralCtrl', initMap);

        function initMap(accessSettingsDB, accessVotingZonesDB, $q, $scope) {
            console.info("GeneralCtrl starts...");

            // --- declared internal variables ---
            var self = this;
            self.serviceName = "antibes-casa"; // hardcoded until we got several....
            self.settings = {};
            self.vz_ids = [];


            // --- fill internal variables ---
            self.initMapFinished = false;
            readSettings();
            self.vz_ids_promise = readVotingZoneIDs();
            self.vz_ids_promise.success( setVotingZoneIDsInfo );


            // functions used in controller init ======================================================================
            function readSettings()     {  accessSettingsDB.get(self.serviceName).success( setSettingsInfo );  }
            function setSettingsInfo(data) {
                console.log("returned settings", data);
                self.settings = data;
                self.initMapFinished = true;
            }

            function readVotingZoneIDs()    {   return accessVotingZonesDB.getIDs(self.serviceName);  }
            function setVotingZoneIDsInfo(data) {
                console.log("returned voting zones IDs", data);
                self.vz_ids = data;
            }
        }
})();
