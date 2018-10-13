angular.module("appreco").factory("FormataData", function() {
	
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
	
	var fDataHora = function(data){
		
		var hora  = sub(data.toString(), 8, 6);
		data = dataFormata(data,'dd/mm/yyyy');
		hora = horaFormata(hora,'hh:mm:ss')
		return data + " " + hora;	
	};
	
    var sub= function(texto, inicio, fim){
        var retorno = texto.substr(inicio, fim);
        return retorno;
    };
	
	
	 return{
       formatarDataHora: function x(data)
       {
           return fDataHora(data);
       }
   }
	
}); // fim de : angular.module("appreco").service("utils", function() {