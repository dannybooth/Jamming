import React from 'react';
import './Track.css';

const Track = ({ track }) => {
  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{track.name || "Unknown"}</h3>
        <p>
          {track.artists ? track.artists.map(artist => artist.name).join(', ') : "Unknown Artist"} | 
          {track.album ? track.album.name : "Unknown Album"}
        </p>
      </div>
    </div>
  );
};

export default Track;