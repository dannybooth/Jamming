import axios from 'axios';

// Get user playlists
export const getUserPlaylists = async (token) => {
  const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.items;
};

// Create a new playlist
export const createPlaylist = async (userId, token, title) => {
  console.log("token: "+token);
  console.log("userId: "+userId);
  try {
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: title,
        description: 'New playlist description',
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating playlist:', error);
  }
};

// Add tracks to a playlist
export const addTracksToPlaylist = async (playlistId, token, uris) => {
  const response = await axios.post(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      uris,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};