import React from "react";

export const routes = [
  {
    path: "/home",
    name: "首页",
    component: React.lazy(() => import("@pages/Home")),
    // icon: "smile",
  },
  // {
  //   path: "/setting",
  //   name: "基本配置",
  //   component: React.lazy(() => import("@pages/Setting")),
  //   // icon: "heart",
  // },
  {
    path: "/menu",
    name: "菜单配置",
    // icon: "heart",
    routes: [
      {
        path: "/menu/subMenu",
        name: "一级菜单",
        // icon: "smile",
        exact: true,
        component: React.lazy(() => import("@pages/Menu")),
      },
    ],
  },
];
