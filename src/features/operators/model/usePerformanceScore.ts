export function usePerformanceScore() {
  const severity = (score: number) => {
    if (score >= 75) return 'success'
    if (score >= 55) return 'warn'
    return 'danger'
  }

  return { severity }
}
