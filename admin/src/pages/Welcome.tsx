import {
  CalendarOutlined,
  HeartOutlined,
  ShopOutlined,
  StarOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { useModel } from "@umijs/max";
import { Card, Col, Row, theme } from "antd";
import React from "react";

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel("@@initialState");

  return (
    <PageContainer
      title={false}
      style={{
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <div
        style={{
          marginBottom: "32px",
          textAlign: "center",
          background: "rgba(255,255,255,0.95)",
          borderRadius: "16px",
          padding: "32px",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#1976d2",
            marginBottom: "8px",
          }}
        >
          Chào mừng đến với Lisse Beauty Admin
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#666",
            margin: 0,
          }}
        >
          Quản lý spa và chăm sóc khách hàng một cách chuyên nghiệp
        </p>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "12px",
              textAlign: "center",
              background: "linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)",
              color: "#fff",
              border: "none",
            }}
          >
            <ShopOutlined style={{ fontSize: "32px", marginBottom: "12px" }} />
            <h3>12</h3>
            <p>Tổng số dịch vụ</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "12px",
              textAlign: "center",
              background: "linear-gradient(135deg, #42a5f5 0%, #90caf9 100%)",
              color: "#fff",
              border: "none",
            }}
          >
            <HeartOutlined style={{ fontSize: "32px", marginBottom: "12px" }} />
            <h3>8</h3>
            <p>Câu chuyện khách hàng</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "12px",
              textAlign: "center",
              background: "linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)",
              color: "#fff",
              border: "none",
            }}
          >
            <CalendarOutlined
              style={{ fontSize: "32px", marginBottom: "12px" }}
            />
            <h3>45</h3>
            <p>Lịch hẹn tháng này</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "12px",
              textAlign: "center",
              background: "linear-gradient(135deg, #64b5f6 0%, #e3f2fd 100%)",
              color: "#1976d2",
              border: "none",
            }}
          >
            <StarOutlined style={{ fontSize: "32px", marginBottom: "12px" }} />
            <h3>95%</h3>
            <p>Độ hài lòng</p>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TrophyOutlined style={{ color: "#1976d2" }} />
            <span style={{ color: "#1976d2" }}>Hoạt động gần đây</span>
          </div>
        }
        style={{
          borderRadius: "12px",
          border: "none",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{ textAlign: "center", padding: "40px 0", color: "#1976d2" }}
        >
          <UserOutlined
            style={{ fontSize: "48px", marginBottom: "16px", color: "#64b5f6" }}
          />
          <p style={{ color: "#1976d2", fontSize: "16px" }}>
            Chưa có hoạt động nào. Bắt đầu quản lý spa của bạn ngay!
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
