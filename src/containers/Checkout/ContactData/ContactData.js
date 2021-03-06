import React, { useState } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../../../store/actions/actionCreators/index';

import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.module.css';

const ContactData = props => {
    const initalOrderForm = {
        name: {
            elementType: "input",
            elementConfig: {
                type: "text",
                placeholder: "Your name"
            },
            value: "",
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        street: {
            elementType: "input",
            elementConfig: {
                type: "text",
                placeholder: "Your street"
            },
            value: "",
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        zipCode: {
            elementType: "input",
            elementConfig: {
                type: "text",
                placeholder: "Your ZIP code"
            },
            value: "",
            validation: {
                required: true,
                minLenght: 5,
                maxLenght: 5
            },
            valid: false,
            touched: false
        },
        country: {
            elementType: "input",
            elementConfig: {
                type: "text",
                placeholder: "Your country"
            },
            value: "",
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        email: {
            elementType: "input",
            elementConfig: {
                type: "email",
                placeholder: "Your email"
            },
            value: "",
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        deliveryMethod: {
            elementType: "select",
            elementConfig: {
                options: [
                    {value: "fastest", displayValue: "Fastest"},
                    {value: "cheapest", displayValue: "Cheapest"}
                ]
            },
            value: "fastest",
            validation: {},
            valid: true
        }
    };
    const [orderForm, setOrderForm] = useState(initalOrderForm);
    const [formIsValid, setFormIsValid] = useState(false);

    const orderHandler = (event) => {
        event.preventDefault();

        const formData = {};
        for (let key in orderForm) {
            formData[key] = orderForm[key].value;
        }

        const order = {
            ingredients: props.ingredients,
            price: props.totalPrice,
            orderData: formData,
            userId: props.userId
        };

        props.onOrderBurger(order, props.idToken);
    };

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

    const inputChangedHandler = (event, inputId) => {
        const updatedOrderForm = {
            ...orderForm
        };
        const updatedFormElement = { 
            ...updatedOrderForm[inputId]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputId] = updatedFormElement;
        
        let formIsValid = true;
        for (let inputId in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputId].valid && formIsValid;
        }

        setOrderForm(updatedOrderForm);
        setFormIsValid(formIsValid);
    };
    
    const formElementsArray = [];

    for (let key in orderForm) {
        formElementsArray.push({
            id: key,
            config: orderForm[key]
        });
    }

    let form = (
        <form onSubmit={orderHandler}>
            {formElementsArray.map(formElement => (
                <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig} 
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={(event) => inputChangedHandler(event, formElement.id)} />
                )
            )}
            <Button 
                btnType="Success" 
                disabled={!formIsValid}>ORDER</Button>
        </form>
    );

    if (props.loading) {
        form = <Spinner />;
    }

    return (
        <div className={classes.ContactData}>
            <h4>Enter your contact details</h4>
            {form}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        idToken: state.auth.idToken,
        userId: state.auth.userId,
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        loading: state.order.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, idToken) => dispatch(actionCreators.purchaseBurger(orderData, idToken))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));