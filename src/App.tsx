import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Redirect from "@/components/Redirect";
import { Spin } from "antd";
import { loopMenuRoute } from "@/config/util";
import "./App.css";
import "@ant-design/pro-form/dist/form.css";
// import "amis/lib/themes/antd.css";
// import "amis/lib/helper.css";
// import "amis/sdk/iconfont.css";
const packageName = require("../package.json").name;
const App = () => {
  const router = loopMenuRoute();
  return (
    <div>
      <BrowserRouter
        basename={
          window.__POWERED_BY_QIANKUN__
            ? `/${packageName}`
            : `/k_subapp/${packageName}`
        }
      >
        <Layout pure={window.__POWERED_BY_QIANKUN__}>
          <Routes>
            <Route path="/" element={<Redirect to="/home" />} />
            {router.map((item: any) => {
              return (
                <Route
                  key={item.path}
                  path={item.path}
                  element={
                    <Suspense fallback={<Spin spinning={true} />}>
                      <item.component />
                    </Suspense>
                  }
                />
              );
            })}
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
};

export default App;
