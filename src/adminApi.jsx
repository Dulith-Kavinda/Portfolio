import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import app, { analytics } from './firebase';

const db = getFirestore(app);

// ============ Posts Management ============
export async function getAdminPosts() {
    try {
        const q = query(collection(db, 'posts'), orderBy('id', 'desc'));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map((doc) => ({
            docId: doc.id,
            ...doc.data(),
        }));
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

export async function createPost(postData) {
    try {
        const docRef = await addDoc(collection(db, 'posts'), {
            ...postData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return { id: docRef.id, ...postData };
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

export async function updatePost(postId, postData) {
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            ...postData,
            updatedAt: serverTimestamp(),
        });
        return { id: postId, ...postData };
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
}

export async function deletePost(postId) {
    try {
        await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}

// ============ Home Data Management ============
export async function getAdminHomeData() {
    try {
        const q = query(collection(db, 'homeData'), orderBy('id', 'asc'));
        const querySnapshot = await getDocs(q);
        const homeData = querySnapshot.docs.map((doc) => ({
            docId: doc.id,
            id: doc.id,
            ...doc.data(),
        }));
        return homeData;
    } catch (error) {
        console.error('Error fetching home data:', error);
        return [];
    }
}

export async function createHomeData(homeDataItem) {
    try {
        const docRef = await addDoc(collection(db, 'homeData'), {
            ...homeDataItem,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return { id: docRef.id, ...homeDataItem };
    } catch (error) {
        console.error('Error creating home data:', error);
        throw error;
    }
}

export async function updateHomeData(itemId, homeDataItem) {
    try {
        const itemRef = doc(db, 'homeData', itemId);
        await updateDoc(itemRef, {
            ...homeDataItem,
            updatedAt: serverTimestamp(),
        });
        return { id: itemId, ...homeDataItem };
    } catch (error) {
        console.error('Error updating home data:', error);
        throw error;
    }
}

export async function deleteHomeData(itemId) {
    try {
        await deleteDoc(doc(db, 'homeData', itemId));
    } catch (error) {
        console.error('Error deleting home data:', error);
        throw error;
    }
}

// ============ Feedback Management ============
export async function getAdminFeedback() {
    try {
        
        // Try to fetch with order by createAt first (note: it's createAt, not createdAt in your DB)
        try {
            const q = query(collection(db, 'feedbacks'), orderBy('createAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const feedback = querySnapshot.docs.map((doc) => {
                return {
                    docId: doc.id,
                    ...doc.data(),
                };
            });
            return feedback;
        } catch (error) {
            // If orderBy fails (no index), fetch without ordering
            const querySnapshot = await getDocs(collection(db, 'feedbacks'));
            const feedback = querySnapshot.docs.map((doc) => {
                return {
                    docId: doc.id,
                    ...doc.data(),
                };
            });
            // Sort by createAt on client side
            const sorted = feedback.sort((a, b) => {
                const timeA = a.createAt?.seconds || 0;
                const timeB = b.createAt?.seconds || 0;
                return timeB - timeA;
            });
            return sorted;
        }
    } catch (error) {
        console.error('Error fetching feedback:', error);
        console.error('Error details:', error.code, error.message);
        return [];
    }
}

export async function updateFeedbackReply(feedbackDocId, replyText) {
    try {
        const feedbackRef = doc(db, 'feedbacks', feedbackDocId);
        await updateDoc(feedbackRef, {
            reply: replyText,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating feedback reply:', error);
        throw error;
    }
}

export async function deleteFeedback(feedbackDocId) {
    try {
        await deleteDoc(doc(db, 'feedbacks', feedbackDocId));
    } catch (error) {
        console.error('Error deleting feedback:', error);
        throw error;
    }
}

// ============ Clients Management ============
export async function getAdminClients() {
    try {
        const q = query(collection(db, 'clients'), orderBy('createAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const clients = querySnapshot.docs.map((doc) => ({
            docId: doc.id,
            id: doc.id,
            ...doc.data(),
        }));
        return clients;
    } catch (error) {
        console.error('Error fetching clients:', error);
        // Fallback: try without ordering
        try {
            const querySnapshot = await getDocs(collection(db, 'clients'));
            const clients = querySnapshot.docs.map((doc) => ({
                docId: doc.id,
                id: doc.id,
                ...doc.data(),
            }));
            // Sort by createAt on client side
            return clients.sort((a, b) => {
                const timeA = a.createAt?.toDate?.() || new Date(0);
                const timeB = b.createAt?.toDate?.() || new Date(0);
                return timeB - timeA;
            });
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            return [];
        }
    }
}

export async function deleteClient(clientId) {
    try {
        await deleteDoc(doc(db, 'clients', clientId));
    } catch (error) {
        console.error('Error deleting client:', error);
        throw error;
    }
}

// ============ Analytics ============
export async function getAnalyticsData() {
    try {
        // Fetch real data from Firestore collections
        const [posts, feedbacks, clients] = await Promise.all([
            getAdminPosts(),
            getAdminFeedback(),
            getAdminClients()
        ]);

        // Calculate total page views (sum of all post reacts)
        const totalPostViews = posts.reduce((sum, post) => sum + (post.postReacts || 0), 0);
        
        // Calculate engagement metrics
        const totalFeedbacks = feedbacks.length;
        const avgRating = feedbacks.length > 0 
            ? feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length 
            : 0;
        
        // Get top posts by reactions
        const topPosts = posts
            .sort((a, b) => (b.postReacts || 0) - (a.postReacts || 0))
            .slice(0, 5)
            .map(post => ({
                title: post.postTitle,
                views: post.postReacts || 0,
                date: post.postDate,
                id: post.id
            }));

        // Calculate time-based stats (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentFeedbacks = feedbacks.filter(f => {
            const date = f.createAt?.toDate?.() || new Date(0);
            return date >= sevenDaysAgo;
        });

        const recentClients = clients.filter(c => {
            const date = c.createAt?.toDate?.() || new Date(0);
            return date >= sevenDaysAgo;
        });

        return {
            overview: {
                totalPosts: posts.length,
                totalViews: totalPostViews,
                totalFeedbacks: totalFeedbacks,
                totalClients: clients.length,
                avgRating: avgRating.toFixed(1),
                recentFeedbacks: recentFeedbacks.length,
                recentClients: recentClients.length
            },
            topPosts,
            posts,
            feedbacks,
            clients
        };
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        return {
            overview: {
                totalPosts: 0,
                totalViews: 0,
                totalFeedbacks: 0,
                totalClients: 0,
                avgRating: 0,
                recentFeedbacks: 0,
                recentClients: 0
            },
            topPosts: [],
            posts: [],
            feedbacks: [],
            clients: []
        };
    }
}

// Log analytics events
export function logAnalyticsEvent(eventName, params = {}) {
    try {
        logEvent(analytics, eventName, params);
    } catch (error) {
        console.error('Error logging analytics event:', error);
    }
}

// ============ Media/File Upload (if needed) ============
export async function uploadFile(file) {
    // This would integrate with Firebase Storage
    // Placeholder for now
    try {
        // Implementation depends on your storage solution
        console.log('File upload not yet implemented:', file.name);
        return null;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
