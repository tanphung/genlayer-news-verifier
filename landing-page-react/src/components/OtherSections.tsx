import { Link } from 'react-router-dom';
import { GenLayerIcon } from './Icons';

// Placeholder components - simplified versions
export function HowItWorks() {
    return (
        <section className="how-it-works" id="how-it-works">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        How It <span className="gradient-text">Works</span>
                    </h2>
                    <p className="section-description">Three simple steps to verify any news article</p>
                </div>
                <div className="steps-container">
                    <div className="step-card glass-card">
                        <div className="step-number">01</div>
                        <div className="step-content">
                            <h3 className="step-title">Submit News</h3>
                            <p className="step-description">Paste a URL, upload text, or use our browser extension.</p>
                        </div>
                    </div>
                    <div className="step-connector"></div>
                    <div className="step-card glass-card">
                        <div className="step-number">02</div>
                        <div className="step-content">
                            <h3 className="step-title">AI Analysis</h3>
                            <p className="step-description">Multiple AI validators analyze and reach consensus.</p>
                        </div>
                    </div>
                    <div className="step-connector"></div>
                    <div className="step-card glass-card">
                        <div className="step-number">03</div>
                        <div className="step-content">
                            <h3 className="step-title">Get Results</h3>
                            <p className="step-description">Receive detailed credibility report with sources.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { useState } from 'react';

export function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: 'How accurate is the verification?',
            answer: 'Our AI consensus model achieves 98.7% accuracy by cross-referencing multiple trusted sources and using blockchain-based validation.'
        },
        {
            question: 'Is my data private?',
            answer: 'Yes. We don\'t track your reading habits. All verification happens on-chain without storing personal information.'
        },
        {
            question: 'How long does verification take?',
            answer: 'Most verifications complete in under 5 seconds. Complex articles may take up to 15 seconds.'
        },
        {
            question: 'Is NewsVerify really free?',
            answer: 'Yes, 100% free forever. We\'re committed to making fact-checking accessible to everyone.'
        },
        {
            question: 'What sources do you use?',
            answer: 'We aggregate data from reputable news agencies, fact-checking organizations, and academic databases to ensure comprehensive verification.'
        }
    ];

    return (
        <section className="faq" id="faq">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Frequently Asked <span className="gradient-text">Questions</span>
                    </h2>
                </div>
                <div className="faq-container">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item glass-card ${activeIndex === index ? 'active' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                aria-expanded={activeIndex === index}
                            >
                                <span>{faq.question}</span>
                                <svg className="faq-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <div className="faq-answer">
                                <p style={{ padding: '0 1.5rem 1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


export function CTA() {
    return (
        <section className="cta">
            <div className="container">
                <div className="cta-card glass-card">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Fight Misinformation?</h2>
                        <p className="cta-description">
                            Join thousands of users who trust NewsVerify to keep them informed with verified, credible news. 100% Free, Forever.
                        </p>
                        <div className="cta-actions">
                            <Link to="/app" className="btn-primary btn-large">Start Verifying Now</Link>
                            <a href="https://github.com" className="btn-secondary btn-large">View on GitHub</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-column">
                        <div className="footer-logo">
                            <GenLayerIcon className="logo-icon" style={{ width: '24px', height: '24px' }} />
                            <span className="logo-text">NewsVerify</span>
                        </div>
                        <p className="footer-description">
                            AI-powered news verification on the blockchain.
                        </p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p className="footer-copyright">© 2026 NewsVerify. All rights reserved.</p>
                    <p className="footer-tagline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Built on <a href="https://genlayer.com" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            GenLayer
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default { HowItWorks, FAQ, CTA, Footer };
