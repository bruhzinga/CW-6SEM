import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
    Typography,
    Box,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import fetchWrapper from "@/_helpers/fetch-wrapper";
import { useParams } from "react-router-dom";

const FilmViewer = ({ filmsInfo }) => {
    let { id } = useParams();
    const [played, setPlayed] = useState(null);
    const [selectedFilm, setSelectedFilm] = useState({});
    const [formattedFilmInfo, setFormattedFilmInfo] = useState([]);
    const timeRef = useRef();
    timeRef.current = played;

    useEffect(() => {
        setSelectedFilm({filename:'No movie available', url: `${import.meta.env.VITE_API_URL}/videos/1`, id: 1});
        setFormattedFilmInfo([{filename:'No movie available', url: `${import.meta.env.VITE_API_URL}/videos/1`, id: 1}])
    },[]);

    useEffect(() => {
        const FetchHistory = async () => {
            const data = await fetchWrapper.get(
                `${import.meta.env.VITE_API_URL}/history/${id}`
            );
            setPlayed(data[0].progress);
        };
        FetchHistory();
        if (filmsInfo.length === 0) {
            return ;
        } else {
            setFormattedFilmInfo(
                filmsInfo.map((item) => {
                    return {
                        id: item.id,
                        filename: item.filename,
                        url: `${import.meta.env.VITE_API_URL}/videos/${item.id}`,
                    };
                })
            );
        }

        return function cleanup() {
            fetchWrapper.post(`${import.meta.env.VITE_API_URL}/history/${id}`, {
                progress: timeRef.current,
            });
        };
    }, [id, filmsInfo]);

    useEffect(() => {
            setSelectedFilm(formattedFilmInfo[0])
            console.log('selected', selectedFilm);

    }, [formattedFilmInfo]);

    const handleContinueFromWhereYouLeftOff = () => {
        player.seekTo(played);
    };

    let player;

    const handleSelectChange = (event) => {
        setSelectedFilm(formattedFilmInfo.find((item) => item.url === event.target.value));
    };
    if (selectedFilm && formattedFilmInfo ) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 4,
                }}
            >
                <Typography variant="h4" sx={{mb: 2}}>
                    Movie
                </Typography>
                <Box
                    sx={{width: "100%", maxWidth: "70vw", flexGrow: 1, margin: "0 auto"}}
                >
                    <Box sx={{mt: 2}}>
                        <FormControl sx={{minWidth: 120}}>
                            <Select value={selectedFilm.url} onChange={handleSelectChange}>
                                {formattedFilmInfo.map((film) => (
                                    <MenuItem key={film.id} value={film.url}>
                                        {film.filename}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <ReactPlayer
                        ref={(playerRef) => (player = playerRef)}
                        url={selectedFilm.url}
                        controls
                        width="100%"
                        height="100%"
                        onProgress={(progress) => {
                            if (progress.playedSeconds > 0) setPlayed(progress.playedSeconds);
                        }}
                    />
                </Box>

                <Button onClick={handleContinueFromWhereYouLeftOff} sx={{mt: 2}}>
                    Continue from where you left off
                </Button>
            </Box>
        );
    } else {
      return (
          <div>

          </div>
      )
    }
};

export default FilmViewer;
