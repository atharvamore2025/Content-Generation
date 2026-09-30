import React, { useState } from 'react';
import {
  Copy,
  Check,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  Globe
} from 'lucide-react';
import { LinkedInIcon } from '../icons/SocialIcons';

export default function LinkedInViewer({ data, metadata }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(148);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.fullPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
            <LinkedInIcon className="w-3 h-3 text-blue-400" />
            LinkedIn Feed Preview
          </span>
          <span className="text-xs text-neutral-400 font-mono">{data.readTime}</span>
        </div>

        <button
          onClick={handleCopy}
          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider border border-white/[0.08] flex items-center gap-1.5 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
          <span>{copied ? 'Copied' : 'Copy Post'}</span>
        </button>
      </div>

      {/* Clean Post Feed Card */}
      <div className="bg-[#07080c] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-4">
        {/* Author Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/[0.1] flex items-center justify-center font-bold text-xs text-white">
              {metadata.author ? metadata.author.slice(0, 2).toUpperCase() : 'AI'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-semibold text-white">
                  {metadata.author || 'Operational Leader'}
                </h4>
                <span className="text-xs text-neutral-400">• 1st</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {metadata.organization || 'Enterprise Strategic Intelligence'}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-0.5">
                <span>Just now</span>
                <span>•</span>
                <Globe className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>

          <button className="text-xs font-medium text-blue-400 hover:text-blue-300">
            + Follow
          </button>
        </div>

        {/* Post Content */}
        <div className="text-xs text-neutral-200 font-sans space-y-3 leading-relaxed border-b border-white/[0.06] pb-4">
          <p className="font-semibold text-white text-sm">{data.hook}</p>

          <div className="space-y-2 pt-1">
            {data.takeaways.map((takeaway, idx) => (
              <p key={idx} className="text-neutral-300">
                {takeaway}
              </p>
            ))}
          </div>

          <p className="text-neutral-400 pt-1 italic">{data.cta}</p>

          <div className="pt-2 flex flex-wrap gap-1.5">
            {data.hashtags.map((tag, idx) => (
              <span key={idx} className="text-blue-400 text-xs hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Reaction counts */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <span>👍 ❤️ 💡</span>
            <span>{likeCount}</span>
          </div>
          <span>24 comments • 12 reposts</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-around text-xs text-neutral-400">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-neutral-900 transition-colors ${
              liked ? 'text-blue-400' : 'hover:text-white'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            <span>Like</span>
          </button>
          <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors">
            <Repeat2 className="w-3.5 h-3.5" />
            <span>Repost</span>
          </button>
          <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors">
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
