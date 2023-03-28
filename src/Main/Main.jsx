import "../_components/index.css"
import React from "react";
import {MainCarousel} from "../_components/MainCarousel";
import MovieGallery from "../_components/MovieGallery";

const movies = [
    {
        id: 1,
        title: 'The Shawshank Redemption',
        image: 'https://picsum.photos/id/1/300/200',
        link: '#'
    },
    {
        id: 2,
        title: 'The Godfather',
        image: 'https://picsum.photos/id/2/300/200',
        link: '#'
    },
    {
        id: 3,
        title: 'The Dark Knight',
        image: 'https://picsum.photos/id/3/300/200',
        link: '#'
    },
    {
        id: 4,
        title: '12 Angry Men',
        image: 'https://picsum.photos/id/4/300/200',
        link: '#'
    },
    {
        id: 5,
        title: 'Schindler\'s List',
        image: 'https://picsum.photos/id/5/300/200',
        link: '#'
    },
    {
        id: 6,
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        image: 'https://picsum.photos/id/6/300/200',
        link: '#'
    },
    {
        id: 7,
        title: 'Forrest Gump',
        image: 'https://picsum.photos/id/7/300/200',
        link: '#'
    },
    {
        id: 8,
        title: 'Star Wars: Episode V - The Empire Strikes Back',
        image: 'https://picsum.photos/id/8/300/200',
        link: '#'
    },
    {
        id: 9,
        title: 'Inception',
        image: 'https://picsum.photos/id/9/300/200',
        link: '#'
    },
    {
        id: 10,
        title: 'The Matrix',
        image: 'https://picsum.photos/id/10/300/200',
        link: '#'
    }
];


export function Main () {
    return (
       <>
       <MainCarousel/>
           <MovieGallery movies={movies} categories={"Horror"}/>
           <MovieGallery movies={movies} categories={"Comedy"}/>

       </>
    );
}

