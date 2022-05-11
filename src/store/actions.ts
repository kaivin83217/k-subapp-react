/*
 * action 类型
 */

export const INIT_GLOBAL = "INIT_GLOBAL";
export const SET_GLOBAL = "SET_GLOBAL";
export const SET_THEME = "SET_THEME";
export const SET_PRIMARY_THEME = "SET_PRIMARY_THEME";
/**初始化全局变量 */
export const initGlobalState = (value: Record<string, any>) => {
  return { type: INIT_GLOBAL, value };
};

/**设置全局变量 */
export const setGlobalState = (value: Record<string, any>) => {
  return { type: SET_GLOBAL, value };
};

/**设置主题 */
export const setTheme = (value: number) => {
  return { type: SET_THEME, value };
};

export const setThemeColor = (value: Record<string, string>) => {
  return { type: SET_PRIMARY_THEME, value };
};
