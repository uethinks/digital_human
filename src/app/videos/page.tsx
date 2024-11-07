'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LIST } from '@/app/api/videos/route';

interface Video {
    video_id: string;
    video_title: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'waiting';
    thumbnail_url?: string;
    gif_url?: string;
    video_url?: string;
    duration?: number;
}

export default function VideoList() {
    const router = useRouter();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await LIST();
                setVideos(response.data.videos || []);
            } catch (err) {
                setError('获取视频列表失败');
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const getStatusDisplay = (status: Video['status']) => {
        switch (status) {
            case 'waiting':
                return {
                    text: '排队中',
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-50'
                };
            case 'pending':
                return {
                    text: '等待处理',
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-50'
                };
            case 'processing':
                return {
                    text: '正在生成',
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-50'
                };
            case 'completed':
                return {
                    text: '已完成',
                    color: 'text-green-500',
                    bgColor: 'bg-green-50'
                };
            case 'failed':
                return {
                    text: '生成失败',
                    color: 'text-red-500',
                    bgColor: 'bg-red-50'
                };
            default:
                return {
                    text: '未知状态',
                    color: 'text-gray-500',
                    bgColor: 'bg-gray-50'
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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">我的视频</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video) => {
                        const status = getStatusDisplay(video.status);
                        return (
                            <div
                                key={video.video_id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                            >
                                {/* 缩略图区域 */}
                                <div className="relative aspect-video overflow-hidden bg-gray-100">
                                    {video.gif_url ? (
                                        <img
                                            src={video.gif_url}
                                            alt={video.video_title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <svg
                                                className="w-12 h-12 text-gray-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* 内容区域 */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="w-[70%] text-xl font-semibold text-gray-800 break-words whitespace-pre-wrap min-h-[3rem]">
                                            {video.video_title || '未命名视频'}
                                        </h2>
                                        <span className={`px-3 py-1 rounded-full text-sm ${status.bgColor} ${status.color}`}>
                                            {status.text}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-500 mb-4">
                                        <div className="mb-2">
                                            <span className="block mb-1">ID:</span>
                                            <span className="font-mono text-xs break-all">{video.video_id}</span>
                                        </div>
                                        {video.duration && (
                                            <p>时长：{Math.round(video.duration)}秒</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => router.push(`/videos/${video.video_id}`)}
                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
                                        hover:from-blue-600 hover:to-blue-700 text-white font-medium
                                        py-2 px-4 rounded-lg transition-all duration-200 
                                        transform hover:scale-[1.02] hover:shadow-lg
                                        flex items-center justify-center space-x-2"
                                    >
                                        <span>查看详情</span>
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 空状态展示 */}
                {videos.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg">还没有生成任何视频</p>
                        <button
                            onClick={() => router.push('/avatars')}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full
                            transition-all duration-200 ease-in-out transform hover:scale-105"
                        >
                            开始创建
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 