import React, {useEffect, useState} from 'react';
import {Card, CardMedia, Chip, Grid, styled, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import fetchWrapper from "@/_helpers/fetch-wrapper";


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
        country: movieData?.Country || 'N/A',
        trailerUrl: `${import.meta.env.VITE_API_URL}/videos/${
            movieData?.Video.filter((video) => video.type === 'Trailer')[0]?.id
        }`,
    };
};

const MovieHeader = () => {
    const { id } = useParams();
    const [movieData, setMovieData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await FetchMovieData(id);
            setMovieData(data);
        };
        fetchData();
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
            <Typography variant="h3" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h6" gutterBottom>
                {rating} / 10
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
