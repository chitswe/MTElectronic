import React from 'react';
import {
  AppRegistry
} from 'react-native';
import MainNavigator from './MainNavigator';
import createStore from './Store';
import {ApolloProvider} from 'react-apollo';
import ApolloClient,{ createNetworkInterface,addTypename } from 'apollo-client';
import Accounting from 'accounting';
import Preferences from './Preferences';
Accounting.settings = {
    currency: Preferences.format.currency,
    number: Preferences.format.number
};
const networkInterface = createNetworkInterface({
    uri: 'http://mt.com.mm/graphql',
    opts: {
        credentials: 'same-origin',
    },
    transportBatching: true,
});


const apolloClient = new ApolloClient(Object.assign({}, {
    queryTransformer: addTypename,
    dataIdFromObject: (result) => {
        if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
            return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
        }
        return null;
    },
    // shouldBatch: true,
},
{
    networkInterface: networkInterface,
    ssrForceFetchDelay: 100,
}
));

const store = createStore({client:apolloClient});

const App=()=>{
  return (
    <ApolloProvider store = {store} client={apolloClient}>
      <MainNavigator/>
    </ApolloProvider>
  );
};

AppRegistry.registerComponent('MTElectronic', () => App);
