'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/request';
import { UPLOAD_TALKING_PHOTO } from '@/app/api/avatars/route';

interface AvatarForm {
    file: File | null;
    name: string;
    isUploading: boolean;
    error: string;
}

export default function CreateAvatar() {
    const router = useRouter();
    const [form, setForm] = useState<AvatarForm>({
        file: null,
        name: '',
        isUploading: false,
        error: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // 验证文件类型
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setForm(prev => ({ ...prev, error: '只支持 JPG 或 PNG 格式的图片' }));
                return;
            }
            // 验证文件大小（假设限制为 10MB）
            if (file.size > 10 * 1024 * 1024) {
                setForm(prev => ({ ...prev, error: '图片大小不能超过 10MB' }));
                return;
            }
            setForm(prev => ({ ...prev, file, error: '' }));
        }
    };

    const handleSubmit = async () => {
        if (!form.file) {
            setForm(prev => ({ ...prev, error: '请选择图片' }));
            return;
        }
        if (!form.name.trim()) {
            setForm(prev => ({ ...prev, error: '请输入名称' }));
            return;
        }

        setForm(prev => ({ ...prev, isUploading: true, error: '' }));

        try {
            // 创建 FormData
            // const formData = new FormData();
            // formData.append('file', form.file);

            // 上传图片到 HeyGen
            const response = await UPLOAD_TALKING_PHOTO(form.file);
            console.log('upload talking photo response', response);

            if (!response.data) {
                throw new Error(response?.message || '上传失败');
            }

            // 上传成功后跳转到列表页
            router.push('/avatars');
        } catch (error) {
            setForm(prev => ({
                ...prev,
                isUploading: false,
                error: error instanceof Error ? error.message : '上传失败，请重试'
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* 返回按钮 */}
                <button
                    onClick={() => router.back()}
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
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">创建数字人</h1>

                        {/* 名称输入 */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                数字人名称
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="请输入名称"
                            />
                        </div>

                        {/* 图片上传区域 */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                上传照片
                            </label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className="cursor-pointer inline-flex flex-col items-center"
                                >
                                    {form.file ? (
                                        <img
                                            src={URL.createObjectURL(form.file)}
                                            alt="Preview"
                                            className="w-48 h-48 object-cover rounded-lg mb-4"
                                        />
                                    ) : (
                                        <svg
                                            className="w-12 h-12 text-gray-400 mb-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    )}
                                    <span className="text-gray-600">
                                        {form.file ? '点击更换图片' : '点击选择或拖放图片'}
                                    </span>
                                    <span className="text-gray-400 text-sm mt-2">
                                        支持 JPG、PNG 格式，最大 10MB
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* 错误提示 */}
                        {form.error && (
                            <div className="mb-6 p-4 bg-red-50 rounded-lg">
                                <p className="text-red-600 text-sm">{form.error}</p>
                            </div>
                        )}

                        {/* 提交按钮 */}
                        <button
                            onClick={handleSubmit}
                            disabled={form.isUploading}
                            className={`w-full py-3 px-6 rounded-lg font-semibold text-center
                                ${form.isUploading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transform hover:scale-[1.02] transition-all duration-200'
                                }
                            `}
                        >
                            {form.isUploading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                    上传中...
                                </div>
                            ) : (
                                '创建数字人'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 