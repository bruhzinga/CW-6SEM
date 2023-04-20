import React, {useEffect, useState} from 'react';
import {Card, CardMedia, Chip, Grid, IconButton, styled, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import fetchWrapper from "@/_helpers/fetch-wrapper";
import {Favorite, WatchLater} from "@mui/icons-material";


const Root = styled('div')({
    flexGrow: 1,
    padding: (theme) => theme.spacing(2),
});

const Poster = styled(Card)({
    height: '100%',
});
const PosterImage = styled(CardMedia)({
    height: '100%',
    width: '100%',
    objectFit: 'cover'
});

const TrailerWrapper = styled('div')({
    position: 'relative',
    width: '100%',
});
styled('iframe')({
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
});
const GenreChip = styled(Chip)({
    marginRight: '8px',
    marginBottom: '8px',
});

const convertMinutesToHourStringWithMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const minutesLeft = minutes % 60;
    return `${hours}h ${minutesLeft}m`;
};

const GetMovieHeaderObject = (movieData) => {
    return {
        title: movieData?.title,
        description: movieData?.description,
        rating: movieData?.rating || 'N/A',
        releaseYear: new Date(movieData?.releaseDate).getFullYear(),
        runtime: convertMinutesToHourStringWithMinutes(movieData?.duration),
        posterPath: `${import.meta.env.VITE_API_URL}/images/${movieData?.mainPosterId}`,
        genres: movieData?.Genre.map((genre) => genre.name),
        country: movieData?.country || 'N/A',
        trailerUrl: `${import.meta.env.VITE_API_URL}/videos/${
            movieData?.Video.filter((video) => video.type === 'trailer')[0]? movieData?.Video.filter((video) => video.type === 'trailer')[0].id : 1
        }`,
    };
};



const MovieHeader = () => {
    const [isInFavorites, setIsInFavorites] = useState(false);
    const [isInWatchLater, setIsInWatchLater] = useState(false);


    const fetchFavorites = async () => {
        const data =  await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/favourites`);
        if(data.filter(movie => movie.movieId === +id).length > 0) {
            setIsInFavorites(true);
        }
    }





    const handleAddToFavorites =  async () => {
        setIsInFavorites(!isInFavorites);
        if (isInFavorites) {
            await fetchWrapper.delete(`${import.meta.env.VITE_API_URL}/favourites/${id}`);
        } else {
            await   fetchWrapper.post(`${import.meta.env.VITE_API_URL}/favourites/${id}`);
        }
    };

    const handleAddToWatchLater = () => {
        setIsInWatchLater(!isInWatchLater);
    };
    const { id } = useParams();
    const [movieData, setMovieData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await FetchMovieData(id);
            setMovieData(data);
        };
        fetchData();
        fetchFavorites();
    }, [id]);

    const FetchMovieData = async (id) => {
        return await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/movies/${id}`);
    };

    if (!movieData) {
        return <div>Loading...</div>;
    }

    const { title, rating, releaseYear, runtime, posterPath, genres, country, trailerUrl, description } = GetMovieHeaderObject(
        movieData
    );

    return (
        <Root>
            <Grid container alignItems="center" justifyContent="space-between" sx={{mb:2}}>
                <Grid item>
                    <Typography variant="h3" gutterBottom>
                        {title}
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton   onClick={handleAddToFavorites} >
                        <Favorite fontSize="large" color={isInFavorites ? 'error' : 'disabled'} />
                    </IconButton>
                    <IconButton onClick={handleAddToWatchLater}>
                        <WatchLater  fontSize="large" color={isInWatchLater ? 'primary' : 'disabled'} />
                    </IconButton>
                </Grid>
            </Grid>
            <Typography variant="h6" gutterBottom>
                {rating === 'N/A' ? 'N/A' : `${rating} / 10`}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Poster>
                        <PosterImage component="img" image={posterPath} alt="Movie Poster" />
                    </Poster>
                </Grid>
                <Grid item xs={12} md={8}>
                    <TrailerWrapper>
                        <CardMedia
                            component="iframe"
                            title="Movie Trailer"
                            src={trailerUrl}
                            allowFullScreen
                            sx={{ aspectRatio: '16/9' }}
                        />
                    </TrailerWrapper>
                </Grid>
            </Grid>
            <Typography variant="subtitle1" gutterBottom>
                {releaseYear} | {runtime}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
                Country: {country}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
                Genres:
                {genres.map((genre) => (
                    <GenreChip key={genre} label={genre} />
                ))}
            </Typography>
            <div style={{ marginTop: '30px', marginLeft: '20vh', marginRight: '20vh' }}>
                <Typography
                    variant="body1"
                    gutterBottom
                    style={{ color: '#555', fontSize: '1.2rem', padding: '20px 0' }}
                >
                    {description}
                </Typography>

            </div>
        </Root>
    );
};

export default MovieHeader;
