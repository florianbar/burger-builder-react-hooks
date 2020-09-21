import React, { useState } from 'react';

import { connect } from 'react-redux';

import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = props => {
    const [showSideDrawer, setShowSideDrawer] = useState(false);

    const sideDrawerCloseHandler = () => {
        setShowSideDrawer(false);
    };

    const sideDrawerToggleHandler = () => {
        setShowSideDrawer(!showSideDrawer);
    };

    return (
        <React.Fragment>
            <Toolbar 
                isAuth={props.isAuthenticated}
                drawerToggleClicked={sideDrawerToggleHandler} />
            
            <SideDrawer 
                isAuth={props.isAuthenticated}
                open={showSideDrawer} 
                closed={sideDrawerCloseHandler} />

            <main className={classes.Content}>
                {props.children}
            </main>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.idToken !== null
    };
};

export default connect(mapStateToProps)(Layout);