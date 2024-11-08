import { NextResponse } from 'next/server';
import { heygenApi } from '@/lib/request';

// 获取视频状态
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: videoId } = await context.params;

        if (!videoId) {
            return NextResponse.json(
                {
                    code: 400,
                    message: '缺少视频ID',
                    data: null
                },
                { status: 400 }
            );
        }

        const response = await heygenApi.get(`/v1/video_status.get?video_id=${videoId}`);
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            {
                code: 500,
                message: '获取视频状态失败',
                data: null
            },
            { status: 500 }
        );
    }
} 