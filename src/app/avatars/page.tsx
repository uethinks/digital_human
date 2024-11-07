'use client';

import { useRouter } from 'next/navigation';
import { useAvatar } from '@/contexts/AvatarContext';

export default function AvatarList() {
    const router = useRouter();
    const { talkingPhotos, loading, error } = useAvatar();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <div className="bg-red-50 text-red-500 px-6 py-4 rounded-lg shadow-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">我的数字人</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/videos')}
                            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-full 
                            transition-all duration-200 ease-in-out transform hover:scale-105 
                            shadow-md hover:shadow-lg border border-gray-200"
                        >
                            我的视频
                        </button>
                        <button
                            onClick={() => router.push('/avatars/create')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full 
                            transition-all duration-200 ease-in-out transform hover:scale-105 
                            shadow-md hover:shadow-lg"
                        >
                            创建数字人
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {talkingPhotos.map((avatar) => (
                        <div 
                            key={avatar.talking_photo_id}
                            onClick={() => router.push(`/avatars/${avatar.talking_photo_id}`)}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer transform hover:scale-[1.02]"
                        >
                            {/* 图片容器 */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img 
                                    src={avatar.preview_image_url} 
                                    alt={avatar.talking_photo_name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            
                            {/* 内容区域 */}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    {avatar.talking_photo_name}
                                </h2>
                                
                                <div className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
                                    text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 
                                    flex items-center justify-center space-x-2 group-hover:from-blue-600 group-hover:to-blue-700"
                                >
                                    <span>生成视频</span>
                                    <svg 
                                        className="w-5 h-5 transform transition-transform duration-200 group-hover:translate-x-1" 
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
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 空状态展示 */}
                {talkingPhotos.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg">还没有数字人，立即创建一个吧</p>
                        <button
                            onClick={() => router.push('/avatars/create')}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full
                            transition-all duration-200 ease-in-out transform hover:scale-105"
                        >
                            创建数字人
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 