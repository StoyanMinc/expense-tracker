export function formatDateForFetch(startDate: string | Date, endDate: string | Date): { start: string, end: string } {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formattedStart = start.toISOString().split('T')[0]; // yyyy-mm-dd
    const formattedEnd = end.toISOString().split('T')[0];     // yyyy-mm-dd

    return { start: formattedStart, end: formattedEnd };
}