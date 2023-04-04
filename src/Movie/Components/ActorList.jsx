import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Grid, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useParams} from "react-router-dom";
import fetchWrapper from "@/_helpers/fetch-wrapper";

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
    const [actors, setActors] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/movies/${id}/people`);
           const  formattedData = data.People.map((entree)=>{
              return{
                  role:entree.Role,
                  name:entree.People.name,
                  photoUrl:`${import.meta.env.VITE_API_URL}/images/${entree.People.Image.id}`
               }

           })


            setActors(formattedData);
        };

        fetchData();
    }, []);

    return (
        <Accordion style={{ marginRight: "10vh", marginLeft: "10vh" }}>
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
