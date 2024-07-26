import React from 'react';
import TrackList from '../Tracklist/Tracklist';

const SearchResults = ({ searchResults }) => {
  // Make sure to pass the tracks array correctly
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <TrackList tracks={searchResults.tracks} />
    </div>
  );
};

export default SearchResults;