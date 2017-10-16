import React from 'react';
import {FlatList,View,Text} from 'react-native';
import {graphql,compose} from 'react-apollo';
import gql from 'graphql-tag';
import RelatedProductCard from './RelatedProductCard';
import {Card} from 'react-native-elements';
class RelatedProductList extends React.Component{
  render(){
    let {RelatedProducts,style} = this.props;

    return (
        <Card containerStyle={style} title={null}>
          <Text style={{fontSize:16,color:'#000'}}>Related Products</Text>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={RelatedProducts}
            keyExtractor={(product,index)=>(product.id)}
            renderItem={({item})=>(<RelatedProductCard dataItem={item}/>)}
          />
        </Card>
        );
  }
}



const PRODUCT_QUERY = gql`
query productQuery($page:Int!,$pageSize:Int!$ProductGroupId:Int){
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
)(RelatedProductList);
