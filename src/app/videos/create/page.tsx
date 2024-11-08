'use client';

import { useRouter } from 'next/navigation';

export default function CreateVideo() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900 mr-6 group"
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
                    <h1 className="text-3xl font-bold text-gray-900">创建视频</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-8">
                        {/* 视频创建表单将在后续实现 */}
                        <p className="text-gray-500">视频创建功能开发中...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
