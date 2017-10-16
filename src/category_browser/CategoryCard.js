import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Image} from 'react-native';
import Preferences from '../Preferences';
import fontStyles from '../common/FontStyle';
import MMText from '../common/MMText';
class CategoryCard extends React.Component{
  render(){
    const {dataItem,navigation} = this.props;
    const {id,Alias,Name,Thumb} = dataItem.item;
    return (
      <View>
        <View
          style={styles.container}
        >
          <TouchableOpacity
            style={styles.touchable}
            onPress={()=>{
                navigation.navigate("CategoryBrowser",{criteria:{productGroupId:id,spec:[],brand:[]},headerText:Name,viewMode:0,sortMode:0,isFilterBoxOpen:false});
            }}
          >
            <Image
              source={
                {
                  uri:Thumb.startsWith('http')?Thumb:`${Preferences.apiUrl}${Thumb}`
                }
              }
              style={styles.image}/>
            <View style={styles.tile}>
              <MMText style={styles.name}>{Name}</MMText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  touchable:{
    alignItems:'center',
    justifyContent:'center'
  },
  container:{
    marginLeft:0,
    marginRight:6,
    flexDirection:'column'
  },
  image:{
    width:75,
    height:75,
    backgroundColor:'#fff'
  },
  tile:{
    padding:8
  },
  name:{
    color:'#000',
  }
});
export default CategoryCard;
