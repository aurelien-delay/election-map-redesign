(function () {

    'use strict';

    angular.module('app.generalCtrl', [])
        // --- controller ---
        .controller('GeneralCtrl', initMap);

        function initMap(accessSettingsDB, accessElectionsDB, accessPartiesDB, accessVotingZonesDB, accessResultsDB, colorMap, $q, $scope) {
            console.info("GeneralCtrl starts...");

            // --- declared internal variables ---
            var self = this;
            self.settingsName = "antibes-casa"; // hardcoded until we got several....
            self.settings = {};
            self.parties = {};
            self.elections = [];
            self.currentParty = "";
            self.currentElection = "";
            self.currentMaxScore = 0;
            self.vz_ids = [];
            self.results = {};
            self.map = {};
            self.partyList = [];
            self.colorScale = [];
            self.textScale = [];
            self.maxColor = 0;
            self.displayTooltip = false;
            self.tooltipFixed = false;
            self.tooltipVz = {};
            self.electionForEvo1 = null;
            self.electionForEvo2 = null;
            self.resultsForEvo = null;
            self.resultsForEvo1 = null;
            self.resultsForEvo2 = null;
            self.settingsPromise = $q.defer();
            self.mapPromise = $q.defer();
            self.partiesPromise = $q.defer();
            self.resultsPromise = $q.defer();
            self.vz_ids_promise = $q.defer();
            self.searchForEvoPromise = $q.defer();

            // --- provided functions ---
            self.changeElection = changeElection;
            self.displayEvo = displayEvo;
            self.changeParty = changeParty;
            self.changeMaxColor = changeMaxColor;
            self.openTooltip = openTooltip;
            self.closeTooltip = closeTooltip;
            self.fixTooltip = fixTooltip;

            // --- fill internal variables ---
            // BEWARE : map-directive is played at the same time.
            // and will trigger the drawing of the voting zones on google map after the resolution of the vz IDs promise.
            self.initMapFinished = false;
            readSettings();
            readParties();
            readElections();
            readVotingZoneIDs();
            self.settingsPromise.promise.then(readAndLoadElectionResults);


            // functions used in controller init ======================================================================
            function readSettings()     {  accessSettingsDB.get(self.settingsName).success( setSettingsInfo );  }
            function setSettingsInfo(data) {
                console.log("returned settings", data);
                self.settingsPromise.resolve();
                self.settings = data;
                self.currentElection = self.settings.defaultElection;
                self.currentParty = self.settings.defaultParty;
                self.currentMaxScore = self.settings.defaultMaxScore;
                self.initMapFinished = true;
            }

            function readParties()     {  accessPartiesDB.get().success( setParties );  }
            function setParties(data) {
                console.log("returned parties", data);
                self.partiesPromise.resolve();
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
                self.vz_ids_promise.resolve();
                self.vz_ids = data;
            }

            function readAndLoadElectionResults()
            {
                readCurrentElectionResults();
                loadPartyList();
                loadPartyColorSafe();
            }
            function readCurrentElectionResults()
            {
                self.resultsPromise = $q.defer();
                accessResultsDB.get(self.currentElection).success( setCurrentElectionResults );
            }
            function setCurrentElectionResults(data) {
                console.log("returned election results", data);
                self.resultsPromise.resolve();
                self.results = data;
            }

            function loadPartyColorSafe()
            {
                // color voting zones (wait to be safe)
                self.mapPromise.promise.then(checkResults);
                function checkResults() { self.resultsPromise.promise.then(callColorMap); }
                function callColorMap() { colorMap.loadParty(self.map, self.settings, self.results, self.parties, self.currentMaxScore, self.currentParty); }

                // display the color scale
                loadColorScale();
            }

            function loadPartyList()
            {
                self.resultsPromise.promise.then(callPartyList);
                function callPartyList() { self.partyList = colorMap.getPartyList(self.settings, self.parties, self.results);};
            }

            function loadColorScale()
            {
                // load the color scale and its text (wait to be safe)
                self.partiesPromise.promise.then(calcScale);
                function calcScale()
                {
                    self.colorScale = colorMap.calcColorScale(self.settings, self.parties, self.currentParty, self.currentMaxScore);
                    self.textScale = colorMap.calcTextScale(self.currentMaxScore);
                }
            }

            // functions provided by the controller ===================================================================
            function changeElection(button)
            {
                console.log("change election", button);
                self.currentElection = button.election_id;
                readAndLoadElectionResults();
            }

            function displayEvo()
            {
                console.log("display evolution");

                if ( self.elections.length == 2 )
                {
                    self.electionForEvo1 = self.elections[0];
                    self.electionForEvo2 = self.elections[1];
                }

                if ( !self.electionForEvo1 || !self.electionForEvo2 )   return;

                self.searchForEvoPromise = readTwoElectionResults();
                self.searchForEvoPromise.then( colorEvolution );
                function colorEvolution()
                {
                    self.resultsForEvo = colorMap.generateEvoResult(self.settings, self.parties, self.resultsForEvo1, self.resultsForEvo2, self.electionForEvo1, self.electionForEvo2);
                    console.log("Results for evo", self.resultsForEvo);
                }

                function readTwoElectionResults()
                {
                    var promise1 = $q.defer();
                    var promise2 = $q.defer();
                    accessResultsDB.get(self.electionForEvo1.election_id).success( setElectionForEvo1 );
                    accessResultsDB.get(self.electionForEvo2.election_id).success( setElectionForEvo2 );
                    return $q.all([promise1.promise, promise2.promise]);

                    function setElectionForEvo1(data) {
                        console.log("returned election 1 results", data);
                        promise1.resolve();
                        self.resultsForEvo1 = data;
                    }
                    function setElectionForEvo2(data) {
                        console.log("returned election 2 results", data);
                        promise2.resolve();
                        self.resultsForEvo2 = data;
                    }
                }
                // open window to choose 2 elections.
                // then display the diff between the 2 elections......
            }

            function changeParty()
            {
                console.log("change party", self.currentParty);
                loadPartyColorSafe();
            }

            function changeMaxColor()
            {
                console.log("change max color", self.currentMaxScore);
                loadPartyColorSafe();
            }

            function openTooltip(event)
            {
                // open new tooltip only if one is not already fixed
                if ( ! self.tooltipFixed )
                {
                    // make sure results are ready
                    self.resultsPromise.promise.then(generateTooltip);

                    function generateTooltip()
                    {
                        self.displayTooltip = true;
                        self.tooltipVz = colorMap.getTooltip(self.settings, self.parties, event.feature, self.results);
                    }
                    $scope.$apply();
                }
            }

            function closeTooltip(event)
            {
                // close tooltip only if not fixed
                if ( ! self.tooltipFixed )
                {
                    self.displayTooltip = false;
                    $scope.$apply();
                }
            }

            function fixTooltip(event)
            {
                // console.log(event.feature);
                var newName = event.feature.getProperty("Name");
                var oldName;
                if ( self.tooltipFixed )    oldName = self.tooltipFixed.feature.getProperty("Name");

                // area is already fixed, click on same area - stop fixing the tooltip
                if ( self.tooltipFixed && oldName === newName)
                {
                    self.tooltipFixed = null;
                    self.map.data.revertStyle(event.feature);
                }
                // click on another area, fix this one
                else if ( self.tooltipFixed && oldName !== newName)
                {
                    self.map.data.revertStyle();
                    self.tooltipFixed = null;
                    openTooltip(event);
                    self.tooltipFixed = event;
                    self.map.data.overrideStyle(event.feature, {
                        strokeOpacity: 1,
                        strokeColor: 'red',
                        strokeWeight: 5
                    });
                }
                else
                {
                    self.tooltipFixed = event;
                    self.map.data.overrideStyle(event.feature, {
                        strokeOpacity: 1,
                        strokeColor: 'red',
                        strokeWeight: 5
                    });
                }
            }
        }
})();
