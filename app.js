

import React from 'react';
import {
  AppRegistry
} from 'react-native';
import HomeScreen from './src/home';
import {
  DrawerNavigator
} from 'react-navigation';

const HomeScreenNavigator = DrawerNavigator({
  Home:{
    screen:HomeScreen
  }
});



AppRegistry.registerComponent('MTElectronic', () => HomeScreenNavigator);
