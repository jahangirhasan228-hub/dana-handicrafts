import React, { useState } from 'react';
import { ExternalLink, X, Megaphone } from 'lucide-react';

interface AdBannerProps {
  type: 'top' | 'small' | 'large';
  imageUrl?: string;
  linkUrl?: string;
  adCode?: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  type,
  imageUrl,
  linkUrl,
  adCode,
  className = '',
}) => {
  const [closed, setClosed] = useState(false);

  if (closed) return null;
  if (!imageUrl && !adCode) return null;

  return (
    <div className={`relative group overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-slate-900 to-amber-500/5 p-2 transition-all hover:border-amber-500/50 ${className}`}>
      
      {/* Ad Label & Close Button */}
      <div className="flex items-center justify-between pb-1.5 px-2 text-[10px] font-bold tracking-wider text-amber-400 uppercase">
        <span className="flex items-center gap-1">
          <Megaphone className="w-3 h-3 text-amber-400 animate-pulse" />
          Sponsored Ad
        </span>
        <button
          onClick={() => setClosed(true)}
          className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          title="Hide Ad"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Embedded Code or Image Link */}
      {adCode ? (
        <div
          className="w-full overflow-hidden text-center text-xs"
          dangerouslySetInnerHTML={{ __html: adCode }}
        />
      ) : imageUrl ? (
        <a
          href={linkUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative rounded-xl overflow-hidden group/img"
        >
          <img
            src={imageUrl}
            alt="Advertisement Banner"
            className={`w-full object-cover transition-transform duration-500 group-hover/img:scale-105 ${
              type === 'top' ? 'h-24 sm:h-32' : type === 'small' ? 'h-20 sm:h-28' : 'h-32 sm:h-48'
            }`}
          />
          <div className="absolute inset-0 bg-slate-950/20 group-hover/img:bg-transparent transition-colors flex items-end justify-end p-2">
            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
              <span>Visit Link</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </a>
      ) : null}
    </div>
  );
};
