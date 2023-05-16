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
import ImageAdminPanel from "@/AdminPanel/Images/ImageAdminPanel";
import PeopleAdminPanel from "@/AdminPanel/People/PeopleAdminPanel";
import PeopleToMovieMap from "@/AdminPanel/PeopleToMovies/PeopleToMovieMap";
import VideoAdminPanel from "@/AdminPanel/Videos/VideoAdminPanel";
import MovieAdminPanel from "@/AdminPanel/Movie/MovieAdminPanel";
import SearchPage from "@/search/SearchPage";
import Favourites from "@/Favourites/Favourites";
import * as PropTypes from "prop-types";
import {useSelector} from "react-redux";

export { App };

function AdminRoute({children}) {
    const { user: authUser } = useSelector(x => x.auth);

    if (authUser.role.name !== "Admin") {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/" state={{ from: history.location }} />
    }

    // authorized so return child components
    return children;
}

AdminRoute.propTypes = {children: PropTypes.node};

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
                    <Route path="/admin/genre" element={
                        <AdminRoute>
                            <AdminGenre/>
                        </AdminRoute>
                    } />
                    <Route path="/admin/image" element={
                        <AdminRoute>
                            <ImageAdminPanel/>
                        </AdminRoute>
                    } />
                    <Route path="/admin/people" element={
                        <AdminRoute>
                            <PeopleAdminPanel/>
                        </AdminRoute>
                    } />
                    <Route path="/admin/people-map" element={
                        <AdminRoute>
                            <PeopleToMovieMap/>
                        </AdminRoute>
                    } />
                    <Route path="/admin/video" element={
                        <AdminRoute>
                            <VideoAdminPanel/>
                        </AdminRoute>
                    } />
                    <Route path="/admin/movie" element={
                        <AdminRoute>
                            <MovieAdminPanel/>
                        </AdminRoute>
                    } />
                </Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}

