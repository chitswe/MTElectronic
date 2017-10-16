import React from 'react';
import {FlatList,Text,View,StyleSheet} from 'react-native';
import CategoryCard from './CategoryCard';
import {Card} from 'react-native-elements';
import fontStyles from '../common/FontStyle';
class CategoryFlatList extends React.Component{
  render(){
    const {ProductGroup,navigation} = this.props;
    return (
      <View>
        {
          ProductGroup && ProductGroup.length>0?
          <Text style={styles.title}>Sub Categories</Text>
          :
          null
        }
        {
          ProductGroup && ProductGroup.length>0 ?
          <Card
            title={null}
            containerStyle={styles.card}
          >
            <FlatList
              data={ProductGroup}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(group,index)=>(group.id)}
              renderItem={item=>(<CategoryCard dataItem={item} navigation={navigation}/>)}
            />
          </Card>
          :
          null
        }
        <Text style={styles.title}>Products</Text>
      </View>
    );
  }
}
const styles=StyleSheet.create({
  title:{
    marginLeft:8,
    marginTop:24,
    marginBottom:12,
    fontSize:16,
    color:'#000',
    fontFamily:fontStyles.FiaSansR.fontFamily
  },
  card:{
    marginHorizontal:0,
    marginVertical:0,
    padding:8
  }
});
export default CategoryFlatList;
