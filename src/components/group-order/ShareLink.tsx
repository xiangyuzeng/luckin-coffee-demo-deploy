'use client';

import { useState } from 'react';
import { Copy, Check, MessageCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareLinkProps {
  code: string;
}

export default function ShareLink({ code }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/group-order/join/${code}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async (platform: 'native' | 'imessage' | 'whatsapp') => {
    const message = `Join my Luckin Coffee group order! Use code: ${code}`;

    if (platform === 'native' && typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'Join my Luckin Coffee order',
          text: message,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else if (platform === 'imessage') {
      window.open(`sms:&body=${encodeURIComponent(message + '\n' + shareUrl)}`);
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(message + '\n' + shareUrl)}`);
    }
  };

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <h3 className="mb-3 text-sm font-medium text-gray-700">Share with friends</h3>

      {/* Code display */}
      <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-white p-4">
        <span className="text-2xl font-bold tracking-widest text-[#1A3C8B]">{code}</span>
      </div>

      {/* Copy link button */}
      <button
        onClick={handleCopy}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy invite link
          </>
        )}
      </button>

      {/* Share buttons */}
      <div className="grid grid-cols-3 gap-2">
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={() => handleShare('native')}
            className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 text-gray-600 transition-colors hover:bg-gray-100"
          >
            <Share2 className="h-5 w-5" />
            <span className="text-xs">Share</span>
          </button>
        )}
        <button
          onClick={() => handleShare('imessage')}
          className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 text-gray-600 transition-colors hover:bg-gray-100"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs">iMessage</span>
        </button>
        <button
          onClick={() => handleShare('whatsapp')}
          className="flex flex-col items-center gap-1 rounded-xl bg-white p-3 text-green-600 transition-colors hover:bg-green-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="text-xs">WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
