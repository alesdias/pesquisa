
angular.module("appreco").controller("pesquisaCntr", function($scope, $http) {
    
    var queryLojas      = "SELECT * FROM lojas    WHERE ic_acao <> 'D' ORDER BY nome ASC";
    var queryProdutos   = "SELECT a.nome, a.id, a.volume, a.id_volume, a.codigo_barras, count(b.id) as pesquisas "+
                          " FROM produtos a INNER JOIN pesquisas b on a.id = b.id_produto WHERE a.ic_acao <> 'D' " +
                          " GROUP BY a.nome, a.id, a.volume, a.id_volume, a.codigo_barras" +
                          " ORDER BY a.nome ASC";

    $scope.log = false;
    $scope.logs = [];  
    $scope.release = "1.51 de 02/07/2017" 

    $scope.volumes = [
        {id: 1, nome: "Kilo",       sigla: "Kl",    comparacao: 1},
        {id: 2, nome: "Gramas",     sigla: "g",     comparacao: 100},
        {id: 3, nome: "Litro",      sigla: "Lt",    comparacao: 1},
        {id: 4, nome: "Mililitro",  sigla: "ml",    comparacao: 100},
        {id: 5, nome: "Dúzia",      sigla: "",      comparacao: 1},
        {id: 6, nome: "Unidade",    sigla: "",      comparacao: 1}
    ];
    
    $scope.escolhe_loja     = true;
    $scope.loja_escolhida   = false;
    $scope.escolhe_produto  = false;
    $scope.produto_escolhido= false;
    $scope.digita_valor     = false;

    
    $scope.getDataAtual = function () {
        var date    = new Date();
        var yyyy    = date.getFullYear().toString();
        var mm      = right('00' + (date.getMonth()+1).toString(),2);
        var dd      = right('00' + date.getDate().toString(),2);

        return yyyy+mm+dd;
    };

    function right(texto, qtd){
        var retorno = texto.substring(texto.length-qtd, texto.length);
        return retorno;
    };

    function sub(texto, inicio, fim){
        var retorno = texto.substr(inicio, fim);
        return retorno;
    };

    $scope.dataFormat = function(data, formato){
        var yyyy    = sub(data.toString(), 0, 4);
        var mm      = sub(data.toString(), 4, 2);
        var dd      = sub(data.toString(), 6, 2);
        var retorno = formato;
        retorno = retorno.replace("yyyy", yyyy);
        retorno = retorno.replace("mm", mm);
        retorno = retorno.replace("dd", dd);
        return retorno;
    };

    
    //INFRAESTRUTURA
    $scope.listDados = function(query, callback){

        log('Executando : ' + query);

        // Retorna todos da consulta.
        database.transaction(
            function( transaction ){
                transaction.executeSql(
                    (
                       query
                    ),
                    [],
                    function( transaction, results ){
                        callback(results);
                        log("Sucesso :");
                    },
                    function(transaction, error){
                        log("Erro :" + error.message);
                    }     
                );
            }
        );
    };

    $scope.deleteDados = function(query, callback){

       //Utiliza mesma infra do select
       $scope.listDados(query, callback); 

    };

    $scope.insertDados = function(query, callback){

        log('Executando : ' + query);
        database.transaction(
            function( transaction ){
                transaction.executeSql(
                    (
                       query
                    ),
                    [],
                    function( transaction, results ){//sucess
                        callback(results.insertId);
                        log('Sucesso : registro gerado ' + results.insertId);
                    },
                    function(transaction, error){
                        log("Erro :" + error.message);
                    }
                );
            }
        ); // fim de : database.transaction(

    };

    $scope.inicio = function(){
        $scope.listDados(queryLojas     , $scope.callLojas);    //ListaLojas
        //$scope.listDados(queryProdutos  , $scope.callProdutos); //ListaProdutos
        $scope.resetProduto();    
        $scope.ListaCompras(); 
        $scope.listaSincronismo();  
        $scope.BuscaProdutos();   
    };

    var log = function(texto){
        //console.log(texto);
        if($scope.log){
            $scope.logs.push({"texto" : texto})
        }
    }

    $scope.cameraClick = function(){
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if(result.cancelled != 1){
                    //$('#produto_codigo_barras').val(result.text);
                    $scope.produto.codigo_barras = result.text;
                    
                    // Buscar poduto pelo codigo de barras
                    $scope.buscaProduto(result.text);
                    $scope.$apply();
                }
                log("Codigo de Barras interpretado\n" +
                        "Resultado: " + result.text + "\n" +
                        "Formato: " + result.format + "\n" +
                        "Cancelado: " + result.cancelled);
            }, 
            function (error) {
                Materialize.toast('Erro ao ler o código de barras: ' + error, 3000);
                log("Erro ao ler o código de barras: " + error);
            },
            {
                "preferFrontCamera" : false, // iOS and Android
                "showFlipCameraButton" : false, // iOS and Android
                "prompt" : "Posisione o código de barras no local indicado.", // supported on Android only
                // "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
            }
        );
    };

    $scope.configLog = function(){
        $scope.logs = [];
    }

    //LOJAS
    $scope.salvarLoja = function(nome){
        // Insere registro na tabela de produtos
        var query = "INSERT INTO lojas (nome, ic_acao) VALUES ('"+ nome +"', 'I');";
  
        $scope.insertDados(query, function(retorno){
            if(retorno){
                log("Loja " + retorno +" incluida com sucesso!!");
                $('#loja_nome').val("");
                Materialize.toast('Loja adicionada id:' + retorno , 3000);
                $scope.listDados(queryLojas, $scope.callLojas); //ListaLojas
            }else{
                log("Erro ao incluir Loja!! ");
            }
        }); // fim de : $scope.insertDados(queryProdutos, function(retorno){   
    };

    $scope.callLojas = function(results){
        var lojas = []
        for (var i = 0;i<results.rows.length;i++){
            lojas.push(results.rows.item(i));
        };
        $scope.lojas = lojas;
        $scope.$apply();
    };

    $scope.addLoja = function(){
        var loja    = $('#loja_nome').val();
        $scope.salvarLoja(loja);
    }

    $scope.deletarloja = function(id){
        // Insere registro na tabela de produtos
        var query = "UPDATE lojas set ic_acao = 'D' where id = " + id;
        $scope.deleteDados(query, function(retorno){
            if(retorno){

                Materialize.toast('Loja removida' , 3000);
                $scope.listDados(queryLojas, $scope.callLojas); //ListaLojas

            }else{
                log("Erro ao excluir Loja!! ");
            }
        }); // fim de : $scope.insertDados(queryProdutos, function(retorno){   
    };

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
            $scope.buscaCompras(loja.id, dt_pesquisa);
        }else{
            $scope.buscaCompras(loja.id, $scope.getDataAtual());
        } 
    };

    $scope.detalhePesquisa = function(id, nome, dt_pesquisa){
        var loja = {"id": id, "nome": nome};
        $scope.defineLoja(loja, dt_pesquisa);
    };


    //PRODUTOS
    $scope.resetProduto = function(){
        $scope.produto = {"id": "", "nome": "", "volume": "", "id_volume": "", "qtd_embalagem": 1, "codigo_barras": ".", "qtd_comprado": 0};
        log('resetProduto');
        log($scope.produto);
    }

    $scope.buscaProduto = function(barras){

        if (barras != "." && barras != "") {
            $scope.qProduto = barras;
            //Materialize.toast('Procurar Produto!' , 3000);
        }
        abrirModal('DetalheProdutos_Modal');
    }

    $scope.escolheProduto = function(produto){
        $scope.produto.nome         = produto.nome;
        $scope.produto.volume       = produto.embalagem.volume;
        $scope.produto.id_volume    = produto.embalagem.tipo.id;
        $scope.produto.codigo_barras= produto.barra;
        fecharModal('DetalheProdutos_Modal');
    };

    $scope.salvarProduto = function( codigo_barras, nome, volume, id_volume, qtd_embalagem, loja, preco, qtd_comprado){
        // Insere registro na tabela de produtos
        var query = "INSERT INTO produtos (nome, volume, id_volume, qtd_embalagem, codigo_barras, ic_acao) VALUES ('"+ nome +"', '"+ volume +"', "+ id_volume +", "+ qtd_embalagem +", '" + codigo_barras + "', 'I')";
  
        $scope.insertDados(query, function(retorno){
            if(retorno){
                
                $scope.salvarPesquisa(loja.id, retorno, preco, qtd_comprado);
                log("Produto " + retorno +" incluido com sucesso!!");
                $scope.listDados(queryProdutos, $scope.callProdutos); //ListaProdutos
                
                Materialize.toast('Produto adicionado ', 3000);
                $scope.resetProduto();
                mostraProdutos('listaProdutos');

            }else{
                log("Erro ao incluir Produto!! ");
            }
        }); // fim de : $scope.insertDados(queryProdutos, function(retorno){   
    };

    $scope.callProdutos = function(results){
        $scope.BuscaProdutos();
        /*
        var dados = []
        for (var i = 0;i<results.rows.length;i++){
            dados.push(results.rows.item(i));
        };
        $scope.produtos = dados;
        $scope.$apply();
        */
    };

    $scope.addProduto = function(){
        var loja            = $scope.loja;
        var barras          = $scope.produto.codigo_barras;
        var nome            = $scope.produto.nome;
        var volume          = $scope.produto.volume;
        var id_volume       = $scope.produto.id_volume;
        var qtd_embalagem   = $scope.produto.qtd_embalagem;
        var qtd_comprado    = $scope.produto.qtd_comprado;
        var preco           = $scope.produto.preco;
        $scope.salvarProduto(barras,nome,volume,id_volume,qtd_embalagem,loja, preco, qtd_comprado);
    };

    $scope.addProdutoOld = function(){
        var barras          = $('#codigo_barras').val();
        var nome            = $('#produto_nome').val();
        var volume          = $('#produto_volume').val();
        var id_volume       = $('#produto_id_volume').val();
        var qtd_embalagem   = $('#produto_qtd_embalagem').val();
        $scope.salvarProduto(barras,nome,volume,id_volume,qtd_embalagem);
    };

    $scope.deletarProduto = function(id){
        // Insere registro na tabela de produtos
        var query = "UPDATE produtos set ic_acao = 'D' where id = " + id;
        $scope.deleteDados(query, function(retorno){
            if(retorno){

                Materialize.toast('Produto removido' , 3000);
                $scope.listDados(queryProdutos, $scope.callProdutos); //ListaProdutos
                mostraProdutos('listaProdutos');

            }else{
                log("Erro ao excluir Produto!! ");
            }
        }); // fim de : $scope.deleteDados(query, function(retorno){   
    };

    //PESQUISA
    $scope.salvarPesquisa = function(id_loja, id_produto, preco, qtd_comprado){
        var dt_pesquisa = $scope.getDataAtual();
        var query = "INSERT INTO pesquisas (id_loja, id_produto, valor, dt_pesquisa, qtd_comprado, ic_acao) VALUES ("+ id_loja +", "+ id_produto +", "+ preco +", "+ dt_pesquisa +", "+ qtd_comprado +",'I')";
        $scope.insertDados(query, function(retorno){
            if(retorno){
                log("Sucesso : pesquisa incluida "+ retorno);
                $scope.buscaCompras (id_loja, dt_pesquisa);
            }
        })
    };

    $scope.removeItem = function(id_pesquisa){
        var query = "UPDATE pesquisas SET qtd_comprado=0 WHERE id="+id_pesquisa;
        //$scope.deletarProduto(id_produto);
        $scope.deleteDados(query, function(results){
            if(results){
                $scope.buscaCompras($scope.compras.id_loja, $scope.compras.dt_pesquisa);
            }
        });
    };

    $scope.buscaCompras = function(id_loja, dt_pesquisa){
        var query = "Select a.id as id_pesquisa, a.qtd_comprado, (a.valor*1) as preco, b.nome, a.id_produto, b.codigo_barras, b.volume, b.id_volume, b.qtd_embalagem "+
                    " FROM pesquisas a "+
                    " INNER JOIN produtos b on a.id_produto = b.id "+
                    " WHERE a.id_loja = "+id_loja+" and a.dt_pesquisa = "+ dt_pesquisa +" and a.qtd_comprado > 0 and b.ic_acao <> 'D'";
        $scope.listDados(query, function(results){
            if(results){
                var dados = []
                var totalCompra = 0;
                for (var i = 0;i<results.rows.length;i++){
                    dados.push(results.rows.item(i));
                    totalCompra = totalCompra + (results.rows.item(i).preco * results.rows.item(i).qtd_comprado);
                };

                $scope.compras = {"id_loja": id_loja, "dt_pesquisa": dt_pesquisa, "totalCompra": totalCompra, "itens": ""};
                $scope.compras.itens = dados;
                $scope.$apply();
            }
        })
    };

    $scope.ListaCompras = function(){
        var dt_pesquisa = $scope.getDataAtual();
        var query = "Select b.id, b.nome, a.dt_pesquisa, count(1) as itens, SUM(a.valor * a.qtd_comprado) as totalPago FROM pesquisas a "+
                    " INNER JOIN lojas b on b.id = a.id_loja "+
                    " INNER JOIN produtos c on c.id = a.id_produto and c.ic_acao <> 'D' "+
                    " WHERE a.qtd_comprado > 0 and a.ic_acao <> 'D'"+
                    " GROUP BY a.dt_pesquisa, b.nome "+
					" ORDER BY a.dt_pesquisa DESC ";
        $scope.listDados(query, function(results){
            if(results){
                var dados = []
                for (var i = 0;i<results.rows.length;i++){
                    dados.push(results.rows.item(i));
                };
                $scope.pesquisas = dados;
                $scope.$apply();
            }
        })
    };

    //SINCRONISMO
    $scope.listaSincronismo = function(){
        var lojas = [];
        var produtos = [];
        var pesquisas = [];
        var sincronisrmo = "";
        var query = "SELECT * FROM lojas WHERE id_sincronismo is null";
        $scope.listDados(query, function(results){
            if(results){
                for (var i = 0;i<results.rows.length;i++){
                    lojas.push(results.rows.item(i));
                };
            }
        });

        query = "SELECT * FROM produtos WHERE id_sincronismo is null";
        query = "SELECT * FROM produtos";
        $scope.listDados(query, function(results){
          if(results){
                for (var i = 0;i<results.rows.length;i++){
                    produtos.push(results.rows.item(i));
                };
            }
        });

        query = "SELECT * FROM pesquisas WHERE id_sincronismo is null";
        $scope.listDados(query, function(results){
          if(results){
                for (var i = 0;i<results.rows.length;i++){
                    pesquisas.push(results.rows.item(i));
                };
            }
        });

        sincronismo = {"idUsuaio": 1, "sincs": []};
        sincronismo.sincs.push({"nome": "lojas", "itens": lojas});
        sincronismo.sincs.push({"nome": "produtos", "itens": produtos});
        sincronismo.sincs.push({"nome": "pesquisas", "itens": pesquisas});
        $scope.sincronismo = sincronismo;
        //$scope.$apply();
        log(sincronismo);

        /*
        $scope.sincronismo = {"idUsuaio": 1, lojas" : lojas, "produtos": produtos, "pesquisas": pesquisas};
        */

    };

    $scope.sincronizarProdutos = function(Xprodutos){

        $scope.progresso = 50;
        $scope.url = "http://www.alesdias.esy.es/preco/servicos/produto.php";
        //$scope.url = "http://localhost/~alexandre/preco/servicos/produto.php";
        var item = 0;
        Xprodutos.forEach(function(produto) {
            item = item + 1;
            
            $scope.enviaProduto(produto);

            $scope.$apply;
        }, this);
    
    };

    $scope.sincronizar = function(categoria, dados){
        if(categoria == "produtos"){
            $scope.sincronizarProdutos(dados);
        }

        if(categoria == "lojas"){
            $scope.sincronizarLojas(dados);
        }
    };

    $scope.sincronizarLojas = function(Xlojas){

        $scope.progresso = 50;
        $scope.url = "http://www.alesdias.esy.es/preco/servicos/loja.php";
        //$scope.url = "http://localhost/~alexandre/preco/servicos/loja.php";
        var item = 0;
        Xlojas.forEach(function(loja) {
            item = item + 1;
            
            $scope.enviaLoja(loja);

            $scope.$apply;
        }, this);
    
    };

    //Angular http.post
    $scope.enviaProduto = function(produto){
        $scope.url = "http://www.alesdias.esy.es/preco/servicos/produtos.php";

        var data = $.param({
                action: "gravar",
                produto
            });
        
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=ISO-8859-1;'
                }
            }

            $http.post($scope.url, data, config)
            .success(function (data, status, headers, config) {

                if (data== "Sucesso"){
                   log("Sucesso ao sincronizar Produto!!");
                }else{
                    log("Erro ao sincronizar Produto!!");
                    log(data);
                };
            })
            .error(function (data, status, header, config) {
                log("Erro ao enviar dados Produto!!");
                log(data);
            });
    };
    
    $scope.enviaProdutoOLD = function(produto){
        var data = $.param({
                action: "gravar",
                produtos: {
                    nome:           produto.nome,
                    id:             produto.id,
                    volume:         produto.volume,
                    id_volume:      produto.id_volume,
                    qtd_embalagem:  produto.qtd_embalagem,
                    codigo_barras:  produto.codigo_barras
                }
            });
        
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=ISO-8859-1;'
                }
            }

            $http.post($scope.url, data, config)
            .success(function (data, status, headers, config) {

                if (data.Status == "Sucesso"){
                    // Insere registro na tabela de produtos
                    var query = "UPDATE produtos set id_sincronismo = '"+ data.id_sincronismo +"' where id = " + data.id_local;
                    $scope.deleteDados(query, function(retorno){
                        if(retorno){
                            log("Sucesso ao sincronizar Produto!!");
                        }else{
                            log("Erro ao sincronizar Produto!!");
                        }
                    }); // fim de : $scope.deleteDados(query, function(retorno){   
                }else{
                    log("Erro ao sincronizar Produto!!");
                };
            })
            .error(function (data, status, header, config) {
                log("Erro ao sincronizar Produto!!");
                log(data);
            });
    };

    $scope.enviaLoja = function(loja){
        var data = $.param({
                action: "gravar",
                produtos: {
                    id:             loja.id,
                    nome:           loja.nome
                }
            });
        
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=ISO-8859-1;'
                }
            }

            $http.post($scope.url, data, config)
            .success(function (data, status, headers, config) {

                if (data.Status == "Sucesso"){
                    // Insere registro na tabela de produtos
                    var query = "UPDATE lojas set id_sincronismo = '"+ data.id_sincronismo +"' where id = " + data.id_local;
                    $scope.deleteDados(query, function(retorno){
                        if(retorno){
                            log("Sucesso ao sincronizar Loja!");
                        }else{
                            log("Erro ao sincronizar Loja!");
                        }
                    }); // fim de : $scope.deleteDados(query, function(retorno){   
                }else{
                    log("Dado incorreto não foi possivel sincronizar!!");
                };
            })
            .error(function (data, status, header, config) {
                log("Falha na sincronização com o Servidor!!");
                log(data);
            });
    };

    //Obssoleto
    $scope.detalheProduto = function(produto){
        $scope.produto = produto;
        $scope.produto.embalagem = {id: produto.id_volume, nome: getVolume(produto.id_volume), qtd: produto.volume, media: 100, qtd_embalagem: produto.qtd_embalagem};
        $scope.produto.ListPesquisas = getPesquisas(produto.id);
        $scope.$apply();
        abrirModal('DetalheProdutos_Modal');
    };

    $scope.chamarLocal = function(){
        
        var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });

    };

    var getVolume = function(id){

        var volumes = $scope.volumes;
        var retorno = [];
        volumes.forEach(function(item) {
            if (item.id == id){
                retorno = item;
            }
        }, this);
        return retorno;
    };

    var getPesquisas = function(id){
        
        return [
            {id_loja: 1, nm_loja: "Loja 01", qtd_embalagem: 4, qtd_comprado: 1, preco: 4.00, dt_pesquisa: 20160127},
            {id_loja: 2, nm_loja: "Loja 02", qtd_embalagem: 8, qtd_comprado: 1, preco: 8.00, dt_pesquisa: 20160215}
        ]
    };

    $scope.calcularValor = function(valor, volume, embalagem){

        return (((valor / embalagem.volume) / embalagem.qtd) * embalagem.tipo.comparacao);

    };

    $scope.calcularValorUnidade = function(valor, volume, embalagem){

        return (valor / embalagem.qtd);

    };

    var onSuccess = function(position){

        alert('Latitude: '        + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');
    };

    var onError = function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');  
    }

    $scope.BuscaProdutos = function(){
        
        var file = "";
        var query = "Select b.id as produto_id, b.nome as produto_nome, b.codigo_barras as produto_barra, "+
                    " b.volume as produto_volume, b.id_volume as produto_volumeID, b.qtd_embalagem as produto_qtdEmbalagem, "+
                    " a.id as pesquisa_id, a.dt_pesquisa as pesquisa_dt, a.qtd_comprado as pesquisa_qtdComprado, a.valor as produto_valor," +
                    " c.nome as loja_nome, c.id as loja_id,"+
                    " b.ic_acao as produto_ic, a.ic_acao as pesquisa_ic, c.ic_acao as loja_ic" +
                    " FROM produtos b "+
                    " INNER JOIN pesquisas a on a.id_produto = b.id" +
                    " INNER JOIN lojas c on a.id_loja = c.id" +
                    " where b.ic_acao ='I'"+
                    " ORDER BY b.nome";

        $scope.XP_Produtos = [];

        $scope.listDados(query, function(results){
            if(results){

               var dados = []
                for (var i = 0;i<results.rows.length;i++){
                    dados.push(results.rows.item(i));
                };

                $scope.XP_Produtos.dados = dados;
                $scope.OrganizaProdutos();
                //$scope.enviaProduto($scope.XP_Produtos);
            }
        });

    };

    $scope.OrganizaProdutos = function(){

        var produtos = [];
        var encontrado = false;
        
        $scope.XP_Produtos.dados.forEach(function(item) {
                
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

        $scope.produtos = produtos;
        $scope.$apply();
        log($scope.produtos );
        
    };

    $scope.GerarArquivo = function(){
        log('tentando escrever o arquivo');
        writeToFile('pesquisaDados.json', $scope.produtos);
        //log($scope.produtos);
    };

    $scope.arquivo = [];
    $scope.LerArquivo = function(){
        log('tentando ler o arquivo');
        var fileData;
        readFromFile('pesquisaDados.json', function (data) {
            fileData = data;
        });

        log('tamanho do arquivo' + fileData.length);
        fileData.forEach(function(item) {
            log(item.nome);
        }, this);

        $scope.arquivo = fileData;
    };

    $scope.EnviaEmail = function(){

        var pathToFile = cordova.file.dataDirectory + 'pesquisaDados.json';
        var data = $scope.getDataAtual();
        var textoEmail = 'Segue arquivos do APP Preço <br><br>'+
                         'Data do Arquivo : ' + $scope.dataFormat(data,'dd/mm/yyyy');
        cordova.plugins.email.open({
            to:             'alesdias@yahoo.com.br',
            subject:        'Arquivo de Dados do APPreço',
            attachments:    pathToFile,
            body:           textoEmail,
            isHtml:         true
        });
    };


    /////////////////////////////////////////////////////////////////////////////////
    var errorHandler = function (fileName, e) {  
        var msg = '';

        switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'Storage quota exceeded';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'File not found';
                break;
            case FileError.SECURITY_ERR:
                msg = 'Security error';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'Invalid modification';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'Invalid state';
                break;
            default:
                msg = 'Unknown error';
                break;
        };

        log('Error (' + fileName + '): ' + msg);
    }

    function readFromFile(fileName, cb) {
        var pathToFile = cordova.file.dataDirectory + fileName;
        log(pathToFile);
        window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    cb(JSON.parse(this.result));
                };

                reader.readAsText(file);
            }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
    }

    function writeToFile(fileName, data) {
        data = JSON.stringify(data, null, '\t');
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        // for real-world usage, you might consider passing a success callback
                        log('Write of file "' + fileName + '"" completed.');
                    };

                    fileWriter.onerror = function (e) {
                        // you could hook this up with our global error handler, or pass in an error callback
                        log('Write failed: ' + e.toString());
                    };

                    var blob = new Blob([data], { type: 'text/plain' });
                    fileWriter.write(blob);
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
    }

    document.addEventListener('deviceready', onDevicePronto, false);  

    function onDevicePronto() {  

        function onInitFs(fs) {  
            log('Opened file system: ' + fs.name);
        }

        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;  
        window.requestFileSystem(window.PERSISTENT, 50*1024*1024 /*50MB*/, onInitFs, errorHandler);

        window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function (grantedBytes) {  
            window.requestFileSystem(window.PERSISTENT, grantedBytes, onInitFs, errorHandler);
        }, function (e) {
            log('Error', e);
        });



        //GRAVAR ARQUIVO
        

    }

}); // fim de : angular.module("appreco").controller("pesquisaCntr", function($scope) 


//0594584962 -Protocolo de Atendimento cecelem problema com cartão Submarino.
