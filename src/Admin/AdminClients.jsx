import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { getAdminClients, deleteClient } from '../adminApi';

export async function loader() {
    return getAdminClients();
}

export default function AdminClients() {
    const initialClients = useLoaderData();
    const [clients, setClients] = useState(initialClients || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetails, setShowDetails] = useState(null);

    const handleDelete = async (docId) => {
        if (!confirm('Are you sure you want to delete this client?')) return;

        try {
            await deleteClient(docId);
            setClients(clients.filter((client) => client.docId !== docId));
            alert('Client deleted successfully!');
            setShowDetails(null);
        } catch (error) {
            console.error('Error deleting client:', error);
            alert('Failed to delete client: ' + error.message);
        }
    };

    const filteredClients = clients.filter((client) => {
        const search = searchTerm.toLowerCase();
        return (
            client.name?.toLowerCase().includes(search) ||
            client.email?.toLowerCase().includes(search) ||
            client.country?.toLowerCase().includes(search) ||
            client.contact?.toLowerCase().includes(search)
        );
    });

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Client Contacts</h1>
                <p className="text-amber-400/70">View and manage client contact submissions</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-950 p-6 rounded-lg border border-amber-600/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-400/70 text-sm mb-1">Total Clients</p>
                            <p className="text-3xl font-bold text-white">{clients.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-lg border border-amber-600/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-400/70 text-sm mb-1">Countries</p>
                            <p className="text-3xl font-bold text-white">
                                {new Set(clients.map(c => c.country).filter(Boolean)).size}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-lg border border-amber-600/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-400/70 text-sm mb-1">Latest Contact</p>
                            <p className="text-sm font-semibold text-white">
                                {clients.length > 0 ? formatDate(clients[0].createAt).split(',')[0] : 'N/A'}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name, email, country, or contact..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 text-white border border-amber-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            {/* Clients Table */}
            <div className="bg-slate-950 rounded-lg border border-amber-600/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-black">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-amber-400/70 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-amber-400/70 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-amber-400/70 uppercase tracking-wider">
                                    Country
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-amber-400/70 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-amber-400/70 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-amber-400/70 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-600/20">
                            {filteredClients.map((client) => (
                                <tr key={client.docId} className="hover:bg-amber-600/10/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{client.name || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-300">{client.email || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-300">{client.country || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-300">{client.contact || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-amber-400/70">{formatDate(client.createAt)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => setShowDetails(client)}
                                            className="text-amber-400 hover:text-amber-300 mr-3"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client.docId)}
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

                {filteredClients.length === 0 && (
                    <div className="text-center py-12">
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
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        <p className="text-amber-400/70">
                            {searchTerm ? 'No clients match your search.' : 'No client contacts yet.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-950 rounded-lg max-w-2xl w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">Client Details</h2>
                                <button
                                    onClick={() => setShowDetails(null)}
                                    className="text-amber-400/70 hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-black p-4 rounded-lg">
                                    <label className="text-sm text-amber-400/70 block mb-1">Name</label>
                                    <p className="text-white font-medium">{showDetails.name || 'N/A'}</p>
                                </div>

                                <div className="bg-black p-4 rounded-lg">
                                    <label className="text-sm text-amber-400/70 block mb-1">Email</label>
                                    <a href={`mailto:${showDetails.email}`} className="text-amber-400 hover:text-amber-300">
                                        {showDetails.email || 'N/A'}
                                    </a>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black p-4 rounded-lg">
                                        <label className="text-sm text-amber-400/70 block mb-1">Contact</label>
                                        <p className="text-white">{showDetails.contact || 'N/A'}</p>
                                    </div>

                                    <div className="bg-black p-4 rounded-lg">
                                        <label className="text-sm text-amber-400/70 block mb-1">Country</label>
                                        <p className="text-white">{showDetails.country || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="bg-black p-4 rounded-lg">
                                    <label className="text-sm text-amber-400/70 block mb-1">Submitted On</label>
                                    <p className="text-white">{formatDate(showDetails.createAt)}</p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowDetails(null)}
                                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleDelete(showDetails.docId)}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete Client
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


