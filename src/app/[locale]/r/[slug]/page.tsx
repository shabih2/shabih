'use client';

import { useState, useEffect, use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Button from '@/components/ui/Button';

export default function BranchRecruitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations();
  const router = useRouter();

  const [view, setView] = useState<'main' | 'auth' | 'howItWorks'>('main');
  const [session, setSession] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);
  
  // Auth state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [shabihName, setShabihName] = useState('');
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const activeSession = localStorage.getItem('shabih_session');
    if (activeSession) {
      setSession(activeSession);
    }
    const name = localStorage.getItem('shabih_name');
    if (name) {
      setSavedName(name);
    }
  }, []);

  const handleLinkClick = () => {
    if (session) {
      // User is logged in, copy their link
      const link = `${window.location.origin}/ar/r/${slug}/${session}`;
      navigator.clipboard.writeText(link);
      alert('تم نسخ الرابط الخاص بك بنجاح!');
    } else {
      // User needs to login
      setView('auth');
    }
  };

  const handleSendOtp = () => {
    if (!phone || phone.length < 9) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (!otp) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const normalizeNumber = (str: string) => str.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
      const normalizedPhone = normalizeNumber(phone);
      
      localStorage.setItem('shabih_session', normalizedPhone);
      setSession(normalizedPhone);
      
      const existingName = localStorage.getItem('shabih_name');
      if (existingName) {
        setSavedName(existingName);
        setView('main');
        setAuthStep('phone');
        setPhone('');
        setOtp('');
      } else {
        setAuthStep('name');
      }
    }, 1000);
  };

  const handleSaveName = () => {
    if (!shabihName.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('shabih_name', shabihName.trim());
      setSavedName(shabihName.trim());
      setView('main');
      setAuthStep('phone');
      setPhone('');
      setOtp('');
      setShabihName('');
    }, 500);
  };

  const renderTopBar = () => {
    if (!session || !savedName) return null;
    return (
      <div className={styles.topBar}>
        <button className={styles.userName} onClick={() => router.push('/links')}>
          {savedName}
        </button>
      </div>
    );
  };

  const renderLogo = () => (
    <div className={styles.logoContainer}>
      <img src="/logo.png" alt="Restaurant Logo" width={80} height={80} />
      <h1 className={styles.restaurantName}>
        {slug === 'alburger' ? 'مطعم البرجر' : 'مطعم الاطفال'}
      </h1>
    </div>
  );

  if (view === 'auth') {
    return (
      <main className={styles.main}>
        {renderLogo()}
        
        <div className={styles.authContainer}>
          {authStep === 'phone' ? (
            <>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05 _ _ _ _ _ _ _ _"
                className={styles.phoneInput}
                dir="ltr"
              />
              <Button 
                variant="primary" 
                onClick={handleSendOtp} 
                loading={loading}
                disabled={phone.length < 9}
                style={{ marginTop: '32px' }}
              >
                {t('auth.sendOtp')}
              </Button>
            </>
          ) : authStep === 'otp' ? (
            <>
              <input
                type="tel"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="- - - -"
                className={styles.phoneInput}
                dir="ltr"
                maxLength={4}
              />
              <Button 
                variant="primary" 
                onClick={handleVerifyOtp} 
                loading={loading}
                disabled={otp.length < 4}
                style={{ marginTop: '32px' }}
              >
                {t('auth.verify')}
              </Button>
            </>
          ) : (
            <>
              <p className={styles.nameInputLabel}>ماهو الاسم الذي تريد ان يظهر في الاهداء؟</p>
              <input
                type="text"
                value={shabihName}
                onChange={(e) => setShabihName(e.target.value)}
                className={styles.nameInput}
                autoFocus
              />
              <Button 
                variant="primary" 
                onClick={handleSaveName} 
                loading={loading}
                disabled={!shabihName.trim()}
                style={{ marginTop: '32px' }}
              >
                تأكيد
              </Button>
            </>
          )}
          
          <Button 
            variant="ghost" 
            onClick={() => setView('main')}
            style={{ marginTop: '16px' }}
          >
            {t('common.cancel')}
          </Button>
        </div>
      </main>
    );
  }

  if (view === 'howItWorks') {
    return (
      <main className={styles.main}>
        {renderLogo()}
        
        <div className={styles.textContent}>
          <p className={styles.howItWorksText}>ألتِقط صورة أو فيديو لأصدقائك ومتابعيك</p>
          <p className={styles.howItWorksText}>انشرها مع الرابط الخاص بك</p>
          <p className={styles.howItWorksText}>سنقدم اهداء باسمك عند زيارتهم</p>
        </div>

        <div className={styles.actionContainer}>
          <Button variant="primary" fullWidth onClick={() => setView('main')}>
            موافق
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      {renderTopBar()}
      {renderLogo()}

      <div className={styles.textContent}>
        <h2 className={styles.mainTitle}>ادعُ اصدقائك ومتابعيك</h2>
        <h3 className={styles.subTitle}>وضيافتهم علينا</h3>
      </div>

      <div className={styles.actionContainer}>
        <Button variant="primary" onClick={handleLinkClick}>
          الرابط الخاص بك
        </Button>
        
        <button className={styles.howItWorksLink} onClick={() => setView('howItWorks')}>
          كيف يعمل
        </button>
      </div>
    </main>
  );
}
