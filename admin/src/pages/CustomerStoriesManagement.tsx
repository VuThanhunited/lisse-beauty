import {
  createCustomerStory,
  deleteCustomerStory,
  getCustomerStories,
  updateCustomerStory,
} from "@/services/customerStoriesApi";
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
  ProFormRate,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import { Button, Card, Image, message, Modal, Tag, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import React, { useRef, useState } from "react";

// CSS styles cho responsive
const styles = `
  .customer-stories-table .ant-table-tbody > tr > td {
    padding: 8px 4px !important;
  }
  
  .customer-stories-table .ant-table-thead > tr > th {
    padding: 8px 4px !important;
    font-size: 12px;
  }

  @media (max-width: 768px) {
    .customer-stories-table .ant-table-tbody > tr > td {
      padding: 6px 2px !important;
      font-size: 12px;
    }
    
    .customer-stories-table .ant-btn {
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

interface CustomerStory {
  _id: string;
  customerName: string;
  rating: number;
  story: string;
  beforeImage?: string;
  afterImage?: string;
  treatment: string;
  isPublished: boolean;
  createdAt: string;
}

const CustomerStoriesManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [selectedStory, setSelectedStory] = useState<CustomerStory | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [beforeFileList, setBeforeFileList] = useState<UploadFile[]>([]);
  const [afterFileList, setAfterFileList] = useState<UploadFile[]>([]);

  const columns: ProColumns<CustomerStory>[] = [
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Điều trị",
      dataIndex: "treatment",
      key: "treatment",
      width: 150,
      render: (_, record) => <Tag color="green">{record.treatment}</Tag>,
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {"★".repeat(record.rating)}
          {"☆".repeat(5 - record.rating)}
          <span style={{ marginLeft: "6px", color: "#666", fontSize: "12px" }}>
            ({record.rating}/5)
          </span>
        </div>
      ),
      search: false,
    },
    {
      title: "Nhận xét",
      dataIndex: "story",
      key: "story",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Trạng thái",
      dataIndex: "isPublished",
      key: "isPublished",
      width: 90,
      valueType: "select",
      valueEnum: {
        true: { text: "Hiển thị", status: "Success" },
        false: { text: "Ẩn", status: "Error" },
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      valueType: "date",
      search: false,
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
            setSelectedStory(record);
            setViewModalVisible(true);
          }}
        />,
        <Button
          key="edit"
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedStory(record);
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
              title: "Xóa câu chuyện khách hàng",
              content: `Bạn có chắc muốn xóa câu chuyện của "${record.customerName}"?`,
              okText: "Xóa",
              cancelText: "Hủy",
              okType: "danger",
              onOk: async () => {
                try {
                  await deleteCustomerStory(record._id);
                  message.success("Xóa câu chuyện thành công!");
                  actionRef.current?.reload();
                } catch (error) {
                  console.error("Error deleting customer story:", error);
                  message.error("Có lỗi xảy ra khi xóa câu chuyện!");
                }
              },
            });
          }}
        />,
      ],
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("customerName", values.customerName);
      formData.append("story", values.story);
      formData.append("rating", values.rating.toString());
      formData.append("treatment", values.treatment);
      formData.append("isPublished", "true");

      // Add images if uploaded
      if (beforeFileList.length > 0 && beforeFileList[0].originFileObj) {
        formData.append("beforeImage", beforeFileList[0].originFileObj);
      }
      if (afterFileList.length > 0 && afterFileList[0].originFileObj) {
        formData.append("afterImage", afterFileList[0].originFileObj);
      }

      if (selectedStory) {
        // Update existing story
        await updateCustomerStory(selectedStory._id, formData);
        message.success("Cập nhật câu chuyện thành công!");
      } else {
        // Create new story
        await createCustomerStory(formData);
        message.success("Thêm câu chuyện thành công!");
      }

      setModalVisible(false);
      setSelectedStory(null);
      setBeforeFileList([]);
      setAfterFileList([]);
      actionRef.current?.reload();
    } catch (error) {
      console.error("Error submitting customer story:", error);
      message.error("Có lỗi xảy ra khi lưu câu chuyện!");
    }
  };

  const beforeUploadProps = {
    name: "beforeImage",
    listType: "picture-card" as const,
    fileList: beforeFileList,
    maxCount: 1,
    beforeUpload: () => false, // Prevent auto upload
    onChange: ({ fileList }: { fileList: UploadFile[] }) => {
      setBeforeFileList(fileList);
    },
  };

  const afterUploadProps = {
    name: "afterImage",
    listType: "picture-card" as const,
    fileList: afterFileList,
    maxCount: 1,
    beforeUpload: () => false, // Prevent auto upload
    onChange: ({ fileList }: { fileList: UploadFile[] }) => {
      setAfterFileList(fileList);
    },
  };

  return (
    <PageContainer
      title="Quản lý câu chuyện khách hàng"
      content="Quản lý testimonials và hình ảnh before/after của khách hàng"
    >
      <ProTable<CustomerStory>
        className="customer-stories-table"
        headerTitle="Danh sách câu chuyện khách hàng"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: "auto",
        }}
        scroll={{ x: 1000 }}
        size="small"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedStory(null);
              setBeforeFileList([]);
              setAfterFileList([]);
              setModalVisible(true);
            }}
          >
            Thêm câu chuyện
          </Button>,
        ]}
        request={async (params) => {
          try {
            console.log("Fetching customer stories with params:", params);

            const response = await getCustomerStories({
              page: params.current || 1,
              pageSize: params.pageSize || 10,
              search: params.keyword,
            });

            console.log("Customer stories response:", response);

            if (response.success) {
              return {
                data: response.data.stories || [],
                success: true,
                total: response.data.pagination?.totalItems || 0,
              };
            } else {
              message.error("Không thể tải danh sách câu chuyện");
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
          } catch (error) {
            console.error("Error fetching customer stories:", error);
            message.error("Lỗi khi tải danh sách câu chuyện");
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
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

      {/* Modal thêm/sửa câu chuyện */}
      <ModalForm
        title={selectedStory ? "Cập nhật câu chuyện" : "Thêm câu chuyện mới"}
        open={modalVisible}
        onOpenChange={setModalVisible}
        onFinish={handleSubmit}
        width={800}
        initialValues={selectedStory || {}}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProForm.Group>
          <ProFormText
            name="customerName"
            label="Tên khách hàng"
            placeholder="Nhập tên khách hàng"
            rules={[
              { required: true, message: "Vui lòng nhập tên khách hàng!" },
            ]}
            width="lg"
          />
          <ProFormText
            name="treatment"
            label="Điều trị/Dịch vụ"
            placeholder="Nhập tên dịch vụ"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
            width="lg"
          />
        </ProForm.Group>

        <ProFormRate
          name="rating"
          label="Đánh giá"
          rules={[{ required: true, message: "Vui lòng chọn đánh giá!" }]}
        />

        <ProFormTextArea
          name="story"
          label="Nhận xét"
          placeholder="Nhập nhận xét của khách hàng"
          rules={[{ required: true, message: "Vui lòng nhập nhận xét!" }]}
          fieldProps={{
            rows: 4,
          }}
        />

        <div style={{ marginBottom: "24px" }}>
          <h4>Hình ảnh Before/After</h4>
          <div style={{ display: "flex", gap: "24px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Hình trước điều trị
              </label>
              <Upload {...beforeUploadProps}>
                {beforeFileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Hình sau điều trị
              </label>
              <Upload {...afterUploadProps}>
                {afterFileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>
          </div>
        </div>
      </ModalForm>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết câu chuyện khách hàng"
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
        width={800}
      >
        {selectedStory && (
          <div>
            <Card style={{ marginBottom: "16px" }}>
              <div style={{ textAlign: "center" }}>
                <h3>{selectedStory.customerName}</h3>
                <div style={{ marginBottom: "16px" }}>
                  <span style={{ fontSize: "24px", color: "#faad14" }}>
                    {"★".repeat(selectedStory.rating)}
                  </span>
                  <span style={{ fontSize: "24px", color: "#d9d9d9" }}>
                    {"★".repeat(5 - selectedStory.rating)}
                  </span>
                  <div style={{ color: "#666", marginTop: "4px" }}>
                    {selectedStory.rating}/5 sao
                  </div>
                </div>
                <Tag
                  color="green"
                  style={{ fontSize: "14px", padding: "4px 12px" }}
                >
                  {selectedStory.treatment}
                </Tag>
              </div>
            </Card>

            <div style={{ marginBottom: "20px" }}>
              <h4>Hình ảnh Before/After</h4>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "8px", fontWeight: 500 }}>
                    Trước
                  </div>
                  <Image
                    width={200}
                    height={150}
                    src={selectedStory.beforeImage || "/placeholder-before.jpg"}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                    fallback="/placeholder-before.jpg"
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "8px", fontWeight: 500 }}>
                    Sau
                  </div>
                  <Image
                    width={200}
                    height={150}
                    src={selectedStory.afterImage || "/placeholder-after.jpg"}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                    fallback="/placeholder-after.jpg"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4>Nhận xét</h4>
              <div
                style={{
                  background: "#f5f5f5",
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  fontStyle: "italic",
                }}
              >
                "{selectedStory.story}"
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default CustomerStoriesManagement;
