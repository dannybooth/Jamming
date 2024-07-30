import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ token }) => {
  const [query, setQuery] = useState('');

  const search = async () => {
    if (!token) return;

    const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=album,artist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            search();
          }
        }}
      />
      <button onClick={search}>Search</button>
    </div>
  );
};

export default SearchBar;
