function DataFormata(){
	var clazz = {


		
		horaFormata : function(data, formato){
			var hh    	= data.toString().substr(0, 2);
			var mm      = data.toString().substr(2, 2);
			var ss      = data.toString().substr(4, 2);
			var retorno = formato;
			retorno = retorno.replace("hh", hh);
			retorno = retorno.replace("mm", mm);
			retorno = retorno.replace("ss", ss);
			return retorno;
		},
		
		dataFormata : function(data, formato){
			var yyyy    = data.toString().substr(0, 4);
			var mm      = data.toString().substr(4, 2);
			var dd      = data.toString().substr(6, 2);
			var hora 	= data.toString().substr(8, 6);
			var f		= formato.split(" ");
			var retorno = f[0];
			retorno = retorno.replace("yyyy", yyyy);
			retorno = retorno.replace("mm", mm);
			retorno = retorno.replace("dd", dd);
			if (f.length > 1 ){
			retorno = retorno + " " + this.horaFormata(hora,f[1]);
			}
			
			return retorno;
		}
		
	};
	
	return clazz;
}

