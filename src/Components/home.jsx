import facebook from '../assets/logo/facebook.png'
import github from '../assets/logo/github.png'
import instagram from '../assets/logo/instagram.png'
import linkedin from '../assets/logo/linkedin.png'
import animehero from '../assets/anim-hero.png'
import backdrop from '../assets/homebackdrop.png'
import profile from '../assets/profile.jpg'
import logoD from '../assets/logo/logoD.png'
import homebottom from '../assets/homebottom.png'

import cloud1 from '../assets/parallax/clouds1.png'
import cloud2 from '../assets/parallax/clouds2.png'
import cloud3 from '../assets/parallax/clouds3.png'
import cloud4 from '../assets/parallax/clouds4.png'

import follow from '../assets/icons/follow.png'
import call from '../assets/icons/call.png'
import announcement from '../assets/icons/announcement.png'

import Loader from '../loader'

import Experience from './legendExperience'

import { useRef, useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp, getFirestore } from "firebase/firestore";
import app from '../firebase'

import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger)

//swipper
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import { getHomeData } from '../api'
import { useLoaderData } from 'react-router-dom'

export async function loader() {
  return getHomeData()
}


function Home() {
  const [play, setPlay] = useState(false)

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')
  const [submiting, setSubmiting] = useState(false)

  const experience = useRef()
  const parallaxRef = useRef()
  const cloud1ref = useRef()
  const cloud2ref = useRef()
  const cloud3ref = useRef()
  const cloud4ref = useRef()
  const cloud5ref = useRef()
  const swiperRef = useRef()

  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  useEffect(() => {
    ScrollTrigger.create({
      start: '2px bottom',
      trigger: experience.current,
      onEnter: () => { setPlay(true) },
    });
  }, [])
  useEffect(() => {
    gsap.fromTo(swiperRef.current,
      { width: '100px', height: '100px', opacity: '0.2' },
      {
        width: '850px', height: '800px', opacity: '1', duration: 4,
        scrollTrigger: {
          trigger: parallaxRef.current,
          start: 'top 80%',
          end: 'top 20%',
          toggleAction: "play none none none",
          scrub: true,
          once: true,
        }
      }
    );
  }, [])

  useEffect(() => {
    gsap.to(cloud1ref.current, {
      x: 200,
      duration: 4,
      scrollTrigger: {
        trigger: parallaxRef.current,
        scrub: true,
        start: 'top 98%',
        end: 'top 20%',
        toggleAction: "play none none none",
        once: true,
      }
    })

    gsap.to(cloud2ref.current, {
      x: -100,
      duration: 4,
      scrollTrigger: {
        trigger: parallaxRef.current,
        scrub: true,
        start: 'top 98%',
        end: 'top 20%',
        toggleAction: "play none none none",
        once: true,
      }
    })

    gsap.to(cloud3ref.current, {
      x: -100,
      duration: 4,
      scrollTrigger: {
        trigger: parallaxRef.current,
        scrub: true,
        start: 'top 98%',
        end: 'top 20%',
        toggleAction: "play none none none",
        once: true,
      }
    })

    gsap.to(cloud4ref.current, {
      x: -700,
      duration: 8,
      scrollTrigger: {
        trigger: parallaxRef.current,
        scrub: true,
        start: 'top 98%',
        end: 'top 20%',
        toggleAction: "play none none none",
        once: true,
      }
    })
    gsap.to(cloud5ref.current, {
      x: 700,
      duration: 8,
      scrollTrigger: {
        trigger: parallaxRef.current,
        scrub: true,
        start: 'top 98%',
        end: 'top 20%',
        toggleActions: "play none none none",
        once: true,
      }
    })
  }, [])


  const homeDataBase = useLoaderData()
  const db = getFirestore(app);

  const FuncSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmiting(true)
      const docRef = await addDoc(collection(db, "clients"), {
        createAt: serverTimestamp(),
        name: name,
        country: country,
        contact: contact,
        email: email,

      });
      setSubmiting(false)
      setName('')
      setCountry('')
      setContact('')
      setEmail('')
    } catch (e) {
      alert("Error adding document: ", e);
      setSubmiting(false)
    }
  }



  return (
    <div className="w-[100%] flex justify-center bg-slate-200 dark:bg-black">
      {/* All home content withing next div tag */}
      <div className='max-w-[1800px] w-[100%] relative overflow-hidden bg-[#EFB793] dark:bg-[#120A05] flex flex-col items-center justify-center'>
        {/* Home top0 */}
        <div className='absolute w-[500px] h-[500px] rounded-full radial-gradient dark:radial-gradient-dark mix-blend-saturation dark:mix-blend-color-dodge top-[-350px] z-[0]'></div>
        <div className='home-top flex items-center jutify-between w-[90%] h-[100vh] min-h-[700px] mx-auto'>
          <div className="hero-text-field w-[45%] flex flex-col">
            <h1 className='dark:text-slate-200 font-bold md:text-4xl text-3xl font-legendary'>Hey!</h1>
            <h1 className='font-bold md:text-3xl text-2xl text-gradient font-legendary'>Welcome to my portfolio</h1>
            <p className='text-[#4C3F33] dark:text-[#A79280] text-sm lg:text-base mt-[10px] font-legendary'>{homeDataBase[0].heroAbout}</p>
            <div className='hero-btn flex w-[300px] mt-[30px] items-center justify-between'>
              <a className='w-[140px] h-[30px] rounded-md font-bold text-[12px] bg-gradient-to-r from-[#A4400F] to-[#E67A2A] hover:from-[#b45628] hover:to-[#d39669] duration-300 hover:duration-300 dark:text-slate-200 cursor-pointer flex items-center justify-center font-legendary' href='#contact'>Contact Me</a>
              <button className='w-[140px] h-[30px] rounded-md font-bold text-[12px] bg-transparent text-gradient font-legendary'>Follow Me on social Media</button>
            </div>
            <span className='social-icon-base flex items-center w-[250px] mt-[40px]'>
              <a className='focus:outline-none' href={homeDataBase[0].facebook} target='_blank'><img src={facebook} className='social-icon mr-[30px] hover:cursor-pointer' /></a>
              <a className='focus:outline-none' href={homeDataBase[0].github} target='_blank'><img src={github} className='social-icon mr-[30px] hover:cursor-pointer' /></a>
              <a className='focus:outline-none' href={homeDataBase[0].Instagram} target='_blank'><img src={instagram} className='social-icon mr-[30px] hover:cursor-pointer' /></a>
              <a className='focus:outline-none' href={homeDataBase[0].LinkedIn} target='_blank'><img src={linkedin} className='hover:cursor-pointer' /></a>
            </span>
          </div>
          <div className="hero-image w-[400px] md:w-[600px] xl:w-[55%]  h-[100%] flex justify-center items-center relative">
            <img src={animehero} className='w-[100%] h-[100%] z-[5] brightness-125 dark:brightness-100' loading='lazy' />
            <div className='heroback absolute w-[800px] h-[900px] rounded-full radial-gradient dark:radial-gradient-dark mix-blend-saturation dark:mix-blend-color-dodge z-[0]'></div>
          </div>
        </div>

        {/* Home bottom1 */}
        <div className='perform-sap w-[90%] h-[525px] flex items-center flex-col bg-gradient-to-b dark:from-[#160C05] dark:to-[#341A05] from-[#F7A673] to-[#ECB897] relative top-[-100px] z-[20] rounded-[30px]'>
          <div className="data-header flex w-[100%] h-[68px] mt-[30px] overflow-hidden">
            {homeDataBase[0].merge.map((data, index) => (<div key={index} className={`main item${String(index + 1)} flex flex-col`}>
              <h1 className="top font-bold text-[#3B261B] dark:text-[#d9b18f] text-[20px] font-legendary">{data.top}</h1>
              <p className='text-[#62503A] dark:text-[#D86A17] text-[12px] font-legendary'>{data.bottom}</p>
            </div>))}
          </div>

          <div className='data-content flex w-[100%] h-[400px]'>
            <div className='obj' ref={experience}>
              <Experience Play={play} />
            </div>
            <div className='data-text w-[50%] h-[100%] flex items-center justify-center'>
              <p className='w-[95%] text-[#4C3F33] dark:text-[#A79280] text-sm lg:text-base mt-[10px] font-legendary'>{homeDataBase[1].about}</p>
            </div>
          </div>
        </div>

        {/* Home bottom2 */}
        <div className='w-[100%] h-[600px] flex flex-col items-center justify-center relative top-[-80px]' ref={parallaxRef}>
          <img src={cloud1} className='w-[100%] h-[650px] absolute mix-blend-overlay z-[1]' ref={cloud1ref} />
          <img src={cloud2} className='w-[100%] h-[650px] absolute mix-blend-overlay z-[1]' ref={cloud2ref} />
          <img src={cloud3} className='w-[100%] h-[650px] absolute mix-blend-overlay z-[1]' ref={cloud3ref} />
          <img src={cloud4} className='w-[100%] h-[650px] absolute mix-blend-overlay z-[1]' ref={cloud4ref} />
          <img src={cloud4} className='w-[100%] h-[650px] absolute mix-blend-overlay z-[1]' ref={cloud5ref} />
          <h1 className='absolute text-[20px] dark:text-slate-200 font-bold top-[10px] font-legendary'>My Experience</h1>
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            spaceBetween={0}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={true}
            modules={[EffectCoverflow, Pagination,Autoplay]}//
            className="mySwiper absolute w-[550px] h-[400px] z-[8] flex items-center justify-center top-[20px] overflow-hidden opacity-100"
          >
            {homeDataBase[1].swiper.map((data, i) => (<SwiperSlide key={i} className='!w-[300px] !h-[350px] bg-gradient-to-br dark:from-[#160C05] dark:to-[#341A05] from-[#D4AE95] to-[#EA955D] rounded-md ring-1 ring-slate-600'>
              {data ? <div className='w-[100%] h-[100%] flex flex-col items-center overflow-hidden rounded-md'>
                <img src={data.image} className='!w-[100%] !h-[65%] brightness-125 dark:brightness-100' />
                <div className='slider-text flex flex-col w-[90%] items-center'>
                  <h1 className='font-bold dark:text-slate-200 text-[15px] w-[100%]'>{data.header}</h1>
                  <div className='w-[100%] h-auto flex'><p className='text-[#130A03] dark:text-[#A79280] text-[12px]'>{data.text}</p></div>
                </div>
              </div> : <Loader/>}
            </SwiperSlide>))}
            <div className="autoplay-progress" slot="container-end">
              <svg viewBox="0 0 48 48" ref={progressCircle}>
                <circle cx="24" cy="24" r="20"></circle>
              </svg>
              <span ref={progressContent}></span>
            </div>
          </Swiper>
          <div className='absolute rounded-full radial-gradient dark:radial-gradient-dark mix-blend-saturation dark:mix-blend-color-dodge z-[0]' ref={swiperRef}>D</div>
        </div>

        {/* Home bottom3 */}
        <div className='bottom3 h-[500px] w-[800px] bg-gradient-to-br dark:from-[#160C05] dark:to-[#341A05] from-[#F7A875] to-[#F8C8A3] flex rounded-md overflow-hidden z-[2]'>
          <div className='bottom3text w-[50%] h-[100%] flex items-center justify-center dark:bg-[#2F1601] bg-[#F8C8A3] relative'>
            <div className='absolute w-[70%] h-[200px] top-0 left-0 z-[0]'>
              <img src={backdrop} className='w-[100%] h-[100%] rotate-180' />
            </div>
            <div className='bottom3text-content flex flex-col items-center justify-center z-[2]'>
              <div className="image rounded-full w-[200px] h-[200px] overflow-hidden mb-[30px]">
                <img src={profile} className='w-[100%] h-[100%] brightness-125 dark:brightness-100' />
              </div>
              <div className='flex flex-col'>
                <div className='relative w-[250px] h-[60px] flex items-center justify-center'>
                  <div className='absolute w-[50px] h-[50px] rounded-full left-0 bg-[#F3DDCD] dark:bg-[#120A05] drop-shadow-lg flex items-center justify-center'>
                    <img src={follow} className='w-[20px] h-[20px]' />
                  </div>
                  <div className='w-[200px] h-[60px] ml-[15px] rounded-[10px] bg-gradient-to-br dark:from-[#6A2A07] dark:to-[#5F280A] from-[#F7A673] to-[#ECB897]'>
                    <div className='ml-[30px] w-[150px] h-[100%] flex flex-col justify-center'>
                      <h1 className='dark:text-slate-200 font-bold text-[12px]'>{homeDataBase[2].friend.top}</h1>
                      <p className='text-[#130A03] dark:text-[#A79280] text-[10px]'>{homeDataBase[2].friend.bottom}</p>
                    </div>
                  </div>
                </div>
                <div className='relative w-[250px] h-[60px] flex items-center justify-center mt-[10px]'>
                  <div className='absolute w-[50px] h-[50px] rounded-full left-0 bg-[#F3DDCD] dark:bg-[#120A05] drop-shadow-lg flex items-center justify-center'>
                    <img src={call} className='w-[20px] h-[20px]' />
                  </div>
                  <div className='w-[200px] h-[60px] ml-[15px] rounded-[10px] bg-gradient-to-br dark:from-[#6A2A07] dark:to-[#5F280A] from-[#F7A673] to-[#ECB897]'>
                    <div className='ml-[30px] w-[150px] h-[100%] flex flex-col justify-center'>
                      <h1 className='dark:text-slate-200 font-bold text-[12px]'>{homeDataBase[2].contact.top}</h1>
                      <p className='text-[#130A03] dark:text-[#A79280] text-[10px]'>{homeDataBase[2].contact.bottom}</p>
                    </div>
                  </div>
                </div>
                <div className='relative w-[250px] h-[60px] flex items-center justify-center mt-[10px]'>
                  <div className='absolute w-[50px] h-[50px] rounded-full left-0 bg-[#F3DDCD] dark:bg-[#120A05] drop-shadow-lg flex items-center justify-center'>
                    <img src={announcement} className='w-[20px] h-[20px]' />
                  </div>
                  <div className='w-[200px] h-[60px] ml-[15px] rounded-[10px] bg-gradient-to-br dark:from-[#6A2A07] dark:to-[#5F280A] from-[#F7A673] to-[#ECB897]'>
                    <div className='ml-[30px] w-[150px] h-[100%] flex flex-col justify-center'>
                      <h1 className='dark:text-slate-200 font-bold text-[12px]'>{homeDataBase[2].releaseDate.top}</h1>
                      <p className='text-[#130A03] dark:text-[#A79280] text-[10px]'>{homeDataBase[2].releaseDate.bottom}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='bottom3form w-[50%] h-[100%] flex items-center justify-center relative'>
            <div className='absolute top-[25px]'>
              <h1 className='text-[20px] font-bold dark:text-slate-200 font-legendary'>Contact Me</h1>
            </div>
            <form onSubmit={FuncSubmit} className='w-[80%] flex justify-center items-center flex-col' id='contact'>
              <fieldset className='flex flex-col w-[100%] mt-[25px]'>
                <label className='dark:text-slate-200 text-[15px] popins'>Name:</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className='focus-visible:outline-none h-[30px] bg-transparent border-b border-[#565251] text-[#130A03] dark:text-slate-200 text-[13px]' type='text' placeholder='Dulith Kavinda' required />
              </fieldset>

              <fieldset className='flex flex-col w-[100%] mt-[25px]'>
                <label className='dark:text-slate-200 text-[15px] popins'>Country:</label>
                <input
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  className='focus-visible:outline-none h-[30px] bg-transparent border-b border-[#565251] text-[#130A03] dark:text-slate-200 text-[13px]' type='text' placeholder='Sri Lanka' required />
              </fieldset>

              <fieldset className='flex flex-col w-[100%] mt-[25px]'>
                <label className='dark:text-slate-200 text-[15px] popins'>Contact Number:</label>
                <input
                  onChange={(e) => setContact(e.target.value)}
                  value={contact}
                  type='number'
                  className='focus-visible:outline-none h-[30px] bg-transparent text-[#130A03] dark:text-slate-200 border-b border-[#565251] text-[13px]' placeholder='+5654 45 4697' required />
              </fieldset>

              <fieldset className='flex flex-col w-[100%] mt-[25px]'>
                <label className='dark:text-slate-200 text-[15px] popins'>Email:</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type='email'
                  className='focus-visible:outline-none h-[30px] bg-transparent text-[#130A03] dark:text-slate-200 border-b border-[#565251] text-[13px]' placeholder='abcd@gmail.com' required />
              </fieldset>

              {submiting ?
                <button className='w-[100%] h-[30px] rounded-md flex items-center justify-center mt-[40px] bg-gradient-to-br from-[#A4400F] to-[#E67A2A] text-[13px] font-bold text-slate-200 hover:from-[#b45628] hover:to-[#d39669] duration-300 hover:duration-300' type='submit' disabled>Sending...</button> :
                <button className='w-[100%] h-[30px] rounded-md flex items-center justify-center mt-[40px] bg-gradient-to-br from-[#A4400F] to-[#E67A2A] text-[13px] font-bold text-slate-200 hover:from-[#b45628] hover:to-[#d39669] duration-300 hover:duration-300' type='submit'>Send</button>}
            </form>
          </div>
        </div>
        <img className='w-[100%]  bottom-[80px] z-[0] mix-blend-lighten dark:mix-blend-overlay absolute w-[100%] h-[800px]' src={homebottom} />

        {/* Home bottom4 */}
        <div className="footer w-[100%] mt-[20px] h-[250px] bg-gradient-to-br dark:from-[#120A05] dark:to-[#241004] from-[#D4AE95] to-[#EA955D] flex items-center justify-center z-[2]">
          <div className='footer-content w-[90%] flex items-center justify-around h-[100%] mb-[40px] z-[2]'>
            <div className='flex flex-col h-[80px] w-[280px]'>
              <h1 className='dark:text-[#A79280] text-[15px] font-bold mb-[10px]'>Special Thanks:</h1>
              <a href='https://www.scrimba.com' className='dark:text-[#A79280] text-[12px]' target='blank'>React.js learned by-Scrimba.com</a>
              <a href='https://www.freecodecamp.com' className='dark:text-[#A79280] text-[12px]' target='blank'>React.js,HTML,CSS,js... learned by-Scrimba.com</a>
            </div>
            <div className='flex flex-col h-[80px] w-[280px] mt-[40px]'>
              <p className='dark:text-[#A79280] text-[12px] text-center'>Also I would like to thank my dear friends for their amazing support.</p>
            </div>
            <div className='flex flex-col h-[80px] w-[280px] items-center'>
              <div className="icon w-[100px] h-[50px] mb-[10px]"><img src={logoD} className="w-[100%]" /></div>
              <p className='dark:text-[#A79280] text-[12px] text-center'>Designs and developed by-Dulith Kavinda</p>
            </div>
          </div>
          <footer className='ffoo flex z-[3] justify-around items-center h-[80px] dark:text-[#A79280] text-[15px] absolute w-[95%] bottom-0 border-t border-t-[0.5px] border-t-black dark:border-t-[#A79280]'>
            <h1 className='w-[280px] flex justify-center'>&copy;{homeDataBase[0].year}-DKA All Rights Reserved.</h1>

            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                  <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                  <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                </svg>
              </div>
              <div type="text" id="email-address-icon" className="bg-[#eab796] border border-amber-400 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5  dark:bg-[#341a05] dark:border-amber-900 dark:text-white">Subscribe option not available for now.</div>
            </div>

            <div className='flex space-x-4 w-[280px] justify-center'>
              <a href={homeDataBase[0].facebook} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f hover:!text-slate-200 hover:cursor-pointer dark:text-[#A79280]"></i>
              </a>
              <a href={homeDataBase[0].LinkedIn} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in hover:!text-slate-200 hover:cursor-pointer dark:text-[#A79280]"></i>
              </a>
              <a href={homeDataBase[0].youtube} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube hover:!text-slate-200 hover:cursor-pointer dark:text-[#A79280]"></i>
              </a>
              <a href={homeDataBase[0].github} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github hover:!text-slate-200 hover:cursor-pointer dark:text-[#A79280]"></i>
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div >
  );
};

export default Home;