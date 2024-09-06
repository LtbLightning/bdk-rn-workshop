import React from 'react';
import {Provider} from 'react-redux';
import store from './store';
import MainNavigator from './navigators/MainNavigator';
import Ffi from './screens/Ffi';

const App = () => {
  return (
    <Provider store={store}>
      <Ffi />
    </Provider>
  );
};

export default App;
