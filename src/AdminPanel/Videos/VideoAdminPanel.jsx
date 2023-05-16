import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import { Delete, Save } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import fetchWrapper from "@/_helpers/fetch-wrapper";

const THUMBNAIL_SIZE = 300;

const VideoAdminPanel = () => {
    const [videos, setVideos] = useState([]);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [videoType, setVideoType] = useState("");

    useEffect(() => {
        // fetch videos from server
        fetchWrapper
            .get(`${import.meta.env.VITE_API_URL}/videos`)
            .then((data) => {
                let formattedData = data.map((video) => {
                    return {
                        id: video.id,
                        title: video.filename,
                        type: video.type,
                        url: `${import.meta.env.VITE_API_URL}/videos/${video.id}`,
                    };
                });
                setVideos(formattedData);
            })
            .catch((error) => console.error(error));
    }, []);

    const handleFileUpload = (event) => {
        setVideo(event.target.files[0]);
    };
    const handleVideoTypeChange = (event) => {
        setVideoType(event.target.value);
    };

    const handleDelete = (videoId) => {
        // delete video from server
        fetchWrapper
            .delete(`${import.meta.env.VITE_API_URL}/videos/${videoId}`)
            .then(() => setVideos(videos.filter((video) => video.id !== videoId)))
            .catch((error) => console.error(error));
    };

    const handleSave = () => {
        setLoading(true); // set loading to true
        // upload new video to server
        const formData = new FormData();
        formData.append("file", video);
        formData.append("type", videoType);
        fetchWrapper
            .postWithHeaders(`${import.meta.env.VITE_API_URL}/videos`, formData)
            .then((data) => {
                const formattedData = {
                    id: data.id,
                    title: data.filename,
                    type: data.type,
                    url: `${import.meta.env.VITE_API_URL}/videos/${data.id}`,
                };
                setVideos((prevState) => [...prevState, formattedData]);
                setVideo(null);
                setVideoType("");
                setLoading(false); // set loading back to false after successful upload
            })
            .catch((error) => {
                console.error(error);
                setLoading(false); // set loading back to false after failed upload
            });
    };

    const filteredVideos = videos.filter((video) => {
        return video.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4">Video Admin Panel</Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                    <Autocomplete
                        id="search"
                        freeSolo
                        options={videos.map((video) => video.title)}
                        onInputChange={(event, value) => setSearchTerm(value)}
                        renderInput={(params ) => (
                            <TextField
                                {...params}
                                label="Search by Title"
                                margin="normal"
                                variant="outlined"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <input type="file" onChange={handleFileUpload} accept="video/*" />
                </Grid>
                <Grid item xs={12}>
                    <FormControl component="fieldset">
                        <RadioGroup value={videoType} onChange={handleVideoTypeChange}>
                            <FormControlLabel
                                value="movie"
                                control={<Radio />}
                                label="Movie"
                            />
                            <FormControlLabel
                                value="trailer"
                                control={<Radio />}
                                label="Trailer"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        disabled={!video || loading} // disable the button while loading
                        onClick={handleSave}
                    >
                        {loading ? "Uploading..." : "Add Video"}
                    </Button>
                </Grid>
                {filteredVideos.map((video) => (
                    <Grid item xs={12} md={6} lg={3} key={video.id}>
                        <Card sx={{ maxWidth: THUMBNAIL_SIZE }}>
                            <CardActions>
                                <CardMedia
                                    component="video"
                                    height="140"
                                    src={video.url}
                                    controls
                                />
                            </CardActions>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={() => handleDelete(video.id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                            <CardContent>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {video.type}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    style={{
                                        overflowWrap: "break-word",

                                    }}
                                >
                                    {video.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default VideoAdminPanel;
