(function () {

    'use strict';

    angular.module('app.generalCtrl', [])
        // --- controller ---
        .controller('GeneralCtrl', initMap);

        function initMap(accessSettingsDB, $q, $scope) {
            console.info("GeneralCtrl starts...");

            // --- declared internal variables ---
            var self = this;
            self.serviceName = "antibes"; // hardcoded until we got several....
            self.settings = {};


            // --- fill internal variables ---
            self.initFinished = false;
            readSettings();


            // functions used in controller init ======================================================================
            function readSettings()     {  accessSettingsDB.get(self.serviceName).success( setSettingsInfo );  }
            function setSettingsInfo(data) {
                console.log("returned settings", data);
                self.settings = data;
                self.initFinished = true;
            }
        }
})();
