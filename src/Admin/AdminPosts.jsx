import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { getAdminPosts, createPost, updatePost, deletePost } from '../adminApi';

export async function loader() {
    return getAdminPosts();
}

export default function AdminPosts() {
    const initialPosts = useLoaderData();
    const [posts, setPosts] = useState(initialPosts || []);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTag, setFilterTag] = useState('');

    const [formData, setFormData] = useState({
        id: '',
        postTitle: '',
        postText: '',
        postTags: [],
        postImage: '',
        postDate: '',
        postReacts: 0,
    });

    const resetForm = () => {
        setFormData({
            id: '',
            postTitle: '',
            postText: '',
            postTags: [],
            postImage: '',
            postDate: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
            postReacts: 0,
        });
        setCustomTag('');
        setEditingPost(null);
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({
            id: post.id || '',
            postTitle: post.postTitle || '',
            postText: post.postText || '',
            postTags: post.postTags || [],
            postImage: post.postImage || '',
            postDate: post.postDate || '',
            postReacts: post.postReacts || 0,
        });
        setShowModal(true);
    };

    const handleDelete = async (postDocId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            await deletePost(postDocId);
            setPosts(posts.filter((p) => p.docId !== postDocId));
            alert('Post deleted successfully!');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingPost) {
                await updatePost(editingPost.docId, formData);
                setPosts(posts.map((p) => (p.docId === editingPost.docId ? { ...p, ...formData } : p)));
                alert('Post updated successfully!');
            } else {
                const newPost = await createPost(formData);
                setPosts([newPost, ...posts]);
                alert('Post created successfully!');
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Failed to save post.');
        }
    };

    const filteredPosts = posts.filter((post) => {
        const matchesSearch =
            post.postTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.postDescription?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = !filterTag || post.postTags?.includes(filterTag);
        return matchesSearch && matchesTag;
    });

    // Predefined common tags
    const predefinedTags = ['#UniLife', '#Myself', '#MyProjects', '#Announcement'];
    
    // Combine predefined tags with existing tags from posts
    const existingTags = [...new Set(posts.flatMap((p) => p.postTags || []))];
    const allTags = [...new Set([...predefinedTags, ...existingTags])];
    
    const [customTag, setCustomTag] = useState('');

    const handleTagToggle = (tag) => {
        setFormData((prev) => {
            const tags = prev.postTags.includes(tag)
                ? prev.postTags.filter((t) => t !== tag)
                : [...prev.postTags, tag];
            return { ...prev, postTags: tags };
        });
    };

    const handleAddCustomTag = (e) => {
        e.preventDefault();
        if (customTag.trim() && !formData.postTags.includes(customTag.trim())) {
            setFormData((prev) => ({
                ...prev,
                postTags: [...prev.postTags, customTag.trim()],
            }));
            setCustomTag('');
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Posts Management</h1>
                    <p className="text-amber-400/70">Manage your blog posts</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    <span>Create Post</span>
                </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-[200px] px-4 py-2 bg-slate-950 text-white border border-amber-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="px-4 py-2 bg-slate-950 text-white border border-amber-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                    <option value="">All Tags</option>
                    {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>

            {/* Posts Table */}
            <div className="bg-slate-950 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Tags
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Reactions
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-600/20">
                            {filteredPosts.map((post) => (
                                <tr key={post.docId} className="hover:bg-slate-900/50">
                                    <td className="px-6 py-4 text-sm text-white">
                                        <div className="flex items-center space-x-3">
                                            {post.postImage && (
                                                <img
                                                    src={post.postImage}
                                                    alt=""
                                                    className="w-10 h-10 rounded object-cover"
                                                />
                                            )}
                                            <span className="font-medium">
                                                {post.postTitle || 'Untitled'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-amber-400/70">
                                        <div className="flex flex-wrap gap-1">
                                            {post.postTags?.slice(0, 3).map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-blue-900/30 text-amber-400 rounded text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="px-2 py-1 bg-blue-900/30 text-amber-400 rounded text-xs">
                                            {post.postReacts || 0} reacts
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-amber-400/70">
                                        {post.postDate || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="text-amber-400 hover:text-amber-300 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.docId)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-950 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                {editingPost ? 'Edit Post' : 'Create New Post'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Post ID
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, id: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-gray-700 text-white border border-amber-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="Auto-generated"
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.postTitle}
                                        onChange={(e) =>
                                            setFormData({ ...formData, postTitle: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-gray-700 text-white border border-amber-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Post Text
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.postText}
                                        onChange={(e) =>
                                            setFormData({ ...formData, postText: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-gray-700 text-white border border-amber-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                        Tags
                                    </label>
                                    
                                    {/* Existing Tags as Checkboxes */}
                                    {allTags.length > 0 && (
                                        <div className="mb-4 p-3 bg-slate-900/50 rounded-lg">
                                            <p className="text-xs text-amber-400/70 mb-2">Available Tags:</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {allTags.map((tag) => (
                                                    <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.postTags.includes(tag)}
                                                            onChange={() => handleTagToggle(tag)}
                                                            className="w-4 h-4 rounded accent-amber-500"
                                                        />
                                                        <span className="text-gray-300 text-sm">{tag}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Add New Tag */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={customTag}
                                            onChange={(e) => setCustomTag(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag(e)}
                                            placeholder="Add new tag..."
                                            className="flex-1 px-4 py-2 bg-gray-700 text-white border border-amber-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddCustomTag}
                                            className="px-3 py-2 bg-amber-600/30 hover:bg-amber-600/50 text-amber-400 rounded-lg transition-colors text-sm"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {/* Selected Tags Display */}
                                    {formData.postTags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {formData.postTags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 bg-amber-600/20 text-amber-400 rounded-full text-xs flex items-center gap-2"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTagToggle(tag)}
                                                        className="text-amber-400/70 hover:text-amber-400"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.postImage}
                                        onChange={(e) =>
                                            setFormData({ ...formData, postImage: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-gray-700 text-white border border-amber-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Post Date
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.postDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, postDate: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-gray-700 text-white border border-amber-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="e.g. 4th March 2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Reactions
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.postReacts}
                                        onChange={(e) =>
                                            setFormData({ ...formData, postReacts: parseInt(e.target.value) || 0 })
                                        }
                                        className="w-full px-4 py-2 bg-gray-700 text-white border border-amber-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-colors"
                                    >
                                        {editingPost ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


