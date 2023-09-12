// variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');




// eventos
eventListeners()
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);


    formulario.addEventListener('submit', agregarGasto);

}



// classes

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante()

    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0 )
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id) 
        this.calcularRestante();

        
    }
}


class UI {
    insertarPresupuesto(cantidad) {
      const { presupuesto, restante} = cantidad;
      document.querySelector('#total').textContent = presupuesto;
      document.querySelector('#restante').textContent = restante;
    }


    imprimirAlerta(mensaje, tipo) {
        // crear el div

        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');


        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger')
        } else {
            divMensaje.classList.add('alert-success')
        }

        divMensaje.textContent = mensaje;

        // insertar en html

        document.querySelector('.primario').insertBefore(divMensaje, formulario);


        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }


    mostrarGastos(gastos){

        this.limpiarHtml();
        
        // iterar sobre los gastos

        gastos.forEach(gasto => {
          
            const {cantidad, nombre, id } = gasto;
            // crear un Li

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
          
            nuevoGasto.dataset.id = id;

            



            // agreagr al html

            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>
            
            
            `

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto' );
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar)


            // borrar el gasto

            gastoListado.appendChild(nuevoGasto)
            
        });

    }

    limpiarHtml(){
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){

        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        // comprobar 25%
        if(( presupuesto / 4 ) > restante ) {
            console.log('Ya gastaste el 75%')
            restanteDiv.classList.remove('alert-success', 'alert-warning' );
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2 ) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add('alert-success')
        }


        // si el total es 0 o menor

        if(restante <= 0 ) {
            ui.imprimirAlerta('El Presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }


}

// instanciar

const ui = new UI();

let presupuesto;






// funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual Es tu Presupuesto?');

   /*  console.log(Number( presupuestoUsuario )) */

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }


    // presupuesto valido

    presupuesto = new Presupuesto(presupuestoUsuario)



    ui.insertarPresupuesto(presupuesto)

}

// agregar gastos

function agregarGasto(e){
    e.preventDefault();


    // leer los datos del form

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number( document.querySelector('#cantidad').value);

    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos Campos Son Obligatorios', 'error');

        return;

    } else if( cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad No Valida', 'error');

        return;
    }

   /// generar un objeto con gasto

   const gasto = {nombre, cantidad, id: Date.now()} 

   //añade un nuevo gasto

   presupuesto.nuevoGasto( gasto );

   ui.imprimirAlerta('Gasto Agregado Correctamente');


   // imprimir los gastos

   const { gastos, restante } = presupuesto;
   ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

   formulario.reset();



   
}


function eliminarGasto(id){
    presupuesto.eliminarGasto(id);
    const {gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos)

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}
