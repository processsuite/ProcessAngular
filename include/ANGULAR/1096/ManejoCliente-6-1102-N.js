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
asignar_valor( "wl_baprobar", "Actualizar asesor externo");
MatrizEstatica( "PORCCOMI" ); 
function habAsociarUsuario()
{
   if (obtener_valor("TPOASESOR",1)=="T")
    MostrarCampo( "USERBPM");
  else
    OcultarCampo( "USERBPM");

  return true;
}
habAsociarUsuario();
asignar_event( "onclick" , "habAsociarUsuario()", "TPOASESOR");
/******************************************************/
function K_ListasAjax()
{
}
K_ListasAjax();
