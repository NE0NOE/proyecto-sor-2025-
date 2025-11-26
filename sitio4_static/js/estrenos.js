// Llamamos a la API real del backend
async function cargarEstrenos() {
    // Simular carga
    const peliculas = PELICULAS_DATA;

    const grid = document.getElementById("peliculasGrid");
    grid.innerHTML = "";

    peliculas.forEach(p => {
        grid.innerHTML += `
            <div class="pelicula-card" onclick="verPelicula(${p.id_pelicula})">
                <img src="${p.poster}" alt="${p.titulo}">
                <h3>${p.titulo}</h3>
            </div>
        `;
    });
}

function verPelicula(id) {
    window.location.href = `pelicula.html?id=${id}`;
}

cargarEstrenos();
