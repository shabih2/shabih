'use client';

import { useState, use } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/Input';

export default function RestaurantAuthPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!password) return;
    
    setLoading(true);
    setError('');

    // Simulate login for Restaurant/Cashier
    setTimeout(() => {
      if (password === '1234') {
        // Successful login
        localStorage.setItem('shabih_session', slug);
        const locale = window.location.pathname.split('/')[1] || 'ar';
        window.location.href = `/${locale}/r/${slug}/dashboard`;
      } else {
        setError('كلمة المرور غير صحيحة، الرمز السري للمحاكاة هو 1234');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Icon name="store" size="xl" />
          </div>
          <h1 dir="ltr">{slug}.shabih.io</h1>
          <p>{t('auth.restaurantLogin')}</p>
        </div>

        <div className={styles.form}>
          <Input
            type="password"
            placeholder="كلمة المرور الفرع"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            className={styles.passwordInput}
            error={error}
            disabled={loading}
          />
          
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleLogin}
            loading={loading}
            disabled={!password}
          >
            {t('auth.loginTitle')}
          </Button>
        </div>
      </div>
    </main>
  );
}
