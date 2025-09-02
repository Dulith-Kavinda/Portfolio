import feddbackbackdrop from '../assets/feedbackbackdrop.jpg'
import { useEffect, useState } from 'react';
import FeedbackMsg from './feedbackmsgg';
import { getFirestore, collection, addDoc, serverTimestamp, } from "firebase/firestore";
import app from '../firebase';

import { onSnapshot, query, orderBy } from 'firebase/firestore';

function Feedback() {
    const [rating, setRating] = useState(null);
    const [submiting, setSubmiting] = useState(false);
    const [hover, setHover] = useState(null);
    const [name, setName] = useState('')
    const [message, setMessage] = useState("");
    const [display, setDisplay] = useState(false);
    const [feedbacksData, setFeedbacksData] = useState()

    // const feedbacksData = [
    //     {
    //         id: 1,
    //         name: ' hgshgf sdsfs fsf sf hfhf',
    //         message: "Great work hhg hf fh fhf hfh fhf hf hfh fhf h fhf hfhf hfh f f ddf  dfd fd  fd fhfhfhfhfh hfhfhfhjj!",
    //         rating: 4,
    //         reacts: {
    //             like: 2,
    //             dislike: 1
    //         },
    //         reply: 'great work!',
    //     },
    //     {
    //         id: 2,
    //         name: 'hgshgfhf',
    //         message: "I love tgffffffffffffffffffffffffffffffffffffffff d  d  d d  d   d  s  a AS SSSD D    s d  sd dhis app!",
    //         rating: 4,
    //         reacts: {
    //             like: 2,
    //             dislike: 1
    //         },
    //         reply: 'hghgghg f',
    //     },
    //     {
    //         id: 3,
    //         name: 'hgshgfhf',
    //         message: "I love this app!",
    //         rating: 4,
    //         reacts: {
    //             like: 2,
    //             dislike: 1
    //         },
    //         reply: ' love tgffffffffffffffffffffffffffffffffffffffff d  d  d d  d   d  s  a AS SSSD D    s d  sd dhis ap',
    //     },
    // ]
    const db = getFirestore(app);

    const handelSubmit = async (e) => {
        e.preventDefault();
        setSubmiting(true)
        try {
            if (rating && message && name) {
                const docRef = await addDoc(collection(db, "feedbacks"), {
                    createAt: serverTimestamp(),
                    name: name,
                    message: message,
                    rating: rating,
                    reply: '',
                    reacts: {
                        like: 0,
                        dislike: 0
                    }
                });
            } else {
                alert('Please give your rating.')
            }
            setMessage("");
            setName('')
            setRating(null);
            setDisplay(false);
            setSubmiting(false)
        } catch (e) {
            alert("Error adding document: ", e);
            setSubmiting(false)
        }
    };

    useEffect(() => {
        const q = query(collection(db, 'feedbacks'), orderBy('createAt'))
        onSnapshot(q, (querySnapshot) => {
            const fmassages = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))
            setFeedbacksData(fmassages)

        }, [])
    })



    return (
        <div className="w-[100%] flex justify-center bg-slate-200 dark:bg-black">
            {/* All home content within next div tag */}
            <div className='max-w-[1800px] w-[100%] h-[100vh] min-h-[700px] relative overflow-hidden bg-[#EFB793] dark:bg-[#120A05] flex items-center justify-center'>
                <img className='w-[100%] h-[100vh] min-h-[700px] mix-blend-overlay fixed z-[0] top-0' src={feddbackbackdrop} />
                <div className='feedback-content w-[90%] h-[100%] flex items-center justify-around z-[1]'>
                    <div className='rate w-[300px] h-[100px] flex flex-col justify-center items-center dark:bg-transparent bg-[#F7A673] rounded-lg'>
                        <h1 className='text-[20px] dark:text-slate-200 font-bold ml-[5px] mb-[5px] w-[150px] font-legendary'>Rate Us:</h1>
                        <div className='rate-stars'>
                            <div className='star-rating flex '>
                                {[...Array(5)].map((star, index) => {
                                    const ratingValue = index + 1;

                                    return (
                                        <label key={index}>
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={ratingValue}
                                                onClick={() => setRating(ratingValue)}
                                                className="hidden"
                                            />
                                            <i className={ratingValue <= (hover || rating) ? "stars fa-solid fa-star text-yellow-400 dark:text-amber-300 text-2xl mr-[3px]" : "stars mr-[3px] fa-regular fa-star text-yellow-400 dark:text-amber-300 text-2xl "} onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(null)}></i>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='send w-[500px] h-[65%] flex flex-col relative overflow-hidden'>
                        <div className='w-[100%] h-[90%] overflow-y-auto'>
                            {feedbacksData && feedbacksData.map((feedbackd, index) => {
                                return <FeedbackMsg key={index} feedback={feedbackd} />
                            })}
                        </div>
                        <div className={display ? 'w-[100%] h-[300px] flex flex-col justify-center items-center duration-300 absolute bottom-0 dark:bg-[#241207] bg-[#F7A673]' : ' w-[100%] bg-[#F7A673] duration-300 absolute bottom-[-260px] h-[300px] overflow-hidden flex flex-col items-center justify-center dark:bg-[#241207]'}>
                            <button className='w-[90%] h-[40px] dark:text-white text-[15px] flex items-center mb-[20px] relative top-[10px] justify-center' onClick={() => setDisplay(!display)}>{display ? '< Back' : '+ Add feedback'}</button>
                            <form className='w-[98%] h-[260px] flex flex-col justify-center' onSubmit={handelSubmit}>
                                <label for="website-admin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 text-sm text-gray-900 border border-e-0 border-[#E88A4E] dark:border-[#602703] rounded-s-md bg-[#EAB796] dark:bg-[#341A05] dark:text-gray-400 dark:border-[#573519]">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                                        </svg>
                                    </span>
                                    <input type="text" id="website-admin" className="focus-visible:outline-none placeholder-gray-500 rounded-none rounded-e-lg border border-[#E88A4E]  dark:border-[#602703] dark:text-gray-900 focus:ring-amber-800 focus:border-amber-800 block flex-1 min-w-0 w-full text-sm p-2.5  bg-[#EAB796] dark:bg-[#341A05] dark:border-[#573519] dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-amber-700" value={name} placeholder="Steven Grant Rogers" onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-[10px]">Your message</label>
                                <textarea id="message" rows="4" className="focus-visible:outline-none block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-[#E88A4E] dark:border-[#602703] focus:ring-amber-800 focus:border-amber-800 bg-[#EAB796] dark:bg-[#341A05] dark:border-[#573519] placeholder-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-amber-700" placeholder="Leave a comment..." value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                                <div className="w-[100%] flex items-center justify-center">
                                    <button type="submit" className="inline-flex justify-center w-[200px] h-[40px] felx items-center bg-[#F8C49D] justify-center ml-[5px] text-blue-600 rounded-md cursor-pointer dark:bg-[#341A05] hover:bg-[#EAC6AB] dark:text-blue-500 dark:hover:bg-[#3F342B] mt-[20px] mb-[10px]" disabled={submiting}>
                                        <span className='text-[15px] text-black dark:text-slate-200 mr-[10px]'>{submiting ? 'Submiting...' : 'Submit'}</span>
                                        <svg className="w-5 h-5 rotate-90 rtl:-rotate-90 ml-[10px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#FF6B1C" viewBox="0 0 18 20">
                                            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                                        </svg>
                                    </button>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feedback