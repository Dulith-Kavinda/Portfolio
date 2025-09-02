import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import sun from '../assets/sun.png'
import moon from '../assets/moon.png'
import sys from '../assets/Gears.png'
import logoD from '../assets/logo/logoD.png'

gsap.registerPlugin(ScrollTrigger)

export default function Header() {
    const [theamhover, setTheamhover] = useState(false)
    const [hover, setHover] = useState(false)
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') ? localStorage.getItem('theme') : 'system'
    )
    const element = document.documentElement
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)")

    function onWindowMeadia() {
        if (localStorage.theme === 'dark' || !("theme" in localStorage) && darkQuery.matches) {
            element.classList.add('dark')
        } else {
            element.classList.remove('dark')
        }
    }

    useEffect(() => {
        switch (theme) {
            case 'dark':
                element.classList.add('dark')
                localStorage.setItem('theme', 'dark')
                break;
            case 'light':
                element.classList.remove('dark')
                localStorage.setItem('theme', 'light')
                break;
            default:
                localStorage.removeItem('theme')
                onWindowMeadia()
                break;

        }

    }, [theme])

    darkQuery.addEventListener('change', (e) => {
        if (!("theme" in localStorage)) {
            if (e.matches) {
                element.classList.add('dark')
            } else {
                element.classList.remove('dark')
            }
        }
    })

    useEffect(() => {
        ScrollTrigger.create({
            start: 'top -30',
            end: 99999,
            toggleClass: {
                className: 'header-scrolled',
                targets: '.header'
            }
        });
    }, [])


    return (
        <div className="header duration-300 w-full h-[70px] fixed z-[100] mt-0 flex justify-center">
            <div className="w-[100%] max-w-[1800px] h-[70px] flex justify-center">
                <div className="w-[90%] max-w-[1800px] h-[70px] fixed mt-0 flex items-center justify-between z-[20]">
                    <div className="icon w-[100px] h-[90%] z-[100] hover:cursor-pointer"><NavLink to='.' className='focus:outline-none'><img src={logoD} className="w-[100%]" /></NavLink></div>
                    <div className="dynamic-island-base absolute w-full h-full items-center justify-center flex">
                        <div className={hover ? "dynamic-island w-[300px] h-[120px] rounded-[30px] bg-black flex absolute top-[10px] duration-300 ease-in-out flex items-center justify-between z-[100]" : theamhover ? "dynamic-island z-[100] flex items-center justify-between top-[10px] absolute !w-[220px] h-[40px] rounded-[50px] bg-black flex duration-300 ease-in-out" : "dynamic-island flex items-center justify-between top-[10px] absolute w-[180px] h-[40px] rounded-[50px] bg-black flex duration-300 ease-in-out"}>
                            <div className='island-navigations w-[100%] h-[100%] ml-[4px] flex items-center justify-between' onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                                <div className={hover ? "flex flex-col justify-between items-centern overflow-hidden h-[100px] duration-500 delay-60 ml-[8px]" : "flex flex-col justify-between items-centern overflow-hidden h-[25px] duration-300 ml-[8px]"}>
                                    <NavLink to='.' className={({ isActive }) => isActive ? "text-white visible flex" : hover ? "text-white flex" : "text-white invisible hidden"}>
                                        <div className="h-[100%] w-[25px] rounded-[5px] mr-[5px] ml-[8px] flex items-center justify-center bg-gradient-to-br from-fuchsia-700 to-fuchsia-600"><i className="fa-solid fa-house-chimney"></i></div>
                                        <div>Home</div>
                                    </NavLink>
                                    <NavLink to='/posts' className={({ isActive }) => isActive ? "text-white visible flex" : hover ? "text-white flex" : "text-white invisible hidden"}>
                                        <div className="h-[100%] w-[25px] rounded-[5px] mr-[5px] ml-[8px] flex items-center justify-center bg-gradient-to-br from-amber-700 to-amber-500"><i className="fa-solid fa-fire"></i></div>
                                        <div>Posts</div>
                                    </NavLink>
                                    <NavLink to='/feedback' className={({ isActive }) => isActive ? "text-white visible flex" : hover ? "text-white flex" : "text-white invisible hidden"}>
                                        <div className="h-[100%] w-[25px] rounded-[5px] mr-[5px] ml-[8px] flex items-center justify-center bg-gradient-to-br from-green-700 to-green-600"><i className="fa-solid fa-user-group"></i></div>
                                        <div>Feedback</div>
                                    </NavLink>
                                </div>
                                <div className={hover ? "w-[120px] h-[80px] flex overflow-hidden visible duration-300 delay-100" : "invisible w-[0px] h-[0px] overflow-hidden"}>
                                    <div className={theme == 'light' ? "cursor-pointer rounded-[55px] bg-amber-700 hover:bg-slate-700 relative w-[40px] h-[38px] flex items-center justify-center left-[15px]" : "cursor-pointer rounded-[55px] bg-slate-800 hover:bg-slate-700 relative w-[40px] h-[38px] flex items-center justify-center left-[15px]"} onClick={() => setTheme('light')}><img className="w-[25px] h-[25px] " src={sun} /></div>
                                    <div className={theme == 'dark' ? "cursor-pointer rounded-[55px] bg-amber-700 hover:bg-slate-700 relative right-[25px] top-[40px] w-[40px] h-[38px] flex items-center justify-center" : "cursor-pointer rounded-[55px] bg-slate-800 hover:bg-slate-700 relative right-[25px] top-[40px] w-[40px] h-[38px] flex items-center justify-center"} onClick={() => setTheme('dark')}><img className="w-[25px] h-[25px] " src={moon} /></div>
                                    <div className={theme == 'system' ? "cursor-pointer rounded-[55px] bg-amber-700 hover:bg-slate-700 relative top-[18px] right-[25px] w-[40px] h-[38px] flex items-center justify-center" : "cursor-pointer rounded-[55px] bg-slate-800 hover:bg-slate-700 relative top-[18px] right-[25px] w-[40px] h-[38px] flex items-center justify-center"} onClick={() => setTheme('system')}><img className="w-[25px] h-[25px] " src={sys} /></div>
                                </div>
                            </div>
                            <div className={hover ? "invisible h-[0px] w-[0px]" : "visible theam w-[50px]  h-[37px] mr-[1.5px] rounded-[50px] hover:w-[120px] overflow-hidden duration-300 delay-100 flex items-center justify-center"} onMouseOver={() => !hover && setTheamhover(true)} onMouseLeave={() => !hover && setTheamhover(false)}>
                                <div className={theme == 'light' ? "w-[100%] h-[100%] hover:bg-slate-800 flex items-center justify-center duration-500 visible" : "w-0 h-0 hover:bg-slate-800 flex items-center justify-center invisible rounded-full"} onClick={() => setTheme('dark')}><img className="w-[25px] h-[25px]  duration-700 cursor-pointer visible" src={sun} /></div>
                                <div className={theme == 'dark' ? "w-[100%] h-[100%] flex items-center justify-center duration-500 visible hover:bg-slate-800 " : "hover:bg-slate-800 w-0 h-0 flex items-center justify-center invisible rounded-full"} onClick={() => setTheme('system')}><img className="w-[25px] h-[25px] duration-300 cursor-pointer visible " src={moon} /></div>
                                <div className={theme == 'system' ? "w-[100%] h-[100%] flex items-center justify-center duration-500 visible hover:bg-slate-800 " : "hover:bg-slate-800 w-0 h-0 flex items-center justify-center invisible rounded-full"} onClick={() => setTheme('light')}><img className="w-[25px] h-[25px] duration-300 cursor-pointer visible " src={sys} /></div>

                            </div>
                        </div>
                    </div>
                    <div className="navlinks w-[270px] h-[90%] flex items-center z-[100] justify-between">
                        <NavLink to='.' className={({ isActive }) => isActive ? "flex flex-col text-[#BB7A51]" : "text-[#BB7A51] flex flex-col "}>Home</NavLink>
                        <NavLink to='/posts' className={({ isActive }) => isActive ? "flex flex-col text-[#BB7A51]" : "text-[#BB7A51] flex flex-col "}>Posts</NavLink>
                        <NavLink to='/feedback' className={({ isActive }) => isActive ? "flex flex-col w-[100px] h-[30px] bg-gradient-to-r from-[#A4400F] to-[#E67A2A]  dark:text-slate-200 rounded-md hover:from-[#b45628] hover:to-[#d39669] duration-300 hover:duration-300 flex items-center justify-center" : "flex flex-col w-[100px] h-[30px] bg-gradient-to-r from-[#A4400F] to-[#E67A2A] dark:text-slate-200 rounded-md hover:from-[#b45628] hover:to-[#d39669] duration-300 hover:duration-300 flex items-center justify-center"}>Feedback</NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}