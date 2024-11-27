const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`; //guardar una funcion
//crear una url API para subir imagenes
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

//crear una constante para llamar cualquiere elemento con el id error
const spanError = document.getElementById('error')

async function loadRandomMichis() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();

    console.log('Random');
    console.log(data);

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status;
    }else{
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        
        img1.src = data[0].url;
        img2.src = data[1].url;

        btn1.onclick = () => saveFavouriteMichi(data[0].id); //cargar el id
        btn2.onclick = () => saveFavouriteMichi(data[1].id); //cargar el id
    }
}

async function loadFavouritesMichis() {
    const res = await fetch(API_URL_FAVOURITES,{ //Agregamos info para dejar de pasar el key por la URL 
        method: 'GET',
        headers: {
            'X-API-KEY':'live_vDC6hislijU0Na9QScGR1Vm3VzBZhrxqDsSRCzNvNdxVIqeYw0x9aMkWqs7qhKFW',
        },
    });
    const data = await res.json();
    console.log('Favorites');
    console.log(data);

    if (res.status !== 200 ){
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        //Limpiar la funcion
        const section = document.getElementById('favoriteMichis'); //obtener el section
        section.innerHTML = ""; //Limpiar
        const h2 = document.createElement('h2');//Crear div
        const h2Text = document.createTextNode('Michis Favoritos'); //crear el texto
        h2.appendChild(h2Text); //Cargar el texto
        section.appendChild(h2);  //Cargar el div a la seccion

        //Recorrer el array
        data.forEach(michi => {
            //Crear elementos del html
            const article = document.createElement('article'); // crear article
            const img = document.createElement('img'); // crear article
            const btn = document.createElement('button'); // crear article
            const btnText = document.createTextNode('Sacar michi de favoritos'); //crear texto

            //Insertar el bloque con articulo, boton e imagen
            img.src = michi.image.url ; //A la imagen agregarle el src
            img.width = 150; //A la imagen agregarle el src
            btn.appendChild(btnText); //meter texto al boton
            btn.onclick = () => deleteavouriteMichi(michi.id); //meter texto al boton

            //Agregamos al article estas dos cosas
            article.appendChild(btn);
            article.appendChild(img);

            //Agregamos a la seccion el articulo
            section.appendChild(article);
        });
    }
}

//funcion asincrona para guardar michis favoritos
async function saveFavouriteMichi(id){
    const res = await fetch(API_URL_FAVOURITES, {
        method:'POST', 
        headers:{
            'Content-Type': 'application/json',
            'X-API-KEY': 'live_vDC6hislijU0Na9QScGR1Vm3VzBZhrxqDsSRCzNvNdxVIqeYw0x9aMkWqs7qhKFW',
        },
        body: JSON.stringify({image_id:id}), //formatear para que pueda ser leido
    }); //creamos una variable para traer fetch de tipo POST con un 2do argumento (UN OBJETO que indique POST)
    
    const data = await res.json(); //convertir la respuesta en json
    console.log('Save');
    console.log(res);

    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        console.log('Michi guardado en favoritos');
        loadFavouritesMichis();
    }
}

//crear una funcion asincrona que reciba un id a eliminar
async function deleteavouriteMichi(id) {
    const res = await fetch(API_URL_FAVOURITES_DELETE(id), { //creamos una variable para traer fetch de tipo DELETE, 1er Argumento la URL y 2do argumento (UN OBJETO que indique DELETE y el id)
        method:'DELETE',
        headers: {
            'X-API-KEY': 'live_vDC6hislijU0Na9QScGR1Vm3VzBZhrxqDsSRCzNvNdxVIqeYw0x9aMkWqs7qhKFW',
        },  
    }); 
    const data = await res.json(); //convertir la respuesta en json

    if (res.status !== 200 ){
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }else{
        console.log('Michi eliminado de favoritos');
        loadFavouritesMichis();
    }
}

async function uploadMichiPhoto(){
    const form = document.getElementById('uploadingForm'); //llamar a cualquier nodo de html que contenga el id: uploadingForm
    const formData = new FormData(form);    //instancia de la Clase, enviando como argumento el formulario
    console.log(formData.get('file')); //obtener la llave file

    const res = await fetch(API_URL_UPLOAD,{
        method: 'POST',
        headers: {
            //'Content-Type': 'multipart/form-data',
            'X-API-KEY': 'live_vDC6hislijU0Na9QScGR1Vm3VzBZhrxqDsSRCzNvNdxVIqeYw0x9aMkWqs7qhKFW',
        },
        body: formData,
    } ); //constante para traer con fetch

    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`
    }
    else {
        console.log("Foto de michi cargada :)");
        console.log({ data });
        console.log(data.url);
        saveFavouriteMichi(data.id) //para agregar el michi cargado a favoritos.
    }
}

//Agregue esta linea desde github para hacer prueba de git pull
//Esta es una linea que no está en la rama development
loadRandomMichis();
loadFavouritesMichis();
