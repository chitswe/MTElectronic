import React from 'react';
import Modal from 'react-native-modalbox';
import {TouchableOpacity,StyleSheet,FlatList,View,Text,Dimensions,ActivityIndicator} from 'react-native';
import { Icon,Avatar,Card } from 'react-native-elements'
import immutableUpdate from 'react-addons-update';
import fontStyles from './FontStyle';
const windowDimension = Dimensions.get('window');
class FilterModalBox extends React.Component{
  constructor(){
    super(...arguments);
    this.state={
      selectedFilter:{PossibleValue:[]},
      selectedValue:{}
    };
  }
  _renderFilterListItem({item}){
    const {IconUrl,Name,PossibleValue} = item;
    const {selectedFilter} = this.state;
    return (
      <TouchableOpacity
      onPress={()=>{
        this.setState({selectedFilter:item});
      }}
      style={[styles.listItemContainer,item.id===selectedFilter.id? {backgroundColor:'#fff'}:{backgroundColor:'#f0f0f0'}]}>
        <Avatar source={IconUrl?{uri:IconUrl}:null}/>
        <Text style={styles.filterListItemTitle}>{Name}</Text>
      </TouchableOpacity>
    );
  }
  _renderValueListItem({item}){
    const {Name,Photo} = item;
    const {selectedFilter,selectedValue} = this.state;
    let filter = selectedValue[selectedFilter.id];
    filter = filter? filter:[];
    const isSelected =  filter.indexOf(item.id)>=0;
    return (
      <TouchableOpacity
        onPress={
          ()=>{
            if(isSelected){
              filter.splice(filter.indexOf(item.id),1);
            }else{
              filter = [...filter,item.id];
            }
            this.setState({
              selectedValue:immutableUpdate(selectedValue,{
                [selectedFilter.id]:{
                  $set:filter
                }
              })
            });
          }
        }
        style={[styles.listItemContainer]}
      >
        {
          isSelected?
          <Avatar overlayContainerStyle={{backgroundColor:'#fff'}} icon={{size:44,style:{height:34,width:34},name:'ios-checkbox-outline',type:'ionicon',color:'#f44336'}} />
          :
          <Avatar source={Photo? {uri:Photo}:null} />
        }
        <Text style={styles.filterListItemTitle}>{Name}</Text>
      </TouchableOpacity>
    );
  }
  _handleOnRequestClose(){
    const {onRequestClose} = this.props;
    const {selectedValue} = this.state;
    const brand = selectedValue["0"];
    let spec=[];
    Object.keys(selectedValue).forEach((key)=>{
      if(key !=="0"){
        spec=[...spec,...selectedValue[key]];
      }
    });
    onRequestClose({brand,spec});
  }
  _handleReset(){
    const {selectedValue} = this.state;
    this.setState({selectedValue:{}});
  }
  render(){
    const {isOpen,filterList,loading} = this.props;
    const {selectedFilter,selectedValue} = this.state;
    const {PossibleValue} = selectedFilter? selectedFilter:{PossibleValue:[]};
    return (<Modal
              backdropPressToClose={true}
              swipeArea={50}
              style={styles.modal}
              isOpen={isOpen}
              onClosed={this._handleOnRequestClose.bind(this)}
              position="center"
              >
              <Card wrapperStyle={styles.topBarWrapper} containerStyle={styles.topBarContainer} title={null}>
                <TouchableOpacity style={styles.tool} onPress={this._handleOnRequestClose.bind(this)}>
                  <Icon color="#000" name="check" type="material-community"/>
                </TouchableOpacity>
                <Text style={styles.title}>Filter </Text>
                <TouchableOpacity style={styles.tool} onPress={this._handleReset.bind(this)}>
                  <Icon color="#000" name="reload" type="material-community"/>
                  <Text style={styles.toolText}>RESET</Text>
                </TouchableOpacity>
              </Card>
              <View style={styles.listWrapper}>
                <FlatList
                  style={styles.filterList}
                  containerStyle={{width:100}}
                  extraData={selectedFilter}
                  data={filterList}
                  renderItem={this._renderFilterListItem.bind(this)}
                  keyExtractor={(item,index)=>(item.id)}
                />
                <FlatList
                  style={styles.valueList}
                  data={PossibleValue}
                  extraData={selectedValue}
                  renderItem={this._renderValueListItem.bind(this)}
                  keyExtractor={(item,index)=>(`${selectedFilter.id}_${item.id}`)}
                />
              </View>
              {loading ?<ActivityIndicator size="large" animating={loading } style={styles.loading}/>:null}
            </Modal>
          );
  }
}
const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top:0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal:{
    flexWrap:'nowrap',
    flexDirection:'column',
    height:windowDimension.height-60,
  },
  listWrapper:{
    flexDirection:'row',
    flex:1,
    paddingLeft:8
  }
  ,
  listItemContainer:{
    flexWrap:'nowrap',
    alignItems:'center',
    flexDirection:'row',
    flex:1,
    paddingLeft:8,
    paddingTop:4,
    paddingBottom:4
  },
  filterListItemTitle:{
    color:'#000',
    flex:1,
    marginLeft:8
  },
  filterList:{
    borderColor:'#000',
    backgroundColor:'#F0F0F0',
    width:170,
    flexGrow:0
  },
  valueList:{
    flex:1
  },
  topBarContainer:{
    padding:0,
    margin:0
  },
  topBarWrapper:{
    flexWrap:'nowrap',
    alignItems:'center',
    flexDirection:'row',
    flexShrink:0,
    flexGrow:0
  },
  title:{
    flex:1,
    color:'#000',
    textAlign:'center',
    fontSize:16,
    ...fontStyles.FiaSansM
  },
  tool:{
    padding:16,
    flexDirection:'row',
    flexWrap:'nowrap',
    alignItems:'center',
    justifyContent:'center'
  },
  toolText:{
    color:'#000',
    ...fontStyles.FiaSansR
  }
});
export default FilterModalBox;
