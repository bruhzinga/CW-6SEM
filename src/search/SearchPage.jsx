import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Autocomplete,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress, FormControl,
    Grid, InputLabel,
    MenuItem,
    Select, styled,
    Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import fetchWrapper from "@/_helpers/fetch-wrapper";
import {Link} from "react-router-dom";


const MovieCard = styled(Card)({
    maxWidth: 345,
});
const MovieMedia = styled(CardMedia)({
    height: 300,
});

const MovieTitle = styled(Typography)({
    height: 60,
    textOverflow: 'ellipsis',
    fontSize: '1.1rem',
    textAlign: 'center',
});

const SearchPage = () => {

    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [countries, setCountries] = useState([]);
    const [years, setYears] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedRating, setSelectedRating] = useState("");
    const [selectedSort, setSelectedSort] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchGenres = async () => {
            const data =  await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/genres`);
            setGenres(data);
        };
        fetchGenres();

        const fetchCountries = async () => {
            const response = await axios.get(
                "https://restcountries.com/v3.1/all?fields=name"
            );
            setCountries(response.data.map((country) => country.name.common));
        };
        fetchCountries();

        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
        setYears(years);

        const ratings = Array.from({ length: 10 }, (_, i) => i + 1);
        setRatings(ratings);


        handleSearch();

    }, []);

    const handleSearch = async (saveState) => {
        setIsLoading(true);
        const query = new URLSearchParams({
            title: searchText,
            genres: selectedGenres? selectedGenres.join(",") : "",
            country: selectedCountry,
            years: selectedYear,
            rating: selectedRating,
            sort: selectedSort,
            page: page,
        }).toString();



        const data = await fetchWrapper.get(`${import.meta.env.VITE_API_URL}/movies/search?${query}`);

        if (saveState) {
            if(data.length > 0)
            setMovies((prevMovies) => [...prevMovies, ...data]);
            else{
                setPage((prevPage) => prevPage - 1 );

            }
        }
        else{
            setMovies(data);
        }


        setIsLoading(false);
    };

    const handleSearchChange = async (event) => {
        setSearchText(event.target.value);
        setPage(0);

    };

    useEffect( () => {
        if(page > 0)
        handleSearch(true);
        else{
            handleSearch()
        }
    },[page]);


    useEffect( () => {
        handleSearch();
    }, [searchText, selectedGenres, selectedCountry, selectedYear, selectedRating, selectedSort]);



    const handleGenreSelect =  (event) => {
         setSelectedGenres(event.target.value);
        setPage(0);

    };

    const handleCountrySelect =  (event) => {
        setSelectedCountry(event.target.value);
        setPage(0);
    };

    const handleYearSelect =  (event) => {
        setSelectedYear(event.target.value);
        setPage(0);
    };

    const handleRatingSelect =  (event) => {
        setSelectedRating(event.target.value);
        setPage(0);
    };

    const handleSortSelect =  (event) => {
        setSelectedSort(event.target.value);
        setPage(0);
    };

    function handleLoadMore() {
        setPage((prevPage) => prevPage + 1 );





    }

    return (
        <>
            <TextField
                label="Search for a movie"
                fullWidth
                value={searchText}
                onChange={handleSearchChange}
            />
            <Grid container spacing={2} style={{ marginTop: "1rem" }}>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Genres</InputLabel>
                        <Select
                            multiple
                            value={selectedGenres}
                            onChange={handleGenreSelect}
                            label="Genres"
                        >
                            {genres.map((genre) => (
                                <MenuItem key={genre.id} value={genre.id}>
                                    {genre.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                        <Autocomplete
                            id='country-select'
                            disablePortal
                            value={selectedCountry || null}
                            onChange={(event, newValue) => {
                                if(!newValue)
                                    setSelectedCountry("");
                                else
                                    setSelectedCountry(newValue);
                                setPage(0);
                            }}
                            options={countries}
                            renderInput={(params) => (
                                <TextField {...params} label="Country" variant="outlined" />
                            )}
                        >


                        </Autocomplete>
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={selectedYear}
                            onChange={handleYearSelect}
                            label="Year"
                        >
                            <MenuItem value="">All</MenuItem>
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Rating</InputLabel>
                        <Select
                            value={selectedRating}
                            onChange={handleRatingSelect}
                            label="Rating"
                        >
                            <MenuItem value="">All</MenuItem>
                            {ratings.map((rating) => (
                                <MenuItem key={rating} value={rating}>
                                    {rating}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container justifyContent="space-between" style={{ marginTop: "1rem" }}>
                <Grid item>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Sort by</InputLabel>
                        <Select
                            value={selectedSort}
                            onChange={handleSortSelect}
                            label="Sort by"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="rating">Rating</MenuItem>
                            <MenuItem value="year">Year</MenuItem>
                            <MenuItem value="latest">Latest to be added</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Button variant="outlined" onClick={handleLoadMore}>
                        Load More
                    </Button>
                </Grid>
            </Grid>

            {isLoading ? (
                <CircularProgress style={{ marginTop: "2rem" }} />
            ) : (
                <Grid container spacing={2} style={{ marginTop: "2rem" }}>
                    {movies.map((movie) => (
                        <Grid item md={2.2} key={movie.id}>
                            <MovieCard>
                                <Link to={`/movie/${movie.id}`}>
                                    <CardActionArea>
                                        <MovieMedia
                                            component="img"
                                            image={`${import.meta.env.VITE_API_URL}/images/${movie.mainPosterId}`}
                                            title={movie.title}
                                        />
                                        <CardContent>
                                            <MovieTitle gutterBottom variant="h5" component="h2">
                                                {movie.title}
                                            </MovieTitle>
                                        </CardContent>
                                    </CardActionArea>
                                </Link>
                            </MovieCard>
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
};

export default SearchPage;

