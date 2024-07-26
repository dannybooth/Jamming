import React, { useState } from 'react';
import searchSpotify from '../api/SearchSpotify'; // Import the function

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const results = await searchSpotify(query); // Use the API function
      onSearch(results);
    } catch (error) {
      console.error('Failed to fetch tracks:', error);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for tracks"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;