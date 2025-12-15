import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LeadForm } from './components/LeadForm/LeadForm';
import { QRGenerator } from './components/QRGenerator/QRGenerator';
import { AppointmentBooking } from './components/AppointmentBooking/AppointmentBooking';
import { LanguageToggle } from './components/LanguageToggle/LanguageToggle';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const [page, setPage] = useState('form');

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'qr') {
        setPage('qr');
      } else if (hash === 'book' || hash === 'appointments') {
        setPage('appointments');
      } else {
        setPage('form');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (newPage) => {
    window.location.hash = newPage === 'form' ? '' : newPage;
    setPage(newPage);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        {(page === 'qr' || page === 'appointments') ? (
          <a
            href="#"
            className="back-link"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('form');
            }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t('Back', 'رجوع')}
          </a>
        ) : (
          <div className="logo">
            <img
              src="/logo.png"
              alt="Wood Location"
              className="logo-img"
            />
            <div className="logo-text">
              <span className="brand">Wood Location</span>
              <span className="tagline">{t('Interior Design & Woodwork', 'تصميم داخلي وأعمال خشبية')}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LanguageToggle />
          <div className="badge">
            {page === 'qr' ? t('QR Generator', 'مولد QR') : page === 'appointments' ? t('Book Now', 'احجز الآن') : 'Mirzaam 2025'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="form-header">
          <h1>
            {page === 'qr'
              ? t('QR Code', 'رمز QR')
              : page === 'appointments'
              ? t('Book an Appointment', 'احجز موعد')
              : t('Get in Touch', 'تواصل معنا')}
          </h1>
          <p>
            {page === 'qr'
              ? t('Generate a QR code for your form', 'أنشئ رمز QR لنموذجك')
              : page === 'appointments'
              ? t('Schedule a site visit or office meeting', 'حدد موعد زيارة موقع أو اجتماع في المكتب')
              : t("We'll reach out shortly", 'سنتواصل معك قريباً')}
          </p>
        </div>

        {page === 'qr' ? <QRGenerator /> : page === 'appointments' ? <AppointmentBooking /> : <LeadForm />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <a
          href="https://www.instagram.com/wood_location"
          target="_blank"
          rel="noopener noreferrer"
          className="social"
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          @wood_location
        </a>

        {page === 'form' && (
          <a
            href="#qr"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('qr');
            }}
          >
            {t('QR Code', 'رمز QR')}
          </a>
        )}
      </footer>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
