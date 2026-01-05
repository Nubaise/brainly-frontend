import { ShareIcon } from '../icons/Shareicon';
import { TrashIcon } from '../icons/TrashIcon';
import axios from 'axios';
import { BACKEND_URL } from '../config';

interface CardProps {
    _id: string;
    title: string;
    link: string;
    type?: "twitter" | "youtube" | "linkedin" | "other";
    tags?: Array<{ _id: string; title: string }>;  // Tags with IDs
    onDelete?: () => void;
}

// Helper to detect content type from URL if not provided
function detectType(url: string): "twitter" | "youtube" | "linkedin" | "other" {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
        return 'twitter';
    }
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
        return 'youtube';
    }
    if (lowerUrl.includes('linkedin.com')) {
        return 'linkedin';
    }
    return 'other';
}

// Convert YouTube URL to embed format
function getYouTubeEmbedUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        
        // youtube.com/watch?v=VIDEO_ID
        if (urlObj.hostname.includes('youtube.com')) {
            const videoId = urlObj.searchParams.get('v');
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }
        
        // youtu.be/VIDEO_ID
        if (urlObj.hostname.includes('youtu.be')) {
            const videoId = urlObj.pathname.slice(1);
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }
        
        return url;
    } catch {
        return url;
    }
}

// Get Twitter embed URL
function getTwitterEmbedUrl(url: string): string {
    // Convert x.com to twitter.com for embed
    const twitterUrl = url.replace('x.com', 'twitter.com');
    
    // Extract tweet ID
    const match = twitterUrl.match(/status\/(\d+)/);
    if (match) {
        const tweetId = match[1];
        return `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}`;
    }
    
    return twitterUrl;
}

export function Card({ _id, title, link, type, tags, onDelete }: CardProps) {
    // Use provided type or auto-detect
    const actualType = type || detectType(link);

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this content?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BACKEND_URL}/api/v1/content?id=${_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Call parent callback to refresh list
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Failed to delete content');
            } else {
                alert('Failed to delete content');
            }
        }
    }

    function handleShare() {
        const shareUrl = `${window.location.origin}/content/${_id}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(link)
                .then(() => alert('Link copied to clipboard!'))
                .catch(() => alert(`Link: ${link}`));
        } else {
            alert(`Link: ${link}`);
        }
    }

    // Get icon based on type
    const getTypeIcon = () => {
        switch (actualType) {
            case 'youtube':
                return '▶️';
            case 'twitter':
                return '🐦';
            case 'linkedin':
                return '💼';
            default:
                return '🔗';
        }
    };

    // Get type display name
    const getTypeName = () => {
        switch (actualType) {
            case 'youtube':
                return 'YouTube';
            case 'twitter':
                return 'Twitter';
            case 'linkedin':
                return 'LinkedIn';
            default:
                return 'Link';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition min-w-72 max-w-96">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon()}</span>
                    <h3 className="font-semibold text-gray-800 line-clamp-2">{title}</h3>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button 
                        onClick={handleShare}
                        className="text-gray-400 hover:text-purple-600 transition"
                        title="Share"
                    >
                        <ShareIcon />
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="text-gray-400 hover:text-red-600 transition"
                        title="Delete"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="mt-3">
                {/* YouTube - Embedded Video */}
                {actualType === 'youtube' && (
                    <div className="rounded overflow-hidden bg-black">
                        <iframe 
                            className="w-full"
                            height="200"
                            src={getYouTubeEmbedUrl(link)}
                            title={title}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        />
                    </div>
                )}

                {/* Twitter - Embedded Tweet */}
                {actualType === 'twitter' && (
                    <div className="rounded overflow-hidden border bg-white" style={{ minHeight: '200px' }}>
                        <iframe 
                            className="w-full"
                            height="400"
                            src={getTwitterEmbedUrl(link)}
                            title={title}
                            frameBorder="0"
                            scrolling="no"
                        />
                    </div>
                )}

                {/* LinkedIn - Beautiful Card (No Embed) */}
                {actualType === 'linkedin' && (
                    <div className="border rounded overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
                        <div className="p-6 text-center">
                            {/* LinkedIn Logo */}
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-3">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </div>
                            
                            <p className="text-gray-700 font-medium mb-1">LinkedIn Post</p>
                            <p className="text-sm text-gray-500 mb-4">
                                LinkedIn doesn't allow embedded previews
                            </p>
                            
                            {/* CTA Button */}
                            <a 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
                            >
                                <span>View on LinkedIn</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                        
                        {/* Footer with URL */}
                        <div className="px-4 py-3 bg-white border-t border-blue-200">
                            <p className="text-xs text-gray-500 truncate">
                                {new URL(link).hostname}
                            </p>
                        </div>
                    </div>
                )}

                {/* Other - Simple Link */}
                {actualType === 'other' && (
                    <div className="border rounded p-4 bg-gray-50 hover:bg-gray-100 transition">
                        <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline text-sm break-all font-medium"
                        >
                            {link}
                        </a>
                    </div>
                )}
            </div>

            {/* Tags Display */}
            {tags && tags.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                    {tags.map((tag) => (
                        <span
                            key={tag._id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                            🏷️ {tag.title}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <span>{getTypeIcon()}</span>
                        <span>{getTypeName()}</span>
                    </span>
                    <span className="text-xs truncate max-w-[150px]">
                        {new URL(link).hostname}
                    </span>
                </div>
            </div>
        </div>
    );
}