// Constructors
function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
// Realizar la cotización con los datos:
Seguro.prototype.cotizarSeguro = function(){
    //MARCA
    /*
        1 = Americano --> 1.15
        2 = Asiático --> 1.05
        3 = Europeo --> 1.35
    */
   let total;
   const base = 2000;

   switch (this.marca) {
        case '1':
           total = base * 1.15;
           break;
        case '2':
            total = base * 1.05;
            break;
        case '3':
            total = base * 1.35;
            break
        default:
           break;
   }

   //AÑO
   const diferencia  = new Date().getFullYear() - this.year;
   //Cada año se reduce el costo en un 3%:
   total -= ( (diferencia * 3) * total) / 100;

   //TIPO
   /*
       Si el seguro es básico se multiplica por 30% más
       Si el seguro es completo se multiplica por 50% más
    */
   if(this.tipo === 'basico'){
       total *= 1.3;
   }else{
       total *= 1.5;
   }
   
   return total;
}

function UI(){}

// Llena las opciones de los años:
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear();
    const min = max - 20;
    const selectYear = document.querySelector('#year');
    
    for(let i=max; i > min ; i--)
    {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
    }

//Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');
    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // Insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado')); //El primer parametro es lo que vamos a insertar y el segundo es elemento que usaremos como referencia para inserarlo.

    setTimeout(()=>{
        div.remove();
    }, 2000);
}

// Mostramos el resultado en pantalla:
UI.prototype.mostrarResultado = (seguro, total) => {
    const {marca, year, tipo} = seguro;
    let textoMarca;
    switch (marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
    
        default:
            break;
    }
    const div = document.createElement('div');
    div.classList.add('mt-10');
    div.innerHTML = `
    <p class="header">Tu Resumen</p>
    
    <p class="font-bold">Marca: <span class="font-normal">${textoMarca}<span></p>
    <p class="font-bold">Año: <span class="font-normal">${year}<span></p>
    <p class="font-bold">Tipo de Seguro: <span class="font-normal capitalize">${tipo}<span></p>
    <p class="font-bold">Total: <span class="font-normal">${total} Є<span></p>

    `;
    const resultadoDiv = document.querySelector('#resultado');
    
    //Mostrar spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    setTimeout( () => {
        spinner.style.display = 'none'; //Borramos el spinner
        resultadoDiv.appendChild(div); //Y mostramos el resultado
    },2000);
}


// Instanciar UI:
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); //Llena el select con los años
});

eventListeners();
function eventListeners(){
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();

    //Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    
    //Leer el año seleccionado
    const year = document.querySelector('#year').value;

    //Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if(marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Debes completar todos los campos', 'error');
        return;
    } 

    ui.mostrarMensaje('Cotizando su seguro...', 'exito');

    //Ocultar las cotizaciones previas:
    const resultadoPrevio = document.querySelector('#resultado div');
    if(resultadoPrevio != null){
        resultadoPrevio.remove();
    }

    //Instanciar seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    //Utilizar prototype del seguro
    ui.mostrarResultado(seguro, total);
}
