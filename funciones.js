const formulario = document.getElementById('formulario');
const listaTransacciones = document.getElementById('lista-transacciones');
const totalIngresos = document.getElementById('total-ingresos');
const totalGastos = document.getElementById('total-gastos');
const balanceNeto = document.getElementById('balance-neto');

const filtroCategoria = document.getElementById('filtro-categoria');
const filtroTipo = document.getElementById('filtro-tipo');
const btnLimpiarFiltros = document.getElementById('btn-limpiar-filtros');

[filtroCategoria, filtroTipo].forEach(input => {
    input.addEventListener('input', actualizarInterfaz);
});

btnLimpiarFiltros.addEventListener('click', () => {
    filtroCategoria.value = '';
    filtroTipo.value = '';
    actualizarInterfaz();
});

document.addEventListener('DOMContentLoaded', function() {
    const datosGuardados = localStorage.getItem('historialFinanzas');
    if (datosGuardados !== null) {
        Transaccion.historial = JSON.parse(datosGuardados);
        actualizarInterfaz();
    }
});

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); 
    
    const id = Date.now();
    const fecha = document.getElementById('fecha').value;
    const usuario = document.getElementById('operario').value;
    const descripcion = document.getElementById('descripcion').value;
    const monto = document.getElementById('monto').value;
    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;

    new Transaccion(id, fecha, usuario, tipo, descripcion, monto, categoria);
    
    actualizarInterfaz();
    formulario.reset();
});

function actualizarInterfaz() {
    listaTransacciones.innerHTML = '';
    
    let sumaIngresos = 0;
    let sumaGastos = 0;
    
    Transaccion.historial.forEach(t => {
        if (t.tipo === 'ingreso') {
            sumaIngresos += Number(t.monto);
        } else {
            sumaGastos += Number(t.monto);
        }
    });

    totalIngresos.innerText = `$${sumaIngresos.toFixed(2)}`;
    totalGastos.innerText = `$${sumaGastos.toFixed(2)}`;
    balanceNeto.innerText = `$${(sumaIngresos - sumaGastos).toFixed(2)}`;

    // 2. Filtramos la lista evaluando ÚNICAMENTE categoría y tipo
    const transaccionesFiltradas = Transaccion.historial.filter(t => {
        const coincideCategoria = filtroCategoria.value === '' || t.categoria === filtroCategoria.value;
        const coincideTipo = filtroTipo.value === '' || t.tipo === filtroTipo.value;
        
        return coincideCategoria && coincideTipo;
    });

    transaccionesFiltradas.forEach(t => {
        const colorMonto = t.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600';
        const signo = t.tipo === 'ingreso' ? '+' : '-';

        const fila = document.createElement('tr');
        fila.className = 'hover:bg-gray-50 transition duration-150';
        fila.innerHTML = `
            <td class="py-2 px-2 text-sm text-gray-600">${t.fecha}</td>
            <td class="py-2 px-2 text-sm font-medium">${t.usuario}</td>
            <td class="py-2 px-2 text-sm">${t.descripcion}</td>
            <td class="py-2 px-2 text-sm text-gray-500">${t.categoria}</td>
            <td class="py-2 px-2 font-bold text-right ${colorMonto}">${signo}$${Number(t.monto).toFixed(2)}</td>
            <td class="py-2 px-2 text-center">
                <button data-id="${t.id}" class="btn-eliminar text-xs text-gray-400 hover:text-red-600 transition-colors">Eliminar</button>
            </td>
        `;
        listaTransacciones.appendChild(fila);
    });

    localStorage.setItem('historialFinanzas', JSON.stringify(Transaccion.historial));
}

window.borrarRegistro = function(id) {
    Transaccion.eliminarPorId(id); 
    actualizarInterfaz();     
};

//Rodriguez Pilar
//Peralta Agustin N