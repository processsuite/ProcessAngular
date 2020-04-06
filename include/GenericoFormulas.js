console.log("load GenericoFormualas");
/*
var IE = document.all?true:false;
Ejemplo de Formula
RegistrarFormula(":FORMAPAG[*,3]:*:FORMAPAG[*,4]:/100","FORMAPAG[*,5]");
*/

function ObtValor(Cadena)
{
	var valor=Cadena;
	valor=valor.substring(0,valor.indexOf("-",1));
	return (valor);
}

	function BorrarRelacion(Matriz,Filas)
	{
		//Se borraran todas las filas pro encima de la cantidad de filas actual hasta el parametro Filas
		var i=0;
		var lArreglo=ArregloCampos[0].length;
		var ArrAux=new Array(Array(),Array());
		var f=new Number();
		var enc = false;
		f=parseInt(document.getElementById("fil"+Matriz).value);
		//alert("Desde "+ eval(f+1) + " hasta "+Filas);
		for(i=0;i<lArreglo;i++)
		{
			for(var j=f+1;j<=Filas;j++)
			{
				if(ArregloCampos[0][i].toString().indexOf("M"+j+Matriz)<0&&ArregloCampos[1][i].toString().indexOf("M"+j+Matriz)<0)//El campo esta en el arreglo
				{
					x=ArrAux[0].length;
					ArrAux[0][x]=ArregloCampos[0][i];
					ArrAux[1][x]=ArregloCampos[1][i];
					enc = true;
				}
			}
		}
		if (enc){
			ArregloCampos=null;
			ArregloCampos=ArrAux;
		}
	}
	function BorrarFormula(Matriz,Fila)
	{
		var i=0;
		//alert("al fin");
		var lArreglo=ArregloFormulas[0].length;
		var cantFilas=parseInt(document.getElementById("fil"+Matriz).value);
		var ArrAux=new Array(Array(),Array());
		var x= new Number();
		//alert(lArreglo);
		//alert(ArregloFormulas[0].join("\n")+"\n\n"+ArregloFormulas[1].join("\n"));
		for(i=0;i<lArreglo;i++)
		{
			if(ArregloFormulas[0][i].toString().indexOf("M"+Fila+Matriz)<0)
			{
				x=ArrAux[0].length;
				ArrAux[0][x]=ArregloFormulas[0][i];
				ArrAux[1][x]=ArregloFormulas[1][i];
			}
		}
		ArregloFormulas=null;
		ArregloFormulas=ArrAux;

		var lArreglo=ArregloFormulas[0].length;
		if(cantFilas>Fila)//Renombramos las formulas
		{
			for(i=0;i<lArreglo;i++)
			{
				if(ArregloFormulas[0][i].toString().indexOf("M"+eval(Fila+1)+Matriz)>=0)
					while(ArregloFormulas[0][i].toString().indexOf("M"+eval(Fila+1)+Matriz)>=0)
						ArregloFormulas[0][i]=ArregloFormulas[0][i].toString().replace("M"+eval(Fila+1)+Matriz,"M"+Fila+Matriz);

				if(ArregloFormulas[1][i].toString().indexOf("M"+eval(Fila+1)+Matriz)>=0)
					while(ArregloFormulas[1][i].toString().indexOf("M"+eval(Fila+1)+Matriz)>=0)
						ArregloFormulas[1][i]=ArregloFormulas[1][i].toString().replace("M"+eval(Fila+1)+Matriz,"M"+Fila+Matriz);

			}
		}
		//alert(ArregloFormulas[0].join("\n")+"\n\n"+ArregloFormulas[1].join("\n"));
	}

function DynFormulas(NombreMatriz,Fila)
{
//Esta funci�n busca en el arreglo de campos cuales son los que
//se actualizan. Para eso construye
var i=0;
var j=0;
var k=0;
var col=document.getElementById("col"+NombreMatriz).value;
var ListaCampos=new String();
var ListaCamposA=new String();
var ArrCampos=new Array();
var FormulaNueva=new String();
var lAC=ArregloCampos[0].length;
var ArrCampPadres=new Array();
for(i=1;i<=col;i++)
{

	ListaCampos=BuscarCamposDependientes("M1"+NombreMatriz+i);
	ListaCamposA=BuscarCamposPrevios("M1"+NombreMatriz+i);
	if(ListaCamposA.length>0)
	{
		ArrCampPadres=ListaCamposA.split(",");
		for(var u=0;u<ArrCampPadres.length;u++)
			GuardarRelacionCampos(ArrCampPadres[u].toString().replace("M1"+NombreMatriz,"M"+Fila+NombreMatriz),"M"+Fila+NombreMatriz+i);

	}


	if(ListaCampos.length>0)
	{
		ArrCampos=ListaCampos.split(",");
		for(j=0;j<ArrCampos.length;j++)
			for(k=0;k<ArregloFormulas[0].length;k++)
				if(ArrCampos[j]==ArregloFormulas[0][k])
				{
					FormulaNueva=ArregloFormulas[1][k];
					while(FormulaNueva.indexOf("M1"+NombreMatriz)>=0)
						FormulaNueva=FormulaNueva.replace("M1"+NombreMatriz,"M"+Fila+NombreMatriz);

					CrearFuncionCampoCambio("M"+Fila+NombreMatriz+i);
					GuardarRelacionCampos("M"+Fila+NombreMatriz+i,ArrCampos[j].toString().replace("M1"+NombreMatriz,"M"+Fila+NombreMatriz));
					GuardarFormula(ArrCampos[j].toString().replace("M1"+NombreMatriz,"M"+Fila+NombreMatriz),FormulaNueva);
				}
	}
}

}
function BuscarCamposPrevios(Campos)
{
//Extrae del arreglo de campos cuales son los que modifican el valor de NombreCampo
var cadena = new String();
var CadRet=new String();
cadena=Campos+"";
var Camps=new Array();
Camps=cadena.split(",");
var i=0;
var j=0;
for(j=0;j<Camps.length;j++)
	for(i=0;i<ArregloCampos[0].length;i++)
		if(ArregloCampos[1][i]+""==Camps[j]+"")
			if(CadRet.indexOf(ArregloCampos[0][i]+",")<0)
				CadRet+=ArregloCampos[0][i]+",";
if(CadRet.length>0)
	return(CadRet.substr(0,CadRet.length-1));
else
	return("");
}
function obtenerFloatEsp(pe_valor,pe_sepdec)
//Funci�n que elimina las comas de un float
//Par�metros:
//	pe_valor: valor de entrada
//      pe_sepdec: separador de decimal especificado en el servidor
//Retorna: el valor del float si el n�mero es v�lido
//         cero si el n�mero es inv�lido
//Desarrollado por: Johann Brice�o.  Fecha: 14/07/1999
//Modificado por: Elis Velasquez. Fecha: 29/04/2000
{
    if (pe_valor!="")
     {
      valor = DepurarEsp(pe_valor,pe_sepdec);
	  if (!isNaN(parseFloat(valor)))
	    return parseFloat(valor);
	  else
	    return 0;
	 }
	 else
	  return 0;
}

function DepurarEsp(pe_valor,pe_sepdec)
//funcion que depura el numero para realizar operaciones
//matematicas
//Parametros:
// pe_valor: Valor del Numero a depurar
// pe_sepdec: Indica el separador de decimal
//Retorna:
//El numero depurado
//Desarrollado por: Elis Velasquez. Fecha: 13/10/1999.
//Modificado por: Elis Velasquez. Fecha: 29/04/2000
{
   valor = pe_valor;
   if (valor!="")
   {
    if (Formatodec == ",")
 	{ while (valor.indexOf(".")>=0)
	   { valor = valor.replace(".","");
	   }
	   //valor = valor.replace(",",".");
	 }
    else if (Formatodec == ".")
 	 {
	  while (valor.indexOf(",")>=0)
	  {
 	   valor = valor.replace(",","");
	  }
	 }
   }
   else
    valor = "0";
   return(valor)
}


function FormatNumEsp(pe_valor,pe_sepdec)
//Funcion que formatea el numero
//con separador de mil y de Decimal
//Parametros:
// pe_valor: Valor del Numero a depurar
// pe_sepdec: Indica el separador de decimal
//Retorna:
//El numero depurado
//Desarrollado por: Elis Velasquez. Fecha: 13/10/1999.
//Modificado por: Elis Velasquez. Fecha: 29/04/2000
{
   pe_sepdec = Formatodec;
   pe_valor = DepurarEsp(pe_valor,pe_sepdec);
  //pe_valor = pe_valor.toString();
  //Separo primero el numero dado el separador decimal
  posDec = pe_valor.indexOf(pe_sepdec);
  if (posDec>=0)
  { var longiDecimales = pe_valor.length - posDec - 1;
    pe_valor = "" + (Math.round(parseFloat(Depurar1(pe_valor,pe_sepdec)) * Math.pow(10, parseInt(longiDecimales)))/Math.pow(10, parseInt(longiDecimales)));
    posDec = pe_valor.indexOf(".");
    if (posDec>=0){
	    var parteMiles = pe_valor.substring(0,posDec);
	    if (longiDecimales<2){
		var parteDecimal = pe_sepdec + pe_valor.substring(posDec+1,posDec+1+longiDecimales);
		var j = 0;
		for(j=1;j<=2-longiDecimales;j++){
		    parteDecimal = parteDecimal + "0";
		}
	    }else{
		var parteDecimal = pe_sepdec + pe_valor.substring(posDec+1,posDec+1+longiDecimales);
	    }
    }else{
	var parteMiles = pe_valor;
	var parteDecimal = "";
	if (pe_decimal!=0)  parteDecimal = pe_sepdec;
	for(i=1;i<=pe_decimal;i++){
		parteDecimal = parteDecimal + "0";
	}
    }

  }
  else
  { var parteMiles = pe_valor;
    var parteDecimal = pe_sepdec;
    var i = 0;
    for(i=1;i<=2;i++){
	parteDecimal = parteDecimal + "0";
    }
  }
  if (pe_sepdec==".")
    pe_sepmil =",";
  else
    pe_sepmil = ".";
  lon = parteMiles.length;
  while (lon>3)
  { parteMiles = parteMiles.substring(0,lon-3)+pe_sepmil+parteMiles.substring(lon-3);
    lon = lon-3;
  }
  pe_valor = parteMiles+parteDecimal;
  return(pe_valor);
 }

function esNumeroEsp(pe_objName,pe_decimal,pe_valorminimo,pe_valormaximo,pe_sepdec)
//Funcion que valida si es un numero el valor del Objeto
//Par�metros:
// pe_objName: Nombre del Objeto.
// pe_valorminimo: Valor minimo del rango de valores.
// pe_valormaximo: Valor maximo del rango de valores.
// pe_decimal: numero de lugares del decimal.
// pe_sepdec: Simbolo de separador de decimal.
//Retorna: 0 = No es un numero valido
//         2 = No se encuentra dentro del rango
//         3 = El valor minimo es mayor que el valor maximo, error en el dise�o
//         True, si es un numero flotante
//Desarrollado por: Elis Velasquez.  Fecha:07/05/1999
//Modificado por: Elis Velasqeuz.  Fecha: 29/04/2000
{
  var Valor = document.getElementById(pe_objName).value;
  if (Valor!=null)
  { if (parseFloat(DepurarEsp(Valor,pe_sepdec))==0) return true;
    //Validacion de los lugares del Decimal
    if (obtenerFloatEsp(Valor,pe_sepdec))
     {
       posDec = Valor.indexOf(pe_sepdec);
       if (pe_decimal>0&&posDec>=0)
         document.getElementById(pe_objName).value = FormatNumEsp(Valor,pe_sepdec);
       else if (pe_decimal==0&&posDec>=0)
         return 0;
       else if (pe_decimal>0&&posDec<0)
         document.getElementById(pe_objName).value = FormatNumEsp(Valor,pe_sepdec);
       else if (pe_decimal==0&&posDec<0)
         document.getElementById(pe_objName).value = Valor;
       else
         document.getElementById(pe_objName).value = FormatNumEsp(Valor,pe_sepdec);

       /*ValorMin = obtenerFloatEsp(pe_valorminimo);
       ValorMax = obtenerFloatEsp(pe_valormaximo);
       Valor = obtenerFloatEsp(Valor,pe_sepdec);
       if (ValorMin<=ValorMax)
        {
          if (Valor<ValorMin||Valor>ValorMax)
	       return 2;
     	 }
       else
	    return 3;*/
     }
    else
      return 0;
  }
  return true;
 }

function ValidarNumeroEsp(pe_objName,pe_decimal,pe_valorminimo,pe_valormaximo,pe_sepdec,pe_mensValNumero,pe_mensRango,pe_mensajeAceptar)
 { var estatus = esNumero(pe_objName,pe_decimal,pe_valorminimo,pe_valormaximo,pe_sepdec);
   if (estatus!=true)
   { switch(estatus)
      {//0 = No es un numero valido
       //2 = No se encuentra dentro del rango
       //3 = El valor minimo es mayor que el valor maximo, error en
          case 2:
////		if (IE){
			var mat = new Array();
			mat["cantB"] = 1;
			mat["boton1"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeAceptar+"' id='button1' name='button1'onclick='returnValue=false;window.close();'>";
			mat["mensaje"] = pe_mensRango + pe_valorminimo + " .. " + pe_valormaximo;
			mat["icono"] = "images/Alerta.gif";
			doDialog(mat);
////		}else{
////			alert(pe_mensRango + pe_valorminimo + " .. " + pe_valormaximo);
////		}
	        break;
         default:
////		if (IE){
			var mat = new Array();
			mat["cantB"] = 1;
			mat["boton1"] = "<input class='GrupoAcc' type='button' value='"+pe_mensajeAceptar+"' id='button1' name='button1'onclick='returnValue=false;window.close();'>";
			mat["mensaje"] = pe_mensValNumero;
			mat["icono"] = "images/Alerta.gif";
			doDialog(mat);
////		}else{
////			alert(pe_mensValNumero);
////		}
	        break;
      }
if(document.getElementById(pe_objName).type=="text")
     document.getElementById(pe_objName).focus();

     document.getElementById(pe_objName).value="";
     return(0);
   }
   return(1);
 }

var ArregloCampos=new Array(Array(),Array());
var ArregloFormulas=new Array(Array(),Array());
var FormulasGenerales=new Array(Array(),Array());  //Contiene las formulas gen�ricas para reconstruir matrices cuando se eliminen filas
var ind=0;

function RegistrarFormula(Formula,CampoActualizar,FilaInicial)
//Esta funci�n desglosa la formula ingresada para registrar
//cuales son los campos que son los campos sensibles y los que
//se deben actualizar
{

	var punto1=0;
	var punto2=0;
	var CampoFormula=new String();
	var CamposForm=new Array();
	var i=0;
	var RegFor=true;
	var Enc = false;
	var ii=0;

	while(!Enc&&ii<=FormulasGenerales[0].length)//Guardo la formula general en memoria para cuando se borre una fila de una matriz
	{
		if(FormulasGenerales[0][ii]==CampoActualizar.toString()&&FormulasGenerales[1][ii]==Formula.toString())
			Enc=true;
		else
			ii++;
	}

	if(!Enc)
	{
		ii=FormulasGenerales[0].length;
		FormulasGenerales[0][ii]=CampoActualizar;
		FormulasGenerales[1][ii]=Formula;
	}

	//Primero determino que voy a actualizar, si es una matriz o un campo externo
	if(CampoActualizar.indexOf("[")>0)//Aqui entra cuando hay que actualizar una columna de una matriz
	{
		if(Formula.indexOf("[")>0)
		{
			var ArrCampFjo=new Array(); //Aqui almaceno aquellos campos que son externos a la matriz
			var CampAux=new String();
			var NombreMatriz=new String();
			var ArrColumnas=new Array();
			punto1=0;
			while(punto1<Formula.length)//Saco los campos externos
			{
				punto1=Formula.indexOf(":",punto1);
				if(punto1<0)
					punto1=Formula.length+1;
				else
				{
					punto2=Formula.indexOf(":",punto1+1);
					CampAux=Formula.substring(punto1+1,punto2)+"";
					if(CampAux.indexOf("[")<0)
					{
						ArrCampFjo[ArrCampFjo.length]=CampAux
						CrearFuncionCampoCambio(CampAux);
					}
					punto1=punto2+1;
				}
			}
			punto1=0;


			while(punto1<Formula.length)//Desgloso la formula
			{
				punto1=Formula.indexOf(":",punto1);
				if(punto1<0)
					punto1=Formula.length+1;
				else
				{
					punto2=Formula.indexOf(":",punto1+1);
					CampAux=Formula.substring(punto1+1,punto2)+"";
					if(CampAux.indexOf("[")>=0)
					{
						if(NombreMatriz.length==0)
							NombreMatriz=CampAux.substring(0,CampAux.indexOf("["));
						ArrColumnas[ArrColumnas.length]=CampAux.substring(CampAux.indexOf(",")+1,CampAux.indexOf("]"));
					}

					punto1=punto2+1;
				}
			}
			var filas=new Number();
			var Columna = new Number();//Contiene la columna de la matriz que ser� actualizada
			Columna = CampoActualizar.substring(CampoActualizar.indexOf(",")+1,CampoActualizar.indexOf("]"));
			filas = document.getElementById("fil"+NombreMatriz).value;

			for(var i=FilaInicial;i<=filas;i++)
			{
				//interpretar la formula, registrarla y guardar la relacion de campos
				var frm = new String();
				frm=Formula;

				for(var j=0;j<ArrColumnas.length;j++)
				{
					if(frm.indexOf(":"+NombreMatriz+"[*,"+ArrColumnas[j]+"]:")>=0)
						while(frm.indexOf(":"+NombreMatriz+"[*,"+ArrColumnas[j]+"]:")>=0)
							frm=frm.replace(":"+NombreMatriz+"[*,"+ArrColumnas[j]+"]:",":M"+i+NombreMatriz+ArrColumnas[j]+":");
					CrearFuncionCampoCambio("M"+i+NombreMatriz+ArrColumnas[j]);
					GuardarRelacionCampos("M"+i+NombreMatriz+ArrColumnas[j],"M"+i+NombreMatriz+Columna);
				}
				GuardarFormula("M"+i+NombreMatriz+Columna,frm);
				for(var k=0;k<ArrCampFjo.length;k++)
					GuardarRelacionCampos(ArrCampFjo[k],"M"+i+NombreMatriz+Columna);

				//alert(frm);
			}
		}
		else//Cuando la actualizacion de la columna depende de campos externos unicamente
		{
			var filas = new Number();
			var Columna = new Number();
			var NombreMatriz=new String();
			var ArrCampRel=new Array();
			punto1=0;
			while(punto1<Formula.length)
			{
				punto1=Formula.indexOf(":",punto1);
				if(punto1<0)
					punto1=Formula.length+1;
				else
				{
					punto2=Formula.indexOf(":",punto1+1);
					ArrCampRel[ArrCampRel.length]=Formula.substring(punto1+1,punto2)+"";
					punto1=punto2+1;
				}
			}


			NombreMatriz = CampoActualizar.substring(0,CampoActualizar.indexOf("["));
			filas = document.getElementById("fil"+NombreMatriz).value;
			Columna = CampoActualizar.substring(CampoActualizar.indexOf(",")+1,CampoActualizar.indexOf("]"));

			for(var i=FilaInicial;i<=filas;i++)
			{
				CrearFuncionCampoCambio("M"+i+NombreMatriz+Columna);
				GuardarFormula("M"+i+NombreMatriz+Columna,Formula);
				for(var j=0;j<ArrCampRel.length;j++)
				{
					GuardarRelacionCampos(ArrCampRel[j],"M"+i+NombreMatriz+Columna);
					CrearFuncionCampoCambio(ArrCampRel[j]);
				}

			}
			ArrCampRel=null;

		}
	}
	else//Aqui cuando hay que actualizar un campo externo a una matriz
	{
		if(Formula.indexOf("[*,")>0)
		{
			alert("Esta formula no es v�lida");
			return(false);
		}
		else
		//Cuando la formula es v�lida
		//Solo se puede actualizar un campo externo cuando es operaciones sobre campos externos o cuando
		//es suma de columnas de matrices.
		{
			var CampoActual=new String();
			var filas = new Number();
			var CampoDesg=new String();
			var Columna=new Number();
					//Interpreto la formula
					//Desgloso cuales son los campos relacionados
					//GuardolasRelaciones de campos
					punto1=0;
					while(punto1<Formula.length)
					{
						punto1=Formula.indexOf(":",punto1);
						if(punto1<0)
						{
							punto1=Formula.length+1;
							break;
						}
						punto2=Formula.indexOf(":",punto1+1);
						CampoActual=Formula.substring(punto1+1,punto2)+"";
						if(CampoActual.indexOf("{+}")>0)//Debo registrar la funcion de cambio para cada campo de esta matriz
						{
							CampoDesg=CampoActual.substring(0,CampoActual.indexOf("["));
							filas=document.getElementById("fil"+CampoDesg).value;

							Columna = CampoActual.substring(CampoActual.indexOf(",")+1,CampoActual.indexOf("]"));
							for(var i=FilaInicial;i<=filas;i++)
							{
								//CrearFuncionCampoCambio("M"+i+CampoDesg+Columna);
								GuardarRelacionCampos("M"+i+CampoDesg+Columna,CampoActualizar);
							}
						}
						else
						{
							CrearFuncionCampoCambio(CampoActual);
							GuardarRelacionCampos(CampoActual,CampoActualizar);
						}
						punto1=punto2+1;
					}
					GuardarFormula(CampoActualizar,Formula);
		}
	}

	return(true);
}

function GuardarRelacionCampos(CampoActualizado,CampoActualizar)
{
	var i=0;
	var Enc=false;
	while(!Enc&&i<ArregloCampos[0].length)
	{
		if(ArregloCampos[0][i]==CampoActualizado&&ArregloCampos[1][i]==CampoActualizar)
			Enc=true
		else
			i++;
	}
	if(!Enc)
	{
		var zz=ArregloCampos[0].length ;
		ArregloCampos[0][zz]=CampoActualizado;
		ArregloCampos[1][zz]=CampoActualizar;
	}
}
function GuardarFormula(Campo,Formula)
{
var i=0;
var Enc=false;
while(!Enc&&i<ArregloFormulas[0].length)
{
	if(ArregloFormulas[0][i]==Campo&&ArregloFormulas[1][i]==Formula)
		Enc=true;
	else
		i++;
}

if(!Enc)//Si no se encontr� la relaci�n se agrega
{
	ArregloFormulas[0][ind]=Campo;
	ArregloFormulas[1][ind]=Formula;
	ind++;
}
}
function AgregaScript(contenido)
{

var scr=document.createElement("SCRIPT");
scr.defer=true;
scr.text=contenido;
document.getElementsByTagName('head')[0].appendChild(scr);

}

function PonerOnChangeEsp(Matriz,Fila,Columna,NombreFuncion)
{
	var matri="";
	if(Fila==0&&Columna==0)
	{
/*		var campo=document.getElementById(Matriz);
		campo.onchange=NombreFuncion;*/
		asignar_event("onchange",NombreFuncion,Matriz);
	}
	else
	{
/*		matri="M"+Fila+Matriz+Columna+"";
		var campo=document.getElementById(matri);
		campo.onchange=NombreFuncion;*/
		asignar_event("onchange",NombreFuncion,"M"+Fila+Matriz+Columna+"");
	}
}
function AplicarFormula(Campo)
{
//Evalua la formula y devuelve el resultado
try
{
	var i=0;
	var punto1=0;
	var punto2=0;
	var Formula=new String();
	var campo=new String();
	var valor=0;
	for(i=0;i<ArregloFormulas[0].length;i++)
	{
		var valor = 0;
		if(ArregloFormulas[0][i]+""==Campo+"")
		{
			Formula=ArregloFormulas[1][i]+"";
		//	console.log('campo y formula',Campo+" "+Formula );
			while(Formula.indexOf(":")>=0)
			{
				punto1=Formula.indexOf(":",punto1);
				punto2=Formula.indexOf(":",punto1+1);
				campo=Formula.substring(punto1+1,punto2);
				punto1=0;
				punto2=0;

				if(campo.indexOf("[")>0)//Para una matriz
				{
					if(campo.indexOf("{+}")>0)
					{
						var filas=parseFloat(document.getElementById("fil"+campo.substring(0,campo.indexOf("["))).value);
						var columna=campo.substring(campo.indexOf(",")+1 , campo.toString().indexOf("]"));
						var x=0;
						var valmat=new String();
						for(x=1;x<=filas;x++)
						{
							valmat= obtener_valorM(campo.substring(0,campo.indexOf("[")),x,columna);
							//document.getElementById("M"+x+campo.substring(0,campo.indexOf("["))+columna).value;
							valmat=Depurar1(valmat,Formatodec);
							valor=valor+parseFloat(valmat);
						}
						Formula=Formula.replace(":"+campo+":",valor);
						valor=0;
					}
				}
				else
				{
					if(document.getElementById(campo).type=="select-one")
					{
						var Or=document.getElementById(campo);
						valor=ObtValor(Or.options[Or.selectedIndex].text);
					}
					else
					{
						if(document.getElementById(campo).value=="")
							valor=0;
						else
							valor=parseFloat(Depurar1(document.getElementById(campo).value,Formatodec));
					}
					Formula=Formula.replace(":"+campo+":",valor);
					valor=0;
				}
			}

			valor=eval(Formula)+"";
			if (Formatodec==","){
				valor=valor.toString().replace(".",",");
			}else{
				valor=valor.toString();//.replace(".",",");
			}

			var nu_decimales = 2;
			try{
				nu_decimales = document.getElementById(Campo).getAttribute("data-numdec");
				if ((nu_decimales == "") || (nu_decimales+"" == "undefined") || (nu_decimales+"" == "null")){
					nu_decimales = 2;
				}

			}catch(e){nu_decimales = 2;}

			try{
				document.getElementById(Campo).value=FormatNum(valor,Formatodec,parseInt(nu_decimales));
				document.getElementById("SPAN_"+Campo).innerHTML=FormatNum(valor,Formatodec,parseInt(nu_decimales));
				//asignar_valor(Campo, FormatNum(valor,Formatodec,parseInt(nu_decimales)));
			}
			catch(mm)
			{}
		}

	}
	try{
		 //document.getElementById(Campo).onchange();
		 $('#'+Campo).change()
	}catch(e){
	}
	return(true);
}
catch(e)
{
	alert(e.description);
}
}


function BuscarCamposDependientes(Campos)
{
//Devuelve una cadena con los campos que dependen del indicado como par�metro
var cadena = new String();
var CadRet=new String();
cadena=Campos+"";
var Camps=new Array();
Camps=cadena.split(",");
var i=0;
var j=0;
for(j=0;j<Camps.length;j++)
	for(i=0;i<ArregloCampos[0].length;i++)
		if(ArregloCampos[0][i]+""==Camps[j]+"")
			if(CadRet.indexOf(ArregloCampos[1][i]+",")<0)
				CadRet+=ArregloCampos[1][i]+",";
return(CadRet.substr(0,CadRet.length-1));
}

function ActualizarCamposDependientes(NombreCampo)
{
//Busca los campos que dependen de NombreCampo y ejecuta la funci�n de Cambio para esos campos
	var i=0;
	var j=0;
	var punto1=0;
	var punto2=0;
	var CadenaCampos=new String();
	var CampAct=new Array();
	var Fin=false;
	CadenaCampos=BuscarCamposDependientes(NombreCampo);

	CampAct=CadenaCampos.split(",");
	j=0;
	while(!Fin)
	{
/*
		if (document.getElementById(NombreCampo).type != "hidden"){
			if (ValidarNumeroEsp(NombreCampo,document.getElementById(NombreCampo).getAttribute("data-numdec"),document.getElementById(NombreCampo).getAttribute("min"),document.getElementById(NombreCampo).getAttribute("max"),document.getElementById(NombreCampo).getAttribute("data-sepdec"),document.getElementById(NombreCampo).getAttribute("data-men1"),document.getElementById(NombreCampo).getAttribute("data-men2"),document.getElementById(NombreCampo).getAttribute("data-cad")) == 0){
				return(false);
			}
		}*/
		for(i=0;i<CampAct.length;i++)//Ejecuto las formulas de los campos indicados
			if(!AplicarFormula(CampAct[i])){
				alert("Falla en aplicar formula");
				return(false);
			}
	CadenaCampos=BuscarCamposDependientes(CampAct.join(","));
	if(CadenaCampos.length>0)
	{
		Fin=false;
		CampAct=CadenaCampos.split(",");
	}
	else
		Fin=true;

	}
	return(true);
}

function CrearFuncionCampoCambio(NombreCampo)
{
	var Camp=new String();
	Camp=NombreCampo;
	while(Camp.indexOf(" ")>=0)
		Camp=Camp.replace(" ","");
	if(Camp!="")
	{
		var str="function CambioCampo"+NombreCampo+"() { ";
		str+=" return(ActualizarCamposDependientes('"+NombreCampo+"')); }";
		AgregaScript(str);
		str="function Exec() { PonerOnChangeEsp('"+NombreCampo+"',0,0,'CambioCampo"+NombreCampo+"()'); }";
		AgregaScript(str);
		Exec();
	}
}


function ReconstruirFormulas(Matriz,Fila)
{
//Vuelve a cargar y asociar las formulas de las filas de la matriz que fue modificada
var i=0;
var Formula=new String();
var Campo=new String();
var j=FormulasGenerales[0].length;

for(i=0;i<j;i++)
{
	if(FormulasGenerales[0][i].toString().indexOf(Matriz,0)>=0)
	{
		RegistrarFormula(FormulasGenerales[1][i].toString(),FormulasGenerales[0][i].toString(),Fila);
		AplicarFormula(FormulasGenerales[0][i].toString());
	}
	else if(FormulasGenerales[1][i].toString().indexOf(Matriz+"[{+}",0)>=0)
	{
		RegistrarFormula(FormulasGenerales[1][i].toString(),FormulasGenerales[0][i].toString(),Fila);
		AplicarFormula(FormulasGenerales[0][i].toString());
	}

}
}
