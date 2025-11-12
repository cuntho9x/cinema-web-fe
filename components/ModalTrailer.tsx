'use client';
import React from 'react';
import '@/styles/components/modalTrailer.scss';

interface Props {
  url: string;
  onClose: () => void;
}

export default function ModalTrailer({ url, onClose }: Props) {
  // Kiểm tra xem URL là file video hay embed URL
  const isEmbedUrl = url.includes('youtube.com') || 
                     url.includes('youtu.be') || 
                     url.includes('vimeo.com') ||
                     url.includes('embed');
  
  const isVideoFile = !isEmbedUrl && (
    /\.(mp4|webm|ogg|mov|avi)$/i.test(url) || 
    (!url.startsWith('http://') && !url.startsWith('https://'))
  );
  
  // Xử lý URL cho file video (thêm /movie/ nếu cần)
  const getVideoUrl = () => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/movie/')) {
      return url;
    }
    if (url.startsWith('/')) {
      return `/movie${url}`;
    }
    return `/movie/${url}`;
  };

  return (
    <div className="modal-trailer">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>✖</button>
        {isVideoFile ? (
          <video
            src={getVideoUrl()}
            controls
            autoPlay
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={url}
            title="Trailer"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
