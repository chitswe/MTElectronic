import React from 'react';
import {Text,View,Image,TouchableOpacity,StyleSheet} from 'react-native';
import Preferences from '../Preferences';
import MMText from '../common/MMText';
import {Icon} from 'react-native-elements';
class SectionItem extends React.Component{
  render(){
    const {id,Name,Thumb,Alias,navigation} = this.props;
    return (
      <View style={styles.container}>
        <Icon name="subdirectory-arrow-right" size={16} color='rgba(0,0,0,.5)'/>
        <TouchableOpacity
          style={styles.touchable}
          onPress={()=>{navigation.navigate("CategoryBrowser",{criteria:{productGroupId:id,spec:[],brand:[]},headerText:Name,viewMode:0,sortMode:0,isFilterBoxOpen:false});}}
        >
          <Image
            source={{
              uri:Thumb && Thumb.startsWith('http')?Thumb:`${Preferences.apiUrl}${Thumb}`
            }}
            style={styles.image}
          />
          <MMText style={styles.name}>{Name}</MMText>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles=StyleSheet.create({
  container:{
    marginLeft:24,
    flex:1,
    flexDirection:'row'
  },
  touchable:{
    flexDirection:'row',
    flexWrap:'nowrap',
    justifyContent:'center',
    alignItems:'center',
    paddingVertical:2,
    borderTopWidth:StyleSheet.hairlineWidth,
    borderColor:'rgba(0,0,0,.3)',
    flex:1
  },
  image:{
    width:32,
    height:32,
    flexShrink:0,
    flexGrow:0,
    marginHorizontal:8
  },
  name:{
    color:'#000',
    fontSize:12,
    flex:1
  }
});

export default SectionItem;
