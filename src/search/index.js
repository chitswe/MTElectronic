import React from 'react';
import SearchBar from './SearchBar';
import {View,StyleSheet,Text,Animated} from 'react-native';
import ProductFlatList from './ProductFlatList';
import ToolBar,{TOOLBAR_HEIGHT} from '../common/ToolBar';
import {connect} from 'react-redux';
import FilterModalBoxWrapper from './FilterModalBoxWrapper';
class SearchView extends React.Component{
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
        TOOLBAR_HEIGHT
      ),
    };
  }
  static navigationOptions=props=>{
    return {
      header:null
    }
  }

  _handleViewModeChange(mode){
    const {changeViewMode} = this.props;
    changeViewMode(mode);
  }
  _handleSortChange(mode){
    const {changeSortMode}  = this.props;
    changeSortMode(mode);
  }
  _handleFilterBoxClose(filterValue){
    const {closeFilterModalBox,setSearchCriteria} = this.props;
    setSearchCriteria(filterValue);
    closeFilterModalBox();
  }
  render(){
    const {navigation,viewMode,sortMode,criteria,openFilterModalBox,isFilterBoxOpen} = this.props;
    const {search} = criteria? criteria:{};
    const {scrollAnim,offsetAnim,clampedScroll} = this.state;
    return (
      <View style={styles.container}>
        <ProductFlatList sortMode={sortMode} viewMode={viewMode} criteria={criteria} scrollAnim={scrollAnim} offsetAnim={offsetAnim} />
        <ToolBar onFilterButtonPress={openFilterModalBox} viewMode={viewMode} sortMode={sortMode} onSortChange={this._handleSortChange.bind(this)} onViewModeChange={this._handleViewModeChange.bind(this)} clampedScroll={clampedScroll}/>
        <SearchBar  navigation ={navigation}/>
        <FilterModalBoxWrapper search={search} isOpen={isFilterBoxOpen} onRequestClose={this._handleFilterBoxClose.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'column-reverse'
  }
});
export default connect(
  state=>({
    isFilterBoxOpen:state.SearchView.isFilterBoxOpen,
    viewMode:state.SearchView.viewMode,
    sortMode:state.SearchView.sortMode,
    criteria:state.SearchView.criteria
  }),
  dispatch=>({
    setSearchCriteria:criteria=>{
      dispatch({type:'SEARCHVIEW/CRITERIA_SET',criteria});
    },
    changeViewMode:mode=>{
      dispatch({type:'SEARCHVIEW/VIEWMODE_SET',mode});
    },
    changeSortMode:mode=>{
      dispatch({type:'SEARCHVIEW/SORTMODE_SET',mode});
    },
    openFilterModalBox:()=>{
      dispatch({type:'SEARCHVIEW/FILTERBOX_OPEN'});
    },
    closeFilterModalBox:()=>{
      dispatch({type:'SEARCHVIEW/FILTERBOX_CLOSE'});
    }
  })
)(SearchView);
