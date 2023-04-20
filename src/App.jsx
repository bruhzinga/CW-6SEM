import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';

import {history} from './_helpers/history';


import {Register} from "./register/Register";
import {Main} from "./Main/Main";
import History from "./History/History";
import WatchLater from "./WatchLater/WatchLater";
import Movie from "./Movie/Movie";
import Home from "./home/Home";
import Login from "./login/Login";
import PrivateRoute from "./_components/PrivateRoute";
import AdminGenre from "@/AdminPanel/Genres/GenresAdminPanel";
import GenresAdminPanel from "@/AdminPanel/Genres/GenresAdminPanel";
import ImageAdminPanel from "@/AdminPanel/Images/ImageAdminPanel";
import PeopleAdminPanel from "@/AdminPanel/People/PeopleAdminPanel";
import PeopleToMovieMap from "@/AdminPanel/PeopleToMovies/PeopleToMovieMap";
import VideoAdminPanel from "@/AdminPanel/Videos/VideoAdminPanel";
import MovieAdminPanel from "@/AdminPanel/Movie/MovieAdminPanel";
import SearchPage from "@/search/SearchPage";
import Favourites from "@/Favourites/Favourites";

export { App };

function App() {
    // init custom history object to allow navigation from 
    // anywhere in the react app (inside or outside components)
    history.navigate = useNavigate();
    history.location = useLocation();

    return (
        <div className="app-container bg-light">
            <div>
                <Routes>
                <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        }>
                    <Route path="/" element={<Main/>} />
                    <Route path="/favourites" element={<Favourites/>} />
                    <Route path="/watch-later" element={<WatchLater/>} />
                    <Route path="/history" element={<History/>} />
                    <Route path="/search" element={<SearchPage/>} />
                    <Route path="/movie/:id" element={<Movie/>} />
                    <Route path='/admin/genre' element={<GenresAdminPanel/>} />
                    <Route path='/admin/image' element={<ImageAdminPanel/>} />
                    <Route path='/admin/people' element={<PeopleAdminPanel/>} />
                    <Route path='/admin/people-map' element={<PeopleToMovieMap/>} />
                    <Route path='/admin/video' element={<VideoAdminPanel/>} />
                    <Route path='/admin/movie' element={<MovieAdminPanel/>} />

                </Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}

