const API_URL = 'http://localhost:3000/api/vinylos';

const form = document.getElementById('vinilo-form');
const nombreInput = document.getElementById('nombre-input');
const artistaInput = document.getElementById('artista-input');
const precioInput = document.getElementById('precio-input');
const listaVinilos = document.getElementById('lista-vinilos');

//READ obtener todos los vinilos registrados en la base de datos
async function obtenerVinilos() {
    const res = await fetch(API_URL);
    const vinylos = await res.json();

    listaVinilos.innerHTML = '';
    vinylos.forEach(vinilo => {
        const li = document.createElement('li');
        const precioFormateado = Number(vinilo.precio).toFixed(2);
        li.innerHTML = `
        <span>${vinilo.nombre} - ${vinilo.artista} - $${vinilo.precio}</span>
        <div class="acciones">
        <button onclick="editarVinilo(${vinilo.id}, '${vinilo.nombre}', '${vinilo.artista}', ${vinilo.precio})">Editar</button>
        <button onclick="eliminarVinilo(${vinilo.id})">Eliminar</button>
        </div>
        `;
        listaVinilos.appendChild(li);
    });
}

//CREATE agregar un nuevo vinilo a la base de datos
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = nombreInput.value.trim();
    const artista = artistaInput.value.trim();
    const precio = Number(precioInput.value);
    if (!nombre || !artista || isNaN(precio)) return;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ nombre, artista, precio })
    });
    nombreInput.value = '';
    artistaInput.value = '';
    precioInput.value = '';
    obtenerVinilos();
});

//UPDATE editar un vinilo existente en la base de datos
async function editarVinilo(id, nombreActual, artistaActual, precioActual) {
    const nuevoNombre = prompt('Ingrese el nuevo nombre del vinilo:', nombreActual);
    const nuevoArtista = prompt('Ingrese el nuevo artista del vinilo:', artistaActual);
    const nuevoPrecio = prompt('Ingrese el nuevo precio del vinilo:', precioActual);
    if (!nuevoNombre || !nuevoNombre.trim() ||
        !nuevoArtista || !nuevoArtista.trim() ||
        nuevoPrecio === null || nuevoPrecio.trim() === '' ||
        isNaN(Number(nuevoPrecio))) return;

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            nombre: nuevoNombre.trim(),
            artista: nuevoArtista.trim(),
            precio: Number(nuevoPrecio)
        })
    });
    obtenerVinilos();
}

//DELETE eliminar un vinilo de la base de datos
async function eliminarVinilo(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    obtenerVinilos();
}

obtenerVinilos();