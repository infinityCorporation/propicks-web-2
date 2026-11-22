export function isPollActive(timestamp: any) {
  const givenTime: any = new Date(timestamp);
  const now: any = new Date();

  const diffMs = now - givenTime;

  return diffMs < 0;
}