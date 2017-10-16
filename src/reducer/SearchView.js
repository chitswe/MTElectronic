const initialState={
  criteria:{
    search:'',
    spec:[],
    brand:[]
  },
  viewMode:0,
  sortMode:0,
  isFilterBoxOpen:false
}

const criteria = (state=initialState.criteria,action)=>{
  switch(action.type){
    case 'SEARCHVIEW/CRITERIA_SET':
      return {
        ...state,
        ...action.criteria
      };
  }
}

const SearchView=(state=initialState,action)=>{
  switch(action.type){
    case 'SEARCHVIEW/FILTERBOX_OPEN':
      return {
        ...state,
        isFilterBoxOpen:true
      };
      break;
    case 'SEARCHVIEW/FILTERBOX_CLOSE':
      return {
        ...state,
        isFilterBoxOpen:false
      };
      break;
    case 'SEARCHVIEW/SORTMODE_SET':
      return {
        ...state,
        sortMode:action.mode
      };
      break;
    case 'SEARCHVIEW/VIEWMODE_SET':
      return {
        ...state,
        viewMode:action.mode
      };
      break;
    case 'SEARCHVIEW/CRITERIA_SET':
      return {
        ...state,
        criteria:criteria(state.criteria,action)
      };
      break;
    default:
      return state;
  }
}

export default SearchView;
