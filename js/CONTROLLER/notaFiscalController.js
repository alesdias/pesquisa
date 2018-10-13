angular.module("appreco").controller("notasCntr", function($scope, $http, FormataData) {
	
	
	var cameraLigada = 0;
	
	database.transaction(
		function( transaction ){
			/*
			transaction.executeSql(
			   "DROP TABLE IF EXISTS notas"
			);
			*/

			transaction.executeSql(
					"CREATE TABLE IF NOT EXISTS notas (" +
						"id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
						"dt_compra  	NUMERIC NOT NULL,   " +
						"vl_compra  	NUMERIC NOT NULL,   " +
						"cpf  			NUMERIC NULL,   " +
						"tx_chave  		TEXT NULL,   " +
						"tx_qrcode 		TEXT NULL,   " +
						"ic_acao        TEXT,   " +
						"id_sincronismo TEXT    " +
					");"
			);
		}
	);

	var listaNotas = function(){

		database.transaction(
			function( transaction ){
				transaction.executeSql(
					(
						"SELECT id, dt_compra, vl_compra, cpf, tx_chave, tx_qrcode " + 
						"FROM notas WHERE ic_acao <> 'D' " +
						"ORDER BY dt_compra DESC "
					),
					[],
					function( transaction, results ){
						//callback( results );
						var data = new DataFormata();
						var txt_data = "";
						var dados = [];
						var item = {};
						for (var i = 0; i<results.rows.length; i++){
							item = {};
							item.$$hashKey	= i;
							item.id 		= results.rows.item(i).id;
							item.vl_compra	= results.rows.item(i).vl_compra;
							item.cpf		= results.rows.item(i).cpf;
							item.tx_chave	= results.rows.item(i).tx_chave;
							item.tx_qrcode	= results.rows.item(i).tx_qrcode;
							item.dt_compra 	= data.dataFormata(results.rows.item(i).dt_compra, 'dd/mm/yyyy hh:mm:ss');;
							dados.push(item);
						};
						console.log(dados);
						$scope.notas = dados;
						$scope.$apply();
					
					}
				);
			}
		);
	};
	
	var splitQrCode = function(tx_qrcode){
		var res = tx_qrcode.split("|");
		
		var nota = {id: 1, dt_compra: '', vl_compra: 0, cpf:'', tx_chave: '', tx_qrcode:''}; 
			
		for(var i = 0;i<res.length;i++){
			if(i==0){
				nota.tx_chave = res[i];
			}
			if(i==1){
				nota.dt_compra = res[i];
			}
			if(i==2){
				nota.vl_compra = res[i];
			}
			if(i==3){
				nota.cpf = res[i];
			}
			if(i==4){
				nota.tx_qrcode = res[i];
			}
		}
		
		return nota;
		
		/*
		35170645543915000424590002151420737306422627
		20170625124958
		93.49
		27315151800
		seZjUGBRp7lFJsPGftu30rK3z73MbX8D2G2bni7pWAq9DbsWJ/m4Ws9EFROEXUGffTh7KA1hWN/k0F79RqG+QFPXHbn4JZmC42hFS0h3t4pPugr9Ho+xtanNnYkRdGcJjeAZ1IrQXA+KemaTrdb43kbiD7+/3YoNkfSW+aDaQCVkLIMTF3+v1J4tgWIjshIuohejdQUgZtVFa1v8sdNfR5TSNZAJ0qZ/BBL97jlUP7aQDDsHohZM0AXxLczdN3AkqWRIg/lfTSbYufNN2NA/Y9/taiOoQLlEarHo3/D9okCjZiIE77vj/kKoj2+F3c4hfqDGfgQcnp/zivY/fkMeJA==
		*/
	};

	var salvarNota = function( tx_qrcode, callback ){
		
		var notaFiscal = splitQrCode(tx_qrcode);

		// var data = new DataFormata();
		// notaFiscal.dt_compra = data.dataFormata(notaFiscal.dt_compra, 'dd/mm/yyyy hh:mm:ss');
		// Insere registro na tabela de notas
		var query = "INSERT INTO notas (dt_compra, vl_compra, cpf, tx_chave, tx_qrcode, ic_acao) " + 
			"VALUES ('"+ notaFiscal.dt_compra +"', '"+ notaFiscal.vl_compra +"', '"+ notaFiscal.cpf +"', '"+ notaFiscal.tx_chave +"', '"+ notaFiscal.tx_qrcode +"', 'I')";
		
		database.transaction(
			function( transaction ){
				 transaction.executeSql(
					(
						query 
					),
					[],
					function( transaction, results ){
						//callback( results.insertId );
						listaNotas();
					}
				 )    
			}
		);
		
		
	};
	
	var dataFormata = function(data, formato){
        var yyyy    = sub(data.toString(), 0, 4);
        var mm      = sub(data.toString(), 4, 2);
        var dd      = sub(data.toString(), 6, 2);
        var retorno = formato;
        retorno = retorno.replace("yyyy", yyyy);
        retorno = retorno.replace("mm", mm);
        retorno = retorno.replace("dd", dd);
        return retorno;
    };
	
	var horaFormata = function(data, formato){
        var hh    	= sub(data.toString(), 0, 2);
        var mm      = sub(data.toString(), 2, 2);
        var ss      = sub(data.toString(), 4, 2);
        var retorno = formato;
        retorno = retorno.replace("hh", hh);
        retorno = retorno.replace("mm", mm);
        retorno = retorno.replace("ss", ss);
        return retorno;
    };
	
	var formataDataHora = function(data){
		
		var hora  = sub(data.toString(), 8, 6);
		var data1 = dataFormata(data,'dd/mm/yyyy');
		//hora = horaFormata(hora,'hh:mm:ss')
		return data1 + " " + hora;	
	};
	
    var sub= function(texto, inicio, fim){
        var retorno = texto.substr(inicio, fim);
        return retorno;
    };
	
	$scope.deletaNota = function(idNota){
		var query = "DELETE FROM notas WHERE id = " + idNota;
		//log(query);

		database.transaction(
			function( transaction ){
				 transaction.executeSql(
					(
						query 
					),
					[],
					function( transaction, results ){
						//callback( results.insertId );
						listaNotas();
					}
				 )    
			}
		);
	};
	
	$scope.qrCodeClick = function(){
		
		// 0-Simula Retorno do QRCode para Teste
		// 1-Camera para Scanear QRCode
		if(cameraLigada == 1){
				cordova.plugins.barcodeScanner.scan(
				function (result) {
					if(result.cancelled != 1){
						salvarNota(result.text);
					}
					log("QR Code interpretado\n" +
							"Resultado: " + result.text + "\n" +
							"Formato: " + result.format + "\n" +
							"Cancelado: " + result.cancelled);
				}, 
				function (error) {
					Materialize.toast('Erro ao ler o QRCode: ' + error, 3000);
					log("Erro ao ler o QRCode: " + error);
				},
				{
					"preferFrontCamera" 	: false, // iOS and Android
					"showFlipCameraButton" 	: false, // iOS and Android
					"prompt" 				: "Posisione o QRCode no local indicado.", // supported on Android only
					// "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
					"orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
				}
			);
		}else{
			// Teste Simula retorno da Camera
			var retorno = '35170645543915000424590002151420737306422627|20170625124958|93.49|27315151800|seZjUGBRp7lFJsPGftu30rK3z73MbX8D2G2bni7pWAq9DbsWJ/m4Ws9EFROEXUGffTh7KA1hWN/k0F79RqG+QFPXHbn4JZmC42hFS0h3t4pPugr9Ho+xtanNnYkRdGcJjeAZ1IrQXA+KemaTrdb43kbiD7+/3YoNkfSW+aDaQCVkLIMTF3+v1J4tgWIjshIuohejdQUgZtVFa1v8sdNfR5TSNZAJ0qZ/BBL97jlUP7aQDDsHohZM0AXxLczdN3AkqWRIg/lfTSbYufNN2NA/Y9/taiOoQLlEarHo3/D9okCjZiIE77vj/kKoj2+F3c4hfqDGfgQcnp/zivY/fkMeJA==';
			salvarNota(retorno);	
		}
    };
	
	listaNotas();
	
}); // fim de : angular.module("appreco").controller("pesquisaCntr", function($scope) 