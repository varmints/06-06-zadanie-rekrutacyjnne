import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TooltipService {
  /**
   * Determines if a tooltip should be shown for a given value.
   * @param value The string value to check.
   * @param maxLength The maximum length before showing a tooltip.
   */
  shouldShowTooltip(value: string, maxLength = 30): boolean {
    return typeof value === 'string' && value.length > maxLength;
  }

  /**
   * Truncates text to a specified length, adding ellipsis if needed.
   * @param value The string value to truncate.
   * @param maxLength The maximum length of the truncated string.
   */
  truncateText(value: string, maxLength = 30): string {
    if (typeof value !== 'string') return value;
    return value.length > maxLength ? value.slice(0, maxLength) + '...' : value;
  }
}
