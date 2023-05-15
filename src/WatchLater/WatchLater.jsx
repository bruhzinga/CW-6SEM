import React, {useEffect, useState} from 'react';
import fetchWrapper from "@/_helpers/fetch-wrapper";
import {Box, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";

const WatchLater = () => {
    const [favouritesData, setFavouritesData] = useState([]);

    useEffect(() => {
        fetchWrapper
            .get(`${import.meta.env.VITE_API_URL}/watch-later`)
            .then((response) => {
                let formattedData = response.map((item) => {
                    return {
                        movieName: item.Movie.title,
                        id: item.Movie.id,
                    };
                });
                setFavouritesData(formattedData);
            });
    }, []);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6">Watch Later</Typography>
            {favouritesData.map((item,index) => (
                <Link key={index} to={`/movie/${item.id}`}> {/* Wrap Paper with Link */}
                    <Paper sx={{ padding: 1, marginTop: 2 }} >
                        <Typography variant="body1">
                            <strong>Movie:</strong> {item.movieName}
                        </Typography>
                    </Paper>
                </Link>
            ))}
        </Box>
    );
};

export default WatchLater;