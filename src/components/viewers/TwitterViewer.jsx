import React, { useState } from 'react';
import {
  Copy,
  Check,
  Heart,
  Repeat2,
  Bookmark,
  MessageCircle
} from 'lucide-react';
import { TwitterXIcon } from '../icons/SocialIcons';

export default function TwitterViewer({ data, metadata }) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTweetIdx, setCopiedTweetIdx] = useState(null);
  const [likes, setLikes] = useState({});

  const handleCopyAll = () => {
    navigator.clipboard.writeText(data.fullThreadText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyTweet = (idx, text) => {
    navigator.clipboard.writeText(text);
    setCopiedTweetIdx(idx);
    setTimeout(() => setCopiedTweetIdx(null), 2000);
  };

  const toggleLike = (idx) => {
    setLikes((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-white/[0.08] flex items-center gap-1.5">
            <TwitterXIcon className="w-3 h-3 text-neutral-300" />
            Thread ({data.tweetCount} Tweets)
          </span>
          <span className="text-xs text-neutral-400 font-mono">{data.totalCharacters} chars</span>
        </div>

        <button
          onClick={handleCopyAll}
          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider border border-white/[0.08] flex items-center gap-1.5 transition-all"
        >
          {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
          <span>{copiedAll ? 'Thread Copied' : 'Copy All'}</span>
        </button>
      </div>

      {/* Tweet Stream */}
      <div className="space-y-3 relative before:absolute before:left-3 before:top-3 before:bottom-3 before:w-px before:bg-white/[0.06] pl-6">
        {data.tweets.map((tweet, idx) => {
          const isLiked = !!likes[idx];
          const isCopied = copiedTweetIdx === idx;

          return (
            <div key={idx} className="relative">
              {/* Timeline Indicator */}
              <div className="absolute -left-6 top-3 w-5 h-5 rounded-full bg-[#07080c] border border-red-500/60 flex items-center justify-center text-[10px] font-mono text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                {idx + 1}
              </div>

              <div className="bg-[#07080c] border border-white/[0.08] rounded-xl p-4 space-y-2.5 hover:border-white/[0.18] transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {metadata.author || 'Operator Intelligence'}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      @{metadata.author ? metadata.author.toLowerCase().replace(/[^a-z0-9]/g, '') : 'intelligence'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-500">
                      {tweet.charCount}/280
                    </span>
                    <button
                      onClick={() => handleCopyTweet(idx, tweet.text)}
                      title="Copy tweet"
                      className="text-neutral-400 hover:text-white"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-neutral-200 whitespace-pre-line leading-relaxed font-sans">
                  {tweet.text}
                </p>

                <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-white/[0.04]">
                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono">12</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <Repeat2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono">34</span>
                  </button>
                  <button
                    onClick={() => toggleLike(idx)}
                    className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-400'}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-mono">{isLiked ? 88 : 87}</span>
                  </button>
                  <Bookmark className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
