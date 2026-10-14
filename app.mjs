import { localISODate, nextISODate, validateDates, buildEnquiry } from './enquiry.mjs';

document.documentElement.classList.add('js');
const $ = (selector) => document.querySelector(selector);
const menu = $('.menu-toggle');
const nav = $('#navigation');
function closeMenu() { if (!menu || !nav) return; menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
document.addEventListener('click', (event) => { if (nav && menu && !nav.contains(event.target) && !menu.contains(event.target)) closeMenu(); });
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

const datePairs = [['#quick-arrival', '#quick-departure'], ['#arrival', '#departure']];
for (const [start, end] of datePairs) {
  const arrival = $(start), departure = $(end);
  if (!arrival || !departure) continue;
  arrival.min = localISODate(); departure.min = localISODate();
  const update = () => {
    arrival.min = localISODate();
    departure.min = arrival.value ? nextISODate(arrival.value) : localISODate();
    departure.setCustomValidity(validateDates(arrival.value, departure.value));
  };
  arrival.addEventListener('input', update); departure.addEventListener('input', update);
}

const enquiryForm = $('#enquiry-form');
const result = $('#enquiry-result');
const formError = $('#form-error');
let currentEnquiry = null;

function showForm() { if (!result || !enquiryForm) return; result.hidden = true; enquiryForm.hidden = false; }

$('#stay-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const quickArrival = $('#quick-arrival'), quickDeparture = $('#quick-departure');
  const error = validateDates(quickArrival.value, quickDeparture.value);
  quickDeparture.setCustomValidity(error);
  if (error) { quickDeparture.reportValidity(); return; }
  showForm();
  $('#arrival').value = quickArrival.value;
  $('#departure').value = quickDeparture.value;
  $('#guests').value = $('#quick-guests').value;
  $('#arrival').dispatchEvent(new Event('input'));
  $('#departure').dispatchEvent(new Event('input'));
  $('#apartment').value = 'offen';
  $('#anfrage').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  $('#guest-name').focus({ preventScroll: true });
});

document.querySelectorAll('[data-apartment]').forEach((link) => link.addEventListener('click', () => {
  showForm(); const capacity = Number(link.dataset.apartment); $('#apartment').value = String(capacity);
}));
document.querySelectorAll('[data-purpose]').forEach((link) => link.addEventListener('click', () => {
  showForm(); const message = $('#guest-message');
  if (!message.value.trim()) message.value = 'Ich interessiere mich für einen beruflichen Aufenthalt.\n';
}));

enquiryForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(enquiryForm));
  const error = validateDates(data.arrival, data.departure);
  if (!data.name.trim()) { $('#guest-name').setCustomValidity('Bitte geben Sie Ihren Namen ein.'); $('#guest-name').reportValidity(); return; }
  if (error) { formError.hidden = false; formError.textContent = error; return; }
  const capacity = Number(data.apartment);
  if (capacity && Number(data.guests) > capacity) { formError.hidden = false; formError.textContent = 'Für diese Gästezahl wählen Sie bitte eine größere Wohnung, „Mehrere / mit Zusatzräumen“ oder „Ich bin noch offen“.'; $('#apartment').focus(); return; }
  formError.hidden = true;
  currentEnquiry = buildEnquiry(data);
  $('#enquiry-preview').value = currentEnquiry.body;
  $('#mail-link').href = currentEnquiry.mailto;
  $('#copy-status').textContent = '';
  enquiryForm.hidden = true; result.hidden = false;
  result.focus();
});
$('#guest-name')?.addEventListener('input', (event) => event.target.setCustomValidity(''));
$('#edit-enquiry')?.addEventListener('click', () => { showForm(); $('#guest-name').focus(); });
$('#copy-enquiry')?.addEventListener('click', async () => {
  if (!currentEnquiry) return;
  try {
    await navigator.clipboard.writeText(currentEnquiry.body);
    $('#copy-status').textContent = 'Anfrage kopiert. Sie können sie jetzt in Ihre E-Mail einfügen.';
  } catch {
    $('#enquiry-preview').focus(); $('#enquiry-preview').select();
    $('#copy-status').textContent = 'Der Text ist markiert. Kopieren Sie ihn über das Menü Ihres Geräts oder mit Strg/Cmd + C.';
  }
});

const galleries = {
  three: { title: 'Ferienwohnung für bis zu 3 Personen', images: [['wohnung-3-kueche', 'Die Wohnküche mit Esstisch'], ['wohnung-3-schlafen', 'Ein Blick in den Schlafbereich'], ['wohnung-3-bad', 'Badezimmer mit Dusche und WC']] },
  four: { title: 'Ferienwohnung für bis zu 4 Personen', images: [['wohnung-4-wohnen', 'Der gemütliche Wohnbereich'], ['wohnung-4-kueche', 'Die eigene Küche'], ['wohnung-4-schlafen', 'Ein Blick in das Schlafzimmer'], ['wohnung-4-bad', 'Badezimmer mit Dusche und WC']] },
  seven: { title: 'Ferienwohnung für bis zu 7 Personen', images: [['wohnung-7-kueche', 'Die Küche mit gemeinsamer Essecke'], ['wohnung-7-wohnen', 'Ein Blick in den Wohnbereich'], ['wohnung-7-schlafen', 'Schlafzimmer mit mehreren Betten'], ['wohnung-7-bad', 'Das Badezimmer']] },
  region: { title: 'Einblicke in das Pfieffetal', images: [['pfieffe', 'Ein Blick auf Pfieffe'], ['pfieffetal', 'Felder und Bauernhöfe im Pfieffetal'], ['landschaft', 'Unsere Heimat im Kurhessischen Bergland'], ['weide', 'Sommer auf der Weide'], ['winter', 'Winterstimmung im Ortskern von Pfieffe']] }
};
const dialog = $('#gallery-dialog');
let gallery = null, galleryIndex = 0, galleryTrigger = null;
function showImage() {
  const [file, caption] = gallery.images[galleryIndex];
  $('#gallery-image').src = `assets/${file}.webp`;
  $('#gallery-image').alt = caption;
  $('#gallery-caption').textContent = caption;
  $('#gallery-count').textContent = `Bild ${galleryIndex + 1} von ${gallery.images.length}`;
}
function stepImage(delta) { if (!gallery) return; galleryIndex = (galleryIndex + delta + gallery.images.length) % gallery.images.length; showImage(); }
document.querySelectorAll('.gallery-trigger').forEach((link) => link.addEventListener('click', (event) => {
  if (!dialog?.showModal) return;
  event.preventDefault(); gallery = galleries[link.dataset.gallery]; galleryIndex = Number(link.dataset.index || 0); galleryTrigger = link;
  $('#gallery-title').textContent = gallery.title; showImage(); dialog.showModal(); document.body.classList.add('modal-open');
}));
$('.gallery-close')?.addEventListener('click', () => dialog.close());
$('.gallery-prev')?.addEventListener('click', () => stepImage(-1));
$('.gallery-next')?.addEventListener('click', () => stepImage(1));
dialog?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); stepImage(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); stepImage(1); }
});
dialog?.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog?.addEventListener('close', () => { document.body.classList.remove('modal-open'); galleryTrigger?.focus({ preventScroll: true }); });

// Reveal forms only after their local-only submit handlers have been installed.
if (enquiryForm) enquiryForm.hidden = false;
if (document.querySelector('#stay-form')) document.querySelector('#stay-form').hidden = false;
