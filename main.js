const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2&api_key=live_vDC6hislijU0Na9QScGR1Vm3VzBZhrxqDsSRCzNvNdxVIqeYw0x9aMkWqs7qhKFW';
const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites?api_key=live_vDC6hislijU0Na9QScGR1Vm3VzBZhrxqDsSRCzNvNdxVIqeYw0x9aMkWqs7qhKFW';

//crear una constante para llamar cualquiere elemento con el id error
const spanError = document.getElementById('error')

async function loadRandomMichis() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();

    console.log('Random');
    console.log(res.status);

    

    if (res.status ){

        spanError.innerHTML = "Hubo un error: " + res.status;
    }else{
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        
        img1.src = data[0].url;
        img2.src = data[1].url;
    }
}


async function loadFavouritesMichis() {
    
    const res = await fetch(API_URL_FAVOURITES);
    const data = await res.json();
    console.log('Favorites');
    console.log(data);
    console.log(res.status);

    if (res.status !== 200 ){
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } 
}

//funcion asincrona para guardar michis favoritos

async function saveFavouriteMichis(){
    const res = await fetch(API_URL_FAVOURITES, {
        method:'POST', 
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({image_id:"cff"}), 
    }); //creamos una variable para traer fetch de tipo POST con un 2do argumento (UN OBJETO que indique POST)
    

    const data = await res.json(); //convertir la respuesta en json
    console.log('Save');
    console.log(data);
    console.log(res.status);

    if (res.status !== 200 ){
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }
}

loadRandomMichis();
loadFavouritesMichis();
saveFavouriteMichis();
