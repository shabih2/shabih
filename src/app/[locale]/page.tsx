'use client';

import { useLocale, useTranslations } from 'next-intl';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Icon name="shabih-active" size="xl" />
          </div>
          <h1 className={styles.brandName}>{t('common.appName')}</h1>
          <p className={styles.tagline}>shabih.io</p>
        </div>

        {/* Features */}
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Icon name="camera" size="lg" />
            </div>
            <div className={styles.featureText}>
              <h3>{t('join.step1')}</h3>
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Icon name="share" size="lg" />
            </div>
            <div className={styles.featureText}>
              <h3>{t('join.step2')}</h3>
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Icon name="gift" size="lg" />
            </div>
            <div className={styles.featureText}>
              <h3>{t('join.step3')}</h3>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon="arrow-right"
            iconPosition="end"
            onClick={() => window.location.href = `/${locale}/auth`}
          >
            {t('auth.loginTitle')}
          </Button>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            icon="store"
            onClick={() => window.location.href = `/${locale}/r/alburger/auth`}
          >
            {t('auth.areYouRestaurant')}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <Icon name="shabih" size="sm" />
        <span>shabih.io</span>
      </footer>
    </main>
  );
}
