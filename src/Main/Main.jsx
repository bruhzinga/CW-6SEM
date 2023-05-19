import React, {useEffect, useState} from "react";
import {MainCarousel} from "@/_components/MainCarousel";
import MovieGallery from "../_components/MovieGallery";
import {fetchWrapper} from "@/_helpers/fetch-wrapper";


const fetchGenres = async () => {
    return await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/genres`);
};


//genre is optional and if not provided, all movies are returned
const fetchMovies = async (genre, skip, take) => {
    let paramsForGet = new URLSearchParams();
    if (genre) {
        paramsForGet.append("genre", genre);
    }
    paramsForGet.append("skip", skip);
    paramsForGet.append("take", take);

    return await fetchWrapper.get(
        `${import.meta.env.VITE_API_URL}/movies?${paramsForGet}`
    );

}



export function Main() {
    const [genres, setGenres] = useState([]);


    useEffect(() => {
        fetchGenres()
            .then((genres) =>
                setGenres(genres)
            )
    }, []);

    return (
        <>
            <MainCarousel fetchMovies={fetchMovies} />
            {genres.map((genre) => (
                <MovieGallery
                    key={genre.name}
                    category={genre.name}
                    loadMore={(category, startIndex, cardsPerPage) =>
                        fetchMovies(category, startIndex, cardsPerPage)
                    }
                    cardsPerPage={5}
                />
            ))}
        </>
    );
}
