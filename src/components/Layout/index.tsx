import React, { useState } from "react";
import type { MenuDataItem } from "@ant-design/pro-layout";
import ProLayout from "@ant-design/pro-layout";
import { routes } from "@/config/routes";
import { Link } from "react-router-dom";

const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
  menus.map(({ icon, routes, ...item }) => ({
    ...item,
    icon: icon, //&& IconMap[icon as string],
    routes: routes && loopMenuItem(routes),
  }));

const Layout = (props: { pure: boolean; children?: JSX.Element }) => {
  const { pure } = props;
  const [pathname, setPathname] = useState("/");
  return (
    <ProLayout
      pure={pure}
      style={{
        height: 500,
      }}
      headerRender={false}
      fixSiderbar
      location={{ pathname }}
      menuItemRender={(item: any, dom: any) => (
        <Link
          to={item.path || "/"}
          onClick={(e) => {
            setPathname(item.path);
          }}
        >
          {dom}
        </Link>
      )}
      menu={{ request: async () => loopMenuItem(routes) }}
    >
      {props.children}
    </ProLayout>
  );
};
export default Layout;
