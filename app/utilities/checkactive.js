export function isPollActive(timestamp) {
  const givenTime = new Date(timestamp);
  const now = new Date();

  const diffMs = now - givenTime;

  return diffMs < 0;
}