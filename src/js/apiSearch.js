import axios from 'axios';

const baseURL = 'https://pixabay.com/api/';
const KEY = '29318386-adfa654ecd5a2c31c35ac8541';

export default async function searchApi(query, page, perPage) {
  
  const filter = `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;

  return await axios.get(`${baseURL}${filter}`).then(response => response.data);
}