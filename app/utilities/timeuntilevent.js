export default function timeUntilEvent(isoTimestamp) {
  const now = new Date();
  const eventTime = new Date(isoTimestamp);
  const diffMs = eventTime - now;

  if (diffMs <= 0) return "Event is Live";

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays >= 1) {
    return `Starts in ${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  } else if (diffHours >= 1) {
    return `Starts in ${diffHours} ${diffHours === 1 ? "hour" : "hours"}`;
  } else if (diffMinutes >= 1) {
    return `Starts in ${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"}`;
  } else if (diffSeconds >= 1) {
    return `Starts in ${diffSeconds} ${diffSeconds === 1 ? "minute" : "minutes"}`;
  }
}