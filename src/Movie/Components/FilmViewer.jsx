import React from 'react';
import ReactPlayer from 'react-player';
import { Typography, Box } from '@mui/material';

const FilmViewer = ({ filmId }) => {
    const filmUrl = `${import.meta.env.VITE_API_URL}/videos/${filmId}`;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Movie
            </Typography>
            <Box sx={{ width: '100%', maxWidth: '70vw', flexGrow: 1, margin: '0 auto' }}>
                <ReactPlayer url={filmUrl} controls width="100%" height="100%" />
            </Box>
        </Box>
    );
};

export default FilmViewer;
