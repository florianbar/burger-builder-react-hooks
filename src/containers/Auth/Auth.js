import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/actionCreators/index';

const Auth = props => {
    const initialForm = {
        email: {
            elementType: "input",
            elementConfig: {
                type: "email",
                placeholder: "Email Address"
            },
            value: "",
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: "input",
            elementConfig: {
                type: "password",
                placeholder: "Password"
            },
            value: "",
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        }
    };
    const [form, setForm] = useState(initialForm);
    const [isSignUp, setIsSignUp] = useState(false);

    useEffect(() => {
        if (!props.buildingBurger && props.authRedirectPath !== "/") {
            props.onSetAuthRedirectPath();
        }
    }, []);

    const checkValidity = (value, rules) => {
        let isValid = true;

        if (rules.required) {
            isValid = (value.trim() !== "") && isValid;
        }

        if (rules.minLenght) {
            isValid = (value.length >= rules.minLenght) && isValid;
        }

        if (rules.maxLenght) {
            isValid = (value.length <= rules.maxLenght) && isValid;
        }

        return isValid;
    };

    const inputChangedHandler = (event, controlName) => {
        setForm({
            ...form,
            [controlName]: {
                ...form[controlName],
                value: event.target.value,
                valid: checkValidity(event.target.value, form[controlName].validation),
                touched: true
            }
        });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(
            form.email.value, 
            form.password.value,
            isSignUp
        );
    };

    const switchAuthModeHandler = () => {
        setIsSignUp(!isSignUp);
    };

    const formElementsArray = [];
    formElementsArray.push({ id: "email", config: form.email });
    formElementsArray.push({ id: "password", config: form.password });
    let formInputs = formElementsArray.map(formElement => (
        <Input
            key={formElement.id}
            elementType={formElement.config.elementType} 
            elementConfig={formElement.config.elementConfig} 
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => inputChangedHandler(event, formElement.id)} />
    ));

    if (props.loading) {
        formInputs = <Spinner />
    }

    let errorMessage = props.error ? (<p>{props.error.message}</p>) : null;

    const authRedirect = props.isAuthenticated ? <Redirect to={props.authRedirectPath} /> : null;

    return (
        <div className={classes.Auth}>
            {authRedirect}

            {errorMessage}
            <form onSubmit={submitHandler}>
                {formInputs}
                <Button btnType="Success">
                    {isSignUp ? "SIGN UP" : "LOGIN"}
                </Button>
            </form>
            <Button 
                btnType="Danger" 
                clicked={switchAuthModeHandler}>
                SWITCH TO {isSignUp ? "LOGIN" : "SIGN UP"}
            </Button>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.idToken !== null,
        loading: state.auth.loading,
        error: state.auth.error,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);