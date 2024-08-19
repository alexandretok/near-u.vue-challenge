export class HelperService {
  /**
   * Format date.
   * @param date date to be formatted.
   * @return Formatted date string.
   */
  formatDate(date: string) {
    let str = '';
    if (date) {
      str = new Date(date).toLocaleDateString('pt-PT', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
    }
    return str;
  }
}

export const Helper = new HelperService();
