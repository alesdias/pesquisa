
var geralCtrl = function($scope, $http, $q, utils, ProdutoService, LojaService, PesquisaService, CameraService, ArquivoService) {
	
	$scope.ambienteDev = false;
	$scope.log = false;
    $scope.logs = [];  
	$scope.release = "1.60 de 12/07/2017";
	$scope.produtoNaoEncontrado = true;
	$scope.produtoEncontrado 	= false;
	$scope.produtos = [];
	$scope.listas = []; 
	
	$scope.configAmbiente = function(){
		if($scope.ambienteDev){
			$scope.ambienteDev = false;
		}else{
			$scope.ambienteDev = true;
		}
	};
	
	$scope.inicio = function(){
		$scope.getLojas();
		$scope.getProdutos();
		$scope.getPesquisas();
		$scope.escolhe_loja = true;
	};

	$scope.getProdutos = function(){	
		var produtos = ProdutoService.listar();
		produtos.then(function(resultado){
			$scope.produtos = resultado;
		});
	}
	
	$scope.findProdutos = function(produto){	
		var produtos = ProdutoService.buscar(produto);
		produtos.then(function(resultado){
			$scope.produtos = resultado;
		});
	}
	
	$scope.getPesquisas = function(){	
		var pesquisas = PesquisaService.listar();
		pesquisas.then(function(resultado){
			$scope.pesquisas = resultado;
		});
	}
	
	$scope.setPesquisas = function(){
		
		var dt_pesquisa 	= utils.getDataAtual();
		
		var produto 		= {
			barras			: $scope.produto.barra, 
			nome			: $scope.produto.nome,
			volume			: $scope.produto.embalagem.volume,
			id_volume 		: $scope.produto.embalagem.tipo.id,
			qtd_embalagem 	: $scope.produto.embalagem.qtd,
			qtd_comprado	: $scope.produto.qtd_comprado,
			preco			: $scope.produto.preco,
			id_loja			: $scope.loja.id,
			dt_pesquisa		: dt_pesquisa,
			id_produto		: 0
		};
		
		var gravaProduto = ProdutoService.incluir(produto);
		gravaProduto.then(function(produtoGravado){

			var gravaPesquisa = PesquisaService.incluir(produtoGravado);
			gravaPesquisa.then(function(pesquisaGravado){
				$scope.findPesquisas(produtoGravado.id_loja, produtoGravado.dt_pesquisa);
				$scope.cancelPesquisas();
				$scope.getPesquisas();
				$scope.apply;
				Materialize.toast('Pesquisa adicionada ', 3000);
			})
		});
		
	};
	
	$scope.findPesquisas = function(id_loja, dt_pesquisa){
		var pesquisa = {id_loja: id_loja, dt_pesquisa: dt_pesquisa}
		
  		var pesquisas = PesquisaService.buscar(pesquisa);
		pesquisas.then(function(resultado){
			//$scope.pesquisas = resultado;
			var totalCompra = 0;
			for (var i = 0;i<resultado.length;i++){
				totalCompra = totalCompra + (resultado[i].preco * resultado[i].qtd_comprado);
			};
			
            $scope.compras = {"id_loja": id_loja, "dt_pesquisa": dt_pesquisa, "totalCompra": totalCompra, "itens": ""};
            $scope.compras.itens = resultado;

		});
    };
	
	$scope.cancelPesquisas = function(){
		$scope.produtoNaoEncontrado = true;
		$scope.produtoEncontrado 	= false;
		$scope.produto = []; 
	};
	
	$scope.delPesquisaItem = function(id_pesquisa){
		var delPesquisa = PesquisaService.deletar(id_pesquisa);
		delPesquisa.then(function(resultado){
			$scope.findPesquisas($scope.compras.id_loja, $scope.compras.dt_pesquisa);
			$scope.getPesquisas();
		})
		
    };
	
	$scope.getLojas = function(){	
		var lojas = LojaService.listar();
		lojas.then(function(resultado){
			$scope.lojas = resultado;
			//Materialize.toast('Loja pesquisadas'  , 3000);
		});  
	}
	
	$scope.setLojas = function(nome){	
		var lojas = LojaService.incluir(nome);
		lojas.then(function(resultado){
			$scope.getLojas();
			$scope.loja = {};
			Materialize.toast('Loja adicionada'  , 3000);
		});
	}
		
	$scope.delLojas = function(id){	
		var lojas = LojaService.deletar(id);
		lojas.then(function(resultado){
			$scope.getLojas();
			Materialize.toast('Loja deletada'  , 3000);
		});
	}
	
	$scope.desfazEscolha = function(passo){
        $scope.escolhe_loja     = false;
        $scope.loja_escolhida   = false;
        $scope.escolhe_produto  = false;
        $scope.produto_escolhido= false;
        $scope.digita_valor     = false;
        if(passo == 1){
            $scope.escolhe_loja     = true;
        }
        if(passo == 2){
            $scope.loja_escolhida   = true;
            $scope.escolhe_produto  = true;
        }
        
    }
    
    $scope.defineLoja = function(loja, dt_pesquisa){
        $scope.loja = loja;
        $scope.escolhe_loja     = false;
        $scope.loja_escolhida   = true;
        $scope.escolhe_produto  = true;
        $scope.produto_escolhido= false;
        $scope.digita_valor     = false;
        if(dt_pesquisa){
            $scope.findPesquisas(loja.id, dt_pesquisa);
        }else{
            $scope.findPesquisas(loja.id, utils.getDataAtual());
        } 
    };

    $scope.detalhePesquisa = function(id, nome, dt_pesquisa){
        var loja = {"id": id, "nome": nome};
        $scope.defineLoja(loja, dt_pesquisa);
    };
	
	$scope.dataFormat = function(data, formato){
        return utils.dataFormat(data, formato);
    };
	
	$scope.calcularValor = function(valor, volume, embalagem){
        return (((valor / embalagem.volume) / embalagem.qtd) * embalagem.tipo.comparacao);
	};

    $scope.calcularValorUnidade = function(valor, volume, embalagem){
		return (valor / embalagem.qtd);
	};
	
	$scope.trataPesquisas = function(produto){
		
		var pesquisas = produto.pesquisas;
		var resultado = {ultima : pesquisas[0], maior: pesquisas[0], menor: pesquisas[0]};
		

		for(var x=1; x < produto.pesquisas.length; x++){
			if (pesquisas[x].data > resultado.ultima.data){
				resultado.ultima = pesquisas[x];
			}
			if (pesquisas[x].valor > resultado.maior.valor){
				resultado.maior = pesquisas[x];
			}
			if (pesquisas[x].valor < resultado.menor.valor){
				resultado.menor = pesquisas[x];
			}
		}
		
		produto.pesquisas= [];
		produto.pesquisas.resumo = [];
		produto.pesquisas.resumo.push({classe: "Última", pesquisa : resultado.ultima});
		produto.pesquisas.resumo.push({classe: "Menor Valor", pesquisa : resultado.menor});
		produto.pesquisas.resumo.push({classe: "Maior Valor", pesquisa : resultado.maior});
		console.log(produto.pesquisas.resumo);
		return produto;
	};
	
	$scope.cameraClick = function(){
		var codigoBarras = "";
		var produto = "";
		var codigoBarras = CameraService.lerCodigoBarras($scope.ambienteDev);
		codigoBarras.then(function(resultado){
			codigoBarras = resultado;
			produto = {codigo_barras: codigoBarras};
			var BuscaProduto = ProdutoService.buscar(produto);
			BuscaProduto.then(function(resultado){
				if(resultado.length == 1){
					$scope.produtoNaoEncontrado = false;
					$scope.produtoEncontrado 	= true;
					$scope.produto = $scope.trataPesquisas(resultado[0]); 
					//console.log($scope.produto );
					Materialize.toast('Produtos encontrato.'  , 3000);
				}else if(resultado.length > 1){
					Materialize.toast('Vários produtos encontrato.'  , 3000);
				}else{
					$scope.cancelPesquisas();
					$scope.produto.barra = codigoBarras;
					Materialize.toast('Produto não encontrato.'  , 3000);
				}
			});
		});
	};
	
	$scope.addLista = function(lista, id_grupo){
		if (id_grupo = ""){
			id_grupo = 0;
		}
		
		var lista = [];
		lista.push({id: 3});
		lista.push({id: 1});
		alert(Math.max(lista));
		/*
		
		var itens = Listas[id_grupo].itens;	
		var id = itens.length + 1;
		var iten = {id: id, nome: lista};
			Listas[id_grupo].itens.push(iten);
		*/
	};
	
	$scope.gerarArquivo = function(){
		log('tentando escrever o arquivo');
        ArquivoService.writeToFile('pesquisaDados.json', $scope.produtos);
	};
	
	$scope.enviaEmail = function(){
		var pathToFile = cordova.file.dataDirectory + 'pesquisaDados.json';
        var data = utils.getDataAtual();
        var textoEmail = 'Segue arquivos do APP Preço <br><br>'+
                         'Data do Arquivo : ' + utils.dataFormat(data,'dd/mm/yyyy');
        cordova.plugins.email.open({
            to:             'alesdias@yahoo.com.br',
            subject:        'Arquivo de Dados do APPreço',
            attachments:    pathToFile,
            body:           textoEmail,
            isHtml:         true
        });
	};
}
geralCtrl.$inject = ['$scope', '$http', '$q', 'utils', 'ProdutoService', 'LojaService', 'PesquisaService', 'CameraService'];
angular.module("appreco").controller('geralCtrl', geralCtrl);



