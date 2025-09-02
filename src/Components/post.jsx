import { useState } from "react";
import { doc, updateDoc, getFirestore, where,query,collection } from "firebase/firestore";
import app from "../firebase";

const Post = ({ postTitle, postText, postTags, postImage, postReacts, postDate, postId }) => {
    const [seeimg, setSeeImg] = useState(false)
    const [reacts, setReacts] = useState(false)
    const [postReactsNum, setPostReactsNum] = useState(postReacts>1000 ? (postReacts/1000).toFixed(1)+'k' : postReacts)
    const [seemore, setSeemore] = useState(postText.length > 400 ? true : false)
    const maxLenght = 400
    const text = seemore ? postText.slice(0, maxLenght) + '...' : postText
    const react = Number(postReacts) > 1000 ? (Number(postReacts) / 1000).toFixed(1) + 'k' : postReacts


    const db = getFirestore(app);
    // const docRef = doc(db, "posts", );
    // console.log(docRef)
    const updateReacts = async () => {
        try {
            setReacts(!reacts);
            postReacts = reacts ? postReactsNum - 1 : postReactsNum + 1
            setPostReactsNum(postReacts>1000 ? (postReacts/1000).toFixed(1)+'k' : postReacts)
            const postRef = doc(db, "posts", String(postId));
            await updateDoc(postRef, {
                postReacts: postReacts
            });
        } catch (e) {
            alert("Error updating document: ", e);
        }
    };
    

    return (
        <>
            <div className="post-card w-[500px] bg-gradient-to-br from-[#C37442] to-[#ECB897] dark:from-[#221207] dark:to-[#341A05] rounded-md flex flex-col items-center mt-[20px] mb-[10px] z-[1]">
                <div className="text-box w-[97%]">
                    <h1 className="text-[18px] font-bold dark:text-slate-200 mt-[15px] mb-[10px] w-[100%] truncate font-legendary">{postTitle}</h1>
                    <div className="inline">
                        <p className="text-[12px] text-[#4C3F33] dark:text-[#B4967E] mb-[15px]">
                            {text}
                            {postText.length > maxLenght && <span className="text-[#E53B11] dark:text-[#FF6B1C] cursor-pointer" onClick={() => setSeemore(!seemore)}>{seemore ? 'see more' : '   see less'}</span>}
                        </p>
                    </div>
                    <div className="tags flex flex-wrap mb-[10px]">
                        {postTags.map((tag, index) => (
                            <span key={index} className="tag text-[11px] text-blue-800 dark:text-[#0C7CED] mr-[8px] cursor-pointer underline">{tag}</span>
                        ))}
                    </div>
                    <div className="post-image w-[100%] h-auto max-h-[400px] overflow-hidden mb-[15px] flex items-center justify-center cursor-pointer" onClick={() => setSeeImg(!seeimg)}>
                        <img src={postImage} alt="post" className="w-[100%] " loading="lazy" />
                    </div>

                    <div className="post-reacts relative w-[100%] flex mb-[10px]">
                        <div className="reacts flex items-center w-[100px]">
                            <i className={reacts ? "fa-solid fa-heart mr-[5px] text-red-600 text-[20px] cursor-pointer w-[20px]" : "fa-regular fa-heart mr-[5px] dark:text-slate-200 text-[20px] cursor-pointer w-[20px]"} onClick={() => updateReacts()}></i>
                            <span className="text-[12px] text-[#4C3F33] dark:text-[#B4967E] w-[50px]">{postReactsNum}</span>
                            <i className="fa-solid fa-comment-slash dark:text-slate-200 text-[20px] ml-[20px] w-[20px]"></i>
                        </div>
                        <span className="absolute right-[5px] text-[12px] text:[#4C3F33] dark:text-[#B4967E]">{postDate}</span>
                    </div>
                </div>
            </div>
            {seeimg && <div className="post-image-modal fixed top-0 left-0 w-[100%] h-[100%] bg-slate-200 dark:bg-black bg-opacity-90 z-[100] flex items-center justify-center" loading='lazy'>
                <img src={postImage} alt="post" className="w-[80%] h-[80%] object-contain" />
                <i className="fa-solid fa-times-circle dark:text-slate-200 hover:!text-red-600 text-[30px] cursor-pointer absolute top-0 right-0 m-[20px]" onClick={() => setSeeImg(!seeimg)}></i>
            </div>}
        </>
    )
}

export default Post;