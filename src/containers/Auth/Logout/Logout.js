import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/actionCreators/index';

const Logout = props => {
    const { onLogout, history } = props;
    useEffect(() => {
        onLogout();
        history.replace("/");
    }, [onLogout, history]);

    return <Redirect to="/" />;
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(null, mapDispatchToProps)(Logout);