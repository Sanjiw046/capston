
//yaha par reducer se aaye huee sare reducer jo ki rootReducer me hai usse store kar de rahe hain, iske bad is file ko main.jsx me subscribe kar de rahe hain
import { createStore } from "redux";
import rootReducer from "../reducers/rootReducer";

const store = createStore(rootReducer);

export default store;