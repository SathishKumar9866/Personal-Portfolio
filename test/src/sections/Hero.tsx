import memjiImage from '@/assets/images/memoji-computer.png';
import Image from 'next/image'
import ArrowDown from '@/assets/icons/arrow-down.svg';
import grainImage from '@/assets/images/grain.jpg'
import StarIcon from '@/assets/icons/star.svg';

import { HeroOrbit } from '@/components/HeroOrbit';


export const HeroSection = () => {
  return (
  <div className='py-32 md:py-48 lg:py-60 relative z-0'>
    <div
    className='absolute inset-0 -z-30 opacity-5'
      style={{
        backgroundImage: `url(${grainImage.src})`,
      }}
    ></div>

    <div className='size-[420px] hero-ring'></div>
    <div className='size-[620px] hero-ring'></div>
    <div className='size-[820px] hero-ring'></div>
    <div className='size-[1020px] hero-ring'></div>
    <div className=' size-[1220px] hero-ring'></div>
    {/* <div className=' size-[1620px] hero-ring'></div> */}

    {/* <HeroOrbit size={800} rotation={-72}>
      <StarIcon className='size-28 text-emerald-300' />
    </HeroOrbit>
    <HeroOrbit size={550} rotation={20}>
      <StarIcon className='size-12 text-emerald-300' />
    </HeroOrbit>
    <HeroOrbit size={590} rotation={88}>
      <StarIcon className='size-8 text-emerald-300' />
    </HeroOrbit>
    <HeroOrbit size={430} rotation={-14}>
      <StarIcon className='size-8 text-emerald-300' />
    </HeroOrbit>
    <HeroOrbit size={440} rotation={0}>
      <StarIcon className='size-8 text-emerald-300' />
    </HeroOrbit> */}
    <div className="container">
        <div className='flex flex-col items-center'>
          
      <div className='max-w-lg mx-auto'>
      <h1 className='font-serif text-3xl text-center mt-8 tracking-wide'> 
        Personal Portfolio Website</h1>
      <p className='mt-4 text-center text-white/60 md:text-lg'>
      Thanks for Visiting Portfolio</p>
      </div>
        <div className='flex flex-col md:flex-row justify-center items-center mt-8 gap-4'>
          <button className='inline-flex items-center gap-2 border border-white/15 px-6 h-12 rounded-xl'>
            <span className='font-semibold'>Explore my work</span>
            <ArrowDown className='size-4'/>
          </button>
          <button className='inline-flex items-center gap-2 border border-white bg-white text-gray-900 h-12 px-6 rounded-xl'>
            <span className=''></span>
            <span className='font-semibold '>Lets connect</span>
          </button>
            </div>
          </div>
      </div>
  </div>
    )
};
// video stopped at >> 29:28
// animate-spin [animation-duration:30s]