import { api } from '@/lib/request';

// Avatar 相关接口
export const avatarApi = {
    // 获取 Avatar 列表
    list: async () => {
        const response = await api.get('/v2/avatars');
        return response;
    },

    // 上传 talking photo
    uploadTalkingPhoto: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post('/v1/talking_photo', formData, {
            baseURL: 'https://upload.heygen.com',
            headers: {
                'Content-Type': file.type,
            }
        });
        return response;
    },

    // 删除 Avatar
    delete: async (id: string) => {
        const response = await api.delete(`/v2/talking_photo/${id}`);
        return response;
    }
};

// 视频相关接口
export const videoApi = {
    // 获取视频列表
    list: async () => {
        const response = await api.get('/v1/video.list');
        return response;
    },

    // 获取视频详情
    getDetail: async (id: string) => {
        const response = await api.get(`/v1/personalized_video/audience/detail?id=${id}`);
        return response;
    },

    // 获取视频状态
    getStatus: async (id: string) => {
        const response = await api.get(`/v1/video_status.get?video_id=${id}`);
        return response;
    },

    // 生成视频
    generate: async (data: any) => {
        const response = await api.post('/v2/video/generate', data);
        return response;
    }
};

// 资源上传接口
export const assetApi = {
    upload: async (file: File, type: 'audio' | 'image') => {
        console.log('upload file type', type);
        const formData = new FormData();
        formData.append('file', file);
        
        const contentType = type === 'audio' ? 'audio/x-wav' : file.type;
        
        const response = await api.post('/v1/asset', file, {
            baseURL: 'https://upload.heygen.com',
            headers: {
                'Content-Type': contentType,
            }
        });
        return response;
    }
};
export interface Avatar {
    avatar_id: string;
    avatar_name: string;
    preview_image_url: string;
}

// 类型定义
export interface TalkingPhoto {
    talking_photo_id: string;
    talking_photo_name: string;
    preview_image_url: string;
}

export interface Video {
    video_id: string;
    video_title: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'waiting';
    thumbnail_url?: string;
    gif_url?: string;
    video_url?: string;
    duration?: number;
} 