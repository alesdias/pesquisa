var databaseOptions = {
    fileName: "appreco",
    version: "1.0",
    displayName: "APpreco",
    maxSize: 1024
};
var database = openDatabase(
    databaseOptions.fileName,
    databaseOptions.version,
    databaseOptions.displayName,
    databaseOptions.maxSize
);


// INFRAESTRUTURA
database.transaction(
    function( transaction ){
        // Cria tabela de produtos caso não exita.
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

        transaction.executeSql(
            "CREATE TABLE IF NOT EXISTS lojas (" +
                "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
                "nome  TEXT NOT NULL,   " +
                "ic_acao        TEXT,   " +
                "id_sincronismo TEXT    " +
            ");"
        );

        transaction.executeSql(
            "CREATE TABLE IF NOT EXISTS lojas_localizacao (" +
                "id INTEGER NOT NULL PRIMARY KEY," +
                "latitude   TEXT NOT NULL,   " +
                "longitude  TEXT NOT NULL,   " +
                "altitude   TEXT NOT NULL,   " +
                "accuracy   TEXT NOT NULL,   " +
                "altitude_accuracy   TEXT NOT NULL,   " +
                "id_sincronismo TEXT    " +
            ");"
        );

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
		
		transaction.executeSql(
			"CREATE TABLE IF NOT EXISTS notas (" +
				"id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
				"dt_compra  	NUMERIC NOT NULL,   " +
				"vl_compra  	NUMERIC NOT NULL,   " +
				"cpf  			NUMERIC NULL,   " +
				"tx_chave  		TEXT NULL,   " +
				"tx_qrcode 		TEXT NULL,   " +
				"ic_acao        TEXT,   " +
				"id_sincronismo TEXT    " +
			");"
		);
        //transaction.executeSql("INSERT INTO produtos (nome, valor, codigo_barras) VALUES ('Produto Teste', 12, 09090988);");
    }
);

var listaTabelas = function( callback ){
    database.transaction(
        function( transaction ){
            transaction.executeSql(
                (
                    "SELECT tbl_name FROM sqlite_master WHERE type = 'table'"
                ),
                [],
                function( transaction, results ){
                    callback( results );
                }
            );
        }
    );
};


var apagarTabelas = function( callback ){
    // Insere registro na tabela de produtos
    database.transaction(
        function( transaction ){
            transaction.executeSql(
                "DROP TABLE IF EXISTS produtos"
            );
            transaction.executeSql(
                "DROP TABLE IF EXISTS lojas"
            );
            transaction.executeSql(
                "DROP TABLE IF EXISTS pesquisas"
            );
        }
    );
};

//PRODUTOS
var listaProdutos = function( callback ){
    // Retorna todos os Produtos.
    database.transaction(
        function( transaction ){
            transaction.executeSql(
                (
                    "SELECT " +
                        "* " +
                    "FROM " +
                        "produtos WHERE ic_acao <> 'D' " +
                    "ORDER BY " +
                        "nome ASC"
                ),
                [],
                function( transaction, results ){
                    callback( results );
                }
            );
        }
    );
};

var buscaProduto = function( barra, callback ){
    // Retorna todos os Produtos.
    database.transaction(
        function( transaction ){
            transaction.executeSql(
                (
                    "SELECT " +
                        "* " +
                    "FROM " +
                        "produtos WHERE codigo_barras =  '?' " +
                    "ORDER BY " +
                        "nome ASC"
                ),
                [barra],
                function( transaction, results ){
                    callback( results );
                }
            );
        }
    );
};



var deletarProdutos = function( callback ){
    // Apaga Todos os registros da tabela de produtos
    database.transaction(
        function( transaction ){
             transaction.executeSql(
                (
                     "UPDATE produtos SET ic_acao = 'D';"
                ),
                [],
                function( ){
                    callback();
                }
             )    
        }
    );
};

var deletarProduto = function( id, callback ){
    // Apaga registro na tabela de produtos
    database.transaction(
        function( transaction ){
             transaction.executeSql(
                (
                     "UPDATE produtos SET ic_acao = 'D' where id = ?"
                ),
                [id],
                function( ){
                    callback();
                }
             )    
        }
    );
};

//LOJAS
var listaLojas = function( callback ){
    // Retorna todos os Produtos.
    database.transaction(
        function( transaction ){
            transaction.executeSql(
                (
                    "SELECT " +
                        "* " +
                    "FROM " +
                        "lojas WHERE ic_acao <> 'D' " +
                    "ORDER BY " +
                        "nome ASC"
                ),
                [],
                function( transaction, results ){
                    callback( results );
                }
            );
        }
    );
};

var deletarLoja = function( id, callback ){
    // Apaga registro na tabela de produtos
    database.transaction(
        function( transaction ){
             transaction.executeSql(
                (
                     "UPDATE lojas SET ic_acao = 'D' where id = ?"
                ),
                [id],
                function( ){
                    callback();
                }
             )    
        }
    );
};

var salvarLoja = function(nome, callback ){
    // Insere registro na tabela
    database.transaction(
        function( transaction ){
             transaction.executeSql(
                (
                     "INSERT INTO lojas (nome, ic_acao) VALUES ('"+ nome +"', 'I');"
                ),
                [],
                function( transaction, results ){
                    callback( results.insertId );
                }
             )    
        }
    );
};



