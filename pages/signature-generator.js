(function () {
  'use strict';

  var LOGO_URL = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/19539d25-7649-448d-aee2-1059faf1a092.png';
  var LOGO_WIDTH = 80;
  var DISCLAIMER_LOGO_URL = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/3410cdab-9740-4fd8-8079-fe9d1bba3190.png';
  var VETALITA_LOGO_URL = 'https://image.email.inuvet.com/lib/fe2b11737364047b7c1477/m/1/32566504-fe1e-484d-b4b3-bcda8833cb80.png';
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
  /* Gmail „Normal“ = font-size:small — gleicher Schlüssel wie Fließtext (Desktop + App) */
  var SIG_FONT = 'small';
  var SIG_FONT_SM = '85%';
  var SIG_FONT_FACE = 'Arial,Helvetica,sans-serif';
  var HEADER_WIDTH = 240;

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
    + 'par l’intermédiaire des cabinets vétérinaires – vos clients ne les trouveront nulle part ailleurs.';

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
      docTitle: 'E-Mail-Signatur – inuvet',
      pageTitle: 'E-Mail-Signatur',
      pageIntro: 'Daten eingeben, Vorschau prüfen, kopieren — fertig.',
      localeLabel: 'Land / Sprache',
      sectionBrand: 'Marke',
      brandHint: 'In Italien heißt Inuvet aus rechtlichen Gründen Vetalità — Logo, Firma und Website passen sich an.',
      sectionTopImage: 'Bild oben (optional)',
      topNone: 'Keins',
      topHeader: 'Header-Bild',
      topPortrait: 'Portrait',
      headerUrl: 'Header-Bild-URL',
      headerHint: 'Grafik max. <strong>240 px</strong> breit anlegen — wichtig für die Darstellung in Gmail- und Outlook-Apps.',
      photoUrl: 'Portrait-URL',
      sectionPersonal: 'Deine Angaben',
      showInSignature: 'In Signatur anzeigen',
      name: 'Name',
      position: 'Position',
      email: 'E-Mail',
      phone: 'Festnetz / Durchwahl (optional)',
      mobile: 'Mobil (optional)',
      fax: 'Fax (optional)',
      quote: 'Persönliche Worte (optional)',
      sectionCompany: 'Unternehmen',
      company: 'Firma',
      street: 'Straße & Hausnummer',
      city: 'PLZ & Ort',
      country: 'Land',
      sectionSocial: 'Social Media (optional)',
      facebookUrl: 'Facebook-Link',
      instagramUrl: 'Instagram-Link',
      sectionOptional: 'Optionaler Text',
      text: 'Text',
      showContactHint: 'Kontakthinweis anzeigen',
      contactHint: 'Kontakthinweis',
      contactHintEmail: 'E-Mail (wird verlinkt)',
      contactHintPhone: 'Telefon (wird verlinkt)',
      sectionPreview: 'Vorschau',
      copyBtn: 'Signatur kopieren',
      htmlBtn: 'HTML-Code herunterladen',
      thunderbirdBtn: 'Für Thunderbird herunterladen',
      sectionSetup: 'Einrichtung',
      badgeRecommended: 'Empfohlen',
      gmailTitle: 'Gmail — Google Workspace',
      gmailLead: 'Mit Google Workspace stehen die <strong>KI-Funktionen von Gemini</strong> direkt im Posteingang zur Verfügung.',
      gmailSteps: [
        'Auf <strong>„Signatur kopieren"</strong> klicken.',
        '<a href="https://mail.google.com/mail/u/0/#settings/general" target="_blank" rel="noopener">Gmail</a> öffnen → Einstellungen → Tab <strong>„Allgemein"</strong> → Abschnitt <strong>„Signatur"</strong>.',
        '<strong>„Neu erstellen"</strong> → Namen vergeben → einfügen (<strong>Cmd+V / Strg+V</strong>).',
        'Unter <strong>„Standardwerte"</strong> die neue Signatur auswählen.',
        'Ganz unten auf <strong>„Änderungen speichern"</strong> klicken.',
      ],
      fontNoticeTitle: 'Schriftgröße',
      fontNoticeBody: 'Die Signatur nutzt <strong>font-size: small</strong> — denselben Wert wie Gmail für normalen Mail-Text. Auf Desktop erbt die Signatur sonst oft eine größere Standardgröße. Header-Grafiken breiter als 240 px können die Darstellung in Apps verkleinern.',
      outlookTitle: 'Outlook (Desktop)',
      outlookSteps: [
        'Auf <strong>„Signatur kopieren"</strong> klicken.',
        'Neue E-Mail → <strong>„Signatur" → „Signaturen…"</strong>.',
        '<strong>„Neu"</strong> → Namen vergeben → einfügen (<strong>Strg+V</strong>).',
        'Als <strong>Standardsignatur</strong> für neue und weitergeleitete Mails auswählen.',
        '<strong>„OK"</strong> klicken.',
      ],
      appleTitle: 'Apple Mail (macOS)',
      appleSteps: [
        'Auf <strong>„Signatur kopieren"</strong> klicken.',
        'Mail → <strong>„Einstellungen…"</strong> → Tab <strong>„Signaturen"</strong>.',
        'E-Mail-Konto → <strong>+</strong> → Signatur einfügen (<strong>Cmd+V</strong>).',
        '<strong>Wichtig:</strong> Haken bei <strong>„Immer meine Standardschrift verwenden"</strong> entfernen.',
      ],
      thunderbirdTitle: 'Thunderbird',
      thunderbirdSteps: [
        'Auf <strong>„Für Thunderbird herunterladen"</strong> klicken — es wird <strong>inuvet-signatur-thunderbird.html</strong> gespeichert.',
        'Datei an einen festen Ort ablegen (z. B. <strong>Dokumente/Inuvet-Signatur/</strong>).',
        'Thunderbird → <strong>„Konten-Einstellungen"</strong> → Haken bei <strong>„Eine Signatur-Datei anhängen"</strong>.',
        'Die gespeicherte HTML-Datei auswählen → <strong>„OK"</strong>.',
      ],
      toastCopied: 'Signatur kopiert!',
      toastCopyFail: 'Kopieren fehlgeschlagen — bitte manuell kopieren.',
      toastHtml: 'HTML-Code heruntergeladen!',
      phoneLabel: 'Tel',
      mobileLabel: 'Mobil',
      faxLabel: 'Fax',
      emailWord: 'E-Mail',
      defaultPosition: 'Marketing Manager',
      defaultQuote: 'Natürlich gesunde Tiere',
      locales: {
        de: 'Deutschland',
        at: 'Österreich',
        'ch-de': 'Schweiz (DE)',
        'ch-fr': 'Schweiz (FR)',
        'ch-it': 'Schweiz (IT)',
        fr: 'Frankreich',
        'be-fr': 'Belgien (FR)',
        'be-nl': 'Belgien (NL)',
        nl: 'Niederlande',
        es: 'Spanien',
        it: 'Italien',
        ie: 'Irland',
      },
    },
    fr: {
      docTitle: 'Signature e-mail – inuvet',
      pageTitle: 'Signature e-mail',
      pageIntro: 'Saisir les données, vérifier l’aperçu, copier — terminé.',
      localeLabel: 'Pays / langue',
      sectionBrand: 'Marque',
      brandHint: 'En Italie, Inuvet s’appelle Vetalità pour des raisons juridiques — le logo, la société et le site s’adaptent.',
      sectionTopImage: 'Image en haut (optionnel)',
      topNone: 'Aucune',
      topHeader: 'Image d’en-tête',
      topPortrait: 'Portrait',
      headerUrl: 'URL de l’image d’en-tête',
      headerHint: 'Créer le graphique avec max. <strong>240 px</strong> de largeur — important pour Gmail et Outlook (apps).',
      photoUrl: 'URL du portrait',
      sectionPersonal: 'Vos coordonnées',
      showInSignature: 'Afficher dans la signature',
      name: 'Nom',
      position: 'Fonction',
      email: 'E-mail',
      phone: 'Ligne fixe / poste (optionnel)',
      mobile: 'Mobile (optionnel)',
      fax: 'Fax (optionnel)',
      quote: 'Mot personnel (optionnel)',
      sectionCompany: 'Entreprise',
      company: 'Société',
      street: 'Rue et numéro',
      city: 'Code postal et ville',
      country: 'Pays',
      sectionSocial: 'Réseaux sociaux (optionnel)',
      facebookUrl: 'Lien Facebook',
      instagramUrl: 'Lien Instagram',
      sectionOptional: 'Texte optionnel',
      text: 'Texte',
      showContactHint: 'Afficher l’indication de contact',
      contactHint: 'Indication de contact',
      contactHintEmail: 'E-mail (sera lié)',
      contactHintPhone: 'Téléphone (sera lié)',
      sectionPreview: 'Aperçu',
      copyBtn: 'Copier la signature',
      htmlBtn: 'Télécharger le code HTML',
      thunderbirdBtn: 'Télécharger pour Thunderbird',
      sectionSetup: 'Installation',
      badgeRecommended: 'Recommandé',
      gmailTitle: 'Gmail — Google Workspace',
      gmailLead: 'Avec Google Workspace, les <strong>fonctions IA de Gemini</strong> sont disponibles directement dans la boîte de réception.',
      gmailSteps: [
        'Cliquer sur <strong>« Copier la signature »</strong>.',
        'Ouvrir <a href="https://mail.google.com/mail/u/0/#settings/general" target="_blank" rel="noopener">Gmail</a> → Paramètres → onglet <strong>« Général »</strong> → section <strong>« Signature »</strong>.',
        '<strong>« Créer »</strong> → nommer → coller (<strong>Cmd+V / Ctrl+V</strong>).',
        'Sous <strong>« Valeurs par défaut »</strong>, sélectionner la nouvelle signature.',
        'En bas, cliquer sur <strong>« Enregistrer les modifications »</strong>.',
      ],
      fontNoticeTitle: 'Taille de police',
      fontNoticeBody: 'La signature utilise <strong>font-size: small</strong> — la même valeur que Gmail pour le texte normal. Sur desktop, la signature hérite sinon souvent d’une taille plus grande. Des graphiques d’en-tête plus larges que 240 px peuvent réduire l’affichage dans les apps.',
      outlookTitle: 'Outlook (Desktop)',
      outlookSteps: [
        'Cliquer sur <strong>« Copier la signature »</strong>.',
        'Nouveau message → <strong>« Signature » → « Signatures… »</strong>.',
        '<strong>« Nouveau »</strong> → nommer → coller (<strong>Ctrl+V</strong>).',
        'Définir comme <strong>signature par défaut</strong> pour les nouveaux messages et les réponses.',
        'Cliquer sur <strong>« OK »</strong>.',
      ],
      appleTitle: 'Apple Mail (macOS)',
      appleSteps: [
        'Cliquer sur <strong>« Copier la signature »</strong>.',
        'Mail → <strong>« Réglages… »</strong> → onglet <strong>« Signatures »</strong>.',
        'Compte e-mail → <strong>+</strong> → coller la signature (<strong>Cmd+V</strong>).',
        '<strong>Important :</strong> décocher <strong>« Toujours utiliser ma police par défaut »</strong>.',
      ],
      thunderbirdTitle: 'Thunderbird',
      thunderbirdSteps: [
        'Cliquer sur <strong>« Télécharger pour Thunderbird »</strong> — le fichier <strong>inuvet-signatur-thunderbird.html</strong> est enregistré.',
        'Enregistrer le fichier à un emplacement fixe (p. ex. <strong>Documents/Inuvet-Signatur/</strong>).',
        'Thunderbird → <strong>« Paramètres des comptes »</strong> → cocher <strong>« Joindre la signature à partir d’un fichier »</strong>.',
        'Sélectionner le fichier HTML → <strong>« OK »</strong>.',
      ],
      toastCopied: 'Signature copiée !',
      toastCopyFail: 'Échec de la copie — veuillez copier manuellement.',
      toastHtml: 'Code HTML téléchargé !',
      phoneLabel: 'Tél',
      mobileLabel: 'Mobile',
      faxLabel: 'Fax',
      emailWord: 'e-mail',
      defaultPosition: 'Responsable Marketing',
      defaultQuote: 'Des animaux naturellement en bonne santé',
      locales: {
        de: 'Allemagne',
        at: 'Autriche',
        'ch-de': 'Suisse (DE)',
        'ch-fr': 'Suisse (FR)',
        'ch-it': 'Suisse (IT)',
        fr: 'France',
        'be-fr': 'Belgique (FR)',
        'be-nl': 'Belgique (NL)',
        nl: 'Pays-Bas',
        es: 'Espagne',
        it: 'Italie',
        ie: 'Irlande',
      },
    },
    it: {
      docTitle: 'Firma e-mail – inuvet',
      pageTitle: 'Firma e-mail',
      pageIntro: 'Inserisci i dati, controlla l’anteprima, copia — fatto.',
      localeLabel: 'Paese / lingua',
      sectionBrand: 'Marca',
      brandHint: 'In Italia Inuvet si chiama Vetalità per motivi legali — logo, società e sito si adattano di conseguenza.',
      sectionTopImage: 'Immagine in alto (opzionale)',
      topNone: 'Nessuna',
      topHeader: 'Immagine header',
      topPortrait: 'Ritratto',
      headerUrl: 'URL immagine header',
      headerHint: 'Creare la grafica con max. <strong>240 px</strong> di larghezza — importante per Gmail e Outlook (app).',
      photoUrl: 'URL ritratto',
      sectionPersonal: 'I tuoi dati',
      showInSignature: 'Mostra nella firma',
      name: 'Nome',
      position: 'Posizione',
      email: 'E-mail',
      phone: 'Fisso / interno (opzionale)',
      mobile: 'Cellulare (opzionale)',
      fax: 'Fax (opzionale)',
      quote: 'Parole personali (opzionale)',
      sectionCompany: 'Azienda',
      company: 'Società',
      street: 'Via e numero',
      city: 'CAP e città',
      country: 'Paese',
      sectionSocial: 'Social media (opzionale)',
      facebookUrl: 'Link Facebook',
      instagramUrl: 'Link Instagram',
      sectionOptional: 'Testo opzionale',
      text: 'Testo',
      showContactHint: 'Mostra nota di contatto',
      contactHint: 'Nota di contatto',
      contactHintEmail: 'E-mail (collegata)',
      contactHintPhone: 'Telefono (collegato)',
      sectionPreview: 'Anteprima',
      copyBtn: 'Copia firma',
      htmlBtn: 'Scarica codice HTML',
      thunderbirdBtn: 'Scarica per Thunderbird',
      sectionSetup: 'Configurazione',
      badgeRecommended: 'Consigliato',
      gmailTitle: 'Gmail — Google Workspace',
      gmailLead: 'Con Google Workspace le <strong>funzioni IA di Gemini</strong> sono disponibili direttamente nella casella di posta.',
      gmailSteps: [
        'Fare clic su <strong>« Copia firma »</strong>.',
        'Aprire <a href="https://mail.google.com/mail/u/0/#settings/general" target="_blank" rel="noopener">Gmail</a> → Impostazioni → scheda <strong>« Generali »</strong> → sezione <strong>« Firma »</strong>.',
        '<strong>« Crea nuova »</strong> → assegnare un nome → incollare (<strong>Cmd+V / Ctrl+V</strong>).',
        'In <strong>« Valori predefiniti »</strong> selezionare la nuova firma.',
        'In basso fare clic su <strong>« Salva modifiche »</strong>.',
      ],
      fontNoticeTitle: 'Dimensione carattere',
      fontNoticeBody: 'La firma usa <strong>font-size: small</strong> — lo stesso valore di Gmail per il testo normale. Sul desktop la firma eredita altrimenti spesso una dimensione maggiore. Grafici header più larghi di 240 px possono ridurre la visualizzazione nelle app.',
      outlookTitle: 'Outlook (Desktop)',
      outlookSteps: [
        'Fare clic su <strong>« Copia firma »</strong>.',
        'Nuova e-mail → <strong>« Firma » → « Firme… »</strong>.',
        '<strong>« Nuovo »</strong> → assegnare un nome → incollare (<strong>Ctrl+V</strong>).',
        'Impostare come <strong>firma predefinita</strong> per messaggi nuovi e inoltrati.',
        'Fare clic su <strong>« OK »</strong>.',
      ],
      appleTitle: 'Apple Mail (macOS)',
      appleSteps: [
        'Fare clic su <strong>« Copia firma »</strong>.',
        'Mail → <strong>« Impostazioni… »</strong> → scheda <strong>« Firme »</strong>.',
        'Account e-mail → <strong>+</strong> → incollare la firma (<strong>Cmd+V</strong>).',
        '<strong>Importante:</strong> deselezionare <strong>« Usa sempre il mio carattere predefinito »</strong>.',
      ],
      thunderbirdTitle: 'Thunderbird',
      thunderbirdSteps: [
        'Fare clic su <strong>« Scarica per Thunderbird »</strong> — viene salvato <strong>inuvet-signatur-thunderbird.html</strong>.',
        'Salvare il file in una posizione fissa (es. <strong>Documenti/Inuvet-Signatur/</strong>).',
        'Thunderbird → <strong>« Impostazioni account »</strong> → spuntare <strong>« Allega la firma da un file »</strong>.',
        'Selezionare il file HTML → <strong>« OK »</strong>.',
      ],
      toastCopied: 'Firma copiata!',
      toastCopyFail: 'Copia non riuscita — copiare manualmente.',
      toastHtml: 'Codice HTML scaricato!',
      phoneLabel: 'Tel',
      mobileLabel: 'Cell',
      faxLabel: 'Fax',
      emailWord: 'e-mail',
      defaultPosition: 'Marketing Manager',
      defaultQuote: 'Animali naturalmente sani',
      locales: {
        de: 'Germania',
        at: 'Austria',
        'ch-de': 'Svizzera (DE)',
        'ch-fr': 'Svizzera (FR)',
        'ch-it': 'Svizzera (IT)',
        fr: 'Francia',
        'be-fr': 'Belgio (FR)',
        'be-nl': 'Belgio (NL)',
        nl: 'Paesi Bassi',
        es: 'Spagna',
        it: 'Italia',
        ie: 'Irlanda',
      },
    },
    es: {
      docTitle: 'Firma de correo – inuvet',
      pageTitle: 'Firma de correo',
      pageIntro: 'Introduce los datos, revisa la vista previa, copia — listo.',
      localeLabel: 'País / idioma',
      sectionBrand: 'Marca',
      brandHint: 'En Italia, Inuvet se llama Vetalità por motivos legales: el logo, la empresa y el sitio web se adaptan.',
      sectionTopImage: 'Imagen superior (opcional)',
      topNone: 'Ninguna',
      topHeader: 'Imagen de cabecera',
      topPortrait: 'Retrato',
      headerUrl: 'URL de la imagen de cabecera',
      headerHint: 'Crear el gráfico con máx. <strong>240 px</strong> de ancho — importante para Gmail y Outlook (apps).',
      photoUrl: 'URL del retrato',
      sectionPersonal: 'Tus datos',
      showInSignature: 'Mostrar en la firma',
      name: 'Nombre',
      position: 'Cargo',
      email: 'Correo electrónico',
      phone: 'Fijo / extensión (opcional)',
      mobile: 'Móvil (opcional)',
      fax: 'Fax (opcional)',
      quote: 'Palabras personales (opcional)',
      sectionCompany: 'Empresa',
      company: 'Empresa',
      street: 'Calle y número',
      city: 'CP y ciudad',
      country: 'País',
      sectionSocial: 'Redes sociales (opcional)',
      facebookUrl: 'Enlace de Facebook',
      instagramUrl: 'Enlace de Instagram',
      sectionOptional: 'Texto opcional',
      text: 'Texto',
      showContactHint: 'Mostrar nota de contacto',
      contactHint: 'Nota de contacto',
      contactHintEmail: 'Correo (se enlazará)',
      contactHintPhone: 'Teléfono (se enlazará)',
      sectionPreview: 'Vista previa',
      copyBtn: 'Copiar firma',
      htmlBtn: 'Descargar código HTML',
      thunderbirdBtn: 'Descargar para Thunderbird',
      sectionSetup: 'Configuración',
      badgeRecommended: 'Recomendado',
      gmailTitle: 'Gmail — Google Workspace',
      gmailLead: 'Con Google Workspace, las <strong>funciones de IA de Gemini</strong> están disponibles directamente en la bandeja de entrada.',
      gmailSteps: [
        'Haz clic en <strong>« Copiar firma »</strong>.',
        'Abre <a href="https://mail.google.com/mail/u/0/#settings/general" target="_blank" rel="noopener">Gmail</a> → Configuración → pestaña <strong>« General »</strong> → sección <strong>« Firma »</strong>.',
        '<strong>« Crear nueva »</strong> → asignar nombre → pegar (<strong>Cmd+V / Ctrl+V</strong>).',
        'En <strong>« Valores predeterminados »</strong> selecciona la nueva firma.',
        'Abajo haz clic en <strong>« Guardar cambios »</strong>.',
      ],
      fontNoticeTitle: 'Tamaño de fuente',
      fontNoticeBody: 'La firma usa <strong>font-size: small</strong> — el mismo valor que Gmail para el texto normal. En escritorio, la firma suele heredar un tamaño mayor. Gráficos de cabecera de más de 240 px pueden reducir la visualización en las apps.',
      outlookTitle: 'Outlook (Desktop)',
      outlookSteps: [
        'Haz clic en <strong>« Copiar firma »</strong>.',
        'Nuevo correo → <strong>« Firma » → « Firmas… »</strong>.',
        '<strong>« Nuevo »</strong> → asignar nombre → pegar (<strong>Ctrl+V</strong>).',
        'Definir como <strong>firma predeterminada</strong> para mensajes nuevos y reenviados.',
        'Haz clic en <strong>« Aceptar »</strong>.',
      ],
      appleTitle: 'Apple Mail (macOS)',
      appleSteps: [
        'Haz clic en <strong>« Copiar firma »</strong>.',
        'Mail → <strong>« Ajustes… »</strong> → pestaña <strong>« Firmas »</strong>.',
        'Cuenta de correo → <strong>+</strong> → pegar la firma (<strong>Cmd+V</strong>).',
        '<strong>Importante:</strong> desmarcar <strong>« Usar siempre mi fuente predeterminada »</strong>.',
      ],
      thunderbirdTitle: 'Thunderbird',
      thunderbirdSteps: [
        'Haz clic en <strong>« Descargar para Thunderbird »</strong> — se guarda <strong>inuvet-signatur-thunderbird.html</strong>.',
        'Guarda el archivo en una ubicación fija (p. ej. <strong>Documentos/Inuvet-Signatur/</strong>).',
        'Thunderbird → <strong>« Configuración de cuentas »</strong> → marcar <strong>« Adjuntar la firma desde un archivo »</strong>.',
        'Seleccionar el archivo HTML → <strong>« Aceptar »</strong>.',
      ],
      toastCopied: '¡Firma copiada!',
      toastCopyFail: 'Error al copiar — cópiala manualmente.',
      toastHtml: '¡Código HTML descargado!',
      phoneLabel: 'Tel',
      mobileLabel: 'Móvil',
      faxLabel: 'Fax',
      emailWord: 'correo electrónico',
      defaultPosition: 'Responsable de Marketing',
      defaultQuote: 'Animales naturalmente sanos',
      locales: {
        de: 'Alemania',
        at: 'Austria',
        'ch-de': 'Suiza (DE)',
        'ch-fr': 'Suiza (FR)',
        'ch-it': 'Suiza (IT)',
        fr: 'Francia',
        'be-fr': 'Bélgica (FR)',
        'be-nl': 'Bélgica (NL)',
        nl: 'Países Bajos',
        es: 'España',
        it: 'Italia',
        ie: 'Irlanda',
      },
    },
    nl: {
      docTitle: 'E-mailhandtekening – inuvet',
      pageTitle: 'E-mailhandtekening',
      pageIntro: 'Gegevens invoeren, voorbeeld controleren, kopiëren — klaar.',
      localeLabel: 'Land / taal',
      sectionBrand: 'Merk',
      brandHint: 'In Italië heet Inuvet om juridische redenen Vetalità — logo, bedrijf en website passen zich aan.',
      sectionTopImage: 'Afbeelding bovenaan (optioneel)',
      topNone: 'Geen',
      topHeader: 'Headerafbeelding',
      topPortrait: 'Portret',
      headerUrl: 'URL headerafbeelding',
      headerHint: 'Grafiek max. <strong>240 px</strong> breed aanleveren — belangrijk voor weergave in Gmail- en Outlook-apps.',
      photoUrl: 'URL portret',
      sectionPersonal: 'Jouw gegevens',
      showInSignature: 'Tonen in handtekening',
      name: 'Naam',
      position: 'Functie',
      email: 'E-mail',
      phone: 'Vast / toestel (optioneel)',
      mobile: 'Mobiel (optioneel)',
      fax: 'Fax (optioneel)',
      quote: 'Persoonlijke woorden (optioneel)',
      sectionCompany: 'Bedrijf',
      company: 'Bedrijf',
      street: 'Straat & huisnummer',
      city: 'Postcode & plaats',
      country: 'Land',
      sectionSocial: 'Social media (optioneel)',
      facebookUrl: 'Facebook-link',
      instagramUrl: 'Instagram-link',
      sectionOptional: 'Optionele tekst',
      text: 'Tekst',
      showContactHint: 'Contacthint tonen',
      contactHint: 'Contacthint',
      contactHintEmail: 'E-mail (wordt gelinkt)',
      contactHintPhone: 'Telefoon (wordt gelinkt)',
      sectionPreview: 'Voorbeeld',
      copyBtn: 'Handtekening kopiëren',
      htmlBtn: 'HTML-code downloaden',
      thunderbirdBtn: 'Downloaden voor Thunderbird',
      sectionSetup: 'Installatie',
      badgeRecommended: 'Aanbevolen',
      gmailTitle: 'Gmail — Google Workspace',
      gmailLead: 'Met Google Workspace staan de <strong>AI-functies van Gemini</strong> direct in je inbox klaar.',
      gmailSteps: [
        'Klik op <strong>„Handtekening kopiëren"</strong>.',
        'Open <a href="https://mail.google.com/mail/u/0/#settings/general" target="_blank" rel="noopener">Gmail</a> → Instellingen → tabblad <strong>„Algemeen"</strong> → sectie <strong>„Handtekening"</strong>.',
        '<strong>„Nieuw maken"</strong> → naam geven → plakken (<strong>Cmd+V / Ctrl+V</strong>).',
        'Onder <strong>„Standaardwaarden"</strong> de nieuwe handtekening selecteren.',
        'Onderaan op <strong>„Wijzigingen opslaan"</strong> klikken.',
      ],
      fontNoticeTitle: 'Lettergrootte',
      fontNoticeBody: 'De handtekening gebruikt <strong>font-size: small</strong> — dezelfde waarde als Gmail voor normale mailtekst. Op desktop erft de handtekening anders vaak een grotere standaardgrootte. Headerafbeeldingen breder dan 240 px kunnen de weergave in apps verkleinen.',
      outlookTitle: 'Outlook (Desktop)',
      outlookSteps: [
        'Klik op <strong>„Handtekening kopiëren"</strong>.',
        'Nieuwe e-mail → <strong>„Handtekening" → „Handtekeningen…”</strong>.',
        '<strong>„Nieuw"</strong> → naam geven → plakken (<strong>Ctrl+V</strong>).',
        'Als <strong>standaardhandtekening</strong> instellen voor nieuwe en doorgestuurde mails.',
        'Klik op <strong>„OK"</strong>.',
      ],
      appleTitle: 'Apple Mail (macOS)',
      appleSteps: [
        'Klik op <strong>„Handtekening kopiëren"</strong>.',
        'Mail → <strong>„Instellingen…”</strong> → tabblad <strong>„Handtekeningen"</strong>.',
        'E-mailaccount → <strong>+</strong> → handtekening plakken (<strong>Cmd+V</strong>).',
        '<strong>Belangrijk:</strong> vinkje bij <strong>„Altijd mijn standaardlettertype gebruiken"</strong> uitzetten.',
      ],
      thunderbirdTitle: 'Thunderbird',
      thunderbirdSteps: [
        'Klik op <strong>„Downloaden voor Thunderbird"</strong> — er wordt <strong>inuvet-signatur-thunderbird.html</strong> opgeslagen.',
        'Bestand op een vaste plek bewaren (bijv. <strong>Documenten/Inuvet-Signatur/</strong>).',
        'Thunderbird → <strong>„Accountinstellingen"</strong> → vink <strong>„Een handtekeningbestand bijvoegen"</strong> aan.',
        'Het opgeslagen HTML-bestand selecteren → <strong>„OK"</strong>.',
      ],
      toastCopied: 'Handtekening gekopieerd!',
      toastCopyFail: 'Kopiëren mislukt — handmatig kopiëren.',
      toastHtml: 'HTML-code gedownload!',
      phoneLabel: 'Tel',
      mobileLabel: 'Mobiel',
      faxLabel: 'Fax',
      emailWord: 'e-mail',
      defaultPosition: 'Marketingmanager',
      defaultQuote: 'Natuurlijk gezonde dieren',
      locales: {
        de: 'Duitsland',
        at: 'Oostenrijk',
        'ch-de': 'Zwitserland (DE)',
        'ch-fr': 'Zwitserland (FR)',
        'ch-it': 'Zwitserland (IT)',
        fr: 'Frankrijk',
        'be-fr': 'België (FR)',
        'be-nl': 'België (NL)',
        nl: 'Nederland',
        es: 'Spanje',
        it: 'Italië',
        ie: 'Ierland',
      },
    },
    en: {
      docTitle: 'Email signature – inuvet',
      pageTitle: 'Email signature',
      pageIntro: 'Enter your details, check the preview, copy — done.',
      localeLabel: 'Country / language',
      sectionBrand: 'Brand',
      brandHint: 'In Italy, Inuvet is called Vetalità for legal reasons — logo, company and website adapt accordingly.',
      sectionTopImage: 'Top image (optional)',
      topNone: 'None',
      topHeader: 'Header image',
      topPortrait: 'Portrait',
      headerUrl: 'Header image URL',
      headerHint: 'Create the graphic at max. <strong>240 px</strong> wide — important for Gmail and Outlook apps.',
      photoUrl: 'Portrait URL',
      sectionPersonal: 'Your details',
      showInSignature: 'Show in signature',
      name: 'Name',
      position: 'Position',
      email: 'Email',
      phone: 'Landline / extension (optional)',
      mobile: 'Mobile (optional)',
      fax: 'Fax (optional)',
      quote: 'Personal note (optional)',
      sectionCompany: 'Company',
      company: 'Company',
      street: 'Street & number',
      city: 'Postcode & city',
      country: 'Country',
      sectionSocial: 'Social media (optional)',
      facebookUrl: 'Facebook link',
      instagramUrl: 'Instagram link',
      sectionOptional: 'Optional text',
      text: 'Text',
      showContactHint: 'Show contact note',
      contactHint: 'Contact note',
      contactHintEmail: 'Email (will be linked)',
      contactHintPhone: 'Phone (will be linked)',
      sectionPreview: 'Preview',
      copyBtn: 'Copy signature',
      htmlBtn: 'Download HTML code',
      thunderbirdBtn: 'Download for Thunderbird',
      sectionSetup: 'Setup',
      badgeRecommended: 'Recommended',
      gmailTitle: 'Gmail — Google Workspace',
      gmailLead: 'With Google Workspace, <strong>Gemini AI features</strong> are available right in your inbox.',
      gmailSteps: [
        'Click <strong>“Copy signature”</strong>.',
        'Open <a href="https://mail.google.com/mail/u/0/#settings/general" target="_blank" rel="noopener">Gmail</a> → Settings → <strong>“General”</strong> tab → <strong>“Signature”</strong> section.',
        '<strong>“Create new”</strong> → name it → paste (<strong>Cmd+V / Ctrl+V</strong>).',
        'Under <strong>“Defaults”</strong>, select the new signature.',
        'At the bottom, click <strong>“Save Changes”</strong>.',
      ],
      fontNoticeTitle: 'Font size',
      fontNoticeBody: 'The signature uses <strong>font-size: small</strong> — the same value Gmail uses for normal message text. On desktop the signature otherwise often inherits a larger default size. Header graphics wider than 240 px can shrink the display in apps.',
      outlookTitle: 'Outlook (Desktop)',
      outlookSteps: [
        'Click <strong>“Copy signature”</strong>.',
        'New email → <strong>“Signature” → “Signatures…”</strong>.',
        '<strong>“New”</strong> → name it → paste (<strong>Ctrl+V</strong>).',
        'Set as <strong>default signature</strong> for new and forwarded messages.',
        'Click <strong>“OK”</strong>.',
      ],
      appleTitle: 'Apple Mail (macOS)',
      appleSteps: [
        'Click <strong>“Copy signature”</strong>.',
        'Mail → <strong>“Settings…”</strong> → <strong>“Signatures”</strong> tab.',
        'Email account → <strong>+</strong> → paste signature (<strong>Cmd+V</strong>).',
        '<strong>Important:</strong> uncheck <strong>“Always match my default message font”</strong>.',
      ],
      thunderbirdTitle: 'Thunderbird',
      thunderbirdSteps: [
        'Click <strong>“Download for Thunderbird”</strong> — <strong>inuvet-signatur-thunderbird.html</strong> is saved.',
        'Store the file in a fixed location (e.g. <strong>Documents/Inuvet-Signatur/</strong>).',
        'Thunderbird → <strong>“Account Settings”</strong> → check <strong>“Attach the signature from a file”</strong>.',
        'Select the saved HTML file → <strong>“OK”</strong>.',
      ],
      toastCopied: 'Signature copied!',
      toastCopyFail: 'Copy failed — please copy manually.',
      toastHtml: 'HTML code downloaded!',
      phoneLabel: 'Tel',
      mobileLabel: 'Mobile',
      faxLabel: 'Fax',
      emailWord: 'email',
      defaultPosition: 'Marketing Manager',
      defaultQuote: 'Naturally healthy animals',
      locales: {
        de: 'Germany',
        at: 'Austria',
        'ch-de': 'Switzerland (DE)',
        'ch-fr': 'Switzerland (FR)',
        'ch-it': 'Switzerland (IT)',
        fr: 'France',
        'be-fr': 'Belgium (FR)',
        'be-nl': 'Belgium (NL)',
        nl: 'Netherlands',
        es: 'Spain',
        it: 'Italy',
        ie: 'Ireland',
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
      lang: 'de',
      company: 'Inuvet GmbH',
      phone: '+49 (0) 7621 57 91 510',
      fax: '+49 (0) 7621 57 91 512',
      name: 'Max Mustermann',
      email: 'max.mustermann@inuvet.com',
      street: 'Berner Weg 7–25',
      city: '79539 Lörrach',
      country: 'Deutschland',
      disclaimer: DISCLAIMER_DE,
      socialFacebook: true,
      socialFacebookUrl: FB_DE,
      socialInstagram: true,
      socialInstagramUrl: IG_DE,
    },
    at: {
      lang: 'de',
      company: 'Inuvet GmbH',
      phone: '+43 720 81 68 28',
      fax: '+43 720 23 07 95',
      name: 'Max Mustermann',
      email: 'max.mustermann@inuvet.com',
      street: 'Bürgergasse 11',
      city: 'AT-8330 Feldbach',
      country: 'Österreich',
      disclaimer: DISCLAIMER_DE,
      socialFacebook: true,
      socialFacebookUrl: FB_DE,
      socialInstagram: true,
      socialInstagramUrl: IG_DE,
    },
    'ch-de': {
      lang: 'de',
      company: 'Inuvet AG',
      phone: '+41 41 588 06 46',
      fax: '+41 41 588 06 22',
      name: 'Max Mustermann',
      email: 'max.mustermann@inuvet.com',
      street: 'Grabenstrasse 15a',
      city: 'CH-6340 Baar',
      country: 'Schweiz',
      disclaimer: DISCLAIMER_DE,
      socialFacebook: true,
      socialFacebookUrl: FB_DE,
      socialInstagram: true,
      socialInstagramUrl: IG_DE,
    },
    'ch-fr': {
      lang: 'fr',
      company: 'Inuvet AG',
      phone: '+41 41 588 06 46',
      fax: '+41 41 588 06 22',
      name: 'Jean Dupont',
      email: 'jean.dupont@inuvet.com',
      street: 'Grabenstrasse 15a',
      city: 'CH-6340 Baar',
      country: 'Suisse',
      disclaimer: DISCLAIMER_FR,
      socialFacebook: false,
      socialFacebookUrl: '',
      socialInstagram: true,
      socialInstagramUrl: IG_FR,
    },
    'ch-it': {
      lang: 'it',
      company: 'Planet Group IT S.r.l.',
      phone: '+39 051 042 1983',
      fax: '+39 051 042 1989',
      name: 'Mario Rossi',
      email: 'mario.rossi@inuvet.com',
      street: 'Via Ugo Bassi 7',
      city: '40121 Bologna',
      country: 'Italia',
      disclaimer: DISCLAIMER_IT,
      socialFacebook: false,
      socialFacebookUrl: '',
      socialInstagram: false,
      socialInstagramUrl: '',
    },
    fr: {
      lang: 'fr',
      company: 'Inuvet SARL',
      phone: '+33 9 77 55 47 61',
      fax: '+33 9 77 55 47 62',
      name: 'Jean Dupont',
      email: 'jean.dupont@inuvet.com',
      street: 'Quart.d.Entrep. 870 rue Denis Papin',
      city: 'FR-54710 Ludres',
      country: 'France',
      disclaimer: DISCLAIMER_FR,
      socialFacebook: false,
      socialFacebookUrl: '',
      socialInstagram: true,
      socialInstagramUrl: IG_FR,
    },
    'be-fr': {
      lang: 'fr',
      company: 'PLNT Group BE B.V.',
      phone: '+32 2 898 09 44',
      fax: '+32 2 898 09 45',
      name: 'Jean Dupont',
      email: 'jean.dupont@inuvet.com',
      street: 'Da Vincilaan 1',
      city: '1930 Zaventem',
      country: 'Belgique',
      disclaimer: DISCLAIMER_FR,
      socialFacebook: false,
      socialFacebookUrl: '',
      socialInstagram: true,
      socialInstagramUrl: IG_FR,
    },
    'be-nl': {
      lang: 'nl',
      company: 'PLNT Group BE B.V.',
      phone: '+32 2 898 09 44',
      fax: '+32 2 898 09 45',
      name: 'Max Mustermann',
      email: 'max.mustermann@inuvet.com',
      street: 'Da Vincilaan 1',
      city: '1930 Zaventem',
      country: 'België',
      disclaimer: DISCLAIMER_NL,
      socialFacebook: false,
      socialFacebookUrl: '',
      socialInstagram: true,
      socialInstagramUrl: IG_EN,
    },
    nl: {
      lang: 'nl',
      company: 'Planet Group NL B.V.',
      phone: '+31 (0) 4757 48 110',
      fax: '+31 (0) 4757 48 111',
      name: 'Max Mustermann',
      email: 'max.mustermann@inuvet.com',
      street: 'Markt 19',
      city: 'NL-6071 JD Swalmen',
      country: 'Nederland',
      disclaimer: DISCLAIMER_NL,
      socialFacebook: false,
      socialFacebookUrl: '',
      socialInstagram: true,
      socialInstagramUrl: IG_EN,
    },
    es: {
      lang: 'es',
      company: 'PLNT Group Ibérica, S.L.',
      phone: '+34 960 13 58 94',
      fax: '+34 960 13 58 95',
      name: 'Max Mustermann',
      email: 'max.mustermann@inuvet.com',
      street: 'Carrer de l’Almirall Cadarso 26, 2-4',
      city: '46004 Valencia',
      country: 'España',
      disclaimer: DISCLAIMER_ES,
      socialFacebook: false,
      socialFacebookUrl: '',
      socialInstagram: true,
      socialInstagramUrl: IG_ES,
    },
    it: {
      lang: 'it',
      company: 'Planet Group IT S.r.l.',
      phone: '+39 051 042 1983',
      fax: '+39 051 042 1989',
      name: 'Mario Rossi',
      email: 'mario.rossi@inuvet.com',
      street: 'Via Ugo Bassi 7',
      city: '40121 Bologna',
      country: 'Italia',
      disclaimer: DISCLAIMER_IT,
      socialFacebook: false,
      socialFacebookUrl: '',
      socialInstagram: false,
      socialInstagramUrl: '',
    },
    ie: {
      lang: 'en',
      company: 'Inuvet Ltd.',
      phone: '+353 (1) 903 8013',
      fax: '+353 (1) 903 8019',
      name: 'Max Mustermann',
      email: 'max.mustermann@inuvet.com',
      street: 'Unit 9 Dargan Bldg., St John’s Rd.',
      city: 'Dublin 8 D08 A4V6',
      country: 'Ireland',
      disclaimer: DISCLAIMER_EN,
      socialFacebook: false,
      socialFacebookUrl: '',
      socialInstagram: true,
      socialInstagramUrl: IG_EN,
    },
  };

  var currentLang = 'de';
  var localeSelect = document.getElementById('f-locale');
  var instructionsEl = document.getElementById('sig-instructions');
  var brandWrap = document.getElementById('brand-wrap');
  var brandInuvet = document.getElementById('f-brand-inuvet');
  var brandVetalita = document.getElementById('f-brand-vetalita');

  function currentUi() {
    return UI[currentLang] || UI.de;
  }

  function getBrandId() {
    if (localeSelect.value === 'it' && brandVetalita.checked) return 'vetalita';
    return 'inuvet';
  }

  function getBrand() {
    return BRANDS[getBrandId()] || BRANDS.inuvet;
  }

  function sigRootStyle() {
    return 'font-size:' + SIG_FONT + ';font-family:' + SIG_FONT_FACE + ';color:' + FG + ';line-height:1.35;';
  }

  function sigTextStyle(color, size) {
    var fontPart = size ? ('font-size:' + size + ';') : '';
    return 'color:' + color + ';' + fontPart + 'font-family:' + SIG_FONT_FACE + ';line-height:1.35;mso-line-height-rule:exactly;';
  }

  function sigLinkStyle(size) {
    var fontPart = size ? ('font-size:' + size + ';') : '';
    return 'color:' + BRAND_GREEN + ';text-decoration:none;' + fontPart + 'font-family:' + SIG_FONT_FACE + ';';
  }

  function sigSpan(text, color, size, wrap) {
    var html = escapeHtml(text);
    if (wrap === 'strong') html = '<strong>' + html + '</strong>';
    if (wrap === 'em') html = '<em>' + html + '</em>';
    return '<span style="' + sigTextStyle(color, size) + '">' + html + '</span>';
  }

  /* Gmail/iOS erkennen Adressen und färben sie blau — ZWNJ + eigener Link verhindern das */
  function breakAutoLink(str) {
    return escapeHtml(String(str)).replace(/(\d)/g, '$1&#8204;');
  }

  function sigAddressStyle() {
    return 'color:' + FG_MUTED + ';text-decoration:none;font-size:inherit;font-family:' + SIG_FONT_FACE + ';';
  }

  function sigAddressLine(text) {
    var ls = sigAddressStyle();
    return '<a href="" style="' + ls + '">'
      + '<span style="' + sigTextStyle(FG_MUTED) + '">' + breakAutoLink(text) + '</span></a>';
  }

  function sigCell(extra) {
    return 'style="margin:0;padding:0;line-height:1.35;font-size:' + SIG_FONT + ';font-family:' + SIG_FONT_FACE + ';' + (extra || '') + '"';
  }

  function sigTableStyle() {
    return 'border-collapse:collapse;background-color:#ffffff;font-size:' + SIG_FONT + ';font-family:' + SIG_FONT_FACE + ';'
      + 'width:100%;max-width:100%;table-layout:fixed;';
  }

  var fields = {
    name: document.getElementById('f-name'),
    personalOn: document.getElementById('f-personal-on'),
    position: document.getElementById('f-position'),
    email: document.getElementById('f-email'),
    phone: document.getElementById('f-phone'),
    mobile: document.getElementById('f-mobile'),
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
    var ls = sigLinkStyle();
    return '<a href="mailto:' + escapeAttr(email) + '" style="' + ls + '">'
      + '<span style="' + ls + '">' + escapeHtml(label || email) + '</span></a>';
  }

  function sigPhoneLink(phone) {
    var ls = sigLinkStyle();
    return '<a href="tel:' + phone.replace(/\s/g, '') + '" style="' + ls + '">'
      + '<span style="' + ls + '">' + escapeHtml(phone) + '</span></a>';
  }

  function sigWebLink(url, label) {
    var ls = sigLinkStyle();
    return '<a href="' + escapeAttr(url) + '" style="' + ls + '">'
      + '<span style="' + ls + '">' + escapeHtml(label) + '</span></a>';
  }

  function phoneContactRow(label, number) {
    return '<tr><td ' + sigCell() + '>'
      + (label ? sigSpan(label + ' ', FG_MUTED) : '')
      + sigPhoneLink(number)
      + '</td></tr>';
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

  function emailWordPattern(word) {
    return new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
  }

  function linkifyContactHintParagraph(text, email, phone, emailWord) {
    var segments = [{ type: 'text', value: text }];

    if (phone) {
      segments = replaceInSegments(segments, phonePattern(phone), 'phone');
    }
    if (email) {
      segments = replaceInSegments(segments, new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 'email');
      if (emailWord) {
        segments = replaceInSegments(segments, emailWordPattern(emailWord), 'emailWord');
      }
    }
    segments = replaceInSegments(segments, /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, 'email');
    segments = replaceInSegments(segments, /\+\d[\d\s]{6,}\d/g, 'phone');

    return segments.map(function (seg) {
      if (seg.type === 'text') return escapeHtml(seg.value);
      if (seg.type === 'phone') return sigPhoneLink(seg.value);
      if (seg.type === 'emailWord') return sigEmailLink(email, seg.value);
      return sigEmailLink(seg.value, seg.value);
    }).join('');
  }

  function escapeHtmlWithBreaks(text) {
    return String(text)
      .split(/\r?\n/)
      .map(function (line) { return escapeHtml(line); })
      .join('<br>');
  }

  function linkifyContactHintWithBreaks(text, email, phone, emailWord) {
    return String(text)
      .split(/\r?\n/)
      .map(function (line) { return linkifyContactHintParagraph(line, email, phone, emailWord); })
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
        rows += '<tr><td ' + sigCell() + '><span style="' + sigTextStyle(FG) + '"><strong>'
          + escapeHtmlWithBreaks(p) + '</strong></span></td></tr>';
      } else {
        rows += '<tr><td ' + sigCell() + '><span style="' + sigTextStyle(FG_MUTED) + '">'
          + escapeHtmlWithBreaks(p) + '</span></td></tr>';
      }
      if (i < paragraphs.length - 1) {
        rows += '<tr><td ' + gap + '>&nbsp;</td></tr>';
      }
    });
    return rows;
  }

  function buildContactHintRows(text, email, phone, emailWord, skipLeadingGap) {
    var gap = 'style="margin:0;padding:0;font-size:6px;line-height:6px;mso-line-height-rule:exactly;"';
    var paragraphs = text.split(/\n\s*\n/).map(function (p) {
      return p.trim();
    }).filter(Boolean);

    if (!paragraphs.length) return '';

    var rows = skipLeadingGap ? '' : '<tr><td ' + gap + '>&nbsp;</td></tr>';
    paragraphs.forEach(function (p, i) {
      var content = i === 0
        ? escapeHtmlWithBreaks(p)
        : linkifyContactHintWithBreaks(p, email, phone, emailWord);
      if (i === 0) {
        rows += '<tr><td ' + sigCell() + '><span style="' + sigTextStyle(FG) + '"><strong>'
          + content + '</strong></span></td></tr>';
      } else {
        rows += '<tr><td ' + sigCell() + '><span style="' + sigTextStyle(FG_MUTED) + '">'
          + content + '</span></td></tr>';
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
      + 'style="border-collapse:collapse;width:100%;max-width:100%;background-color:#ffffff;">'
      + '<tbody><tr><td style="margin:0;padding:0;line-height:0;font-size:0;">'
      + '<img src="' + escapeAttr(url) + '" alt="" width="' + HEADER_WIDTH + '" decoding="async" '
      + 'style="display:block;width:' + HEADER_WIDTH + 'px;max-width:100%;height:auto;border:0;">'
      + '</td></tr>'
      + '<tr><td ' + gapAfter + '>&nbsp;</td></tr>'
      + '</tbody></table>';
  }

  function buildSignature(d) {
    var gap = 'style="margin:0;padding:0;font-size:6px;line-height:6px;mso-line-height-rule:exactly;"';
    var gapHeadline = 'style="margin:0;padding:0;font-size:8px;line-height:8px;mso-line-height-rule:exactly;"';
    var gapBlock = 'style="margin:0;padding:0;font-size:10px;line-height:10px;mso-line-height-rule:exactly;"';
    var tableBase = sigTableStyle();
    var ui = currentUi();

    var quoteRow = d.quote
      ? '<tr><td ' + sigCell() + '>'
        + sigSpan('»' + d.quote + '«', FG_MUTED, null, 'em')
        + '</td></tr>'
        + '<tr><td ' + gap + '>&nbsp;</td></tr>'
      : '';

    var phoneRow = d.phone
      ? phoneContactRow((d.mobile || d.fax) ? ui.phoneLabel : '', d.phone)
      : '';

    var mobileRow = d.mobile
      ? phoneContactRow(ui.mobileLabel, d.mobile)
      : '';

    var faxRow = d.fax
      ? phoneContactRow(ui.faxLabel, d.fax)
      : '';

    function blockSpacer() {
      return '<tr><td ' + gapBlock + '>&nbsp;</td></tr>'
        + '<tr><td ' + gap + '>&nbsp;</td></tr>';
    }

    function impressumRow() {
      var brand = getBrand();
      if (!brand.showImprint || !brand.impressumUrl) return '';
      var ls = sigLinkStyle(SIG_FONT_SM);
      return '<tr><td ' + gap + '>&nbsp;</td></tr>'
        + '<tr><td ' + sigCell() + '>'
        + '<a href="' + escapeAttr(brand.impressumUrl) + '" style="' + ls + '">'
        + '<span style="' + ls + '">' + IMPRESSUM_LABEL + '</span></a>'
        + '</td></tr>';
    }

    function logoRow(url, alt, width, href) {
      var img = '<img src="' + escapeAttr(url) + '" alt="' + escapeHtml(alt) + '" width="' + width + '" decoding="async" '
        + 'style="display:block;width:' + width + 'px;height:auto;border:0;">';
      if (href) {
        img = '<a href="' + escapeAttr(href) + '" style="text-decoration:none;border:0;">' + img + '</a>';
      }
      return '<tr><td style="margin:0;padding:0;line-height:1;">'
        + img
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

    function addressRows() {
      var rows = '';
      if (d.street) {
        rows += '<tr><td ' + sigCell() + '>' + sigAddressLine(d.street) + '</td></tr>';
      }
      if (d.city) {
        rows += '<tr><td ' + sigCell() + '>' + sigAddressLine(d.city) + '</td></tr>';
      }
      if (d.country) {
        rows += '<tr><td ' + sigCell() + '>' + sigAddressLine(d.country) + '</td></tr>';
      }
      return rows;
    }

    var brand = getBrand();

    var disclaimerRows = d.disclaimerOn && d.disclaimer
      ? '<tr><td ' + gapBlock + '>&nbsp;</td></tr>'
        + (brand.showDisclaimerLogo ? logoRow(DISCLAIMER_LOGO_URL, 'Inuvet', LOGO_WIDTH, brand.website) : '')
        + buildDisclaimerRows(d.disclaimer, true)
      : '';

    var contactHintRows = d.contactHintOn && d.contactHint
      ? '<tr><td ' + gapBlock + '>&nbsp;</td></tr>'
        + buildContactHintRows(d.contactHint, d.contactHintEmail, d.contactHintPhone, ui.emailWord, true)
      : '';

    var socialRow = buildSocialRow(d);

    var topBlock = d.topImage === 'portrait' && d.photo
      ? photoRow(d.photo, d.name)
      : '';

    var personalBlock = d.personalOn
      ? quoteRow
        + '<tr><td ' + sigCell() + '>'
        + sigSpan(d.name, FG, null, 'strong')
        + '</td></tr>'
        + '<tr><td ' + gapHeadline + '>&nbsp;</td></tr>'
        + '<tr><td ' + sigCell() + '>'
        + sigSpan(d.position, FG_MUTED)
        + '</td></tr>'
        + '<tr><td ' + sigCell() + '>'
        + sigEmailLink(d.email, d.email)
        + '</td></tr>'
        + phoneRow
        + mobileRow
        + faxRow
        + blockSpacer()
      : '';

    var companyBlock = d.company
      ? '<tr><td ' + sigCell() + '>'
        + sigSpan(d.company, FG, null, 'strong')
        + '</td></tr>'
        + '<tr><td ' + gapHeadline + '>&nbsp;</td></tr>'
      : '';

    var contactBlock = ''
      + topBlock
      + personalBlock
      + logoRow(brand.logoUrl, brand.logoAlt, LOGO_WIDTH, brand.website)
      + companyBlock
      + addressRows()
      + '<tr><td ' + sigCell() + '>'
      + sigWebLink(brand.website, brand.websiteLabel)
      + '</td></tr>'
      + disclaimerRows
      + contactHintRows
      + socialRow
      + impressumRow();

    return (
      '<div style="' + sigRootStyle() + '">'
      + (d.topImage === 'header' && d.header ? buildHeaderBlock(d.header) : '')
      + '<table cellpadding="0" cellspacing="0" border="0" width="100%" '
      + 'style="' + tableBase + '">'
      + '<tbody>' + contactBlock + '</tbody></table>'
      + '</div>'
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
      phone: fields.phone.value.trim(),
      mobile: fields.mobile.value.trim(),
      fax: fields.fax.value.trim(),
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
    brandWrap.classList.toggle('--hidden', localeSelect.value !== 'it');
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

  function stepsHtml(steps) {
    return '<ol class="sig-instr__steps">'
      + steps.map(function (step) { return '<li>' + step + '</li>'; }).join('')
      + '</ol>';
  }

  function renderInstructions(ui) {
    instructionsEl.innerHTML =
      '<h3 class="section-label --sub">' + escapeHtml(ui.sectionSetup) + '</h3>'
      + '<div class="sig-instr">'
      + '<p class="sig-instr__title">' + escapeHtml(ui.gmailTitle)
      + ' <span class="badge --pill">' + escapeHtml(ui.badgeRecommended) + '</span></p>'
      + '<p class="sig-instr__lead">' + ui.gmailLead + '</p>'
      + stepsHtml(ui.gmailSteps)
      + '</div>'
      + '<div class="notice">'
      + '<p class="notice__title"><span class="material-icons notice__icon" aria-hidden="true">info</span> '
      + escapeHtml(ui.fontNoticeTitle) + '</p>'
      + '<p>' + ui.fontNoticeBody + '</p>'
      + '</div>'
      + '<div class="sig-instr">'
      + '<p class="sig-instr__title">' + escapeHtml(ui.outlookTitle) + '</p>'
      + stepsHtml(ui.outlookSteps)
      + '</div>'
      + '<div class="sig-instr">'
      + '<p class="sig-instr__title">' + escapeHtml(ui.appleTitle) + '</p>'
      + stepsHtml(ui.appleSteps)
      + '</div>'
      + '<div class="sig-instr">'
      + '<p class="sig-instr__title">' + escapeHtml(ui.thunderbirdTitle) + '</p>'
      + stepsHtml(ui.thunderbirdSteps)
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

    Array.prototype.forEach.call(localeSelect.options, function (opt) {
      if (ui.locales[opt.value]) opt.textContent = ui.locales[opt.value];
    });

    renderInstructions(ui);
  }

  function applyLocale(id) {
    var locale = LOCALES[id] || LOCALES.de;
    var ui = UI[locale.lang] || UI.de;

    if (id !== 'it') {
      brandInuvet.checked = true;
    }

    fields.name.value = locale.name;
    fields.email.value = locale.email;
    fields.position.value = ui.defaultPosition;
    fields.quote.value = ui.defaultQuote;
    fields.phone.value = locale.phone;
    fields.mobile.value = '';
    fields.fax.value = locale.fax;
    fields.company.value = locale.company;
    fields.street.value = locale.street || '';
    fields.city.value = locale.city || '';
    fields.country.value = locale.country || '';
    fields.disclaimer.value = locale.disclaimer;
    fields.disclaimerOn.checked = true;
    fields.contactHintPhone.value = locale.phone;
    fields.contactHint.value = contactHintFor(locale.lang, locale.phone);
    fields.contactHintEmail.value = 'info@inuvet.com';

    fields.socialFacebook.checked = !!locale.socialFacebook;
    fields.socialFacebookUrl.value = locale.socialFacebookUrl || '';
    fields.socialInstagram.checked = !!locale.socialInstagram;
    fields.socialInstagramUrl.value = locale.socialInstagramUrl || '';

    if (id === 'it' && brandVetalita.checked) {
      applyVetalitaOverrides();
    }

    applyUi(locale.lang);
    syncVisibility();
    updateNow();
  }

  function applyVetalitaOverrides() {
    var brand = BRANDS.vetalita;
    fields.company.value = brand.company;
    fields.name.value = brand.name;
    fields.email.value = brand.email;
    fields.contactHintEmail.value = brand.contactHintEmail;
    fields.contactHint.value = contactHintFor('it', LOCALES.it.phone);
    fields.disclaimer.value = brand.disclaimer;
    fields.disclaimerOn.checked = false;
    fields.socialFacebook.checked = false;
    fields.socialFacebookUrl.value = '';
    fields.socialInstagram.checked = false;
    fields.socialInstagramUrl.value = '';
  }

  function applyBrand() {
    if (localeSelect.value !== 'it') return;

    if (brandVetalita.checked) {
      applyVetalitaOverrides();
    } else {
      var locale = LOCALES.it;
      fields.company.value = locale.company;
      fields.name.value = locale.name;
      fields.email.value = locale.email;
      fields.contactHintEmail.value = 'info@inuvet.com';
      fields.contactHint.value = contactHintFor(locale.lang, locale.phone);
      fields.disclaimer.value = locale.disclaimer;
      fields.disclaimerOn.checked = true;
      fields.socialFacebook.checked = !!locale.socialFacebook;
      fields.socialFacebookUrl.value = locale.socialFacebookUrl || '';
      fields.socialInstagram.checked = !!locale.socialInstagram;
      fields.socialInstagramUrl.value = locale.socialInstagramUrl || '';
    }

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
      showToast(ui.toastCopied, 'success');
      setTimeout(function () {
        copyBtn.classList.remove('--copied');
      }, 2500);
    } catch (e) {
      showToast(ui.toastCopyFail, 'error');
    }
  }

  function downloadHtml() {
    var markup = prettyPrintHtml(getSignatureMarkup());
    var titleSuffix = getBrandId() === 'vetalita' ? 'vetalità' : 'inuvet';
    var filename = getBrandId() === 'vetalita' ? 'vetalita-signatur.html' : 'inuvet-signatur.html';
    var doc = wrapHtmlDocument(markup, currentUi().pageTitle + ' – ' + titleSuffix);
    downloadFile(doc, filename);
    showToast(currentUi().toastHtml, 'success');
  }

  function downloadForThunderbird() {
    var doc = wrapHtmlDocument(getSignatureMarkup());
    var filename = getBrandId() === 'vetalita'
      ? 'vetalita-signatur-thunderbird.html'
      : 'inuvet-signatur-thunderbird.html';
    downloadFile(doc, filename);
  }

  document.getElementById('sig-form').addEventListener('input', scheduleUpdate);
  localeSelect.addEventListener('change', function () {
    applyLocale(localeSelect.value);
  });
  brandInuvet.addEventListener('change', applyBrand);
  brandVetalita.addEventListener('change', applyBrand);
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

  applyLocale(localeSelect.value || 'de');
})();
