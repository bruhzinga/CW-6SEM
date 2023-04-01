import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';

import {history} from '@/_helpers/history';
import {authActions} from "@/_store";
import {NavLink} from "react-router-dom";

export { Register };

function Register() {
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth.user);
    const authError = useSelector((state) => state.auth.error);

    useEffect(() => {
        // redirect to home if already logged in
        if (authUser) history.navigate('/');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm(formOptions);

    const onSubmit = ({ username,password,email }) => {
        dispatch(
            authActions.register({
                password,
                email,
                username
            })
        );
    };

    return (
        <div className="col-md-6 offset-md-3 mt-5">
            <div className="card">
                <h4 className="card-header">Register</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                {...register('username')}
                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                            />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div> <div className="form-group">
                        <label>Email</label>
                        <input
                            type="text"
                            {...register('email')}
                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        />
                        <div className="invalid-feedback">{errors.username?.message}</div>
                    </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                {...register('password')}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                {...register('confirmPassword')}
                                className={`form-control ${
                                    errors.confirmPassword ? 'is-invalid' : ''
                                }`}
                            />
                            <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                        </div>
                        <button
                            disabled={isSubmitting}
                            className="btn btn-primary"
                        >
                            {isSubmitting && (
                                <span className="spinner-border spinner-border-sm mr-1"></span>
                            )}
                            Register
                        </button>
                        {authError && (
                            <div className="alert alert-danger mt-3 mb-0">
                                {authError.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
            <NavLink to="/login">Login</NavLink>
        </div>
    );
}
