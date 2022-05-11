import { combineReducers } from "redux";
import { INIT_GLOBAL, SET_PRIMARY_THEME, SET_THEME } from "./actions";
export const initState = {};

const GlobalReducer = (state = initState, action: any) => {
  switch (action.type) {
    //初始化全局变量
    case INIT_GLOBAL:
      return { ...state, ...action.value };
    //设置主题
    case SET_THEME:
      return { ...state, theme: action.value };
    //设置主题色
    case SET_PRIMARY_THEME:
      return { ...state, themeColor: action.value };
    default:
      return state;
  }
};
const reducer = combineReducers({
  global: GlobalReducer,
});

export default reducer;
