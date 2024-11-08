import { NextResponse } from 'next/server';
import { heygenApi } from '@/lib/request';

// 获取视频列表
export async function GET(request: Request) {
    try {
        // 如果有 id 参数，获取单个视频详情
        // 否则获取视频列表
        const response = await heygenApi.get('/v1/video.list');
        console.log('videos get response: ', response)
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            {
                code: 500,
                message: '获取视频信息失败',
                data: null
            },
            { status: 500 }
        );
    }
}

// 生成视频
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await heygenApi.post('/v2/video/generate', body);
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            {
                code: 500,
                message: '生成视频失败',
                data: null
            },
            { status: 500 }
        );
    }
}

// 获取视频状态
export async function HEAD(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get('video_id');

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