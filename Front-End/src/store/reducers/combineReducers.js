import {combineReducers} from 'redux'
import projectInContextReducer from './projectInContextReducer'
import rootReducer from './rootReducer'

const reducers = combineReducers({
    rootReducer,
    projectInContextReducer
})

export default reducers