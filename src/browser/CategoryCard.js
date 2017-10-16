import React from 'react';
import {Card} from 'react-native-elements';
import {Row,Column as Col} from 'react-native-responsive-grid';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import ProductFlatList from './ProductFlatList';
import MMText from '../common/MMText';
const styles = StyleSheet.create({
  container:{
     marginTop:20,
  },
  name:{
    marginLeft:16,
    marginRight:16,
    flex:1,
    color:'#000'
  },
  more:{
    alignSelf:'flex-end',
    marginRight:8,
    color:'#f44336',
    padding:8
  },
  header:{
    flexWrap:"nowrap",
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  }
});

class CategoryCard extends React.Component{

  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps);
  }
  render(){
    let {dataItem,navigation} = this.props;
    let {id,Name} = dataItem;
    return(<View ref={component => this._root = component} style={styles.container}>
            <View style={styles.header}>
              <MMText style={styles.name}>{Name}</MMText>
              <TouchableOpacity
                onPress={()=>{
                    navigation.navigate("CategoryBrowser",{criteria:{productGroupId:id,spec:[],brand:[]},headerText:Name,viewMode:0,sortMode:0,isFilterBoxOpen:false});
                }}
              >
                <Text
                style={styles.more}
                >MORE</Text>
              </TouchableOpacity>
            </View>
            <ProductFlatList ProductGroupId={id}/>
          </View>
          );
  }
}
export default CategoryCard;
