
angular.module("appreco", ["ngRoute"]);

angular.module("appreco", []).directive("home", function() {
    return {
        restrict : "E",
		templateUrl : "paginas/home.html"
    };
})
.directive("lojas", function() {
    return {
        restrict : "E",
		templateUrl : "paginas/lojas.html"
    };
})
.directive("produtos", function() {
    return {
        restrict : "E",
		templateUrl : "paginas/produtos.html"
    };
})
.directive("pesquisas", function() {
    return {
        restrict : "E",
		templateUrl : "paginas/pesquisas.html"
    };
});

