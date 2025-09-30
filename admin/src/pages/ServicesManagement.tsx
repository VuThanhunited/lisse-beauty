import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  ModalForm,
  PageContainer,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, Image, message, Modal, Tag } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import React, { useRef, useState } from "react";
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from "../services/servicesApi";

// CSS styles cho responsive
const styles = `
  .services-table .ant-table-tbody > tr > td {
    padding: 8px 4px !important;
  }
  
  .services-table .ant-table-thead > tr > th {
    padding: 8px 4px !important;
    font-size: 12px;
  }

  @media (max-width: 768px) {
    .services-table .ant-table-tbody > tr > td {
      padding: 6px 2px !important;
      font-size: 12px;
    }
    
    .services-table .ant-btn {
      padding: 2px 6px;
      font-size: 11px;
    }
  }
`;

// Inject CSS
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
}

const ServicesManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Các danh mục dịch vụ
  const serviceCategories = [
    "Chăm sóc da",
    "Massage",
    "Điều trị",
    "Làm đẹp",
    "Thể hình",
    "Thư giãn",
  ];

  const columns: ProColumns<Service>[] = [
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      copyable: true,
      ellipsis: true,
      width: 180,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 200,
      search: false,
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 100,
      valueType: "select",
      valueEnum: {
        "Chăm sóc da": { text: "Chăm sóc da" },
        Massage: { text: "Massage" },
        "Điều trị": { text: "Điều trị" },
        "Làm đẹp": { text: "Làm đẹp" },
        "Thể hình": { text: "Thể hình" },
        "Thư giãn": { text: "Thư giãn" },
      },
      render: (_, record) => <Tag color="blue">{record.category}</Tag>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (_, record) => (
        <span style={{ fontWeight: "bold", color: "#1890ff" }}>
          {record.price.toLocaleString("vi-VN")} ₫
        </span>
      ),
      search: false,
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      width: 80,
      search: false,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 90,
      valueType: "select",
      valueEnum: {
        true: { text: "Hoạt động", status: "Success" },
        false: { text: "Tạm dừng", status: "Error" },
      },
    },
    {
      title: "Thao tác",
      valueType: "option",
      width: 120,
      render: (_, record) => [
        <Button
          key="view"
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedService(record);
            setViewModalVisible(true);
          }}
        />,
        <Button
          key="edit"
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedService(record);
            setModalVisible(true);
          }}
        />,
        <Button
          key="delete"
          type="link"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              title: "Xóa dịch vụ",
              content: `Bạn có chắc muốn xóa dịch vụ "${record.name}"?`,
              okText: "Xóa",
              cancelText: "Hủy",
              okType: "danger",
              onOk: () => handleDelete(record),
            });
          }}
        />,
      ],
    },
  ];

  // Xóa dịch vụ
  const handleDelete = async (service: Service) => {
    try {
      setLoading(true);
      await deleteService(service._id);
      message.success("Xóa dịch vụ thành công!");
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(error?.message || "Xóa dịch vụ thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Xóa nhiều dịch vụ
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn dịch vụ cần xóa!");
      return;
    }

    Modal.confirm({
      title: "Xóa nhiều dịch vụ",
      content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} dịch vụ đã chọn?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          setLoading(true);
          // Gọi API xóa nhiều (nếu có) hoặc xóa từng cái
          await Promise.all(selectedRowKeys.map((id) => deleteService(id)));
          message.success("Xóa các dịch vụ thành công!");
          setSelectedRowKeys([]);
          actionRef.current?.reload();
        } catch (error: any) {
          message.error(error?.message || "Xóa các dịch vụ thất bại!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const serviceData = {
        ...values,
        price: Number(values.price),
        isActive: values.isActive ?? true,
      };

      if (selectedService) {
        // Cập nhật dịch vụ
        await updateService(selectedService._id, serviceData);
        message.success("Cập nhật dịch vụ thành công!");
      } else {
        // Thêm dịch vụ mới
        await createService(serviceData);
        message.success("Thêm dịch vụ thành công!");
      }

      setModalVisible(false);
      setSelectedService(null);
      setFileList([]);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(
        error?.message ||
          (selectedService
            ? "Cập nhật dịch vụ thất bại!"
            : "Thêm dịch vụ thất bại!")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Quản lý dịch vụ"
      content="Quản lý tất cả các dịch vụ spa và làm đẹp"
    >
      <ProTable<Service>
        className="services-table"
        headerTitle="Danh sách dịch vụ"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: "auto",
        }}
        scroll={{ x: 900 }}
        size="small"
        toolBarRender={() =>
          [
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedService(null);
                setFileList([]);
                setModalVisible(true);
              }}
            >
              Thêm dịch vụ
            </Button>,
            selectedRowKeys.length > 0 && (
              <Button
                key="batchDelete"
                danger
                icon={<DeleteOutlined />}
                onClick={handleBatchDelete}
              >
                Xóa đã chọn ({selectedRowKeys.length})
              </Button>
            ),
          ].filter(Boolean)
        }
        request={async (params, sort, filter) => {
          try {
            setLoading(true);
            const response = await getServices({
              current: params.current,
              pageSize: params.pageSize,
              name: params.name,
              category: params.category,
              isActive: params.isActive,
            });

            return {
              data: response.data || [],
              success: true,
              total: response.total || 0,
            };
          } catch (error) {
            message.error("Lấy danh sách dịch vụ thất bại!");
            return {
              data: [],
              success: false,
              total: 0,
            };
          } finally {
            setLoading(false);
          }
        }}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys, selectedRows) => {
            setSelectedRowKeys(keys as string[]);
          },
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 10,
        }}
        options={{
          density: false,
          fullScreen: true,
          setting: true,
        }}
      />

      {/* Modal thêm/sửa dịch vụ */}
      <ModalForm
        title={selectedService ? "Cập nhật dịch vụ" : "Thêm dịch vụ mới"}
        open={modalVisible}
        onOpenChange={setModalVisible}
        onFinish={handleSubmit}
        width={600}
        initialValues={selectedService || {}}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProForm.Group>
          <ProFormText
            name="name"
            label="Tên dịch vụ"
            placeholder="Nhập tên dịch vụ"
            rules={[
              { required: true, message: "Vui lòng nhập tên dịch vụ!" },
              { min: 5, message: "Tên dịch vụ phải ít nhất 5 ký tự!" },
              { max: 100, message: "Tên dịch vụ không quá 100 ký tự!" },
            ]}
            width="lg"
          />
          <ProFormSelect
            name="category"
            label="Danh mục"
            placeholder="Chọn danh mục"
            options={serviceCategories.map((cat) => ({
              label: cat,
              value: cat,
            }))}
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            width="md"
          />
        </ProForm.Group>

        <ProFormTextArea
          name="description"
          label="Mô tả"
          placeholder="Nhập mô tả chi tiết về dịch vụ"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả!" },
            { min: 10, message: "Mô tả phải ít nhất 10 ký tự!" },
            { max: 500, message: "Mô tả không quá 500 ký tự!" },
          ]}
          fieldProps={{
            rows: 4,
            showCount: true,
            maxLength: 500,
          }}
        />

        <ProForm.Group>
          <ProFormDigit
            name="price"
            label="Giá (VNĐ)"
            placeholder="0"
            rules={[
              { required: true, message: "Vui lòng nhập giá!" },
              {
                validator: (_: any, value: number) => {
                  if (value && value < 10000) {
                    return Promise.reject("Giá phải ít nhất 10,000 VNĐ!");
                  }
                  if (value && value > 50000000) {
                    return Promise.reject("Giá không quá 50,000,000 VNĐ!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            fieldProps={{
              formatter: (value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              parser: (value) => Number(value!.replace(/\$\s?|(,*)/g, "")),
            }}
            width="md"
          />
          <ProFormText
            name="duration"
            label="Thời gian"
            placeholder="VD: 60 phút"
            rules={[
              { required: true, message: "Vui lòng nhập thời gian!" },
              {
                pattern: /^\d+\s*(phút|giờ|h)$/i,
                message: "Ví dụ: '60 phút' hoặc '1.5 giờ'",
              },
            ]}
            width="md"
          />
        </ProForm.Group>

        <ProFormSwitch
          name="isActive"
          label="Trạng thái hoạt động"
          tooltip="Bật để hiển thị dịch vụ trên website"
          initialValue={true}
        />
      </ModalForm>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết dịch vụ"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setViewModalVisible(false);
              setModalVisible(true);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={700}
      >
        {selectedService && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <Image
                width={200}
                height={150}
                src={selectedService.image || "/placeholder-service.jpg"}
                style={{ objectFit: "cover", borderRadius: "8px" }}
                fallback="/placeholder-service.jpg"
              />
            </div>

            <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
              <p>
                <strong>Tên dịch vụ:</strong> {selectedService.name}
              </p>
              <p>
                <strong>Danh mục:</strong>{" "}
                <Tag color="blue">{selectedService.category}</Tag>
              </p>
              <p>
                <strong>Giá:</strong>{" "}
                <span style={{ color: "#1890ff", fontWeight: "bold" }}>
                  {selectedService.price.toLocaleString("vi-VN")} ₫
                </span>
              </p>
              <p>
                <strong>Thời gian:</strong> {selectedService.duration}
              </p>
              <p>
                <strong>Mô tả:</strong>
              </p>
              <div
                style={{
                  background: "#f5f5f5",
                  padding: "12px",
                  borderRadius: "6px",
                }}
              >
                {selectedService.description}
              </div>
              <p>
                <strong>Trạng thái:</strong>
                <Tag color={selectedService.isActive ? "green" : "red"}>
                  {selectedService.isActive ? "Hoạt động" : "Tạm dừng"}
                </Tag>
              </p>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default ServicesManagement;
