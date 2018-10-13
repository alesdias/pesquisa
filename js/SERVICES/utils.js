angular.module("appreco").service("utils", function() {
	
	this.formatDataHora = function(data){
		
		var hora  = sub(data.toString(), 8, 6);
		data = this.dataFormat(data,'dd/mm/yyyy');
		hora = this.horaFormat(hora,'hh:mm:ss')
		return "hora";
		//return data + " " + hora;	
	};
	
	this.dataFormat = function(data, formato){
        var yyyy    = sub(data.toString(), 0, 4);
        var mm      = sub(data.toString(), 4, 2);
        var dd      = sub(data.toString(), 6, 2);
        var retorno = formato;
        retorno = retorno.replace("yyyy", yyyy);
        retorno = retorno.replace("mm", mm);
        retorno = retorno.replace("dd", dd);
        return retorno;
    };
	
	this.horaFormat = function(data, formato){
        var hh    	= sub(data.toString(), 0, 2);
        var mm      = sub(data.toString(), 2, 2);
        var ss      = sub(data.toString(), 4, 2);
        var retorno = formato;
        retorno = retorno.replace("hh", hh);
        retorno = retorno.replace("mm", mm);
        retorno = retorno.replace("ss", ss);
        return retorno;
    };
	
	function right(texto, qtd){
        var retorno = texto.substring(texto.length-qtd, texto.length);
        return retorno;
    };

    function sub(texto, inicio, fim){
        var retorno = texto.substr(inicio, fim);
        return retorno;
    };
	
	this.getDataAtual = function () {
        var date    = new Date();
        var yyyy    = date.getFullYear().toString();
        var mm      = right('00' + (date.getMonth()+1).toString(),2);
        var dd      = right('00' + date.getDate().toString(),2);

        return yyyy+mm+dd;
    };
	
}); // fim de : angular.module("appreco").service("utils", function() {