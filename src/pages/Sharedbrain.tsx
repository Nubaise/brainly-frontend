import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Content {
    _id: string;
    title: string;
    link?: string;
    type?: "twitter" | "youtube" | "linkedin" | "other";
}

function getYouTubeEmbedUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com')) {
            const videoId = urlObj.searchParams.get('v');
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }
        if (urlObj.hostname.includes('youtu.be')) {
            const videoId = urlObj.pathname.slice(1);
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    } catch {
        return url;
    }
}

function getTwitterEmbedUrl(url: string): string {
    const twitterUrl = url.replace('x.com', 'twitter.com');
    const match = twitterUrl.match(/status\/(\d+)/);
    if (match) {
        return `https://platform.twitter.com/embed/Tweet.html?id=${match[1]}`;
    }
    return twitterUrl;
}

function ContentCard({ content }: { content: Content }) {
    const type = content.type || 'other';
    const link = content.link || '';

    return (
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-md p-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">
                    {type === 'twitter' && '🐦'}
                    {type === 'youtube' && '▶️'}
                    {type === 'linkedin' && '💼'}
                    {type === 'other' && '🔗'}
                </span>
                <h3 className="font-semibold text-gray-800 truncate">{content.title}</h3>
            </div>

            {/* Content */}
            <div className="mt-3">
                {type === 'youtube' && (
                    <div className="rounded overflow-hidden bg-black">
                        <iframe 
                            className="w-full"
                            height="200"
                            src={getYouTubeEmbedUrl(link)}
                            title={content.title}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        />
                    </div>
                )}

                {type === 'twitter' && (
                    <div className="rounded overflow-hidden border bg-white" style={{ minHeight: '200px' }}>
                        <iframe 
                            className="w-full"
                            height="400"
                            src={getTwitterEmbedUrl(link)}
                            title={content.title}
                            frameBorder="0"
                            scrolling="no"
                        />
                    </div>
                )}

                {type === 'linkedin' && (
                    <div className="border rounded p-4 bg-blue-50">
                        <p className="text-sm text-gray-600 mb-2">LinkedIn Post</p>
                        <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline text-sm font-medium"
                        >
                            View on LinkedIn →
                        </a>
                    </div>
                )}

                {type === 'other' && (
                    <div className="border rounded p-4 bg-gray-50">
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

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                    <a 
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="truncate ml-2 max-w-[200px] hover:text-purple-600"
                    >
                        {new URL(link).hostname}
                    </a>
                </div>
            </div>
        </div>
    );
}

export function SharedBrain() {
    const { shareLink } = useParams();
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSharedContents();
    }, [shareLink]);

    async function fetchSharedContents() {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_URL}/api/v1/brain/${shareLink}`);
            setContents(response.data);
        } catch (error) {
            console.error("Failed to fetch shared contents:", error);
            setError("Failed to load shared brain. This link may be invalid.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-gray-600 text-lg">Loading shared brain...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🤔</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🧠</div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Shared Brain</h1>
                    <p className="text-gray-600">
                        {contents.length} {contents.length === 1 ? 'item' : 'items'} shared
                    </p>
                </div>

                {/* Content Grid */}
                {contents.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-xl text-gray-700 mb-2">This brain is empty</p>
                        <p className="text-sm text-gray-500">No content has been shared yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contents.map((content) => (
                            <ContentCard key={content._id} content={content} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}