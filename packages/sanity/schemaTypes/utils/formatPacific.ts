// schemaTypes/utils/formatPacific.ts

const pacificFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

/** Formats an ISO timestamp in Pacific time, e.g. "Oct 9, 2026, 3:42 PM". */
export const formatPacific = (iso: string) => pacificFormat.format(new Date(iso));
