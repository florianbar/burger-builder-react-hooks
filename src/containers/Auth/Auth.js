import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/actionCreators/index';

const initalEmailInput = {
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
};
const initalPasswordInput = {
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
};

const Auth = props => {
    const [emailInput, setEmailInput] = useState(initalEmailInput);
    const [passwordInput, setPasswordInput] = useState(initalPasswordInput);
    const [isSignUp, setIsSignUp] = useState(true);

    const {buildingBurger, authRedirectPath, onSetAuthRedirectPath, onAuth} = props;
    useEffect(() => {
        if (!buildingBurger && authRedirectPath !== "/") {
            onSetAuthRedirectPath();
        }
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

    const checkValidity = useCallback((value, rules) => {
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
    }, []);

    const inputChangedHandler = (value, controlName) => {
        if (controlName === "email") {
            setEmailInput(prevState => {
                return {
                    ...prevState,
                    value: value,
                    valid: checkValidity(value, emailInput.validation),
                    touched: true
                };
            });
        } 
        else if (controlName === "password") {
            setPasswordInput(prevState => {
                return {
                    ...prevState,
                    value: value,
                    valid: checkValidity(value, passwordInput.validation),
                    touched: true
                };
            });
        }
    };

    const submitHandler = useCallback((event) => {
        event.preventDefault();
        onAuth(
            emailInput.value, 
            passwordInput.value,
            isSignUp
        );
    }, [onAuth, emailInput, passwordInput, isSignUp]);

    const switchAuthModeHandler = useCallback(() => {
        setIsSignUp(prevState => !prevState);
    }, [setIsSignUp]);

    const formElementsArray = [];
    formElementsArray.push({ id: "email", config: emailInput });
    formElementsArray.push({ id: "password", config: passwordInput });
    let formInputs = formElementsArray.map(formElement => (
        <Input
            key={formElement.id}
            elementType={formElement.config.elementType} 
            elementConfig={formElement.config.elementConfig} 
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => inputChangedHandler(event.target.value, formElement.id)} />
    ));

    if (props.loading) {
        formInputs = <Spinner />
    }

    let errorMessage = props.error ? (<p>{props.error.message}</p>) : null;

    const authRedirect = props.isAuthenticated ? <Redirect to={authRedirectPath} /> : null;

    return (
        <div className={classes.Auth}>
            {authRedirect}

            {errorMessage}
            <form onSubmit={submitHandler}>
                {formInputs}
                <Button btnType="Success">
                    {isSignUp ? "SIGN UP" : "SIGN IN"}
                </Button>
            </form>
            <Button 
                btnType="Danger" 
                clicked={switchAuthModeHandler}>
                SWITCH TO {isSignUp ? "SIGN IN" : "SIGN UP"}
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