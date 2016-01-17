(function()
{
    'use strict';

    angular.module('app', ['app.generalCtrl', 'app.settings', 'ngRoute'])
    // --- routing ---
    .config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when('/', { templateUrl: 'views/map.html' });
        $routeProvider.otherwise({redirectTo: '/'});
    }])
})();
