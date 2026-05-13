import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import ptpLogo from '../assets/ptp-logo.png';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLinkClick = () => {
        setMobileMenuOpen(false);
    };

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        e.preventDefault();
        handleLinkClick();
        if (location.pathname !== '/') {
            navigate('/' + hash);
        } else {
            const id = hash.replace('#', '');
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <img src={ptpLogo} alt="NewsVerify" className="logo-icon" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                    <span className="logo-text">NewsVerify</span>
                </Link>

                <ul className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`} id="navLinks">
                    <li>
                        <a href="#features" onClick={(e) => handleAnchorClick(e, '#features')}>Features</a>
                    </li>
                    <li>
                        <a href="#how-it-works" onClick={(e) => handleAnchorClick(e, '#how-it-works')}>How It Works</a>
                    </li>
                    <li>
                        <a href="#roadmap" onClick={(e) => handleAnchorClick(e, '#roadmap')}>Roadmap</a>
                    </li>
                    <li>
                        <a href="#faq" onClick={(e) => handleAnchorClick(e, '#faq')}>FAQ</a>
                    </li>
                    <li><Link to="/app" onClick={handleLinkClick}>App</Link></li>
                </ul>

                <div className="nav-actions">
                    <ConnectButton showBalance={false} />
                </div>

                <button
                    className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
                    id="mobileMenuToggle"
                    aria-label="Toggle menu"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}
