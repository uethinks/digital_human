import { NextResponse } from 'next/server';
import { api } from '@/lib/request';

// 获取 Avatar 列表
export async function GET(request: Request) {
    try {
        const response = await api.get('/v2/avatars');
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            {
                code: 500,
                message: '获取 Avatar 列表失败',
                data: null
            },
            { status: 500 }
        );
    }
}

// 创建 Avatar（上传 talking photo）
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                {
                    code: 400,
                    message: '请选择文件',
                    data: null
                },
                { status: 400 }
            );
        }

        // 上传到 HeyGen
        const response = await api.post('/v1/talking_photo', file, {
            baseURL: 'https://upload.heygen.com',
            headers: {
                'Content-Type': file.type,
            }
        });

        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json(
            {
                code: 500,
                message: error?.response?.data?.message || '上传失败',
                data: null
            },
            { status: 500 }
        );
    }
}

// 删除 Avatar
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    code: 400,
                    message: '缺少必要的 id 参数',
                    data: null
                },
                { status: 400 }
            );
        }

        const response = await api.delete(`/v2/talking_photo/${id}`);
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            {
                code: 500,
                message: '删除失败',
                data: null
            },
            { status: 500 }
        );
    }
}