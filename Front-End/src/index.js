import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './store/reducers/rootReducer';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {saveState, loadState} from "./localStorage"
import reducers from './store/reducers/combineReducers' 

const persistedState = loadState()
console.log(persistedState, "INDEX.JS INDEX,JS")

const store = createStore(reducers, applyMiddleware(thunk));
console.log(store.getState())


// store.subscribe(()=>{
// saveState({
//     projectInContext : store.getState().projectInContext})
// })

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
