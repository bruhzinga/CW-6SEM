import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import fetchWrapper from "@/_helpers/fetch-wrapper";

const PeopleToMovieMap = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [actors, setActors] = useState([]);
    const [AllActors, setAllActors] = useState([]);
    const [selectedActor, setSelectedActor] = useState(null);
    const [role, setRole] = useState("");

    useEffect(() => {
        fetchWrapper.get(`${import.meta.env.VITE_API_URL}/movies/titles`)
            .then(data => {
                const formattedData = data.map(movie => {
                    return {
                        id: movie.id,
                        name: movie.title
                    }
                });
                setMovies(formattedData);

            })
        fetchWrapper.get(`${import.meta.env.VITE_API_URL}/people`)
            .then(data => {
                setAllActors(data);
            });
    }, []);

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        fetchWrapper.get(`${import.meta.env.VITE_API_URL}/movies/${movie.id}/people`)
            .then(data => {
                const formattedData = data.People.map(data => {
                    return {
                        id: data.People.id,
                        name: data.People.name,
                        role: data.Role

                    }
                });
                setActors(formattedData);

            });

    };

    const handleActorChange = (event, value) => {
        setSelectedActor(value);
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleAddMapping = () => {
        fetchWrapper.post(`${import.meta.env.VITE_API_URL}/people/addPeopleToMovie`, {
                movieId: selectedMovie.id,
                peopleId: selectedActor.id,
                role: role,
            })
            .then(data => {
                selectedActor.role = role;
                setActors([...actors, selectedActor]);
                setSelectedActor(null);
                setRole("");

            });

    };

    const handleDeleteMapping = (actor) => {
        fetchWrapper.delete(`${import.meta.env.VITE_API_URL}/people/RemovePeopleFromMovie`, {
            movieId: selectedMovie.id,
            peopleId: actor.id,
            role: actor.role,
        })
            .then(data => {
                setActors(actors.filter((a) => a.id !== actor.id));
            });

    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ width: "30%", marginRight: "20px" }}>
                <Typography variant="h5">Movies</Typography>
                <List>
                    {movies.map((movie) => (
                        <ListItem button key={movie.id} onClick={() => handleMovieClick(movie)}>
                            <ListItemText primary={movie.name} />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{ width: "70%" }}>
                {selectedMovie && (
                    <>
                        <Typography variant="h5">{selectedMovie.name}</Typography>
                        <Typography variant="subtitle1">Actors:</Typography>
                        <List>
                            {actors.map((actor) => (
                                <ListItem key={actor.id}>
                                    <ListItemText primary={actor.name} secondary={actor.role} />
                                    <Button variant="outlined" onClick={() => handleDeleteMapping(actor)}>
                                        Delete
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                        <Typography variant="subtitle1">Add Actor:</Typography>
                        <Autocomplete
                            options={AllActors}
                            getOptionLabel={(option) => option.name}
                            onChange={handleActorChange}
                            value={selectedActor}
                            renderInput={(params) => <TextField {...params} label="Actor" />}
                        />
                        <TextField
                            label="Role"
                            value={role}
                            onChange={handleRoleChange}
                            sx={{ marginTop: "10px", marginBottom: "10px" }}
                        />
                        <Button variant="contained" onClick={handleAddMapping} disabled={!selectedActor || !role}>
                            Add Mapping
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default PeopleToMovieMap;
