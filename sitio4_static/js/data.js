// Datos simulados de películas
const PELICULAS_DATA = [
    {
        id_pelicula: 1,
        titulo: "Inception",
        poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        fecha_estreno: "2010-07-16",
        duracion: "148 min",
        genero: "Ciencia Ficción",
        director: "Christopher Nolan",
        pais: "USA",
        clasificacion: "PG-13",
        sinopsis: "Un ladrón que roba secretos corporativos a través del uso de la tecnología de compartir sueños, se le da la tarea inversa de plantar una idea en la mente de un C.E.O.",
        trailer_url: "https://www.youtube.com/embed/YoHD9XEInc0",
        imagenes: [
            { ruta: "https://image.tmdb.org/t/p/w500/s3TBrRGB1iav7gFOCNx3H31MoES.jpg" },
            { ruta: "https://image.tmdb.org/t/p/w500/2H1TmgdfNtsKlU9jKdeuBCQyvDz.jpg" }
        ],
        reparto: [
            { nombre_actor: "Leonardo DiCaprio", personaje: "Cobb" },
            { nombre_actor: "Joseph Gordon-Levitt", personaje: "Arthur" }
        ],
        comentarios: [
            { nombre_generado: "Usuario1", fecha: "2023-01-01", comentario: "Increíble película!" }
        ]
    },
    {
        id_pelicula: 2,
        titulo: "Interstellar",
        poster: "https://image.tmdb.org/t/p/w500/gEU2QniL6E8AHtMY4kZyRiGxbrC.jpg",
        fecha_estreno: "2014-11-07",
        duracion: "169 min",
        genero: "Aventura, Drama, Sci-Fi",
        director: "Christopher Nolan",
        pais: "USA",
        clasificacion: "PG-13",
        sinopsis: "Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento de asegurar la supervivencia de la humanidad.",
        trailer_url: "https://www.youtube.com/embed/zSWdZVtXT7E",
        imagenes: [
            { ruta: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg" }
        ],
        reparto: [
            { nombre_actor: "Matthew McConaughey", personaje: "Cooper" },
            { nombre_actor: "Anne Hathaway", personaje: "Brand" }
        ],
        comentarios: []
    },
    {
        id_pelicula: 3,
        titulo: "The Dark Knight",
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        fecha_estreno: "2008-07-18",
        duracion: "152 min",
        genero: "Acción, Crimen, Drama",
        director: "Christopher Nolan",
        pais: "USA",
        clasificacion: "PG-13",
        sinopsis: "Cuando la amenaza conocida como el Joker emerge de su pasado misterioso, causa estragos y el caos en la gente de Gotham.",
        trailer_url: "https://www.youtube.com/embed/EXeTwQWrcwY",
        imagenes: [],
        reparto: [
            { nombre_actor: "Christian Bale", personaje: "Bruce Wayne" },
            { nombre_actor: "Heath Ledger", personaje: "Joker" }
        ],
        comentarios: []
    }
];
