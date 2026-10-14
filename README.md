# Ferienwohnungen Gauder

Neue, responsive Website für Ferienwohnungen Gauder in Spangenberg-Pfieffe.

## Stand

Die Website ist als vollständiger, technisch eigenständiger Entwurf umgesetzt. Sie nutzt echte Bilder und überprüfte Angaben aus der bisherigen Website. Die öffentliche Domain `www.fewogauder.de` wurde nicht umgestellt. Suchmaschinenindexierung ist bis zur Veröffentlichung bewusst deaktiviert.

## Enthalten

- Startseite in Naturtönen mit responsivem Layout und mobiler Navigation.
- Drei Wohnungsbereiche für maximal 3, 4 und 7 Personen mit Ausstattungsdetails.
- Bildergalerien mit Tastatursteuerung, nativem Dialog und Fokus-Rückgabe.
- Umgebung, Gastgeber, Monteuraufenthalte und häufige Fragen.
- Reiseanfrage mit Datumsprüfung und Übergabe an das E-Mail-Programm, Kopierfunktion als Alternative.
- Telefon- und E-Mail-Links; Unterkunft und Schlüsselabholung mit getrennten Routenlinks.
- Impressum und Datenschutz als gekennzeichnete Entwurfsfassungen.
- Lokale WebP-Bilder und SVG-Favicon; keine externen Schriftarten, Tracker, Cookies oder JavaScript-Abhängigkeiten im Website-Code.

## Dateien und Pflege

| Datei | Zweck |
| --- | --- |
| `index.html` | Inhalte und Struktur der Startseite |
| `styles.css` | Darstellung und responsive Größen |
| `app.mjs` | Navigation, Galerien und Formularinteraktionen |
| `enquiry.mjs` | Datumsprüfung und sicher kodierte E-Mail-Vorbereitung |
| `assets/` | Eigene Website-Fotos als WebP und Favicon |
| `impressum.html`, `datenschutz.html` | Rechtliche Entwurfsseiten |
| `404.html` | Fehlerseite |
| `robots.txt` | Indexierung vor Veröffentlichung gesperrt |
| `SOURCES.md` | Herkunft der Inhalte und noch zu bestätigende Angaben |

Texte lassen sich direkt in den HTML-Dateien bearbeiten. Telefonnummer und E-Mail müssen bei Änderungen auch in `enquiry.mjs`, den rechtlichen Seiten und den Kontaktlinks angepasst werden. Die Galeriezuordnung liegt in `app.mjs`.

## Lokal ansehen

Die Website benötigt keinen Build-Schritt. Starten Sie aus diesem Verzeichnis einen statischen Server, beispielsweise mit `python3 -m http.server 8000`, und öffnen Sie `http://localhost:8000`. Über `file://` werden JavaScript-Module je nach Browser blockiert.

Prüfungen: `node --test tests/enquiry.test.mjs` sowie `node --check app.mjs`.

## Anfragefunktion

Es gibt keinen Buchungskalender und keine automatische Verfügbarkeitsauskunft. Das Formular sendet keine Daten an einen Webserver. Es erstellt einen E-Mail-Text, der angezeigt und über einen `mailto:`-Link im E-Mail-Programm geöffnet wird. Erst dort versendet der Gast die Nachricht. Ohne eingerichtetes E-Mail-Programm kann der Text kopiert werden. Ohne JavaScript bleiben direkte Telefon- und E-Mail-Links sowie die Foto-Links nutzbar; die Formulare sind ausgeblendet.

## Veröffentlichung

Die Dateien können bei einem geeigneten Anbieter für statische Websites oder auf bestehendem Webspace bereitgestellt werden. Alle Assets und Links sind relativ; es wird kein bestimmter Domainname erzwungen. GitHub dient als Quellcode-Repository.

GitHub Pages schränkt Websites ein, die hauptsächlich auf geschäftliche Transaktionen ausgerichtet sind. Deshalb wurde für die Ferienwohnungsvermietung hier kein automatischer Pages-Deploy und kein Domainwechsel eingerichtet. Siehe [GitHub Pages – Nutzungsgrenzen](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

Vor dem öffentlichen Start:

1. Telefonnummer, Betreiberanschrift, Umsatzsteuer-ID, Schlüsselabholung und aktuelle Ausstattung bestätigen; Abweichungen sind in `SOURCES.md` dokumentiert.
2. Hosting auswählen und die Datenschutzerklärung für dessen tatsächliche Datenverarbeitung fachlich vervollständigen; Entwurfshinweise erst nach Prüfung entfernen.
3. Alte Website und Domainverwaltung sichern; auffällige Casino-Links der bisherigen Website beim bisherigen Betreiber prüfen lassen.
4. `noindex, nofollow` aus den öffentlichen Inhaltsseiten entfernen, `robots.txt` freigeben und Canonical-URLs/Sitemap für die endgültige Domain ergänzen.
5. Alte Pfade (z. B. `/ferienwohnungen/`, `/kontakt-anreise/` und Wohnungsunterseiten) beim gewählten Hoster auf passende neue Ziele umleiten.
6. Die freigegebene Version veröffentlichen und die Domain auf diesen Hoster umstellen. Ein `CNAME` und DNS-Änderungen sind nicht Bestandteil dieses Entwurfs.

## Prüfung dieser Fassung

Datumsgrenzen, E-Mail-Kodierung, interne Links, Fotozuordnungen und lokale Assets werden geprüft. Ein vollständiger visueller Browser- und Mobilgerätetest war in dieser Arbeitsumgebung nicht verfügbar und bleibt vor dem öffentlichen Start erforderlich.
