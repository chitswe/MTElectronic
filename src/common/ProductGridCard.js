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
import MMText from '../common/MMText';
import { Icon } from 'react-native-elements';
import {connect} from 'react-redux';
import fontStyles from '../common/FontStyle';
const win = Dimensions.get('window');
const styles = StyleSheet.create({
  image:{
    flex:1,
    height:win.width/2
  },
  container:{
    flex:1,
    margin:0,
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:'#e3e3e3',
    padding:0
  },
  name:{
    fontSize:14,
    height:42,
    color:'#000',
    marginLeft:16,
    marginRight:16,
    marginTop:16
  },
  price:{
    color:"crimson",
    fontSize:12,
    textAlign:"right",
    marginLeft:16,
    marginRight:16,
    marginBottom:16,
    ...fontStyles.FiaMonoM
  },
  availibility:{
    position:'absolute',
    left:8,
    top:8
  }
});

class Product2ColCard extends React.Component{

  __renderAvailability({PreOrderAvailable,AvailableQty,UOM}){
      let availableMessage = null;
	    if(PreOrderAvailable && AvailableQty > 0){
	    	availableMessage = <Icon type="font-awesome" name="check-circle" containerStyle={styles.availibility} color='#ff9100'/> ;
	    }else if (AvailableQty > 0){
        availableMessage = <Icon type="font-awesome" name="check-circle" containerStyle={styles.availibility} color='#5cb85c'/>;
	    }else{
        availableMessage = <Icon type="font-awesome" name="times-circle" containerStyle={styles.availibility} color='#f44336'/> ;
	    }
      return availableMessage;
  }
  render(){
    let {dataItem,viewProductDetail} = this.props;
    let {id,Name,DefaultPhotoThumbUrl,Price,UOM,AvailableQty,PreOrderAvailable} = dataItem?dataItem:{};

    return(
      <Card title={null}  containerStyle={styles.container}>
        <TouchableOpacity onPress={()=>{viewProductDetail(id,Name);}}>
          <Col>
            {

              <Row>
                {
                  DefaultPhotoThumbUrl?
                  <Image source={{uri:DefaultPhotoThumbUrl}} style={styles.image} resizeMode={'contain'}/>
                  :
                  <View style={styles.image}/>
                }
              </Row>
            }
            <MMText style={styles.name}>{Name}</MMText>
            <Text style={styles.price}>{Accounting.formatMoney(Price)}</Text>
          </Col>
        </TouchableOpacity>
          {this.__renderAvailability({PreOrderAvailable,AvailableQty,UOM})}
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
)(Product2ColCard);
