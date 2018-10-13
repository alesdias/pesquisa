angular.module("appreco").service("PesquisaService", function($q) {
	
	database.transaction(
		function( transaction ){
			
			transaction.executeSql(
				"CREATE TABLE IF NOT EXISTS pesquisas (" +
					"id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
					"id_loja        INTENGER NOT NULL,   " +
					"id_produto     INTENGER NOT NULL,   " +
					"valor          TEXT NOT NULL,       " +
					"dt_pesquisa    NUMERIC NOT NULL,    " +
					"qtd_comprado   NUMERIC NOT NULL,    " +
					"ic_acao        TEXT,   " +
					"id_sincronismo TEXT    " +
				");"
			);

		}
	);
	
	this.incluir = function(pesquisa){
		
		var resultado = $q.defer();
        // Insere registro na tabela de produtos
        var query = "INSERT INTO pesquisas (id_loja, id_produto, valor, dt_pesquisa, qtd_comprado, ic_acao) "+ 
			"VALUES ("+ pesquisa.id_loja +", "+ pesquisa.id_produto +", "+ pesquisa.preco +", "+ pesquisa.dt_pesquisa +", "+ pesquisa.qtd_comprado +",'I')";
       
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
						resultado.resolve(results.insertId);
                        console.log('Sucesso : registro gerado ' + results.insertId);
                    },
                    function(transaction, error){
						resultado.reject(error);
                        console.log("Erro :" + error.message);
                    }
                );
            }
        ); // fim de : database.transaction(
		
        return resultado.promise;
    };
	
	this.deletar = function(id){
        // Insere registro na tabela de produtos
        
		var pesquisa = $q.defer();
        // Insere registro na tabela de produtos
		
		var query = "UPDATE pesquisas set ic_acao = 'D' where id = " + id;
		console.log('Executando : ' + query);
        
		database.transaction(
            function( transaction ){
                transaction.executeSql(
                    (
                       query
                    ),
                    [],
                    function( transaction, results ){//sucess
                        //callback(results.insertId);
						pesquisa.resolve();
                        console.log('Sucesso : registro apagado ' + id);
                    },
                    function(transaction, error){
						pesquisa.reject(error);
                        console.log("Erro :" + error.message);
                    }
                );
            }
        ); // fim de : database.transaction(
		
        return pesquisa.promise;
    };
	
	this.listar = function(){
		
		// Gerar uma Promessa de Retorno
		var pesquisa = $q.defer();
		
		database.transaction(
			function( transaction ){
			
				var query = "Select b.id, b.nome, a.dt_pesquisa, count(1) as itens, SUM(a.valor * a.qtd_comprado) as totalPago "+ 
					" FROM pesquisas a "+
                    " INNER JOIN lojas b on b.id = a.id_loja "+
                    " INNER JOIN produtos c on c.id = a.id_produto and c.ic_acao <> 'D' "+
                    " WHERE a.qtd_comprado > 0 and a.ic_acao <> 'D'"+
                    " GROUP BY a.dt_pesquisa, b.nome "+
					" ORDER BY a.dt_pesquisa DESC ";
				
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
						pesquisa.resolve(dados);
					}
				);
			}
		);
		
		
		//Retornoa a Promessa
		return pesquisa.promise;
	};
	
	this.buscar = function(pesquisa){
		
		// Gerar uma Promessa de Retorno
		var resultado = $q.defer();
		
		database.transaction(
			function( transaction ){
			
				var query = "Select a.id as id_pesquisa, a.qtd_comprado, (a.valor*1) as preco, b.nome, a.id_produto, b.codigo_barras, b.volume, b.id_volume, b.qtd_embalagem, a.dt_pesquisa "+
                    " FROM pesquisas a "+
                    " INNER JOIN produtos b on a.id_produto = b.id "+
                    " WHERE a.id_loja = " + pesquisa.id_loja +" and a.dt_pesquisa = "+ pesquisa.dt_pesquisa +" and a.qtd_comprado > 0 and a.ic_acao <> 'D'";
				
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
						resultado.resolve(dados);
					}
				);
			}
		);
		
		//Retornoa a Promessa
		return resultado.promise;
	};
	
	this.listarCompras = function(){
				// Gerar uma Promessa de Retorno
		var resultado = $q.defer();
		
		database.transaction(
			function( transaction ){
			
				var query = "Select a.id as id_pesquisa, a.qtd_comprado, (a.valor*1) as preco, b.nome, a.id_produto, b.codigo_barras, b.volume, b.id_volume, b.qtd_embalagem, a.dt_pesquisa "+
                    " FROM pesquisas a "+
                    " INNER JOIN produtos b on a.id_produto = b.id "+
                    " WHERE a.qtd_comprado > 0 and a.ic_acao <> 'D'";
				
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
						resultado.resolve(dados);
					}
				);
			}
		);
		
		//Retornoa a Promessa
		return resultado.promise;
	};
});