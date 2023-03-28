import React, { useState } from 'react';
import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    styled
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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

const MovieGallery = ({ categories, movies, cardsPerPage = 5 }) => {
    const [startIndex, setStartIndex] = useState(0);

    const handleClickPrev = () => {
        setStartIndex(Math.max(0, startIndex - cardsPerPage));
    };

    const handleClickNext = () => {
        setStartIndex(Math.min(movies?.length - cardsPerPage ?? 0, startIndex + cardsPerPage));
    };

    return (
        <div style={{marginLeft:"30px"}} >
        <div style={{ margin: '16px 0' }}>
            {categories && (
                <Typography variant="h4" gutterBottom>
                    {categories}
                </Typography>
            )}
            <Grid container spacing={4} style={{}}>
                {movies?.slice(startIndex, startIndex + cardsPerPage)?.map(movie => (
                    <Grid item md={2.2} key={movie.id}>
                        <MovieCard>
                            <CardActionArea href={movie.link}>
                                <MovieMedia
                                    component="img"
                                    image={movie.image}
                                    title={movie.title}
                                />
                                <CardContent>
                                    <MovieTitle gutterBottom variant="h5" component="h2">
                                        {movie.title}
                                    </MovieTitle>
                                </CardContent>
                            </CardActionArea>
                        </MovieCard>
                    </Grid>
                ))}
            </Grid>
            <Button
                disabled={startIndex === 0}
                onClick={handleClickPrev}
            >
                Prev
            </Button>
            <Button
                disabled={startIndex >= (movies?.length ?? 0) - cardsPerPage}
                onClick={handleClickNext}

                endIcon={<ArrowForwardIosIcon />}
            >
                Next
            </Button>
        </div>
        </div>
    );
};

export default MovieGallery;
