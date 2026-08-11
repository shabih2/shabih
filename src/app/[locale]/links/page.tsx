'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import RoleGuard from '@/components/layout/RoleGuard';

export default function LinksPage() {
  const t = useTranslations();
  const router = useRouter();
  
  const [phone, setPhone] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('alburger');
  const [generatedLink, setGeneratedLink] = useState('');
  
  // Mock data for MVP
  const availableRestaurants = [
    { id: 'alburger', name: 'Al Burger', active: true },
    { id: 'pizzahouse', name: 'Pizza House', active: true },
  ];

  const myLinks = [
    { id: 'link1', restaurant: 'alburger', views: 145, claims: 12 },
  ];

  useEffect(() => {
    const session = localStorage.getItem('shabih_session');
    if (session) {
      setPhone(session.replace('+', ''));
    }
  }, []);

  const handleCreateLink = () => {
    const link = `https://${selectedRestaurant}.shabih.io/${phone}`;
    setGeneratedLink(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    alert(t('common.copied'));
  };

  return (
    <RoleGuard allowedRoles={['ambassador']}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h2>{t('ambassador.myLinks')}</h2>
          <Button variant="ghost" icon="arrow-right" onClick={() => router.back()} />
        </header>

        <div className={styles.content}>
          
          <Card className={styles.createLinkCard}>
            <h3 className={styles.sectionTitle}>{t('ambassador.createLink')}</h3>
            <select 
              className={styles.restaurantSelect}
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
            >
              {availableRestaurants.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            
            <Button variant="primary" fullWidth onClick={handleCreateLink}>
              {t('ambassador.createLink')}
            </Button>

            {generatedLink && (
              <div className={styles.generatedLinkBox}>
                <span className={styles.generatedLinkText} dir="ltr">{generatedLink}</span>
                <Button variant="ghost" icon="camera" onClick={handleCopy} size="sm" />
              </div>
            )}
          </Card>

          <h3 className={styles.sectionTitle} style={{ marginTop: '16px' }}>{t('ambassador.myLinks')}</h3>
          
          <div className={styles.linksList}>
            {myLinks.map(link => {
              const r = availableRestaurants.find(res => res.id === link.restaurant);
              return (
                <Card key={link.id} className={styles.linkCard}>
                  <div className={styles.linkHeader}>
                    <div className={styles.restaurantInfo}>
                      <div className={styles.restaurantIcon}>
                        <Icon name="store" />
                      </div>
                      <div className={styles.restaurantName} dir="ltr">{r?.name}</div>
                    </div>
                    <Button variant="outline" size="sm" icon="camera" />
                  </div>
                  <div className={styles.linkStats}>
                    <div className={styles.statItem}>
                      <Icon name="camera" size="sm" />
                      <span>{link.views} {t('ambassador.views')}</span>
                    </div>
                    <div className={styles.statItem}>
                      <Icon name="gift" size="sm" />
                      <span>{link.claims} {t('restaurant.redeemed')}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      </main>
    </RoleGuard>
  );
}
