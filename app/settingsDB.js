
module.exports = {
    readSettings : readSettings
}

function readSettings(connection, settingsName, res)
{
    // --- send DB request and wait for resolve before sending reply ---
    var promise = readSettingsDB(connection, settingsName);
    promise.then( returnSettings );

    function returnSettings(settings)
    {
        console.log("return settings");
        res.json(settings);
    }
}

function readSettingsDB(connection, settingsName)
{
    console.log("read settings with name '" + settingsName + "'");
    // --- return all fields, search for one settings with input name ---
    var findQuery = { where: {settingsName: settingsName} };
    var promise = connection.settings.findOne(findQuery);
    return promise;
}
