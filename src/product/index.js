import React from 'react';
import {graphql,compose} from 'react-apollo';
import gql from 'graphql-tag';
import Carousel,{ Pagination }  from 'react-native-snap-carousel';
import { Icon,Header,Card} from 'react-native-elements';
import Accounting from 'accounting';
import {Row,Column as Col} from 'react-native-responsive-grid';
import fontStyles from '../common/FontStyle';
import MMText from '../common/MMText';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Animated,
  StatusBar,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
const { width: viewportWidth } = Dimensions.get('window');
import SliderEntry,{sliderWidth,itemWidth} from './SliderEntry';
import LinearGradient from 'react-native-linear-gradient';
import AvailabilityLabel from './AvailabilityLabel';
import MMHTMLView from '../common/MMHTMLView';
import RelatedProductList from './RelatedProductList';
const NAVBAR_HEIGHT = 64;
const HEADER_MAX_HEIGHT = viewportWidth-32;
const HEADER_MIN_HEIGHT =0;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 0 });
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class ProductViewer extends React.Component{
  constructor(){
    super(...arguments);
    const offsetAnim = new Animated.Value(0);
    const scrollY = new Animated.Value(0);
    this.state = {
        offsetAnim,
        activeSlide: 0,
        sliderRef: null,
        scrollY,
        clampedScroll: Animated.diffClamp(
          Animated.add(
            scrollY.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
              extrapolateLeft: 'clamp',
            }),
            offsetAnim,
          ),
          0,
          NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
        )
    };
  }
  static navigationOptions=props=>{
    return {
      header:null
    }
  }

  _clampedScrollValue = 0;
 _offsetValue = 0;
 _scrollValue = 0;

 componentDidMount() {
    this.state.scrollY.addListener(({ value }) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
      );
    });
    this.state.offsetAnim.addListener(({ value }) => {
      this._offsetValue = value;
    });
  }

  componentWillUnmount() {
    this.state.scrollY.removeAllListeners();
    this.state.offsetAnim.removeAllListeners();
  }

  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    const toValue = this._scrollValue > NAVBAR_HEIGHT &&
      this._clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
      ? this._offsetValue + NAVBAR_HEIGHT
      : this._offsetValue - NAVBAR_HEIGHT;

    Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };


  _renderItem ({item, index},parallaxProps) {
        let {url} = item;
        return (
          <SliderEntry
              url={url}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
            />
        );
    }

    _renderScrollViewContent() {
      const {ProductById} = this.props;
      let {Alias,Name,Price,PreOrderAvailable,AvailableQty,MaxOrderQty,UOM,PreOrderMessage,Description,Overview,RelatedProducts} = ProductById? ProductById:{};
      return (
        <View style={styles.scrollViewContent}>
          {
            ProductById?
            <View>
              <Card containerStyle={styles.ProductInfoContainer} title={null}>
                <Text style={[styles.Alias,fontStyles.FiaSansR]}>{Alias}</Text>
                <MMText style={[styles.Name]}>{Name}</MMText>
                <Text style={[styles.Price,fontStyles.FiaMonoM]}>{Accounting.formatMoney(Price)}</Text>
                <AvailabilityLabel PreOrderAvailable={PreOrderAvailable} AvailableQty={AvailableQty} MaxOrderQty={MaxOrderQty} UOM = {UOM} PreOrderMessage={PreOrderMessage}/>
                <MMText style={styles.Description}>{Description}</MMText>
                <MMHTMLView  value={Overview}/>
              </Card>
              {
                RelatedProducts && RelatedProducts.length>0?
                  <RelatedProductList style={styles.RelatedProductList} RelatedProducts = {RelatedProducts}/>
                  :
                  null
              }
            </View>
            :
            null
          }
        </View>
      );
    }

  render(){
    const {ProductById,loadingProductById,navigation} =  this.props;
    const {Photo,Alias} = ProductById? ProductById:{Photo:[]};
    const { activeSlide, sliderRef,clampedScroll } = this.state;
    const {state:{params:{title}}} = navigation;
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [0, -(NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
      extrapolate: 'clamp',
    });
    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const navBarBackground = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: ['rgba(0,0,0,0)', 'rgba(244,67,54,1)', 'rgba(244,67,54,1)'],
      extrapolate: 'clamp',
    });

    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    return (
      <View style={{flex:1,backgroundColor:'#fff'}}>
      <StatusBar
        animated={true}
         backgroundColor="#f44336"
       />
      <Animated.ScrollView
        style={styles.fill}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        {this._renderScrollViewContent()}
      </Animated.ScrollView>

      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
          <Animated.View
           style={[
              styles.backgroundImage,
              {
                opacity: imageOpacity,
                transform: [{ translateY: imageTranslate }],
              },
            ]}
          >
          <Carousel
            hasParallaxImages={true}
            ref={(c) => { if (!this.state.sliderRef) { this.setState({ sliderRef: c }); } }}
            data={Photo}
            renderItem={this._renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.6}
            enableMomentum={false}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            scrollEndDragDebounceValue={Platform.OS === 'ios' ? 0 : 100}
            onSnapToItem={(index) => this.setState({ activeSlide: index }) }
          />
        </Animated.View>
        <Animated.View
          style={
            [
              styles.paginationContainer,
              {opacity:imageOpacity}
            ]
          }
        >
          <Pagination
            dotsLength={Photo.length}
            activeDotIndex={activeSlide}
            containerStyle={styles.pagination}
            dotStyle={styles.paginationDot}
            inactiveDotColor="#1a1917"
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={sliderRef}
            tappableDots={!!sliderRef}
            />
        </Animated.View>
      </Animated.View>
      <Animated.View style={[styles.bar,{backgroundColor:'transparent',transform: [{ translateY: navbarTranslate }]}]}>
        <LinearGradient colors={['rgba(0,0,0,.5)', 'rgba(0,0,0,0)']} style={styles.bar}>
          <Animated.View style={[styles.bar,{backgroundColor:navBarBackground}]}>
            <Header
                leftComponent={<TouchableOpacity onPress={()=>{navigation.goBack();}}><Icon containerStyle={styles.headerIcon} color="#fff" type={Platform.select({ios:'ionicon',android:'material'})} name={Platform.select({ios:'ios-arrow-back',android:'arrow-back'})}/></TouchableOpacity>}
                centerComponent={<MMText style={{color:'#fff'}}>{title}</MMText>}
                rightComponent={
                  <Row>
                    <TouchableOpacity  onPress={()=>{navigation.navigate("Search")}}><Icon containerStyle={styles.headerIcon} color="#fff" type={Platform.select({ios:'ionicon',android:'material'})} name={Platform.select({ios:'ios-search',android:'search'})}/></TouchableOpacity>
                    <TouchableOpacity  onPress={()=>{navigation.navigate("Cart",{pa:'123'})}}><Icon containerStyle={styles.headerIcon} color="#fff" type="material-community" name="cart"/></TouchableOpacity>
                  </Row>
                }
              />
          </Animated.View>
        </LinearGradient>
      </Animated.View>
      <ActivityIndicator size="large" animating={loadingProductById} style={styles.loading}/>
      </View>
    );
  }
}

const styles=StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  slider: {
    //paddingTop:STATUS_BAR_HEIGHT + 18,
    backgroundColor:'#e3e3e3'
  },
  sliderContentContainer:{
  },
  paginationContainer: {
    position:'absolute',
    bottom:8,
    left:0,
    right:0,
  },
  pagination:{
    paddingVertical:0
  },
  paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 8
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    backgroundColor:'white',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    height: NAVBAR_HEIGHT,
    justifyContent: 'center',
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
    backgroundColor:'#e3e3e3'
  },
  Alias:{
    fontSize:24,
    color:'#000'
  },
  Name:{
  },
  Price:{
    color:'crimson'
  },
  Description:{
    paddingTop:16,
    lineHeight:24,
    color:'rgba(0,0,0,.75)',
    paddingBottom:16
  },
  RelatedProductList:{
    margin:0,
    marginTop:8
  },
  ProductInfoContainer:{
    flex:1,
    margin:0
  },
  headerIcon:{
    paddingHorizontal:12
  }
});

const PRODUCT_BY_ID_QUERY  = gql`
query productByIdQuery($id:Int!){
    ProductById(id:$id){
        id
        Alias
        Name
        Price
        Description
        DefaultPhoto{
            url
            id
            FileName
            Format
        }
        Overview

        ProductBrandId
        ProductGroupId
        ProductBrand{
            Alias
            Name
        }
        ProductSpec{
            id
            Name
        }
        Photo{
            id
            Format
            FileName
            ProductId
            url
            thumb
        }
        ProductPrice{
            id
            PriceBookName
            Price
        }
        RelatedProducts{
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
        UOM{
            id
            Code
        }
        UOMDescription
        AvailableQty
        DefaultGroup{
            id
            PathToProductGroup{
                id
                Alias
                Name
            }
        }
        PreOrderAvailable
        PreOrderMessage
        MaxOrderQty
    }
}
`;

const productByIdQuery=graphql(PRODUCT_BY_ID_QUERY,{
    props({ownProps,data:{refetch,loading,ProductById}}){
        return {
            findProductById:refetch,
            loadingProductById:loading,
            ProductById
        };
    },
    options:({navigation:{state:{params:{id}}}})=>({
        variables:{id:parseInt(id)},
        fetchPolicy: 'network-only'
    })
});

export default compose(
  productByIdQuery
)(ProductViewer);
