import React from 'react';
import {FlatList,View,ActivityIndicator,Text} from 'react-native';
import {graphql,compose} from 'react-apollo';
import gql from 'graphql-tag';
import ProductCard from './ProductCard';
class ProductFlatList extends React.Component{
  render(){
    let {loading,Product,page,hasMore,loadMoreProduct,networkStatus} = this.props;
    Product = Product? Product :[];
    if(hasMore )
      Product = [...Product,{id:-1},{id:-2},{id:-3}];
    return (
            <View style={loading && networkStatus !==3?{height:188 + 30}:null}>
              <FlatList
                onEndReached={
                  ()=>{
                    if(hasMore && networkStatus ===7)
                      loadMoreProduct(page + 1);
                  }
                }
                onEndReachedThreshold={1}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={Product}
                keyExtractor={(product,index)=>(product.id)}
                renderItem={({item})=>(<ProductCard dataItem={item}/>)}
              />
              {loading?<ActivityIndicator size="large" animating={loading && networkStatus !==3 } style={styles.loading}/>:null}
            </View>);
  }
}

const styles={
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
}

const PRODUCT_QUERY = gql`
query productQuery($page:Int!,$pageSize:Int!,$ProductGroupId:Int){
    Products:getRecusiveProductOfGroup(page:$page,pageSize:$pageSize,ProductGroupId:$ProductGroupId,paranoid:false){
        page
        pageSize
        hasMore
        totalRows
        Product{
          id
          Name
          DefaultPhotoThumbUrl
          Price
          PreOrderAvailable
          AvailableQty
          UOM{
            id
            Code
          }
       }
    }
}
`;
const query = graphql(PRODUCT_QUERY,{
    options({ProductGroupId,page,search,spec,brand}){
        return {
            variables:{
                ProductGroupId,
                page:1,
                pageSize:5,
            },
            notifyOnNetworkStatusChange:true
        };
    },
    props({ownProps:{ProductGroupId,search,spec,brand},data:{networkStatus,loading,Products,fetchMore,refetch}}){
        let {page,hasMore,Product,pageSize}= Products? Products: {};
        return {
            loading,
            page:page? page: 1,
            pageSize,
            hasMore,
            Product,
            networkStatus,
            loadMoreProduct(page){
                return fetchMore({
                    variables:{
                        page,
                        pageSize,
                        ProductGroupId
                    },
                    updateQuery:(previousResult,{fetchMoreResult})=>{
                        if(!fetchMoreResult){
                            return previousResult;
                        }
                        const result =  Object.assign({},previousResult,{
                            Products:Object.assign({},previousResult.Products,fetchMoreResult.Products,{
                                Product:[...previousResult.Products.Product, ...fetchMoreResult.Products.Product]
                            })
                        });
                        return result;
                    }
                });
            },
            refetch
        }
    }
});
export default compose(
  query
)(ProductFlatList);
