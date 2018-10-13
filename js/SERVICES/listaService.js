angular.module("appreco").service("ListaService", function($q) {
	
	database.transaction(
		function( transaction ){
			
			/*
			transaction.executeSql(
				"CREATE TABLE IF NOT EXISTS grupoLista (" +
					"id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
					"nome          	TEXT NOT NULL,       " +
					"ic_acao        TEXT,   " +
					"id_sincronismo TEXT    " +
				");"
			);
			
			transaction.executeSql(
				"CREATE TABLE IF NOT EXISTS lista (" +
					"id 			INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
					"id_grupo 		INTEGER NULL,		" +
					"nome          	TEXT NOT NULL,      " +
					"ic_acao        TEXT,   " +
					"id_sincronismo TEXT    " +
				");"
			);
			*/
			
			var Listas = [];
			
			this.addGrupoLista = function(nome){
				var id = Lista.length + 1;
				var grupo = {id : id, nome: nome, itens: []};
				Listas.push(grupo);
			};
			
			this.addLista = function(lista, id_grupo){
				var itens = Listas[id_grupo].itens;	
				var id = itens.length + 1;
				var iten = {id: id, nome: lista};
				Listas[id_grupo].itens.push(iten);
			};
			
			

		}
	);

});