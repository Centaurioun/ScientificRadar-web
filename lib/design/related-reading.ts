/** Show carousel controls only when multiple cards actually overflow the track. */
export function shouldShowRelatedReadingControls(
  articleCount: number,
  hasOverflow: boolean
): boolean {
  return articleCount > 1 && hasOverflow;
}
