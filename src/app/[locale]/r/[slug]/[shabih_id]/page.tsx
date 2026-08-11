'use client';

import { useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import PhoneInput from '@/components/ui/PhoneInput';

export default function CustomerLandingPage({
  params,
}: {
  params: Promise<{ slug: string; shabih_id: string }>;
}) {
  const { slug, shabih_id } = use(params);
  const t = useTranslations();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClaim = () => {
    if (phone.length < 9) return;
    
    setLoading(true);
    // Simulate API call to claim the hospitality
    setTimeout(() => {
      setLoading(false);
      setStep(3); // Success step with QR
    }, 1000);
  };

  return (
    <main className={styles.main}>
      
      <div className={styles.card}>
        
        <div className={styles.shabihProfile}>
          <div className={styles.avatar}>
            <Icon name="user" size="xl" />
          </div>
          <div className={styles.shabihName} dir="ltr">+{shabih_id}</div>
        </div>

        {step === 1 && (
          <>
            <h1 className={styles.title}>{t('hospitality.surpriseTitle')}</h1>
            <p className={styles.subtitle}>{t('hospitality.beThereThisWeek')}</p>
            
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth 
              icon="gift"
              onClick={() => setStep(2)}
            >
              {t('hospitality.getIt')}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className={styles.title} style={{ fontSize: 'var(--font-size-xl)' }}>
              سجل رقمك للحصول عليها
            </h1>
            <div style={{ width: '100%' }}>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                disabled={loading}
              />
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth 
              onClick={handleClaim}
              loading={loading}
              disabled={phone.length < 9}
            >
              تأكيد
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className={styles.title}>{t('hospitality.gotIt')}</h1>
            
            <div className={styles.qrContainer}>
              <QRCodeSVG 
                value={`CLAIM:${slug}:${shabih_id}:${phone}`} 
                size={220}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
              />
              <p className={styles.qrInstruction}>{t('hospitality.showQrToCashier')}</p>
            </div>

            <div className={styles.expiryText}>
              <Icon name="window" size="sm" />
              <span>متبقي 7 أيام و 14 ساعة</span>
            </div>
          </>
        )}

      </div>

      <div className={styles.restaurantBranding}>
        <Icon name="store" size="sm" />
        <span>برعاية {slug}</span>
      </div>

    </main>
  );
}
