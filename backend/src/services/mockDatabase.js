// Mock database service for testing when MongoDB is not available
const mockServices = [
  {
    _id: "1",
    name: "Glowing Brow",
    description:
      "Glowing Brow là gì? Giải pháp chân mày tự nhiên, nhẹ nhàng, sắc nét không lộ dấu phun xăm",
    images: ["/uploads/glowing-brow.jpg"],
    price: 500000,
    duration: 90,
    category: "brow",
    slug: "glowing-brow",
    logo: "/uploads/logo.jpg",
  },
  {
    _id: "2",
    name: "Hairstroke",
    description: "Tạo sợi Hairstroke – Công nghệ chân mày tự nhiên như thật",
    images: ["/uploads/hairstroke.jpg"],
    price: 600000,
    duration: 120,
    category: "brow",
    slug: "hairstroke",
  },
  {
    _id: "3",
    name: "Sketch Lips",
    description: "Phun môi tự nhiên với công nghệ Sketch Lips hiện đại",
    images: ["/uploads/sketch-lips.jpg"],
    price: 800000,
    duration: 150,
    category: "lips",
    slug: "sketch-lips",
  },
];

const mockFeedbacks = [
  {
    _id: "1",
    customerName: "Nguyễn Thuỷ Tiên",
    rating: 5,
    comment: "Dịch vụ tốt, quá trình làm không đau, kết quả rất ưng ý!",
    service: "1",
    date: new Date("2024-06-04"),
    status: "approved",
  },
  {
    _id: "2",
    customerName: "Trần Minh Anh",
    rating: 5,
    comment:
      "Chị em ở đây rất tận tâm, kỹ thuật cao, làm xong mình rất hài lòng.",
    service: "1",
    date: new Date("2024-06-02"),
    status: "approved",
  },
];

const mockCustomerStories = [
  {
    _id: "1",
    title: "Mỗi sáng thức dậy không lo tìm thời gian",
    description:
      "Chúng ta mất 15 phút mỗi sáng để kẻ lông mày, thật là lãng phí",
    image: "/uploads/customer-stories/story-1.jpg",
    customerName: "Nguyễn Thuỷ Tiên",
    service: "1",
    featured: true,
    status: "published",
    createdAt: new Date("2024-06-01"),
  },
  {
    _id: "2",
    title: "Tự tin hơn mỗi ngày",
    description: "Lông mày đẹp tự nhiên giúp tôi tự tin hơn trong cuộc sống",
    image: "/uploads/customer-stories/story-2.jpg",
    customerName: "Trần Minh Anh",
    service: "3",
    featured: true,
    status: "published",
    createdAt: new Date("2024-06-02"),
  },
  {
    _id: "3",
    title: "Không còn lo lắng",
    description: "Kết quả hoàn hảo vượt ngoài mong đợi của tôi",
    image: "/uploads/customer-stories/story-3.jpg",
    customerName: "Lê Thị Hoa",
    service: "2",
    featured: true,
    status: "published",
    createdAt: new Date("2024-06-03"),
  },
];

class MockDatabase {
  static isConnected = false;

  static async connect() {
    console.log("🔄 Using Mock Database (MongoDB not available)");
    this.isConnected = true;
    return Promise.resolve();
  }

  static async getServices() {
    return {
      success: true,
      data: mockServices,
    };
  }

  static async getFeedbacks() {
    return {
      success: true,
      data: mockFeedbacks,
    };
  }

  static async getCustomerStories() {
    return {
      success: true,
      data: mockCustomerStories,
    };
  }

  static async getServiceById(id) {
    const service = mockServices.find((s) => s._id === id);
    return {
      success: !!service,
      data: service,
    };
  }

  static async createBooking(bookingData) {
    return {
      success: true,
      data: {
        _id: Date.now().toString(),
        ...bookingData,
        status: "pending",
        createdAt: new Date(),
      },
    };
  }
}

module.exports = MockDatabase;
