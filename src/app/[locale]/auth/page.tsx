'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import PhoneInput from '@/components/ui/PhoneInput';
import OTPInput from '@/components/ui/OTPInput';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { getUserProfile, createUserProfile } from '@/lib/firestore';

export default function AuthPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Initialize recaptcha when component mounts
    if (typeof window !== 'undefined' && !(window as any).recaptchaVerifier) {
      if (!auth) {
        console.error("Firebase auth is not initialized. Check environment variables.");
        setError("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.");
        return;
      }
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            // reCAPTCHA solved
          }
        });
      } catch (err) {
        console.error("Recaptcha error:", err);
      }
    }
  }, []);

  const handleSendOTP = async () => {
    if (phone.length < 9) {
      setError(t('auth.phonePlaceholder'));
      return;
    }
    
    setError('');
    setLoading(true);
    
    const normalizeNumber = (str: string) => str.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
    const normalizedPhone = normalizeNumber(phone);
    const formattedPhone = `+966${normalizedPhone}`;

    // DEV MODE BYPASS
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 1000);
      return;
    }

    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setLoading(false);
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setError('فشل إرسال الرمز، يرجى المحاولة مرة أخرى أو التأكد من الرقم');
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length < 4) return;
    
    // DEV MODE BYPASS
    if (process.env.NODE_ENV === 'development' && otp === '1234') {
      const normalizeNumber = (str: string) => str.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
      const formattedPhone = `+966${normalizeNumber(phone)}`;
      localStorage.setItem('shabih_dev_user', 'true');
      localStorage.setItem('shabih_dev_phone', formattedPhone);
      
      try {
        const dummyUid = 'dev-user-123';
        const userProfile = await getUserProfile(dummyUid);
        if (!userProfile) {
          await createUserProfile(dummyUid, formattedPhone);
        }
        window.location.href = `/${locale}/profile`;
      } catch (err) {
        console.error(err);
        setError('تعذر تسجيل الدخول في وضع التطوير');
      }
      return;
    }

    if (!confirmationResult) return;

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // Get or create user in Firestore
      const userProfile = await getUserProfile(user.uid);
      if (!userProfile) {
        await createUserProfile(user.uid, user.phoneNumber || '');
      }

      window.location.href = `/${locale}/profile`;
    } catch (err) {
      console.error(err);
      setError('الرمز غير صحيح');
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <button className={styles.backButton} onClick={() => step === 2 ? setStep(1) : router.back()}>
        <Icon name="chevron-left" />
      </button>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Icon name="shabih" size="lg" />
          </div>
          <h1>{step === 1 ? t('auth.loginTitle') : t('auth.otpTitle')}</h1>
          <p className={styles.subtitle}>
            {step === 1 ? t('auth.devModeOtp') : `${t('auth.otpSent')} +966 ${phone}`}
          </p>
        </div>

        <div className={styles.form}>
          {step === 1 ? (
            <>
              <PhoneInput
                value={phone}
                onChange={(v) => { setPhone(v); setError(''); }}
                label={t('auth.phoneLabel')}
                error={error}
                disabled={loading}
              />
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleSendOTP}
                loading={loading}
                disabled={phone.length < 9}
              >
                {t('auth.sendOtp')}
              </Button>
            </>
          ) : (
            <>
              <OTPInput
                length={4}
                value={otp}
                onChange={(v) => { setOtp(v); setError(''); }}
                error={error}
                disabled={loading}
              />
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleVerify}
                loading={loading}
                disabled={otp.length !== 4}
              >
                {t('auth.verify')}
              </Button>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => { setStep(1); setOtp(''); }}
                disabled={loading}
              >
                {t('auth.resendOtp')}
              </Button>
            </>
          )}
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </main>
  );
}
