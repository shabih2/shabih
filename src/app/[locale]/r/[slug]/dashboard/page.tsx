'use client';

import { useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import RoleGuard from '@/components/layout/RoleGuard';
import dynamic from 'next/dynamic';
import { QRCodeSVG } from 'qrcode.react';

const QRScanner = dynamic(() => import('@/components/ui/QRScanner'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>جاري تحميل الكاميرا...</div>
});

export default function RestaurantDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'operations' | 'shabihs' | 'settings'>('operations');

  const handleLogout = () => {
    localStorage.removeItem('shabih_session');
    router.push(`/r/${slug}/auth`);
  };

  return (
    <RoleGuard allowedRoles={['restaurant']}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.logo}>
              <Icon name="store" size="lg" />
            </div>
            <div>
              <h2 className={styles.restaurantName} dir="ltr">{slug}</h2>
              <span className={styles.branchName}>{t('restaurant.dashboard')}</span>
            </div>
          </div>
          <Button variant="ghost" icon="logout" onClick={handleLogout} />
        </header>

        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'operations' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('operations')}
            >
              {t('nav.operations')}
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'shabihs' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('shabihs')}
            >
              {t('restaurant.topShabihs')}
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              {t('restaurant.settings')}
            </button>
          </div>
        </div>

        <div className={styles.contentArea}>
          {activeTab === 'operations' && (
            <div className={styles.operationsTab}>
              <div className={styles.scannerBox}>
                <QRScanner 
                  onScanSuccess={(text) => {
                    alert(`تم قراءة الباركود: ${text}`);
                  }} 
                />
              </div>
              <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>{t('branch.todayOps')}</h3>
              <Card>
                <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '16px 0' }}>
                  {t('common.noResults')}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'shabihs' && (
            <div className={styles.shabihsTab}>
              <h3 style={{ marginBottom: '16px' }}>{t('restaurant.topShabihs')}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {/* Mock List of Top Shabihs */}
                {[
                  { name: '+966500000000', convRate: '12%', status: 'activeAmbassador' },
                  { name: '+966511111111', convRate: '9%', status: 'ambassador' }
                ].map((shabih, idx) => (
                  <Card key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="user" />
                      </div>
                      <div dir="ltr">
                        <div style={{ fontWeight: 'bold' }}>{shabih.name}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--accent-gold)' }}>معدل التحويل: {shabih.convRate}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">{t('restaurant.select')}</Button>
                  </Card>
                ))}
              </div>

              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h4>{t('restaurant.trialDishes')}</h4>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      {t('restaurant.trialDishesLocked')}
                    </p>
                  </div>
                  <Button variant="primary" disabled>{t('restaurant.addDish')}</Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={styles.settingsForm}>
              <Input label={t('restaurant.validDays')} placeholder="7" type="number" />
              <Input label={t('restaurant.cooldownDays')} placeholder="30" type="number" />
              <Input label={t('restaurant.maxDishes')} placeholder={t('restaurant.unlimited')} type="number" />
              
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                <Button variant="primary" fullWidth>{t('common.save')}</Button>
              </div>
              <Card style={{ marginTop: '24px', textAlign: 'center' }}>
                <h4 style={{ marginBottom: '8px' }}>{t('restaurant.recruitQr')}</h4>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {t('restaurant.recruitQrDesc')}
                </p>
                <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '16px' }}>
                  <QRCodeSVG 
                    value={typeof window !== 'undefined' ? `${window.location.origin}/ar/r/${slug}` : `https://${slug}.shabih.io`} 
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                  />
                </div>
                <Button variant="outline" icon="camera" fullWidth>{t('restaurant.downloadQr')}</Button>
              </Card>
            </div>
          )}
        </div>
      </main>
    </RoleGuard>
  );
}
