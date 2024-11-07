'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Avatar, TalkingPhoto } from '@/app/api/avatars/route';
import { GET, LIST_TALKING_PHOTOS } from '@/app/api/avatars/route';

interface AvatarContextType {
  avatars: Avatar[];
  talkingPhotos: TalkingPhoto[];
  loading: boolean;
  error: string | null;
  setAvatars: (avatars: Avatar[]) => void;
  setTalkingPhotos: (photos: TalkingPhoto[]) => void;
  refreshAvatars: () => Promise<void>;
  getTalkingPhotoById: (id: string) => TalkingPhoto | undefined;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [talkingPhotos, setTalkingPhotos] = useState<TalkingPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAvatars = async () => {
    try {
      setLoading(true);
      const response = await GET();
    //   const res = await LIST_TALKING_PHOTOS();
    //   console.log('talking photos', res);
      if (!response.data) {
        throw new Error("No data received");
      }
      const { avatars = [], talking_photos = [] } = response.data;
      setAvatars(avatars);
      setTalkingPhotos([talking_photos[0]]);
      setError(null);
    } catch (err) {
      console.error('Error fetching avatars:', err);
      setError("无法获取 Avatar 列表");
    } finally {
      setLoading(false);
    }
  };

  const getTalkingPhotoById = (id: string) => {
    return talkingPhotos.find(photo => photo.talking_photo_id === id);
  };

  useEffect(() => {
    refreshAvatars();
  }, []);

  return (
    <AvatarContext.Provider
      value={{
        avatars,
        talkingPhotos,
        loading,
        error,
        setAvatars,
        setTalkingPhotos,
        refreshAvatars,
        getTalkingPhotoById,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
} 