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
            loadEvolution: loadEvolution,
            generateEvoResult: generateEvoResult,
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

        function generateEvoResult(settings, parties, results1, results2, election1, election2)
        {
            console.log("Start generateEvoResult");
            var output = [];
            // --- first sort elections by date ---
            var res1 = results1;
            var res2 = results2;
            if ( election1.electionDate < election2.electionDate ) { res2 = results1;  res1 = results2; }

            // --- determine the list of parties present in both results ---
            // the ones in only one of them won't be part of the output
            var partiesInBoth = computeLabelListInBoth(settings, parties, res1, res2);

            // --- Inside each voting zone, for each party, compute the diff of exprimes ratio ---
            for ( var i in res1 )
            {
                var vz_result1 = res1[i];
                var vz_result2 = findResultForSameVotingZone(vz_result1.vz_id, res2);
                if ( !vz_result2 )      continue;

                for ( var j in partiesInBoth )
                {
                    var partyInRes1 = findPartyResult(partiesInBoth[j], vz_result1);
                    var partyInRes2 = findPartyResult(partiesInBoth[j], vz_result2);
                    if ( !partyInRes1 || !partyInRes2 )     continue;

                    var exprimesRatio1 = getPartyRatio(partyInRes1, vz_result1);
                    var exprimesRatio2 = getPartyRatio(partyInRes2, vz_result2);
                    output.push({"vz_id":vz_result1.vz_id, "diff": (exprimesRatio2 - exprimesRatio1)});
                }
            }
            console.log("Finish generateEvoResult");
            return output;
        }

        function loadEvolution(map, settings, parties, results1, results2, party)
        {
            // console.log("loadParty", map, results, parties,  newParty);
            var color = getPartyColor(settings, parties, newParty);

            // --- use googlemap functions to set the new colors in zones ---
            map.data.setStyle( colorOneVotingZone );
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

        function computeSortedLabelList(settings, parties, results)
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
            return (partyResult.voix * 100 / zoneResult.exprimes).toFixed(2);
        }

        function getNonExprimesRatio(zoneResult)
        {
            return ( (zoneResult.inscrits - zoneResult.exprimes) * 100 / zoneResult.inscrits ).toFixed(2);
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

        function computeLabelListInBoth(settings, parties, res1, res2)
        {
            var output = [];
            var partyList1 = computeSortedLabelList(settings, parties, res1);
            var partyList2 = computeSortedLabelList(settings, parties, res2);

            for ( var i in partyList1 )
            {
                for ( var j in partyList2 )
                {
                    if ( partyList1[i]['label'] == partyList2[j]['label'] )   output.push(partyList1[i]['label']);
                }
            }
            return output;
        }

        function findResultForSameVotingZone(vz_id, results)
        {
            for ( var i in results )
            {
                if ( vz_id === results[i].vz_id )   return results[i];
            }
            return null;
        }

        function findPartyResult(party, vz_result)
        {
            for ( var i in vz_result.vz_result_candidates )
            {
                var partyList = vz_result.vz_result_candidates[i]['label'];
                for ( var j in partyList )
                {
                    if ( party === partyList[j] )       return vz_result.vz_result_candidates[i];
                }
            }
            return null;
        }
    }
})();
