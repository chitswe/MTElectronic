import React from 'react';
import {Card} from 'react-native-elements';
import {Row,Column as Col} from 'react-native-responsive-grid';
import Accounting from 'accounting';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements';
import {connect} from 'react-redux';
import AvailabilityLabel from '../product/AvailabilityLabel';
import fontStyles from './FontStyle';
import MMText from '../common/MMText';
const styles = StyleSheet.create({
  image:{
    width:150,
    height:150
  },
  container:{
    flex:1,
    margin:0,
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:'#e3e3e3',
    padding:0
  },
  labelContainer:{
    paddingLeft:16,
    paddingRight:16,
    flex:1,
    flexDirection:'column'
  },
  name:{
    fontSize:14,
    marginBottom:8,
  },
  alias:{
    fontSize:14,
    color:'#000',
    marginTop:8,
    ...fontStyles.FiaSansM
  },
  price:{
    color:"crimson",
    fontSize:14,
    marginBottom:4,
    ...fontStyles.FiaMonoM
  },
  touchable:{
    flex:1,
    flexDirection:'row',
    flexWrap:'nowrap',
    alignItems:'center'
  }
});

class ProductListCard extends React.Component{


  render(){
    let {dataItem,viewProductDetail} = this.props;
    let {id,Alias,Name,DefaultPhotoThumbUrl,Price,UOM,AvailableQty,PreOrderAvailable,MaxOrderQty,PreOrderMessage} = dataItem?dataItem:{};

    return(
      <Card title={null}  containerStyle={styles.container}>
        <TouchableOpacity style={styles.touchable} onPress={()=>{viewProductDetail(id,Name);}}>
          {
            DefaultPhotoThumbUrl?
            <Image source={{uri:DefaultPhotoThumbUrl}} style={styles.image} resizeMode={'contain'}/>
            :
            <View style={styles.image}/>
          }
          <View style={styles.labelContainer}>
            <Text style={[styles.alias,fontStyles.FiaSansR]}>{Alias}</Text>
            <MMText style={styles.name}>{Name}</MMText>
            <Text style={styles.price}>{Accounting.formatMoney(Price)}</Text>
            <AvailabilityLabel PreOrderAvailable={PreOrderAvailable} AvailableQty={AvailableQty} MaxOrderQty={MaxOrderQty} UOM={UOM} PreOrderMessage={PreOrderMessage}/>
          </View>
        </TouchableOpacity>
      </Card>
          );

  }
}
export default connect(
  state=>({}),
  dispatch=>({
    viewProductDetail:(id,name)=>{
      dispatch({
        type:'Navigation/NAVIGATE',
        routeName:'Product',
        params:{id,title:name}
      });
    }
  })
)(ProductListCard);
