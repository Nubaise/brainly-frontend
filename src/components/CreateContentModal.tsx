import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface CreateContentModalProps {
    open: boolean;
    onClose: () => void;
}

type ContentType = "twitter" | "youtube" | "linkedin" | "other";

export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [contentType, setContentType] = useState<ContentType>("twitter");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;

        if (!title) {
            alert("Title is required");
            return;
        }

        if (!link) {
            alert("Link is required");
            return;
        }

        // Validate link format
        try {
            new URL(link);
        } catch {
            alert("Please enter a valid URL (e.g., https://example.com)");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${BACKEND_URL}/api/v1/content`,
                {
                    title,
                    link,
                    type: contentType,
                    tags: tags
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert("Content added successfully!");
            
            // Reset form
            if (titleRef.current) titleRef.current.value = "";
            if (linkRef.current) linkRef.current.value = "";
            setTags([]);
            setTagInput("");
            setContentType("twitter");
            
            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || "Failed to add content");
            } else {
                alert("Failed to add content");
            }
        }
    }

    function addTag() {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setTagInput("");
        }
    }

    function removeTag(tagToRemove: string) {
        setTags(tags.filter(tag => tag !== tagToRemove));
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    }

    if (!open) return null;

    return (
        <div className="w-screen h-screen fixed top-0 left-0 bg-slate-500 bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Add New Content</h2>
                    <div onClick={onClose} className="cursor-pointer text-gray-500 hover:text-gray-700">
                        <CrossIcon />
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <Input ref={titleRef} placeholder="Enter title" />
                    </div>

                    {/* Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link *
                        </label>
                        <Input 
                            ref={linkRef} 
                            placeholder="https://example.com" 
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enter full URL (e.g., https://twitter.com/user/status/123)
                        </p>
                    </div>

                    {/* Content Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content Type
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setContentType("twitter")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    contentType === "twitter"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                🐦 Twitter
                            </button>
                            <button
                                type="button"
                                onClick={() => setContentType("youtube")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    contentType === "youtube"
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                ▶️ YouTube
                            </button>
                            <button
                                type="button"
                                onClick={() => setContentType("linkedin")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    contentType === "linkedin"
                                        ? "bg-blue-700 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                💼 LinkedIn
                            </button>
                            <button
                                type="button"
                                onClick={() => setContentType("other")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    contentType === "other"
                                        ? "bg-purple-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                🔗 Other
                            </button>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags (optional)
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Add a tag..."
                                className="flex-1 border rounded px-3 py-2 text-sm"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                            >
                                Add
                            </button>
                        </div>
                        
                        {/* Tag List */}
                        {tags.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="text-purple-500 hover:text-purple-700"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Cancel
                    </button>
                    <Button onClick={addContent} variant="primary" text="Add Content" />
                </div>
            </div>
        </div>
    );
}