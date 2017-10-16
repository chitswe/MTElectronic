import React from 'react';
import {Text,StyleSheet,Image,TouchableOpacity} from 'react-native';
import Preferences from '../Preferences';
import MMText from '../common/MMText';
const CategoryCard=({id,Alias,Name,Thumb,navigation})=>{
  return (
    <TouchableOpacity
      onPress={()=>{
        navigation.navigate("CategoryTree",{ParentGroupId:id,title:Name});
      }}
      style={styles.container}>
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
    marginRight:16
  },
  image:{
    width:75,
    height:75
  },
  caption:{
    color:'#000',
    marginTop:16
  }
});
export default CategoryCard;
