import React from 'react'
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';
import AnimatedBackground from '../components/3d/AnimatedBackground';
import FadeIn from '../components/animations/FadeIn';
import ScaleIn from '../components/animations/ScaleIn';

const Home = () => {
  return (
    <div>
      <div className="relative">
        <AnimatedBackground className="absolute inset-0" intensity={0.5} />
        <div className="relative z-10">
          <FadeIn>
            <Hero/>
          </FadeIn>
        </div>
      </div>
      
      <ScaleIn>
        <LatestCollection/>
      </ScaleIn>
      
      <FadeIn delay={0.1}>
        <BestSeller/>
      </FadeIn>
      
      <FadeIn direction="up" delay={0.2}>
        <OurPolicy/>
      </FadeIn>
      
      <ScaleIn delay={0.1}>
        <NewsletterBox/>
      </ScaleIn>
    </div>
  )
}

export default Home