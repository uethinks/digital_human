import { NextResponse } from 'next/server';
import { api } from '@/lib/request';
import type { ApiResponse } from '@/lib/request';
import { headers } from 'next/headers';

// 根据API文档定义接口类型
export interface Avatar {
    avatar_id: string;
    avatar_name: string;
    gender: string;
    preview_image_url: string;
    preview_video_url: string;
}

export interface TalkingPhoto {
    talking_photo_id: string;
    talking_photo_name: string;
    preview_image_url: string;
}

interface AvatarListResponse {
    avatars: Avatar[];
    talking_photos: TalkingPhoto[];
}

export async function GET() {
    try {
        // 调用 Heygen API 获取 avatars 列表
        const response = await api.get<AvatarListResponse>('/v2/avatars');
        console.log('response1', response);
        // 返回完整的响应数据，包含 avatars 和 talking_photos
        return response;
    } catch (error) {
        return (
            {
                code: 500,
                message: '获取 Avatar 列表失败',
                data: null
            }
        );
    }
}

export async function POST(body: any) {
    try {
        // 调用 Heygen API 创建 avatar
        const response = await api.post('/v2/video/generate', body);

        return {
            code: 200,
            message: 'success',
            data: response.data
        };
    } catch (error) {
        return {
            code: 500,
            message: '创建 Avatar 失败',
            data: null
        };
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    code: 400,
                    message: '缺少必要的 avatar_id 参数',
                    data: null
                } as ApiResponse<null>,
                { status: 400 }
            );
        }

        // 调用 Heygen API 删除 avatar
        const response = await api.delete<null>(`/v2/avatars/${id}`);

        return NextResponse.json({
            code: 200,
            message: 'success',
            data: null
        } as ApiResponse<null>);
    } catch (error) {
        return NextResponse.json(
            {
                code: 500,
                message: '删除 Avatar 失败',
                data: null
            } as ApiResponse<null>,
            { status: 500 }
        );
    }
}

export async function upload(file: File) {
    try {
        // 调用 Heygen API 上传资产
        const response = await api.post('/v1/asset', file, { baseURL: 'https://upload.heygen.com', headers: { 'Content-Type': 'audio/x-wav' } }); // 假设上传接口为 /upload

        return {
            code: 200,
            message: '上传成功',
            data: response.data
        };
    } catch (error) {
        return {
            code: 500,
            message: '上传失败',
            data: null
        }
    }
} 