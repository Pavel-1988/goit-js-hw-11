// import axios from 'axios';


const baseURL = 'https://pixabay.com/api/';
const key = '29318386-adfa654ecd5a2c31c35ac8541'

export default   function searchApi(query, page, perPage){
   const response = fetch(`${baseURL}?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`)
        .then(res => res.json())
    return  response
    }
