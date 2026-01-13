import { useState, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { getAdminPosts, deletePost } from '../adminApi';

export async function loader() {
    return getAdminPosts();
}

export default function AdminDashboard() {
    const initialData = useLoaderData();
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalViews: 0,
        totalFeedback: 0,
        recentActivity: 0,
    });

    useEffect(() => {
        // Calculate stats from loaded data
        setStats({
            totalPosts: initialData?.length || 0,
            totalViews: initialData?.reduce((acc, post) => acc + (post.views || 0), 0) || 0,
            totalFeedback: 0,
            recentActivity: initialData?.filter(
                (post) =>
                    post.createdAt &&
                    new Date(post.createdAt.seconds * 1000) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length || 0,
        });
    }, [initialData]);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-amber-400/70">Welcome to your admin panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Posts"
                    value={stats.totalPosts}
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
                    color="from-amber-500 to-orange-600"
                />

                <StatCard
                    title="Total Views"
                    value={stats.totalViews}
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
                    color="from-amber-500 to-orange-600"
                />

                <StatCard
                    title="Feedback"
                    value={stats.totalFeedback}
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
                    color="from-amber-500 to-orange-600"
                />

                <StatCard
                    title="Recent Activity"
                    value={stats.recentActivity}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    }
                    color="from-orange-500 to-orange-600"
                />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="Create New Post"
                        description="Add a new blog post"
                        link="/admin/posts"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        }
                    />
                    <QuickActionCard
                        title="Manage Home Data"
                        description="Update homepage content"
                        link="/admin/home-data"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        }
                    />
                    <QuickActionCard
                        title="View Feedback"
                        description="Check user feedback"
                        link="/admin/feedback"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Recent Posts */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Recent Posts</h2>
                <div className="bg-slate-950 rounded-lg overflow-hidden border border-amber-600/30">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-amber-600/10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase tracking-wider">
                                        Tags
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-600/20">
                                {initialData?.slice(0, 5).map((post) => (
                                    <tr key={post.id} className="hover:bg-amber-600/5">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                            {post.postTitle || 'Untitled'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {post.postTags?.slice(0, 2).join(', ')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {post.createdAt
                                                ? new Date(
                                                      post.createdAt.seconds * 1000
                                                  ).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            <button className="text-amber-400 hover:text-amber-300 mr-3">
                                                Edit
                                            </button>
                                            <button className="text-red-400 hover:text-red-300">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-slate-950 rounded-lg p-6 border border-amber-600/30 hover:border-amber-600/60 transition-colors">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-amber-400/70 text-sm mb-1">{title}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>{icon}</div>
            </div>
        </div>
    );
}

function QuickActionCard({ title, description, link, icon }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(link)}
            className="bg-slate-950 rounded-lg p-6 border border-amber-600/30 hover:border-amber-500 transition-all hover:transform hover:scale-105 text-left"
        >
            <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">{icon}</div>
                <div>
                    <h3 className="text-white font-semibold mb-1">{title}</h3>
                    <p className="text-amber-400/70 text-sm">{description}</p>
                </div>
            </div>
        </button>
    );
}

