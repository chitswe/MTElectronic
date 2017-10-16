import React from 'react';
import {Text,View} from 'react-native';
import Preferences from '../Preferences';
class FontDetector extends React.Component{
  measureFont(event,v){
    const {onDetected} = this.props;
    if(!Preferences.fontType){
      switch(v){
        case 1:
          this.w1 = event.nativeEvent.layout.width;
          break;
        case 2:
          this.w2 = event.nativeEvent.layout.width;
          break;
      }
      const {w1,w2} = this;
      if(w1 && w2 ){
        Preferences.resolveFontType(w1,w2);
        this.forceUpdate();
        if(onDetected)
          onDetected();
      }
    }
  }
  render(){
    const {showFontWidth} = this.props;
    return (
      <View style={{flexDirection:'row'}}>
        <Text style={{color:'rgba(0,0,0,0)'}} onLayout={event=>{this.measureFont(event,1);}}>{"\u1000"}</Text>
        <Text style={{color:'rgba(0,0,0,0)'}} onLayout={event=>{this.measureFont(event,2);}}>{"\u1000\u1039\u1000"}</Text>
        {
          showFontWidth?
          <Text >{this.w1}, {this.w2}</Text>
          :
          null
        }
      </View>
    );
  }
}

export default FontDetector;
