import React from 'react';
import fontStyles from './FontStyle';
import {StyleSheet} from 'react-native';
import HTMLView from 'react-native-htmlview';

const MMHTMLView=({style,...props})=>{
  const mmFontStyle = fontStyles.getMMFontStyle();
  const styles = StyleSheet.create({
    div:{
      ...mmFontStyle,
      color:'#000'
    },
    span:{
      ...mmFontStyle,
      color:'#000'
    },
    p:{
      ...mmFontStyle,
      color:'#000'
    },
    h1:{
      ...mmFontStyle,
      color:'#000'
    },
    h2:{
      ...mmFontStyle,
      color:'#000'
    },
    h3:{
      ...mmFontStyle,
      color:'#000'
    },
    body:{
      ...mmFontStyle,
      color:'#000'
    },
    ul:{
      ...mmFontStyle,
      color:'#000'
    },
    ol:{
      ...mmFontStyle,
      color:'#000'
    }
  });
  return (<HTMLView {...props} stylesheet={styles} style={[style]}/>);
}

export default MMHTMLView;
