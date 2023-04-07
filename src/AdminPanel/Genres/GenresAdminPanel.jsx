import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import fetchWrapper from "@/_helpers/fetch-wrapper";

const GenresAdminPanel = () => {
    const [genres, setGenres] = useState([]);
    const [name, setName] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(null);

    useEffect(() => {
        fetchWrapper.get(`${import.meta.env.VITE_API_URL}/genres`)
            .then(data => setGenres(data))
            .catch(error => console.error(error));
    }, []);

    const handleAdd = () => {
        fetchWrapper.post(`${import.meta.env.VITE_API_URL}/genres`, {name})
            .then(data => setGenres([...genres, data]))
            .catch(error => console.error(error));
    };

    const handleUpdate = (id, name) => {
        fetchWrapper.put(`${import.meta.env.VITE_API_URL}/genres/${id}`, {name})
            .then(data => setGenres(genres.map(genre => genre.id === id ? { ...genre, name } : genre)))
            .catch(error => console.error(error));

    };

    const handleDelete = (id) => {
        fetchWrapper.delete(`${import.meta.env.VITE_API_URL}/genres/${id}`)
            .then(() => setGenres(genres.filter(genre => genre.id !== id)))
            .catch(error => console.error(error));
    };

    const handleSelectGenre = (genre) => {
        setSelectedGenre(genre);
        setName(genre.name);
    };

    const handleUpdateName = () => {
        handleUpdate(selectedGenre.id, name);
        setSelectedGenre(null);
    };

    const filteredGenres = genres.filter(genre => genre.name.toLowerCase().includes(searchValue.toLowerCase()));

    return (
        <div>
            <Autocomplete
                freeSolo
                options={genres.map(genre => genre.name)}
                onInputChange={(event, value) => setSearchValue(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search"
                        margin="normal"
                        variant="outlined"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                )}
            />
            <TextField label="Name" value={name} onChange={event => setName(event.target.value)} />
            {selectedGenre && (
                <Button variant="contained" onClick={handleUpdateName}>Update</Button>
            )}
            {!selectedGenre && (
                <Button variant="contained" onClick={handleAdd}>Add</Button>
            )}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredGenres.map(genre => (
                            <TableRow key={genre.id}>
                                <TableCell>{genre.id}</TableCell>
                                <TableCell>
                                    <TextField
                                        value={genre.name}
                                        onClick={() => handleSelectGenre(genre)}
                                        disabled={!!selectedGenre && selectedGenre.id !== genre.id}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" onClick={() => handleDelete(genre.id)}> Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default GenresAdminPanel;
