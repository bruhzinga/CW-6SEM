import React, {useEffect, useState} from 'react';
import {Autocomplete, Button, TextField} from '@mui/material';
import {styled} from '@mui/material/styles';
import fetchWrapper from "@/_helpers/fetch-wrapper";

const StyledForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    margin: '1rem',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '0.5rem',
});

const StyledInput = styled(TextField)({
    width: '100%',
});

const StyledButton = styled(Button)({
    marginTop: '1rem',
});

const MovieAdminPanel = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        releaseDate: '',
        country: '',
        duration: '',
        genreIds: [],
        videoIds: [],
        imageIds: [],
        posterId: '',
    });
    const [genres, setGenres] = useState([]);
    const [videos, setVideos] = useState([]);
    const [images, setImages] = useState([]);

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

        const fetchMovies = async () => {
           const data = await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/movies/titles`);
           const formattedData= data.map((movie) => ({
                id: movie.id,
                title: movie.title,
           }));
           setMovies(formattedData);
        };

        const fetchGenres = async () => {
            const data = await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/genres`);
            const formattedData= data.map((genre) => ({
                id: genre.id,
                name: genre.name,
            }));
            setGenres(formattedData);
        }

        const fetchVideos = async () => {
            const data = await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/videos`);
            const formattedData= data.map((video) => ({
                id: video.id,
                name: video.filename,
            }));
            setVideos(formattedData);
        };

        const fetchImages = async () => {
            const data = await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/images`);
            const formattedData= data.map((image) => ({
                id: image.id,
                name: image.filename,
            }));
            setImages(formattedData);
        };






    useEffect(() => {
        fetchMovies();
        fetchGenres();
        fetchVideos()
        fetchImages();
    }, []);

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleGenreIdsChange = (event, values) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            genreIds: values.map((value) => value),
        }));
    };

    const handleVideoIdsChange = (event, values) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            videoIds: values.map((value) => value),
        }));
    };

    const handleImageIdsChange = (event, values) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            imageIds: values.map((value) => value),
        }));
    };

    const handlePosterIdChange = (event, value) => {

        setFormData((prevFormData) => ({
            ...prevFormData,
            posterId: value ? value.id : '',
        }));
    };

    const handleMovieSelect = async (event, value) => {
        setSelectedMovie(value);
        const data = await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/movies/${value.id}`);
        const formattedData = {
            title: data.title,
            country: data.country ? data.country : '',
            description: data.description,
            releaseDate: `${new Date(data.releaseDate).getFullYear()}-${new Date(data.releaseDate).getMonth() + 1}-${new Date(data.releaseDate).getDate()}`,
            duration: data.duration,
            genreIds: data.Genre.map((genre) => {return {id: genre.id, name: genre.name}}),
            videoIds: data.Video.map((video) => {return {id: video.id, name: video.filename}}),
            imageIds: data.Image.map((image) => {return {id: image.id, name: image.filename}}),
            posterId: data.mainPosterId

        }
        console.log('FORMATTED DATA', formattedData)
        setFormData(formattedData);
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        const formattedData = {
            title: formData.title,
            country: formData.country,
            description: formData.description,
            releaseDate: formData.releaseDate,
            duration: +formData.duration,
            genre: formData.genreIds.map((genre) => genre.id),
            video: formData.videoIds.map((video) => video.id),
            image: formData.imageIds.map((image) => image.id),
            mainPoster: formData.posterId
        };
        const data = await fetchWrapper.put(`${import.meta.env.VITE_API_URL}/movies/${selectedMovie.id}`, formattedData)
            .then((data) => {
                console.log('DATA', data);
                setFormData({
                    title: '',
                    description: '',
                    releaseDate: '',
                    duration: '',
                    genreIds: [],
                    videoIds: [],
                    imageIds: [],
                    posterId: '',
                    country: ''
                });
                setSelectedMovie(null);
                const updatedMovies = [...movies];
                const index = updatedMovies.findIndex((movie) => movie.id === selectedMovie.id);
                updatedMovies[index] = {id: selectedMovie.id, ...formData};
                setMovies(updatedMovies);
            })
            .catch((error) => {
                console.error('Failed to update movie');
            });


    };

    const handleAdd = async (event) => {
        event.preventDefault();
        const formattedData = {
            country: formData.country,
            title: formData.title,
            description: formData.description,
            releaseDate: formData.releaseDate,
            duration: +formData.duration,
            genre: formData.genreIds.map((genre) => genre.id),
            video: formData.videoIds.map((video) => video.id),
            image: formData.imageIds.map((image) => image.id),
            mainPoster: formData.posterId
        };
        const data = await fetchWrapper.post(`${import.meta.env.VITE_API_URL}/movies`, formattedData)
            .then((data) => {
                console.log('DATA', data);
                setFormData({
                    title: '',
                    description: '',
                    releaseDate: '',
                    duration: '',
                    genreIds: [],
                    videoIds: [],
                    imageIds: [],
                    posterId: '',
                    country: ''
                });
                setSelectedMovie(null);
                const updatedMovies = [...movies];
                updatedMovies.push({id: data.id, ...formData});
                setMovies(updatedMovies);
            }
        )
            .catch((error) => {
                console.error('Failed to add movie');

        });
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        const data = await fetchWrapper.delete(`${import.meta.env.VITE_API_URL}/movies/${selectedMovie.id}`)
            .then((data) => {
                const updatedMovies = [...movies];
                const index = updatedMovies.findIndex((movie) => movie.id === selectedMovie.id);
                updatedMovies.splice(index, 1);
                setMovies(updatedMovies);
            });

};

return (
    <>
        <Autocomplete
            id="movie-select"
            options={movies}
            getOptionLabel={(movie) => movie.title}
            value={selectedMovie}
            onChange={handleMovieSelect}
            renderInput={(params) => (
                <StyledInput
                    {...params}
                    label="Select a movie to update"
                    variant="outlined"
                />
            )}
        />
        <StyledForm onSubmit={selectedMovie ? handleUpdate : handleAdd}>
            <StyledInput
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                variant="outlined"
            />
            <StyledInput
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                variant="outlined"
                multiline
                rows={4}
            />
            <StyledInput
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            variant="outlined"
        />
            <StyledInput
                label="Release Date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                variant="outlined"
                type="date"
                InputLabelProps={{shrink: true}}
            />
            <StyledInput
                label="Duration (in minutes)"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                variant="outlined"
                type="number"
                InputProps={{inputProps: {min: 0}}}
            />
            <Autocomplete style={{width: '100%'}}
                multiple
                id="genre-ids-input"
                options={genres}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    value={formData.genreIds}
                    onChange={handleGenreIdsChange}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                    <StyledInput
                  {...params}
                    label="Genres"
                    variant="outlined"
            />
            )}
            />
            <Autocomplete style={{width: '100%'}}
                multiple
                          filterSelectedOptions
                id="video-ids-input"
                options={videos}
                getOptionLabel={(option) => option.name}
                value={formData.videoIds}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={handleVideoIdsChange}
                renderInput={(params) => (
                    <StyledInput
                        {...params}
                        label="Videos"
                        variant="outlined"
                    />
                )}
            />
            <Autocomplete style={{width: '100%'}}
                multiple
                id="image-ids-input"
                          filterSelectedOptions
                options={images}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                   getOptionLabel={(option) => option.name}
                     value={formData.imageIds}
                        onChange={handleImageIdsChange}
                        renderInput={(params) => (
                        <StyledInput
                {...params}
                label="Images"
                variant="outlined"
            />
            )}
            />

            <Autocomplete style={{width: '100%'}}
                id="poster-id-input"
                options={images}
                getOptionLabel={(option) => option.name}
                value={formData.posterId? images.find((image) => image.id === formData.posterId) : null}
                onChange={handlePosterIdChange}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          filterSelectedOptions
                renderInput={(params) => (
                    <StyledInput
                        {...params}
                        label="Main Poster"
                        variant="outlined"
                    />
                )}
            />
            <StyledButton variant="contained" type="submit">
                {selectedMovie ? 'Update Movie' : 'Add Movie'}
            </StyledButton>
            {selectedMovie && (
            <StyledButton variant="contained" onClick={handleDelete}>
                Delete Movie
            </StyledButton>
            )}
        </StyledForm>
    </>
);
}
;

export default MovieAdminPanel;

