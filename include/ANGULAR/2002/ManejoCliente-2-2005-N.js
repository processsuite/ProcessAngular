MatrizEstatica( "MTZEFFO"); MatrizEstatica( "MTZAVF"); MatrizEstatica( "MTZSBCOT"); MatrizEstatica( "MTZMPO"); MatrizEstatica( "MTZAAICC"); MatrizEstatica( "MTZPFFCA"); MatrizEstatica( "MTZPFCRO"); MatrizEstatica( "MTZCOPE"); MatrizEstatica( "MTZCLNS"); MatrizEstatica( "MTZCONTE"); MatrizEstatica( "MTZFCAC"); MatrizEstatica( "MTZIOACC");

$("#wfrm_formulario").validate
({
	rules: { 
		M1MTZSBCOT2: {required: function(element) { return obtener_valor("M1MTZSBCOT1") == 'Si';}},
		M1MTZMPO2: {required: function(element) { return obtener_valor("M1MTZMPO1") == 'Si';}},
		M1MTZAAICC2: {required: function(element) { return obtener_valor("M1MTZAAICC1") == 'Si';}},
		M1MTZCLNS2: {required: function(element) { return obtener_valor("M1MTZCLNS1") == 'Si';}},
		M1MTZCONTE2: {required: function(element) { return obtener_valor("M1MTZCONTE1") == 'Si';}}
	}
});

function ValidaAlEnviar(){
	if ($("#wfrm_formulario").valid()!=true){
		alertmb("Por favor complete los campos obligatorios",0,1,"Aceptar");
		return false;
	}
	return true;
}

asignar_event( 'onclick' ,'ValidaAlEnviar()',  'wl_baprobar1');
asignar_event( 'onclick' ,'ValidaAlEnviar()',  'wl_baprobar');

/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
