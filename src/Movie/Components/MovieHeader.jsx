import React from 'react';
import { styled } from '@mui/material';
import { Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';

const Root = styled('div')({
    flexGrow: 1,
    padding: (theme) => theme.spacing(2),
});

const Poster = styled(Card)({
    height: '100%',
});

const TrailerWrapper = styled('div')({
    width: '100%',
    height: 0,
    paddingBottom: '50%', // 16:9 aspect ratio
    position: 'relative',
});

const TrailerIframe = styled('iframe')({
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
});

const MovieHeader = () => {
    return (
        <Root>
            <Typography variant="h3" gutterBottom>
                The Movie
            </Typography>
            <Typography variant="h6" gutterBottom>
                8.5 / 10
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Poster>
                        <CardMedia
                            component="img"
                            image="/path/to/poster.jpg"
                            alt="Movie Poster"
                        />
                    </Poster>
                </Grid>
                <Grid item xs={12} md={8}>
                    <TrailerWrapper>
                        <TrailerIframe
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            title="Movie Trailer"
                            allowFullScreen
                        ></TrailerIframe>
                    </TrailerWrapper>
                </Grid>
            </Grid>
            <Typography variant="subtitle1" gutterBottom>
                2022 | 2h 15min
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
                Action, Adventure, Drama
            </Typography>
            <Typography variant="body1" gutterBottom>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed nisi finibus, tincidunt ex non, viverra nulla. Nullam in tincidunt velit. In lacinia eleifend turpis, at varius enim consequat sit amet. Nam ultrices tellus sed felis tempor vestibulum. Sed vel nisl vel nulla maximus pellentesque vel at tortor. Sed auctor tincidunt dui, nec faucibus ipsum accumsan id. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce blandit sapien ac augue congue, id iaculis augue venenatis. Duis quis massa magna. Praesent ut nibh tellus. Etiam imperdiet ante sit amet odio pharetra, eu sodales lacus volutpat. Donec quis nunc malesuada, iaculis magna vitae, fringilla orci.
            </Typography>
        </Root>
    );
};

export default MovieHeader;
