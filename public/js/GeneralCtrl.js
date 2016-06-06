(function () {

    'use strict';

    angular.module('app.generalCtrl', [])
        // --- controller ---
        .controller('GeneralCtrl', initMap);

        function initMap(accessSettingsDB, accessElectionsDB, accessPartiesDB, accessVotingZonesDB, accessResultsDB, $q, $scope) {
            console.info("GeneralCtrl starts...");

            // --- declared internal variables ---
            var self = this;
            self.settingsName = "antibes-casa"; // hardcoded until we got several....
            self.settings = {};
            self.parties = {};
            self.elections = [];
            self.currentElection = "";
            self.vz_ids = [];
            self.current_election_results = {};
            self.map = {};;

            // --- provided functions ---
            self.changeElection = changeElection;
            self.displayEvo = displayEvo;
            self.electionLoadedPromise = electionLoadedPromise;


            // --- fill internal variables ---
            self.initMapFinished = false;
            self.settingsPromise = readSettings();
            readParties();
            readElections();
            self.settingsPromise.success(readElectionResults);
            self.vz_ids_promise = readVotingZoneIDs();

            electionLoadedPromise().then( function(){console.log("election load finished");});


            // functions used in controller init ======================================================================
            function readSettings()     {  return accessSettingsDB.get(self.settingsName).success( setSettingsInfo );  }
            function setSettingsInfo(data) {
                console.log("returned settings", data);
                self.settings = data;
                self.currentElection = self.settings.defaultElection;
                self.initMapFinished = true;
            }

            function readParties()     {  accessPartiesDB.get().success( setParties );  }
            function setParties(data) {
                console.log("returned parties", data);
                self.parties = data;
            }

            function readElections()    { accessElectionsDB.get(self.settingsName).success( setElections ); }
            function setElections(data) {
                console.log("returned elections", data);
                self.elections = data;
            }

            function readVotingZoneIDs()    {   return accessVotingZonesDB.getIDs(self.settingsName).success( setVotingZoneIDsInfo ); }
            function setVotingZoneIDsInfo(data) {
                console.log("returned voting zones IDs", data);
                self.vz_ids = data;
            }

            function readElectionResults()    { self.current_election_promise = accessResultsDB.get(self.currentElection).success( setCurrentElectionResults ); }
            function setCurrentElectionResults(data) {
                console.log("returned election results", data);
                self.current_election_results = data;
            }

            // functions provided by the controller ===================================================================
            function changeElection(button)
            {
                console.log("change election", button);
                self.currentElection = button.election_id;
                readElectionResults();
            }

            function displayEvo()
            {
                console.log("display evolution");
                // open window to choose 2 elections.
                // then display the diff between the 2 elections......
            }

            function electionLoadedPromise()
            {
                // because first load of election must be made after settings are loaded,
                // variable self.current_election_promise may only exists if settings Promise is resolved
                // So we should check both promise to make sure the current election is loaded.
                var promise = $q.defer();
                self.settingsPromise.success( checkResultsSearch );
                function checkResultsSearch(){ self.current_election_promise.success( giveGo ); }
                function giveGo() { promise.resolve(); }
                return promise.promise;
            }
        }
})();
