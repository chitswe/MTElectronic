import React from 'react';
import {Text,View,Image,TouchableOpacity,StyleSheet} from 'react-native';
import Preferences from '../Preferences';
import MMText from '../common/MMText';
class SectionHeader extends React.Component{

  render(){
    const {id,Name,Thumb,Alias,navigation} = this.props;
    return (
      <TouchableOpacity style={styles.container}
        onPress={()=>{navigation.navigate("CategoryBrowser",{criteria:{productGroupId:id,spec:[],brand:[]},headerText:Name,viewMode:0,sortMode:0,isFilterBoxOpen:false});}}
      >
        <Image
          source={{
            uri:Thumb.startsWith('http')?Thumb:`${Preferences.apiUrl}${Thumb}`
          }}
          style={styles.image}
        />
        <MMText style={styles.name}>{Name}</MMText>
      </TouchableOpacity>
    )
  }
}

const styles=StyleSheet.create({
  container:{
    flexDirection:'row',
    flexWrap:'nowrap',
    justifyContent:'center',
    alignItems:'center',
    paddingVertical:4,
    borderTopWidth:StyleSheet.hairlineWidth,
    borderColor:'rgba(0,0,0,.3)'
  },
  image:{
    width:50,
    height:50,
    flexShrink:0,
    flexGrow:0,
    marginHorizontal:8
  },
  name:{
    color:'#000',
    flex:1
  }
});

export default SectionHeader;
