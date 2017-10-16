import React from 'react';
import {Header,Icon} from 'react-native-elements';
import {View,Text,TouchableOpacity,StyleSheet,Platform,FlatList,ActivityIndicator,Image,Dimensions,StatusBar} from 'react-native';
import {graphql,compose} from 'react-apollo';
import gql from 'graphql-tag';
import CategoryCard from './CategoryCard';
import FontDetector from '../common/FontDetector';
const { width: viewportWidth } = Dimensions.get('window');
const NAVBAR_HEIGHT = 64;
const data=[
  {
    uri:`http://res.cloudinary.com/shopkeeper-mt/image/upload/v1/shopkeeper/product/nq1enybx6ovlspa5tadu`,
    id:249
  },
  {
    uri:`http://res.cloudinary.com/shopkeeper-mt/image/upload/v1/shopkeeper/product/edo5vuvgf1cmzghfzw07`,
    id:248
  },
  {
    uri:`http://res.cloudinary.com/shopkeeper-mt/image/upload/v1/shopkeeper/product/sej6rjy1g0v3cwmyaj1s`,
    id:247
  },
  {
    uri:`http://res.cloudinary.com/shopkeeper-mt/image/upload/v1/shopkeeper/product/eb09ffyo7egznwf0lj6t`,
    id:257
  }
];
class LandingPage extends React.Component{
  static navigationOptions=props=>{
    return {
      header:null
    }
  }

  renderProductGroupList(){
    const {ProductGroup,navigation} = this.props;
    return (
      <FlatList
        data={ProductGroup}
        keyExtractor={group=>(group.id)}
        renderItem={({item})=>(<CategoryCard {...item} navigation={navigation}/>)}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.groupListContainer}
      />
    )
  }

  render(){
    const {navigation,loading} = this.props;
    return (
      <View style={styles.fill}>
        <View style={styles.navbar}>
            <StatusBar
              animated={true}
               backgroundColor="#f44336"
             />
            <TouchableOpacity onPress={()=>{navigation.navigate("DrawerOpen")}}><Icon containerStyle={styles.headerIcon} color="#fff" name="menu"/></TouchableOpacity>
            <View style={styles.titleContainer}><Text style={styles.title}>MT Electronics</Text></View>
            <TouchableOpacity  onPress={()=>{navigation.navigate("Search")}}><Icon containerStyle={styles.headerIcon} color="#fff" type={Platform.select({ios:'ionicon',android:'material'})} name={Platform.select({ios:'ios-search',android:'search'})}/></TouchableOpacity>
            <TouchableOpacity  onPress={()=>{navigation.navigate("Cart",{pa:'123'})}}><Icon containerStyle={styles.headerIcon} color="#fff" type="material-community" name="cart"/></TouchableOpacity>
        </View>
        <FlatList
          ListHeaderComponent={
            this.renderProductGroupList.bind(this)
          }
          keyExtractor={item=>(item.id)}
          data={data}
          renderItem={({item:{id,uri}})=>(
            <TouchableOpacity
              style={styles.linkImageWrapper}
              onPress={()=>{
                navigation.navigate("Product",{id});
              }}
            >
              <Image source={{uri}} style={[styles.linkImage,{width:viewportWidth,height:viewportWidth}]}/>
            </TouchableOpacity>)}

        />
        <FontDetector showFontWidth={false} onDetected={this.forceUpdate.bind(this)}/>
        {loading?<ActivityIndicator style={styles.loading} size="large" animating={loading}/>:null}
      </View>
    );
  }
}

const styles = StyleSheet.create(
  {
    linkImageWrapper:{
      paddingVertical:8
    },
    linkImage:{
      resizeMode: 'contain'
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
    fill:{
      flex:1,
      flexDirection:'column'
    },
    groupListContainer:{
      padding:16
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
  }
)

const QUERY  = gql`
query productGroupQuery{
  ProductGroup(returnEmpty:true){
    id
    Alias
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
  }
});

export default compose(
  productGroupQuery
)(LandingPage);
