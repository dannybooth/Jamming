import React from 'react';
import './Tracklist.css';

const TrackList = ({ tracks = [] }) => {
  return (
    <div className="TrackList">
      {tracks.length > 0 ? (
        tracks.map(track => (
          <div key={track.id} className="Track">
            <h3>{track.name}</h3>
            <p>{track.artists.map(artist => artist.name).join(', ')}</p>
            <p>{track.album.name}</p>
          </div>
        ))
      ) : (
        <p>No tracks found</p>
      )}
    </div>
  );
};

export default TrackList;