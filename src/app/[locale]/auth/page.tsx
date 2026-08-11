'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import PhoneInput from '@/components/ui/PhoneInput';
import OTPInput from '@/components/ui/OTPInput';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AuthPage() {
  const t = useTranslations();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (phone.length < 9) {
      setError(t('auth.phonePlaceholder'));
      return;
    }
    
    setError('');
    setLoading(true);
    
    // Simulate sending OTP (Lean Startup mode)
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerify = async () => {
    if (otp.length < 4) return;
    
    // Simulate verification - ONLY accept 1234
    if (otp !== '1234') {
      setError('الرمز غير صحيح، أدخل 1234 للمحاكاة');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formattedPhone = `+966${phone}`;
      
      // In a real app, we would use signInWithCredential here
      // But since we are simulating OTP, we will just interact with Firestore
      // WARNING: In a real app, you CANNOT write to Firestore securely without a Firebase Auth token.
      // Since this is MVP mock, we'll assume Firebase Security Rules allow it or we just simulate UI state.
      // But wait! Without a real Firebase Auth, how will they stay logged in?
      // Since we enabled Phone Auth in console, the CORRECT way is to use RecaptchaVerifier and signInWithPhoneNumber.
      // But user said: "اجعل sms محاكاة حاليا"
      // So we will just write the phone number to localStorage to simulate session for now!
      
      const userRef = doc(db, 'users', formattedPhone);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user record
        await setDoc(userRef, {
          phone: formattedPhone,
          isAmbassador: false,
          createdAt: serverTimestamp(),
        });
      }
      
      // Simulate Session
      localStorage.setItem('shabih_session', formattedPhone);
      
      // Redirect to profile or dashboard
      router.push('/profile');
      
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء الاتصال بقاعدة البيانات');
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
    </main>
  );
}
