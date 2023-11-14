// src/redux/store.js
import { createStore ,combineReducers} from "redux";
import tokenReducer from "./tokenReducer";

const rootReducer = combineReducers({
    tokenReducer
    
  });
  const store = createStore(rootReducer);
export default store;