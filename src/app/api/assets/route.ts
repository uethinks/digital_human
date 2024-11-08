import { NextResponse } from 'next/server';
import { heygenUploadApi } from '@/lib/request';

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

        // 将文件转换为 Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 根据类型设置不同的 Content-Type
        let contentType = '';
        switch (type) {
            case 'audio':
                contentType = 'audio/x-wav';
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

        // 创建新的 FormData 用于上传
        const uploadFormData = new FormData();
        uploadFormData.append('file', new Blob([buffer], { type: contentType }), file.name);

        // 上传到 HeyGen
        const response = await heygenUploadApi.post('/v1/asset', uploadFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('assets upload error: ', error);
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