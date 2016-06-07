(function()
{
    'use strict';
    angular.module('app')
        .directive('map', ["accessVotingZonesDB","$q", directiveMap]);


    function directiveMap( accessVotingZonesDB, $q )
    {
        return {
            restrict : 'E',
            // controller: 'GeneralCtrl',
            link : linkMap
        };

        // internal function implemented here in order to access dependencies
        function linkMap(scope, element)
        {
            // --- create google map ---
            var options =
            {
                zoom: scope.ctrl.settings.zoom,
                center: {"lat": scope.ctrl.settings.center_lat, "lng": scope.ctrl.settings.center_lng}
            };
            console.info("loading google map with options: ", options, " in element", element );

            scope.ctrl.map = new google.maps.Map(element[0], options);


            // --- load the perimeters ---
            // wait for the controller to be ready with voting IDs from DB.
            scope.ctrl.vz_ids_promise.promise.then( readAndRender );
            function readAndRender() { readAndRenderVotingZonesOneByOne(accessVotingZonesDB, scope.ctrl.map, scope.ctrl.vz_ids); }


            // scope.ctrl.map.data.loadGeoJson(scope.ctrl.settings.map);

            // --- set area default style ---
            scope.ctrl.map.data.setStyle({fillColor: 'black', fillOpacity: scope.ctrl.settings.opacity, strokeOpacity: scope.ctrl.settings.opacity});

            // --- set hover event listening ---
            var listener = scope.ctrl.map.addListener('idle', afterMapLoaded);

            function afterMapLoaded(event) {
                scope.ctrl.map.data.addListener('mouseover', scope.ctrl.openTooltip);
                scope.ctrl.map.data.addListener('mouseout', scope.ctrl.closeTooltip);
                scope.ctrl.map.data.addListener('click', scope.ctrl.fixTooltip);
                // --- once finished, remove this listener ---
                google.maps.event.removeListener(listener);
                console.info("Map is idle", scope.ctrl.map);
            }

            function readAndRenderVotingZonesOneByOne(accessVotingZonesDB, map, votingZoneIDs)
            {
                console.log("read voting zones one by one");
                var promises = [];
                for ( var index in votingZoneIDs )
                {
                    var promise = accessVotingZonesDB.getOne(votingZoneIDs[index].vz_id);
                    promise.success( renderZoneInMap );
                    promises.push(promise);
                }

                return $q.all(promises).then( zonesAreRendered );
                function zonesAreRendered()
                {
                    console.log("Finished rendering voting zones");
                    scope.ctrl.mapPromise.resolve();
                }

                // --- internal functions ---
                function renderZoneInMap(data)
                {
                    // console.log("rendering voting zone", data.vz_id);
                    var geojson = JSON.parse(data.geojson);
                    setVotingZoneIDInFeatures(geojson, data.vz_id);
                    map.data.addGeoJson(geojson);
                }

                function setVotingZoneIDInFeatures(geojson, vz_id)
                {
                    for ( var index in geojson.features )
                    {
                        geojson.features[index].properties.vz_id = vz_id;
                    }
                }
            }
        }

    }
})();
