'use client';
import React from 'react';
import '@/styles/components/modalTrailer.scss';

interface Props {
  url: string;
  onClose: () => void;
}

export default function ModalTrailer({ url, onClose }: Props) {
  return (
    <div className="modal-trailer">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>✖</button>
        <iframe
          width="100%"
          height="100%"
          src={url}
          title="Trailer"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}
