console.log("load GenericoMatrices");
var ArregloMatrices=new Array(Array(),Array(),Array());
ixy=0;
function AgregarMatrizDinamica(NombreMatriz,ColumnaDato,ColumnaDestino)
//Agrega en un arreglo las matrices que tienen valores din�micos
{
	ArregloMatrices[0][ixy]=NombreMatriz;
	ArregloMatrices[1][ixy]=ColumnaDato;
	ArregloMatrices[2][ixy]=ColumnaDestino;
	ixy++;
	return(true);
}

function AgregaScript(contenido)
{
var scr=document.createElement("SCRIPT");
scr.defer=true;
scr.text=contenido;
document.getElementsByTagName('head')[0].appendChild(scr);
}

function ObtFuncionCambios(Matriz,Columna,ColumnaCambio,fila)
//Devuelve el llamado de la funci�n de cambio
{
	NombreCampo="M"+eval(fila)+Matriz+Columna;
	Col="M"+eval(fila)+Matriz+ColumnaCambio;
	str=" function Cambio"+NombreCampo+" () { return(ObtenerCodigo('"+NombreCampo+"','"+Col+"')); };\n";
	return(str);
}

function CrearCambios(Matriz,Columna,ColumnaCambio,fila)
//Crea las funciones de cambio para cada fila de la matriz
{
var filas=document.getElementById("fil"+Matriz).value;
var str="";
if (parseInt(fila)<=0)
	for (var i=1;i<=filas;i++)
		str+=ObtFuncionCambios(Matriz,Columna,ColumnaCambio,i);
else
	str=ObtFuncionCambios(Matriz,Columna,ColumnaCambio,fila);
AgregaScript(str);
}


function CrearOnChanges(Matriz,Columna,fila)
{
var filas=document.getElementById("fil"+Matriz).value;
var str="";
cadena="";
if(parseInt(fila)<=0)
{
	for(var i=1;i<=filas;i++)
	{
		matr='CambioM'+eval(i)+Matriz+Columna;
		cadena+=" PonerOnChange('" + Matriz +"',"+eval(i)+","+Columna+",'"+matr+"()'); \n ";
	}
}
else
{
		matr='CambioM'+eval(fila)+Matriz+Columna;
		cadena=" PonerOnChange('" + Matriz +"',"+eval(fila)+","+Columna+",'"+matr+"()'); \n ";
}
cadena=" function Exec() { "+cadena +"};";
AgregaScript(cadena);
Exec();
}

function PonerOnChange(Matriz,Fila,Columna,NombreFuncion)
{
	matri="M"+Fila+Matriz+Columna+"";
	/*var campo=document.getElementById(matri);
	campo.onchange=NombreFuncion;*/
	asignar_event("onchange",NombreFuncion,matri);
}

function DynMatrices(Matriz,fila)
//Para generar una asignacion de valores ocultos en matrices
{
if(fila==-1)//Se generan para todas las filas. Caso Borrar fila o inicio del formulario.
{

	if(Matriz.toUpperCase()=="TODAS")
	{
		for(i=0;i<ArregloMatrices[0].length;i++)
		{
			str=" function ExecMain() {  "+ CambioFilaColumna(ArregloMatrices[0][i],ArregloMatrices[1][i], ArregloMatrices[2][i], fila) +"};"
			AgregaScript(str);
			ExecMain();
		}
	}
	else//Matriz especifica al momento de borrar
	{
		for(i=0;i<ArregloMatrices[0].length;i++)
		{
			if(ArregloMatrices[0][i].toString()==Matriz.toString())
			{
				str=" function ExecMain() {  "+ CambioFilaColumna(ArregloMatrices[0][i],ArregloMatrices[1][i], ArregloMatrices[2][i], fila) +"};"
				AgregaScript(str);
				ExecMain();
			}
		}

	}
}
else //Para una fila especifica
{
	for(i=0;i<ArregloMatrices[0].length;i++)
	{
		if(ArregloMatrices[0][i].toString()==Matriz.toString())
		{
			str=" function ExecMain() {  "+ CambioFilaColumna(ArregloMatrices[0][i],ArregloMatrices[1][i], ArregloMatrices[2][i], fila) +"};"
			AgregaScript(str);
			ExecMain();
		}
	}


}
}

function CambioFilaColumna(Matriz,ColumnaOrigen,ColumnaDestino,Fila)
{
	str=" CrearCambios ('"+ Matriz +"',"+ ColumnaOrigen +","+ColumnaDestino+","+ Fila +");\n"
	str+=" CrearOnChanges ('"+ Matriz +"',"+ ColumnaOrigen +","+ Fila +");\n"
	return(str);
}

function ObtenerCodigo(CampoOrigen,CampoDestino)
{
try
{
	var Or=document.getElementById(CampoOrigen);
	var valor=Or.options[Or.selectedIndex].text;
	valor=valor.substring(0,valor.indexOf("-",1));
	document.getElementById(CampoDestino).value=valor;
	return(true);
}
catch(e)
{
	alert("Ha sucedido un error: "+e.description);
}
}
//-->
