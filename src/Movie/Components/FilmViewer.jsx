import React, {useEffect, useRef, useState} from "react";
import ReactPlayer from "react-player";
import { Typography, Box, Button } from "@mui/material";
import fetchWrapper from "@/_helpers/fetch-wrapper";
import {useParams} from "react-router-dom";

const FilmViewer = ({ filmId }) => {
    const [played, setPlayed] = useState(null);
    let { id } = useParams();
    const filmUrl = `${import.meta.env.VITE_API_URL}/videos/${filmId}`;
    const timeRef = useRef();
    timeRef.current = played;


    const FetchHistory = async () => {
        const data = await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/history/${id}`);
        setPlayed(data[0].progress);
    }
    useEffect(() => {
        FetchHistory();
        return function cleanup(){
            fetchWrapper.post(`${import.meta.env.VITE_API_URL}/history/${id}`, {
                progress: timeRef.current,
            });
        };
    }, [id]);

    const handleContinueFromWhereYouLeftOff = () => {
        player.seekTo(played);
    };

    let player;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 4,
            }}
        >
            <Typography variant="h4" sx={{ mb: 2 }}>
                Movie
            </Typography>
            <Box
                sx={{ width: "100%", maxWidth: "70vw", flexGrow: 1, margin: "0 auto" }}
            >
                <ReactPlayer
                    ref={(playerRef) => (player = playerRef)}
                    url={filmUrl}
                    controls
                    width="100%"
                    height="100%"
                    onProgress={(progress) => {
                        if(progress.playedSeconds > 0)
                        setPlayed(progress.playedSeconds);
                    }}
                />
            </Box>
            <Button onClick={handleContinueFromWhereYouLeftOff}>
                Continue from where you left off
            </Button>
        </Box>
    );
};

export default FilmViewer;
