import React from 'react';
import {FlatList,View,ActivityIndicator,StyleSheet,Platform,Animated,TouchableOpacity,Text,StatusBar} from 'react-native';
import {graphql,compose} from 'react-apollo';
import gql from 'graphql-tag';
import CategoryCard from './CategoryCard';
import { Icon,Header} from 'react-native-elements';
const NAVBAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 0 });
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
class ProductBrowser extends React.Component{

  constructor(){
    super(...arguments);
    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

    this.state = {
      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
      ),
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
    this.state.scrollAnim.addListener(({ value }) => {
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
    this.state.scrollAnim.removeAllListeners();
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

  render(){
    let {loading,ProductGroup,navigation} = this.props;
    const {state:{params:{title}}} = navigation;
    const { clampedScroll } = this.state;

    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [0, -(NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
      extrapolate: 'clamp',
    });
    return (
            <View style={styles.fill}>
              <AnimatedFlatList

                contentContainerStyle={styles.contentContainer}
                scrollEventThrottle={1}
                onMomentumScrollBegin={this._onMomentumScrollBegin}
                onMomentumScrollEnd={this._onMomentumScrollEnd}
                onScrollEndDrag={this._onScrollEndDrag}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
                  { useNativeDriver: true },
                )}
                data={ProductGroup}
                keyExtractor={group=>(group.id)}
                renderItem={({item})=>(<CategoryCard navigation={navigation} dataItem={item}/>)}
              />
              <StatusBar
                backgroundColor="#f44336"
                barStyle="light-content"
              />
              <Animated.View style={[styles.navbar, { transform: [{ translateY: navbarTranslate }] }]}>
                  <TouchableOpacity onPress={()=>{navigation.goBack();}}><Icon containerStyle={styles.headerIcon} color="#fff" type={Platform.select({ios:'ionicon',android:'material'})} name={Platform.select({ios:'ios-arrow-back',android:'arrow-back'})}/></TouchableOpacity>
                  <View style={styles.titleContainer}><Text style={styles.title}>{title}</Text></View>
                  <TouchableOpacity  onPress={()=>{navigation.navigate("Search")}}><Icon containerStyle={styles.headerIcon} color="#fff" type={Platform.select({ios:'ionicon',android:'material'})} name={Platform.select({ios:'ios-search',android:'search'})}/></TouchableOpacity>
                  <TouchableOpacity  onPress={()=>{navigation.navigate("Cart",{pa:'123'})}}><Icon containerStyle={styles.headerIcon} color="#fff" type="material-community" name="cart"/></TouchableOpacity>
              </Animated.View>
              <ActivityIndicator size="large" animating={loading} style={styles.loading}/>
            </View>);
  }
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fill: {
    flex: 1,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    height: NAVBAR_HEIGHT ,
    justifyContent: 'center',
    backgroundColor: '#f44336',
    flexWrap:"nowrap",
    flex:1,
    flexDirection:'row',
  },
  contentContainer: {
    paddingTop: NAVBAR_HEIGHT,
  },
  titleContainer:{
    flex:1
  },
  title: {
    color: '#fff',
    alignSelf:'flex-start'
  },
  headerIcon:{
    paddingHorizontal:12
  }
});

const QUERY  = gql`
query productGroupQuery($ParentGroupId:Int){
  ProductGroup(parentGroupId:$ParentGroupId,returnEmpty:true){
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
  },
  options:({navigation:{state:{params:{ParentGroupId}}}})=>({
      variables:{ParentGroupId}
  })
});

export default compose(
  productGroupQuery
)(ProductBrowser);
