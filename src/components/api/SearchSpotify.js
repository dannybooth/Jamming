import axios from 'axios';

const searchSpotify = async (query) => {
  console.log('Spotify API Key:', process.env.REACT_APP_RAPIDAPI_KEY);
  try {
    const response = await axios.get('https://spotify23.p.rapidapi.com/search/', {
      params: { q: query, type: 'track' },
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    });
    return response.data; // Return data from response
  } catch (error) {
    console.error('Error fetching data from Spotify API:', error.response ? error.response.data : error.message);
    throw error; // Rethrow error to be handled by calling function
  }
};

export default searchSpotify;