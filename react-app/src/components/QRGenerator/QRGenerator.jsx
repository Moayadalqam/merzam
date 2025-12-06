import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export function QRGenerator() {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  // Auto-detect URL if deployed
  useEffect(() => {
    if (
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      setUrl(window.location.origin);
    }
  }, []);

  const generateQR = () => {
    let targetUrl = url.trim();
    if (!targetUrl) {
      alert(t('Please enter a URL', 'الرجاء إدخال الرابط'));
      return;
    }

    // Add https:// if missing
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
      setUrl(targetUrl);
    }

    setIsLoading(true);

    // Use QR Server API
    const newQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      targetUrl
    )}&bgcolor=ffffff&color=a1622d&margin=8`;

    // Preload image
    const img = new Image();
    img.onload = () => {
      setQrUrl(newQrUrl);
      setIsGenerated(true);
      setIsLoading(false);
      if (navigator.vibrate) navigator.vibrate(50);
    };
    img.onerror = () => {
      alert(t('Error generating QR code', 'خطأ في إنشاء رمز QR'));
      setIsLoading(false);
    };
    img.src = newQrUrl;
  };

  const downloadQR = () => {
    if (!url.trim()) return;

    const downloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
      url.trim()
    )}&bgcolor=ffffff&color=a1622d&margin=16`;

    fetch(downloadUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'wood-location-qr.png';
        a.click();
        URL.revokeObjectURL(a.href);
        if (navigator.vibrate) navigator.vibrate(50);
      })
      .catch(() => window.open(downloadUrl, '_blank'));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateQR();
    }
  };

  return (
    <div className="qr-container">
      <div className="url-field">
        <label>{t('Your Deployed URL', 'رابط موقعك')}</label>
        <input
          type="url"
          placeholder="https://your-site.vercel.app"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      <button
        className={`btn ${isLoading ? 'loading' : ''}`}
        onClick={generateQR}
        disabled={isLoading}
      >
        <span className="btn-text">{t('Generate QR Code', 'إنشاء رمز QR')}</span>
        <div className="spinner"></div>
      </button>

      <div className="qr-box">
        {isGenerated ? (
          <img src={qrUrl} alt="QR Code" />
        ) : (
          <div className="qr-placeholder">
            {t('Enter URL and click Generate', 'أدخل الرابط وانقر على إنشاء')}
          </div>
        )}
      </div>

      <button
        className="btn-download"
        onClick={downloadQR}
        disabled={!isGenerated}
      >
        <svg viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        {t('Download PNG', 'تحميل PNG')}
      </button>

      {isGenerated && (
        <div className="success-msg show">
          {t('QR Code ready! Scan to open form.', 'رمز QR جاهز! امسحه لفتح النموذج.')}
        </div>
      )}
    </div>
  );
}
