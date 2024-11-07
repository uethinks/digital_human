import { NextResponse } from 'next/server';
import { api } from '@/lib/request';


export async function GET(id: string) {
    try {
        // 调用 Heygen API 获取 avatars 列表
        const response = await api.get(`/v1/personalized_video/audience/detail?id=${id}`);
        // console.log('response', response);
        // 返回完整的响应数据，包含 avatars 和 talking_photos
        return response;
    } catch (error) {
        return (
            {
                code: 500,
                message: '获取 Video 详情',
                data: null
            }
        );
    }
}

// list
export async function LIST() {
    try {
        const response = await api.get('/v1/video.list');
        return response;
    } catch (error) {
        return (
            {
                code: 500,
                message: '获取 Video 列表',
                data: null
            }
        );
    }
}

// get video status
export async function STATUS(id: string) {
    try {
        // 调用 Heygen API 获取 avatars 列表
        const response = await api.get(`/v1/video_status.get?video_id=${id}`);
        // console.log('response', response);
        // 返回完整的响应数据，包含 avatars 和 talking_photos
        return response;
    } catch (error) {
        return (
            {
                code: 500,
                message: '获取 Video 状态',
                data: null
            }
        );
    }
}