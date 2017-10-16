import React from 'react';
import {graphql,compose} from 'react-apollo';
import gql from 'graphql-tag';
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Animated
} from 'react-native';
import CategoryFlatList  from './CategoryFlatList';
import { Icon,Header} from 'react-native-elements';

const NAVBAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
class ProductBrowser extends React.Component{
  constructor(props) {
   super(props);
   const scrollAnim = new Animated.Value(0);
   const offsetAnim = new Animated.Value(0);
   this.state={
     scrollAnim,
     offsetAnim,
     clampedScroll:Animated.diffClamp(
       Animated.add(
         scrollAnim.interpolate({
           inputRange:[0,1],
           outputRange:[0,1],
           extrapolate:'clamp'
         }),
         offsetAnim
       ),
       0,
       NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
     )
   };
 }

 _clampedScrollValue = 0;
 _offsetValue = 0;
 _scrollValue = 0;

  static navigationOptions=props=>{
    const {navigation,state} = props;
    return {
      header:(<Animated.View
                // statusBarProps={{ backgroundColor: '#f44336' }}
                // leftComponent={<TouchableOpacity onPress={()=>{this.requestAnimationFrame(()=>{navigation.navigate('DrawerOpen');})}}><Icon containerStyle={{marginLeft:16}} color="#fff" name="menu"/></TouchableOpacity>}
                // centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                // rightComponent={<TouchableOpacity onPress={()=>{this.requestAnimationFrame(()=>{navigation.navigate('Cart');})}}><Icon containerStyle={{marginRight:16}} color="#fff" name="mouse"/></TouchableOpacity>}
                style={[
                  styles.navbar,{}
                ]}
              >
            </Animated.View>)
    }
  }
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

  render(){
    return(
      <CategoryFlatList onScroll={ Animated.event([{nativeEvent: {contentOffset: {y: this._animatedValue}}}]) }/>
    );
  }
}
onst styles = StyleSheet.create({
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
    height: NAVBAR_HEIGHT,
    justifyContent: 'center',
    paddingTop: STATUS_BAR_HEIGHT,
  },
  contentContainer: {
    paddingTop: NAVBAR_HEIGHT,
  },
  title: {
    color: '#333333',
  },
  row: {
    height: 300,
    width: null,
    marginBottom: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  rowText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ProductBrowser;
