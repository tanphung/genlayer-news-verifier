type MilestoneStatus = 'Done' | 'In Progress' | 'Next' | 'Planned';

interface Milestone {
    title: string;
    status: MilestoneStatus;
    description: string;
}

const milestones: Milestone[] = [
    {
        title: 'MVP Verification Engine',
        status: 'Done',
        description: 'Core AI-powered fact-checking pipeline deployed on GenLayer Studionet.',
    },
    {
        title: 'AI Bias Analysis',
        status: 'In Progress',
        description: 'Multi-dimensional bias detection across political, geographic, and topical dimensions.',
    },
    {
        title: 'Trust Map Visualization',
        status: 'In Progress',
        description: 'Global heatmap showing trust scores aggregated by region and news source.',
    },
    {
        title: 'Shareable Results',
        status: 'Next',
        description: 'One-click sharing of verification reports via Web Share API and clipboard.',
    },
    {
        title: 'Browser Extension',
        status: 'Planned',
        description: 'Inline verification directly on news pages without leaving your browser.',
    },
    {
        title: 'Community / Reputation Layer',
        status: 'Planned',
        description: 'Community-driven source ratings and user reputation scoring on-chain.',
    },
];

const statusConfig: Record<MilestoneStatus, { label: string; className: string }> = {
    Done: { label: 'Done', className: 'roadmap-badge roadmap-badge--done' },
    'In Progress': { label: 'In Progress', className: 'roadmap-badge roadmap-badge--in-progress' },
    Next: { label: 'Next', className: 'roadmap-badge roadmap-badge--next' },
    Planned: { label: 'Planned', className: 'roadmap-badge roadmap-badge--planned' },
};

export default function Roadmap() {
    return (
        <section className="roadmap" id="roadmap">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">
                        Product <span className="gradient-text">Roadmap</span>
                    </h2>
                    <p className="section-description">
                        Our journey to build the most trusted AI news verification platform
                    </p>
                </div>
                <div className="roadmap-grid">
                    {milestones.map((milestone, index) => {
                        const cfg = statusConfig[milestone.status];
                        return (
                            <div key={index} className="roadmap-card glass-card">
                                <div className="roadmap-card__header">
                                    <span className="roadmap-number">{String(index + 1).padStart(2, '0')}</span>
                                    <span className={cfg.className}>{cfg.label}</span>
                                </div>
                                <h3 className="roadmap-card__title">{milestone.title}</h3>
                                <p className="roadmap-card__description">{milestone.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
