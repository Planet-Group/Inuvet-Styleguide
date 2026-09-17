(function () {
  'use strict';

  var LOGO_URL = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/19539d25-7649-448d-aee2-1059faf1a092.png';
  var LOGO_WIDTH = 80;
  var DISCLAIMER_LOGO_URL = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/3410cdab-9740-4fd8-8079-fe9d1bba3190.png';
  var VETALITA_LOGO_URL = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/32566504-fe1e-484d-b4b3-bcda8833cb80.png';
  var ICON_SIZE = 24;
  var DEFAULT_PERSON_PHOTO = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/94ec4747-3a90-410e-b6f1-143a0e651845.jpg';
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
  var BRANDS = {
    inuvet: {
      logoUrl: LOGO_URL,
      logoAlt: 'inuvet',
      website: WEBSITE,
      websiteLabel: WEBSITE_LABEL,
      impressumUrl: IMPRESSUM_URL,
      showDisclaimerLogo: true,
      showImprint: true,
    },
    vetalita: {
      logoUrl: VETALITA_LOGO_URL,
      logoAlt: 'Vetalità',
      website: 'https://vetalita.it/',
      websiteLabel: 'vetalita.it',
      impressumUrl: '',
      showDisclaimerLogo: false,
      showImprint: false,
      company: '',
      name: 'Mario Rossi',
      email: 'mario.rossi@vetalita.it',
      contactHintEmail: 'info@vetalita.it',
      disclaimer:
        'Solo nel vostro ambulatorio veterinario.\n\n'
        + 'Provate a cercare su Google! Su internet trovate qualsiasi cosa, ma non i prodotti Vetalità in vendita. '
        + 'Ciò significa che non fornirete consulenza ai vostri clienti per niente: la distribuzione dei nostri prodotti '
        + 'passerà esclusivamente attraverso il vostro ambulatorio.',
    },
  };
  var BRAND_GREEN = '#78b41b';
  var FG = '#2E2E2E';
  var FG_MUTED = '#666666';
  var SIG_FONT = 'small';
  var SIG_FONT_SM = '85%';
  var SIG_FONT_FACE = 'Arial,Helvetica,sans-serif';
  var EMAIL_MAX = 600;

  var FB_DE = 'https://www.facebook.com/inuvet.de';
  var IG_DE = 'https://www.instagram.com/inuvet_tiergesundheit/';
  var IG_FR = 'https://www.instagram.com/inuvet.fr';
  var IG_ES = 'https://www.instagram.com/inuvet.es';
  var IG_EN = 'https://www.instagram.com/inuvet.eng';

  var DISCLAIMER_DE =
    'Nur in eurer Tierarztpraxis\n\n'
    + 'Googelt doch mal! Ihr findet im Internet wirklich alles – außer Inuvet-Produkte zum Kauf. '
    + 'Das bedeutet, ihr beratet eure Kund*innen nicht umsonst: Der Vertrieb unserer Produkte läuft ausschließlich über eure Praxis.';

  var DISCLAIMER_FR =
    'Uniquement en vente chez vous.\n\n'
    + 'Allez voir sur Google! Sur internet, on peut vraiment tout acheter… sauf les produits Inuvet. '
    + 'Ainsi, vous ne conseillez pas vos clients gratuitement car nos produits sont exclusivement distribués '
    + 'par l\u2019intermédiaire des cabinets vétérinaires \u2013 vos clients ne les trouveront nulle part ailleurs.';

  var DISCLAIMER_IT =
    'Solo nel vostro ambulatorio veterinario.\n\n'
    + 'Provate a cercare su Google! Su internet trovate qualsiasi cosa, ma non i prodotti Inuvet in vendita. '
    + 'Ciò significa che non fornirete consulenza ai vostri clienti per niente: la distribuzione dei nostri prodotti '
    + 'passerà esclusivamente attraverso il vostro ambulatorio.';

  var DISCLAIMER_ES =
    'Solo disponible en clínicas veterinarias\n\n'
    + '¡Busca en Google! Realmente en Internet se puede encontrar y comprar de todo – excepto los productos de Inuvet. '
    + 'Esto significa, que no asesoras a tus clientes en vano: la distribución de nuestros productos se realiza '
    + 'exclusivamente a través de tu consulta.';

  var DISCLAIMER_NL =
    'Alleen verkrijgbaar bij je dierenarts\n\n'
    + 'Google maar eens! Je kunt werkelijk alles op het internet kopen – behalve Inuvet producten. '
    + 'Je adviseert je klanten dus niet zomaar, want onze producten zijn uitsluitend te koop bij dierenartspraktijken.';

  var DISCLAIMER_EN =
    'Only available at your veterinary practice\n\n'
    + 'Go ahead and google: you will find all kinds of products on the Internet; but you definitely will not come '
    + 'across any Inuvet products for sale. To ensure that your hard work is not in vain, these are sold '
    + 'exclusively through your practice.';

  var UI = {
    de: {
      docTitle: 'E-Mail-Vorlagen – inuvet',
      pageTitle: 'E-Mail-Vorlagen',
      pageIntro: 'System-Mails für SAP, Shopify, Gmail & Co. — Bausteine wählen, Vorschau prüfen, HTML exportieren.',
      crosslinkSignature: 'Zur E-Mail-Signatur',
      localeLabel: 'Land / Sprache',
      sectionBrand: 'Marke',
      brandHint: 'In Italien heißt Inuvet aus rechtlichen Gründen Vetalità — Logo, Firma und Website passen sich an.',
      presetLabel: 'Vorlage',
      presetRechnung: 'Rechnung (z. B. SAP)',
      presetService: 'Service / Bestätigung (z. B. Gmail)',
      presetStatus: 'Status / Anfrage (z. B. Shopify)',
      presetFooter: 'Nur Footer (System-Text)',
      presetCustom: 'Leer / frei gestalten',
      hintDefault: 'Vorlagen sind Ausgangspunkte — Inhalt und Bausteine bleiben editierbar. Platzhalter wie <code>{{rechnungsnummer}}</code> können die Zielsysteme ersetzen.',
      hintFooter: 'Nur der Footer wird erzeugt — den personalisierten Haupttext liefert das Zielsystem. HTML unter den System-Text einfügen.',
      sectionContent: 'Inhalt',
      subject: 'Betreff (Hinweis)',
      subjectHint: 'Der Betreff wird nicht ins HTML geschrieben — nur als Merker für die Einpflege ins Zielsystem.',
      headline: 'Überschrift (optional)',
      salutation: 'Anrede',
      body: 'Fließtext',
      bodyHint: 'Absätze mit Leerzeile trennen. Eine Zeile mit <code>• </code> oder <code>- </code> wird als Aufzählung gesetzt.',
      closing: 'Grußformel (optional)',
      ctaLabel: 'Button-Text (optional)',
      ctaUrl: 'Button-Link',
      sectionBlocks: 'Bausteine',
      blockLogo: 'Logo oben',
      blockPerson: 'Kontaktperson',
      blockContact: 'Kontakthinweis',
      blockCompany: 'Firma & Adresse',
      blockDisclaimer: '„Nur in eurer Praxis“',
      blockSocial: 'Social Media',
      blockImprint: 'Imprint',
      personName: 'Name',
      personRole: 'Rolle (optional)',
      personPhoto: 'Portrait-URL',
      contactHint: 'Kontakthinweis',
      sectionPreview: 'Vorschau',
      copyBtn: 'HTML kopieren',
      htmlBtn: 'HTML-Datei herunterladen',
      subjectPrefix: 'Betreff: ',
      toastCopied: 'HTML kopiert!',
      toastCopyFail: 'Kopieren fehlgeschlagen — bitte manuell kopieren.',
      toastHtml: 'HTML-Datei heruntergeladen!',
      defaultPersonRole: 'Kundenservice',
      sectionSetup: 'Einrichtung',
      noticeTitle: 'Hinweis',
      noticeBody: 'Der Betreff wird nicht exportiert — nur der HTML-Inhalt. Platzhalter wie <code>{{rechnungsnummer}}</code> im Zielsystem ersetzen.',
      generalTitle: 'Allgemein',
      generalSteps: [
        'Vorlage und Land wählen, Inhalt anpassen.',
        'Vorschau prüfen → <strong>HTML kopieren</strong> oder <strong>HTML-Datei herunterladen</strong>.',
        'Im Zielsystem einfügen — Footer-Vorlage unter den System-Text setzen.',
      ],
      gmailTitle: 'Gmail / Google Workspace',
      gmailSteps: [
        'HTML kopieren und in die Signatur- oder Vorlagen-Einstellung einfügen.',
        'Bei transaktionalen Mails: HTML-Modus im Composer nutzen (<strong>Cmd+Shift+V / Strg+Shift+V</strong> für reines Einfügen).',
      ],
      shopifyTitle: 'Shopify',
      shopifySteps: [
        'Shopify Admin → <strong>Einstellungen → Benachrichtigungen</strong>.',
        'Passende Vorlage öffnen → HTML bearbeiten → Footer-Block einfügen.',
        'Platzhalter des Shops beibehalten — nur den Footer ergänzen.',
      ],
      salesforceTitle: 'Salesforce',
      salesforceSteps: [
        'Classic: <strong>Setup → E-Mail-Vorlagen</strong> · Lightning: <strong>E-Mail-Vorlagen</strong>.',
        'HTML-Vorlage bearbeiten → Footer-HTML einfügen.',
      ],
      sapTitle: 'SAP',
      sapSteps: [
        'Formular / Output-Management → HTML-Footer der Ausgangsrechnung.',
        'Vorlage <strong>Rechnung</strong> als Ausgangspunkt — Platzhalter <code>{{rechnungsnummer}}</code> im SAP-Formular belassen.',
      ],
      locales: {
        de: 'Deutschland', at: 'Österreich', 'ch-de': 'Schweiz (DE)', 'ch-fr': 'Schweiz (FR)',
        'ch-it': 'Schweiz (IT)', fr: 'Frankreich', 'be-fr': 'Belgien (FR)', 'be-nl': 'Belgien (NL)',
        nl: 'Niederlande', es: 'Spanien', it: 'Italien', ie: 'Irland',
      },
    },
    fr: {
      docTitle: 'Modèles e-mail – inuvet',
      pageTitle: 'Modèles e-mail',
      pageIntro: 'E-mails système pour SAP, Shopify, Gmail etc. — choisir les blocs, vérifier l\u2019aperçu, exporter le HTML.',
      crosslinkSignature: 'Vers la signature e-mail',
      localeLabel: 'Pays / langue',
      sectionBrand: 'Marque',
      brandHint: 'En Italie, Inuvet s\u2019appelle Vetalità pour des raisons juridiques — le logo, la société et le site s\u2019adaptent.',
      presetLabel: 'Modèle',
      presetRechnung: 'Facture (p. ex. SAP)',
      presetService: 'Service / confirmation (p. ex. Gmail)',
      presetStatus: 'Statut / demande (p. ex. Shopify)',
      presetFooter: 'Footer uniquement (texte système)',
      presetCustom: 'Vide / libre',
      hintDefault: 'Les modèles sont des points de départ — contenu et blocs restent modifiables. Les placeholders comme <code>{{rechnungsnummer}}</code> sont remplacés par le système cible.',
      hintFooter: 'Seul le footer est généré — le texte principal vient du système cible. Insérer le HTML sous le texte système.',
      sectionContent: 'Contenu',
      subject: 'Objet (indication)',
      subjectHint: 'L\u2019objet n\u2019est pas écrit dans le HTML — uniquement comme repère pour le système cible.',
      headline: 'Titre (optionnel)',
      salutation: 'Formule d\u2019appel',
      body: 'Corps du texte',
      bodyHint: 'Séparer les paragraphes par une ligne vide. Une ligne avec <code>• </code> ou <code>- </code> devient une puce.',
      closing: 'Formule de politesse (optionnel)',
      ctaLabel: 'Texte du bouton (optionnel)',
      ctaUrl: 'Lien du bouton',
      sectionBlocks: 'Blocs',
      blockLogo: 'Logo en haut',
      blockPerson: 'Personne de contact',
      blockContact: 'Note de contact',
      blockCompany: 'Société & adresse',
      blockDisclaimer: '« Uniquement en vente chez vous »',
      blockSocial: 'Réseaux sociaux',
      blockImprint: 'Imprint',
      personName: 'Nom',
      personRole: 'Fonction (optionnel)',
      personPhoto: 'URL du portrait',
      contactHint: 'Note de contact',
      sectionPreview: 'Aperçu',
      copyBtn: 'Copier le HTML',
      htmlBtn: 'Télécharger le fichier HTML',
      subjectPrefix: 'Objet : ',
      toastCopied: 'HTML copié !',
      toastCopyFail: 'Échec de la copie — veuillez copier manuellement.',
      toastHtml: 'Fichier HTML téléchargé !',
      defaultPersonRole: 'Service client',
      sectionSetup: 'Installation',
      noticeTitle: 'Remarque',
      noticeBody: 'L\u2019objet n\u2019est pas exporté — seul le contenu HTML. Remplacer les placeholders comme <code>{{rechnungsnummer}}</code> dans le système cible.',
      generalTitle: 'Général',
      generalSteps: [
        'Choisir modèle et pays, adapter le contenu.',
        'Vérifier l\u2019aperçu → <strong>Copier le HTML</strong> ou <strong>Télécharger le fichier HTML</strong>.',
        'Coller dans le système cible — modèle footer sous le texte système.',
      ],
      gmailTitle: 'Gmail / Google Workspace',
      gmailSteps: [
        'Copier le HTML et coller dans les paramètres de signature ou de modèle.',
        'Pour les mails transactionnels : mode HTML du composer.',
      ],
      shopifyTitle: 'Shopify',
      shopifySteps: [
        'Admin Shopify → <strong>Paramètres → Notifications</strong>.',
        'Ouvrir le modèle → modifier le HTML → insérer le footer.',
      ],
      salesforceTitle: 'Salesforce',
      salesforceSteps: [
        'Classic : <strong>Setup → Modèles d\u2019e-mail</strong> · Lightning : <strong>Modèles d\u2019e-mail</strong>.',
        'Modifier le modèle HTML → insérer le footer.',
      ],
      sapTitle: 'SAP',
      sapSteps: [
        'Formulaire / Output Management → footer HTML de la facture.',
        'Modèle <strong>Facture</strong> comme base — conserver les placeholders SAP.',
      ],
      locales: {
        de: 'Allemagne', at: 'Autriche', 'ch-de': 'Suisse (DE)', 'ch-fr': 'Suisse (FR)',
        'ch-it': 'Suisse (IT)', fr: 'France', 'be-fr': 'Belgique (FR)', 'be-nl': 'Belgique (NL)',
        nl: 'Pays-Bas', es: 'Espagne', it: 'Italie', ie: 'Irlande',
      },
    },
    it: {
      docTitle: 'Modelli e-mail – inuvet',
      pageTitle: 'Modelli e-mail',
      pageIntro: 'E-mail di sistema per SAP, Shopify, Gmail ecc. — scegli i blocchi, controlla l\u2019anteprima, esporta l\u2019HTML.',
      crosslinkSignature: 'Vai alla firma e-mail',
      localeLabel: 'Paese / lingua',
      sectionBrand: 'Marca',
      brandHint: 'In Italia Inuvet si chiama Vetalità per motivi legali — logo, società e sito si adattano di conseguenza.',
      presetLabel: 'Modello',
      presetRechnung: 'Fattura (es. SAP)',
      presetService: 'Servizio / conferma (es. Gmail)',
      presetStatus: 'Stato / richiesta (es. Shopify)',
      presetFooter: 'Solo footer (testo di sistema)',
      presetCustom: 'Vuoto / libero',
      hintDefault: 'I modelli sono punti di partenza — contenuto e blocchi restano modificabili. Placeholder come <code>{{rechnungsnummer}}</code> vengono sostituiti dal sistema di destinazione.',
      hintFooter: 'Viene generato solo il footer — il testo principale proviene dal sistema di destinazione. Inserire l\u2019HTML sotto il testo di sistema.',
      sectionContent: 'Contenuto',
      subject: 'Oggetto (nota)',
      subjectHint: 'L\u2019oggetto non viene scritto nell\u2019HTML — solo come promemoria per il sistema di destinazione.',
      headline: 'Titolo (opzionale)',
      salutation: 'Saluto',
      body: 'Testo',
      bodyHint: 'Separare i paragrafi con una riga vuota. Una riga con <code>• </code> o <code>- </code> diventa un elenco.',
      closing: 'Formula di chiusura (opzionale)',
      ctaLabel: 'Testo pulsante (opzionale)',
      ctaUrl: 'Link pulsante',
      sectionBlocks: 'Blocchi',
      blockLogo: 'Logo in alto',
      blockPerson: 'Persona di contatto',
      blockContact: 'Nota di contatto',
      blockCompany: 'Azienda & indirizzo',
      blockDisclaimer: '« Solo nel vostro ambulatorio »',
      blockSocial: 'Social media',
      blockImprint: 'Imprint',
      personName: 'Nome',
      personRole: 'Ruolo (opzionale)',
      personPhoto: 'URL ritratto',
      contactHint: 'Nota di contatto',
      sectionPreview: 'Anteprima',
      copyBtn: 'Copia HTML',
      htmlBtn: 'Scarica file HTML',
      subjectPrefix: 'Oggetto: ',
      toastCopied: 'HTML copiato!',
      toastCopyFail: 'Copia non riuscita — copiare manualmente.',
      toastHtml: 'File HTML scaricato!',
      defaultPersonRole: 'Servizio clienti',
      sectionSetup: 'Configurazione',
      noticeTitle: 'Nota',
      noticeBody: 'L\u2019oggetto non viene esportato — solo il contenuto HTML. Sostituire i placeholder come <code>{{rechnungsnummer}}</code> nel sistema di destinazione.',
      generalTitle: 'Generale',
      generalSteps: [
        'Scegliere modello e paese, adattare il contenuto.',
        'Controllare l\u2019anteprima → <strong>Copia HTML</strong> o <strong>Scarica file HTML</strong>.',
        'Incollare nel sistema di destinazione — modello footer sotto il testo di sistema.',
      ],
      gmailTitle: 'Gmail / Google Workspace',
      gmailSteps: [
        'Copiare l\u2019HTML e incollare nelle impostazioni firma o modello.',
        'Per e-mail transazionali: modalità HTML del composer.',
      ],
      shopifyTitle: 'Shopify',
      shopifySteps: [
        'Admin Shopify → <strong>Impostazioni → Notifiche</strong>.',
        'Aprire il modello → modificare HTML → inserire il footer.',
      ],
      salesforceTitle: 'Salesforce',
      salesforceSteps: [
        'Classic: <strong>Setup → Modelli e-mail</strong> · Lightning: <strong>Modelli e-mail</strong>.',
        'Modificare il modello HTML → inserire il footer.',
      ],
      sapTitle: 'SAP',
      sapSteps: [
        'Modulo / Output Management → footer HTML della fattura.',
        'Modello <strong>Fattura</strong> come base — mantenere i placeholder SAP.',
      ],
      locales: {
        de: 'Germania', at: 'Austria', 'ch-de': 'Svizzera (DE)', 'ch-fr': 'Svizzera (FR)',
        'ch-it': 'Svizzera (IT)', fr: 'Francia', 'be-fr': 'Belgio (FR)', 'be-nl': 'Belgio (NL)',
        nl: 'Paesi Bassi', es: 'Spagna', it: 'Italia', ie: 'Irlanda',
      },
    },
    es: {
      docTitle: 'Plantillas de correo – inuvet',
      pageTitle: 'Plantillas de correo',
      pageIntro: 'Correos del sistema para SAP, Shopify, Gmail, etc. — elige bloques, revisa la vista previa, exporta HTML.',
      crosslinkSignature: 'Ir a la firma de correo',
      localeLabel: 'País / idioma',
      sectionBrand: 'Marca',
      brandHint: 'En Italia, Inuvet se llama Vetalità por motivos legales: el logo, la empresa y el sitio web se adaptan.',
      presetLabel: 'Plantilla',
      presetRechnung: 'Factura (p. ej. SAP)',
      presetService: 'Servicio / confirmación (p. ej. Gmail)',
      presetStatus: 'Estado / solicitud (p. ej. Shopify)',
      presetFooter: 'Solo pie (texto del sistema)',
      presetCustom: 'Vacío / libre',
      hintDefault: 'Las plantillas son puntos de partida — contenido y bloques siguen siendo editables. Placeholders como <code>{{rechnungsnummer}}</code> los reemplaza el sistema destino.',
      hintFooter: 'Solo se genera el pie — el texto principal lo aporta el sistema destino. Insertar HTML bajo el texto del sistema.',
      sectionContent: 'Contenido',
      subject: 'Asunto (nota)',
      subjectHint: 'El asunto no se escribe en el HTML — solo como referencia para el sistema destino.',
      headline: 'Titular (opcional)',
      salutation: 'Saludo',
      body: 'Texto',
      bodyHint: 'Separar párrafos con línea en blanco. Una línea con <code>• </code> o <code>- </code> se convierte en viñeta.',
      closing: 'Despedida (opcional)',
      ctaLabel: 'Texto del botón (opcional)',
      ctaUrl: 'Enlace del botón',
      sectionBlocks: 'Bloques',
      blockLogo: 'Logo arriba',
      blockPerson: 'Persona de contacto',
      blockContact: 'Nota de contacto',
      blockCompany: 'Empresa y dirección',
      blockDisclaimer: '« Solo en clínicas veterinarias »',
      blockSocial: 'Redes sociales',
      blockImprint: 'Imprint',
      personName: 'Nombre',
      personRole: 'Cargo (opcional)',
      personPhoto: 'URL del retrato',
      contactHint: 'Nota de contacto',
      sectionPreview: 'Vista previa',
      copyBtn: 'Copiar HTML',
      htmlBtn: 'Descargar archivo HTML',
      subjectPrefix: 'Asunto: ',
      toastCopied: '¡HTML copiado!',
      toastCopyFail: 'Error al copiar — cópialo manualmente.',
      toastHtml: '¡Archivo HTML descargado!',
      defaultPersonRole: 'Atención al cliente',
      sectionSetup: 'Configuración',
      noticeTitle: 'Nota',
      noticeBody: 'El asunto no se exporta — solo el contenido HTML. Reemplazar placeholders como <code>{{rechnungsnummer}}</code> en el sistema destino.',
      generalTitle: 'General',
      generalSteps: [
        'Elegir plantilla y país, adaptar contenido.',
        'Revisar vista previa → <strong>Copiar HTML</strong> o <strong>Descargar archivo HTML</strong>.',
        'Pegar en el sistema destino — plantilla de pie bajo el texto del sistema.',
      ],
      gmailTitle: 'Gmail / Google Workspace',
      gmailSteps: [
        'Copiar HTML y pegar en ajustes de firma o plantilla.',
        'Para correos transaccionales: modo HTML del editor.',
      ],
      shopifyTitle: 'Shopify',
      shopifySteps: [
        'Admin Shopify → <strong>Configuración → Notificaciones</strong>.',
        'Abrir plantilla → editar HTML → insertar pie.',
      ],
      salesforceTitle: 'Salesforce',
      salesforceSteps: [
        'Classic: <strong>Setup → Plantillas de correo</strong> · Lightning: <strong>Plantillas de correo</strong>.',
        'Editar plantilla HTML → insertar pie.',
      ],
      sapTitle: 'SAP',
      sapSteps: [
        'Formulario / Output Management → pie HTML de la factura.',
        'Plantilla <strong>Factura</strong> como base — mantener placeholders SAP.',
      ],
      locales: {
        de: 'Alemania', at: 'Austria', 'ch-de': 'Suiza (DE)', 'ch-fr': 'Suiza (FR)',
        'ch-it': 'Suiza (IT)', fr: 'Francia', 'be-fr': 'Bélgica (FR)', 'be-nl': 'Bélgica (NL)',
        nl: 'Países Bajos', es: 'España', it: 'Italia', ie: 'Irlanda',
      },
    },
    nl: {
      docTitle: 'E-mailsjablonen – inuvet',
      pageTitle: 'E-mailsjablonen',
      pageIntro: 'Systeemmails voor SAP, Shopify, Gmail enz. — blokken kiezen, voorbeeld controleren, HTML exporteren.',
      crosslinkSignature: 'Naar e-mailhandtekening',
      localeLabel: 'Land / taal',
      sectionBrand: 'Merk',
      brandHint: 'In Italië heet Inuvet om juridische redenen Vetalità — logo, bedrijf en website passen zich aan.',
      presetLabel: 'Sjabloon',
      presetRechnung: 'Factuur (bijv. SAP)',
      presetService: 'Service / bevestiging (bijv. Gmail)',
      presetStatus: 'Status / aanvraag (bijv. Shopify)',
      presetFooter: 'Alleen footer (systeemtekst)',
      presetCustom: 'Leeg / vrij',
      hintDefault: 'Sjablonen zijn uitgangspunten — inhoud en blokken blijven bewerkbaar. Placeholders zoals <code>{{rechnungsnummer}}</code> vervangt het doelsysteem.',
      hintFooter: 'Alleen de footer wordt gegenereerd — de hoofdtekst komt van het doelsysteem. HTML onder de systeemtekst invoegen.',
      sectionContent: 'Inhoud',
      subject: 'Onderwerp (notitie)',
      subjectHint: 'Het onderwerp wordt niet in de HTML geschreven — alleen als hulp voor het doelsysteem.',
      headline: 'Kop (optioneel)',
      salutation: 'Aanhef',
      body: 'Tekst',
      bodyHint: 'Paragrafen scheiden met lege regel. Een regel met <code>• </code> of <code>- </code> wordt een opsomming.',
      closing: 'Afsluiting (optioneel)',
      ctaLabel: 'Knoptekst (optioneel)',
      ctaUrl: 'Knoplink',
      sectionBlocks: 'Blokken',
      blockLogo: 'Logo bovenaan',
      blockPerson: 'Contactpersoon',
      blockContact: 'Contacthint',
      blockCompany: 'Bedrijf & adres',
      blockDisclaimer: '« Alleen bij je dierenarts »',
      blockSocial: 'Social media',
      blockImprint: 'Imprint',
      personName: 'Naam',
      personRole: 'Functie (optioneel)',
      personPhoto: 'Portret-URL',
      contactHint: 'Contacthint',
      sectionPreview: 'Voorbeeld',
      copyBtn: 'HTML kopiëren',
      htmlBtn: 'HTML-bestand downloaden',
      subjectPrefix: 'Onderwerp: ',
      toastCopied: 'HTML gekopieerd!',
      toastCopyFail: 'Kopiëren mislukt — handmatig kopiëren.',
      toastHtml: 'HTML-bestand gedownload!',
      defaultPersonRole: 'Klantenservice',
      sectionSetup: 'Installatie',
      noticeTitle: 'Opmerking',
      noticeBody: 'Het onderwerp wordt niet geëxporteerd — alleen de HTML-inhoud. Placeholders zoals <code>{{rechnungsnummer}}</code> in het doelsysteem vervangen.',
      generalTitle: 'Algemeen',
      generalSteps: [
        'Sjabloon en land kiezen, inhoud aanpassen.',
        'Voorbeeld controleren → <strong>HTML kopiëren</strong> of <strong>HTML-bestand downloaden</strong>.',
        'Plakken in doelsysteem — footer-sjabloon onder systeemtekst.',
      ],
      gmailTitle: 'Gmail / Google Workspace',
      gmailSteps: [
        'HTML kopiëren en plakken in handtekening- of sjablooninstellingen.',
        'Voor transactionele mails: HTML-modus in de composer.',
      ],
      shopifyTitle: 'Shopify',
      shopifySteps: [
        'Shopify Admin → <strong>Instellingen → Meldingen</strong>.',
        'Sjabloon openen → HTML bewerken → footer invoegen.',
      ],
      salesforceTitle: 'Salesforce',
      salesforceSteps: [
        'Classic: <strong>Setup → E-mailsjablonen</strong> · Lightning: <strong>E-mailsjablonen</strong>.',
        'HTML-sjabloon bewerken → footer invoegen.',
      ],
      sapTitle: 'SAP',
      sapSteps: [
        'Formulier / Output Management → HTML-footer van de factuur.',
        'Sjabloon <strong>Factuur</strong> als basis — SAP-placeholders behouden.',
      ],
      locales: {
        de: 'Duitsland', at: 'Oostenrijk', 'ch-de': 'Zwitserland (DE)', 'ch-fr': 'Zwitserland (FR)',
        'ch-it': 'Zwitserland (IT)', fr: 'Frankrijk', 'be-fr': 'België (FR)', 'be-nl': 'België (NL)',
        nl: 'Nederland', es: 'Spanje', it: 'Italië', ie: 'Ierland',
      },
    },
    en: {
      docTitle: 'Email templates – inuvet',
      pageTitle: 'Email templates',
      pageIntro: 'System emails for SAP, Shopify, Gmail & more — pick blocks, check preview, export HTML.',
      crosslinkSignature: 'Go to email signature',
      localeLabel: 'Country / language',
      sectionBrand: 'Brand',
      brandHint: 'In Italy, Inuvet is called Vetalità for legal reasons — logo, company and website adapt accordingly.',
      presetLabel: 'Template',
      presetRechnung: 'Invoice (e.g. SAP)',
      presetService: 'Service / confirmation (e.g. Gmail)',
      presetStatus: 'Status / request (e.g. Shopify)',
      presetFooter: 'Footer only (system text)',
      presetCustom: 'Blank / custom',
      hintDefault: 'Templates are starting points — content and blocks stay editable. Placeholders like <code>{{rechnungsnummer}}</code> are replaced by the target system.',
      hintFooter: 'Only the footer is generated — the main text comes from the target system. Insert HTML below the system text.',
      sectionContent: 'Content',
      subject: 'Subject (note)',
      subjectHint: 'The subject is not written into the HTML — only as a reminder for the target system.',
      headline: 'Headline (optional)',
      salutation: 'Salutation',
      body: 'Body text',
      bodyHint: 'Separate paragraphs with a blank line. A line starting with <code>• </code> or <code>- </code> becomes a bullet.',
      closing: 'Closing (optional)',
      ctaLabel: 'Button text (optional)',
      ctaUrl: 'Button link',
      sectionBlocks: 'Blocks',
      blockLogo: 'Logo on top',
      blockPerson: 'Contact person',
      blockContact: 'Contact note',
      blockCompany: 'Company & address',
      blockDisclaimer: '“Only at your veterinary practice”',
      blockSocial: 'Social media',
      blockImprint: 'Imprint',
      personName: 'Name',
      personRole: 'Role (optional)',
      personPhoto: 'Portrait URL',
      contactHint: 'Contact note',
      sectionPreview: 'Preview',
      copyBtn: 'Copy HTML',
      htmlBtn: 'Download HTML file',
      subjectPrefix: 'Subject: ',
      toastCopied: 'HTML copied!',
      toastCopyFail: 'Copy failed — please copy manually.',
      toastHtml: 'HTML file downloaded!',
      defaultPersonRole: 'Customer Service',
      sectionSetup: 'Setup',
      noticeTitle: 'Note',
      noticeBody: 'The subject is not exported — only the HTML content. Replace placeholders like <code>{{rechnungsnummer}}</code> in the target system.',
      generalTitle: 'General',
      generalSteps: [
        'Choose template and country, adjust content.',
        'Check preview → <strong>Copy HTML</strong> or <strong>Download HTML file</strong>.',
        'Paste into target system — footer template below system text.',
      ],
      gmailTitle: 'Gmail / Google Workspace',
      gmailSteps: [
        'Copy HTML and paste into signature or template settings.',
        'For transactional emails: use HTML mode in the composer.',
      ],
      shopifyTitle: 'Shopify',
      shopifySteps: [
        'Shopify Admin → <strong>Settings → Notifications</strong>.',
        'Open template → edit HTML → insert footer.',
      ],
      salesforceTitle: 'Salesforce',
      salesforceSteps: [
        'Classic: <strong>Setup → Email Templates</strong> · Lightning: <strong>Email Templates</strong>.',
        'Edit HTML template → insert footer.',
      ],
      sapTitle: 'SAP',
      sapSteps: [
        'Form / Output Management → HTML footer of the invoice.',
        'Use <strong>Invoice</strong> template as base — keep SAP placeholders.',
      ],
      locales: {
        de: 'Germany', at: 'Austria', 'ch-de': 'Switzerland (DE)', 'ch-fr': 'Switzerland (FR)',
        'ch-it': 'Switzerland (IT)', fr: 'France', 'be-fr': 'Belgium (FR)', 'be-nl': 'Belgium (NL)',
        nl: 'Netherlands', es: 'Spain', it: 'Italy', ie: 'Ireland',
      },
    },
  };

  function contactHintFor(lang, phone) {
    var map = {
      de: 'Fragen?\n\nWir helfen euch gerne weiter! Ihr erreicht uns per E-Mail oder telefonisch unter ' + phone + '.',
      fr: 'Des questions ?\n\nNous sommes à votre disposition ! Vous pouvez nous joindre par e-mail ou par téléphone au ' + phone + '.',
      it: 'Domande?\n\nSiamo lieti di aiutarvi! Potete contattarci via e-mail o telefonicamente al ' + phone + '.',
      es: '¿Preguntas?\n\n¡Estaremos encantados de ayudarte! Puedes contactarnos por correo electrónico o por teléfono en el ' + phone + '.',
      nl: 'Vragen?\n\nWe helpen je graag verder! Je bereikt ons per e-mail of telefonisch op ' + phone + '.',
      en: 'Questions?\n\nWe\'re happy to help! You can reach us by email or phone at ' + phone + '.',
    };
    return map[lang] || map.en;
  }

  var LOCALES = {
    de: {
      lang: 'de', company: 'Inuvet GmbH', phone: '+49 (0) 7621 57 91 510', fax: '+49 (0) 7621 57 91 512',
      name: 'Max Mustermann', email: 'max.mustermann@inuvet.com', street: 'Berner Weg 7–25', city: '79539 Lörrach',
      country: 'Deutschland', disclaimer: DISCLAIMER_DE, socialFacebook: true, socialFacebookUrl: FB_DE,
      socialInstagram: true, socialInstagramUrl: IG_DE,
    },
    at: {
      lang: 'de', company: 'Inuvet GmbH', phone: '+43 720 81 68 28', fax: '+43 720 23 07 95',
      name: 'Max Mustermann', email: 'max.mustermann@inuvet.com', street: 'Bürgergasse 11', city: 'AT-8330 Feldbach',
      country: 'Österreich', disclaimer: DISCLAIMER_DE, socialFacebook: true, socialFacebookUrl: FB_DE,
      socialInstagram: true, socialInstagramUrl: IG_DE,
    },
    'ch-de': {
      lang: 'de', company: 'Inuvet AG', phone: '+41 41 588 06 46', fax: '+41 41 588 06 22',
      name: 'Max Mustermann', email: 'max.mustermann@inuvet.com', street: 'Grabenstrasse 15a', city: 'CH-6340 Baar',
      country: 'Schweiz', disclaimer: DISCLAIMER_DE, socialFacebook: true, socialFacebookUrl: FB_DE,
      socialInstagram: true, socialInstagramUrl: IG_DE,
    },
    'ch-fr': {
      lang: 'fr', company: 'Inuvet AG', phone: '+41 41 588 06 46', fax: '+41 41 588 06 22',
      name: 'Jean Dupont', email: 'jean.dupont@inuvet.com', street: 'Grabenstrasse 15a', city: 'CH-6340 Baar',
      country: 'Suisse', disclaimer: DISCLAIMER_FR, socialFacebook: false, socialFacebookUrl: '',
      socialInstagram: true, socialInstagramUrl: IG_FR,
    },
    'ch-it': {
      lang: 'it', company: 'Planet Group IT S.r.l.', phone: '+39 051 042 1983', fax: '+39 051 042 1989',
      name: 'Mario Rossi', email: 'mario.rossi@inuvet.com', street: 'Via Ugo Bassi 7', city: '40121 Bologna',
      country: 'Italia', disclaimer: DISCLAIMER_IT, socialFacebook: false, socialFacebookUrl: '',
      socialInstagram: false, socialInstagramUrl: '',
    },
    fr: {
      lang: 'fr', company: 'Inuvet SARL', phone: '+33 9 77 55 47 61', fax: '+33 9 77 55 47 62',
      name: 'Jean Dupont', email: 'jean.dupont@inuvet.com', street: 'Quart.d.Entrep. 870 rue Denis Papin',
      city: 'FR-54710 Ludres', country: 'France', disclaimer: DISCLAIMER_FR, socialFacebook: false, socialFacebookUrl: '',
      socialInstagram: true, socialInstagramUrl: IG_FR,
    },
    'be-fr': {
      lang: 'fr', company: 'PLNT Group BE B.V.', phone: '+32 2 898 09 44', fax: '+32 2 898 09 45',
      name: 'Jean Dupont', email: 'jean.dupont@inuvet.com', street: 'Da Vincilaan 1', city: '1930 Zaventem',
      country: 'Belgique', disclaimer: DISCLAIMER_FR, socialFacebook: false, socialFacebookUrl: '',
      socialInstagram: true, socialInstagramUrl: IG_FR,
    },
    'be-nl': {
      lang: 'nl', company: 'PLNT Group BE B.V.', phone: '+32 2 898 09 44', fax: '+32 2 898 09 45',
      name: 'Max Mustermann', email: 'max.mustermann@inuvet.com', street: 'Da Vincilaan 1', city: '1930 Zaventem',
      country: 'België', disclaimer: DISCLAIMER_NL, socialFacebook: false, socialFacebookUrl: '',
      socialInstagram: true, socialInstagramUrl: IG_EN,
    },
    nl: {
      lang: 'nl', company: 'Planet Group NL B.V.', phone: '+31 (0) 4757 48 110', fax: '+31 (0) 4757 48 111',
      name: 'Max Mustermann', email: 'max.mustermann@inuvet.com', street: 'Markt 19', city: 'NL-6071 JD Swalmen',
      country: 'Nederland', disclaimer: DISCLAIMER_NL, socialFacebook: false, socialFacebookUrl: '',
      socialInstagram: true, socialInstagramUrl: IG_EN,
    },
    es: {
      lang: 'es', company: 'PLNT Group Ibérica, S.L.', phone: '+34 960 13 58 94', fax: '+34 960 13 58 95',
      name: 'Max Mustermann', email: 'max.mustermann@inuvet.com', street: 'Carrer de l\u2019Almirall Cadarso 26, 2-4',
      city: '46004 Valencia', country: 'España', disclaimer: DISCLAIMER_ES, socialFacebook: false, socialFacebookUrl: '',
      socialInstagram: true, socialInstagramUrl: IG_ES,
    },
    it: {
      lang: 'it', company: 'Planet Group IT S.r.l.', phone: '+39 051 042 1983', fax: '+39 051 042 1989',
      name: 'Mario Rossi', email: 'mario.rossi@inuvet.com', street: 'Via Ugo Bassi 7', city: '40121 Bologna',
      country: 'Italia', disclaimer: DISCLAIMER_IT, socialFacebook: false, socialFacebookUrl: '',
      socialInstagram: false, socialInstagramUrl: '',
    },
    ie: {
      lang: 'en', company: 'Inuvet Ltd.', phone: '+353 (1) 903 8013', fax: '+353 (1) 903 8019',
      name: 'Max Mustermann', email: 'max.mustermann@inuvet.com', street: 'Unit 9 Dargan Bldg., St John\u2019s Rd.',
      city: 'Dublin 8 D08 A4V6', country: 'Ireland', disclaimer: DISCLAIMER_EN, socialFacebook: false, socialFacebookUrl: '',
      socialInstagram: true, socialInstagramUrl: IG_EN,
    },
  };

  function getPresetContent(presetId, lang, phone, infoEmail) {
    if (presetId === 'footer' || presetId === 'custom') return null;

    var presets = {
      rechnung: {
        de: {
          subject: 'Ausgangsrechnung - {{rechnungsnummer}}; Kundennummer: {{kundennummer}}',
          headline: '', salutation: 'Liebes Praxisteam,',
          body: 'vielen Dank für die Bestellung! Im Anhang dieser E-Mail findet ihr die Rechnung.\n\n'
            + 'Bei Fragen – zu Patienten, Indikationen oder auch der Rechnung – erreicht ihr uns unter '
            + infoEmail + ' oder am Telefon: ' + phone + '.',
          closing: 'Wir wünschen euch geduldige und natürlich gesunde Patienten!',
          ctaLabel: '', ctaUrl: '',
        },
        fr: {
          subject: 'Facture - {{rechnungsnummer}} ; Numéro client : {{kundennummer}}',
          headline: '', salutation: 'Chère équipe,',
          body: 'merci pour votre commande ! Vous trouverez la facture en pièce jointe de cet e-mail.\n\n'
            + 'Pour toute question — patients, indications ou facture — contactez-nous à '
            + infoEmail + ' ou par téléphone au ' + phone + '.',
          closing: 'Nous vous souhaitons des patients patients et naturellement en bonne santé !',
          ctaLabel: '', ctaUrl: '',
        },
        it: {
          subject: 'Fattura - {{rechnungsnummer}} ; Numero cliente: {{kundennummer}}',
          headline: '', salutation: 'Gentile team,',
          body: 'grazie per il vostro ordine! In allegato a questa e-mail trovate la fattura.\n\n'
            + 'Per domande — su pazienti, indicazioni o la fattura — contattateci a '
            + infoEmail + ' o telefonicamente al ' + phone + '.',
          closing: 'Vi auguriamo pazienti pazienti e naturalmente sani!',
          ctaLabel: '', ctaUrl: '',
        },
        es: {
          subject: 'Factura - {{rechnungsnummer}} ; Número de cliente: {{kundennummer}}',
          headline: '', salutation: 'Estimado equipo,',
          body: '¡gracias por vuestro pedido! En el adjunto de este correo encontraréis la factura.\n\n'
            + 'Para preguntas — sobre pacientes, indicaciones o la factura — contactadnos en '
            + infoEmail + ' o por teléfono: ' + phone + '.',
          closing: '¡Os deseamos pacientes pacientes y naturalmente sanos!',
          ctaLabel: '', ctaUrl: '',
        },
        nl: {
          subject: 'Factuur - {{rechnungsnummer}} ; Klantnummer: {{kundennummer}}',
          headline: '', salutation: 'Beste team,',
          body: 'bedankt voor jullie bestelling! In de bijlage van deze e-mail vinden jullie de factuur.\n\n'
            + 'Voor vragen — over patiënten, indicaties of de factuur — bereik je ons via '
            + infoEmail + ' of telefonisch op ' + phone + '.',
          closing: 'We wensen jullie geduldige en van nature gezonde patiënten!',
          ctaLabel: '', ctaUrl: '',
        },
        en: {
          subject: 'Invoice - {{rechnungsnummer}} ; Customer number: {{kundennummer}}',
          headline: '', salutation: 'Dear team,',
          body: 'thank you for your order! You will find the invoice attached to this email.\n\n'
            + 'For questions — about patients, indications or the invoice — reach us at '
            + infoEmail + ' or by phone at ' + phone + '.',
          closing: 'We wish you patient and naturally healthy patients!',
          ctaLabel: '', ctaUrl: '',
        },
      },
      service: {
        de: {
          subject: 'Eure Reklamation ist angekommen',
          headline: '', salutation: 'Liebes Praxisteam,',
          body: 'eure Reklamation ist bei uns angekommen – danke, dass ihr euch die Zeit genommen habt, uns zu schreiben. '
            + 'Wir melden uns innerhalb von 1–2 Werktagen mit einer Rückmeldung bei euch.',
          closing: 'Tierische Grüße vom ganzen Inuvet-Team!',
          ctaLabel: '', ctaUrl: '',
        },
        fr: {
          subject: 'Votre réclamation est bien arrivée',
          headline: '', salutation: 'Chère équipe,',
          body: 'votre réclamation est bien parvenue — merci d\u2019avoir pris le temps de nous écrire. '
            + 'Nous vous répondrons sous 1 à 2 jours ouvrables.',
          closing: 'Meilleures salutations de toute l\u2019équipe Inuvet !',
          ctaLabel: '', ctaUrl: '',
        },
        it: {
          subject: 'Il vostro reclamo è arrivato',
          headline: '', salutation: 'Gentile team,',
          body: 'il vostro reclamo ci è pervenuto — grazie per averci scritto. '
            + 'Vi risponderemo entro 1–2 giorni lavorativi.',
          closing: 'Cordiali saluti da tutto il team Inuvet!',
          ctaLabel: '', ctaUrl: '',
        },
        es: {
          subject: 'Vuestra reclamación ha llegado',
          headline: '', salutation: 'Estimado equipo,',
          body: 'vuestra reclamación nos ha llegado — gracias por escribirnos. '
            + 'Os responderemos en 1–2 días laborables.',
          closing: '¡Saludos de todo el equipo Inuvet!',
          ctaLabel: '', ctaUrl: '',
        },
        nl: {
          subject: 'Jullie klacht is aangekomen',
          headline: '', salutation: 'Beste team,',
          body: 'jullie klacht is bij ons aangekomen — bedankt dat jullie de tijd hebben genomen om te schrijven. '
            + 'We reageren binnen 1–2 werkdagen.',
          closing: 'Vriendelijke groeten van het hele Inuvet-team!',
          ctaLabel: '', ctaUrl: '',
        },
        en: {
          subject: 'Your complaint has arrived',
          headline: '', salutation: 'Dear team,',
          body: 'your complaint has reached us — thank you for taking the time to write. '
            + 'We will get back to you within 1–2 business days.',
          closing: 'Best wishes from the whole Inuvet team!',
          ctaLabel: '', ctaUrl: '',
        },
      },
      status: {
        de: {
          subject: 'Deine Anfrage ist unterwegs',
          headline: 'Schon unterwegs!',
          salutation: 'Hey!',
          body: 'Danke für deine Anfrage für\n\n• {{produkt}}\n\n'
            + 'Wir leiten sie an eure Tierarztpraxis weiter. Die Praxis aktiviert die Empfehlung und meldet sich bei dir.',
          closing: 'Viele Grüße vom Inuvet Team!',
          ctaLabel: '', ctaUrl: '',
        },
        fr: {
          subject: 'Votre demande est en route',
          headline: 'Déjà en route !',
          salutation: 'Bonjour !',
          body: 'Merci pour votre demande pour\n\n• {{produkt}}\n\n'
            + 'Nous la transmettons à votre cabinet vétérinaire. Le cabinet active la recommandation et vous recontacte.',
          closing: 'Bien cordialement, l\u2019équipe Inuvet !',
          ctaLabel: '', ctaUrl: '',
        },
        it: {
          subject: 'La tua richiesta è in arrivo',
          headline: 'Già in viaggio!',
          salutation: 'Ciao!',
          body: 'Grazie per la tua richiesta per\n\n• {{produkt}}\n\n'
            + 'La inoltriamo al tuo ambulatorio veterinario. L\u2019ambulatorio attiva la raccomandazione e ti contatta.',
          closing: 'Cordiali saluti dal team Inuvet!',
          ctaLabel: '', ctaUrl: '',
        },
        es: {
          subject: 'Tu solicitud está en camino',
          headline: '¡Ya va de camino!',
          salutation: '¡Hola!',
          body: 'Gracias por tu solicitud de\n\n• {{produkt}}\n\n'
            + 'La enviamos a tu clínica veterinaria. La clínica activa la recomendación y se pondrá en contacto contigo.',
          closing: '¡Un saludo del equipo Inuvet!',
          ctaLabel: '', ctaUrl: '',
        },
        nl: {
          subject: 'Je aanvraag is onderweg',
          headline: 'Al onderweg!',
          salutation: 'Hoi!',
          body: 'Bedankt voor je aanvraag voor\n\n• {{produkt}}\n\n'
            + 'We sturen deze door naar je dierenartspraktijk. De praktijk activeert de aanbeveling en neemt contact met je op.',
          closing: 'Groeten van het Inuvet-team!',
          ctaLabel: '', ctaUrl: '',
        },
        en: {
          subject: 'Your request is on its way',
          headline: 'Already on its way!',
          salutation: 'Hi!',
          body: 'Thanks for your request for\n\n• {{produkt}}\n\n'
            + 'We forward it to your veterinary practice. The practice activates the recommendation and gets in touch with you.',
          closing: 'Best wishes from the Inuvet team!',
          ctaLabel: '', ctaUrl: '',
        },
      },
    };

    var group = presets[presetId];
    if (!group) return null;
    return group[lang] || group.en || null;
  }

  var CUSTOM_SALUTATION = {
    de: 'Liebes Praxisteam,',
    fr: 'Chère équipe,',
    it: 'Gentile team,',
    es: 'Estimado equipo,',
    nl: 'Beste team,',
    en: 'Dear team,',
  };

  var PRESET_BLOCKS = {
    rechnung: {
      footerOnly: false,
      blocks: { logo: true, person: false, contact: false, company: true, disclaimer: true, social: true, imprint: true },
    },
    service: {
      footerOnly: false,
      blocks: { logo: true, person: false, contact: false, company: true, disclaimer: true, social: true, imprint: true },
    },
    status: {
      footerOnly: false,
      blocks: { logo: true, person: false, contact: true, company: true, disclaimer: true, social: false, imprint: true },
    },
    footer: {
      footerOnly: true,
      blocks: { logo: true, person: false, contact: true, company: true, disclaimer: true, social: true, imprint: true },
    },
    custom: {
      footerOnly: false,
      blocks: { logo: true, person: false, contact: false, company: true, disclaimer: false, social: false, imprint: true },
    },
  };

  var currentLang = 'de';
  var footerOnly = false;
  var activeLocaleId = 'de';
  var localeSelect = document.getElementById('f-locale');
  var brandWrap = document.getElementById('brand-wrap');
  var brandInuvet = document.getElementById('f-brand-inuvet');
  var brandVetalita = document.getElementById('f-brand-vetalita');
  var instructionsEl = document.getElementById('em-instructions');

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
    personName: document.getElementById('f-person-name'),
    personRole: document.getElementById('f-person-role'),
    personPhoto: document.getElementById('f-person-photo'),
    blockLogo: document.getElementById('f-block-logo'),
    blockPerson: document.getElementById('f-block-person'),
    blockContact: document.getElementById('f-block-contact'),
    blockCompany: document.getElementById('f-block-company'),
    blockDisclaimer: document.getElementById('f-block-disclaimer'),
    blockSocial: document.getElementById('f-block-social'),
    blockImprint: document.getElementById('f-block-imprint'),
  };

  var contactWrap = document.getElementById('contact-wrap');
  var personWrap = document.getElementById('person-wrap');
  var contentWrap = document.getElementById('content-wrap');
  var presetHint = document.getElementById('em-preset-hint');
  var preview = document.getElementById('email-preview');
  var subjectPreview = document.getElementById('em-subject-preview');
  var copyTarget = document.getElementById('em-copy-target');
  var copyBtn = document.getElementById('copy-btn');
  var lastHtml = '';
  var updateTimer = null;

  function currentUi() {
    return UI[currentLang] || UI.de;
  }

  function getBrandId() {
    if (activeLocaleId === 'it' && brandVetalita && brandVetalita.checked) return 'vetalita';
    return 'inuvet';
  }

  function getBrand() {
    return BRANDS[getBrandId()] || BRANDS.inuvet;
  }

  function getInfoEmail() {
    return getBrandId() === 'vetalita' ? 'info@vetalita.it' : 'info@inuvet.com';
  }

  function getActiveLocaleData() {
    var locale = LOCALES[activeLocaleId] || LOCALES.de;
    var data = {
      lang: locale.lang,
      company: locale.company,
      phone: locale.phone,
      fax: locale.fax,
      name: locale.name,
      email: locale.email,
      street: locale.street,
      city: locale.city,
      country: locale.country,
      disclaimer: locale.disclaimer,
      socialFacebook: locale.socialFacebook,
      socialFacebookUrl: locale.socialFacebookUrl,
      socialInstagram: locale.socialInstagram,
      socialInstagramUrl: locale.socialInstagramUrl,
    };
    if (getBrandId() === 'vetalita') {
      var brand = BRANDS.vetalita;
      data.company = brand.company;
      data.name = brand.name;
      data.email = brand.email;
      data.disclaimer = brand.disclaimer;
      data.socialFacebook = false;
      data.socialFacebookUrl = '';
      data.socialInstagram = false;
      data.socialInstagramUrl = '';
    }
    return data;
  }

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
    var str = String(text);
    var tokens = [];
    var last = 0;
    var combined = new RegExp(emailRe.source + '|' + phoneRe.source, 'g');
    var match;
    while ((match = combined.exec(str)) !== null) {
      if (match.index > last) tokens.push({ type: 'text', value: str.slice(last, match.index) });
      tokens.push({ type: match[0].indexOf('@') >= 0 ? 'email' : 'phone', value: match[0] });
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

  function personRow(photo, name, role) {
    if (!name && !photo) return '';
    var rows = gapRow(18);
    if (photo) {
      rows += '<tr><td style="margin:0;padding:0;line-height:1;">'
        + '<img src="' + escapeAttr(photo) + '" alt="' + escapeHtml(name || '') + '" width="' + LOGO_WIDTH
        + '" height="' + LOGO_WIDTH + '" decoding="async" '
        + 'style="display:block;width:' + LOGO_WIDTH + 'px;height:' + LOGO_WIDTH
        + 'px;object-fit:cover;border:0;border-radius:50%;">'
        + '</td></tr>'
        + gapRow(10);
    }
    if (name) {
      rows += '<tr><td ' + cell() + '>'
        + '<span style="' + textStyle(FG, null, 'font-weight:bold;') + '">' + escapeHtml(name) + '</span>'
        + '</td></tr>';
    }
    if (role) {
      rows += '<tr><td ' + cell() + '>'
        + '<span style="' + textStyle(FG_MUTED) + '">' + escapeHtml(role) + '</span>'
        + '</td></tr>';
    }
    return rows;
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

  function socialRow(d) {
    var items = [];
    if (d.socialFacebook && d.socialFacebookUrl) {
      items.push({ url: d.socialFacebookUrl, icon: SOCIAL_META.facebook.icon, label: SOCIAL_META.facebook.label });
    }
    if (d.socialInstagram && d.socialInstagramUrl) {
      items.push({ url: d.socialInstagramUrl, icon: SOCIAL_META.instagram.icon, label: SOCIAL_META.instagram.label });
    }
    if (!items.length) return '';

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

  function buildDisclaimerRows(text) {
    var paragraphs = String(text).split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
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

  function readFields() {
    var localeData = getActiveLocaleData();
    return {
      footerOnly: footerOnly,
      subject: fields.subject.value.trim(),
      headline: footerOnly ? '' : fields.headline.value.trim(),
      salutation: footerOnly ? '' : fields.salutation.value.trim(),
      body: footerOnly ? '' : fields.body.value,
      closing: footerOnly ? '' : fields.closing.value.trim(),
      ctaLabel: footerOnly ? '' : fields.ctaLabel.value.trim(),
      ctaUrl: footerOnly ? '' : fields.ctaUrl.value.trim(),
      contact: fields.contact.value,
      personName: fields.personName.value.trim(),
      personRole: fields.personRole.value.trim(),
      personPhoto: fields.personPhoto.value.trim(),
      blockLogo: fields.blockLogo.checked,
      blockPerson: fields.blockPerson.checked,
      blockContact: fields.blockContact.checked,
      blockCompany: fields.blockCompany.checked,
      blockDisclaimer: fields.blockDisclaimer.checked,
      blockSocial: fields.blockSocial.checked,
      blockImprint: fields.blockImprint.checked,
      company: localeData.company,
      street: localeData.street,
      city: localeData.city,
      country: localeData.country,
      disclaimer: localeData.disclaimer,
      socialFacebook: fields.blockSocial.checked && localeData.socialFacebook,
      socialInstagram: fields.blockSocial.checked && localeData.socialInstagram,
      socialFacebookUrl: localeData.socialFacebookUrl,
      socialInstagramUrl: localeData.socialInstagramUrl,
    };
  }

  function buildEmail(d) {
    var brand = getBrand();
    var rows = '';
    var hasMain =
      !d.footerOnly && !!(d.headline || d.salutation || (d.body && d.body.trim())
        || d.closing || d.ctaLabel);

    if (d.blockLogo) {
      rows += logoRow(brand.logoUrl, brand.logoAlt, LOGO_WIDTH, brand.website);
    }

    if (!d.footerOnly) {
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
    }

    if (d.blockPerson && (d.personName || d.personPhoto)) {
      rows += personRow(d.personPhoto, d.personName, d.personRole);
    }

    if (d.blockContact && d.contact.trim()) {
      rows += gapRow(hasMain || d.blockLogo || d.blockPerson ? 22 : 0)
        + renderParagraphs(d.contact, { linkify: true, firstStrong: true });
    }

    var needsFooter = d.blockCompany || d.blockDisclaimer || d.blockSocial || d.blockImprint;
    if (needsFooter && hasMain) {
      rows += gapRow(22)
        + '<tr><td style="margin:0;padding:0;border-top:1px solid #e5e5e5;font-size:1px;line-height:1px;">&nbsp;</td></tr>'
        + gapRow(18);
    } else if (needsFooter && !hasMain && (d.blockPerson || (d.blockContact && d.contact.trim()))) {
      rows += gapRow(18);
    }

    if (d.blockCompany) {
      if (!d.blockLogo) {
        rows += logoRow(brand.logoUrl, brand.logoAlt, LOGO_WIDTH, brand.website);
      }
      if (d.company) {
        rows += '<tr><td ' + cell() + '>'
          + '<span style="' + textStyle(FG, null, 'font-weight:bold;') + '">' + escapeHtml(d.company) + '</span>'
          + '</td></tr>'
          + gapRow(6);
      }
      if (d.street) rows += '<tr><td ' + cell() + '>' + addressLine(d.street) + '</td></tr>';
      if (d.city) rows += '<tr><td ' + cell() + '>' + addressLine(d.city) + '</td></tr>';
      if (d.country) rows += '<tr><td ' + cell() + '>' + addressLine(d.country) + '</td></tr>';
      rows += '<tr><td ' + cell() + '>'
        + '<a href="' + escapeAttr(brand.website) + '" style="' + linkStyle() + '">'
        + '<span style="' + linkStyle() + '">' + escapeHtml(brand.websiteLabel) + '</span></a>'
        + '</td></tr>';
    }

    if (d.blockDisclaimer && d.disclaimer) {
      rows += gapRow(18);
      if (brand.showDisclaimerLogo) {
        rows += logoRow(DISCLAIMER_LOGO_URL, brand.logoAlt, LOGO_WIDTH, brand.website);
      }
      rows += buildDisclaimerRows(d.disclaimer);
    }

    if (d.blockSocial) {
      rows += socialRow(d);
    }

    if (d.blockImprint && brand.showImprint && brand.impressumUrl) {
      rows += gapRow(10)
        + '<tr><td ' + cell() + '>'
        + '<a href="' + escapeAttr(brand.impressumUrl) + '" style="' + linkStyle(SIG_FONT_SM) + '">'
        + '<span style="' + linkStyle(SIG_FONT_SM) + '">' + IMPRESSUM_LABEL + '</span></a>'
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
    var ui = currentUi();
    contentWrap.classList.toggle('--hidden', footerOnly);
    personWrap.classList.toggle('--hidden', !fields.blockPerson.checked);
    contactWrap.classList.toggle('--hidden', !fields.blockContact.checked);
    brandWrap.classList.toggle('--hidden', activeLocaleId !== 'it');
    if (presetHint) {
      presetHint.innerHTML = footerOnly ? ui.hintFooter : ui.hintDefault;
    }
  }

  function updateNow() {
    clearTimeout(updateTimer);
    var d = readFields();
    var ui = currentUi();
    var html = buildEmail(d);
    if (html !== lastHtml) {
      lastHtml = html;
      preview.innerHTML = html;
    }
    subjectPreview.textContent = (!footerOnly && d.subject) ? (ui.subjectPrefix + d.subject) : '';
  }

  function scheduleUpdate() {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(updateNow, 200);
  }

  function applyPresetBlocks(preset) {
    fields.blockLogo.checked = preset.blocks.logo;
    fields.blockPerson.checked = !!preset.blocks.person;
    fields.blockContact.checked = preset.blocks.contact;
    fields.blockCompany.checked = preset.blocks.company;
    fields.blockDisclaimer.checked = preset.blocks.disclaimer;
    fields.blockSocial.checked = preset.blocks.social;
    fields.blockImprint.checked = preset.blocks.imprint;
  }

  function applyPreset(id) {
    var preset = PRESET_BLOCKS[id] || PRESET_BLOCKS.custom;
    footerOnly = !!preset.footerOnly;
    var localeData = getActiveLocaleData();
    var infoEmail = getInfoEmail();
    var content = getPresetContent(id, currentLang, localeData.phone, infoEmail);

    if (content) {
      fields.subject.value = content.subject;
      fields.headline.value = content.headline;
      fields.salutation.value = content.salutation;
      fields.body.value = content.body;
      fields.closing.value = content.closing;
      fields.ctaLabel.value = content.ctaLabel;
      fields.ctaUrl.value = content.ctaUrl;
    } else {
      fields.subject.value = '';
      fields.headline.value = '';
      fields.body.value = '';
      fields.closing.value = '';
      fields.ctaLabel.value = '';
      fields.ctaUrl.value = '';
      fields.salutation.value = id === 'custom'
        ? (CUSTOM_SALUTATION[currentLang] || CUSTOM_SALUTATION.en)
        : '';
    }

    applyPresetBlocks(preset);
    if (!fields.personPhoto.value) {
      fields.personPhoto.value = DEFAULT_PERSON_PHOTO;
    }
    syncVisibility();
    updateNow();
  }

  function stepsHtml(steps) {
    return '<ol class="em-instr__steps">'
      + steps.map(function (step) { return '<li>' + step + '</li>'; }).join('')
      + '</ol>';
  }

  function renderInstructions(ui) {
    instructionsEl.innerHTML =
      '<h3 class="section-label --sub">' + escapeHtml(ui.sectionSetup) + '</h3>'
      + '<div class="notice">'
      + '<p class="notice__title"><span class="material-icons notice__icon" aria-hidden="true">info</span> '
      + escapeHtml(ui.noticeTitle) + '</p>'
      + '<p>' + ui.noticeBody + '</p>'
      + '</div>'
      + '<div class="em-instr">'
      + '<p class="em-instr__title">' + escapeHtml(ui.generalTitle) + '</p>'
      + stepsHtml(ui.generalSteps)
      + '</div>'
      + '<div class="em-instr">'
      + '<p class="em-instr__title">' + escapeHtml(ui.gmailTitle) + '</p>'
      + stepsHtml(ui.gmailSteps)
      + '</div>'
      + '<div class="em-instr">'
      + '<p class="em-instr__title">' + escapeHtml(ui.shopifyTitle) + '</p>'
      + stepsHtml(ui.shopifySteps)
      + '</div>'
      + '<div class="em-instr">'
      + '<p class="em-instr__title">' + escapeHtml(ui.salesforceTitle) + '</p>'
      + stepsHtml(ui.salesforceSteps)
      + '</div>'
      + '<div class="em-instr">'
      + '<p class="em-instr__title">' + escapeHtml(ui.sapTitle) + '</p>'
      + stepsHtml(ui.sapSteps)
      + '</div>';
  }

  function applyUi(lang) {
    currentLang = UI[lang] ? lang : 'de';
    var ui = currentUi();
    document.documentElement.lang = currentLang;
    document.title = ui.docTitle;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (ui[key] != null) el.textContent = ui[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (ui[key] != null) el.innerHTML = ui[key];
    });
    document.querySelectorAll('[data-i18n-option]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-option');
      if (ui[key] != null) el.textContent = ui[key];
    });

    Array.prototype.forEach.call(localeSelect.options, function (opt) {
      if (ui.locales[opt.value]) opt.textContent = ui.locales[opt.value];
    });

    renderInstructions(ui);
    syncVisibility();
  }

  function applyVetalitaOverrides() {
    var brand = BRANDS.vetalita;
    var locale = LOCALES.it;
    fields.personName.value = brand.name;
    fields.contact.value = contactHintFor('it', locale.phone);
  }

  function defaultPersonNameFor(localeId) {
    if (localeId === 'it' && getBrandId() === 'vetalita') return BRANDS.vetalita.name;
    var locale = LOCALES[localeId] || LOCALES.de;
    return locale.name;
  }

  function defaultPersonRoleFor(localeId) {
    var locale = LOCALES[localeId] || LOCALES.de;
    var ui = UI[locale.lang] || UI.de;
    return ui.defaultPersonRole;
  }

  function defaultContactFor(localeId) {
    var locale = LOCALES[localeId] || LOCALES.de;
    return contactHintFor(locale.lang, locale.phone);
  }

  function applyLocaleDefaults(localeId) {
    var locale = LOCALES[localeId] || LOCALES.de;
    fields.personName.value = defaultPersonNameFor(localeId);
    fields.personRole.value = defaultPersonRoleFor(localeId);
    fields.contact.value = defaultContactFor(localeId);
    if (localeId === 'it' && brandVetalita.checked) {
      applyVetalitaOverrides();
    }
  }

  /** Soft-update only fields that still match the previous locale defaults. */
  function refreshLocalePlaceholders(prevLocaleId, nextLocaleId) {
    if (fields.personName.value.trim() === defaultPersonNameFor(prevLocaleId)) {
      fields.personName.value = defaultPersonNameFor(nextLocaleId);
    }
    if (fields.personRole.value.trim() === defaultPersonRoleFor(prevLocaleId)) {
      fields.personRole.value = defaultPersonRoleFor(nextLocaleId);
    }
    if (fields.contact.value.trim() === defaultContactFor(prevLocaleId).trim()) {
      fields.contact.value = defaultContactFor(nextLocaleId);
    }
  }

  function applyLocale(id, options) {
    options = options || {};
    var reset = !!options.reset;
    var prevLocaleId = activeLocaleId;
    var nextLocaleId = LOCALES[id] ? id : 'de';

    activeLocaleId = nextLocaleId;
    localeSelect.value = activeLocaleId;
    var locale = LOCALES[activeLocaleId];

    if (activeLocaleId !== 'it') {
      brandInuvet.checked = true;
    }

    applyUi(locale.lang);

    if (reset) {
      applyLocaleDefaults(activeLocaleId);
      applyPreset(fields.preset.value || 'rechnung');
    } else if (prevLocaleId !== activeLocaleId) {
      // Keep Vorlage, Bausteine und editierte Inhalte; nur unveränderte Platzhalter anpassen
      refreshLocalePlaceholders(prevLocaleId, activeLocaleId);
    }

    syncVisibility();
    updateNow();
  }

  function applyBrand() {
    if (activeLocaleId !== 'it') return;

    if (brandVetalita.checked) {
      applyVetalitaOverrides();
    } else {
      var locale = LOCALES.it;
      var ui = UI[locale.lang] || UI.de;
      fields.personName.value = locale.name;
      fields.personRole.value = ui.defaultPersonRole;
      fields.contact.value = contactHintFor(locale.lang, locale.phone);
    }

    // Markenwechsel: Inhalte und Bausteine behalten — nur Logo/Firma/Disclaimer ändern sich
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

  function wrapHtmlDocument(body, title) {
    return '<!DOCTYPE html>\n<html lang="' + currentLang + '">\n<head>\n'
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
    var ui = currentUi();
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
      showToast(ui.toastCopied, 'success');
      setTimeout(function () {
        copyBtn.classList.remove('--copied');
      }, 2500);
    } catch (e) {
      showToast(ui.toastCopyFail, 'error');
    }
  }

  function downloadHtml() {
    var ui = currentUi();
    var brandId = getBrandId();
    var titleSuffix = brandId === 'vetalita' ? 'vetalità' : 'inuvet';
    var filename;
    if (footerOnly) {
      filename = brandId === 'vetalita' ? 'vetalita-email-footer.html' : 'inuvet-email-footer.html';
    } else {
      filename = brandId === 'vetalita' ? 'vetalita-email-vorlage.html' : 'inuvet-email-vorlage.html';
    }
    var doc = wrapHtmlDocument(prettyPrintHtml(getMarkup()), ui.pageTitle + ' – ' + titleSuffix);
    downloadFile(doc, filename);
    showToast(ui.toastHtml, 'success');
  }

  document.getElementById('em-form').addEventListener('input', function () {
    syncVisibility();
    scheduleUpdate();
  });
  localeSelect.addEventListener('change', function () {
    applyLocale(localeSelect.value);
  });
  brandInuvet.addEventListener('change', applyBrand);
  brandVetalita.addEventListener('change', applyBrand);
  fields.preset.addEventListener('change', function () {
    applyPreset(fields.preset.value);
  });
  fields.blockContact.addEventListener('change', function () {
    syncVisibility();
    updateNow();
  });
  fields.blockPerson.addEventListener('change', function () {
    syncVisibility();
    updateNow();
  });
  fields.personPhoto.addEventListener('paste', function () {
    setTimeout(scheduleUpdate, 0);
  });
  copyBtn.addEventListener('click', copy);
  document.getElementById('html-btn').addEventListener('click', downloadHtml);

  applyLocale(localeSelect.value || 'de', { reset: true });
})();

