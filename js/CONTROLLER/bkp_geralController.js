
var geralCtrl = function($scope) {
	
	$scope.log = false;
    $scope.logs = [];  
    $scope.release = "1.60 de 12/07/2017" 
	
	$scope.produtos = [];
	//$scope.dt_pesquisa = utils.getDataAtual();
	
	$scope.inicio = function(){
		alert("inicio");
		
		//$scope.getLojas();
		//$scope.getProdutos();
		//$scope.getPesquisas();
		//$scope.escolhe_loja = true;
		
	};

	/*
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
	
	$scope.findPesquisas = function(id_loja, dt_pesquisa){
		var pesquisa = {id_loja: id_loja, dt_pesquisa: dt_pesquisa}
		
  		var pesquisas = PesquisaService.buscar(pesquisa);
		pesquisas.then(function(resultado){
			//$scope.pesquisas = resultado;
			console.log(resultado);
			var totalCompra = 0;
			for (var i = 0;i<resultado.length;i++){
				totalCompra = totalCompra + (resultado[i].preco * resultado[i].qtd_comprado);
			};
			
            $scope.compras = {"id_loja": id_loja, "dt_pesquisa": dt_pesquisa, "totalCompra": totalCompra, "itens": ""};
            $scope.compras.itens = resultado;

		});
    };
	
	$scope.setPesquisas = function(){
		
		var dt_pesquisa 	= utils.getDataAtual();
		
		var produto 		= {
			barras			: $scope.produto.codigo_barras, 
			nome			: $scope.produto.nome,
			volume			: $scope.produto.volume,
			id_volume 		: $scope.produto.id_volume,
			qtd_embalagem 	: $scope.produto.qtd_embalagem,
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
				Materialize.toast('Pesquisa adicionada ', 3000);
			})
		});
		
		
		

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
	
	$scope.cameraClick = function(){
		var codigoBarras = CameraService.lerCodigoBarras();
		codigoBarras.then(function(resultado){
			alert(resultado);
		});
	};
	*/
}
geralCtrl.$inject = ['$scope'];
angular.module("appreco").controller('geralCtrl', geralCtrl);



