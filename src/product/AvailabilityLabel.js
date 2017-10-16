import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import Accounting from 'accounting';
import fontStyles from '../common/FontStyle';
const styles = StyleSheet.create({
  container:{
    display:'flex'
  },
  message:{
    color:'#fff',
    fontSize:12,
    padding:8,
    alignSelf:'flex-start',
    marginTop:4,
    fontFamily:fontStyles.FiaSansM.fontFamily
  },
  maxOrderQty:{
    fontSize:14,
    padding:8,
    fontFamily:fontStyles.FiaSansM.fontFamily
  },
  preOrderMessage:{
    color:'#ff9100',
    paddingTop:0,
    fontFamily:'sanpya'
  }
});
export default  AvailabilityLabel = ({PreOrderAvailable,AvailableQty,MaxOrderQty,UOM,PreOrderMessage})=>{
  let availableMessage = null;
	    if(PreOrderAvailable && AvailableQty > 0){
	    	availableMessage = <Text style={[styles.message,{backgroundColor:'#ff9100'}]}>
								{Accounting.formatNumber(AvailableQty,0)} {UOM ? UOM.Code:''} pre-order available.
							</Text> ;
	    }else if (AvailableQty > 0){
	    	availableMessage = <Text style={[styles.message,{backgroundColor:'#5cb85c'}]}>
								{Accounting.formatNumber(AvailableQty,0)} {UOM ? UOM.Code:''} available.
							</Text> ;
	    }else{
	    	availableMessage = <Text style={[styles.message,{backgroundColor:'#f44336'}]}>
									Out of stock
								</Text>
	    }

	    let maxOrderQtyMessage = null;
	    if(MaxOrderQty>0)
	    	maxOrderQtyMessage = <Text style={styles.maxOrderQty}>
								(Only {Accounting.formatNumber(MaxOrderQty,0)} {UOM ? UOM.Code:''} for each order)
							</Text> ;
      preOrderMessage = PreOrderMessage?<Text style={styles.preOrderMessage}>{PreOrderMessage}</Text>:null;
    return (
      <View style={styles.container}>
        {availableMessage}
        {maxOrderQtyMessage}
        {preOrderMessage}
      </View>
    )

}
