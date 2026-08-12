'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Icon from '@/components/ui/Icon';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'ambassador' | 'restaurant')[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');
  const locale = useLocale();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated auth check using localStorage (MVP Lean mode)
    const session = localStorage.getItem('shabih_session');
    const isRestaurantRoute = pathname.includes('/r/');
    
    if (!session) {
      // Not logged in
      if (isRestaurantRoute) {
        // Redirect to specific restaurant login
        const slug = pathname.split('/r/')[1]?.split('/')[0];
        if (slug && !pathname.endsWith('/auth')) {
          window.location.href = `/${locale}/r/${slug}/auth`;
        } else {
          setLoading(false);
          setIsAuthorized(true); // Allow them to see the auth page
        }
      } else {
        if (!pathname.endsWith('/auth') && pathname !== '/' && pathname !== '/ar' && pathname !== '/en') {
          window.location.href = `/${locale}/auth`;
        } else {
          setLoading(false);
          setIsAuthorized(true);
        }
      }
      return;
    }

    // Determine current role based on session
    // In our MVP simulation:
    // If session is just digits or starts with +, it's a customer/ambassador.
    // If session is an alphanumeric slug, it's a restaurant.
    const normalizeNumber = (str: string) => str.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
    const normalizedSession = normalizeNumber(session);
    const isRestaurantSession = !normalizedSession.startsWith('+') && isNaN(Number(normalizedSession));

    if (isRestaurantRoute && !isRestaurantSession) {
      // User trying to access restaurant dashboard
      window.location.href = `/${locale}/profile`;
      return;
    }

    if (!isRestaurantRoute && isRestaurantSession) {
      // Restaurant trying to access user app
      window.location.href = `/${locale}/r/${session}/dashboard`;
      return;
    }

    // Role check logic (simplified for MVP)
    if (allowedRoles) {
      // e.g. check if they are activated ambassador if required
      // For now, allow all authenticated
    }

    setIsAuthorized(true);
    setLoading(false);

  }, [pathname, router, allowedRoles]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100dvh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <Icon name="shabih-active" size="xl" className="spin" />
        <p style={{ color: 'var(--text-secondary)' }}>{t('loading')}</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
