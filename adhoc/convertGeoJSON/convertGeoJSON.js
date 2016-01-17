var oldjson = require("./bureaux_antibes_2015.json");

// console.log(typeof oldjson);
// console.log(oldjson);

// prepare output
var output = { zones: [] };

// create a list of Feature collection containing only one feature from the old json
for ( var index in oldjson.features)
{
    var feature = oldjson.features[index];
    var finalitem = { vz_id: "06004-" + feature.properties.va_id, settingsName: "antibes" };
    delete feature.va_id;
    finalitem.geojson = {type: "FeatureCollection", features: [feature] };
    output.zones.push(finalitem);
}

console.log(output);
console.log(JSON.stringify(output));




/*
{
  "zones":[
    {
      "vz_id":"06004-101",
      "settingsName":"antibes",
      "geojson":{
        "type":"FeatureCollection",
        "crs":{
          "type":"name",
          "properties":{
            "name":"urn:ogc:def:crs:OGC:1.3:CRS84"
          }
        },
        "features":[
          {
*/
