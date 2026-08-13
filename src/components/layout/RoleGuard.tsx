'use client';

import { useEffect, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Icon from '@/components/ui/Icon';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '@/lib/firestore';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'ambassador' | 'admin' | 'restaurant')[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const pathname = usePathname();
  const t = useTranslations('common');
  const locale = useLocale();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isRestaurantRoute = pathname ? pathname.includes('/r/') : false;
    const isAuthRoute = pathname ? pathname.endsWith('/auth') : false;
    const isPublicRoute = !pathname || pathname === '/' || pathname === '/ar' || pathname === '/en';

    const restaurantSession = localStorage.getItem('shabih_restaurant_session');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      
      // 1. If we are on a restaurant route
      if (isRestaurantRoute) {
        if (!restaurantSession) {
          // Not logged in as restaurant
          const slug = pathname ? pathname.split('/r/')[1]?.split('/')[0] : null;
          // Let them view golden link page, recruit page, or auth page
          const isGoldenLink = pathname?.split('/').length === 5; // e.g. /ar/r/alburger/1234
          const isRecruitPage = pathname?.split('/').length === 4; // e.g. /ar/r/alburger
          if (slug && !isAuthRoute && !isGoldenLink && !isRecruitPage) {
            window.location.href = `/${locale}/r/${slug}/auth`;
            return;
          }
        } else {
          // Logged in as restaurant
          if (isAuthRoute) {
            window.location.href = `/${locale}/r/${restaurantSession}/dashboard`;
            return;
          }
        }
        
        setIsAuthorized(true);
        setLoading(false);
        return;
      }

      // 2. Admin Route Protection
      const isAdminRoute = pathname?.includes('/admin');
      if (isAdminRoute || allowedRoles?.includes('admin')) {
         if (!user) {
            window.location.href = `/${locale}`;
            return;
         }
         try {
           const profile = await getUserProfile(user.uid);
           if (!profile || profile.role !== 'admin') {
              window.location.href = `/${locale}/profile`;
              return;
           }
         } catch(e) {
            window.location.href = `/${locale}/profile`;
            return;
         }
         setIsAuthorized(true);
         setLoading(false);
         return;
      }

      // 3. User Route Protection (Customer / Ambassador)
      if (!user) {
        if (!isAuthRoute && !isPublicRoute) {
          window.location.href = `/${locale}/auth`;
          return;
        }
      } else {
        if (isAuthRoute || isPublicRoute) {
          window.location.href = `/${locale}/profile`;
          return;
        }

        // Check specific allowed roles
        if (allowedRoles) {
          try {
            const profile = await getUserProfile(user.uid);
            const userRole = profile?.role || 'customer';
            if (!allowedRoles.includes(userRole as any)) {
               window.location.href = `/${locale}/profile`;
               return;
            }
          } catch(e) {
             window.location.href = `/${locale}/profile`;
             return;
          }
        }
      }

      setIsAuthorized(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, locale]);

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
