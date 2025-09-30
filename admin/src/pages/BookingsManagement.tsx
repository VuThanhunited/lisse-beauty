import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBooking,
} from "@/services/bookingsApi";
import { getServicesForDropdown } from "@/services/servicesApi";
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PhoneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  ModalForm,
  PageContainer,
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import { Badge, Button, Descriptions, message, Modal, Tag } from "antd";
import moment from "dayjs";
import React, { useEffect, useRef, useState } from "react";

// CSS styles cho responsive
const styles = `
  .bookings-table .ant-table-tbody > tr > td {
    padding: 8px 4px !important;
  }
  
  .bookings-table .ant-table-thead > tr > th {
    padding: 8px 4px !important;
    font-size: 12px;
  }

  @media (max-width: 768px) {
    .bookings-table .ant-table-tbody > tr > td {
      padding: 6px 2px !important;
      font-size: 12px;
    }
    
    .bookings-table .ant-btn {
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

interface Booking {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: string;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
  notes?: string;
  createdAt: string;
}

const BookingsManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [serviceOptions, setServiceOptions] = useState<any[]>([]);

  // Load services for dropdown
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await getServicesForDropdown();
        if (response.success) {
          setServiceOptions(response.data);
        }
      } catch (error) {
        console.error("Error loading services:", error);
      }
    };
    loadServices();
  }, []);

  // Mock data - sẽ được thay thế bằng API thực
  const mockBookings: Booking[] = [
    {
      _id: "1",
      customerName: "Nguyễn Thị Lan",
      customerPhone: "0901234567",
      customerEmail: "lan.nguyen@email.com",
      serviceName: "Chăm sóc da mặt cơ bản",
      appointmentDate: "2024-02-15",
      appointmentTime: "14:00",
      duration: "60 phút",
      price: 300000,
      status: "confirmed",
      notes: "Khách hàng có da nhạy cảm",
      createdAt: "2024-02-10",
    },
    {
      _id: "2",
      customerName: "Trần Minh Anh",
      customerPhone: "0912345678",
      customerEmail: "anh.tran@email.com",
      serviceName: "Massage toàn thân thư giãn",
      appointmentDate: "2024-02-16",
      appointmentTime: "10:00",
      duration: "90 phút",
      price: 500000,
      status: "pending",
      notes: "",
      createdAt: "2024-02-11",
    },
    {
      _id: "3",
      customerName: "Lê Thị Mai",
      customerPhone: "0923456789",
      customerEmail: "mai.le@email.com",
      serviceName: "Điều trị mụn chuyên sâu",
      appointmentDate: "2024-02-14",
      appointmentTime: "16:00",
      duration: "120 phút",
      price: 800000,
      status: "completed",
      notes: "Đã hoàn thành điều trị",
      createdAt: "2024-02-05",
    },
    {
      _id: "4",
      customerName: "Phạm Văn Nam",
      customerPhone: "0934567890",
      serviceName: "Chăm sóc da mặt cơ bản",
      appointmentDate: "2024-02-13",
      appointmentTime: "15:00",
      duration: "60 phút",
      price: 300000,
      status: "cancelled",
      notes: "Khách hủy do bận việc đột xuất",
      createdAt: "2024-02-08",
    },
  ];

  const statusColors = {
    pending: "orange",
    confirmed: "blue",
    completed: "green",
    cancelled: "red",
    "no-show": "gray",
  };

  const statusTexts = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    "no-show": "Không đến",
  };

  const columns: ProColumns<Booking>[] = [
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 130,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: "13px" }}>
            {record.customerName}
          </div>
          <div style={{ fontSize: "11px", color: "#666" }}>
            <PhoneOutlined /> {record.customerPhone}
          </div>
        </div>
      ),
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Ngày hẹn",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      width: 100,
      valueType: "date",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: "12px" }}>
            {moment(record.appointmentDate).format("DD/MM/YYYY")}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.appointmentTime}
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      width: 80,
      search: false,
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      valueType: "select",
      valueEnum: {
        pending: { text: "Chờ xác nhận", status: "Warning" },
        confirmed: { text: "Đã xác nhận", status: "Processing" },
        completed: { text: "Hoàn thành", status: "Success" },
        cancelled: { text: "Đã hủy", status: "Error" },
      },
      render: (_, record) => (
        <Tag color={statusColors[record.status]}>
          {statusTexts[record.status]}
        </Tag>
      ),
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
      render: (_, record) =>
        [
          <Button
            key="view"
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedBooking(record);
              setViewModalVisible(true);
            }}
          />,
          <Button
            key="edit"
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedBooking(record);
              setModalVisible(true);
            }}
          />,
          record.status === "pending" && (
            <Button
              key="confirm"
              type="link"
              size="small"
              style={{ color: "#52c41a" }}
              onClick={() => {
                Modal.confirm({
                  title: "Xác nhận đặt lịch",
                  content: `Xác nhận đặt lịch cho khách hàng "${record.customerName}"?`,
                  okText: "Xác nhận",
                  cancelText: "Hủy",
                  onOk: () => {
                    message.success("Đã xác nhận đặt lịch!");
                    actionRef.current?.reload();
                  },
                });
              }}
            >
              ✓
            </Button>
          ),
          <Button
            key="delete"
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Hủy đặt lịch",
                content: `Bạn có chắc muốn hủy đặt lịch của "${record.customerName}"?`,
                okText: "Hủy lịch",
                cancelText: "Không",
                okType: "danger",
                onOk: async () => {
                  try {
                    await deleteBooking(record._id);
                    message.success("Đã hủy đặt lịch!");
                    actionRef.current?.reload();
                  } catch (error) {
                    console.error("Error deleting booking:", error);
                    message.error("Có lỗi xảy ra khi hủy đặt lịch!");
                  }
                },
              });
            }}
          />,
        ].filter(Boolean),
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      console.log("Submitting booking:", values);

      // Format datetime
      const appointmentDateTime = moment(values.appointmentDateTime);
      const appointmentDate = appointmentDateTime.format("YYYY-MM-DD");
      const appointmentTime = appointmentDateTime.format("HH:mm");

      // Prepare booking data as JSON
      const bookingData = {
        customerInfo: {
          name: values.customerName,
          email: values.customerEmail || "",
          phone: values.customerPhone,
          age: values.age || 25,
          gender: values.gender || "other",
        },
        serviceId: values.serviceId, // Use the selected service ID
        appointmentDate,
        appointmentTime,
        duration: parseInt(values.duration?.replace(/\D/g, "")) || 60,
        price: parseInt(values.price?.toString().replace(/\D/g, "")) || 300000,
        specialRequests: values.notes || "",
        status: values.status || "pending",
      };

      if (selectedBooking) {
        // Update existing booking
        await updateBooking(selectedBooking._id, bookingData);
        message.success("Cập nhật đặt lịch thành công!");
      } else {
        // Create new booking
        await createBooking(bookingData);
        message.success("Thêm đặt lịch thành công!");
      }

      setModalVisible(false);
      setSelectedBooking(null);
      actionRef.current?.reload();
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      const errorMessage = error?.response?.data?.message || "Có lỗi xảy ra!";
      message.error(errorMessage);
    }
  };

  return (
    <PageContainer
      title="Quản lý đặt lịch"
      content="Quản lý tất cả các cuộc hẹn và đặt lịch của khách hàng"
    >
      <ProTable<Booking>
        className="bookings-table"
        headerTitle="Danh sách đặt lịch"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: "auto",
        }}
        scroll={{ x: 1100 }}
        size="small"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedBooking(null);
              setModalVisible(true);
            }}
          >
            Thêm đặt lịch
          </Button>,
        ]}
        request={async (params) => {
          try {
            console.log("Request params:", params);

            // Call real API
            const response = await getBookings({
              page: params.current || 1,
              pageSize: params.pageSize || 10,
              search: params.customerName || "",
              status: params.status || "",
              sortBy: "createdAt",
              sortOrder: "desc",
            });

            if (response.success) {
              return {
                data: response.data.bookings.map((booking: any) => ({
                  _id: booking._id,
                  customerName: booking.customerInfo?.name || "N/A",
                  customerPhone: booking.customerInfo?.phone || "N/A",
                  customerEmail: booking.customerInfo?.email || "N/A",
                  serviceName: booking.serviceId?.name || "N/A",
                  appointmentDate: booking.appointmentDate,
                  appointmentTime: booking.appointmentTime,
                  duration: `${booking.duration} phút`,
                  price: booking.price,
                  status: booking.status,
                  notes: booking.specialRequests || "",
                  createdAt: booking.createdAt,
                })),
                success: true,
                total: response.data.pagination?.totalItems || 0,
              };
            }

            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error) {
            console.error("Error fetching bookings:", error);
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

      {/* Modal thêm/sửa đặt lịch */}
      <ModalForm
        title={selectedBooking ? "Cập nhật đặt lịch" : "Thêm đặt lịch mới"}
        open={modalVisible}
        onOpenChange={setModalVisible}
        onFinish={handleSubmit}
        width={600}
        initialValues={
          selectedBooking
            ? {
                customerName: selectedBooking.customerName,
                customerPhone: selectedBooking.customerPhone,
                customerEmail: selectedBooking.customerEmail,
                serviceId: selectedBooking.serviceName, // This will need to be mapped to actual serviceId
                appointmentDateTime: moment(
                  `${selectedBooking.appointmentDate} ${selectedBooking.appointmentTime}`,
                  "YYYY-MM-DD HH:mm"
                ),
                duration: selectedBooking.duration,
                price: selectedBooking.price,
                status: selectedBooking.status,
                notes: selectedBooking.notes,
              }
            : {}
        }
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
            width="md"
          />
          <ProFormText
            name="customerPhone"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
            width="md"
          />
        </ProForm.Group>

        <ProFormText
          name="customerEmail"
          label="Email"
          placeholder="Nhập email (không bắt buộc)"
          width="lg"
        />

        <ProFormSelect
          name="serviceId"
          label="Dịch vụ"
          placeholder="Chọn dịch vụ"
          options={serviceOptions}
          rules={[{ required: true, message: "Vui lòng chọn dịch vụ!" }]}
          width="lg"
          showSearch
          fieldProps={{
            filterOption: (input: string, option: any) =>
              option?.label?.toLowerCase().includes(input.toLowerCase()),
          }}
        />

        <ProForm.Group>
          <ProFormDateTimePicker
            name="appointmentDateTime"
            label="Ngày và giờ hẹn"
            rules={[
              { required: true, message: "Vui lòng chọn ngày và giờ hẹn!" },
            ]}
            width="md"
          />
          <ProFormText
            name="duration"
            label="Thời gian"
            placeholder="VD: 60 phút"
            rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
            width="sm"
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText
            name="price"
            label="Giá (VNĐ)"
            placeholder="VD: 300000"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            width="md"
          />
          <ProFormSelect
            name="status"
            label="Trạng thái"
            options={[
              { label: "Chờ xác nhận", value: "pending" },
              { label: "Đã xác nhận", value: "confirmed" },
              { label: "Hoàn thành", value: "completed" },
              { label: "Đã hủy", value: "cancelled" },
            ]}
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            width="md"
          />
        </ProForm.Group>

        <ProFormTextArea
          name="notes"
          label="Ghi chú"
          placeholder="Nhập ghi chú (không bắt buộc)"
          fieldProps={{
            rows: 3,
          }}
        />
      </ModalForm>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết đặt lịch"
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
        {selectedBooking && (
          <div>
            <Descriptions
              bordered
              column={2}
              labelStyle={{ fontWeight: "bold" }}
            >
              <Descriptions.Item label="Khách hàng" span={2}>
                <div style={{ fontSize: "16px", fontWeight: 500 }}>
                  {selectedBooking.customerName}
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Số điện thoại">
                <PhoneOutlined /> {selectedBooking.customerPhone}
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                {selectedBooking.customerEmail || "Không có"}
              </Descriptions.Item>

              <Descriptions.Item label="Dịch vụ" span={2}>
                <Tag
                  color="blue"
                  style={{ fontSize: "14px", padding: "4px 12px" }}
                >
                  {selectedBooking.serviceName}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày hẹn">
                <CalendarOutlined />{" "}
                {moment(selectedBooking.appointmentDate).format("DD/MM/YYYY")}
              </Descriptions.Item>

              <Descriptions.Item label="Giờ hẹn">
                {selectedBooking.appointmentTime}
              </Descriptions.Item>

              <Descriptions.Item label="Thời gian">
                {selectedBooking.duration}
              </Descriptions.Item>

              <Descriptions.Item label="Giá">
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#1890ff",
                  }}
                >
                  {selectedBooking.price.toLocaleString("vi-VN")} ₫
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái" span={2}>
                <Badge
                  status={
                    selectedBooking.status === "completed"
                      ? "success"
                      : selectedBooking.status === "confirmed"
                      ? "processing"
                      : selectedBooking.status === "pending"
                      ? "warning"
                      : "error"
                  }
                  text={statusTexts[selectedBooking.status]}
                />
              </Descriptions.Item>

              {selectedBooking.notes && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  <div
                    style={{
                      background: "#f5f5f5",
                      padding: "12px",
                      borderRadius: "6px",
                      fontStyle: "italic",
                    }}
                  >
                    {selectedBooking.notes}
                  </div>
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Ngày tạo" span={2}>
                {moment(selectedBooking.createdAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default BookingsManagement;
