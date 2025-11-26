// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const idPelicula = params.get("id");

// Referencias
const infoPelicula = document.getElementById("infoPelicula");
const galeria = document.getElementById("galeria");
const repartoDiv = document.getElementById("reparto");
const comentariosDiv = document.getElementById("comentarios");

// -------------------------------
// Cargar información principal
// -------------------------------
async function cargarInfoPelicula() {
    const resp = await fetch(`/api/peliculas/${idPelicula}`);
    const p = await resp.json();

    infoPelicula.innerHTML = `
        <img src="${p.poster}" alt="${p.titulo}">
        
        <div class="info-texto">
            <h2>${p.titulo}</h2>

            <p><strong>Fecha:</strong> ${p.fecha_estreno ?? "N/D"}</p>
            <p><strong>Duración:</strong> ${p.duracion ?? "N/D"}</p>
            <p><strong>Género:</strong> ${p.genero ?? "N/D"}</p>
            <p><strong>Director:</strong> ${p.director ?? "N/D"}</p>
            <p><strong>País:</strong> ${p.pais ?? "N/D"}</p>
            <p><strong>Clasificación:</strong> ${p.clasificacion ?? "N/D"}</p>

            <h3>Sinopsis</h3>
            <p>${p.sinopsis}</p>

            <h3>Trailer</h3>
            <iframe width="420" height="250" src="${p.trailer_url}" frameborder="0" allowfullscreen></iframe>
        </div>
    `;
}

// -------------------------------
// Galería
// -------------------------------
async function cargarGaleria() {
    const resp = await fetch(`/api/peliculas/${idPelicula}/imagenes`);
    const data = await resp.json();

    galeria.innerHTML = `
        <h3>Galería</h3>
        <div class="galeria-grid"></div>
    `;

    const grid = galeria.querySelector(".galeria-grid");

    data.imagenes.forEach(img => {
        grid.innerHTML += `
            <img src="${img.ruta}" alt="img">
        `;
    });
}

// -------------------------------
// Reparto
// -------------------------------
async function cargarReparto() {
    const resp = await fetch(`/api/peliculas/${idPelicula}/reparto`);
    const data = await resp.json();

    repartoDiv.innerHTML = `<h3>Reparto</h3>`;

    data.reparto.forEach(r => {
        repartoDiv.innerHTML += `
            <div class="reparto-card">
                <p><strong>${r.nombre_actor}</strong></p>
                <p>${r.personaje ?? ""}</p>
            </div>
        `;
    });
}

// -------------------------------
// Comentarios
// -------------------------------
async function cargarComentarios() {
    const resp = await fetch(`/api/peliculas/${idPelicula}/comentarios`);
    const data = await resp.json();

    comentariosDiv.innerHTML = `
        <h3>Comentarios</h3>

        <form id="formComentario">
            <textarea name="comentario" required placeholder="Escribe un comentario..."></textarea>
            <button class="btn">Publicar</button>
        </form>

        <div id="listaComentarios"></div>
    `;

    document.getElementById("formComentario").addEventListener("submit", enviarComentario);

    const lista = document.getElementById("listaComentarios");
    lista.innerHTML = "";

    data.comentarios.forEach(c => {
        lista.innerHTML += `
            <div class="comentario-card">
                <p><strong>${c.nombre_generado}</strong> (${c.fecha.slice(0, 10)})</p>
                <p>${c.comentario}</p>
            </div>
        `;
    });
}

// Enviar comentario
async function enviarComentario(e) {
    e.preventDefault();

    const form = e.target;
    const formData = {
        comentario: form.comentario.value
    };

    const resp = await fetch(`/api/peliculas/${idPelicula}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    const data = await resp.json();

    if (data.ok) {
        cargarComentarios();
        form.reset();
    }
}
    
// Inicialización
cargarInfoPelicula();
cargarGaleria();
cargarReparto();
cargarComentarios();
