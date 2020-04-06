MatrizEstatica( "MTZGAS"); MatrizEstatica( "MTZREA"); MatrizEstatica( "MTZASSA"); MatrizEstatica( "MTZCAS"); MatrizEstatica( "MTZFAA");

$("#wfrm_formulario").validate
({
	rules: { 
		M1MTZASSA2: {required: function(element) { return obtener_valor("M1MTZASSA1") == 'Si';}}
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
