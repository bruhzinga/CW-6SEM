import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    styled,
    Typography,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from 'react-router-dom';

const MovieCard = styled(Card)({
    maxWidth: 345,
});

const MovieMedia = styled(CardMedia)({
    height: 300,
});

const MovieTitle = styled(Typography)({
    height: 60,
    textOverflow: 'ellipsis',
    fontSize: '1.1rem',
    textAlign: 'center',
});

const MovieGallery = ({ categories, loadMore, cardsPerPage = 5 }) => {
    const [startIndex, setStartIndex] = useState(0);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMoreMovies, setHasMoreMovies] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            const newMovies = await loadMore(categories, startIndex, cardsPerPage + 1);
            setMovies((prevMovies) => [...prevMovies, ...newMovies]);
            setHasMoreMovies(newMovies.length === cardsPerPage);
            setLoading(false);
        };
        fetchMovies();
    }, [cardsPerPage, loadMore, startIndex]);

    const handleClickPrev = () => {
        setStartIndex(Math.max(0, startIndex - cardsPerPage));
    };

    const handleClickNext = () => {
        setStartIndex(startIndex + cardsPerPage);
    };

    return (
        <div style={{ marginLeft: '30px' }}>
            <div style={{ margin: '16px 0' }}>
                {categories && (
                    <Typography variant="h4" gutterBottom>
                        {categories}
                    </Typography>
                )}
                <Grid container spacing={4} style={{}}>
                    {movies?.map((movie) => (
                        <Grid item md={2.2} key={movie.id}>
                            <MovieCard>
                                <Link to={`/movie/${movie.id}`}>
                                    <CardActionArea>
                                        <MovieMedia
                                            component="img"
                                            image={`${import.meta.env.VITE_API_URL}/images/${movie.mainPosterId}`}
                                            title={movie.title}
                                        />
                                        <CardContent>
                                            <MovieTitle gutterBottom variant="h5" component="h2">
                                                {movie.title}
                                            </MovieTitle>
                                        </CardContent>
                                    </CardActionArea>
                                </Link>
                            </MovieCard>
                        </Grid>
                    ))}
                </Grid>
                <Button disabled={startIndex === 0} onClick={handleClickPrev}>
                    Prev
                </Button>
                <Button
                    disabled={loading || !hasMoreMovies}
                    onClick={handleClickNext}
                    endIcon={<ArrowForwardIosIcon />}
                >
                    <div>{loading ? 'Loading...' : 'Next'}</div>
                </Button>
            </div>
        </div>
    );
};

export default MovieGallery;
