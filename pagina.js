// Objeto para mantener las cantidades en el carrito
let carrito = {};

// Alternar tema
const cambiarTema = document.getElementById('cambiarTema');
cambiarTema.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const tema = document.body.classList.contains('dark-theme') ? 'oscuro' : 'claro';
    establecerCookie('tema', tema, 7);
});

// Aplicar tema guardado
const temaGuardado = obtenerCookie('tema');
if (temaGuardado === 'oscuro') {
    document.body.classList.add('dark-theme');
}

// Aplicar tema guardado
const guardadoCarrito = obtenerCookie('totalCarrito');
if (guardadoCarrito === 'totalCarrito') {
    document.getElementById('carrito').appendChild(totalCarritoRef);
}

// Inicializar el stock y precios de productos
const stockProductos = {
    "Camiseta Duki": 50,
    "Gorra Duki": 50,
    "Poster Duki": 50
};

const preciosProductos = {
    "Camiseta Duki": 35,
    "Gorra Duki": 24.66,
    "Poster Duki": 37.03
};

// Referencias al stock en el DOM
const stockRefs = {
    "Camiseta Duki": document.getElementById("stockCamiseta"),
    "Gorra Duki": document.getElementById("stockGorra"),
    "Poster Duki": document.getElementById("stockPoster")
};

// Referencia al total del carrito en el DOM
const totalCarritoRef = document.createElement('p');
totalCarritoRef.id = 'totalCarrito';
totalCarritoRef.textContent = "Total: 0€";
document.getElementById('carrito').appendChild(totalCarritoRef);

// Funcionalidad de cookies
function establecerCookie(nombre, valor, dias) {
    const fecha = new Date();
    fecha.setTime(fecha.getTime() + dias * 24 * 60 * 60 * 1000);
    document.cookie = `${nombre}=${encodeURIComponent(valor)};expires=${fecha.toUTCString()};path=/`;
}

function obtenerCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [clave, valor] = cookie.split('=');
        if (clave === nombre) return decodeURIComponent(valor);
    }
    return null;
}


function actualizarTotalCarrito() {
    let total = 0;
    for (const producto in carrito) {
        total += carrito[producto] * preciosProductos[producto];
    }
    totalCarritoRef.textContent = `Total: ${total.toFixed(2)}€`;
    establecerCookie("carrito", JSON.stringify(carrito), 7);
}

function actualizarCarritoDOM() {
    const listaCarrito = document.getElementById('listaCarrito');
    listaCarrito.innerHTML = "";
    for (const producto in carrito) {
        if (carrito[producto] > 0) {
            const elementoLista = document.createElement('li');
            elementoLista.dataset.name = producto;
            elementoLista.innerHTML = `${producto} x${carrito[producto]} - ${(carrito[producto] * preciosProductos[producto]).toFixed(2)}€ <button class="eliminarCarrito">Eliminar</button>`;
            listaCarrito.appendChild(elementoLista);
        }
    }
    actualizarTotalCarrito();
}

// Añadir producto al carrito
document.querySelectorAll('.añadirCarrito').forEach(boton => {
    boton.addEventListener('click', evento => {
        const producto = evento.target.closest('li').dataset.name;
        if (stockProductos[producto] > 0) {
            stockProductos[producto]--;
            stockRefs[producto].textContent = stockProductos[producto];
            
            if (!carrito[producto]) {
                carrito[producto] = 1;
            } else {
                carrito[producto]++;
            }
            actualizarCarritoDOM();
        }
    });
});

// Eliminar producto del carrito
document.addEventListener('click', (evento) => {
    if (evento.target.classList.contains('eliminarCarrito')) {
        const item = evento.target.closest('li');
        const producto = item.dataset.name;
        if (carrito[producto] > 0) {
            carrito[producto]--;
            stockProductos[producto]++;
            stockRefs[producto].textContent = stockProductos[producto];
            
            if (carrito[producto] === 0) {
                delete carrito[producto];
            }
            actualizarCarritoDOM();
        }
    }
});

// Cargar carrito desde la cookie
window.onload = function() {
    const carritoGuardado = obtenerCookie("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(decodeURIComponent(carritoGuardado));
        actualizarCarritoDOM();
    }
};

