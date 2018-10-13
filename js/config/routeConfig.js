angular.module("appreco").config(function($routeProvider,$compileProvider) {

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|mailto|chrome-extension|filesystem|filesystem:chrome-extension‌​|blob:chrome-extension|cust-scheme):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|mailto|chrome-extension|filesystem|filesystem:chrome-extension‌​|blob:chrome-extension|cust-scheme):/);
    
    $routeProvider
    .when("/", {
        templateUrl : "paginas/home.html"
    })
    .when("lojas", {
        templateUrl : "paginas/lojas.html"
    })
    .when("/produtos", {
        templateUrl : "paginas/produtos.html"
    })
    .when("/pesquisas", {
        templateUrl : "paginas/pesquisas.html"
    })
    .when("/config", {
        templateUrl : "paginas/config.html"
    });
    $routeProvider.otherwise({redirectTo: "/"});

});
