import {useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import {Delete, Save} from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import fetchWrapper from "@/_helpers/fetch-wrapper";

const THUMBNAIL_SIZE = 300;

const ImageAdminPanel = () => {
    const [images, setImages] = useState([]);
    const [image, setImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // fetch images from server
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

    const handleFileUpload = event => {
        setImage(event.target.files[0]);
    };

    const handleDelete = imageId => {
        // delete image from server
        fetchWrapper.delete(`${import.meta.env.VITE_API_URL}/images/${imageId}`)
            .then(() => setImages(images.filter(image => image.id !== imageId)))
            .catch(error => console.error(error));
    };

    const handleSave = () => {
        // upload new image to server
        const formData = new FormData();
        formData.append("file", image);
        fetchWrapper.postWithHeaders(`${import.meta.env.VITE_API_URL}/images`, formData)
            .then(data => {
                const formattedData = {
                    id: data.id,
                    title: data.filename,
                    url: `${import.meta.env.VITE_API_URL}/images/${data.id}`
                }
                setImages(prevState => [...prevState, formattedData]);
                setImage(null);
            })
            .catch(error => console.error(error));
    };


    const filteredImages = images.filter(image => {
        return image.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <Box sx={{p: 2}}>
            <Typography variant="h4">Image Admin Panel</Typography>
            <Grid container spacing={2} sx={{mt: 2}}>
                <Grid item xs={12}>
                    <Autocomplete
                        id="search"
                        freeSolo
                        options={images.map(image => image.title)}
                        onInputChange={(event, value) => setSearchTerm(value)}
                        renderInput={(params) => (
                            <TextField {...params} label="Search by Title" margin="normal" variant="outlined"/>
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        startIcon={<Save/>}
                        disabled={!image}
                        onClick={handleSave}
                    >
                        Add Image
                    </Button>
                </Grid>
                {filteredImages.map(image => (
                    <Grid item xs={12} md={6} lg={3} key={image.id}>
                        <Card sx={{maxWidth: THUMBNAIL_SIZE}}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height={THUMBNAIL_SIZE}
                                    image={image.url}
                                    alt={image.title}
                                />
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                        sx={{whiteSpace: "normal", wordWrap: "break-word"}}
                                    >
                                        {image.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {image.id}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<Delete/>}
                                    onClick={() => handleDelete(image.id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ImageAdminPanel;
