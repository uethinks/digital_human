import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// 创建代理配置
const proxyConfig = process.env.NEXT_PUBLIC_PROXY_HOST ? {
  host: process.env.NEXT_PUBLIC_PROXY_HOST,
  port: Number(process.env.NEXT_PUBLIC_PROXY_PORT) || 7897,
  protocol: process.env.NEXT_PUBLIC_PROXY_PROTOCOL || 'http'
} : undefined;

// 创建 HeyGen API 实例
const heygenRequest: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HEYGEN_API_BASE_URL || 'https://api.heygen.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  ...(proxyConfig && { proxy: proxyConfig })
});

// 创建 HeyGen Upload API 实例
const heygenUploadRequest: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HEYGEN_UPLOAD_BASE_URL || 'https://upload.heygen.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  ...(proxyConfig && { proxy: proxyConfig })
});

// 创建本地 API 实例
const localRequest: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// HeyGen API 请求拦截器
heygenRequest.interceptors.request.use(
  (config) => {
    const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
    if (apiKey) {
      config.headers['X-Api-Key'] = apiKey;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// HeyGen API 请求拦截器
heygenUploadRequest.interceptors.request.use(
    (config) => {
      const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
      if (apiKey) {
        config.headers['X-Api-Key'] = apiKey;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

// 添加请求日志拦截器
const requestLogInterceptor = (config: any) => {
  console.log(`🚀 Request: [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`, {
    headers: config.headers,
    data: config.data,
    params: config.params
  });
  return config;
};

const requestErrorInterceptor = (error: AxiosError) => {
  console.error('❌ Request Error:', error);
  return Promise.reject(error);
};

// 添加响应日志拦截器
const responseLogInterceptor = (response: AxiosResponse) => {
  console.log(`✅ Response: [${response.config.method?.toUpperCase()}] ${response.config.url}`, {
    status: response.status,
    data: response.data
  });
  return response.data;
};

const responseErrorInterceptor = (error: AxiosError) => {
  const { response } = error;
  
  if (response) {
    const { status, data, config } = response;
    console.error(`❌ Response Error: [${config.method?.toUpperCase()}] ${config.url}`, {
      status,
      data
    });
    
    switch (status) {
      case 401:
        console.error('API密钥无效或已过期');
        break;
      case 403:
        console.error('没有权限访问该资源');
        break;
      case 429:
        console.error('请求频率超出限制');
        break;
      default:
        console.error('请求失败:', data);
    }
  } else {
    console.error('网络错误，请检查您的互联网连接');
  }
  
  return Promise.reject(error);
};

// 为所有实例添加请求日志拦截器
[heygenRequest, heygenUploadRequest, localRequest].forEach(instance => {
  instance.interceptors.request.use(requestLogInterceptor, requestErrorInterceptor);
  instance.interceptors.response.use(responseLogInterceptor, responseErrorInterceptor);
});

// 导出类型定义
export type ApiResponse<T = any> = {
  code: number;
  message: string;
  data: T;
};

// 导出 HeyGen API 方法
export const heygenApi = {
  get: (url: string, config = {}): any => 
    heygenRequest.get(url, config),
    
  post: (url: string, data = {}, config = {}): any => 
    heygenRequest.post(url, data, config),
    
  put: (url: string, data = {}, config = {}): any => 
    heygenRequest.put(url, data, config),
    
  delete: (url: string, config = {}): any => 
    heygenRequest.delete(url, config),
};

// 导出本地 API 方法
export const api = {
  get: (url: string, config = {}): any => 
    localRequest.get(url, config),
    
  post: (url: string, data = {}, config = {}): any => 
    localRequest.post(url, data, config),
    
  put: (url: string, data = {}, config = {}): any => 
    localRequest.put(url, data, config),
    
  delete: (url: string, config = {}): any => 
    localRequest.delete(url, config),
}; 

export const heygenUploadApi = {
  get: (url: string, config = {}): any => 
    heygenUploadRequest.get(url, config),
  post: (url: string, data = {}, config = {}): any => 
    heygenUploadRequest.post(url, data, config),
  put: (url: string, data = {}, config = {}): any => 
    heygenUploadRequest.put(url, data, config),
  delete: (url: string, config = {}): any => 
    heygenUploadRequest.delete(url, config),
};
