import React from 'react';
import { Avatar, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const actors = [
    {
        name: 'Actor One',
        role: 'Lead Actor',
        photoUrl: '/path/to/actor1.jpg',
    },
    {
        name: 'Actor Two',
        role: 'Supporting Actor',
        photoUrl: '/path/to/actor2.jpg',
    },
    {
        name: 'Actor Three',
        role: 'Supporting Actor',
        photoUrl: '/path/to/actor3.jpg',
    },
];

const ActorAvatar = ({ src, alt }) => (
    <Avatar sx={{ width: 80, height: 80, marginRight: 2 }} alt={alt} src={src} />
);

const Actor = ({ name, role, photoUrl }) => {
    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item>
                <ActorAvatar alt={name} src={photoUrl} />
            </Grid>
            <Grid item>
                <Typography variant="subtitle1">{name}</Typography>
                <Typography variant="subtitle2">{role}</Typography>
            </Grid>
        </Grid>
    );
};

const ActorsList = () => {
    return (
        <Accordion style={{marginRight:"10vh",marginLeft:"10vh"}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Cast</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ display: 'block' }}>
                <Grid container spacing={2}>
                    {actors.map((actor, index) => (
                        <Grid item xs={6} key={index}>
                            <Actor name={actor.name} role={actor.role} photoUrl={actor.photoUrl} />
                        </Grid>
                    ))}
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

export default ActorsList;
