import React from 'react';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => { 
    const orders = props.isAuth ? <NavigationItem link="/orders">Orders</NavigationItem> : null;
    
    let auth = <NavigationItem link="/auth">Login / Signup</NavigationItem>;
    if (props.isAuth) {
        auth = <NavigationItem link="/logout">Logout</NavigationItem>;
    }

    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/" exact>Burger Builder</NavigationItem>
            {orders}
            {auth}
        </ul>
    );
};

export default navigationItems;