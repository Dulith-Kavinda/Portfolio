import { getFirestore, collection, getDocs,query, orderBy } from 'firebase/firestore';
import app from './firebase';


const db = getFirestore(app);


export async function getHomeData(){
    const q = query(collection(db, "homeData"), orderBy("id", "asc"));
    const querySnapshot = await getDocs(q);
    const homeData = querySnapshot.docs.map(doc => ({
        ...doc.data()
    }
    ));
    return homeData

}

export async function getPost(){
    const q = query(collection(db, "posts"), orderBy("id", "asc"));
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({
        ...doc.data()
    }
    ));
    return posts

}

