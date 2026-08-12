'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from '@/i18n/navigation';
import { QRCodeSVG } from 'qrcode.react';
import styles from './page.module.css';
import Button from '@/components/ui/Button';

export default function CustomerLandingPage({
  params,
}: {
  params: Promise<{ slug: string; shabih_id: string }>;
}) {
  const { slug, shabih_id } = use(params);
  const router = useRouter();

  const [step, setStep] = useState<'phone' | 'otp' | 'inactive_qr' | 'active_qr'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes (300 seconds)
  const [ambassadorName, setAmbassadorName] = useState('سعد الحربي');
  const [globalExpiry, setGlobalExpiry] = useState<number>(7); // 7 days

  useEffect(() => {
    // If they already claimed from this restaurant, go straight to QR
    const claimedKey = `customer_claimed_${slug}`;
    if (localStorage.getItem(claimedKey)) {
      setStep('inactive_qr'); 
    }

    // Mock fetching ambassador name based on ID
    // In production, this fetches from Firestore
    if (shabih_id === '0500000000') {
      setAmbassadorName('علي الحربي');
    }
  }, [slug, shabih_id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'active_qr') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStep('inactive_qr');
            return 300; // Reset for next activation
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendOtp = () => {
    if (phone.length < 9) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (!otp) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const normalizeNumber = (str: string) => str.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
      const normalizedPhone = normalizeNumber(phone);
      
      localStorage.setItem(`customer_claimed_${slug}`, 'true');
      setStep('inactive_qr');
    }, 1000);
  };

  const handleActivateQr = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('active_qr');
    }, 1000);
  };

  if (step === 'phone') {
    return (
      <main className={styles.main}>
        <div className={styles.avatar}>
          <img src="/logo.png" alt="Ambassador Avatar" />
        </div>
        
        <h1 className={styles.title}>
          اهداء من {slug === 'alburger' ? 'مطعم البرجر' : 'مطعم الاطفال'} <br/>
          لأصدقاء ومتابعين {ambassadorName}
        </h1>

        <div className={styles.phoneInputContainer}>
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
          >
            موافق
          </Button>
        </div>
      </main>
    );
  }

  if (step === 'otp') {
    return (
      <main className={styles.main}>
        <div className={styles.phoneInputContainer} style={{ marginTop: '40px' }}>
          <h1 className={styles.title} style={{ marginBottom: '16px' }}>أدخل رمز التحقق</h1>
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
          >
            تأكيد
          </Button>
        </div>
      </main>
    );
  }

  // QR States
  return (
    <main className={styles.main}>
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Restaurant Logo" width={80} height={80} />
        <h2 className={styles.restaurantName}>
          {slug === 'alburger' ? 'مطعم البرجر' : 'مطعم الاطفال'}
        </h2>
      </div>

      {step === 'inactive_qr' && (
        <>
          <h1 className={styles.successText}>لقد حصلت عليها!</h1>
          
          <div className={styles.qrContainer}>
            <div className={styles.qrBlurred}>
              <QRCodeSVG 
                value="dummy-qr-code"
                size={220}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
              />
            </div>
          </div>

          <p className={styles.instruction}>اضغط زر التفعيل عندما تكون جاهزا للالتقاط</p>
          
          <div style={{ width: '100%', maxWidth: '200px' }}>
            <Button variant="primary" fullWidth onClick={handleActivateQr} loading={loading}>
              تفعيل
            </Button>
          </div>
        </>
      )}

      {step === 'active_qr' && (
        <>
          <h1 className={styles.successText}>جاهز للالتقاط</h1>
          
          <div className={styles.qrContainer}>
            <div className={styles.qrClear}>
              <QRCodeSVG 
                value={`CLAIM:${slug}:${shabih_id}:${phone}`} 
                size={220}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
              />
            </div>
          </div>

          <p className={styles.instruction} style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--danger)' }}>
            {formatTime(timeLeft)}
          </p>
        </>
      )}

      {(step === 'inactive_qr' || step === 'active_qr') && (
        <div style={{ marginTop: 'auto', paddingTop: '32px', color: 'var(--text-tertiary)', fontSize: '14px' }}>
          {globalExpiry > 0 ? (
            <p>متبقي {globalExpiry} أيام على انتهاء الصلاحية</p>
          ) : (
            <p style={{ color: 'var(--danger)', fontWeight: 'bold' }}>منتهي</p>
          )}
        </div>
      )}
    </main>
  );
}
