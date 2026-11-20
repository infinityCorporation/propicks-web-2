// AnalyticsTracker.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from 'firebase/analytics'; // import directly from Firebase
import { analytics } from '../../firebase'; // your configured instance

export function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: location.pathname,
      });
    }
  }, [location]);

  return null;
};