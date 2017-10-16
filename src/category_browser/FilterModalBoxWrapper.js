import React from 'react';
import FilterModalBox from '../common/FilterModalBox';
import gql from 'graphql-tag';
import {graphql,compose} from 'react-apollo';

class FilterModalBoxWrapper extends React.Component{
  render(){
    let {brands,spec,isOpen,onRequestClose,brandsLoading,specLoading,search} = this.props;
    spec=spec? spec:[];
    brands=brands? brands:[];
    const filterList = brandsLoading || specLoading? [] : [{id:0,Name:'Brands',PossibleValue:brands},...spec];
    return (<FilterModalBox  loading={brandsLoading || specLoading} isOpen={isOpen} filterList={filterList} onRequestClose={onRequestClose}/>)
  }
}

const LIST_BY_PRODUCTGROUP_ID_QUERY = gql`
	query productBrandListByProductGroupId($productGroupId:Int!){
		BrandList:ProductBrandListByProductGroupId(groupId:$productGroupId){
			id
			Alias
			Name
			Photo
		}
	}
`;


const brandQuery = graphql(LIST_BY_PRODUCTGROUP_ID_QUERY,{
    skip:({productGroupId})=>!productGroupId,
    options:({productGroupId})=>{
        return {
            variables:{
                productGroupId
            }
        };
    },
    props:({ownProps,data:{loading,BrandList}})=>({
        brandsLoading:loading,
        brands:BrandList
    })
});


const SPEC_ITEM_BY_GROUPID = gql`
    query ProductSpecListByGroupId($id:Int!){
        SpecList:ProductSpecListByGroupId(id:$id){
            id
            Name
            IconUrl
            PossibleValue(groupId:$id){
                id
                Name:Value
                Photo:IconUrl
            }
        }
    }
`;

const specQuery = graphql(SPEC_ITEM_BY_GROUPID,{
    skip:({productGroupId})=>!productGroupId,
    options:({productGroupId})=>{
        return {
            variables:{
                id:productGroupId
            }
        };
    },
    props:({ownProps,data:{loading,SpecList}})=>({
        specLoading:loading,
        spec:SpecList
    })
});
export default compose(
  specQuery,
  brandQuery
)(FilterModalBoxWrapper);
