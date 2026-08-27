export function formatToJakartaTime(dateString) {
  if (!dateString) return '-';
  try {
    let d = dateString;
    
    if (typeof dateString === 'string') {
        let isoStr = dateString;
        if (dateString.includes(' ') && !dateString.includes('T')) {
            isoStr = dateString.replace(' ', 'T') + 'Z';
        } else if (!dateString.endsWith('Z') && !dateString.includes('+')) {
            isoStr = dateString + 'Z';
        }
        d = new Date(isoStr);
    }
    
    if (isNaN(d)) return dateString;

    return d.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' WIB';
  } catch (e) {
    return dateString;
  }
}
