import React, { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link component
import fetchWrapper from "@/_helpers/fetch-wrapper";

const HistoryViewer = () => {
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        fetchWrapper
            .get(`${import.meta.env.VITE_API_URL}/history`)
            .then((response) => {
                let formattedData = response.map((item) => {
                    return {
                        time: new Date(item.time).toLocaleString(),
                        movieName: item.Movie.title,
                        id: item.Movie.id,
                    };
                });
                setHistoryData(formattedData);
            });
    }, []);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h6">Viewing History</Typography>
            {historyData.map((item,index) => (
                <Link key={index} to={`/movie/${item.id}`}> {/* Wrap Paper with Link */}
                    <Paper sx={{ padding: 1, marginTop: 2 }} >
                        <Typography variant="body1">
                            <strong>Time:</strong> {item.time}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Movie:</strong> {item.movieName}
                        </Typography>
                    </Paper>
                </Link>
            ))}
        </Box>
    );
};

export default HistoryViewer;
