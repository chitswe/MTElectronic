import React from 'react';
import {TextInput,TouchableOpacity,StyleSheet,Platform,StatusBar,View} from 'react-native';
import {Icon,SearchBar as SearchBox} from 'react-native-elements';
import {connect} from 'react-redux';

class SearchBar extends React.Component{
  onChangeText(search){
    this.searchText = search;
  }
  onBlur(e){
    let search =this.searchText;
    let words=[];
    if(search){
      words = search.split(' ');
      search="";
      for(let s of words){
        s = s.trim();
        if(s && search)
          search=`${search} & ${s}:*`;
        else if(s)
          search=`${s}:*`;
      }
    }
    let {onChangeSearchText} = this.props;
    onChangeSearchText(search);
  }
  render(){
    let {navigation} = this.props;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#f44336"
          barStyle="light-content"
        />
        <View
          style={styles.header}
        >
          <TouchableOpacity style={styles.backTouchable} onPress={()=>{navigation.goBack();}}><Icon containerStyle={styles.headerIcon} color="#fff" type={Platform.select({ios:'ionicon',android:'material'})} name={Platform.select({ios:'ios-arrow-back',android:'arrow-back'})}/></TouchableOpacity>
          <SearchBox returnKeyLabel="search" onChangeText={this.onChangeText.bind(this)}  onBlur={this.onBlur.bind(this)} clearIcon={{name:'clear'}} containerStyle={styles.searchBox} inputStyle={styles.searchBoxInputStyle} placeholder="Search product..." lightTheme={true}/>
        </View>
        <View style={styles.content}>
        </View>
      </View>
    );
  }
}
const styles=StyleSheet.create({
  content:{
    flex:1
  },
  header:{
    backgroundColor:'#f44336',
    flexWrap:"nowrap",
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    paddingTop:12
  },
  container:{
    flexDirection:'column',
    flexWrap:'nowrap'
  },
  backTouchable:{
    paddingVertical:8
  },
  headerIcon:{
    paddingHorizontal:12
  },
  searchBox:{
    backgroundColor:'#f44336',
    flex:1,
    borderTopWidth:0,
    borderBottomWidth:0
  },
  searchBoxInputStyle:{
    backgroundColor:'#fff',
    color:'#000'
  }
});
export default connect(
  state=>({}),
  dispatch=>({
    onChangeSearchText:search=>{
      dispatch({type:'SEARCHVIEW/CRITERIA_SET',criteria:{search}});
    }
  })
)(SearchBar);
