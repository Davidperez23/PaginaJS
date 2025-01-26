
// Funcionalidad de las cookies
function establecerCookie(nombre, valor, dias) {
    const fecha = new Date();
    fecha.setTime(fecha.getTime() + dias * 24 * 60 * 60 * 1000);
    document.cookie = `${nombre}=${valor};expires=${fecha.toUTCString()};path=/`;
}

function obtenerCookie(nombre) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [clave, valor] = cookie.split('=');
        if (clave === nombre) return valor;
    }
    return null;
}

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

// Referencia al total del carrito
const totalCarritoRef = document.createElement('p');
totalCarritoRef.id = 'totalCarrito';
totalCarritoRef.textContent = "Total: 0€";
document.getElementById('carrito').appendChild(totalCarritoRef);

// Objeto para mantener las cantidades en el carrito
const carrito = {};

// Actualizar el total del carrito
function actualizarTotalCarrito() {
    let total = 0;
    for (const producto in carrito) {
        total += carrito[producto] * preciosProductos[producto];
    }
    totalCarritoRef.textContent = `Total: ${total.toFixed(2)}€`;
}

// Añadir producto al carrito con cantidad y stock
document.querySelectorAll('.añadirCarrito').forEach(boton => {
    boton.addEventListener('click', evento => {
        const producto = evento.target.closest('li').dataset.name;
        if (stockProductos[producto] > 0) {
            stockProductos[producto]--; // Reducir el stock
            stockRefs[producto].textContent = stockProductos[producto]; // Actualizar en el DOM

            // Actualizar la cantidad en el carrito
            if (!carrito[producto]) {
                carrito[producto] = 1;
                const listaCarrito = document.getElementById('listaCarrito');
                const elementoLista = document.createElement('li');
                elementoLista.dataset.name = producto;
                elementoLista.innerHTML = `${producto} x1 - ${preciosProductos[producto]}€ <button class="eliminarCarrito">Eliminar</button>`;
                listaCarrito.appendChild(elementoLista);
            } else {
                carrito[producto]++;
                const itemCarrito = Array.from(document.querySelectorAll('#listaCarrito li'))
                    .find(item => item.dataset.name === producto);
                itemCarrito.innerHTML = `${producto} x${carrito[producto]} - ${(
                    carrito[producto] * preciosProductos[producto]
                ).toFixed(2)}€ <button class="eliminarCarrito">Eliminar</button>`;
            }
            actualizarTotalCarrito();
        } else {
            alert(`Lo sentimos, no hay más stock disponible de ${producto}.`);
        }
    });
});

// Eliminar producto del carrito
document.addEventListener('click', (evento) => {
    if (evento.target.classList.contains('eliminarCarrito')) {
        const item = evento.target.closest('li');
        const producto = item.dataset.name;
        if (carrito[producto] > 0) {
            carrito[producto]--; // Reducir la cantidad en el carrito
            stockProductos[producto]++; // Incrementar el stock
            stockRefs[producto].textContent = stockProductos[producto]; // Actualizar en el DOM

            if (carrito[producto] === 0) {
                delete carrito[producto];
                item.remove(); // Eliminar del DOM
            } else {
                item.innerHTML = `${producto} x${carrito[producto]} - ${(
                    carrito[producto] * preciosProductos[producto]
                ).toFixed(2)}€ <button class="eliminarCarrito">Eliminar</button>`;
            }
            actualizarTotalCarrito();
        }
    }
});
