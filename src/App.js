import React, { useEffect, useState } from 'react';
import { getAuthUrl, getToken } from './components/api/SearchSpotify';
import { getUserPlaylists, createPlaylist, addTracksToPlaylist } from './components/api/PlaylistAPI';
import axios from 'axios';
import './index.css';

const App = () => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ albums: [], artists: [], tracks: [] });
  const [selectedTracks, setSelectedTracks] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      getToken(code).then(data => {
        setToken(data.access_token);
        getUserProfile(data.access_token);
        window.history.pushState({}, null, '/');
      });
    }
  }, []);

  const getUserProfile = async (token) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserId(response.data.id);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  const search = async () => {
    if (!token || !query) return;

    try {
      const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=album,artist,track`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const albums = response.data.albums?.items || [];
      const artists = response.data.artists?.items || [];
      const tracks = response.data.tracks?.items || [];

      setResults({ albums, artists, tracks });
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  const addItem = (item) => {
    const isItemSelected = selectedTracks.some(selectedTrack => selectedTrack.id === item.id);
    if (!isItemSelected) {
      setSelectedTracks(prevTracks => [...prevTracks, item]);
    } else {
      setSelectedTracks(prevTracks => prevTracks.filter(selectedTrack => selectedTrack.id !== item.id));
    }
  };

  const handleCreateAndAddTracks = async () => {
    const inputElement = document.getElementById('pname');
    const playlistName = inputElement.value;
    const uris = selectedTracks.map(track => track.uri);
    if (!playlistName) {
      alert('Please enter a playlist name');
      return;
    }

    try {
      const playlist = await createPlaylist(userId, token, playlistName);
      if (playlist) {
        await addTracksToPlaylist(playlist.id, token, uris);
        alert('Playlist created and tracks added!');
      }
    } catch (error) {
      console.error('Error creating playlist and adding tracks:', error);
    }
  };

  return (
    <div>
      <h1 className="title">Jammming</h1>
      {!token ? (
        <div className="button-container">
        <button onClick={handleLogin} className="submit" >Login with Spotify</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Search for albums, artists, or tracks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                search();
              }
            }}
          />
          <div className="results">
            {results.tracks.map(track => (
              <div key={track.id} className="result-item" onClick={() => addItem(track)}> 
              <img src={track.album.images[0]?.url} alt={track.name} />
              {track.preview_url && (
                  <audio controls>
                    <source src={track.preview_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                <p>{track.name}</p>
                <p>{track.artists.map(artist => artist.name).join(', ')}</p>
              </div>
            ))}
          </div>
          <h1 className="title">Playlist</h1>
          <input type="text" id="pname" name="pname" placeholder="Enter a name for your playlist" />
          <br />
          <br />
          <div className="selected-items">
            {selectedTracks.map(item => (
              <div key={item.id} className="selected-item" onClick={() => addItem(item)}>
                <img src={item.album.images[0]?.url} alt={item.name} />
                <p>{item.name}</p>
                <p>{item.artists.map(artist => artist.name).join(', ')}</p>
              </div>
            ))}
          </div>
          <br></br>
          <br></br>
          <div className="button-container">
            <button type="submit" value="Submit" className="submit" onClick={handleCreateAndAddTracks}>
              Create Playlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;