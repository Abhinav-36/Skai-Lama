import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import EventManagement from './components/EventManagement';
import store from './store/store';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <EventManagement />
      </div>
    </Provider>
  );
}

export default App;


