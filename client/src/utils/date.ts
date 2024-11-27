/**
 * Converts a Date object to an ISO string with the time set to midnight in UTC.
 * @param inputDate - The input date as a JavaScript Date object.
 * @returns The ISO string representing midnight in UTC.
 */
export function convertToIST(inputDate: Date): string {
    // Set time to midnight in UTC and return in ISO format
    const utcDate = new Date(Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate()));
    return utcDate.toISOString();
  }
  
  