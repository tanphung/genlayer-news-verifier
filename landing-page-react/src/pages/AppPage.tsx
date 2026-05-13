import NewsVerifier from '../components/NewsVerifier';

export default function AppPage() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: '100px', background: 'var(--bg-secondary)' }}>
            <NewsVerifier />
        </div>
    );
}
