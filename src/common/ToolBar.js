import React from 'react';
import {View,Picker,StyleSheet,TouchableOpacity,Text,Animated} from 'react-native';
import {Card,Icon} from 'react-native-elements';
import ViewModeButton from './ViewModeButton';
import fontStyles from './FontStyle';
const NAVBAR_HEIGHT = 66;
const TOOLBAR_HEIGHT=54;
class ToolBar extends React.Component{
  _handleViewModeChange(mode){
    const {onViewModeChange} = this.props;
    if(onViewModeChange)
      onViewModeChange(mode);
  }
  _handleSortChange(value){
    const {onSortChange} = this.props;
    if(onSortChange){
      onSortChange(value);
    }
  }
  _handleFilterButtonPress(){
    const {onFilterButtonPress} = this.props;
    if(onFilterButtonPress)
      onFilterButtonPress();
  }
  render(){
    const {viewMode,sortMode,clampedScroll} = this.props;
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, TOOLBAR_HEIGHT ],
      outputRange: [0, -(TOOLBAR_HEIGHT )],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View style={[styles.container, { transform: [{ translateY: navbarTranslate }] }]}>
        <Card title={null} containerStyle={styles.card} wrapperStyle={styles.cardWrapper}>
          <Picker selectedValue={sortMode} mode='dropdown' onValueChange={this._handleSortChange.bind(this)} style={styles.picker}>
            <Picker.Item label="Best Match" value={1}/>
            <Picker.Item label="Price(Low to High)" value={2}/>
            <Picker.Item label="Price(High to Low)" value={3}/>
          </Picker>
          <View style={styles.offsetView}/>
          <ViewModeButton style={styles.viewModeBtn} onModeChange={this._handleViewModeChange.bind(this)}  mode={viewMode}/>
          <TouchableOpacity style={styles.filter} onPress={this._handleFilterButtonPress.bind(this)}>
            <Icon name="filter-outline" type="material-community"/>
            <Text style={styles.filterText}>FILTER</Text>
          </TouchableOpacity>
        </Card>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  offsetView:{
    flex:1
  },
  container:{
    position: 'absolute',
    top: NAVBAR_HEIGHT,
    left: 0,
    right: 0,
    height:TOOLBAR_HEIGHT
  },
  cardWrapper:{
    flexWrap:"nowrap",
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  card:{
    margin:0,
    padding:0,
    flex:1
  },
  picker:{
    width:200,
    alignSelf:'flex-start'
  },
  viewModeBtn:{
    padding:8
  },
  filter:{
    padding:8,
    flexDirection:'row',
    flexWrap:'nowrap',
    alignItems:'center',
    justifyContent:'center'
  },
  filterText:{
    color:'#000',
    ...fontStyles.FiaSansM
  }
})
export default ToolBar;
export {TOOLBAR_HEIGHT};
