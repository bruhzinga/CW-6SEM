import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Delete } from "@mui/icons-material";
import { Grid } from "@mui/material";
import axios from "axios";
import fetchWrapper from "@/_helpers/fetch-wrapper";

const PeopleAdminPanel = () => {
    const [people, setPeople] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [profession, setProfession] = useState("");
    const [imageId, setImageId] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        setLoading(true);
        /*  axios
              .get("/people")
              .then((response) => setPeople(response.data))
              .finally(() => setLoading(false));*/
        fetchWrapper.get(`${import.meta.env.VITE_API_URL}/people`)
            .then(data => {
                setPeople(data);
                setLoading(false);
            })
            .catch(error => console.error(error));

    }, []);

    useEffect(() => {
        fetchWrapper.get(`${import.meta.env.VITE_API_URL}/images`)
            .then(data => {
                let formattedData = data.map(image => {
                    return {
                        id: image.id,
                        title: image.filename,
                        url: `${import.meta.env.VITE_API_URL}/images/${image.id}`
                    }
                });
                setImages(formattedData)
            })
            .catch(error => console.error(error));

    }, []);

    const handleAdd = () => {
        const newPerson = {
            name,
            profession,
            imageId,
        };

        fetchWrapper.post(`${import.meta.env.VITE_API_URL}/people`, newPerson)
            .then(data => {
                setPeople((prevPeople) => [...prevPeople, data]);
                setName("");
                setProfession("");
                setImageId("");
                setSelectedImage(null);
            })
            .catch(error => console.error(error));
    };

    const handleUpdate = (id, updatedPerson) => {
        /*axios.put(`/people/${id}`, updatedPerson).then((response) => {
            setPeople((prevPeople) =>
                prevPeople.map((person) => (person.id === id ? response.data : person))
            );
        });*/
        fetchWrapper.put(`${import.meta.env.VITE_API_URL}/people/${id}`, updatedPerson)
            .then(data => {
                setPeople((prevPeople) => prevPeople.map((person) => (person.id === id ? data : person))
                );
            })
            .catch(error => console.error(error));


    };

    const handleDelete = (id) => {
        fetchWrapper.delete(`${import.meta.env.VITE_API_URL}/people/${id}`)
            .then(() => {
                setPeople((prevPeople) => prevPeople.filter((person) => person.id !== id));
            })
            .catch(error => console.error(error));
    };

    const handleImageChange = (event, newValue) => {
        if (newValue) {
            setSelectedImage(newValue);
            setImageId(newValue.id);
        } else {
            setSelectedImage(null);
            setImageId("");
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h4">People</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                <TextField
                    label="Profession"
                    value={profession}
                    onChange={(event) => setProfession(event.target.value)}
                />
                <Autocomplete
                    id="image-autocomplete"
                    options={images}
                    value={selectedImage}
                    getOptionLabel={(option) => option.title}
                    onChange={handleImageChange}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Image" />
                    )}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="contained" onClick={handleAdd}>
                        Add
                    </Button>
                </Box>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    people.map((person) => (
                        <Grid item xs={12} sm={6} md={4} key={person.id}>
                            <Card sx={{ height: "100%" }}>
                                <CardHeader
                                    titleTypographyProps={{ variant: "h5", noWrap: true }}
                                    title={person.name}
                                    subheaderTypographyProps={{ noWrap: true }}
                                    subheader={person.profession}
                                    action={
                                        <Button
                                            variant="outlined"
                                            startIcon={<Delete />}
                                            onClick={() => handleDelete(person.id)}
                                        >
                                            Delete
                                        </Button>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="body1">
                                        Person ID: {person.id}
                                    </Typography>
                                    <Typography variant="body1">
                                        Image ID: {person.imageId}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Autocomplete
                                            id={`image-autocomplete-${person.id}`}
                                            options={images}
                                            value={images.find((image) => image.id === person.imageId) || null}
                                            getOptionLabel={(option) => option.title}
                                            onChange={(event, newValue) => {
                                                const updatedPerson = {
                                                    ...person,
                                                    imageId: newValue ? newValue.id : "",
                                                };
                                                handleUpdate(person.id, updatedPerson);
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Select Image" />
                                            )}
                                        />
                                    </Box>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
};

export default PeopleAdminPanel;
