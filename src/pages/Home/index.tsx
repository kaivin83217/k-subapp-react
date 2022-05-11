import React from "react";
import { PageContainer } from "@ant-design/pro-layout";
import { Card } from "antd";
import amisJson from "./amisJson.json";
import "./index.less";

export default function Home() {
  return (
    <div className="home-container">
      <PageContainer title="首页配置">
        {/* <Card>{render(amisJson)}</Card> */}
        <Card>amis1</Card>
      </PageContainer>
    </div>
  );
}
