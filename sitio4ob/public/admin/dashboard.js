const adminName = document.getElementById("adminName");
const btnLogout = document.getElementById("btnLogout");

// Verifica si hay sesión activa
async function verificarSesion() {
    const resp = await fetch("/api/admin/me");

    if (!resp.ok) {
        // No logueado → regresar al login
        window.location.href = "login.html";
        return;
    }

    const data = await resp.json();
    adminName.textContent = data.admin.nombre;
}

verificarSesion();

// Cerrar sesión
btnLogout.addEventListener("click", async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "login.html";
});

// --------------------------
// MENÚ LATERAL (listado inicial)
// --------------------------
const contentArea = document.getElementById("contentArea");

// Botones del menú
document.getElementById("linkPeliculas").addEventListener("click", async () => {
    cargarModuloPeliculas();
});

async function cargarModuloPeliculas() {
    contentArea.innerHTML = `
        <h2>Gestión de Películas</h2>
        <button id="btnNuevaPelicula" class="btn-primary">+ Nueva Película</button>

        <table class="tabla">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Póster</th>
                    <th>Título</th>
                    <th>Fecha</th>
                    <th>Género</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tablaPeliculas"></tbody>
        </table>
    `;

    document.getElementById("btnNuevaPelicula").addEventListener("click", mostrarFormularioNuevaPelicula);

    cargarPeliculas();
}

async function cargarPeliculas() {
    const resp = await fetch("/api/peliculas");
    const data = await resp.json();

    const tbody = document.getElementById("tablaPeliculas");
    tbody.innerHTML = "";

    data.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id_pelicula}</td>
                <td><img src="${p.poster}" class="poster-mini"></td>
                <td>${p.titulo}</td>
                <td>${p.fecha_estreno ?? "-"}</td>
                <td>${p.genero ?? "-"}</td>

                <td>
                    <button class="btn-edit" onclick="editarPelicula(${p.id_pelicula})">Editar</button>
                    <button class="btn-delete" onclick="eliminarPelicula(${p.id_pelicula})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function mostrarFormularioNuevaPelicula() {
    contentArea.innerHTML = `
        <h2>Nueva Película</h2>

        <form id="formNuevaPelicula" enctype="multipart/form-data">

            <label>Título</label>
            <input type="text" name="titulo" required>

            <label>Sinopsis</label>
            <textarea name="sinopsis"></textarea>

            <label>Fecha de estreno</label>
            <input type="date" name="fecha_estreno">

            <label>Duración</label>
            <input type="text" name="duracion">

            <label>Género</label>
            <input type="text" name="genero">

            <label>Director</label>
            <input type="text" name="director">

            <label>País</label>
            <input type="text" name="pais">

            <label>Clasificación</label>
            <input type="text" name="clasificacion">

            <label>Póster</label>
            <input type="file" name="poster" accept="image/*">

            <button type="submit" class="btn-primary">Guardar</button>
        </form>
    `;

    document.getElementById("formNuevaPelicula").addEventListener("submit", crearPelicula);
}

async function crearPelicula(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const resp = await fetch("/api/peliculas", {
        method: "POST",
        body: formData
    });

    const data = await resp.json();

    if (data.ok) {
        alert("Película creada correctamente");
        cargarModuloPeliculas();
    } else {
        alert("Error: " + data.error);
    }
}

async function editarPelicula(id) {
    const resp = await fetch(`/api/peliculas/${id}`);
    const p = await resp.json();

    contentArea.innerHTML = `
        <h2>Editar Película</h2>

        <form id="formEditarPelicula" enctype="multipart/form-data">
            <input type="hidden" name="id_pelicula" value="${p.id_pelicula}">

            <label>Título</label>
            <input type="text" name="titulo" value="${p.titulo}" required>

            <label>Sinopsis</label>
            <textarea name="sinopsis">${p.sinopsis ?? ""}</textarea>

            <label>Fecha de estreno</label>
            <input type="date" name="fecha_estreno" value="${p.fecha_estreno ?? ""}">

            <label>Duración</label>
            <input type="text" name="duracion" value="${p.duracion ?? ""}">

            <label>Género</label>
            <input type="text" name="genero" value="${p.genero ?? ""}">

            <label>Director</label>
            <input type="text" name="director" value="${p.director ?? ""}">

            <label>País</label>
            <input type="text" name="pais" value="${p.pais ?? ""}">

            <label>Clasificación</label>
            <input type="text" name="clasificacion" value="${p.clasificacion ?? ""}">

            <label>Póster (opcional)</label>
            <input type="file" name="poster" accept="image/*">

            <button type="submit" class="btn-primary">Guardar Cambios</button>
        </form>
    `;

    document.getElementById("formEditarPelicula").addEventListener("submit", actualizarPelicula);
}

async function actualizarPelicula(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const id = formData.get("id_pelicula");

    const resp = await fetch(`/api/peliculas/${id}`, {
        method: "PUT",
        body: formData
    });

    const data = await resp.json();

    if (data.ok) {
        alert("Película actualizada correctamente");
        cargarModuloPeliculas();
    } else {
        alert("Error: " + data.error);
    }
}

async function eliminarPelicula(id) {
    if (!confirm("¿Seguro que deseas eliminar esta película?")) return;

    const resp = await fetch(`/api/peliculas/${id}`, {
        method: "DELETE"
    });

    const data = await resp.json();

    if (data.ok) {
        alert("Película eliminada");
        cargarModuloPeliculas();
    } else {
        alert("Error: " + data.error);
    }
}



document.getElementById("linkGaleria").addEventListener("click", () => {
    cargarModuloGaleria();
});

async function cargarModuloGaleria() {
    contentArea.innerHTML = `
        <h2>Gestión de Galería</h2>

        <label>Selecciona una película:</label>
        <select id="selectPeliculas" class="select"></select>

        <div id="galeriaContainer" class="galeria-container"></div>
    `;

    await cargarPeliculasEnSelect();
}

async function cargarPeliculasEnSelect() {
    const resp = await fetch("/api/peliculas");
    const peliculas = await resp.json();

    const select = document.getElementById("selectPeliculas");
    select.innerHTML = `<option value="">-- Seleccionar --</option>`;

    peliculas.forEach(p => {
        select.innerHTML += `<option value="${p.id_pelicula}">${p.titulo}</option>`;
    });

    select.addEventListener("change", () => {
        if (select.value) cargarGaleriaPelicula(select.value);
    });
}

async function cargarGaleriaPelicula(idPelicula) {
    const resp = await fetch(`/api/peliculas/${idPelicula}/imagenes`);
    const data = await resp.json();

    const container = document.getElementById("galeriaContainer");

    container.innerHTML = `
        <h3>Imágenes de la película</h3>

        <form id="formNuevaImagen" enctype="multipart/form-data">
            <input type="file" name="imagen" required>
            <input type="text" name="descripcion" placeholder="Descripción (opcional)">
            <button class="btn-primary" type="submit">Subir Imagen</button>
        </form>

        <div id="imagenesGrid" class="imagenes-grid"></div>
    `;

    document.getElementById("formNuevaImagen").addEventListener("submit", (e) => {
        subirImagenGaleria(e, idPelicula);
    });

    mostrarImagenesEnGrid(data.imagenes);
}

function mostrarImagenesEnGrid(imagenes) {
    const grid = document.getElementById("imagenesGrid");
    grid.innerHTML = "";

    if (!imagenes.length) {
        grid.innerHTML = "<p>No hay imágenes registradas.</p>";
        return;
    }

    imagenes.forEach(img => {
        grid.innerHTML += `
            <div class="img-card">
                <img src="${img.ruta}">
                <p>${img.descripcion ?? ""}</p>
                <button class="btn-delete" onclick="eliminarImagen(${img.id_imagen})">Eliminar</button>
            </div>
        `;
    });
}

async function subirImagenGaleria(e, idPelicula) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const resp = await fetch(`/api/peliculas/${idPelicula}/imagenes`, {
        method: "POST",
        body: formData
    });

    const data = await resp.json();

    if (data.ok) {
        alert("Imagen subida correctamente");
        cargarGaleriaPelicula(idPelicula);
    } else {
        alert("Error: " + data.error);
    }
}

async function eliminarImagen(idImagen) {
    if (!confirm("¿Eliminar esta imagen?")) return;

    const resp = await fetch(`/api/peliculas/imagenes/${idImagen}`, {
        method: "DELETE"
    });

    const data = await resp.json();

    if (data.ok) {
        alert("Imagen eliminada");
        document.getElementById("selectPeliculas").dispatchEvent(new Event("change"));
    } else {
        alert("Error: " + data.error);
    }
}



document.getElementById("linkReparto").addEventListener("click", () => {
    cargarModuloReparto();
});

async function cargarModuloReparto() {
    contentArea.innerHTML = `
        <h2>Gestión de Reparto</h2>

        <label>Selecciona una película:</label>
        <select id="selectPeliculasReparto" class="select"></select>

        <div id="repartoContainer" class="reparto-container"></div>
    `;

    await cargarPeliculasEnSelect_Reparto();
}

async function cargarPeliculasEnSelect_Reparto() {
    const resp = await fetch("/api/peliculas");
    const peliculas = await resp.json();

    const select = document.getElementById("selectPeliculasReparto");
    select.innerHTML = `<option value="">-- Seleccionar --</option>`;

    peliculas.forEach(p => {
        select.innerHTML += `<option value="${p.id_pelicula}">${p.titulo}</option>`;
    });

    select.addEventListener("change", () => {
        if (select.value) cargarRepartoPelicula(select.value);
    });
}

async function cargarRepartoPelicula(idPelicula) {
    const resp = await fetch(`/api/peliculas/${idPelicula}/reparto`);
    const data = await resp.json();

    const container = document.getElementById("repartoContainer");

    container.innerHTML = `
        <h3>Actores</h3>

        <form id="formNuevoActor">
            <input type="text" name="nombre_actor" placeholder="Nombre del actor" required>
            <input type="text" name="personaje" placeholder="Personaje">
            <button class="btn-primary" type="submit">Añadir Actor</button>
        </form>

        <table class="tabla">
            <thead>
                <tr>
                    <th>Actor</th>
                    <th>Personaje</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tablaReparto"></tbody>
        </table>
    `;

    document.getElementById("formNuevoActor").addEventListener("submit", (e) => {
        crearActor(e, idPelicula);
    });

    mostrarRepartoEnTabla(data.reparto);
}

function mostrarRepartoEnTabla(reparto) {
    const tbody = document.getElementById("tablaReparto");
    tbody.innerHTML = "";

    if (!reparto.length) {
        tbody.innerHTML = "<tr><td colspan='3'>No hay actores registrados.</td></tr>";
        return;
    }

    reparto.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td>${r.nombre_actor}</td>
                <td>${r.personaje ?? "-"}</td>
                <td>
                    <button class="btn-edit" onclick="editarActor(${r.id_reparto}, '${r.nombre_actor}', '${r.personaje ?? ""}')">Editar</button>
                    <button class="btn-delete" onclick="eliminarActor(${r.id_reparto})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

async function crearActor(e, idPelicula) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
        nombre_actor: formData.get("nombre_actor"),
        personaje: formData.get("personaje")
    };

    const resp = await fetch(`/api/peliculas/${idPelicula}/reparto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const r = await resp.json();

    if (r.ok) {
        alert("Actor añadido");
        cargarRepartoPelicula(idPelicula);
    } else {
        alert("Error: " + r.error);
    }
}

function editarActor(id, nombre, personaje) {
    contentArea.innerHTML = `
        <h2>Editar Actor</h2>

        <form id="formEditarActor">
            <label>Nombre del actor</label>
            <input type="text" name="nombre_actor" value="${nombre}" required>

            <label>Personaje</label>
            <input type="text" name="personaje" value="${personaje}">

            <button class="btn-primary" type="submit">Guardar cambios</button>
        </form>
    `;

    document.getElementById("formEditarActor").addEventListener("submit", (e) => {
        actualizarActor(e, id);
    });
}

async function actualizarActor(e, id_actor) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
        nombre_actor: formData.get("nombre_actor"),
        personaje: formData.get("personaje")
    };

    const resp = await fetch(`/api/peliculas/reparto/${id_actor}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const r = await resp.json();

    if (r.ok) {
        alert("Actor actualizado correctamente");
        cargarModuloReparto();
    } else {
        alert("Error: " + r.error);
    }
}

async function eliminarActor(id) {
    if (!confirm("¿Seguro que deseas eliminar este actor?")) return;

    const resp = await fetch(`/api/peliculas/reparto/${id}`, {
        method: "DELETE"
    });

    const data = await resp.json();

    if (data.ok) {
        alert("Actor eliminado");
        cargarModuloReparto();
    } else {
        alert("Error: " + data.error);
    }
}



document.getElementById("linkComentarios").addEventListener("click", () => {
    cargarModuloComentarios();
});

async function cargarModuloComentarios() {
    contentArea.innerHTML = `
        <h2>Moderación de Comentarios</h2>

        <label>Selecciona una película:</label>
        <select id="selectPeliculasComentarios" class="select"></select>

        <div id="comentariosContainer" class="comentarios-container"></div>
    `;

    await cargarPeliculasEnSelect_Comentarios();
}

async function cargarPeliculasEnSelect_Comentarios() {
    const resp = await fetch("/api/peliculas");
    const peliculas = await resp.json();

    const select = document.getElementById("selectPeliculasComentarios");
    select.innerHTML = `<option value="">-- Seleccionar --</option>`;

    peliculas.forEach(p => {
        select.innerHTML += `<option value="${p.id_pelicula}">${p.titulo}</option>`;
    });

    select.addEventListener("change", () => {
        if (select.value) cargarComentariosPelicula(select.value);
    });
}

async function cargarComentariosPelicula(idPelicula) {
    const resp = await fetch(`/api/peliculas/${idPelicula}/comentarios`);
    const data = await resp.json();

    const container = document.getElementById("comentariosContainer");

    container.innerHTML = `
        <h3>Comentarios registrados</h3>

        <div id="comentariosList" class="comentarios-list"></div>
    `;

    mostrarComentarios(data.comentarios);
}

function mostrarComentarios(lista) {
    const div = document.getElementById("comentariosList");
    div.innerHTML = "";

    if (!lista.length) {
        div.innerHTML = "<p>No hay comentarios registrados.</p>";
        return;
    }

    lista.forEach(c => {
        div.innerHTML += `
            <div class="comentario-card">
                <p><strong>${c.nombre_generado}</strong> (${c.fecha.slice(0, 10)})</p>
                <p>${c.comentario}</p>

                <button class="btn-delete" onclick="eliminarComentario(${c.id_comentario})">
                    Eliminar
                </button>

                ${c.id_padre ? `<span class="respuesta">Respuesta de ${c.id_padre}</span>` : ""}
            </div>
        `;
    });
}

async function eliminarComentario(idComentario) {
    if (!confirm("¿Seguro que deseas eliminar este comentario?")) return;

    const resp = await fetch(`/api/peliculas/comentarios/${idComentario}`, {
        method: "DELETE"
    });

    const data = await resp.json();

    if (data.ok) {
        alert("Comentario eliminado");

        // Recargar automáticamente la película seleccionada
        document.getElementById("selectPeliculasComentarios")
            .dispatchEvent(new Event("change"));

    } else {
        alert("Error: " + data.error);
    }
}


