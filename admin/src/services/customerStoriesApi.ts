import { request } from "@umijs/max";

export interface CustomerStory {
  _id?: string;
  customerName: string;
  rating: number;
  story: string;
  treatment: string;
  beforeImage?: string;
  afterImage?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = "http://localhost:5000/api";

/** 获取客户故事列表 */
export async function getCustomerStories(params?: any) {
  return request(`${API_BASE_URL}/customer-stories`, {
    method: "GET",
    params,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
  });
}

/** 获取单个客户故事详情 */
export async function getCustomerStory(id: string) {
  return request(`${API_BASE_URL}/customer-stories/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
  });
}

/** 创建客户故事 */
export async function createCustomerStory(data: FormData) {
  return request(`${API_BASE_URL}/customer-stories`, {
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
  });
}

/** 更新客户故事 */
export async function updateCustomerStory(id: string, data: FormData) {
  return request(`${API_BASE_URL}/customer-stories/${id}`, {
    method: "PUT",
    data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
  });
}

/** 删除客户故事 */
export async function deleteCustomerStory(id: string) {
  return request(`${API_BASE_URL}/customer-stories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
  });
}

/** 切换客户故事状态 */
export async function toggleCustomerStoryStatus(id: string) {
  return request(`${API_BASE_URL}/customer-stories/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
  });
}

/** 上传客户故事图片 */
export async function uploadCustomerStoryImage(file: FormData) {
  return request(`${API_BASE_URL}/customer-stories/upload`, {
    method: "POST",
    data: file,
    requestType: "form",
  });
}
