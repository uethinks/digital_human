'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAvatar } from '@/contexts/AvatarContext';
import { assetApi, videoApi, TalkingPhoto } from '@/services/api';

type Params = Promise<{ id: string }>


interface AudioUploadForm {
    file: File | null;
    isUploading: boolean;
    isAudioUploading: boolean;
    error: string;
    title: string;
}

export default function AvatarDetail(props: { params: Params }) {
    const router = useRouter();
    const { getTalkingPhotoById } = useAvatar();
    const [audioAssetId, setAudioAssetId] = useState<string>();
    const [avatar, setAvatar] = useState<TalkingPhoto | undefined>(undefined);
    const  { id }  = useParams();
    console.log('props: ', props, id);

    useEffect(() => {
        if (id) {
            setAvatar(getTalkingPhotoById(id as string));
        }
    }, [id, getTalkingPhotoById]);

    const [form, setForm] = useState<AudioUploadForm>({
        file: null,
        isUploading: false,
        isAudioUploading: false,
        error: '',
        title: '测试视频'
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!avatar) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-50 text-red-500 px-6 py-4 rounded-lg shadow-sm">
                    未找到对应的数字人
                </div>
            </div>
        );
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!['audio/mp3', 'audio/wav'].includes(file.type)) {
                setForm(prev => ({ ...prev, error: '只支持 MP3 或 WAV 格式的音频文件' }));
                return;
            }
            if (file.size > 15 * 1024 * 1024) {
                setForm(prev => ({ ...prev, error: '文件大小不能超过 15MB' }));
                return;
            }
            setForm(prev => ({ ...prev, file, error: '', isAudioUploading: true }));

            try {
                const response = await assetApi.upload(file, 'audio');
                setAudioAssetId(response.data.id);
                setForm(prev => ({ ...prev, isAudioUploading: false }));
            } catch (error) {
                setForm(prev => ({
                    ...prev,
                    error: '音频上传失败，请重试',
                    isAudioUploading: false
                }));
            }
        }
    };

    const handleSubmit = async () => {
        if (!form.file || !audioAssetId) {
            setForm(prev => ({ ...prev, error: '请先选择音频文件' }));
            return;
        }

        setForm(prev => ({ ...prev, isUploading: true, error: '' }));

        try {
            const response = await videoApi.generate({
                title: form.title,
                video_inputs: [
                    {
                        character: {
                            "type": "talking_photo",
                            "talking_photo_id": avatar.talking_photo_id,
                            "talking_style": "expressive"
                        },
                        voice: {
                            "type": "audio",
                            "audio_asset_id": audioAssetId
                        }
                    }
                ],
                "dimension": {
                    "width": 1280,
                    "height": 720
                },
                "aspect_ratio": null,
                "test": true
            });

            router.push(`/videos/${response.data.video_id}`);
        } catch (error) {
            setAudioAssetId(undefined);
            setForm(prev => ({
                ...prev,
                isUploading: false,
                error: '视频生成失败，请重试'
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
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
                    {/* Avatar 信息区域 */}
                    {avatar && (
                        <div className="border-b border-gray-100">
                            <div className="flex items-center space-x-6 p-8">
                                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                                    <img
                                        src={avatar.preview_image_url}
                                        alt={avatar.talking_photo_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {avatar.talking_photo_name}
                                    </h1>
                                    <p className="text-gray-500">
                                        为这个数字人生成一段视频
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 上传区域 */}
                    <div className="p-8">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                视频标题
                            </h2>
                            <input
                                type="text"
                                className="border text-black border-gray-300 rounded-lg p-2 w-full"
                                defaultValue="测试视频"
                                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                上传音频
                            </h2>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".mp3,.wav"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="audio-upload"
                                />
                                <label
                                    htmlFor="audio-upload"
                                    className="cursor-pointer inline-flex flex-col items-center"
                                >
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
                                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                        />
                                    </svg>
                                    <span className="text-gray-600">
                                        {form.file ? form.file.name : '点击选择或拖放音频文件'}
                                    </span>
                                    <span className="text-gray-400 text-sm mt-2">
                                        支持 MP3、WAV 格式，最大 15MB
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
                            disabled={form.isUploading || !form.file || form.isAudioUploading || !audioAssetId}
                            className={`w-full py-4 px-6 rounded-xl font-semibold text-center
                ${form.isUploading || !form.file || form.isAudioUploading || !audioAssetId
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transform hover:scale-[1.02] transition-all duration-200'
                                }
              `}
                        >
                            {form.isUploading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                    生成中...
                                </div>
                            ) : form.isAudioUploading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent mr-3"></div>
                                    音频上传中...
                                </div>
                            ) : (
                                '生成视频'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 