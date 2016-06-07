(function()
{
    'use strict';

    angular.module('app.colorMap', [])
        .factory( 'colorMap', colorMap );

    function colorMap()
    {
        // --- return functions to read in settings DB ---
        return {
            loadParty: loadParty,
            getPartyColor: getPartyColor,
            getPartyList: computeSortedLabelList,
            calcColorScale: calcColorScale,
            calcTextScale: calcTextScale,
            getTooltip: generateTooltip
        };

        // --- implement all functions linked to return ---
        function loadParty(map, settings, results, parties, max, newParty)
        {
            // console.log("loadParty", map, results, parties,  newParty);
            var color = getPartyColor(settings, parties, newParty);

            // --- use googlemap functions to set the new colors in zones ---
            map.data.setStyle( colorOneVotingZone );

            // --- internal callback ---
            function colorOneVotingZone(feature)
            {
                var zoneResult = getZoneFromPolygon(feature, results);
                if (!zoneResult) {
                    // console.log("could not find voting zone");
                    return {fillColor: settings.emptyColor, fillOpacity: settings.opacity, strokeOpacity: settings.opacity};
                }

                var partyResult = getPartyResult(zoneResult, newParty);
                if (!partyResult) {
                    // console.log("could not find party result");
                    return {fillColor: settings.emptyColor, fillOpacity: settings.opacity, strokeOpacity: settings.opacity};
                }

                var partyRatio = getPartyRatio(partyResult, zoneResult);
                var colorFromScore = getColorFromScore(color, partyRatio, max);
                /*
                if ( isEvo)         colorFromScore = getColorFromEvoScore(score);
                else                colorFromScore = getColorFromScore(focusLabel, score);
                */
                return {fillColor: colorFromScore, fillOpacity: settings.opacity, strokeOpacity: settings.opacity};
            }
        }

        function getPartyColor(settings, parties, party)
        {
            if ( party === "abstention" )   return settings.abstentionColor;
            for ( var index in parties )
            {
                if ( party == parties[index].label )    return parties[index].color;
            }
            return settings.emptyColor;
        }

        function computeSortedLabelList(settings, parties, currentParty, results)
        {
            var output = [];
            var labelDone = {}; // will use the 'Object' to simulate a std::set
            for (var i in results)
            {
                var zoneResult = results[i];
                for ( var j in zoneResult.vz_result_candidates )
                {
                    var partyList = zoneResult.vz_result_candidates[j].party_labels['label'];
                    for ( var k in partyList )
                    {
                        var partyLabel = partyList[k];
                        // if label already set in output, nothing to do
                        if (labelDone.hasOwnProperty(partyLabel)) continue;

                        // output is label + color
                        var outputParty = { "label":partyLabel, "color":getPartyColor(settings, parties, partyLabel) };

                        // set result in output, and set the label as already processed.
                        output.push(outputParty);
                        labelDone[partyLabel] = true;
                    }
                }
            }

            // sort labels according to order set in settings
            output.sort(compareLabel);
            return output;


            // compare defined here in order to access settings variable
            function compareLabel(lhs, rhs)
            {
                // get index in labelOrder for lhs and rhs
                var lindex;
                var rindex;
                for (var i in settings.partyOrder) {
                    if (settings.partyOrder[i] === lhs.label) lindex = i;
                    else if (settings.partyOrder[i] === rhs.label) rindex = i;
                    if (lindex && rindex) break;
                }

                // compare the index
                if (lindex && rindex) return (lindex > rindex);
                // trivial cases
                else if (lindex) return -1;
                else return 1;
            }
        }

        function calcColorScale(settings, parties, party, max)
        {
            var partyColor = getPartyColor(settings, parties, party);
            var output = [];
            for ( var index = 0 ; index < 10 ; ++index )
            {
                var step = (max*index/10);
                var color = getColorFromScore(partyColor, step, max);
                var percentile = { "width":"10%", "opacity":settings.opacity, "background-color":color };
                output.push(percentile);

            }
            return output;
        }

        function calcTextScale(max)
        {
            var output = [];
            for ( var index = 0 ; index <= 10 ; ++index )
            {
                var text = calculateMilestones(index*10, max);
                var left = (index*10 - 5) + "%"
                var right = (95 - index*10) + "%"
                var percentile = { "text":text, "left":left, "right":right };
                output.push(percentile);

            }
            return output;
        }

        function generateTooltip(settings, parties, feature, results)
        {
            // --- find voting zone result related to the cliked polygon ---
            var output = {};
            var vzResult = getZoneFromPolygon(feature, results);
            if ( vzResult )
            {
                // --- loop on party results and fill output object ---
                output['Name'] = feature.getProperty("Name");
                output['partyResults'] = [];
                for ( var i in vzResult.vz_result_candidates )
                {
                    var partyLine = {};
                    var partyResult = vzResult.vz_result_candidates[i];
                    var partyListInResult = partyResult.party_labels['label'];
                    partyLine.label = partyListInResult.join("/");
                    partyLine.color = getPartyColor(settings, parties, partyListInResult[0] );
                    partyLine.ratio_exprimes = getPartyRatio(partyResult, vzResult);
                    output['partyResults'].push(partyLine);
                }

                // --- add abstention ratio to output object ---
                output['non_exprimes_ratio'] = getNonExprimesRatio(vzResult);
            }
            // console.log("tooltip:", output);
            return output;
        }

        // --- implement internal functions ---
        function getZoneFromPolygon(feature, results)
        {
            var vz_id = feature.getProperty("vz_id");
            for ( var i in results )
            {
                if ( vz_id === results[i].vz_id )      return results[i];
            }
            return null;
        }

        function getPartyRatio(partyResult, zoneResult)
        {
            return Math.round(partyResult.voix * 100 / zoneResult.exprimes).toFixed(2);
        }

        function getNonExprimesRatio(zoneResult)
        {
            return Math.round( (zoneResult.inscrits - zoneResult.exprimes) * 100 / zoneResult.inscrits ).toFixed(2);
        }

        function getPartyResult(zoneResult, newParty)
        {
            for ( var i in zoneResult.vz_result_candidates )
            {
                var partyList = zoneResult.vz_result_candidates[i].party_labels['label'];
                if ( partyList.indexOf(newParty) >= 0 )   return zoneResult.vz_result_candidates[i];
            }
            return null;
        }

        function getColorFromScore(color, score, max) {
            var f = chroma.scale(['white', color]).domain([0, max]).classes(10);
            var ocolor = f(score).hex();
            // console.log(score + " : " + ocolor);
            return ocolor;
        }

        function calculateMilestones(step, max)
        {
            return Math.round( step*max/100 );
        }

    }
})();
