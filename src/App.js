import React, { useEffect, useState } from 'react';
import { getAuthUrl, getToken } from './components/api/SearchSpotify';
import { getUserPlaylists, createPlaylist, addTracksToPlaylist } from './components/api/PlaylistAPI';
import axios from 'axios';
import './index.css';

const App = () => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [playlistId, setPlaylistId] = useState('');
  const getTrackUris = () => {
    return selectedItems.map(item => item.uri);
  };

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
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUserId(response.data.id);
  };

  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  const search = async () => {
    if (!token || !query) return;

    const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=album,artist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setResults(response.data.albums.items);
    console.log(response.data);
  };

  const addItem = (item) => {
    const isItemSelected = selectedItems.some(selectedItem => selectedItem.id === item.id);
    if (!isItemSelected) {
      setSelectedItems(prevItems => [...prevItems, item]);
    } else {
      setSelectedItems(prevItems => prevItems.filter(selectedItem => selectedItem.id !== item.id));
    }
  };

  const handleCreateAndAddTracks = async () => {
    const inputElement = document.getElementById('pname');
    const playlistName = inputElement.value;
    const uris = getTrackUris();
    console.log("this: ",uris);
    if (!playlistName) {
      alert('Please enter a playlist name');
      return;
    }

    const playlistId = await createPlaylist(userId, token, playlistName);
    
    if (playlistId) {
      await addTracksToPlaylist(playlistId, token, uris);
    }
  };

  return (
    <div>
      <h1 className="title">Jammming</h1>
      {!token ? (
        <button onClick={handleLogin}>Login with Spotify</button>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Search for albums or artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                search();
              }
            }}
          />
          <div className="results">
            {results.map(album => (
            <div key={album.id} className="result-item" onClick={(e) => addItem(album, e)}>
              <img src={album.images[0]?.url} alt={album.name} />
              <p>{album.name}</p>
              <p>{album.artists.map(artist => artist.name).join(', ')}</p>
              </div>
              ))}
              </div>
          <h1 className="title">Playlist</h1>
          <input type="text" id="pname" name="pname" placeholder="Enter a name for your playlist"></input>
          <br></br>
          <br></br>
          <div className="selected-items">
            {selectedItems.map(item => (
              <div key={item.id} className="selected-item" onClick={(e) => addItem(item, e)}>
                <img src={item.images[0]?.url} alt={item.name} />
                <p>{item.name}</p>
                <p>{item.artists.map(artist => artist.name).join(', ')}</p>
              </div>
            ))}
          </div>
          <div className="button-container">
          <button type="submit" value="Submit" className="psubmit" onClick={handleCreateAndAddTracks}>Create Playlist</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;