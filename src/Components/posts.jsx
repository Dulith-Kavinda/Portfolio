import { useState, useEffect } from "react"
import Post from "./post"
import { getPost } from "../api";

import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

import backdrop from '../assets/postbackdrop.jpg'
import { useLoaderData } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger)

export async function loader() {
    return getPost()
}


function Posts() {
    const [seemore, setSeemore] = useState(false)
    const [filters, setFilters] = useState(['']);
    const posts = useLoaderData()

    useEffect(() => {
        ScrollTrigger.create({
            start: 'top -30',
            end: 99999,
            toggleClass: {
                className: 'post-header-scrolled',
                targets: '.post-header'
            }
        });
    }, [])


    const toggleFilter = (filter) => {
        setFilters((prevFilters) =>
            prevFilters.includes(filter)
                ? prevFilters.filter((f) => f !== filter)
                : [...prevFilters, filter]
        );
    };

    const filteredPosts = posts.filter((post) =>
        filters.length === 1 || filters.some((filter) => post.postTags.includes(filter))
    );
    return (
        <div className="w-[100%] flex justify-center bg-slate-200 dark:bg-black">
            {/* All home content withing next div tag */}
            <div className='max-w-[1800px] w-[100%] relative overflow-hidden bg-[#EFB793] dark:bg-[#120A05] flex justify-center'>
                <div className="post-header duration-300 fixed top-0 h-[160px] w-[100%] z-[11] bg-gradient-to-br from-[#C37442] to-[#ECB897] dark:from-[#160C05] dark:to-[#341A05] drop-shadow-2xl flex items-center justify-center">
                    <div className="post-navigation flex w-[90%] h-[60px] absolute bottom-0 items-center">
                        <span className={filters.length == 1 ? "mr-[40px] after:content-[''] after:w-[100%] after:h-[2px] after:dark:bg-slate-200 after:bg-black after:flex after:duration-300 after:justify-center after:items-center cursor-pointer" : "mr-[40px] after:bg-black after:content-[''] after:w-[0px] after:h-[2px] after:hover:w-[100%] after:dark:bg-slate-200 after:flex after:duration-300 after:justify-center after:items-center cursor-pointer"} onClick={()=>setFilters([''])}><h1 className="dark:text-slate-200"><i className="fa-solid fa-layer-group dark:text-slate-200 mr-[10px]"></i>All</h1></span>
                        <span className={seemore ? "after:content-[''] after:w-[100%] after:h-[2px] after:dark:!bg-slate-200 after:!bg-black after:flex after:duration-300 after:justify-center after:items-center" : "after:content-[''] after:!bg-black after:w-[0px] after:h-[2px] after:hover:w-[100%] after:dark:!bg-slate-200 after:flex after:duration-300 after:justify-center after:items-center"}>
                            <button className="dark:text-slate-200 flex items-center" onClick={() => setSeemore(!seemore)}>
                            <i className="fa-solid fa-filter mr-[10px]"></i>Add Filters {!seemore ? <i className="fa-solid fa-chevron-down ml-[10px]"></i> : <i className="fa-solid fa-chevron-up ml-[10px]"></i>}
                            </button>
                            <div className={seemore ? "absolute mt-2 w-48 bg-[#d9986f] dark:bg-[#251305] top-[50px] duration-300 h-[120px] overflow-hidden rounded-md" : "absolute mt-2 w-48 bg-[#251305] top-[50px] none h-[0px] duration-300 overflow-hidden"}>
                                <ul>
                                    <li className="w-[100%] flex py-1 pl-[10px] rounded-md hover:dark:bg-[#371C0B] hover:bg-[#ECB897] text-[15px] text-[#4C3F33] dark:text-[#B4967E] cursor-pointer" onClick={() => toggleFilter('#MyProjects')}>{filters.includes('#MyProjects') ? <i className="fa-solid fa-check w-[30px] text-blue-600"></i> : <i className="fa-solid fa-plus text-green-400 w-[30px] flex"></i>}MyProjects</li>
                                    <li className="w-[100%] flex py-1 pl-[10px] rounded-md hover:dark:bg-[#371C0B] hover:bg-[#ECB897] text-[15px] text-[#4C3F33] dark:text-[#B4967E] cursor-pointer" onClick={() => toggleFilter('#UniLife')}>{filters.includes('#UniLife') ? <i className="fa-solid fa-check w-[30px] text-blue-600"></i> : <i className="fa-solid fa-plus text-green-400 w-[30px] flex"></i>}UniLife</li>
                                    <li className="w-[100%] flex py-1 pl-[10px] rounded-md hover:dark:bg-[#371C0B] hover:bg-[#ECB897] text-[15px] text-[#4C3F33] dark:text-[#B4967E] cursor-pointer" onClick={() => toggleFilter('#Myself')}>{filters.includes('#Myself') ? <i className="fa-solid fa-check w-[30px] text-blue-600"></i> : <i className="fa-solid fa-plus text-green-400 w-[30px] flex"></i>}Myself</li>
                                    <li className="w-[100%] flex py-1 pl-[10px] rounded-md hover:dark:bg-[#371C0B] hover:bg-[#ECB897] text-[15px] text-[#4C3F33] dark:text-[#B4967E] cursor-pointer" onClick={() => toggleFilter('#Announcement')}>{filters.includes('#Announcement') ? <i className="fa-solid fa-check w-[30px] text-blue-600"></i> : <i className="fa-solid fa-plus text-green-400 w-[30px] flex"></i>}Announcement</li>
                                </ul>
                            </div>
                        </span>
                    </div>
                </div>
                <img className="fixed w-[100%] top-[140px] z-[0] min-h-[700px] h-[100%] opacity-30 dark:opacity-15" src={backdrop} />
                <div className="post-content mt-[170px] w-[100%] flex flex-col items-center">
                    {filteredPosts.length > 0 ? filteredPosts.map((post, index) => (
                        <Post key={index} postId={post.postId} postTitle={post.postTitle} postText={post.postText} postTags={post.postTags} postImage={post.postImage} postReacts={post.postReacts} postDate={post.postDate}/>
                    )) : <h1 className="text-[20px] dark:text-slate-200 w-[100%] h-[80vh] flex items-center justify-center font-bold font-legendary">No posts found</h1>}
                </div>
            </div>
        </div>
    )
}

export default Posts