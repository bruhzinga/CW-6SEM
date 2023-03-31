import React, {useEffect, useState} from 'react';
import MovieHeader from "./Components/MovieHeader";
import ActorList from "./Components/ActorList";
import VideoCarousel from "./Components/VideoCarousel";
import ImageCarousel from "./Components/ImageCarousel";
import Comments from "./Components/Comments";
import {useNavigate, useParams} from "react-router-dom";
import {fetchWrapper} from "../_helpers";



function Movie(props) {
    const navigate = useNavigate();
    const [movie, setMovie] = useState({});
    const { id } = useParams();
    //if film with id does not exist, redirect to main page
    useEffect( () => {
        let getIds = [];
        fetchWrapper.get(`${process.env.REACT_APP_API_URL}/movies/${id}`)
            .then(async movie => {
                await setMovie(movie);
                getIds= await movie.Video.filter(item => item.type === 'Trailer').map(item => item.id);
                setTrailerIds(getIds);


            })
            .catch(() => {
                navigate('/');
            });
         console.log('ids ' + trailerIds);

    }, [id, navigate]);

    const [trailerIds, setTrailerIds] = useState([]);
    const [imageIds, setImageIds] = useState([]);







    return (
        <>
            <MovieHeader />
            <VideoCarousel VideoIds={trailerIds}/>
            <ImageCarousel/>
            <ActorList/>
            <Comments/>


        </>
    )

}

export default Movie;