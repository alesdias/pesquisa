angular.module("appreco").service("LojaService", function($q) {
	
	database.transaction(
		function( transaction ){
			
			transaction.executeSql(
				"CREATE TABLE IF NOT EXISTS lojas (" +
					"id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
					"nome  TEXT NOT NULL,   " +
					"ic_acao        TEXT,   " +
					"id_sincronismo TEXT    " +
				");"
			);

		}
	);
	
	this.incluir = function(nome){
		
		var loja = $q.defer();
        // Insere registro na tabela de produtos
        var query = "INSERT INTO lojas (nome, ic_acao) VALUES ('"+ nome +"', 'I');";
        //console.log('Executando : ' + query);
        
		database.transaction(
            function( transaction ){
                transaction.executeSql(
                    (
                       query
                    ),
                    [],
                    function( transaction, results ){//sucess
                        //callback(results.insertId);
						loja.resolve(results.insertId);
                        console.log('Sucesso : registro gerado ' + results.insertId);
                    },
                    function(transaction, error){
						loja.reject(error);
                        console.log("Erro :" + error.message);
                    }
                );
            }
        ); // fim de : database.transaction(
		
        return loja.promise;
    };
	
	this.deletar = function(id){
        // Insere registro na tabela de produtos
        
		var loja = $q.defer();
        // Insere registro na tabela de produtos
		
		var query = "UPDATE lojas set ic_acao = 'D' where id = " + id;
		//console.log('Executando : ' + query);
        
		database.transaction(
            function( transaction ){
                transaction.executeSql(
                    (
                       query
                    ),
                    [],
                    function( transaction, results ){//sucess
                        //callback(results.insertId);
						loja.resolve();
                        console.log('Sucesso : registro apagado ' + id);
                    },
                    function(transaction, error){
						loja.reject(error);
                        console.log("Erro :" + error.message);
                    }
                );
            }
        ); // fim de : database.transaction(
		
        return loja.promise;
    };
	
	this.listar = function(){
		
		// Gerar uma Promessa de Retorno
		var LojaLista = $q.defer();
		
		database.transaction(
			function( transaction ){
			
				var query      = "SELECT id, nome FROM lojas    WHERE ic_acao <> 'D' ORDER BY nome ASC";
				
				transaction.executeSql(
					(
						query
					),
					[],
					function( transaction, results ){
						//callback( results );
						
						var dados = [];
						var item = {};
						for (var i = 0;i<results.rows.length;i++){
							item = results.rows.item(i);
							dados.push(item);
						};
						
						//resolve a promessa
						LojaLista.resolve(dados);
					}
				);
			}
		);
		
		
		//Retornoa a Promessa
		return LojaLista.promise;
	};
	
});