import React from 'react';
import {
  Text,
  TouchableOpacity
} from 'react-native';

class Cart extends React.Component{
  render(){
    return <TouchableOpacity onPress={()=>{
      this.props.navigation.dispatch({type:'JUMP_TO_TAB',index:0});
    }}>
              <Text>Cart {this.props.navigation.state.params.pa} </Text>
            </TouchableOpacity>;
  }
}

export default Cart
