(function () {
  'use strict';

  var LOGO_URL = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/19539d25-7649-448d-aee2-1059faf1a092.png';
  var LOGO_WIDTH = 80;
  var DISCLAIMER_LOGO_URL = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/3410cdab-9740-4fd8-8079-fe9d1bba3190.png';
  var ICON_SIZE = 24;
  var SOCIAL_META = {
    facebook: {
      icon: 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/12a4b72a-782e-4459-a340-9e051d33f740.png',
      label: 'Facebook',
    },
    instagram: {
      icon: 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/7ecd3f53-13d6-47d4-a017-1b9aaa572439.png',
      label: 'Instagram',
    },
  };
  var WEBSITE = 'https://www.inuvet.com';
  var WEBSITE_LABEL = 'inuvet.com';
  var IMPRESSUM_URL = 'https://docs.google.com/document/d/1e9QR-qiQK8PR6oFuDRzqoxSEbHvEFzfQHwUcU9e4CW0/edit?tab=t.0';
  var IMPRESSUM_LABEL = 'Imprint';
  var BRAND_GREEN = '#78b41b';
  var FG = '#2E2E2E';
  var FG_MUTED = '#666666';
  /* Gmail „Normal“ ≈ 13px — ohne explizite Größe fällt Gmail oft auf 16px zurück */
  var SIG_FONT = '13px';
  var SIG_FONT_SM = '11px';
  var SIG_FONT_FACE = 'Arial,Helvetica,sans-serif';
  var SIG_MAX_WIDTH = 480;

  function sigCell(extra) {
    return 'style="margin:0;padding:0;line-height:1.35;font-size:' + SIG_FONT + ';font-family:' + SIG_FONT_FACE + ';' + (extra || '') + '"';
  }

  function sigFont(color, size) {
    return 'face="Arial" color="' + color + '" style="font-family:' + SIG_FONT_FACE + ';font-size:' + (size || SIG_FONT) + ';"';
  }

  var fields = {
    name: document.getElementById('f-name'),
    personalOn: document.getElementById('f-personal-on'),
    position: document.getElementById('f-position'),
    email: document.getElementById('f-email'),
    phone: document.getElementById('f-phone'),
    fax: document.getElementById('f-fax'),
    quote: document.getElementById('f-quote'),
    photo: document.getElementById('f-photo'),
    header: document.getElementById('f-header'),
    topImageNone: document.getElementById('f-top-none'),
    topImageHeader: document.getElementById('f-top-header'),
    topImagePortrait: document.getElementById('f-top-portrait'),
    company: document.getElementById('f-company'),
    street: document.getElementById('f-street'),
    city: document.getElementById('f-city'),
    country: document.getElementById('f-country'),
    disclaimerOn: document.getElementById('f-disclaimer-on'),
    disclaimer: document.getElementById('f-disclaimer'),
    contactHintOn: document.getElementById('f-contact-hint-on'),
    contactHint: document.getElementById('f-contact-hint'),
    contactHintEmail: document.getElementById('f-contact-hint-email'),
    contactHintPhone: document.getElementById('f-contact-hint-phone'),
    socialFacebook: document.getElementById('f-social-facebook'),
    socialInstagram: document.getElementById('f-social-instagram'),
    socialFacebookUrl: document.getElementById('f-social-facebook-url'),
    socialInstagramUrl: document.getElementById('f-social-instagram-url'),
  };

  var disclaimerWrap = document.getElementById('disclaimer-wrap');
  var contactHintWrap = document.getElementById('contact-hint-wrap');
  var personalWrap = document.getElementById('personal-wrap');
  var headerWrap = document.getElementById('header-wrap');
  var photoWrap = document.getElementById('photo-wrap');
  var socialWraps = {
    facebook: document.getElementById('social-facebook-wrap'),
    instagram: document.getElementById('social-instagram-wrap'),
  };

  var preview = document.getElementById('signature-preview');
  var copyTarget = document.getElementById('sig-copy-target');
  var copyBtn = document.getElementById('copy-btn');
  var lastPreviewHtml = '';
  var updateTimer = null;
  var UPDATE_DELAY = 250;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sigEmailLink(email, label) {
    return '<a href="mailto:' + escapeAttr(email) + '" style="color:' + BRAND_GREEN + ';text-decoration:none;font-size:' + SIG_FONT + ';">'
      + '<font ' + sigFont(BRAND_GREEN) + '>' + escapeHtml(label || email) + '</font></a>';
  }

  function sigPhoneLink(phone) {
    return '<a href="tel:' + phone.replace(/\s/g, '') + '" style="color:' + BRAND_GREEN + ';text-decoration:none;font-size:' + SIG_FONT + ';">'
      + '<font ' + sigFont(BRAND_GREEN) + '>' + escapeHtml(phone) + '</font></a>';
  }

  function phonePattern(phone) {
    var parts = phone.trim().split(/\s+/).map(function (part) {
      return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });
    return new RegExp(parts.join('\\s*'), 'g');
  }

  function replaceInSegments(segments, pattern, type) {
    var next = [];
    segments.forEach(function (seg) {
      if (seg.type !== 'text') {
        next.push(seg);
        return;
      }
      var str = seg.value;
      var last = 0;
      var match;
      var re = pattern instanceof RegExp ? pattern : phonePattern(pattern);
      re.lastIndex = 0;
      while ((match = re.exec(str)) !== null) {
        if (match.index > last) {
          next.push({ type: 'text', value: str.slice(last, match.index) });
        }
        next.push({ type: type, value: match[0] });
        last = match.index + match[0].length;
        if (match[0].length === 0) {
          re.lastIndex++;
        }
        if (!re.global) {
          break;
        }
      }
      if (last < str.length) {
        next.push({ type: 'text', value: str.slice(last) });
      }
    });
    return next.length ? next : segments;
  }

  function linkifyContactHintParagraph(text, email, phone) {
    var segments = [{ type: 'text', value: text }];

    if (phone) {
      segments = replaceInSegments(segments, phonePattern(phone), 'phone');
    }
    if (email) {
      segments = replaceInSegments(segments, new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 'email');
      segments = replaceInSegments(segments, /\bE-Mail\b/g, 'emailWord');
    }
    segments = replaceInSegments(segments, /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, 'email');
    segments = replaceInSegments(segments, /\+\d[\d\s]{6,}\d/g, 'phone');

    return segments.map(function (seg) {
      if (seg.type === 'text') return escapeHtml(seg.value);
      if (seg.type === 'phone') return sigPhoneLink(seg.value);
      if (seg.type === 'emailWord') return sigEmailLink(email, 'E-Mail');
      return sigEmailLink(seg.value, seg.value);
    }).join('');
  }

  function escapeHtmlWithBreaks(text) {
    return String(text)
      .split(/\r?\n/)
      .map(function (line) { return escapeHtml(line); })
      .join('<br>');
  }

  function linkifyContactHintWithBreaks(text, email, phone) {
    return String(text)
      .split(/\r?\n/)
      .map(function (line) { return linkifyContactHintParagraph(line, email, phone); })
      .join('<br>');
  }

  function buildDisclaimerRows(text, skipLeadingGap) {
    var gap = 'style="margin:0;padding:0;font-size:6px;line-height:6px;mso-line-height-rule:exactly;"';
    var paragraphs = text.split(/\n\s*\n/).map(function (p) {
      return p.trim();
    }).filter(Boolean);

    if (!paragraphs.length) return '';

    var rows = skipLeadingGap ? '' : '<tr><td ' + gap + '>&nbsp;</td></tr>';
    paragraphs.forEach(function (p, i) {
      if (i === 0) {
        rows += '<tr><td ' + sigCell() + '><strong><font ' + sigFont(FG) + '>'
          + escapeHtmlWithBreaks(p) + '</font></strong></td></tr>';
      } else {
        rows += '<tr><td ' + sigCell() + '><font ' + sigFont(FG_MUTED) + '>'
          + escapeHtmlWithBreaks(p) + '</font></td></tr>';
      }
      if (i < paragraphs.length - 1) {
        rows += '<tr><td ' + gap + '>&nbsp;</td></tr>';
      }
    });
    return rows;
  }

  function buildContactHintRows(text, email, phone, skipLeadingGap) {
    var gap = 'style="margin:0;padding:0;font-size:6px;line-height:6px;mso-line-height-rule:exactly;"';
    var paragraphs = text.split(/\n\s*\n/).map(function (p) {
      return p.trim();
    }).filter(Boolean);

    if (!paragraphs.length) return '';

    var rows = skipLeadingGap ? '' : '<tr><td ' + gap + '>&nbsp;</td></tr>';
    paragraphs.forEach(function (p, i) {
      var content = i === 0
        ? escapeHtmlWithBreaks(p)
        : linkifyContactHintWithBreaks(p, email, phone);
      if (i === 0) {
        rows += '<tr><td ' + sigCell() + '><strong><font ' + sigFont(FG) + '>'
          + content + '</font></strong></td></tr>';
      } else {
        rows += '<tr><td ' + sigCell() + '><font ' + sigFont(FG_MUTED) + '>'
          + content + '</font></td></tr>';
      }
      if (i < paragraphs.length - 1) {
        rows += '<tr><td ' + gap + '>&nbsp;</td></tr>';
      }
    });
    return rows;
  }

  function buildSocialRow(d) {
    var items = [];
    if (d.socialFacebook && d.socialFacebookUrl) {
      items.push({ url: d.socialFacebookUrl, icon: SOCIAL_META.facebook.icon, label: SOCIAL_META.facebook.label });
    }
    if (d.socialInstagram && d.socialInstagramUrl) {
      items.push({ url: d.socialInstagramUrl, icon: SOCIAL_META.instagram.icon, label: SOCIAL_META.instagram.label });
    }
    if (!items.length) return '';

    var gapTop = 'style="margin:0;padding:0;font-size:10px;line-height:10px;mso-line-height-rule:exactly;"';

    var cells = items.map(function (item, i) {
      var pad = i < items.length - 1 ? 'padding-right:8px;' : '';
      return '<td style="margin:0;padding:0;' + pad + 'line-height:1;">'
        + '<a href="' + escapeAttr(item.url) + '" target="_blank" rel="noopener" style="text-decoration:none;">'
        + '<img src="' + escapeAttr(item.icon) + '" alt="' + escapeAttr(item.label) + '" width="' + ICON_SIZE + '" height="' + ICON_SIZE + '" decoding="async" '
        + 'style="display:block;width:' + ICON_SIZE + 'px;height:' + ICON_SIZE + 'px;border:0;">'
        + '</a></td>';
    }).join('');

    return '<tr><td ' + gapTop + '>&nbsp;</td></tr>'
      + '<tr><td style="margin:0;padding:0;line-height:1;">'
      + '<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">'
      + '<tbody><tr>' + cells + '</tr></tbody></table>'
      + '</td></tr>';
  }

  function buildHeaderBlock(url) {
    if (!url) return '';
    var gapAfter = 'style="margin:0;padding:0;font-size:12px;line-height:12px;mso-line-height-rule:exactly;"';
    return '<table cellpadding="0" cellspacing="0" border="0" '
      + 'style="border-collapse:collapse;width:100%;max-width:' + SIG_MAX_WIDTH + 'px;background-color:#ffffff;">'
      + '<tbody><tr><td style="margin:0;padding:0;line-height:0;font-size:0;">'
        + '<img src="' + escapeAttr(url) + '" alt="" width="' + SIG_MAX_WIDTH + '" decoding="async" '
      + 'style="display:block;width:100%;max-width:' + SIG_MAX_WIDTH + 'px;height:auto;border:0;">'
      + '</td></tr>'
      + '<tr><td ' + gapAfter + '>&nbsp;</td></tr>'
      + '</tbody></table>';
  }

  function buildSignature(d) {
    var gap = 'style="margin:0;padding:0;font-size:6px;line-height:6px;mso-line-height-rule:exactly;"';
    var gapHeadline = 'style="margin:0;padding:0;font-size:8px;line-height:8px;mso-line-height-rule:exactly;"';
    var gapBlock = 'style="margin:0;padding:0;font-size:10px;line-height:10px;mso-line-height-rule:exactly;"';
    var tableBase = 'border-collapse:collapse;background-color:#ffffff;font-size:' + SIG_FONT + ';font-family:' + SIG_FONT_FACE + ';';

    var quoteRow = d.quote
      ? '<tr><td ' + sigCell() + '>'
        + '<em><font ' + sigFont(FG_MUTED) + '">»' + escapeHtml(d.quote) + '«</font></em>'
        + '</td></tr>'
        + '<tr><td ' + gap + '>&nbsp;</td></tr>'
      : '';

    var phoneRow = d.phone
      ? '<tr><td ' + sigCell() + '>'
        + (d.fax ? '<font ' + sigFont(FG_MUTED) + '>Tel </font>' : '')
        + '<a href="tel:' + d.phone.replace(/\s/g, '') + '" style="color:' + BRAND_GREEN + ';text-decoration:none;font-size:' + SIG_FONT + ';">'
        + '<font ' + sigFont(BRAND_GREEN) + '>' + escapeHtml(d.phone) + '</font></a>'
        + '</td></tr>'
      : '';

    var faxRow = d.fax
      ? '<tr><td ' + sigCell() + '>'
        + '<font ' + sigFont(FG_MUTED) + '>Fax </font>'
        + '<a href="tel:' + d.fax.replace(/\s/g, '') + '" style="color:' + BRAND_GREEN + ';text-decoration:none;font-size:' + SIG_FONT + ';">'
        + '<font ' + sigFont(BRAND_GREEN) + '>' + escapeHtml(d.fax) + '</font></a>'
        + '</td></tr>'
      : '';

    function greenLineRow() {
      return '<tr><td ' + sigCell() + '>'
        + '<font ' + sigFont(BRAND_GREEN, SIG_FONT) + '>—</font>'
        + '</td></tr>';
    }

    function blockSpacer() {
      return '<tr><td ' + gapBlock + '>&nbsp;</td></tr>'
        + '<tr><td ' + gap + '>&nbsp;</td></tr>';
    }

    function impressumRow() {
      return '<tr><td ' + gap + '>&nbsp;</td></tr>'
        + '<tr><td ' + sigCell('font-size:' + SIG_FONT_SM + ';') + '>'
        + '<a href="' + escapeAttr(IMPRESSUM_URL) + '" style="color:' + BRAND_GREEN + ';text-decoration:none;font-size:' + SIG_FONT_SM + ';">'
        + '<font ' + sigFont(BRAND_GREEN, SIG_FONT_SM) + '>' + IMPRESSUM_LABEL + '</font></a>'
        + '</td></tr>';
    }

    function logoRow(url, alt, width) {
      return '<tr><td style="margin:0;padding:0;line-height:1;">'
        + '<img src="' + escapeAttr(url) + '" alt="' + escapeHtml(alt) + '" width="' + width + '" decoding="async" '
        + 'style="display:block;width:' + width + 'px;height:auto;border:0;">'
        + '</td></tr>'
        + '<tr><td ' + gapBlock + '>&nbsp;</td></tr>';
    }

    function photoRow(photo, name) {
      if (!photo) return '';
      var gapPhoto = 'style="margin:0;padding:0;font-size:12px;line-height:12px;mso-line-height-rule:exactly;"';
      return '<tr><td style="margin:0;padding:0;line-height:1;">'
        + '<img src="' + escapeAttr(photo) + '" alt="' + escapeHtml(name) + '" width="' + LOGO_WIDTH + '" decoding="async" '
        + 'style="display:block;width:' + LOGO_WIDTH + 'px;height:' + LOGO_WIDTH + 'px;object-fit:cover;border:0;border-radius:50%;">'
        + '</td></tr>'
        + '<tr><td ' + gapPhoto + '>&nbsp;</td></tr>';
    }

    var disclaimerRows = d.disclaimerOn && d.disclaimer
      ? '<tr><td ' + gapBlock + '>&nbsp;</td></tr>'
        + logoRow(DISCLAIMER_LOGO_URL, 'Inuvet', LOGO_WIDTH)
        + buildDisclaimerRows(d.disclaimer, true)
      : '';

    var contactHintRows = d.contactHintOn && d.contactHint
      ? '<tr><td ' + gapBlock + '>&nbsp;</td></tr>'
        + buildContactHintRows(d.contactHint, d.contactHintEmail, d.contactHintPhone, true)
      : '';

    var socialRow = buildSocialRow(d);

    var topBlock = d.topImage === 'portrait' && d.photo
      ? photoRow(d.photo, d.name)
      : d.topImage === 'none'
        ? greenLineRow() + '<tr><td ' + gap + '>&nbsp;</td></tr>'
        : '';

    var personalBlock = d.personalOn
      ? quoteRow
        + '<tr><td ' + sigCell() + '>'
        + '<strong><font ' + sigFont(FG) + '>' + escapeHtml(d.name) + '</font></strong>'
        + '</td></tr>'
        + '<tr><td ' + gapHeadline + '>&nbsp;</td></tr>'
        + '<tr><td ' + sigCell() + '>'
        + '<font ' + sigFont(FG_MUTED) + '>' + escapeHtml(d.position) + '</font>'
        + '</td></tr>'
        + '<tr><td ' + sigCell() + '>'
        + '<a href="mailto:' + escapeHtml(d.email) + '" style="color:' + BRAND_GREEN + ';text-decoration:none;font-size:' + SIG_FONT + ';">'
        + '<font ' + sigFont(BRAND_GREEN) + '>' + escapeHtml(d.email) + '</font></a>'
        + '</td></tr>'
        + phoneRow
        + faxRow
        + blockSpacer()
      : '';

    var contactBlock = ''
      + topBlock
      + personalBlock
      + logoRow(LOGO_URL, 'inuvet', LOGO_WIDTH)
      + '<tr><td ' + sigCell() + '>'
      + '<strong><font ' + sigFont(FG) + '>' + escapeHtml(d.company) + '</font></strong>'
      + '</td></tr>'
      + '<tr><td ' + gapHeadline + '>&nbsp;</td></tr>'
      + '<tr><td ' + sigCell() + '>'
      + '<font ' + sigFont(FG_MUTED) + '>' + escapeHtml(d.street) + '</font>'
      + '</td></tr>'
      + '<tr><td ' + sigCell() + '>'
      + '<font ' + sigFont(FG_MUTED) + '>' + escapeHtml(d.city) + '</font>'
      + '</td></tr>'
      + '<tr><td ' + sigCell() + '>'
      + '<font ' + sigFont(FG_MUTED) + '>' + escapeHtml(d.country) + '</font>'
      + '</td></tr>'
      + '<tr><td ' + sigCell() + '>'
      + '<a href="' + WEBSITE + '" style="color:' + BRAND_GREEN + ';text-decoration:none;font-size:' + SIG_FONT + ';">'
      + '<font ' + sigFont(BRAND_GREEN) + '>' + WEBSITE_LABEL + '</font></a>'
      + '</td></tr>'
      + disclaimerRows
      + contactHintRows
      + socialRow
      + impressumRow();

    return (
      (d.topImage === 'header' && d.header ? buildHeaderBlock(d.header) : '')
      + '<table cellpadding="0" cellspacing="0" border="0" '
      + 'style="' + tableBase + 'width:100%;max-width:' + SIG_MAX_WIDTH + 'px;">'
      + '<tbody>' + contactBlock + '</tbody></table>'
    );
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  function getTopImageType() {
    if (fields.topImageHeader.checked) return 'header';
    if (fields.topImagePortrait.checked) return 'portrait';
    return 'none';
  }

  function readFields() {
    var topImage = getTopImageType();
    return {
      name: fields.name.value || '',
      position: fields.position.value || '',
      email: fields.email.value || '',
      phone: fields.phone.value || '',
      fax: fields.fax.value || '',
      quote: fields.quote.value || '',
      personalOn: fields.personalOn.checked,
      topImage: topImage,
      photo: topImage === 'portrait' ? fields.photo.value.trim() : '',
      header: topImage === 'header' ? fields.header.value.trim() : '',
      company: fields.company.value || '',
      street: fields.street.value || '',
      city: fields.city.value || '',
      country: fields.country.value || '',
      disclaimerOn: fields.disclaimerOn.checked,
      disclaimer: fields.disclaimer.value || '',
      contactHintOn: fields.contactHintOn.checked,
      contactHint: fields.contactHint.value || '',
      contactHintEmail: fields.contactHintEmail.value.trim(),
      contactHintPhone: fields.contactHintPhone.value.trim(),
      socialFacebook: fields.socialFacebook.checked,
      socialInstagram: fields.socialInstagram.checked,
      socialFacebookUrl: fields.socialFacebookUrl.value.trim(),
      socialInstagramUrl: fields.socialInstagramUrl.value.trim(),
    };
  }

  function renderPreview(html) {
    if (html === lastPreviewHtml) return;
    lastPreviewHtml = html;
    preview.innerHTML = html;
  }

  function updateNow() {
    clearTimeout(updateTimer);
    renderPreview(getSignatureMarkup());
  }

  function scheduleUpdate() {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(updateNow, UPDATE_DELAY);
  }

  function syncVisibility() {
    disclaimerWrap.classList.toggle('--hidden', !fields.disclaimerOn.checked);
    contactHintWrap.classList.toggle('--hidden', !fields.contactHintOn.checked);
    personalWrap.classList.toggle('--hidden', !fields.personalOn.checked);
    headerWrap.classList.toggle('--hidden', getTopImageType() !== 'header');
    photoWrap.classList.toggle('--hidden', getTopImageType() !== 'portrait');
    socialWraps.facebook.classList.toggle('--hidden', !fields.socialFacebook.checked);
    socialWraps.instagram.classList.toggle('--hidden', !fields.socialInstagram.checked);
  }

  function toggleDisclaimer() {
    syncVisibility();
    updateNow();
  }

  function toggleContactHint() {
    syncVisibility();
    updateNow();
  }

  function togglePersonal() {
    syncVisibility();
    updateNow();
  }

  function toggleTopImage() {
    syncVisibility();
    updateNow();
  }

  function toggleSocialFields() {
    syncVisibility();
    updateNow();
  }

  function getSignatureMarkup() {
    return buildSignature(readFields());
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

  function wrapHtmlDocument(body, title) {
    return '<!DOCTYPE html>\n<html lang="de">\n<head>\n'
      + '<meta charset="UTF-8">\n'
      + (title ? '<title>' + title + '</title>\n' : '')
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
      var html = getSignatureMarkup();
      copyTarget.innerHTML = html;
      var range = document.createRange();
      range.selectNode(copyTarget);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand('copy');
      sel.removeAllRanges();

      copyBtn.classList.add('--copied');
      showToast('Signatur kopiert!', 'success');
      setTimeout(function () {
        copyBtn.classList.remove('--copied');
      }, 2500);
    } catch (e) {
      showToast('Kopieren fehlgeschlagen — bitte manuell kopieren.', 'error');
    }
  }

  function downloadHtml() {
    var markup = prettyPrintHtml(getSignatureMarkup());
    var doc = wrapHtmlDocument(markup, 'Inuvet E-Mail-Signatur');
    downloadFile(doc, 'inuvet-signatur.html');
    showToast('HTML-Code heruntergeladen!', 'success');
  }

  function downloadForThunderbird() {
    var doc = wrapHtmlDocument(getSignatureMarkup());
    downloadFile(doc, 'inuvet-signatur-thunderbird.html');
  }

  document.getElementById('sig-form').addEventListener('input', scheduleUpdate);
  fields.disclaimerOn.addEventListener('change', toggleDisclaimer);
  fields.contactHintOn.addEventListener('change', toggleContactHint);
  fields.personalOn.addEventListener('change', togglePersonal);
  fields.topImageNone.addEventListener('change', toggleTopImage);
  fields.topImageHeader.addEventListener('change', toggleTopImage);
  fields.topImagePortrait.addEventListener('change', toggleTopImage);
  fields.socialFacebook.addEventListener('change', toggleSocialFields);
  fields.socialInstagram.addEventListener('change', toggleSocialFields);
  fields.photo.addEventListener('paste', function () {
    setTimeout(scheduleUpdate, 0);
  });
  fields.photo.addEventListener('change', scheduleUpdate);
  fields.header.addEventListener('paste', function () {
    setTimeout(scheduleUpdate, 0);
  });
  fields.header.addEventListener('change', scheduleUpdate);
  copyBtn.addEventListener('click', copy);
  document.getElementById('html-btn').addEventListener('click', downloadHtml);
  document.getElementById('thunderbird-btn').addEventListener('click', downloadForThunderbird);

  syncVisibility();
  updateNow();
})();
