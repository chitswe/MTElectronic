import React from 'react';
import {FlatList,View,ActivityIndicator,Text,Animated} from 'react-native';
import {graphql,compose} from 'react-apollo';
import {connect} from 'react-redux';
import gql from 'graphql-tag';
import ProductGridCard from '../common/ProductGridCard';
import {TOOLBAR_HEIGHT} from '../common/ToolBar';
const NAVBAR_HEIGHT = 64;
import ProductListCard from '../common/ProductListCard';
import CategoryFlatList from './CategoryFlatList';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
class ProductFlatList extends React.Component{

  _clampedScrollValue = 0;
 _offsetValue = 0;
 _scrollValue = 0;

 componentDidMount() {
    this.props.scrollAnim.addListener(({ value }) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        TOOLBAR_HEIGHT ,
      );
    });
    this.props.offsetAnim.addListener(({ value }) => {
      this._offsetValue = value;
    });
  }

  componentWillUnmount() {
    this.props.scrollAnim.removeAllListeners();
    this.props.offsetAnim.removeAllListeners();
  }

  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    const toValue = this._scrollValue > TOOLBAR_HEIGHT &&
      this._clampedScrollValue > (TOOLBAR_HEIGHT) / 2
      ? this._offsetValue + TOOLBAR_HEIGHT
      : this._offsetValue - TOOLBAR_HEIGHT;

    Animated.timing(this.props.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  _renderItem({item}){
    const {viewMode} = this.props;
    switch(viewMode){
      case 0:
        return item.id?<ProductGridCard dataItem={item}/>:<View style={styles.emptyCard}/>;
        break;
      case 1:
        return <ProductListCard dataItem={item}/>;
        break;
    }
  }

  render(){
    let {loading,Product,page,hasMore,loadMoreProduct,networkStatus,viewMode,sortMode,ProductGroup,ProductGroupLoading,navigation} = this.props;
    Product = Product? Product :[];
    const numColumns = viewMode ===0?2:1;
    if(viewMode===0){
      const isOdd = Product.length> 0 && Product.length%2!=0;
      if(isOdd){
        Product = [...Product,{id:null}]
      }
    }
    return (
            <View style={styles.container}>
              <AnimatedFlatList
                key={`productList_col_${numColumns}`}
                contentContainerStyle={{paddingTop:TOOLBAR_HEIGHT + NAVBAR_HEIGHT}}
                scrollEventThrottle={1}
                onMomentumScrollBegin={this._onMomentumScrollBegin}
                onMomentumScrollEnd={this._onMomentumScrollEnd}
                onScrollEndDrag={this._onScrollEndDrag}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: this.props.scrollAnim } } }],
                  { useNativeDriver: true },
                )}
                onEndReached={
                  ()=>{
                    if(hasMore && networkStatus ===7)
                      loadMoreProduct(page + 1);
                  }
                }
                ListFooterComponent={<View style={styles.footer}>{networkStatus===3?<ActivityIndicator size="large" animating={ loading} style={[styles.loading,{top:0}]}/>:null}</View>}
                onEndReachedThreshold={1}
                data={Product}
                numColumns={numColumns}
                ListHeaderComponent={()=>(<CategoryFlatList ProductGroup={ProductGroup} navigation={navigation}/>)}
                keyExtractor={(product,index)=>(product.id?product.id:'empty_card')}
                renderItem={this._renderItem.bind(this)}
              />
              {(loading || ProductGroupLoading) && networkStatus !==3?<ActivityIndicator size="large" animating={loading && networkStatus !==3} style={styles.loading}/>:null}
            </View>);
  }
}

const styles={
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top:0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container:{
    flex:1
  },
  footer:{
    height:48,
    flex:1
  },
  emptyCard:{
    flex:1
  }
}

const PRODUCT_QUERY = gql`
query productQuery($page:Int!,$pageSize:Int!,$search:String,$productGroupId:Int,$spec:[Int!],$brand:[Int!],$sortMode:Int){
    Products:getRecusiveProductOfGroup(page:$page,pageSize:$pageSize,search:$search,ProductGroupId:$productGroupId,paranoid:false,spec:$spec,brand:$brand,sortMode:$sortMode){
        page
        pageSize
        hasMore
        totalRows
        Product{
          id
          Alias
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
    options({page,criteria:{productGroupId,spec,brand},sortMode}){
        return {
            variables:{
                page:1,
                pageSize:10,
                productGroupId,
                sortMode,
                spec,
                brand
            },
            notifyOnNetworkStatusChange:true
        };
    },
    props({ownProps:{criteria:{search,spec,brand},sortMode},data:{networkStatus,loading,Products,fetchMore,refetch}}){
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
                        search,
                        spec,
                        brand,
                        sortMode
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

const GROUP_QUERY =gql`
query ProductGroupQuery($productGroupId:Int){
  ProductGroup(parentGroupId:$productGroupId,returnEmpty:true){
    id
    Alias
    Name
    Thumb
  }
}
`;

const groupQuery = graphql(GROUP_QUERY,{
  options:({criteria:{productGroupId}})=>{
    return {
      variables:{
        productGroupId
      },
      notifyOnNetworkStatusChange:true
    };
  },
  props:({data:{ProductGroup,loading}})=>{
    return {
      ProductGroup,
      ProductGroupLoading:loading
    }
  }
});
export default compose(
  query,
  groupQuery
)(ProductFlatList);
