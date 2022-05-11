import React, { useEffect, useState, useMemo } from "react";
import { Table, Switch, Button, Card, Tabs, Input, message } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import Service from "@/service/api";
import call from "@/service/request";
import ProFormModal, { Field } from "@/components/ProFormModal";
import { MAX_LEVEL } from "@/contants/contants";
import "./index.less";
import guid from "@/utils/guid";

const { TabPane } = Tabs;
type MenuItem = {
  id: string | number;
  name?: string;
  path: string;
  icon?: string;
  parentId: string;
  isOpenNewTab?: boolean;
  redirect?: string;
  hidden?: boolean;
  [key: string]: any;
};
const MenusTable = () => {
  const [menus, setMenus] = useState<any>([]);
  const [platform, setPlatform] = useState<string>();
  const levelMap = ["一", "二", "三"];
  const field: Field[] = useMemo(
    () => [
      {
        name: "name",
        label: `名称`,
        getComponents: () => {
          return <Input placeholder="请输入名称" />;
        },
      },
      {
        name: "path",
        label: `路径`,
        getComponents: () => {
          return <Input placeholder="请输入路径" />;
        },
      },
      {
        name: "isOpenNewTab",
        label: `新标签页打开`,
        formItemProp: { valuePropName: "checked" },
        getComponents: () => {
          return <Switch defaultChecked />;
        },
      },
      {
        name: "redirect",
        label: `重定向`,
        getComponents: () => {
          return <Input placeholder="请输入重定向路径" />;
        },
      },
      {
        name: "icon",
        label: `图标`,
        getComponents: () => {
          return <Input placeholder="请输入图标" />;
        },
      },
      {
        name: "hidden",
        label: `是否隐藏`,
        formItemProp: { valuePropName: "checked" },
        getComponents: () => {
          return <Switch defaultChecked />;
        },
      },
    ],
    [],
  );
  const insertMenu = (menu: any, values: any) => {
    const { menuKey, parentId, menuOrder = 0, ...rest } = values || {};
    const order: number = menuOrder > 0 ? menuOrder - 1 : 0;
    const menuObj = {
      ...rest,
      parentId,
      id: guid(),
    };
    if (!parentId) {
      menu?.splice?.(order, 0, menuObj);
    } else {
      for (let item of menu) {
        if (parentId === item.id) {
          const childMenu = JSON.parse(JSON.stringify(item.child || []));
          childMenu?.splice?.(order, 0, menuObj);
          item.child = childMenu;
          break;
        } else if (item?.child?.length) {
          insertMenu(item?.child || [], values);
        }
      }
    }
  };

  const editMenu = (menu: any, values: any) => {
    const { menuKey, id, menuOrder = 0, ...rest } = values || {};
    const order: number = menuOrder > 0 ? menuOrder - 1 : 0;
    const menuObj = {
      ...rest,
      id,
    };
    for (let item of menu) {
      if (id === item.id) {
        const index = menu?.findIndex((val: any) => val.id === id);
        menu?.splice?.(index, 1);
        menu?.splice?.(order, 0, menuObj);
        break;
      } else if (item?.child?.length) {
        editMenu(item?.child || [], values);
      }
    }
  };
  const deleteMenu = async (id: number | string, menuKey: string) => {
    try {
      const res: any = await call(Service.deleteMenuConfig, {
        id,
        menuKey,
        platform,
      });
      if (res.Code === 0) {
        message.success("删除成功");
        init();
      }
    } catch (error) {
      message.error("操作失败");
    }
  };
  const onSubmit = async (values?: MenuItem | Record<string, any>) => {
    const { menuKey }: any = values;
    const params = { ...values, strategy: "0b111111" };
    let data = JSON.parse(JSON.stringify(menus));
    if (values?.id) {
      editMenu(data[platform as string][menuKey], params);
    } else {
      insertMenu(data[platform as string][menuKey], params);
    }
    try {
      const res: any = await call(Service.postMenuConfig, data);
      if (res.Code === 0) {
        message.success("操作成功");
        init();
        return true;
      } else {
        throw res.msg;
      }
    } catch (error) {
      message.error("操作失败");
      return false;
    }
  };

  const TableSub = (props: {
    data: any;
    level: number;
    menuKey: string;
    parentId?: string | number;
  }) => {
    const { data, level, menuKey, parentId = 0 } = props;
    const initialValues = {
      level,
      menuKey,
      parentId,
      isOpenNewTab: true,
      hidden: true,
    };
    const columns = useMemo(
      () => [
        { title: "名称", dataIndex: "name", key: "name" },
        { title: "路径", dataIndex: "path", key: "path" },
        {
          title: "新标签页打开",
          dataIndex: "isOpenNewTab",
          key: "isOpenNewTab",
          render: (isOpenNewTab: boolean, record: any) =>
            isOpenNewTab ? "是" : "否",
        },
        { title: "重定向", dataIndex: "redirect", key: "redirect" },
        {
          title: "图标",
          dataIndex: "icon",
          key: "icon",
          render: (item: string, record: any) => {
            return <img alt={item} src={item} />;
          },
        },
        {
          title: "显示/隐藏",
          dataIndex: "hidden",
          key: "hidden",
          render: (hidden: boolean, record: any) => (hidden ? "显示" : "隐藏"),
        },
        {
          title: "操作",
          key: "operation",
          render: (_: any, record: any) => (
            <div>
              <Button
                type="link"
                onClick={() => {
                  ProFormModal.open({
                    title: `编辑${levelMap[record.level - 1]}级菜单`,
                    initialValues: { ...record, level, menuKey, parentId },
                    field: field,
                    onSubmit,
                    submitAll: true,
                  });
                }}
              >
                编辑
              </Button>
              <Button
                type="link"
                onClick={() => deleteMenu(record.id, menuKey)}
              >
                删除
              </Button>
            </div>
          ),
        },
      ],
      [],
    );
    const expandedRowRender = (record: any) => {
      if (level < MAX_LEVEL) {
        return (
          <TableSub
            level={record.level + 1}
            data={record.child}
            menuKey={menuKey}
            parentId={record.id}
          />
        );
      } else {
        return null;
      }
    };
    const rowExpandable = () => {
      return level < MAX_LEVEL;
    };
    return (
      <>
        <ProFormModal
          title={`新增${levelMap[level - 1]}级菜单`}
          field={field}
          initialValues={initialValues}
          onSubmit={onSubmit}
          trigger={
            <Button type="primary" className="menu-table-btn">{`新增${
              levelMap[level - 1]
            }级菜单`}</Button>
          }
          submitAll={true}
        />
        <Table
          bordered
          className="components-table-demo-nested"
          columns={columns}
          expandable={{ expandedRowRender, rowExpandable }}
          dataSource={data}
          pagination={false}
          rowKey="id"
        />
      </>
    );
  };

  const init = async () => {
    const res: any = await call(Service.getMenuConfig);
    setMenus(res.data);
    if (!platform) {
      setPlatform(Object.keys(res.data)[0]);
    }
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <PageContainer className="menu-container" title="菜单配置">
      <Card>
        <Tabs
          size={"small"}
          type="card"
          style={{ marginBottom: 32 }}
          activeKey={platform}
          onChange={setPlatform}
        >
          {Object.keys(menus).map((tab) => {
            return (
              <TabPane tab={tab} key={tab}>
                <Card title="主菜单" extra={<Switch />} bordered>
                  <TableSub
                    data={menus[tab]?.mainMenu}
                    level={1}
                    menuKey={"mainMenu"}
                  />
                </Card>
                <Card title="账号菜单" extra={<Switch />} bordered>
                  <TableSub
                    data={menus[tab]?.accountMenu}
                    level={1}
                    menuKey={"accountMenu"}
                  />
                </Card>
                <Card title="平台设置菜单" extra={<Switch />} bordered>
                  <TableSub
                    data={menus[tab]?.menuManager}
                    level={1}
                    menuKey={"menuManager"}
                  />
                </Card>
              </TabPane>
            );
          })}
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default MenusTable;
