import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="container hero-content">
                <div className="hero-text">
                    <div className="badge">
                        <svg className="badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 10V3L4 14H11L11 21L20 10L13 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Powered by AI & Blockchain</span>
                    </div>

                    <h1 className="hero-title">
                        <span className="gradient-text">AI-Powered News Trust Layer</span>
                    </h1>

                    <p className="hero-description">
                        Verify online information using AI consensus and decentralized intelligence.
                    </p>

                    <div className="hero-cta">
                        <Link to="/app" className="btn-primary btn-large">
                            Start Verifying Free
                            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-number">1M+</div>
                            <div className="stat-label">News Verified</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number">98.7%</div>
                            <div className="stat-label">Accuracy Rate</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number">50K+</div>
                            <div className="stat-label">Active Users</div>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="glass-card hero-card">
                        <div className="card-header">
                            <div className="card-title">News Verification</div>
                            <div className="status-badge status-verified">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Verified
                            </div>
                        </div>

                        <div className="verification-content">
                            <div className="news-snippet">
                                "Breaking: New renewable energy breakthrough announced..."
                            </div>

                            <div className="verification-metrics">
                                <div className="metric">
                                    <div className="metric-label">Consensus Score</div>
                                    <div className="metric-value">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: '94%' }}></div>
                                        </div>
                                        <span>94%</span>
                                    </div>
                                </div>

                                <div className="metric">
                                    <div className="metric-label">Sources Checked</div>
                                    <div className="metric-value">
                                        <div className="source-icons">
                                            <div className="source-icon"></div>
                                            <div className="source-icon"></div>
                                            <div className="source-icon"></div>
                                            <div className="source-icon"></div>
                                            <div className="source-icon"></div>
                                        </div>
                                        <span>12 sources</span>
                                    </div>
                                </div>
                            </div>

                            <div className="verification-result">
                                <svg className="result-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="result-text">
                                    <div className="result-title">Highly Credible</div>
                                    <div className="result-description">Verified by AI consensus across multiple trusted sources</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
