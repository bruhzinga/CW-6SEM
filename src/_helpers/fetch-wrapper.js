import {authActions, store} from '../_store/index';

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
    postWithHeaders: requestWithHeaders('POST'),
};

function request(method) {
    return (url, body) => {
        const requestOptions = {
            method,
            headers: authHeader(url)
        };
        if (body) {
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.body = JSON.stringify(body);
        }
        return fetch(url, requestOptions).then(handleResponse);
    }
}

function requestWithHeaders(method) {
    return (url, body, headers) => {
        const requestOptions = {
            method,
            headers: authHeader(url),
            body: body
        };
        if (headers) {
            requestOptions.headers ={
                ...requestOptions.headers,
                ...headers
            }
        }
        return fetch(url, requestOptions).then(handleResponse);
    }
}


// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const token = authToken();
    const isLoggedIn = !!token;
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
}

function authToken() {
    return store.getState().auth.user?.accessToken;
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            if ([401, 403].includes(response.status) && authToken()) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                const logout = () => store.dispatch(authActions.logout());
                logout();
            }

            let message = data.message;

            if(Array.isArray(message)){

            let error = message.join(" \n ")
                return Promise.reject(error);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
export default fetchWrapper;