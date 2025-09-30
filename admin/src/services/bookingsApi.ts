import { request } from "@umijs/max";

export interface Booking {
  _id?: string;
  bookingId?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  specialRequests?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = "http://localhost:5000/api";

/** 获取预约列表 */
export async function getBookings(params?: any) {
  return request(`${API_BASE_URL}/bookings`, {
    method: "GET",
    params,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
  });
}

/** 获取单个预约详情 */
export async function getBooking(id: string) {
  return request(`${API_BASE_URL}/admin/bookings/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
  });
}

/** 创建预约 */
export async function createBooking(data: Booking) {
  return request(`${API_BASE_URL}/bookings`, {
    method: "POST",
    data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
  });
}

/** 更新预约 */
export async function updateBooking(id: string, data: Booking) {
  return request(`${API_BASE_URL}/bookings/${id}`, {
    method: "PUT",
    data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
  });
}

/** 删除预约 */
export async function deleteBooking(id: string) {
  return request(`${API_BASE_URL}/bookings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
  });
}

/** 更新预约状态 */
export async function updateBookingStatus(
  id: string,
  data: { status: string }
) {
  return request(`${API_BASE_URL}/bookings/${id}/status`, {
    method: "PATCH",
    data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
  });
}
export async function completeBooking(id: string) {
  return request(`${API_BASE_URL}/bookings/${id}/complete`, {
    method: "PUT",
  });
}
