import React, { useState, useEffect } from 'react';
import Spotify from './Spotify'; // Ensure Spotify.js is correctly implemented
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import './app.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);

  const search = (term) => {
    Spotify.search(term)
      .then(results => {
        setSearchResults(results);
      })
      .catch(error => {
        console.error('Failed to fetch tracks:', error);
      });
  };

  useEffect(() => {
    // Optionally, you can fetch some initial data here
  }, []); // Empty dependency array means this runs once after the initial render

  return (
    <div className="App">
      <h1 className="title">Jammming</h1>
      <SearchBar onSearch={search} />
      <SearchResults searchResults={searchResults} />
    </div>
  );
}

export default App;