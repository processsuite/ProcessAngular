MatrizEstatica( "MTZEF"); MatrizEstatica( "MTZAVA"); MatrizEstatica( "MTZPLAN"); MatrizEstatica( "MTZCRO"); MatrizEstatica( "MTZCTC"); MatrizEstatica( "MTZCTS");
MatrizEstatica( "MTZCDO"); MatrizEstatica( "MTZNREF"); MatrizEstatica( "MTZICC"); MatrizEstatica( "MTZPFC");

$("#wfrm_formulario").validate
({
	rules: { 
		M1MTZPLAN2: {required: function(element) { return obtener_valor("M1MTZPLAN1") == 'No';}},
		M1MTZCRO2: {required: function(element) { return obtener_valor("M1MTZCRO1") == 'Si';}},
		M1MTZCDO2: {required: function(element) { return obtener_valor("M1MTZCDO1") == 'Si';}},
		M1MTZICC2: {required: function(element) { return obtener_valor("M1MTZICC1") == 'Si';}}
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
