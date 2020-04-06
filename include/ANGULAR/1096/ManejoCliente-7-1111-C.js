function manejadorAccion(){
  switch (obtener_valor("FUNCATA")) {
	case 'Agregar':
		MostrarGrupo('AGREGAR PRODUCTOS');
		OcultarGrupo( 'MODIFICAR PRODUCTOS' );
		break;
	case 'Modificar':
		OcultarGrupo( 'AGREGAR PRODUCTOS' );
		MostrarGrupo( 'MODIFICAR PRODUCTOS' );
		break;
	default:
		OcultarGrupo( 'AGREGAR PRODUCTOS' );
		OcultarGrupo( 'MODIFICAR PRODUCTOS' );
}
}

manejadorAccion();
