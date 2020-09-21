import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/actionCreators/index';

import axios from '../../axios-orders';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const { onInitIngredientsHandler } = props;

    useEffect(() => {
        onInitIngredientsHandler();
    }, [onInitIngredientsHandler]);

    const updatePurchaseState = ingredients => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);

        return sum > 0;
    };

    const purchaseHandler = () => {
        if (props.isAuthenticated) {
            setPurchasing(true);
        } else {
            props.onSetAuthRedirectPath('/checkout');
            props.history.push("/auth");
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    };

    const purchaseContinueHandler = () => {
        props.onPurchaseInitHandler();
        props.history.push("/checkout");
    };

    const disabledInfo = {...props.ingredients};
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if (props.ingredients) {
        orderSummary = <OrderSummary 
            ingredients={props.ingredients}
            price={props.totalPrice}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler} />;

        burger = (
            <React.Fragment>
                <Burger ingredients={props.ingredients} />
                <BuildControls 
                    isAuth={props.isAuthenticated}
                    ingredientAdded={props.onAddIngredientHandler} 
                    ingredientRemoved={props.onRemoveIngredientHandler} 
                    disabled={disabledInfo}
                    price={props.totalPrice}
                    ordered={purchaseHandler}
                    purchasable={updatePurchaseState(props.ingredients)} />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.idToken !== null,
        ingredients: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInitIngredientsHandler: () => dispatch(actionCreators.intIngredients()),
        onAddIngredientHandler: (ingredientType) => dispatch(actionCreators.addIngredient(ingredientType)),
        onRemoveIngredientHandler: (ingredientType) => dispatch(actionCreators.removeIngredient(ingredientType)),
        onPurchaseInitHandler: () => dispatch(actionCreators.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));