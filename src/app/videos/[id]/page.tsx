'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/request';
import { GET, STATUS } from '@/app/api/videos/route';

interface VideoStatus {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'waiting';
    gif_url?: string;
    thumbnail_url?: string;
    video_url?: string;
    error?: string;
    duration?: number;
}

export default function VideoDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [video, setVideo] = useState<VideoStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    // 定期检查视频状态
    useEffect(() => {
        async function fetchParams() {
            const { id } = await params; // or await params.id if you need only one param
            if (id) {
                const checkStatus = async () => {
                    try {
                        // const res_video = await GET(id);
                        const res_status = await STATUS(id);
                        // console.log('video detail: ', res_video.data)
                        console.log('video status: ', res_status.data)
                        setVideo(res_status.data);
                        setLoading(false);
                        if (res_status.data.error ) {
                            throw new Error(res_status.data?.error?.detail ||'创建失败')
                        }

                        // 如果视频还在处理中，继续检查
                        if (res_status.data.status === 'pending' || res_status.data.status === 'processing' || res_status.data.status === 'waiting') {
                            setTimeout(checkStatus, 60000); // 每一分钟检查一次
                        }
                    } catch (err: any) {
                        setError(err.message || '获取视频状态失败');
                        setLoading(false);
                    }
                };
                checkStatus();
            }
        }

        fetchParams();
    }, []);

    const getStatusDisplay = () => {
        if (!video) return null;

        switch (video.status) {
            case 'waiting':
                return {
                    text: '排队中',
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-50',
                    icon: '⏳'
                };
            case 'pending':
                return {
                    text: '等待处理',
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-50',
                    icon: '⏳'
                };
            case 'processing':
                return {
                    text: '正在生成',
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-50',
                    icon: '🔄'
                };
            case 'completed':
                return {
                    text: '生成完成',
                    color: 'text-green-500',
                    bgColor: 'bg-green-50',
                    icon: '✅'
                };
            case 'failed':
                return {
                    text: '生成失败',
                    color: 'text-red-500',
                    bgColor: 'bg-red-50',
                    icon: '❌'
                };
            default:
                return {
                    text: '未知状态',
                    color: 'text-gray-500',
                    bgColor: 'bg-gray-50',
                    icon: '❓'
                };
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-50 text-red-500 px-6 py-4 rounded-lg shadow-sm">
                    {error}
                </div>
            </div>
        );
    }

    const status = getStatusDisplay();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* 返回按钮 */}
                <button
                    onClick={() => router.push('/videos')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-8 group"
                >
                    <svg
                        className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    返回
                </button>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-bold text-gray-700">视频详情</h1>
                            <div className={`px-4 py-2 rounded-full ${status?.bgColor} ${status?.color}`}>
                                <span className="mr-2">{status?.icon}</span>
                                {status?.text}
                            </div>
                        </div>

                        {/* 视频信息 */}
                        <div className="space-y-6">
                            <div>
                                <p className="text-gray-500 mb-2">视频 ID</p>
                                <p className="font-mono text-black p-2 rounded">{video?.id}</p>
                            </div>

                            {video?.duration && (
                                <div>
                                    <p className="text-gray-500 mb-2">视频时长</p>
                                    <p className='text-black'>{Math.round(video.duration)}秒</p>
                                </div>
                            )}

                            {video?.error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                                    <p className="font-semibold mb-1">错误信息</p>
                                    <p>{video.error}</p>
                                </div>
                            )}

                            {/* 视频预览 */}
                            {video?.status === 'completed' && video.gif_url && (
                                <div className="mt-8">
                                    <h2 className="text-xl text-gray-500 font-semibold mb-4">视频预览</h2>
                                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                                        <video
                                            src={video.video_url}
                                            controls
                                            className="w-full h-full"
                                        >
                                            您的浏览器不支持视频播放
                                        </video>
                                    </div>

                                    <a
                                        href={video.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg
                    transition-colors duration-200"
                                    >
                                        保存视频
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 