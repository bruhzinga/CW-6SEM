import React, {useEffect, useState} from 'react';
import MovieHeader from "./Components/MovieHeader";
import ActorList from "./Components/ActorList";
import VideoCarousel from "./Components/VideoCarousel";
import ImageCarousel from "./Components/ImageCarousel";
import Comments from "./Components/Comments";
import {useNavigate, useParams} from "react-router-dom";
import {fetchWrapper} from "@/_helpers/fetch-wrapper";
import FilmViewer from "@/Movie/Components/FilmViewer";


function Movie(props) {
    const navigate = useNavigate();
    const [movie, setMovie] = useState({});
    const { id } = useParams();
    //if film with id does not exist, redirect to main page
    useEffect( () => {
        let getIds = [];
        fetchWrapper.get(`${import.meta.env.VITE_API_URL}/movies/${id}`)
            .then( async movie => {
                setMovie(movie);
                setTrailerIds( movie.Video.filter(item => item.type === 'Trailer').map(item => item.id));
                setImageIds(movie.Image.map(item => item.id));
                setFilmID(movie.Video.filter(item => item.type === 'Movie')[0].id);
            })
            .catch(() => {
                navigate('/');
            });

    }, [id, navigate]);

    const [trailerIds, setTrailerIds] = useState([]);
    const [imageIds, setImageIds] = useState([]);
    const [filmID, setFilmID] = useState(0);









    return (
        <>
            <MovieHeader />
            <VideoCarousel VideoIds={trailerIds}/>
            <ImageCarousel imageIds={imageIds} />
            <FilmViewer filmId={filmID}/>
            <ActorList/>
            <Comments/>


        </>
    )

}

export default Movie;