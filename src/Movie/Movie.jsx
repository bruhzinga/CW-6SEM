import React from 'react';
import MovieHeader from "./Components/MovieHeader";
import ActorList from "./Components/ActorList";
import VideoCarousel from "./Components/VideoCarousel";

function Movie(props) {
    return (
        <>
            <MovieHeader/>
            <VideoCarousel/>
            <ActorList/>


        </>
    )

}

export default Movie;