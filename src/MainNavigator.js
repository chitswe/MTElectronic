import React from 'react';
import {BackHandler} from 'react-native';
import HomeScreen from './home';
import CartScreen from './cart';
import ProductScreen from './product';
import SearchScreen from './search';
import CategoryBrowserScreen from './category_browser';
import ProductBrowserScreen from './browser';
import CategoryTreeScreen from './CategoryTree';
import Preference from './Preferences';
import {
  StackNavigator,
  addNavigationHelpers
} from 'react-navigation';
import { connect } from 'react-redux'

const Navigator = StackNavigator({
  Home:{
    screen:HomeScreen
  },
  Product:{
    screen:ProductScreen
  },
  Search:{
    screen:SearchScreen
  },
  Cart:{
    screen:CartScreen
  },
  CategoryBrowser:{
    screen:CategoryBrowserScreen
  },
  ProductBrowser:{
    screen:ProductBrowserScreen
  },
  CategoryTree:{
    screen:CategoryTreeScreen
  }
},{
  headerMode:'none'
});
const isRootScreen=(navigator)=> {
	if (navigator.index == null) {
		return true;
	}

	if (navigator.index > 0) {
		return false;
	}

	return !navigator.routes || !navigator.routes.find(route => !isRootScreen(route));
};
class MainNavigator extends React.Component{
  __shouldCloseApp(navigations){
    return navigations.every(nav=>(isRootScreen(nav)));
  }

  componentDidMount(){
    BackHandler.addEventListener('backPress',()=>{
      const { dispatch, mainNavigator,homeNavigator } = this.props
      if(Preference.supressBackNavigation){
        Preference.supressBackNavigation = false;
        return true;
      }
      if (this.__shouldCloseApp([mainNavigator,homeNavigator]))
        return false;
      dispatch({ type: 'Navigation/BACK' })
      return true;
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('backPress')
  }
  render(){
    let {dispatch,mainNavigator} = this.props;
    return (<Navigator navigation = {
        addNavigationHelpers({
          dispatch,
          state:mainNavigator
        })
      }/>);
  }
}
export default connect(
  state=>({mainNavigator:state.MainNavigator,homeNavigator:state.HomeNavigator})
)(MainNavigator);
export {Navigator};
