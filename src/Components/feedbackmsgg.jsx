import React, { useState } from 'react';
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import app from '../firebase';

const FeedbackMsg = ({ feedback }) => {
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)
    const [likeReact, setLikeReact] = useState(feedback.reacts.like)
    const [dislikeReact, setDislikeReact] = useState(feedback.reacts.dislike)

    const db = getFirestore(app);


    const handleReaction = async (reaction) => {
        var result = likeReact
        var result2 = dislikeReact
        if (reaction === 'like') {
            result = like ? likeReact - 1 : likeReact + 1
            result2 = dislike ? dislikeReact - 1 : dislikeReact
            setLike(!like);
            setDislike(false);
        } else {
            result2 = dislike ? dislikeReact - 1 : dislikeReact + 1
            result = like ? likeReact - 1 : likeReact
            setDislike(!dislike);
            setLike(false);
        }
        setDislikeReact(result2)
        setLikeReact(result)
        try {
            const feedbackRef = doc(db, "feedbacks", String(feedback.id));
            await updateDoc(feedbackRef, {
                reacts: {
                    like: result,
                    dislike: result2
                }
            });
        } catch (e) {
            alert("Error updating document: ", e);
        }
    };

    function replacetime(firebaseDate) {
        if (!firebaseDate) {
            return "Date processing"
        }

        const date = firebaseDate.toDate()

        const day = date.getDate()
        const year = date.getFullYear()

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const month = monthNames[date.getMonth()]

        let hours = date.getHours()
        let minutes = date.getMinutes()
        hours = hours < 10 ? "0" + hours : hours
        minutes = minutes < 10 ? "0" + minutes : minutes

        return `${day} ${month} ${year} - ${hours}:${minutes}`
    }
    return (
        <div className="space-y-4">
            <div key={feedback.id} className="rounded shadow-sm flex relative">
                <span className="w-[35px] h-[35px] flex items-center justify-center bg-[#ECB897] dark:bg-[#602703] dark:text-white rounded-full text-[15px] font-semibold font-legendary absolute">{feedback.name.trim()[0].toUpperCase()}</span>
                <div className='ml-[50px] min-w-[300px] bg-[#F7A673] dark:bg-[#241207] p-2 rounded-tr-[15px] rounded-bl-[15px] rounded-br-[15px] mt-[10px]'>
                    <div className="flex items-center justify-between">
                        <div className='flex items-center'>
                            <h3 className="text-lg font-semibold text-[9px] lg:text-[12px] max-w-[200px] truncate dark:text-slate-200 mr-[15px]">{feedback.name}</h3>
                            <div className="text-amber-700 drop-shadow-xl dark:text-yellow-500 text-[15px] ">
                                {'★'.repeat(Number(feedback.rating))}{'☆'.repeat(5 - Number(feedback.rating))}
                            </div>
                        </div>
                        <small className="text-[11px] text-[#4C3F33] dark:text-[#B4967E] ml-[5px]">{replacetime(feedback.createAt)}</small>
                    </div>
                    <p className="mt-4 text-[#4C3F33] dark:text-[#B4967E] text-[11px]">{feedback.message}</p>
                    <div className="flex items-center mt-2 space-x-2">
                        <button
                            className="flex items-center space-x-1  text-[#4C3F33] dark:text-[#B4967E] mr-2"
                            onClick={() => handleReaction('like')}
                        >
                            <i className={like ? 'fa-solid fa-thumbs-up text-blue-600 text-[15px]' : 'text-[15px] fa-regular fa-thumbs-up'} />
                            <span className='text-[11px]'>{likeReact}</span>
                        </button>
                        <button
                            className="flex items-center space-x-1 text-[#4C3F33] dark:text-[#B4967E]"
                            onClick={() => handleReaction('dislike')}
                        >
                            <i className={dislike ? 'fa-solid fa-thumbs-down text-red-600 text-[15px]' : 'text-[15px] fa-regular fa-thumbs-down'} />
                            <span className='text-[11px]'>{dislikeReact}</span>
                        </button>
                    </div>
                    {feedback.reply != '' && <div className='flex items-center ml-[50px] p-2 mt-[10px]'>
                        <span className='bg-[#ECB897] dark:bg-[#3f1d08] p-3 dark:text-slate-200 text-[10px]  rounded-br-[15px] rounded-tr-[15px] rounded-bl-[15px]'>{feedback.reply}</span>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default FeedbackMsg;
