(function () {
  'use strict';

  var LOGO_URL = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/19539d25-7649-448d-aee2-1059faf1a092.png';
  var LOGO_WIDTH = 96;
  var DISCLAIMER_LOGO_URL = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/3410cdab-9740-4fd8-8079-fe9d1bba3190.png';
  var ICON_SIZE = 24;
  var FB_ICON = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/12a4b72a-782e-4459-a340-9e051d33f740.png';
  var IG_ICON = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/7ecd3f53-13d6-47d4-a017-1b9aaa572439.png';
  var FB_URL = 'https://www.facebook.com/inuvet.de';
  var IG_URL = 'https://www.instagram.com/inuvet_tiergesundheit/';
  var WEBSITE = 'https://www.inuvet.com';
  var WEBSITE_LABEL = 'inuvet.com';
  var IMPRESSUM_URL = 'https://docs.google.com/document/d/1e9QR-qiQK8PR6oFuDRzqoxSEbHvEFzfQHwUcU9e4CW0/edit?tab=t.0';
  var COMPANY = 'Inuvet GmbH';
  var STREET = 'Berner Weg 7–25';
  var CITY = '79539 Lörrach';
  var COUNTRY = 'Deutschland';
  var BRAND_GREEN = '#78b41b';
  var FG = '#2E2E2E';
  var FG_MUTED = '#666666';
  var SIG_FONT = 'small';
  var SIG_FONT_SM = '85%';
  var SIG_FONT_FACE = 'Arial,Helvetica,sans-serif';
  var EMAIL_MAX = 600;

  var DISCLAIMER =
    'Nur in eurer Praxis\n\n'
    + 'Googelt doch mal: Ihr findet im Internet alles – außer Inuvet-Produkte zum Kauf. '
    + 'Der Vertrieb läuft ausschließlich über eure Tierarztpraxis.';

  var DEFAULT_CONTACT =
    'Fragen?\n\n'
    + 'Wir helfen euch gerne weiter! Ihr erreicht uns per E-Mail oder telefonisch unter +49 (0) 7621 57 91 510.';

  var PRESETS = {
    rechnung: {
      subject: 'Ausgangsrechnung - {{rechnungsnummer}}; Kundennummer: {{kundennummer}}',
      headline: '',
      salutation: 'Liebes Praxisteam,',
      body:
        'vielen Dank für die Bestellung! Im Anhang dieser E-Mail findet ihr die Rechnung.\n\n'
        + 'Bei Fragen – zu Patienten, Indikationen oder auch der Rechnung – erreicht ihr uns unter '
        + 'info@inuvet.com oder am Telefon: +49 7621 57915-10.',
      closing: 'Wir wünschen euch geduldige und natürlich gesunde Patienten!',
      ctaLabel: '',
      ctaUrl: '',
      contact: DEFAULT_CONTACT,
      blocks: {
        logo: true,
        contact: false,
        company: true,
        disclaimer: true,
        social: true,
        imprint: true,
      },
    },
    service: {
      subject: 'Eure Reklamation ist angekommen',
      headline: '',
      salutation: 'Liebes Praxisteam,',
      body:
        'eure Reklamation ist bei uns angekommen – danke, dass ihr euch die Zeit genommen habt, uns zu schreiben. '
        + 'Wir melden uns innerhalb von 1–2 Werktagen mit einer Rückmeldung bei euch.',
      closing: 'Tierische Grüße vom ganzen Inuvet-Team!',
      ctaLabel: '',
      ctaUrl: '',
      contact: DEFAULT_CONTACT,
      blocks: {
        logo: true,
        contact: false,
        company: true,
        disclaimer: true,
        social: true,
        imprint: true,
      },
    },
    status: {
      subject: 'Deine Anfrage ist unterwegs',
      headline: 'Schon unterwegs!',
      salutation: 'Hey!',
      body:
        'Danke für deine Anfrage für\n\n'
        + '• {{produkt}}\n\n'
        + 'Wir leiten sie an eure Tierarztpraxis weiter. Die Praxis aktiviert die Empfehlung und meldet sich bei dir.',
      closing: 'Viele Grüße vom Inuvet Team!',
      ctaLabel: '',
      ctaUrl: '',
      contact: DEFAULT_CONTACT,
      blocks: {
        logo: true,
        contact: true,
        company: true,
        disclaimer: true,
        social: false,
        imprint: true,
      },
    },
    custom: {
      subject: '',
      headline: '',
      salutation: 'Liebes Praxisteam,',
      body: '',
      closing: '',
      ctaLabel: '',
      ctaUrl: '',
      contact: DEFAULT_CONTACT,
      blocks: {
        logo: true,
        contact: false,
        company: true,
        disclaimer: false,
        social: false,
        imprint: true,
      },
    },
  };

  var fields = {
    preset: document.getElementById('f-preset'),
    subject: document.getElementById('f-subject'),
    headline: document.getElementById('f-headline'),
    salutation: document.getElementById('f-salutation'),
    body: document.getElementById('f-body'),
    closing: document.getElementById('f-closing'),
    ctaLabel: document.getElementById('f-cta-label'),
    ctaUrl: document.getElementById('f-cta-url'),
    contact: document.getElementById('f-contact'),
    blockLogo: document.getElementById('f-block-logo'),
    blockContact: document.getElementById('f-block-contact'),
    blockCompany: document.getElementById('f-block-company'),
    blockDisclaimer: document.getElementById('f-block-disclaimer'),
    blockSocial: document.getElementById('f-block-social'),
    blockImprint: document.getElementById('f-block-imprint'),
  };

  var contactWrap = document.getElementById('contact-wrap');
  var preview = document.getElementById('email-preview');
  var subjectPreview = document.getElementById('em-subject-preview');
  var copyTarget = document.getElementById('em-copy-target');
  var copyBtn = document.getElementById('copy-btn');
  var lastHtml = '';
  var updateTimer = null;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  function textStyle(color, size, extra) {
    var fontPart = size ? ('font-size:' + size + ';') : '';
    return 'color:' + color + ';' + fontPart + 'font-family:' + SIG_FONT_FACE
      + ';line-height:1.45;mso-line-height-rule:exactly;' + (extra || '');
  }

  function linkStyle(size) {
    var fontPart = size ? ('font-size:' + size + ';') : '';
    return 'color:' + BRAND_GREEN + ';text-decoration:none;' + fontPart + 'font-family:' + SIG_FONT_FACE + ';';
  }

  function cell(extra) {
    return 'style="margin:0;padding:0;line-height:1.45;font-size:' + SIG_FONT
      + ';font-family:' + SIG_FONT_FACE + ';' + (extra || '') + '"';
  }

  function gapRow(px) {
    return '<tr><td style="margin:0;padding:0;font-size:' + px + 'px;line-height:' + px
      + 'px;mso-line-height-rule:exactly;">&nbsp;</td></tr>';
  }

  function breakAutoLink(str) {
    return escapeHtml(String(str)).replace(/(\d)/g, '$1&#8204;');
  }

  function addressLine(text) {
    var ls = 'color:' + FG_MUTED + ';text-decoration:none;font-size:inherit;font-family:' + SIG_FONT_FACE + ';';
    return '<a href="" style="' + ls + '"><span style="' + textStyle(FG_MUTED) + '">'
      + breakAutoLink(text) + '</span></a>';
  }

  function linkifyInline(text) {
    var emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    var phoneRe = /\+\d[\d\s()/.-]{6,}\d/g;
    var parts = [];
    var str = String(text);
    var tokens = [];
    var last = 0;
    var combined = new RegExp(emailRe.source + '|' + phoneRe.source, 'g');
    var match;
    while ((match = combined.exec(str)) !== null) {
      if (match.index > last) tokens.push({ type: 'text', value: str.slice(last, match.index) });
      tokens.push({
        type: match[0].indexOf('@') >= 0 ? 'email' : 'phone',
        value: match[0],
      });
      last = match.index + match[0].length;
    }
    if (last < str.length) tokens.push({ type: 'text', value: str.slice(last) });
    if (!tokens.length) tokens = [{ type: 'text', value: str }];

    return tokens.map(function (t) {
      if (t.type === 'text') return escapeHtml(t.value);
      if (t.type === 'email') {
        return '<a href="mailto:' + escapeAttr(t.value) + '" style="' + linkStyle() + '">'
          + '<span style="' + linkStyle() + '">' + escapeHtml(t.value) + '</span></a>';
      }
      return '<a href="tel:' + t.value.replace(/[^\d+]/g, '') + '" style="' + linkStyle() + '">'
        + '<span style="' + linkStyle() + '">' + escapeHtml(t.value) + '</span></a>';
    }).join('');
  }

  function renderParagraphs(text, opts) {
    opts = opts || {};
    var paragraphs = String(text).split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
    if (!paragraphs.length) return '';

    var html = '';
    paragraphs.forEach(function (p, i) {
      var lines = p.split(/\r?\n/);
      var inner = lines.map(function (line) {
        var trimmed = line.trim();
        var bullet = trimmed.match(/^[•\-]\s+(.*)$/);
        if (bullet) {
          return '<span style="' + textStyle(FG) + '"><strong>'
            + linkifyInline(bullet[1]) + '</strong></span>';
        }
        return opts.linkify
          ? '<span style="' + textStyle(opts.muted ? FG_MUTED : FG) + '">' + linkifyInline(line) + '</span>'
          : '<span style="' + textStyle(opts.muted ? FG_MUTED : FG, null, opts.bold ? 'font-weight:bold;' : '') + '">'
            + escapeHtml(line) + '</span>';
      }).join('<br>');

      if (opts.firstStrong && i === 0 && lines.length === 1 && !/^[•\-]/.test(lines[0].trim())) {
        inner = '<span style="' + textStyle(FG) + '"><strong>' + escapeHtml(lines[0]) + '</strong></span>';
      }

      html += '<tr><td ' + cell() + '>' + inner + '</td></tr>';
      if (i < paragraphs.length - 1) html += gapRow(10);
    });
    return html;
  }

  function logoRow(url, alt, width, href) {
    var img = '<img src="' + escapeAttr(url) + '" alt="' + escapeHtml(alt) + '" width="' + width
      + '" decoding="async" style="display:block;width:' + width + 'px;height:auto;border:0;">';
    if (href) {
      img = '<a href="' + escapeAttr(href) + '" style="text-decoration:none;border:0;">' + img + '</a>';
    }
    return '<tr><td style="margin:0;padding:0;line-height:1;">' + img + '</td></tr>' + gapRow(16);
  }

  function ctaRow(label, url) {
    if (!label || !url) return '';
    return gapRow(16)
      + '<tr><td ' + cell() + '>'
      + '<a href="' + escapeAttr(url) + '" style="display:inline-block;background-color:' + BRAND_GREEN
      + ';color:#ffffff;text-decoration:none;font-family:' + SIG_FONT_FACE
      + ';font-size:14px;font-weight:bold;padding:12px 20px;border:0;">'
      + escapeHtml(label) + '</a>'
      + '</td></tr>';
  }

  function socialRow() {
    var items = [
      { url: FB_URL, icon: FB_ICON, label: 'Facebook' },
      { url: IG_URL, icon: IG_ICON, label: 'Instagram' },
    ];
    var cells = items.map(function (item, i) {
      var pad = i < items.length - 1 ? 'padding-right:8px;' : '';
      return '<td style="margin:0;padding:0;' + pad + 'line-height:1;">'
        + '<a href="' + escapeAttr(item.url) + '" target="_blank" rel="noopener" style="text-decoration:none;">'
        + '<img src="' + escapeAttr(item.icon) + '" alt="' + escapeAttr(item.label) + '" width="'
        + ICON_SIZE + '" height="' + ICON_SIZE + '" decoding="async" '
        + 'style="display:block;width:' + ICON_SIZE + 'px;height:' + ICON_SIZE + 'px;border:0;">'
        + '</a></td>';
    }).join('');
    return gapRow(14)
      + '<tr><td style="margin:0;padding:0;line-height:1;">'
      + '<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">'
      + '<tbody><tr>' + cells + '</tr></tbody></table>'
      + '</td></tr>';
  }

  function readFields() {
    return {
      subject: fields.subject.value.trim(),
      headline: fields.headline.value.trim(),
      salutation: fields.salutation.value.trim(),
      body: fields.body.value,
      closing: fields.closing.value.trim(),
      ctaLabel: fields.ctaLabel.value.trim(),
      ctaUrl: fields.ctaUrl.value.trim(),
      contact: fields.contact.value,
      blockLogo: fields.blockLogo.checked,
      blockContact: fields.blockContact.checked,
      blockCompany: fields.blockCompany.checked,
      blockDisclaimer: fields.blockDisclaimer.checked,
      blockSocial: fields.blockSocial.checked,
      blockImprint: fields.blockImprint.checked,
    };
  }

  function buildDisclaimerRows() {
    var paragraphs = DISCLAIMER.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
    var html = '';
    paragraphs.forEach(function (p, i) {
      if (i === 0) {
        html += '<tr><td ' + cell() + '><span style="' + textStyle(FG) + '"><strong>'
          + escapeHtml(p) + '</strong></span></td></tr>';
      } else {
        html += '<tr><td ' + cell() + '><span style="' + textStyle(FG_MUTED) + '">'
          + escapeHtml(p) + '</span></td></tr>';
      }
      if (i < paragraphs.length - 1) html += gapRow(8);
    });
    return html;
  }

  function buildEmail(d) {
    var rows = '';

    if (d.blockLogo) {
      rows += logoRow(LOGO_URL, 'inuvet', LOGO_WIDTH, WEBSITE);
    }

    if (d.headline) {
      rows += '<tr><td ' + cell() + '>'
        + '<span style="' + textStyle(FG, '22px', 'font-weight:bold;') + '">'
        + escapeHtml(d.headline) + '</span></td></tr>'
        + gapRow(14);
    }

    if (d.salutation) {
      rows += '<tr><td ' + cell() + '>'
        + '<span style="' + textStyle(FG) + '">' + escapeHtml(d.salutation) + '</span>'
        + '</td></tr>'
        + gapRow(10);
    }

    if (d.body && d.body.trim()) {
      rows += renderParagraphs(d.body, { linkify: true });
    }

    rows += ctaRow(d.ctaLabel, d.ctaUrl);

    if (d.closing) {
      rows += gapRow(14)
        + '<tr><td ' + cell() + '>'
        + '<span style="' + textStyle(FG) + '">' + escapeHtml(d.closing) + '</span>'
        + '</td></tr>';
    }

    if (d.blockContact && d.contact.trim()) {
      rows += gapRow(22) + renderParagraphs(d.contact, { linkify: true, firstStrong: true });
    }

    var needsFooter = d.blockCompany || d.blockDisclaimer || d.blockSocial || d.blockImprint;
    if (needsFooter) {
      rows += gapRow(22)
        + '<tr><td style="margin:0;padding:0;border-top:1px solid #e5e5e5;font-size:1px;line-height:1px;">&nbsp;</td></tr>'
        + gapRow(18);
    }

    if (d.blockCompany) {
      if (!d.blockLogo) {
        rows += logoRow(LOGO_URL, 'inuvet', LOGO_WIDTH, WEBSITE);
      }
      rows += '<tr><td ' + cell() + '>'
        + '<span style="' + textStyle(FG, null, 'font-weight:bold;') + '">' + escapeHtml(COMPANY) + '</span>'
        + '</td></tr>'
        + gapRow(6)
        + '<tr><td ' + cell() + '>' + addressLine(STREET) + '</td></tr>'
        + '<tr><td ' + cell() + '>' + addressLine(CITY) + '</td></tr>'
        + '<tr><td ' + cell() + '>' + addressLine(COUNTRY) + '</td></tr>'
        + '<tr><td ' + cell() + '>'
        + '<a href="' + escapeAttr(WEBSITE) + '" style="' + linkStyle() + '">'
        + '<span style="' + linkStyle() + '">' + escapeHtml(WEBSITE_LABEL) + '</span></a>'
        + '</td></tr>';
    }

    if (d.blockDisclaimer) {
      rows += gapRow(18)
        + logoRow(DISCLAIMER_LOGO_URL, 'Inuvet', LOGO_WIDTH, WEBSITE)
        + buildDisclaimerRows();
    }

    if (d.blockSocial) {
      rows += socialRow();
    }

    if (d.blockImprint) {
      rows += gapRow(10)
        + '<tr><td ' + cell() + '>'
        + '<a href="' + escapeAttr(IMPRESSUM_URL) + '" style="' + linkStyle(SIG_FONT_SM) + '">'
        + '<span style="' + linkStyle(SIG_FONT_SM) + '">Imprint</span></a>'
        + '</td></tr>';
    }

    return (
      '<div style="font-size:' + SIG_FONT + ';font-family:' + SIG_FONT_FACE + ';color:' + FG + ';line-height:1.45;">'
      + '<table cellpadding="0" cellspacing="0" border="0" width="100%" '
      + 'style="border-collapse:collapse;background-color:#ffffff;font-size:' + SIG_FONT
      + ';font-family:' + SIG_FONT_FACE + ';width:100%;max-width:' + EMAIL_MAX + 'px;">'
      + '<tbody>' + rows + '</tbody></table>'
      + '</div>'
    );
  }

  function getMarkup() {
    return buildEmail(readFields());
  }

  function syncVisibility() {
    contactWrap.classList.toggle('--hidden', !fields.blockContact.checked);
  }

  function updateNow() {
    clearTimeout(updateTimer);
    var d = readFields();
    var html = buildEmail(d);
    if (html !== lastHtml) {
      lastHtml = html;
      preview.innerHTML = html;
    }
    subjectPreview.textContent = d.subject ? ('Betreff: ' + d.subject) : '';
  }

  function scheduleUpdate() {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(updateNow, 200);
  }

  function applyPreset(id) {
    var p = PRESETS[id] || PRESETS.custom;
    fields.subject.value = p.subject;
    fields.headline.value = p.headline;
    fields.salutation.value = p.salutation;
    fields.body.value = p.body;
    fields.closing.value = p.closing;
    fields.ctaLabel.value = p.ctaLabel;
    fields.ctaUrl.value = p.ctaUrl;
    fields.contact.value = p.contact;
    fields.blockLogo.checked = p.blocks.logo;
    fields.blockContact.checked = p.blocks.contact;
    fields.blockCompany.checked = p.blocks.company;
    fields.blockDisclaimer.checked = p.blocks.disclaimer;
    fields.blockSocial.checked = p.blocks.social;
    fields.blockImprint.checked = p.blocks.imprint;
    syncVisibility();
    updateNow();
  }

  function prettyPrintHtml(html) {
    var pad = '  ';
    var result = '';
    var indent = 0;
    html.replace(/>\s*</g, '>\n<').split('\n').forEach(function (line) {
      line = line.trim();
      if (!line) return;
      if (/^<\//.test(line)) indent = Math.max(0, indent - 1);
      result += pad.repeat(indent) + line + '\n';
      if (/^<[a-zA-Z]/.test(line) && !/\/>$/.test(line) && !/^<\//.test(line)
        && !/^<(br|hr|img|input|meta|link|tbody|thead|tfoot|tr|td|font|a)\b/i.test(line)) {
        indent++;
      }
    });
    return result.trim();
  }

  function wrapHtmlDocument(body) {
    return '<!DOCTYPE html>\n<html lang="de">\n<head>\n'
      + '<meta charset="UTF-8">\n'
      + '<title>Inuvet E-Mail-Vorlage</title>\n'
      + '</head>\n<body>\n\n'
      + body + '\n\n</body>\n</html>\n';
  }

  function downloadFile(content, filename) {
    var blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function copy() {
    try {
      copyTarget.innerHTML = getMarkup();
      var range = document.createRange();
      range.selectNode(copyTarget);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand('copy');
      sel.removeAllRanges();
      copyBtn.classList.add('--copied');
      showToast('HTML kopiert!', 'success');
      setTimeout(function () {
        copyBtn.classList.remove('--copied');
      }, 2500);
    } catch (e) {
      showToast('Kopieren fehlgeschlagen — bitte manuell kopieren.', 'error');
    }
  }

  function downloadHtml() {
    var doc = wrapHtmlDocument(prettyPrintHtml(getMarkup()));
    downloadFile(doc, 'inuvet-email-vorlage.html');
    showToast('HTML-Datei heruntergeladen!', 'success');
  }

  document.getElementById('em-form').addEventListener('input', function () {
    syncVisibility();
    scheduleUpdate();
  });
  fields.preset.addEventListener('change', function () {
    applyPreset(fields.preset.value);
  });
  fields.blockContact.addEventListener('change', function () {
    syncVisibility();
    updateNow();
  });
  copyBtn.addEventListener('click', copy);
  document.getElementById('html-btn').addEventListener('click', downloadHtml);

  applyPreset(fields.preset.value || 'rechnung');
})();
