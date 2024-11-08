import { AxiosRequestConfig, AxiosResponse } from 'axios';

// API 响应类型
export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    data: T;
}

// 错误类型
export interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message: string;
}

// 请求配置类型
export interface RequestConfig extends AxiosRequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, string | number>;
}

// 请求拦截器配置类型
export interface RequestInterceptorConfig extends AxiosRequestConfig {
    headers: Record<string, string>;
    method?: string;
    baseURL?: string;
    url?: string;
    data?: unknown;
    params?: unknown;
}

// 响应拦截器配置类型
export interface ResponseInterceptorConfig extends AxiosResponse {
    config: {
        method?: string;
        url?: string;
    };
    status: number;
    data: unknown;
} 