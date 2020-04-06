//var anchoVen = 0;
//var altoVen = 0;
$(document).ready(function(){
	//console.log($("#dialog").length);//verificarmos que el elemento exista
	//var modal = "<div id='modal'></div>"

	var modal = '<div id ="show_id" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static">'+
				  '<div class="modal-dialog" role="document">'+
					'<div class="modal-content">'+
					  '<div class="modal-header">'+
						'<button type="button" class="close accion_bot" valor="-1" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
						'<h4 class="modal-title">Mensaje</h4>'+
					  '</div>'+
					  '<div class="modal-body">'+

					  '</div>'+
					  '<div class="modal-footer">'+
					  '</div>'+
					'</div><!-- /.modal-content -->'+
				  '</div><!-- /.modal-dialog -->'+
				'</div><!-- /.modal -->';

	var dialog = $("#show_id").length;
	if(dialog != 1){
		$("#show_id").remove();

		$("body").append(modal);
		//console.log("div creado");
	}else{
		$("#show_id").remove();
		$("body").append(modal);
	}
});

function evitar_evento(id){
	var event = $("#"+id).attr("ng-click");
	if(event != "" || event != null){
		//se guarda el evento para ejecutarlo despues.
		if(localStorage.getItem(id)== ""){
			localStorage.setItem(id, event);
		}else{
			localStorage.removeItem(id);
			localStorage.setItem(id, event);
		}
		$("#"+id).prop('onclick', null).off('click');
	}

	return event;
}

function ejecutar_event(id_event){
	var obj = "angular.element($('[name=\"documentForm\"]')).scope()."
	evento = localStorage.getItem(id_event);

	rel = eval(obj+evento);
}
//rutina para mostrar un mensaje usando un doDialog
//Parametros:
//--->mensaje: El mensaje a mostrar.
//--->op: Indica que tipo de icono contextual se va a mostrar.
//---------------------->Si es 0, indica Informativo.
//---------------------->Si es 1, indica Pregunta.
//---------------------->Si es 2, indica alerta.
//--->cant_botones: Cantindad de botones a mostrar. Luego se debe colocar las
//                  cadenas de los botones segun la cantidad especificada.
//ejemplo:alertmb("Esto es una prueba. Desea continuar?",1,2,"Si","No");
function alertmb(mensaje,op,cant_botones){
	var mat = new Array();
	mat["cantB"] = cant_botones;

	//console.log(op);
	//console.log(mat);


	$(".modal-body").html(mensaje);
	//console.log(arguments);
	/*crear botones*/
	$(".modal-footer").html('');
	for(i=1;i<=cant_botones;i++){
					//mat["boton"+i] = "<input class='GrupoAcc' type='button' value='&nbsp;"+arguments[2+i]+"&nbsp;' id='button'"+i+" name='button'"+i+" onclick='returnValue="+i+";window.close();'>";
					boton = '<button type="button" valor="'+i+'" data-dismiss="modal" class="btn btn-default accion_bot">'+arguments[2+i]+'</button>';
					$(".modal-footer").append(boton);
		}


	/*evento de mostrar modal*/
	$('#show_id').modal('show');
	/*ejemplo de capturar datos de modal*/
	$('.accion_bot').unbind('click');
	$('.accion_bot').on("click", function(event){
		//console.log(event.target.attributes.valor.value);
	});
}
