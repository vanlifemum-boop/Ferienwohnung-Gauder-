import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDates, nextISODate, formatDate, buildEnquiry } from '../enquiry.mjs';
const today = '2026-10-14';
test('optional dates and valid future stays are accepted', () => {
 assert.equal(validateDates('', '', today), '');
 assert.equal(validateDates('2026-10-14', '2026-10-15', today), '');
 assert.equal(validateDates('', '2026-10-20', today), '');
});
test('past, reversed, same-day and impossible dates are rejected', () => {
 for (const [a,b] of [['2026-10-13','2026-10-17'],['2026-10-17','2026-10-15'],['2026-10-17','2026-10-17'],['2027-02-29','2027-03-05'],['invalid','']]) assert.ok(validateDates(a,b,today));
});
test('date increments handle year end and leap years', () => {
 assert.equal(nextISODate('2026-12-31'), '2027-01-01');
 assert.equal(nextISODate('2028-02-28'), '2028-02-29');
 assert.equal(nextISODate('2028-02-29'), '2028-03-01');
 assert.equal(formatDate('2026-10-14'), '14.10.2026');
});
test('mail links preserve umlauts, special characters and line breaks', () => {
 const data={name:'Müller & Söhne',email:'test+urlaub@example.org',arrival:'2026-10-20',departure:'2026-10-25',guests:'4',apartment:'4',message:'Eine Frage: 2 + 2?\nVielen Dank!'};
 const r=buildEnquiry(data);const u=new URL(r.mailto);
 assert.equal(u.pathname,'info@fewogauder.de');
 assert.equal(u.searchParams.get('body'),r.body);
 assert.equal(u.searchParams.get('subject'),r.subject);
 assert.match(r.body,/Müller & Söhne/);assert.match(r.body,/20\.10\.2026/);assert.match(r.body,/2 \+ 2\?\nVielen Dank!/);
 assert.match(r.body,/für bis zu 4 Personen/);
});
test('open dates and larger parties are described accurately', () => {
 const r=buildEnquiry({name:'Test',email:'test@example.org',arrival:'',departure:'',guests:'8',apartment:'mehr',message:''});
 assert.match(r.body,/Anreise: Noch offen/);assert.match(r.body,/Mehr als 7 Personen/);assert.match(r.body,/zusätzliche Schlafzimmer/);assert.match(r.body,/Verfügbarkeit/);
});
