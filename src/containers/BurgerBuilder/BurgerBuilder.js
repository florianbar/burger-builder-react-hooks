import React, { useState, useEffect, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';
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

    // Similar to MapStateToProps
    const ingredients = useSelector(state => state.burgerBuilder.ingredients);
    const totalPrice = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuthenticated = useSelector(state => state.auth.idToken !== null);
    
    // Similar to MapDispatchToProps
    const dispatch = useDispatch();
    const onInitIngredientsHandler = useCallback(() => dispatch(actionCreators.intIngredients()), [dispatch]);
    const onAddIngredientHandler = (ingredientType) => dispatch(actionCreators.addIngredient(ingredientType));
    const onRemoveIngredientHandler = (ingredientType) => dispatch(actionCreators.removeIngredient(ingredientType));
    const onPurchaseInitHandler = () => dispatch(actionCreators.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actionCreators.setAuthRedirectPath(path));

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
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push("/auth");
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    };

    const purchaseContinueHandler = () => {
        onPurchaseInitHandler();
        props.history.push("/checkout");
    };

    const disabledInfo = {...ingredients};
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if (ingredients) {
        orderSummary = <OrderSummary 
            ingredients={ingredients}
            price={totalPrice}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler} />;

        burger = (
            <React.Fragment>
                <Burger ingredients={ingredients} />
                <BuildControls 
                    isAuth={isAuthenticated}
                    ingredientAdded={onAddIngredientHandler} 
                    ingredientRemoved={onRemoveIngredientHandler} 
                    disabled={disabledInfo}
                    price={totalPrice}
                    ordered={purchaseHandler}
                    purchasable={updatePurchaseState(ingredients)} />
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

export default withErrorHandler(BurgerBuilder, axios);