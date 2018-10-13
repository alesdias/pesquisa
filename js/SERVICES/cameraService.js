angular.module("appreco").service('CameraService', function($q) {
	
 	this.lerCodigoBarras = function(ambienteDev){
		
	 // Gerar uma Promessa de Retorno
		var codigoBarras = $q.defer();
	 	
		if(ambienteDev){
			codigoBarras.resolve("909010");
		}else{
			cordova.plugins.barcodeScanner.scan(
				function (result) {
					if(result.cancelled != 1){
						codigoBarras.resolve(result.text);
					}
				}, 
				function (error) {
					codigoBarras.reject('Erro ao ler o código de barras: ' + error);
				},
				{
					"preferFrontCamera" : false, // iOS and Android
					"showFlipCameraButton" : false, // iOS and Android
					"prompt" : "Posisione o código de barras no local indicado.", // supported on Android only
					// "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
					"orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
				}
			);
		}
	 
		return codigoBarras.promise;
    };
});