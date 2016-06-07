(function()
{
    'use strict';

    angular.module('app', ['app.generalCtrl', 'app.settings', 'app.elections', 'app.parties', 'app.votingZones', 'app.results',
                   'app.colorMap', 'ngRoute'])
    // --- routing ---
    .config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/', { templateUrl: 'views/map.html' });
        $routeProvider.otherwise({redirectTo: '/'});
    }])
})();
