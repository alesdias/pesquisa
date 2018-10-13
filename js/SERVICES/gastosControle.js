function GastosControle(){
	var clazz = {

		organizaCompras : function(compras){
			
			var data = new DataFormata(); // dataFormat.js
			var resultados = {};
			var soma = 0;
			var valorReferncia = 0;
			var itemCompra;
			var retorno = {
				total : soma,
				itens : []
			};
			for (var i = 0;i<compras.length;i++){
				referencia = data.dataFormata(compras[i].dt_compra,'yyyy-mm');
				itemCompra = this.obterReferencia(referencia, retorno, {referencia: referencia, valor: compras[i].preco, loja: compras[i].nm_loja});
				if(itemCompra){
					retorno.itens.push(itemCompra);
				}
				console.log(compras[i]);
			};
			console.log(retorno);
			return retorno.itens;
		},
		
		obterReferencia : function(referencia, resumo, item){
			console.log("Passei no obterReferencia : " + referencia)
			for (var x = 0;x<resumo.itens.length;x++){
				console.log("achei");
				if(resumo.itens[x].referencia == referencia){
					resumo.itens[x].valor += item.valor;
					return false;
				}
			//itemCompra = {referencia: referencia, valor: 200, loja: "oba"};
			}
			return item;
		},
		
	};
	
	return clazz;
}

