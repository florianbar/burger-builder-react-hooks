import React, { useEffect } from 'react';
import axios from '../../axios-orders';

import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/actionCreators/index';

import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const Orders = props => {
    useEffect(() => {
        props.onFetchOrdersHandler(props.idToken, props.userId);
    }, []);

    let orders = <Spinner />;
    if (!props.loading) {
        orders = (
            <div>
                {props.orders.map(order => (
                    <Order 
                        key={order.id} 
                        ingredients={order.ingredients} 
                        price={order.price} />
                ))}
            </div>
        );
    }

    return <div>{orders}</div>;
}

const mapStateToProps = state => {
    return {
        idToken: state.auth.idToken,
        userId: state.auth.userId,
        orders: state.order.orders,
        loading: state.order.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrdersHandler: (idToken, userId) => dispatch(actionCreators.fetchOrders(idToken, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));