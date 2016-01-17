(function () {

    'use strict';

    angular.module('app.generalCtrl', [])
        // --- controller ---
        .controller('GeneralCtrl', initMap);

        function initMap(accessSettingsDB, $q, $scope) {
            console.info("GeneralCtrl starts...");

            // --- declared internal variables ---
            var self = this;
            self.settings = {};


            // --- fill internal variables ---
            readSettings();

            // --- functions used in controller init ---
            function readSettings()
            {
                accessSettingsDB.get().success( setSettingsInfo );
            }

            function setSettingsInfo(data)
            {
                console.log("returned settings", data);
                self.settings = data;
            }
        }
})();
