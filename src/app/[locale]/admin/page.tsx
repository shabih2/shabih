'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

export default function AdminDashboard() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [newName, setNewName] = useState('');

  // Mock Data
  const stats = {
    totalRestaurants: 12,
    totalAmbassadors: 345,
    totalClaims: 1289
  };

  const restaurants = [
    { id: 'alburger', name: 'البرجر الذهبي', slug: 'alburger' },
    { id: 'pizzahouse', name: 'بيتزا هاوس', slug: 'pizzahouse' },
    { id: 'cafearabia', name: 'مقهى أرابيا', slug: 'cafearabia' },
  ];

  const handleAddRestaurant = () => {
    if (!newSlug || !newName) return;
    // Simulate adding to DB
    alert(`تم إضافة المطعم: ${newName}`);
    setShowAddModal(false);
    setNewSlug('');
    setNewName('');
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>سفير - الإدارة العليا</div>
        <Button variant="ghost" icon="logout" onClick={() => router.push('/')} />
      </header>

      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statIcon}><Icon name="store" size="lg" /></div>
          <div className={styles.statValue}>{stats.totalRestaurants}</div>
          <div className={styles.statLabel}>المطاعم المسجلة</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statIcon}><Icon name="shabih" size="lg" /></div>
          <div className={styles.statValue}>{stats.totalAmbassadors}</div>
          <div className={styles.statLabel}>إجمالي السفراء</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statIcon}><Icon name="gift" size="lg" /></div>
          <div className={styles.statValue}>{stats.totalClaims}</div>
          <div className={styles.statLabel}>أطباق الضيافة</div>
        </Card>
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>إدارة المطاعم</h2>
        <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
          إضافة مطعم
        </Button>
      </div>

      <div className={styles.restaurantsList}>
        {restaurants.map(r => (
          <Card key={r.id} className={styles.restaurantCard}>
            <div className={styles.restaurantInfo}>
              <div className={styles.restaurantIcon}>
                <Icon name="store" />
              </div>
              <div>
                <div className={styles.restaurantName}>{r.name}</div>
                <div className={styles.restaurantSlug} dir="ltr">{r.slug}.shabih.io</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.open(`/r/${r.slug}/dashboard`, '_blank')}>
              دخول
            </Button>
          </Card>
        ))}
      </div>

      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>إضافة مطعم جديد</h3>
            <Input 
              label="اسم المطعم (بالعربية)" 
              value={newName} 
              onChange={e => setNewName(e.target.value)} 
              placeholder="مثال: شاورما بلس" 
            />
            <Input 
              label="المعرف (Slug - إنجليزي)" 
              value={newSlug} 
              onChange={e => setNewSlug(e.target.value)} 
              placeholder="مثال: shawarmaplus" 
              dir="ltr"
            />
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <Button variant="ghost" fullWidth onClick={() => setShowAddModal(false)}>إلغاء</Button>
              <Button variant="primary" fullWidth onClick={handleAddRestaurant}>حفظ</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
