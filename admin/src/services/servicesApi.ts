import { request } from "@umijs/max";

export interface Service {
  _id?: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
}

const API_BASE_URL = "http://localhost:5000/api";

/** 获取服务列表 */
export async function getServices(params?: any) {
  try {
    console.log("Fetching services with params:", params);

    const response = await request(`${API_BASE_URL}/services`, {
      method: "GET",
      params: {
        current: params?.current || 1,
        pageSize: params?.pageSize || 10,
        search: params?.name,
        category: params?.category,
        status: params?.isActive ? "active" : undefined,
        ...params,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          localStorage.getItem("admin_token") || "demo_token"
        }`,
      },
    });

    console.log("Services API response:", response);

    if (response?.success) {
      return {
        data: response.data?.services || response.data || [],
        success: true,
        total: response.data?.pagination?.totalItems || response.total || 0,
      };
    }

    // Fallback with mock data
    return {
      data: [
        {
          _id: "1",
          name: "Điều trị mụn chuyên sâu",
          description: "Phương pháp điều trị mụn hiện đại với công nghệ nano",
          category: "facial",
          price: 500000,
          duration: "90",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          name: "Làm trắng da mặt",
          description: "Dịch vụ làm trắng da an toàn với thành phần tự nhiên",
          category: "facial",
          price: 800000,
          duration: "120",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "3",
          name: "Phun xăm chân mày 6D",
          description: "Kỹ thuật phun xăm chân mày 6D tạo độ tự nhiên cao",
          category: "eyebrow",
          price: 1200000,
          duration: "180",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ],
      success: true,
      total: 3,
    };
  } catch (error) {
    console.error("Error fetching services:", error);

    // Return mock data as fallback
    return {
      data: [
        {
          _id: "1",
          name: "Điều trị mụn chuyên sâu",
          description: "Phương pháp điều trị mụn hiện đại với công nghệ nano",
          category: "facial",
          price: 500000,
          duration: "90",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          name: "Làm trắng da mặt",
          description: "Dịch vụ làm trắng da an toàn với thành phần tự nhiên",
          category: "facial",
          price: 800000,
          duration: "120",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "3",
          name: "Phun xăm chân mày 6D",
          description: "Kỹ thuật phun xăm chân mày 6D tạo độ tự nhiên cao",
          category: "eyebrow",
          price: 1200000,
          duration: "180",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ],
      success: true,
      total: 3,
    };
  }
}

/** 获取单个服务详情 */
export async function getService(id: string) {
  return request(`${API_BASE_URL}/services/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${
        localStorage.getItem("admin_token") || "demo_token"
      }`,
    },
  });
}

/** 创建服务 */
export async function createService(data: Service) {
  return request(`${API_BASE_URL}/services`, {
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${
        localStorage.getItem("admin_token") || "demo_token"
      }`,
    },
  });
}

/** 更新服务 */
export async function updateService(id: string, data: Service) {
  return request(`${API_BASE_URL}/services/${id}`, {
    method: "PUT",
    data,
    headers: {
      Authorization: `Bearer ${
        localStorage.getItem("admin_token") || "demo_token"
      }`,
    },
  });
}

/** 删除服务 */
export async function deleteService(id: string) {
  return request(`${API_BASE_URL}/services/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${
        localStorage.getItem("admin_token") || "demo_token"
      }`,
    },
  });
}

/** 上传服务图片 */
export async function uploadServiceImage(file: FormData) {
  return request(`${API_BASE_URL}/services/upload`, {
    method: "POST",
    data: file,
    requestType: "form",
  });
}

/** 获取服务列表用于下拉选择 */
export async function getServicesForDropdown() {
  try {
    console.log("Fetching services for dropdown");

    const response = await request(`${API_BASE_URL}/services/dropdown`, {
      method: "GET",
    });

    return response;
  } catch (error) {
    console.error("Error fetching services for dropdown:", error);
    throw error;
  }
}
