import { api } from '@/lib/request';

// Avatar 相关接口
export const avatarApi = {
    // 获取 Avatar 列表
    list: async () => {
        const response = await api.get('/avatars');
        return response;
    },

    // 上传 talking photo
    uploadTalkingPhoto: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post('/avatars', formData);
        return response;
    },

    // 删除 Avatar
    delete: async (id: string) => {
        const response = await api.delete(`/avatars?id=${id}`);
        return response;
    }
};

// 视频相关接口
export const videoApi = {
    // 获取视频列表
    list: async () => {
        const response = await api.get('/videos');
        return response;
    },

    // 获取视频详情
    getDetail: async (id: string) => {
        const response = await api.get(`/videos?id=${id}`);
        return response;
    },

    // 获取视频状态
    getStatus: async (videoId: string) => {
        const response = await api.get(`/videos/${videoId}`);
        return response;
    },

    // 生成视频
    generate: async (data: any) => {
        const response = await api.post('/videos', data);
        return response;
    }
};

// 资源上传接口
export const assetApi = {
    upload: async (file: File, type: 'audio' | 'image') => {
        const formData = new FormData();
        const buffer = Buffer.from(await file.arrayBuffer());
        formData.append('file', new Blob([buffer]), file.name);
        formData.append('type', type);
        
        const response = await api.post('/assets', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
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