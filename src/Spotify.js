import axios from 'axios';

const Spotify = {
  search(term) {
    const url = 'https://spotify23.p.rapidapi.com/search/';
    const options = {
      params: { q: term, type: 'track' },
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_SPOTIFY_KEY,
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };

    return axios.get(url, options)
      .then(response => {
        // Check if response.data.tracks.items exists and map it correctly
        const tracks = response.data.tracks ? response.data.tracks.items : [];
        
        return tracks.map(track => ({
          id: track.id,
          name: track.name,
          artists: track.artists,
          album: track.album,
          uri: track.uri
        }));
      })
      .catch(error => {
        console.error('Error fetching data from Spotify API:', error);
        return [];
      });
  }
};

export default Spotify;