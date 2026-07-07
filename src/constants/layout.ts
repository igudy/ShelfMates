export const TAB_BAR_HEIGHT = 80;
export const NEARBY_SHEET_RATIO = 0.5;

export function getNearbySheetHeight(screenHeight: number): number {
  return (screenHeight - TAB_BAR_HEIGHT) * NEARBY_SHEET_RATIO;
}
