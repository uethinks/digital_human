import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.heygen.com/v2',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// console.log('baseURL', process.env);
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从环境变量获取API密钥
    const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
    console.log('apiKey', apiKey);
    
    if (apiKey) {
      config.headers['X-Api-Key'] = apiKey;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回响应数据
    return response.data;
  },
  (error: AxiosError) => {
    // 统一错误处理
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // 处理未授权错误
          console.error('API密钥无效或已过期');
          break;
        case 403:
          // 处理禁止访问错误
          console.error('没有权限访问该资源');
          break;
        case 429:
          // 处理请求频率限制
          console.error('请求频率超出限制');
          break;
        default:
          // 处理其他错误
          console.error('请求失败:', data);
      }
    } else {
      // 处理网络错误
      console.error('网络错误，请检查您的互联网连接');
    }
    
    return Promise.reject(error);
  }
);

// 导出类型定义
export type ApiResponse<T = any> = {
  code: number;
  message: string;
  data: T;
};

// 导出请求方法
export const api = {
  get: <T = any>(url: string, config = {}) => 
    request.get<any, ApiResponse<T>>(url, config),
    
  post: <T = any>(url: string, data = {}, config = {}) => 
    request.post<any, ApiResponse<T>>(url, data, config),
    
  put: <T = any>(url: string, data = {}, config = {}) => 
    request.put<any, ApiResponse<T>>(url, data, config),
    
  delete: <T = any>(url: string, config = {}) => 
    request.delete<any, ApiResponse<T>>(url, config),
};

export default request; 