import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchWrapper} from '@/_helpers/fetch-wrapper';
import {history} from '@/_helpers/history';

// create slice

const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        error: null
    }
}

function createReducers() {
    return {
        logout
    };

    function logout(state) {
        state.user = null;
        localStorage.removeItem('user');
        history.navigate('/login');
    }
}

function createExtraActions() {
    const baseUrl = `${import.meta.env.VITE_API_URL}/auth`;


    return {
        login: login(),
        register: register(),
        forgotPassword: forgotPassword(),
    };

    function login() {
        return createAsyncThunk(
            `${name}/login`,
            async ({ username, password }) => await fetchWrapper.post(`${baseUrl}/login`, { username, password })
        );
    }

    function register() {
        return createAsyncThunk(
            `${name}/register`,
            async ({ username, email, password }) => await fetchWrapper.post(`${baseUrl}/register`, { username, email, password,role:"User"  })
        );
    }

    function forgotPassword(){
        return createAsyncThunk(
            `${name}/forgot-password`,
            async ({ email }) => await fetchWrapper.post(`${baseUrl}/forgot-password`, { email })
        );
    }

}

function createExtraReducers() {
    return {
        ...login(),
        ...register(),
        ...forgotPassword()
    };

    function login() {
        let { pending, fulfilled, rejected } = extraActions.login;
        return {
            [pending]: (state) => {
                state.error = null;
            },
            [fulfilled]: (state, action) => {
                const user = action.payload;

                console.log(user);

                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                state.user = user;

                // get return url from location state or default to home page
                const { from } = history.location.state || { from: { pathname: '/' } };
                history.navigate(from);
            },
            [rejected]: (state, action) => {
                state.error = action.error;
            }
        };
    }

    function register() {
        let { pending, fulfilled, rejected } = extraActions.register;
        return {
            [pending]: (state) => {
                state.error = null;
            },
            [fulfilled]: (state, action) => {


                // get return url from location state or default to home page
                const { from } = history.location.state || { from: { pathname: '/login' } };
                history.navigate(from);
            },
            [rejected]: (state, action) => {
                state.error = action.error;
            }
        };
    }

    function forgotPassword() {
        let { pending, fulfilled, rejected } = extraActions.forgotPassword;
        return {
            [pending]: (state) => {
                state.error = null;
            },
            [fulfilled]: (state, action) => {
                // get return url from location state or default to home page
                const { from } = history.location.state || { from: { pathname: '/login' } };
                history.navigate(from);
            },
            [rejected]: (state, action) => {
                state.error = action.error;
            }
        };
    }
}

