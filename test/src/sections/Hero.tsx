import memjiImage from '@/assets/images/memoji-computer.png';
import Image from 'next/image'
import ArrowDown from '@/assets/icons/arrow-down.svg';

export const HeroSection = () => {
  return <div className="container">

    <Image src={memjiImage} alt=""/>
    <div>
      <div></div>
      <div> See my projects</div>
    </div>
    <h1> Building UI for my Personal Portfolio website</h1>
    <p>sdf</p>
    <div>
      <button>
        <span>Explore my work</span>
      </button>
    </div>

    </div>
};
