angular.module("appreco").service("ProdutoService", function($q) {
	
	var volumes = [
        {id: 1, nome: "Kilo",       sigla: "Kl",    comparacao: 1},
        {id: 2, nome: "Gramas",     sigla: "g",     comparacao: 100},
        {id: 3, nome: "Litro",      sigla: "Lt",    comparacao: 1},
        {id: 4, nome: "Mililitro",  sigla: "ml",    comparacao: 100},
        {id: 5, nome: "Dúzia",      sigla: "",      comparacao: 1},
        {id: 6, nome: "Unidade",    sigla: "",      comparacao: 1}
    ];
    
	
	database.transaction(
		function( transaction ){
			
			transaction.executeSql(
				"CREATE TABLE IF NOT EXISTS produtos (" +
					"id             INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
					"nome           TEXT NOT NULL,      " +
					"volume         NUMERIC NOT NULL,   " +
					"id_volume      INTEGER NOT NULL,   " +
					"qtd_embalagem  INTEGER NOT NULL,   " +
					"codigo_barras  TEXT,   " +
					"ic_acao        TEXT,   " +
					"id_sincronismo TEXT    " +
				");"
			);

		}
	);
	
	this.buscar = function(produto){
		
		var query = "Select b.id as produto_id, b.nome as produto_nome, b.codigo_barras as produto_barra, "+
			" b.volume as produto_volume, b.id_volume as produto_volumeID, b.qtd_embalagem as produto_qtdEmbalagem, "+
			" a.id as pesquisa_id, a.dt_pesquisa as pesquisa_dt, a.qtd_comprado as pesquisa_qtdComprado, a.valor as produto_valor," +
			" c.nome as loja_nome, c.id as loja_id,"+
			" b.ic_acao as produto_ic, a.ic_acao as pesquisa_ic, c.ic_acao as loja_ic" +
			" FROM produtos b "+
			" INNER JOIN pesquisas a on a.id_produto = b.id" +
			" INNER JOIN lojas c on a.id_loja = c.id" +
			" where b.ic_acao ='I'";
			if (produto.codigo_barras){
				query = query + " and b.codigo_barras = '" + produto.codigo_barras +"'";
			}
			//query = query + " ORDER BY b.nome";
			//console.log(query);
		
				// Gerar uma Promessa de Retorno
		var ProdutoLista = $q.defer();
		//console.log('Entrei em listaProdutos');
		database.transaction(
			function( transaction ){

				//console.log(query);
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
						ProdutoLista.resolve(OrganizaProdutos(dados));
					}
				);
			}
		);

		//Retornoa a Promessa
		return ProdutoLista.promise;
	};
	
	this.listar = function(){
		var 	produto = [];
		return 	this.buscar(produto);
	};
	
	this.incluir = function(produto){
		
		var resultado = $q.defer();
        // Insere registro na tabela de produtos
        var query = "INSERT INTO produtos (nome, volume, id_volume, qtd_embalagem, codigo_barras, ic_acao) VALUES ('"+ produto.nome +"', '"+ produto.volume +"', "+ produto.id_volume +", "+ produto.qtd_embalagem +", '" + produto.barras + "', 'I')";
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
						
						produto.id_produto = results.insertId;
						resultado.resolve(produto);
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
	
	var OrganizaProdutos = function(XP_Produtos){

        var produtos = [];
        var encontrado = false;
        
        XP_Produtos.forEach(function(item) {
                
                // Verifica se o Produto já existe
                produtos.forEach(function(produto){

        
                    encontrado = (produto.barra == item.produto_barra.replace('.',''));
                    if(encontrado){
                        var pesquisa =              {
                                    id:             item.pesquisa_id,  
                                    ic:             item.pesquisa_ic,
                                    data:           item.pesquisa_dt,
                                    qtdComprado:    Number(item.pesquisa_qtdComprado),
                                    valor:          Number(item.produto_valor),
                                    loja:           {
                                        id:             item.loja_id,
                                        nome:           item.loja_nome
                                    }
                                }
                        var pesquisas = [];
                        //pesquisas.push(produto.pesquisas);
                        produto.pesquisas.forEach(function(pesquisado){
                            pesquisas.push(pesquisado);
                        }, this);
                        pesquisas.push(pesquisa);
                        produto.pesquisas = pesquisas;
                        return;
                    }
                })
                
                
                // Adiciona o Produto caso não exista
                if (!encontrado){
                    produto = {

                                id:             item.produto_id,     
                                ic:             item.produto_ic,     
                                barra:          item.produto_barra.replace('.',''),     
                                nome:           item.produto_nome,
                                embalagem:          {
                                                    tipo:           getVolume(item.produto_volumeID), 
                                                    volume:         item.produto_volume, 
                                                    qtd:            Number(item.produto_qtdEmbalagem)
                                                    },
                                valor:          item.produto_valor,
                                pesquisas:          {
                                }                                                                                           
                    }


                    var pesquisa =              {
                                id:             item.pesquisa_id,  
                                ic:             item.pesquisa_ic,
                                data:           item.pesquisa_dt,
                                qtdComprado:    Number(item.pesquisa_qtdComprado),
                                valor:          Number(item.produto_valor),
                                loja:           {
                                    id:             item.loja_id,
                                    nome:           item.loja_nome
                                }
                            }
                    var pesquisas = [];
                    pesquisas.push(pesquisa);
                    produto.pesquisas = pesquisas;

                    produtos.push(produto);


                }

                encontrado = false;
                
        }, this);

        return produtos;
        
    };
		
    var getVolume = function(id){

        //var volumes = volumes;
        var retorno = [];
        volumes.forEach(function(item) {
            if (item.id == id){
                retorno = item;
            }
        }, this);
        return retorno;
    };
	
	
});

