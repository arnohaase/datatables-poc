
angular.module('datatableApp', ['datatable']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/simpletable',           {templateUrl: 'partials/simpletable.html',   controller: SimpleCtrl}).
        when('/simplepaging',          {templateUrl: 'partials/simplepaging.html',  controller: PagingCtrl}).
        when('/sortable',              {templateUrl: 'partials/sortable.html',      controller: PagingCtrl}).
        when('/home',                  {templateUrl: 'partials/home.html',          controller: EmptyCtrl}).
        otherwise({redirectTo: '/home'});
    }]
);
