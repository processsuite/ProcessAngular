OcultarCampo( "wl_bobjetar",2);

function habAsociarUsuario()
{
   if (obtener_valor("TPOASESOR",1)=="T")
    MostrarCampo( "USERBPM");
  else
    OcultarCampo( "USERBPM");

  return true;
}
habAsociarUsuario();
MatrizEstatica( "PORCCOMI" );

asignar_event( "onclick" , "habAsociarUsuario()", "TPOASESOR");

function ValidaEnvio()
{
  if (obtener_valor("TPOASESOR",1)=="T" && obtener_valor("USERBPM")=="" ){
		alertmb("Por favor,debe asociar el registro del asesor interno con el usuario creado en el BPM",0,1,"Aceptar");
  		return false;
	}

  return true;	

}

asignar_event( "onclick" , "ValidaEnvio()", "wl_baprobar" );
/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
