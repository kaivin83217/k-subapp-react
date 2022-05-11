import { initGlobalState } from "./actions";

// 注册全局变量并监听全局变量变化，若是qiankun项目则更新主应用变量
const registerGlobalModule = (store: any, props: any = {}) => {
  const initState =
    (props?.getGlobalState && props?.getGlobalState()) ||
    store.getState()?.global ||
    {};
  store.dispatch(initGlobalState({ ...initState }));

  store.subscribe((val: any) => {
    if (window.__POWERED_BY_QIANKUN__) {
      const localState = store.getState();
      const globalState = props.getGlobalState();
      props.setGlobalState({ ...globalState, ...localState.global });
    }
  });
};

export default registerGlobalModule;
