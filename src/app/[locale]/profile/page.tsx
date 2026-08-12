'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import RoleGuard from '@/components/layout/RoleGuard';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const t = useTranslations();
  const router = useRouter();
  
  const [phone, setPhone] = useState('');
  const [isAmbassador, setIsAmbassador] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('shabih_session');
    if (!session) return;
    
    setPhone(session);
    
    // Fetch user profile from Firestore
    const fetchProfile = async () => {
      try {
        const userRef = doc(db, 'users', session);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setIsAmbassador(userSnap.data().isAmbassador || false);
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleActivateAmbassador = async () => {
    try {
      setLoading(true);
      const userRef = doc(db, 'users', phone);
      await updateDoc(userRef, {
        isAmbassador: true,
      });
      setIsAmbassador(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shabih_session');
    router.push('/');
  };

  if (loading) {
    return (
      <RoleGuard>
        <div style={{ display: 'flex', height: '100dvh', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="shabih-active" size="xl" className="spin" />
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['customer', 'ambassador']}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h2>{t('profile.myAccount')}</h2>
          <Button variant="ghost" icon="logout" onClick={handleLogout} />
        </header>
        
        <div className={styles.content}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <Icon name="user" size="xl" />
            </div>
            <div className={styles.userInfo}>
              <h3 dir="ltr">{phone}</h3>
              <span className={styles.badge}>
                {isAmbassador ? t('activity.ambassador') : t('activity.customer')}
              </span>
            </div>
          </div>

          <Card className={styles.ambassadorCard} glow={isAmbassador}>
            <div className={styles.cardHeader}>
              <Icon name="shabih-active" size="lg" />
              <h3>{t('profile.shabihMode')}</h3>
            </div>
            <p className={styles.cardDesc}>
              {isAmbassador 
                ? 'وضع السفير مفعل. يمكنك الآن نشر الروابط واستلام أطباق التجربة.' 
                : 'حوّل حسابك إلى سفير لتتمكن من إنشاء روابط خاصة بك ونشرها لمتابعيك!'}
            </p>
            
            {!isAmbassador && (
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleActivateAmbassador}
                loading={loading}
              >
                {t('profile.activateNow')}
              </Button>
            )}
          </Card>

          {isAmbassador && (
            <div className={styles.statsGrid}>
              <Card className={styles.statCard}>
                <div className={styles.statIcon}><Icon name="camera" /></div>
                <div className={styles.statValue}>12</div>
                <div className={styles.statLabel}>{t('profile.claimsThisMonth')}</div>
              </Card>
              <Card className={styles.statCard}>
                <div className={styles.statIcon}><Icon name="shabih" /></div>
                <div className={styles.statValue}>{t('activity.activeAmbassador')}</div>
                <div className={styles.statLabel}>{t('profile.activityLevel')}</div>
              </Card>
            </div>
          )}
          
        </div>
      </main>
    </RoleGuard>
  );
}
