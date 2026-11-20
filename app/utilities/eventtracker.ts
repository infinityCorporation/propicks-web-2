import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from 'firebase/analytics'; // import directly from Firebase
import { analytics } from '../../firebase'; // your configured instance

export function EventTracker({ event_name, info_message, post_id, user_id, user_email, profile_id }) {
  const location = useLocation();

  useEffect(() => {
    if (analytics && event_name) {
      const eventParams = {
        page_path: location.pathname,
        ...(info_message && { message: info_message }),
        ...(post_id && { post_id }),
        ...(user_id && { user_id }),
        ...(user_email && { user_email }),
        ...(profile_id && { profile_id }),
      };
  
      logEvent(analytics, event_name, eventParams);
    }
  }, [analytics, event_name, location]);

  return null;
}