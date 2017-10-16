import React from 'react';
import {Row,Column as Col} from 'react-native-responsive-grid';
import Accounting from 'accounting';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'react-native-elements';
import MMText from '../common/MMText';
import fontStyles from '../common/FontStyle';
import {connect} from 'react-redux';
const styles = StyleSheet.create({
  image:{
    width:100,
    height:100,
  },
  container:{
    marginLeft:0,
    marginRight:6,
    padding:8
  },
  name:{
    width:100,
    fontSize:12,
    height:36,
    color:'#000'
  },
  price:{
    color:"crimson",
    fontSize:10,
    width:100,
    textAlign:"right",
    ...fontStyles.FiaMonoM
  },
  availibility:{
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class RelatedProductCard extends React.Component{
  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps);
  }
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
            <View ref={component => this._root = component} title={null} style={[styles.container,(id>0?null:{width:118,height:196})]}>
              {

                id>0?
                <TouchableOpacity onPress={()=>{viewProductDetail(id,Name);}}>
                  <Col>
                    {this.__renderAvailability({PreOrderAvailable,AvailableQty,UOM})}
                    {

                      <Row>
                        {
                          DefaultPhotoThumbUrl?
                          <Image source={{uri:DefaultPhotoThumbUrl}} style={styles.image}/>
                          :
                          <View style={styles.image}/>
                        }
                      </Row>
                    }
                    <MMText style={styles.name}>{Name}</MMText>
                    <Text style={styles.price}>{Accounting.formatMoney(Price)}</Text>
                  </Col>
                </TouchableOpacity>
                :
                null
              }
            </View>
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
)(RelatedProductCard);
