'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';
import RoleGuard from '@/components/layout/RoleGuard';
import { getAllRestaurants, createRestaurant, Restaurant } from '@/lib/firestore';

export default function AdminDashboard() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin');
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [newName, setNewName] = useState('');

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock Stats for MVP (would normally be computed or stored)
  const stats = {
    totalRestaurants: restaurants.length,
    totalAmbassadors: 345,
    totalClaims: 1289
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getAllRestaurants();
      setRestaurants(data);
      setLoading(false);
    };
    fetchRestaurants();
  }, []);

  const handleAddRestaurant = async () => {
    if (!newSlug || !newName) return;
    try {
      setLoading(true);
      const newRest = await createRestaurant({
        id: newSlug.toLowerCase().trim(),
        name: newName,
        validDays: 7,
        cooldownDays: 30,
        maxDishes: null
      });
      if (newRest) {
        setRestaurants(prev => [...prev, newRest as Restaurant]);
        showToast(`تم إضافة المطعم: ${newName}`, 'success');
        setShowAddModal(false);
        setNewSlug('');
        setNewName('');
      }
    } catch (e) {
      showToast('حدث خطأ أثناء الإضافة', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>لوحة إدارة الشركة</div>
        <Button variant="ghost" icon="logout" onClick={() => window.location.href = `/${locale}`} />
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Icon name="shabih-active" size="lg" className="spin" style={{ color: 'var(--accent-gold)' }} />
          </div>
        ) : (
          restaurants.map(r => (
            <Card key={r.id} className={styles.restaurantCard}>
              <div className={styles.restaurantInfo}>
                <div className={styles.restaurantIcon}>
                  <Icon name="store" />
                </div>
                <div>
                  <div className={styles.restaurantName}>{r.name}</div>
                  <div className={styles.restaurantSlug} dir="ltr">{r.id}.shabih.io</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.open(`/${locale}/r/${r.id}/auth`, '_blank')}>
                دخول
              </Button>
            </Card>
          ))
        )}
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
              <Button variant="primary" fullWidth onClick={handleAddRestaurant} disabled={loading}>
              {loading ? 'جاري الإضافة...' : 'حفظ'}
            </Button>
            </div>
          </div>
        </div>
      )}
    </main>
    </RoleGuard>
  );
}
