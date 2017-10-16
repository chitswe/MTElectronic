import React from 'react';
import {View,StyleSheet,Text,Animated,TouchableOpacity,Platform} from 'react-native';
import ProductFlatList from './ProductFlatList';
import ToolBar,{TOOLBAR_HEIGHT} from '../common/ToolBar';
import {connect} from 'react-redux';
import FilterModalBoxWrapper from './FilterModalBoxWrapper';
import {Icon,Header} from 'react-native-elements';
import {Row} from 'react-native-responsive-grid';
import immutableUpdate from 'react-addons-update';
import MMText from '../common/MMText';
class CategoryBrowser extends React.Component{
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
    const {closeFilterModalBox,setCriteria} = this.props;
    setCriteria(filterValue);
    closeFilterModalBox();
  }
  render(){
    const {navigation,viewMode,sortMode,criteria,openFilterModalBox,isFilterBoxOpen,headerText} = this.props;
    const {productGroupId} = criteria?criteria:{};
    const {scrollAnim,offsetAnim,clampedScroll} = this.state;
    return (
      <View style={styles.container}>
        <ProductFlatList navigation={navigation} sortMode={sortMode} viewMode={viewMode} criteria={criteria} scrollAnim={scrollAnim} offsetAnim={offsetAnim} />
        <ToolBar onFilterButtonPress={openFilterModalBox} viewMode={viewMode} sortMode={sortMode} onSortChange={this._handleSortChange.bind(this)} onViewModeChange={this._handleViewModeChange.bind(this)} clampedScroll={clampedScroll}/>
        <Header
            outerContainerStyles={styles.header}
            leftComponent={<TouchableOpacity onPress={()=>{navigation.goBack();}}><Icon containerStyle={styles.headerIcon} color="#fff" type={Platform.select({ios:'ionicon',android:'material'})} name={Platform.select({ios:'ios-arrow-back',android:'arrow-back'})}/></TouchableOpacity>}
            centerComponent={<MMText style={{color:'#fff'}}>{headerText}</MMText>}
            rightComponent={
              <Row>
                <TouchableOpacity  onPress={()=>{navigation.navigate("Search")}}><Icon containerStyle={styles.headerIcon} color="#fff" type={Platform.select({ios:'ionicon',android:'material'})} name={Platform.select({ios:'ios-search',android:'search'})}/></TouchableOpacity>
                <TouchableOpacity  onPress={()=>{navigation.navigate("Cart",{pa:'123'})}}><Icon containerStyle={styles.headerIcon} color="#fff" type="material-community" name="cart"/></TouchableOpacity>
              </Row>
            }
          />
        <FilterModalBoxWrapper productGroupId={productGroupId} isOpen={isFilterBoxOpen} onRequestClose={this._handleFilterBoxClose.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'column-reverse'
  },
  header:{ backgroundColor: '#f44336' },
  headerIcon:{
    paddingHorizontal:12
  }
});

class TheComponent extends React.Component{
  static navigationOptions=props=>{
    return {
      header:null
    }
  };
  render(){
    const {navigation,...p} = this.props;
    const {params} = navigation.state;
    const {isFilterBoxOpen,viewMode,criteria,sortMode,headerText} = params? params:{};
    return (
      <CategoryBrowser
        navigation={navigation}
        isFilterBoxOpen={isFilterBoxOpen}
        viewMode={viewMode}
        sortMode={sortMode}
        criteria={criteria}
        headerText={headerText}
        {...p}
        setCriteria={criteria=>{
          const {navigation,...p} = this.props;
          const {params} = navigation.state;
          criteria = {...params.criteria,...criteria};
          navigation.setParams({...params,criteria})
        }}
        changeViewMode={viewMode=>{
          const {navigation,...p} = this.props;
          const {params} = navigation.state;
          navigation.setParams({...params,viewMode});
        }}
        changeSortMode={sortMode=>{
          const {navigation,...p} = this.props;
          const {params} = navigation.state;
          navigation.setParams({...params,sortMode});
        }}
        openFilterModalBox={()=>{
          const {navigation,...p} = this.props;
          const {params} = navigation.state;
          navigation.setParams({...params,isFilterBoxOpen:true});
        }}
        closeFilterModalBox={()=>{
          const {navigation,...p} = this.props;
          const {params} = navigation.state;
          navigation.setParams({...params,isFilterBoxOpen:false});
        }}
      />
    )
  }
}

export default TheComponent;
