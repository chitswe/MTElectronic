import React from 'react';
import {FlatList,View,ActivityIndicator} from 'react-native';
import {graphql,compose} from 'react-apollo';
import gql from 'graphql-tag';
import CategoryCard from './CategoryCard';
class CategoryFlatList extends React.Component{
  render(){
    let {loading,ProductGroup,navigation} = this.props;
    return (
            <View>
              <FlatList
                onScroll={this.props.onScroll? this.props.onScroll:()=>{}}
                data={ProductGroup}
                keyExtractor={group=>(group.id)}
                renderItem={({item})=>(<CategoryCard navigation={navigation} dataItem={item}/>)}
              />
              {loading?<ActivityIndicator size="large" animating={loading}/>:null}
            </View>);
  }
}

const QUERY  = gql`
query productGroupQuery{
  ProductGroup(parentGroupId:1,returnEmpty:true){
    id
    Name
    Thumb
  }
}
`;

const productGroupQuery = graphql(QUERY, {
  props:({data:{loading,ProductGroup}})=>{
    return {
      loading,
      ProductGroup
    };
  }
});

export default compose(
  productGroupQuery
)(CategoryFlatList);
