
angular.module('datatableApp', ['datatableFilters']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/simpletable',           {templateUrl: 'partials/simpletable.html',   controller: SimpleCtrl}).
        when('/home',                  {templateUrl: 'partials/home.html',          controller: EmptyCtrl}).
        otherwise({redirectTo: '/home'});
    }]
);
