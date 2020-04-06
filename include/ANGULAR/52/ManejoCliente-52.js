//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Función genérica que coloca la imagen de obligatorio a los campos que no son definidos por Diseño
// Parámetros:
// 	e_lstcampos: Arreglo de nombres de campos a quien se le colocará la imagen de obligatorio.
// Ejemplo: CamposObligatorios(["CAMPOA","MATRIZ[*,1]"])
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function CamposObligatorios(e_lstcampos)
{	var nombreCampo = "";
	var posicion = 0;
	for (i=0;i<e_lstcampos.length;i++)
	{	posicion = e_lstcampos[i].indexOf("[*,");
		if (posicion > 0)
			nombreCampo = "M0" + e_lstcampos[i].substring(0, posicion) + e_lstcampos[i].substring(posicion+3,e_lstcampos[i].length-1);
		else
			nombreCampo = "DES" + e_lstcampos[i];
		$("#"+nombreCampo).html('<img src="images/obligatorio.gif" alt="" hspace="3">' + $("#"+nombreCampo).html());
	}
	return true;
 }