'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import styles from './page.module.css';
import Icon from '@/components/ui/Icon';

interface PageInfo {
  id: string;
  name: string;
  path: string;
  description: string;
  access: string[];
  status: 'complete' | 'in-progress' | 'planned';
  statusLabel: string;
  icon: string;
}

const systemPages: PageInfo[] = [
  {
    id: 'home',
    name: 'الصفحة الرئيسية',
    path: '/',
    description: 'واجهة الهبوط الأساسية للمنصة. تعرض شرحاً مبسطاً لآلية العمل مع أزرار التسجيل للعملاء والمطاعم. أول شاشة يراها أي زائر.',
    access: ['الجميع'],
    status: 'complete',
    statusLabel: 'مكتمل',
    icon: 'home',
  },
  {
    id: 'auth',
    name: 'تسجيل الدخول (OTP)',
    path: '/auth',
    description: 'صفحة مصادقة العملاء والسفراء عبر رقم الجوال ورمز التحقق (OTP). مربوطة بـ Firebase Phone Auth لإرسال رسائل SMS حقيقية.',
    access: ['غير المسجلين'],
    status: 'complete',
    statusLabel: 'مكتمل',
    icon: 'lock',
  },
  {
    id: 'profile',
    name: 'الملف الشخصي',
    path: '/profile',
    description: 'لوحة المستخدم الشخصية. تعرض رقم الجوال، حالة السفير (مفعّل/غير مفعّل)، زر الترقية إلى سفير، وإحصائيات النشاط.',
    access: ['عميل', 'سفير'],
    status: 'complete',
    statusLabel: 'مكتمل',
    icon: 'user',
  },
  {
    id: 'links',
    name: 'مستودع الروابط',
    path: '/links',
    description: 'صفحة خاصة بالسفراء لإنشاء وإدارة روابط الدعوة الخاصة بهم. يمكن نسخ ومشاركة الروابط لكل مطعم مسجل.',
    access: ['سفير فقط'],
    status: 'complete',
    statusLabel: 'مكتمل',
    icon: 'share',
  },
  {
    id: 'recruit',
    name: 'صفحة تجنيد المطعم',
    path: '/r/[slug]',
    description: 'الصفحة التي تظهر عند مسح باركود الطاولة في المطعم. تدعو الزائر للتسجيل كسفير وإنشاء رابطه الخاص فوراً.',
    access: ['الجميع'],
    status: 'complete',
    statusLabel: 'مكتمل',
    icon: 'camera',
  },
  {
    id: 'rest-auth',
    name: 'دخول المطعم',
    path: '/r/[slug]/auth',
    description: 'صفحة تسجيل دخول الكاشير أو مدير المطعم عبر كلمة مرور الفرع. بعد الدخول يتم التوجيه للوحة تحكم المطعم.',
    access: ['كاشير', 'مدير المطعم'],
    status: 'complete',
    statusLabel: 'مكتمل',
    icon: 'store',
  },
  {
    id: 'dashboard',
    name: 'لوحة تحكم المطعم',
    path: '/r/[slug]/dashboard',
    description: 'الشاشة الرئيسية للمطعم. تحتوي على الكاميرا لمسح باركود العميل، إدارة السفراء المميزين، إعدادات الضيافة، وباركود التجنيد.',
    access: ['كاشير', 'مدير المطعم'],
    status: 'complete',
    statusLabel: 'مكتمل',
    icon: 'grid',
  },
  {
    id: 'golden-link',
    name: 'الرابط الذهبي (ضيافة العميل)',
    path: '/r/[slug]/[shabih_id]',
    description: 'الرابط الذي يشاركه السفير لأصدقائه. يُدخل الصديق رقم جواله ويحصل على باركود ضيافة مجانية بعداد تنازلي (5 دقائق) ليعرضه على الكاشير.',
    access: ['الجميع'],
    status: 'complete',
    statusLabel: 'مكتمل',
    icon: 'gift',
  },
  {
    id: 'admin',
    name: 'لوحة إدارة الشركة',
    path: '/admin',
    description: 'لوحة التحكم الرئيسية لمالك المنصة. تعرض إحصائيات شاملة وقائمة المطاعم المسجلة (الآن مربوطة بقاعدة بيانات حقيقية Firestore) مع إمكانية إضافة مطاعم جديدة.',
    access: ['مدير الشركة فقط'],
    status: 'complete',
    statusLabel: 'مكتمل',
    icon: 'settings',
  },
];

export default function DevMapPage() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState('home');

  const activePage = systemPages.find(p => p.id === activeTab)!;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'var(--success)';
      case 'in-progress': return 'var(--warning)';
      case 'planned': return 'var(--text-tertiary)';
      default: return 'var(--text-tertiary)';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'complete': return 'var(--success-light)';
      case 'in-progress': return 'var(--warning-light)';
      case 'planned': return 'hsla(220, 10%, 42%, 0.12)';
      default: return 'hsla(220, 10%, 42%, 0.12)';
    }
  };

  const getFullPath = (path: string) => {
    return `/${locale}${path}`;
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>خريطة النظام</h1>
          <p className={styles.subtitle}>عرض شامل لجميع صفحات المنصة ومراحل تطويرها</p>
        </div>
        <button
          className={styles.backBtn}
          onClick={() => window.location.href = `/${locale}`}
        >
          <Icon name="home" size="sm" />
        </button>
      </header>

      {/* Tabs */}
      <div className={styles.tabsScroll}>
        <div className={styles.tabs}>
          {systemPages.map(page => (
            <button
              key={page.id}
              className={`${styles.tab} ${activeTab === page.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(page.id)}
            >
              <Icon name={page.icon} size="sm" />
              <span>{page.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Page Detail */}
      <div className={styles.detail}>
        <div className={styles.detailHeader}>
          <div className={styles.detailIcon}>
            <Icon name={activePage.icon} size="lg" />
          </div>
          <div>
            <h2>{activePage.name}</h2>
            <code className={styles.pathCode}>{activePage.path}</code>
          </div>
        </div>

        <p className={styles.description}>{activePage.description}</p>

        <div className={styles.metaGrid}>
          {/* Status */}
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>حالة التطوير</span>
            <span
              className={styles.statusBadge}
              style={{
                color: getStatusColor(activePage.status),
                background: getStatusBg(activePage.status),
                borderColor: getStatusColor(activePage.status),
              }}
            >
              {activePage.statusLabel}
            </span>
          </div>

          {/* Access */}
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>صلاحية الدخول</span>
            <div className={styles.accessTags}>
              {activePage.access.map((role, i) => (
                <span key={i} className={styles.accessTag}>{role}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Preview / Link */}
        <div className={styles.previewSection}>
          <a
            href={getFullPath(activePage.path.replace('[slug]', 'alburger').replace('[shabih_id]', '0500000000'))}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.previewLink}
          >
            <Icon name="arrow-right" size="sm" />
            <span>فتح الصفحة في تبويب جديد</span>
          </a>
        </div>
      </div>

      {/* System Overview */}
      <div className={styles.overview}>
        <h3>ملخص النظام</h3>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewStat}>
            <span className={styles.overviewValue}>{systemPages.length}</span>
            <span className={styles.overviewLabel}>صفحة</span>
          </div>
          <div className={styles.overviewStat}>
            <span className={styles.overviewValue} style={{ color: 'var(--success)' }}>
              {systemPages.filter(p => p.status === 'complete').length}
            </span>
            <span className={styles.overviewLabel}>مكتملة</span>
          </div>
          <div className={styles.overviewStat}>
            <span className={styles.overviewValue} style={{ color: 'var(--warning)' }}>
              {systemPages.filter(p => p.status === 'in-progress').length}
            </span>
            <span className={styles.overviewLabel}>قيد العمل</span>
          </div>
          <div className={styles.overviewStat}>
            <span className={styles.overviewValue} style={{ color: 'var(--text-tertiary)' }}>
              {systemPages.filter(p => p.status === 'planned').length}
            </span>
            <span className={styles.overviewLabel}>مخططة</span>
          </div>
        </div>
      </div>
    </main>
  );
}
