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
    const [trailerIds, setTrailerIds] = useState([]);
    const [imageIds, setImageIds] = useState([]);
    const [filmsInfo, setFilmsInfo] = useState([]);
    //if film with id does not exist, redirect to main page
    useEffect( () => {
        fetchWrapper.get(`${import.meta.env.VITE_API_URL}/movies/${id}`)
            .then( async movie => {
                console.log(movie);
                setMovie(movie);
                setTrailerIds( movie.Video.filter(item => item.type === 'trailer').map(item => item.id));
                setImageIds(movie.Image.map(item => item.id));
                setFilmsInfo(movie.Video.filter(item => item.type === 'movie')  );
            })
            .catch((reason) => {
                console.log("Movie with id " + id + " does not exist")
                console.log(reason)
                navigate('/');
            });

    }, [id, navigate]);











    return (
        <>
            <MovieHeader />
            <VideoCarousel VideoIds={trailerIds}/>
            <ImageCarousel imageIds={imageIds} />
            <FilmViewer filmsInfo={filmsInfo}/>
            <ActorList/>
            <Comments/>


        </>
    )

}

export default Movie;