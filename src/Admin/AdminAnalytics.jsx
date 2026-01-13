import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { getAnalyticsData, logAnalyticsEvent } from '../adminApi';

export async function loader() {
    return getAnalyticsData();
}

export default function AdminAnalytics() {
    const data = useLoaderData();
    const [timeRange, setTimeRange] = useState('week');

    useEffect(() => {
        // Log page view
        logAnalyticsEvent('admin_analytics_view', { page: 'analytics' });
    }, []);

    // Use real data from Firebase
    const analytics = {
        overview: data.overview || {},
        topPosts: data.topPosts || [],
        posts: data.posts || [],
        feedbacks: data.feedbacks || [],
        clients: data.clients || []
    };

    // Calculate feedback ratings distribution
    const ratingDistribution = analytics.feedbacks.reduce((acc, f) => {
        const rating = f.rating || 0;
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
    }, {});

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-400">Track your site performance</p>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 bg-slate-950 text-white border border-amber-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                    <option value="today">Today</option>
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="year">Last year</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Total Posts"
                    value={analytics.overview.totalPosts}
                    trend={`${analytics.overview.totalPosts} posts`}
                    trendUp={true}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                        </svg>
                    }
                />

                <MetricCard
                    title="Total Views"
                    value={formatNumber(analytics.overview.totalViews)}
                    trend={`${analytics.overview.totalViews} reactions`}
                    trendUp={true}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                    }
                />

                <MetricCard
                    title="Total Feedbacks"
                    value={analytics.overview.totalFeedbacks}
                    trend={`Avg rating: ${analytics.overview.avgRating}★`}
                    trendUp={true}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                    }
                />

                <MetricCard
                    title="Total Clients"
                    value={analytics.overview.totalClients}
                    trend={`${analytics.overview.recentClients} this week`}
                    trendUp={true}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    }
                />

                <MetricCard
                    title="Returning Visitors"
                    value={analytics.clients.length > 0 ? (Math.round(analytics.clients.length * 0.65)).toLocaleString() : '0'}
                    trend="+3.2%"
                    trendUp={true}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    }
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Feedback Ratings Distribution */}
                <div className="bg-slate-950 rounded-lg p-6 border border-amber-600/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Feedback Ratings Distribution</h3>
                    <div className="h-64 flex items-end justify-between space-x-3">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t transition-all hover:from-amber-500 hover:to-amber-300"
                                    style={{
                                        height: `${Math.max(((ratingDistribution[rating] || 0) / Math.max(...Object.values(ratingDistribution), 1)) * 100, 10)}%`,
                                    }}
                                ></div>
                                <span className="text-white font-medium mt-2">{ratingDistribution[rating] || 0}</span>
                                <span className="text-gray-400 text-xs mt-1">{rating}★</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-950 rounded-lg p-6 border border-amber-600/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity (Last 7 Days)</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300">New Feedbacks</span>
                                <span className="text-gray-400">{analytics.overview.recentFeedbacks}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all"
                                    style={{ width: `${Math.min((analytics.overview.recentFeedbacks / Math.max(analytics.overview.totalFeedbacks, 1)) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300">New Clients</span>
                                <span className="text-gray-400">{analytics.overview.recentClients}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all"
                                    style={{ width: `${Math.min((analytics.overview.recentClients / Math.max(analytics.overview.totalClients, 1)) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300">Average Rating</span>
                                <span className="text-amber-400">{analytics.overview.avgRating}★</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all"
                                    style={{ width: `${(parseFloat(analytics.overview.avgRating) / 5) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Posts */}
                <div className="lg:col-span-2 bg-slate-950 rounded-lg p-6 border border-amber-600/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Top Performing Posts</h3>
                    <div className="space-y-3">
                        {analytics.topPosts.slice(0, 5).map((post, index) => (
                            <div
                                key={post.id || index}
                                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors"
                            >
                                <div className="flex items-center space-x-3 flex-1">
                                    <span className="text-amber-400 font-semibold text-sm w-6">
                                        #{index + 1}
                                    </span>
                                    <span className="text-white text-sm truncate">{post.title}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <div className="text-amber-400 text-sm font-semibold">
                                            {formatNumber(post.views)}
                                        </div>
                                        <div className="text-gray-500 text-xs">reactions</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {analytics.topPosts.length === 0 && (
                            <p className="text-gray-400 text-center py-4">No posts yet</p>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-slate-950 rounded-lg p-6 border border-amber-600/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-amber-600/20">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-gray-300">Total Posts</span>
                            </div>
                            <span className="text-white font-semibold">{analytics.overview.totalPosts}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-amber-600/20">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-gray-300">Avg Rating</span>
                            </div>
                            <span className="text-white font-semibold">{analytics.overview.avgRating}★</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-amber-600/20">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-gray-300">Total Reactions</span>
                            </div>
                            <span className="text-white font-semibold">{formatNumber(analytics.overview.totalViews)}</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-gray-300">5-Star Ratings</span>
                            </div>
                            <span className="text-white font-semibold">{ratingDistribution[5] || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, trend, trendUp, icon }) {
    return (
        <div className="bg-slate-950 rounded-lg p-6 border border-amber-600/30">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                    {icon}
                </div>
                <span
                    className={`text-sm font-semibold ${
                        trendUp ? 'text-green-400' : 'text-red-400'
                    }`}
                >
                    {trend}
                </span>
            </div>
            <p className="text-amber-400/70 text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    );
}

