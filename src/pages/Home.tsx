import React from 'react';
import { TFunction } from '../types';
import { useNavigate } from 'react-router-dom';

// Icons for features section
const MonitorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const AIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z" /></svg>;
const DropletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0L12 12l-6.364-6.364" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-6.375 3h12.75m-12.75-9h12.75M3.375 3h17.25c.621 0 1.125.504 1.125 1.125v16.5c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125v-16.5c0-.621.504-1.125 1.125-1.125z" /></svg>;

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md text-center border border-border-light dark:border-border-dark transform hover:-translate-y-2 transition-transform duration-300">
        {icon}
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-text-light-secondary dark:text-dark-secondary">{description}</p>
    </div>
);

interface HomeProps {
    t: TFunction;
}

const Home: React.FC<HomeProps> = ({ t }) => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
                <div 
                    className="absolute inset-0 z-0" 
                    style={{ 
                        backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <div className="relative container mx-auto px-4 z-20">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">{t('home.heroTitle')}</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">{t('home.heroSubtitle')}</p>
                    <button 
                        onClick={() => navigate('/signup')} 
                        className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-focus transition-colors text-lg"
                    >
                        {t('home.getStarted')}
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-background-light dark:bg-background-dark">
                <div className="container mx-auto px-4 text-center text-black dark:text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">{t('home.featuresTitle')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-black dark:text-white">
                        <FeatureCard icon={<MonitorIcon />} title={t('home.feature1Title')} description={t('home.feature1Desc')} />
                        <FeatureCard icon={<AIIcon />} title={t('home.feature2Title')} description={t('home.feature2Desc')} />
                        <FeatureCard icon={<DropletIcon />} title={t('home.feature3Title')} description={t('home.feature3Desc')} />
                        <FeatureCard icon={<ChartIcon />} title={t('home.feature4Title')} description={t('home.feature4Desc')} />
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section className="py-16 md:py-24 bg-card-light dark:bg-card-dark">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left rtl:md:text-right">
                        <div>
                            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">{t('home.visionTitle')}</h2>
                            <p className="text-text-light-secondary dark:text-dark-secondary leading-relaxed">{t('home.visionDesc')}</p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">{t('home.missionTitle')}</h2>
                            <p className="text-text-light-secondary dark:text-dark-secondary leading-relaxed">{t('home.missionDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
