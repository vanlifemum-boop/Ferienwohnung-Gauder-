export function localISODate(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function nextISODate(value) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + 1);
  return localISODate(date);
}

function validISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return Number.isFinite(date.getTime()) && localISODate(date) === value;
}

export function validateDates(arrival, departure, today = localISODate()) {
  if (arrival && !validISODate(arrival)) return 'Bitte geben Sie ein gültiges Anreisedatum ein.';
  if (departure && !validISODate(departure)) return 'Bitte geben Sie ein gültiges Abreisedatum ein.';
  if ((arrival && arrival < today) || (departure && departure < today)) return 'Bitte wählen Sie einen Reisezeitraum ab heute.';
  if (arrival && departure && departure <= arrival) return 'Die Abreise muss nach der Anreise liegen.';
  return '';
}

export function formatDate(value) {
  if (!value) return 'Noch offen';
  const [year, month, day] = value.split('-');
  return `${day}.${month}.${year}`;
}

export function buildEnquiry(data) {
  const apartments = { '3': 'Ferienwohnung für bis zu 3 Personen', '4': 'Ferienwohnung für bis zu 4 Personen', '7': 'Ferienwohnung für bis zu 7 Personen', mehr: 'Mehrere Wohnungen / zusätzliche Schlafzimmer', offen: 'Noch offen – bitte beraten Sie mich' };
  const guests = data.guests === '8' ? 'Mehr als 7 Personen' : `${data.guests} ${data.guests === '1' ? 'Person' : 'Personen'}`;
  const lines = ['Guten Tag Frau Gauder,', '', 'ich möchte unverbindlich einen Aufenthalt anfragen.', '', `Anreise: ${formatDate(data.arrival)}`, `Abreise: ${formatDate(data.departure)}`, `Gäste: ${guests}`, `Wohnung: ${apartments[data.apartment] || apartments.offen}`, '', 'Meine Nachricht:', data.message?.trim() || 'Bitte teilen Sie mir die Verfügbarkeit und ein passendes Angebot mit.', '', 'Viele Grüße', data.name.trim(), `E-Mail: ${data.email.trim()}`];
  const body = lines.join('\n');
  const subject = `Unverbindliche Anfrage – Ferienwohnungen Gauder${data.arrival ? ' ab ' + formatDate(data.arrival) : ''}`;
  return { subject, body, mailto: `mailto:info@fewogauder.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
