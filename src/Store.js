import { applyMiddleware, combineReducers, createStore,compose } from 'redux';
import {Navigator as MainNavigator} from './MainNavigator';
import {Navigator as HomeNavigator} from './home';
import SearchView from './reducer/SearchView';
export default ({client})=>{

  return createStore(
    combineReducers({
      MainNavigator:(state,action)=>{
        return MainNavigator.router.getStateForAction(action,state);
      },
      HomeNavigator:(state,action)=>{
        return HomeNavigator.router.getStateForAction(action,state);
      },
      SearchView,
      apollo:client.reducer()
    }),
    client.initialState,
    compose(
      applyMiddleware(client.middleware()),
      //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
}
