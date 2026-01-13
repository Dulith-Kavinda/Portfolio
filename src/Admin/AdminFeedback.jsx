import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { getAdminFeedback, deleteFeedback, updateFeedbackReply } from '../adminApi';

export async function loader() {
    return getAdminFeedback();
}

export default function AdminFeedback() {
    const initialFeedback = useLoaderData();
    const [feedback, setFeedback] = useState(initialFeedback || []);
    const [filterRating, setFilterRating] = useState('all');
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        // Debug: Log the feedback data
        if (initialFeedback) {
            setFeedback(initialFeedback);
        }
    }, [initialFeedback]);

    const handleDelete = async (feedbackId) => {
        if (!confirm('Are you sure you want to delete this feedback?')) return;

        try {
            await deleteFeedback(feedbackId);
            setFeedback(feedback.filter((f) => f.docId !== feedbackId));
            alert('Feedback deleted successfully!');
        } catch (error) {
            console.error('Error deleting feedback:', error);
            alert('Failed to delete feedback.');
        }
    };

    const handleReply = async (feedbackDocId) => {
        if (!replyText.trim()) {
            alert('Please enter a reply');
            return;
        }

        try {
            await updateFeedbackReply(feedbackDocId, replyText);
            setFeedback(
                feedback.map((f) =>
                    f.docId === feedbackDocId
                        ? {
                              ...f,
                              reply: replyText,
                          }
                        : f
                )
            );
            setReplyText('');
            setSelectedFeedback(null);
            alert('Reply added successfully!');
        } catch (error) {
            console.error('Error adding reply:', error);
            alert('Failed to add reply.');
        }
    };

    const filteredFeedback = feedback.filter((f) => {
        if (filterRating === 'all') return true;
        return f.rating === parseInt(filterRating);
    });

    const stats = {
        total: feedback.length,
        avgRating: (
            feedback.reduce((acc, f) => acc + (f.rating || 0), 0) / (feedback.length || 1)
        ).toFixed(1),
        fiveStars: feedback.filter((f) => f.rating === 5).length,
        withReplies: feedback.filter((f) => f.reply).length,
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Feedback Management</h1>
                <p className="text-amber-400/70">View and manage user feedback with replies</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-950 rounded-lg p-4 border border-amber-600/30">
                    <div className="text-amber-400/70 text-sm mb-1">Total Feedback</div>
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                </div>
                <div className="bg-slate-950 rounded-lg p-4 border border-amber-600/30">
                    <div className="text-amber-400/70 text-sm mb-1">Average Rating</div>
                    <div className="text-2xl font-bold text-yellow-400">
                        ⭐ {stats.avgRating}
                    </div>
                </div>
                <div className="bg-slate-950 rounded-lg p-4 border border-amber-600/30">
                    <div className="text-amber-400/70 text-sm mb-1">5-Star Reviews</div>
                    <div className="text-2xl font-bold text-green-400">{stats.fiveStars}</div>
                </div>
                <div className="bg-slate-950 rounded-lg p-4 border border-amber-600/30">
                    <div className="text-amber-400/70 text-sm mb-1">With Replies</div>
                    <div className="text-2xl font-bold text-amber-400">{stats.withReplies}</div>
                </div>
            </div>

            {/* Filter */}
            <div className="mb-6 flex space-x-2 flex-wrap">
                <button
                    onClick={() => setFilterRating('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        filterRating === 'all'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                            : 'bg-slate-950 text-amber-400/70 hover:bg-amber-600/10'
                    }`}
                >
                    All
                </button>
                {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                        key={rating}
                        onClick={() => setFilterRating(rating.toString())}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filterRating === rating.toString()
                                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                                : 'bg-slate-950 text-amber-400/70 hover:bg-amber-600/10'
                        }`}
                    >
                        {'⭐'.repeat(rating)}
                    </button>
                ))}
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
                {filteredFeedback.length > 0 ? (
                    filteredFeedback.map((item) => (
                    <div
                        key={item.docId}
                        className="bg-slate-950 rounded-lg border border-amber-600/30 hover:border-amber-600/20 transition-colors"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-semibold text-white">
                                            {item.name || 'Anonymous'}
                                        </h3>
                                        <span className="text-yellow-400 text-sm">
                                            {'⭐'.repeat(item.rating || 0)}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 mb-3">{item.message}</p>

                                    {/* Reacts */}
                                    <div className="flex items-center space-x-4 mb-3 text-sm">
                                        <span className="text-green-400">
                                            👍 {item.reacts?.like || 0} Likes
                                        </span>
                                        <span className="text-red-400">
                                            👎 {item.reacts?.dislike || 0} Dislikes
                                        </span>
                                    </div>

                                    {/* Reply Display */}
                                    {item.reply && (
                                        <div className="bg-blue-900/20 border border-blue-600/30 rounded p-3 mb-3">
                                            <p className="text-amber-300 text-sm font-semibold mb-1">
                                                Admin Reply:
                                            </p>
                                            <p className="text-gray-300 text-sm">{item.reply}</p>
                                        </div>
                                    )}

                                    {/* Date */}
                                    {item.createAt && (
                                        <p className="text-gray-500 text-xs">
                                            {new Date(item.createAt.seconds * 1000).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setSelectedFeedback(item)}
                                    className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded text-sm transition-colors"
                                >
                                    {item.reply ? 'Edit Reply' : 'Reply'}
                                </button>

                                <button
                                    onClick={() => handleDelete(item.docId)}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))
                ) : (
                    <div className="text-center py-12 bg-slate-950 rounded-lg border border-amber-600/30">
                        <svg
                            className="w-16 h-16 text-gray-600 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                        <p className="text-gray-300 text-lg mb-2">No feedback found</p>
                        <p className="text-gray-500 text-sm">
                            {filterRating !== 'all'
                                ? `No ${filterRating}-star feedback available`
                                : 'Users can submit feedback from your website'}
                        </p>
                    </div>
                )}
            </div>

            {/* Reply Modal */}
            {selectedFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-950 rounded-lg max-w-2xl w-full">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-2xl font-bold text-white">Add Reply</h2>
                                <button
                                    onClick={() => {
                                        setSelectedFeedback(null);
                                        setReplyText('');
                                    }}
                                    className="text-amber-400/70 hover:text-white"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                                <h3 className="text-white font-semibold mb-2">
                                    {selectedFeedback.name}
                                </h3>
                                <p className="text-gray-300 mb-2">{selectedFeedback.message}</p>
                                <div className="flex items-center space-x-3">
                                    <span className="text-yellow-400">
                                        {'⭐'.repeat(selectedFeedback.rating || 0)}
                                    </span>
                                    <span className="text-green-400 text-sm">
                                        👍 {selectedFeedback.reacts?.like || 0}
                                    </span>
                                    <span className="text-red-400 text-sm">
                                        👎 {selectedFeedback.reacts?.dislike || 0}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Your Reply
                                </label>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write your reply here..."
                                    rows={5}
                                    className="w-full px-4 py-2 bg-gray-700 text-white border border-amber-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setSelectedFeedback(null);
                                        setReplyText('');
                                    }}
                                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReply(selectedFeedback.docId)}
                                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:bg-gradient-to-r from-amber-600 to-orange-700 transition-colors"
                                >
                                    Send Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


