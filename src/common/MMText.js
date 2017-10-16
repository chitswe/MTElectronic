import React from 'react';
import {Text} from 'react-native';
import fontStyles from './FontStyle';
const MMText=({style,...props})=>{
  const mmFontStyle = fontStyles.getMMFontStyle();
  return (<Text {...props} style={[style,mmFontStyle]}/>);
}

export default MMText;
