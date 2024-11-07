import { NextResponse } from 'next/server';
import { api } from '@/lib/request';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string;

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

        // 根据类型设置不同的 Content-Type
        let contentType = '';
        switch (type) {
            case 'audio':
                contentType = 'audio/mpeg';
                break;
            case 'image':
                contentType = file.type;
                break;
            default:
                return NextResponse.json(
                    {
                        code: 400,
                        message: '不支持的文件类型',
                        data: null
                    },
                    { status: 400 }
                );
        }

        // 上传到 HeyGen
        const response = await api.post('/v1/asset', file, {
            baseURL: 'https://upload.heygen.com',
            headers: {
                'Content-Type': contentType,
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