import "./index.css"
import React from "react";
import {Carousel} from "antd";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const styleDefaults = {
    height: "66vh",
    margin: "0 auto"
};

export function MainCarousel({fetchMovies}) {
    const navigate = useNavigate();

    let [movies, setMovies] = React.useState([]);

    React.useEffect(() => {
        fetchMovies(null, 0, 5)
            .then((movies) => {
                    setMovies(movies);
                    console.log(movies)
                }

            )

    }, [fetchMovies]);


    return (
        <div >
            <Carousel autoplay arrows prevArrow={<LeftOutlined/>} nextArrow={<RightOutlined/>}>
                {movies.map((movie) => (
                    <div key={movie.id} onClick={()=>{
                        navigate(`/movie/${movie.id}`)
                       } }>
                        <img src ={`${import.meta.env.VITE_API_URL}/images/${movie.mainPosterId}`} style={styleDefaults} />
                    </div>
                ))}
            </Carousel>
        </div>
    );
}

