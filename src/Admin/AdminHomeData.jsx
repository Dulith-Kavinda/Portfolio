import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { getAdminHomeData, updateHomeData } from '../adminApi';

export async function loader() {
    return getAdminHomeData();
}

export default function AdminHomeData() {
    const initialData = useLoaderData();
    const [homeData, setHomeData] = useState(initialData || []);
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingDocId, setEditingDocId] = useState(null);

    const [formData, setFormData] = useState({
        header: '',
        image: '',
        text: '',
    });

    const resetForm = () => {
        setFormData({
            header: '',
            image: '',
            text: '',
        });
        setEditingIndex(null);
        setEditingDocId(null);
    };

    // Get the homeData document that contains swiper array
    const homeDoc = homeData.find(doc => doc.swiper);
    const swiperCards = homeDoc?.swiper || [];

    const handleEdit = (card, index, docId) => {
        setEditingIndex(index);
        setEditingDocId(docId);
        setFormData({
            header: card.header || '',
            image: card.image || '',
            text: card.text || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (index) => {
        if (!confirm('Are you sure you want to delete this swiper card?')) return;

        if (!homeDoc || !homeDoc.docId) {
            alert('Error: Home data document not found. Please refresh the page.');
            return;
        }

        try {
            const updatedSwiper = swiperCards.filter((_, i) => i !== index);
            await updateHomeData(homeDoc.docId, { swiper: updatedSwiper });
            
            setHomeData(homeData.map(doc => 
                doc.docId === homeDoc.docId 
                    ? { ...doc, swiper: updatedSwiper }
                    : doc
            ));
            alert('Swiper card deleted successfully!');
        } catch (error) {
            console.error('Error deleting swiper card:', error);
            alert('Failed to delete swiper card: ' + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!homeDoc || !homeDoc.docId) {
            alert('Error: Home data document not found. Please refresh the page.');
            return;
        }

        try {
            let updatedSwiper;
            
            if (editingIndex !== null) {
                // Update existing card
                updatedSwiper = swiperCards.map((card, i) => 
                    i === editingIndex ? formData : card
                );
            } else {
                // Add new card
                updatedSwiper = [...swiperCards, formData];
            }

            await updateHomeData(homeDoc.docId, { swiper: updatedSwiper });
            
            setHomeData(homeData.map(doc => 
                doc.docId === homeDoc.docId 
                    ? { ...doc, swiper: updatedSwiper }
                    : doc
            ));
            
            setShowModal(false);
            resetForm();
            alert(editingIndex !== null ? 'Swiper card updated successfully!' : 'Swiper card created successfully!');
        } catch (error) {
            console.error('Error saving swiper card:', error);
            alert('Failed to save swiper card: ' + error.message);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Swiper Cards Management</h1>
                    <p className="text-amber-400/70">Manage homepage swiper carousel cards</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:bg-gradient-to-r from-amber-600 to-orange-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Swiper Card</span>
                </button>
            </div>

            {/* Swiper Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {swiperCards.map((card, index) => (
                    <div key={index} className="bg-slate-950 rounded-lg overflow-hidden border border-amber-600/30 hover:border-amber-600/20 transition-colors">
                        {card.image && (
                            <div className="h-48 overflow-hidden bg-black">
                                <img
                                    src={card.image}
                                    alt={card.header}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs">
                                    Card #{index + 1}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{card.header || 'Untitled'}</h3>
                            <p className="text-amber-400/70 text-sm mb-4 line-clamp-3">
                                {card.text || 'No description'}
                            </p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(card, index, homeDoc.docId)}
                                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:bg-gradient-to-r from-amber-600 to-orange-700 text-white px-4 py-2 rounded transition-colors text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {swiperCards.length === 0 && (
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
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                    </svg>
                    <p className="text-amber-400/70">No swiper cards yet. Create your first one!</p>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-950 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                {editingIndex !== null ? 'Edit Swiper Card' : 'Create New Swiper Card'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Header</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.header}
                                        onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-700 text-white border border-amber-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="e.g., HTML, CSS & JS"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-700 text-white border border-amber-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="https://example.com/image.png"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description Text
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.text}
                                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-700 text-white border border-amber-600/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="Describe the skill or technology..."
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
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
                                        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:bg-gradient-to-r from-amber-600 to-orange-700 transition-colors"
                                    >
                                        {editingIndex !== null ? 'Update' : 'Create'}
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


