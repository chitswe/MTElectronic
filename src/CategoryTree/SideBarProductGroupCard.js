import React from 'react';
import {Text,StyleSheet,Image,TouchableOpacity} from 'react-native';
import Preferences from '../Preferences';
import MMText from '../common/MMText';
const CategoryCard=({id,Alias,Name,Thumb,onPress,active})=>{
  const activeStyle = active? {backgroundColor:'#fff'} : {};
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container,activeStyle]}>
      <Image
        source={
          {
            uri:Thumb.startsWith('http')?Thumb:`${Preferences.apiUrl}${Thumb}`
          }
        }
        style={styles.image}
      />
      <MMText style={styles.caption}>{Name}</MMText>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container:{
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderColor:'rgba(0,0,0,.3)',
    paddingVertical:8
  },
  image:{
    width:50,
    height:50
  },
  caption:{
    color:'#000',
    marginTop:8,
    textAlign:'center',
    alignSelf:'center',
    fontSize:12
  }
});
export default CategoryCard;
