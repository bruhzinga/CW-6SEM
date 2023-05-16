import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { history } from '@/_helpers/history';
import { authActions } from '../_store/index';

export { Login };

function Login() {
    const dispatch = useDispatch();
    const authUser = useSelector((x) => x.auth.user);
    const authError = useSelector((x) => x.auth.error);

    useEffect(() => {
        // redirect to home if already logged in
        if (authUser) history.navigate('/');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [forgotPassword, setForgotPassword] = useState(false);

    const loginValidationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });

    const forgotPasswordValidationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
    });

    const formOptions = {
        resolver: forgotPassword ? yupResolver(forgotPasswordValidationSchema) : yupResolver(loginValidationSchema),
    };

    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    const onSubmit = ({ username, password }) => {
        return dispatch(authActions.login({ username, password }));
    };

    const handleForgotPassword = handleSubmit(({ email }) => {
        // Dispatch an action to send the new password to the provided email
        dispatch(authActions.forgotPassword({email}));
        // Reset the form and switch back to the login form
        setForgotPassword(false);
    });

    const handleCancelForgotPassword = (e) => {
        e.preventDefault(); // Prevent default form submission
        setForgotPassword(false);
    };

    return (
        <div className="col-md-6 offset-md-3 mt-5">
            <div className="card">
                <h4 className="card-header">Login</h4>
                <div className="card-body">
                    {!forgotPassword ? (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    name="username"
                                    type="text"
                                    {...register('username')}
                                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                />
                                <div className="invalid-feedback">{errors.username?.message}</div>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    {...register('password')}
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                />
                                <div className="invalid-feedback">{errors.password?.message}</div>
                            </div>
                            <button disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Login
                            </button>
                            {authError && (
                                <div className="alert alert-danger mt-3 mb-0">{authError.message}</div>
                            )}
                            <button
                                disabled={isSubmitting}
                                className="btn btn-link mt-1"
                                onClick={() => setForgotPassword(true)}
                            >
                                Forgot password?
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleForgotPassword}>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    name="email"
                                    type="text"
                                    {...register('email', {
                                        resolver: yupResolver(forgotPasswordValidationSchema),
                                    })}
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                />
                                <div className="invalid-feedback">{errors.email?.message}</div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Send New Password to Email
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary ml-2"
                                onClick={handleCancelForgotPassword}
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <NavLink to="/register">Don't have an account?</NavLink>
        </div>
    );
}

export default Login;
