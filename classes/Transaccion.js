class Transaccion {

    static historial = [];

    constructor(id,fecha,usuario, tipo, descripcion, monto, categoria){
        this.id = id;
        this.fecha= fecha;
        this.usuario = usuario;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.monto = parseFloat(monto);
        this.categoria = categoria

        
        Transaccion.historial.push(this);

    }


    static eliminarPorId(id) {
        Transaccion.historial = Transaccion.historial.filter(t => t.id !== id);
    }
   




}