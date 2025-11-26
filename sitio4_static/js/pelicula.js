// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const idPelicula = parseInt(params.get("id"));

// Referencias
const infoPelicula = document.getElementById("infoPelicula");
const galeria = document.getElementById("galeria");
const repartoDiv = document.getElementById("reparto");
const comentariosDiv = document.getElementById("comentarios");

// Buscar película en datos estáticos
const p = PELICULAS_DATA.find(m => m.id_pelicula === idPelicula);

if (!p) {
    infoPelicula.innerHTML = "<h2>Película no encontrada</h2>";
} else {
    // -------------------------------
    // Cargar información principal
    // -------------------------------
    function cargarInfoPelicula() {
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
    function cargarGaleria() {
        galeria.innerHTML = `
            <h3>Galería</h3>
            <div class="galeria-grid"></div>
        `;

        const grid = galeria.querySelector(".galeria-grid");

        if (p.imagenes && p.imagenes.length > 0) {
            p.imagenes.forEach(img => {
                grid.innerHTML += `
                    <img src="${img.ruta}" alt="img">
                `;
            });
        } else {
            grid.innerHTML = "<p>No hay imágenes disponibles.</p>";
        }
    }

    // -------------------------------
    // Reparto
    // -------------------------------
    function cargarReparto() {
        repartoDiv.innerHTML = `<h3>Reparto</h3>`;

        if (p.reparto && p.reparto.length > 0) {
            p.reparto.forEach(r => {
                repartoDiv.innerHTML += `
                    <div class="reparto-card">
                        <p><strong>${r.nombre_actor}</strong></p>
                        <p>${r.personaje ?? ""}</p>
                    </div>
                `;
            });
        } else {
            repartoDiv.innerHTML += "<p>No hay información de reparto.</p>";
        }
    }

    // -------------------------------
    // Comentarios
    // -------------------------------
    function cargarComentarios() {
        comentariosDiv.innerHTML = `
            <h3>Comentarios</h3>

            <form id="formComentario">
                <textarea name="comentario" required placeholder="Escribe un comentario..."></textarea>
                <button class="btn">Publicar</button>
            </form>

            <div id="listaComentarios"></div>
        `;

        document.getElementById("formComentario").addEventListener("submit", enviarComentario);
        renderizarComentarios();
    }

    function renderizarComentarios() {
        const lista = document.getElementById("listaComentarios");
        lista.innerHTML = "";

        if (p.comentarios && p.comentarios.length > 0) {
            p.comentarios.forEach(c => {
                lista.innerHTML += `
                    <div class="comentario-card">
                        <p><strong>${c.nombre_generado}</strong> (${c.fecha})</p>
                        <p>${c.comentario}</p>
                    </div>
                `;
            });
        } else {
            lista.innerHTML = "<p>No hay comentarios aún.</p>";
        }
    }

    // Enviar comentario (Simulado)
    function enviarComentario(e) {
        e.preventDefault();

        const form = e.target;
        const nuevoComentario = {
            nombre_generado: "Usuario Anónimo",
            fecha: new Date().toISOString().slice(0, 10),
            comentario: form.comentario.value
        };

        // Guardar en memoria local (se perderá al recargar)
        if (!p.comentarios) p.comentarios = [];
        p.comentarios.unshift(nuevoComentario);

        renderizarComentarios();
        form.reset();
    }

    // Inicialización
    cargarInfoPelicula();
    cargarGaleria();
    cargarReparto();
    cargarComentarios();
}
