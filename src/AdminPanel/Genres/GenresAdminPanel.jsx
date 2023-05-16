import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import fetchWrapper from "@/_helpers/fetch-wrapper";

const GenresAdminPanel = () => {
    const [genres, setGenres] = useState([]);
    const [name, setName] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(null);


    const  handleError =(error) => {
        //[P2002]: Unique constraint failed on the fields: (`name`) find what's in []  using regex
        const errorID = error.match(/\[(.*?)\]/)[1];
        switch (errorID) {
            case 'P2002':
                alert('Genre with this name already exists');
                break;
            default:
                alert(error);
        }


    }

    useEffect(() => {
        fetchWrapper.get(`${import.meta.env.VITE_API_URL}/genres`)
            .then(data => setGenres(data))
            .catch(error => handleError(error));
    }, []);

    const handleAdd = () => {
        fetchWrapper.post(`${import.meta.env.VITE_API_URL}/genres`, {name})
            .then(data => setGenres([...genres, data]))
            .catch(error => handleError(error));
    };

    const handleUpdate = (id, name) => {
        fetchWrapper.put(`${import.meta.env.VITE_API_URL}/genres/${id}`, {name})
            .then(data => setGenres(genres.map(genre => genre.id === id ? { ...genre, name } : genre)))
            .catch(error => handleError(error));

    };

    const handleDelete = (id) => {
        fetchWrapper.delete(`${import.meta.env.VITE_API_URL}/genres/${id}`)
            .then(() => setGenres(genres.filter(genre => genre.id !== id)))
            .catch(error => handleError(error));
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
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
                <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} />
                {selectedGenre ? (
                    <Button variant="contained" style={{ flex: 0.05 }} onClick={handleUpdateName}>
                        Update
                    </Button>
                ) : (
                    <Button variant="contained" style={{ flex: 0.05 }} onClick={handleAdd}>
                        Add
                    </Button>
                )}
            </div>
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
