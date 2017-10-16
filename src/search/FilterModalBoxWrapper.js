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

const BRAND_QUERY = gql`
query brandByCriteria($searchText:String){
  brands:ProductBrandListByProductCriteria(searchText:$searchText){
    id
    Alias
    Name
    Photo
  }
}
`;

const brandQuery = graphql(BRAND_QUERY,{
  options:({search})=>{
    return {
      variables:{
        searchText:search
      }
    };
  },
  props:({data:{loading,brands}})=>{
    return {
      brandsLoading:loading,
      brands
    };
  }
});

const SPEC_QUERY = gql`
query specByCriteria($searchText:String){
  spec:ProductSpecificationByProductCriteria(searchText:$searchText){
    id
    Name
    IconUrl
    PossibleValue{
      id
      Name:Value
      Photo:IconUrl
    }
  }
}
`;
const specQuery = graphql(SPEC_QUERY,{
  options:({search})=>{
    return {
      variables:{
        searchText:search
      }
    };
  },
  props:({data:{loading,spec}})=>{
    return {
      specLoading:loading,
      spec
    }
  }
});
export default compose(
  specQuery,
  brandQuery
)(FilterModalBoxWrapper);
