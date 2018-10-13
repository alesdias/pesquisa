	$(document).ready(function(){
		//menu(); // inicia o menu
		$('.modal-trigger').leanModal();
		$('select').material_select();
		//$(".button-collapse").sideNav();
		$('.collapsible').collapsible({
			accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		});
		$('.tooltipped').tooltip({delay: 50});

	
		$('.button-collapse').sideNav({
				menuWidth	: 300, // Default is 300
				edge		: 'left', // Choose the horizontal origin
				closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
				draggable	: false // Choose whether you can drag to open on touch screens
		});
		
	});



// Rever estas funções
function abrirModal(modal){
    $('#'+modal).openModal();
}

function fecharModal(modal){
    $('#'+modal).closeModal();
}

var mostrarConteudo = function( mostra ){
    var conteudos = ['home','config'];

    if(mostra == 'conteudo-produtos'){
        mostraProdutos('listaProdutos');
    }

    $('#conteudo-home').hide();
    $('#conteudo-produtos').hide();
    $('#conteudo-pesquisas').hide();
    $('#conteudo-config').hide();
    $('#conteudo-lojas').hide();
	$('#conteudo-nota').hide();
    $('#'+mostra).show();
    

    
    console.log(mostra);
};

var mostraProdutos  = function( mostra ){
    $('#listaProdutos').hide();
    $('#novoProduto').hide();
    $('#'+mostra).show();
};

Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

Number.prototype.formatReal = function(n, x) {
    var re = this.format(n,x);
    re.replace(",","@");
    re.replace(".",",");
    re.replace("@",".");
    return "R$ "+ this.format(n,x);
};