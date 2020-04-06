MatrizEstatica( "MTZFISCA" );
OcultarCampo( "MTZDIR" ,3,2);
asignar_valor( "wl_baprobar", "Actualizar proveedor");
asignar_valor( "MATNVMTZMARCA" , "Agregar marca");
asignar_valor( "MATBOMTZMARCA" , "Eliminar marca");
asignar_valor( "MATNVMTZCONT" , "Agregar contacto");
asignar_valor( "MATBOMTZCONT" , "Eliminar contacto");
asignar_valor( "MATNVMTZCOND" , "Agregar condición");
asignar_valor( "MATBOMTZCOND" , "Eliminar condición");
asignar_valor( "MATNVMTZDIR" , "Agregar dirección");
asignar_valor( "MATBOMTZDIR" , "Eliminar dirección");
asignar_valor( "MATNVMTZCTA" , "Agregar intrucción");
asignar_valor( "MATBOMTZCTA" , "Eliminar intrucción");

AnexoArchivo('MTZDOC', 'DIRVIR','DIRFIS',3,4,5,'prov'); $("#wfrm_formulario").validate
({
  rules: { 
           TPOPROV:{required: true},			   
           NOMBRE:{required: true}	   
         }
});

function ValidaEnvio()
{
  if ($("#wfrm_formulario").valid()!=true){
		alertmb("Por favor complete los campos obligatorios identificados en el formulario",0,1,"Aceptar");
  		return false;
	}
  
  return true;	
}

asignar_event( "onclick" , "ValidaEnvio()", "wl_baprobar" );

ValidarFilas("MTZMARCA",[
["MTZMARCA2",{required: function(element) { return $("::MTZMARCA3::").val()!='' || $("::MTZMARCA4::").val()!='' || $("::MTZMARCA5::").val()!='';}}],
["MTZMARCA3",{required: function(element) { return $("::MTZMARCA2::").val()!='' || $("::MTZMARCA4::").val()!='' || $("::MTZMARCA5::").val()!='';}}],
["MTZMARCA4",{required: function(element) { return $("::MTZMARCA2::").val()!='' || $("::MTZMARCA3::").val()!='' || $("::MTZMARCA5::").val()!='';}}],
["MTZMARCA5",{required: function(element) { return $("::MTZMARCA2::").val()!='' || $("::MTZMARCA3::").val()!='' || $("::MTZMARCA4::").val()!='';}}]
]);

function AgregarFilasMarca(){
	fil=obtener_valor( 'filMTZMARCA' );
	ValidarFilaDinamica("MTZMARCA",fil,[
["MTZMARCA2",{required: function(element) { return $("::MTZMARCA3::").val()!='' || $("::MTZMARCA4::").val()!='' || $("::MTZMARCA5::").val()!='';}}],
["MTZMARCA3",{required: function(element) { return $("::MTZMARCA2::").val()!='' || $("::MTZMARCA4::").val()!='' || $("::MTZMARCA5::").val()!='';}}],
["MTZMARCA4",{required: function(element) { return $("::MTZMARCA2::").val()!='' || $("::MTZMARCA3::").val()!='' || $("::MTZMARCA5::").val()!='';}}],
["MTZMARCA5",{required: function(element) { return $("::MTZMARCA2::").val()!='' || $("::MTZMARCA3::").val()!='' || $("::MTZMARCA4::").val()!='';}}]
]);
return true;
}

asignar_event( "onclick" ,"AgregarFilasMarca()" , "MATNVMTZMARCA");
/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
