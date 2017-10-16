import {
  addNavigationHelpers,
  DrawerNavigator
} from 'react-navigation';
import React from 'react';
import {connect} from 'react-redux';
import LandingPage from './LandingPage';
import ProfileScreen from '../profile';


const Navigator =   DrawerNavigator({
  LandingPage:{
    screen:LandingPage
  },
  Profile:{
    screen:ProfileScreen
  }
});

const NavigatorWithNavigation = ({dispatch,navigationState})=>{
  return (<Navigator navigation={
    addNavigationHelpers({dispatch,state:navigationState})
  }/>)
};

export default NavigatorWithState=connect(
  state=>({navigationState:state.HomeNavigator})
)(NavigatorWithNavigation);
export {Navigator};
