import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

class ViewModeButton extends React.Component{
  _handleOnPress(e){
    let {onModeChange,mode} = this.props;
    if(onModeChange){
      switch(mode){
        case 0:
          onModeChange(1);
          break;
        case 1:
          onModeChange(0);
      }
    }

  }
  render(){
    const {mode,style} = this.props;
    return (
      <TouchableOpacity style={style} onPress={this._handleOnPress.bind(this)}>
        {
          mode===1?
            <Icon name="view-grid" type="material-community"/>
          :
            <Icon name="view-list"/>
        }
      </TouchableOpacity>
    )
  }
}

export default ViewModeButton;
