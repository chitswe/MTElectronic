import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Platform,FlatList,ActivityIndicator,Image,StatusBar,SectionList} from 'react-native';
import {Icon} from 'react-native-elements';
import {graphql,compose} from 'react-apollo';
import gql from 'graphql-tag';
import SideBarProductGroupCard from './SideBarProductGroupCard';
import SectionHeader from './SectionHeader';
import SectionItem from './SectionItem';
import fontStyles from '../common/FontStyle';
import MMText from '../common/MMText';

const NAVBAR_HEIGHT = 64;
class ProductTree extends React.Component{
  constructor(){
    super(...arguments);
    this.state={
      selectedGroup:null
    }
  }
  render(){
    const {loading,ProductGroup,navigation} = this.props;
    const {selectedGroup} = this.state;
    const {state:{params:{title}}} = navigation;
    return (
      <View style={styles.fill}>
        <View style={styles.navbar}>
            <StatusBar
              animated={true}
               backgroundColor="#f44336"
             />
            <TouchableOpacity onPress={()=>{navigation.goBack();}}><Icon containerStyle={styles.headerIcon} color="#fff" type={Platform.select({ios:'ionicon',android:'material'})} name={Platform.select({ios:'ios-arrow-back',android:'arrow-back'})}/></TouchableOpacity>
            <View style={styles.titleContainer}><MMText style={styles.title}>{title}</MMText></View>
            <TouchableOpacity  onPress={()=>{navigation.navigate("Search")}}><Icon containerStyle={styles.headerIcon} color="#fff" type={Platform.select({ios:'ionicon',android:'material'})} name={Platform.select({ios:'ios-search',android:'search'})}/></TouchableOpacity>
            <TouchableOpacity  onPress={()=>{navigation.navigate("Cart",{pa:'123'})}}><Icon containerStyle={styles.headerIcon} color="#fff" type="material-community" name="cart"/></TouchableOpacity>
        </View>
        <View style={styles.listWrapper}>
          <FlatList
            containerStyle={styles.flatListContainer}
            data={ProductGroup}
            keyExtractor={(group)=>(group.id)}
            renderItem={({item})=>(<SideBarProductGroupCard active={selectedGroup && item.id===selectedGroup.id} {...item} onPress={()=>{this.setState({selectedGroup:item})}}/>)}
            style={styles.flatList}
            extraData={selectedGroup}
            showsVerticalScrollIndicator={false}
          />
          <SectionList
            containerStyle={styles.sectionListContainer}
            sections={selectedGroup?selectedGroup.Children:[]}
            renderItem={({item:{id,Name,Thumb,Alias}})=>(<SectionItem navigation={navigation} id={id} Name={Name} Thumb={Thumb} Alias={Alias}/>)}
            renderSectionHeader={({section:{id,Name,Thumb,Alias}})=>(<SectionHeader navigation={navigation} id={id} Name={Name} Thumb={Thumb} Alias={Alias} />)}
            keyExtractor={item=>(item.id)}
            style={styles.sectionList}
          />
        </View>
        {loading?<ActivityIndicator style={styles.loading} size="large" animating={loading}/>:null}
      </View>
    );
  }
}

const styles = StyleSheet.create(
  {
    flatList:{
      width:100,
      flexGrow:0,
      flexShrink:0,
    },
    sectionList:{
      flex:1,
      backgroundColor:'#fff'
    },
    listWrapper:{
      flexWrap:'nowrap',
      flexDirection:'row',
      flex:1,
    },
    sectionListContainer:{
      flex:1,
      backgroundColor:'#fff',
    },
    flatListContainer:{
        width:50,
        flex:0,
        flexShrink:0,
        flexGrow:0
    },
    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top:0,
      alignItems: 'center',
      justifyContent: 'center'
    },
    titleContainer:{
      flex:1
    },
    title: {
      color: '#fff',
      alignSelf:'flex-start'
    },
    fill:{
      flex:1,
      flexDirection:'column'
    },
    navbar: {
      alignItems: 'center',
      backgroundColor: 'white',
      borderBottomColor: '#dedede',
      borderBottomWidth: 1,
      height: NAVBAR_HEIGHT ,
      justifyContent: 'center',
      backgroundColor: '#f44336',
      flexWrap:"nowrap",
      flexDirection:'row',
    },
    headerIcon:{
      paddingHorizontal:12
    }
  }
)
const QUERY  = gql`
query productGroupQuery($ParentGroupId:Int){
  ProductGroup(parentGroupId:$ParentGroupId,returnEmpty:true){
    id
    Name
    Alias
    Thumb
    Children{
      id
      Name
      Alias
      Thumb
      data:Children{
        id
        Alias
        Thumb
        Name
      }
    }
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
)(ProductTree);
