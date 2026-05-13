import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import { HowItWorks, FAQ, CTA, Footer } from '../components/OtherSections';
import Roadmap from '../components/Roadmap';

export default function Landing() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const el = document.getElementById(id);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location.hash]);

    return (
        <>
            <Hero />
            <Features />
            <HowItWorks />
            <Roadmap />
            <FAQ />
            <CTA />
            <Footer />
        </>
    );
}
