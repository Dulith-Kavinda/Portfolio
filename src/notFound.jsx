import { NavLink, } from "react-router-dom"
import notfound from './assets/error.png'


export default function NotFound(){

    return (
        <div className="w-[100%] min-h-[500px] h-[100vh] flex flex-col items-center justify-center fixed z-[210] bg-[#EFB793] dark:bg-[#120A05]">
            <img className="w-[300px] h-[300px] rounded-lg" loading="lazy" src={notfound} alt="Eror"/>
            <h1 className="text-[17px] text-red-700 mt-[20px] text-center">Padge not Found</h1>
            <pre className="text-red-700 font-bold text-center">404 error-reload or move to home</pre>
            <NavLink className='mt-[10px] text-indigo-700 text-[15px] hover:underline hover:duration-[0.2s] duration-[0.2s]' to='/'>Go to Home Page</NavLink>
        </div>
    )
}
