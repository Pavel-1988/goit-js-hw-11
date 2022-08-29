import axios from 'axios';

export default async function searchApi(query, page, perPage) {
  const url = 'https://pixabay.com/api/';
  const key = '29318386-adfa654ecd5a2c31c35ac8541';
  const filter = `?key=${key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;

  return await axios.get(`${url}${filter}`).then(response => response.data);
}