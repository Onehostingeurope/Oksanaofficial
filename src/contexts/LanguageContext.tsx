import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "fr" | "it" | "es" | "de" | "ru";

export const languageLabels: Record<Language, string> = {
  en: "EN",
  fr: "FR",
  it: "IT",
  es: "ES",
  de: "DE",
  ru: "RU",
};

export const languageFlags: Record<Language, string> = {
  en: "https://flagcdn.com/w40/gb.png",
  fr: "https://flagcdn.com/w40/fr.png",
  it: "https://flagcdn.com/w40/it.png",
  es: "https://flagcdn.com/w40/es.png",
  de: "https://flagcdn.com/w40/de.png",
  ru: "https://flagcdn.com/w40/ru.png",
};

type TranslationKeys = {
  // Nav
  nav_about: string;
  nav_music: string;
  nav_gallery: string;
  nav_events: string;
  nav_merch: string;
  nav_contact: string;

  // Hero
  hero_listen: string;
  hero_book: string;

  // About
  about_label: string;
  about_title_1: string;
  about_title_2: string;

  // Music
  music_label: string;
  music_title_1: string;
  music_title_2: string;
  music_listen_spotify: string;

  // Video
  video_label: string;
  video_title_1: string;
  video_title_2: string;

  // Gallery
  gallery_label: string;
  gallery_title_1: string;
  gallery_title_2: string;
  gallery_close: string;

  // Events
  events_label: string;
  events_title_1: string;
  events_title_2: string;
  events_sold_out: string;
  events_tickets: string;

  // Merch
  merch_label: string;
  merch_title_1: string;
  merch_title_2: string;

  // Contact
  contact_label: string;
  contact_title_1: string;
  contact_title_2: string;
  contact_booking_title: string;
  contact_booking_desc: string;
  contact_management: string;
  contact_name: string;
  contact_email: string;
  contact_subject: string;
  contact_message: string;
  contact_send: string;
  contact_sending: string;
  contact_sent: string;
  contact_sent_desc: string;
  contact_fill_all: string;
  contact_valid_email: string;
  contact_error: string;

  // Footer
  footer_tagline: string;
  footer_quick_links: string;
  footer_newsletter: string;
  footer_newsletter_desc: string;
  footer_email_placeholder: string;
  footer_join: string;
  footer_already_subscribed: string;
  footer_subscribed: string;
  footer_rights: string;

  // Player
  player_previous: string;
  player_next: string;
};

const translations: Record<Language, TranslationKeys> = {
  en: {
    nav_about: "About",
    nav_music: "Music",
    nav_gallery: "Gallery",
    nav_events: "Events",
    nav_merch: "Merch",
    nav_contact: "Contact",
    hero_listen: "Listen Now",
    hero_book: "Book Now",
    about_label: "About",
    about_title_1: "The Voice Behind",
    about_title_2: "The Magic",
    music_label: "Discography",
    music_title_1: "Latest",
    music_title_2: "Music",
    music_listen_spotify: "Listen on Spotify",
    video_label: "Watch",
    video_title_1: "Latest",
    video_title_2: "Video",
    gallery_label: "Gallery",
    gallery_title_1: "Behind the",
    gallery_title_2: "Scenes",
    gallery_close: "Close lightbox",
    events_label: "Tour",
    events_title_1: "Upcoming",
    events_title_2: "Events",
    events_sold_out: "Sold Out",
    events_tickets: "Get Tickets",
    merch_label: "Shop",
    merch_title_1: "Exclusive",
    merch_title_2: "Merch",
    contact_label: "Get in Touch",
    contact_title_1: "Contact &",
    contact_title_2: "Booking",
    contact_booking_title: "Booking Inquiries",
    contact_booking_desc: "For booking and management inquiries, reach out to our team.",
    contact_management: "Management",
    contact_name: "Your Name",
    contact_email: "Your Email",
    contact_subject: "Subject",
    contact_message: "Your Message",
    contact_send: "Send Message",
    contact_sending: "Sending...",
    contact_sent: "Message sent!",
    contact_sent_desc: "We'll get back to you soon.",
    contact_fill_all: "Please fill in all fields",
    contact_valid_email: "Please enter a valid email",
    contact_error: "Something went wrong",
    footer_tagline: "Where elegance meets the rhythm of the soul. Follow the journey.",
    footer_quick_links: "Quick Links",
    footer_newsletter: "Newsletter",
    footer_newsletter_desc: "Stay updated with new releases and tour dates.",
    footer_email_placeholder: "Your email",
    footer_join: "Join",
    footer_already_subscribed: "You're already subscribed!",
    footer_subscribed: "Welcome! You're subscribed 🎶",
    footer_rights: "All rights reserved.",
    player_previous: "Previous track",
    player_next: "Next track",
  },
  fr: {
    nav_about: "À propos",
    nav_music: "Musique",
    nav_gallery: "Galerie",
    nav_events: "Événements",
    nav_merch: "Boutique",
    nav_contact: "Contact",
    hero_listen: "Écouter",
    hero_book: "Réserver",
    about_label: "À propos",
    about_title_1: "La Voix Derrière",
    about_title_2: "La Magie",
    music_label: "Discographie",
    music_title_1: "Dernière",
    music_title_2: "Musique",
    music_listen_spotify: "Écouter sur Spotify",
    video_label: "Regarder",
    video_title_1: "Dernière",
    video_title_2: "Vidéo",
    gallery_label: "Galerie",
    gallery_title_1: "Dans les",
    gallery_title_2: "Coulisses",
    gallery_close: "Fermer",
    events_label: "Tournée",
    events_title_1: "Prochains",
    events_title_2: "Événements",
    events_sold_out: "Complet",
    events_tickets: "Billets",
    merch_label: "Boutique",
    merch_title_1: "Merch",
    merch_title_2: "Exclusif",
    contact_label: "Nous Contacter",
    contact_title_1: "Contact &",
    contact_title_2: "Réservation",
    contact_booking_title: "Demandes de réservation",
    contact_booking_desc: "Pour les demandes de réservation et de gestion, contactez notre équipe.",
    contact_management: "Management",
    contact_name: "Votre Nom",
    contact_email: "Votre Email",
    contact_subject: "Sujet",
    contact_message: "Votre Message",
    contact_send: "Envoyer",
    contact_sending: "Envoi...",
    contact_sent: "Message envoyé !",
    contact_sent_desc: "Nous vous répondrons bientôt.",
    contact_fill_all: "Veuillez remplir tous les champs",
    contact_valid_email: "Veuillez entrer un email valide",
    contact_error: "Une erreur est survenue",
    footer_tagline: "Où l'élégance rencontre le rythme de l'âme. Suivez le voyage.",
    footer_quick_links: "Liens Rapides",
    footer_newsletter: "Newsletter",
    footer_newsletter_desc: "Restez informé des nouvelles sorties et des dates de tournée.",
    footer_email_placeholder: "Votre email",
    footer_join: "Rejoindre",
    footer_already_subscribed: "Vous êtes déjà abonné !",
    footer_subscribed: "Bienvenue ! Vous êtes abonné 🎶",
    footer_rights: "Tous droits réservés.",
    player_previous: "Piste précédente",
    player_next: "Piste suivante",
  },
  it: {
    nav_about: "Chi Sono",
    nav_music: "Musica",
    nav_gallery: "Galleria",
    nav_events: "Eventi",
    nav_merch: "Shop",
    nav_contact: "Contatti",
    hero_listen: "Ascolta Ora",
    hero_book: "Prenota Ora",
    about_label: "Chi Sono",
    about_title_1: "La Voce Dietro",
    about_title_2: "La Magia",
    music_label: "Discografia",
    music_title_1: "Ultima",
    music_title_2: "Musica",
    music_listen_spotify: "Ascolta su Spotify",
    video_label: "Guarda",
    video_title_1: "Ultimo",
    video_title_2: "Video",
    gallery_label: "Galleria",
    gallery_title_1: "Dietro le",
    gallery_title_2: "Quinte",
    gallery_close: "Chiudi",
    events_label: "Tour",
    events_title_1: "Prossimi",
    events_title_2: "Eventi",
    events_sold_out: "Esaurito",
    events_tickets: "Biglietti",
    merch_label: "Shop",
    merch_title_1: "Merch",
    merch_title_2: "Esclusivo",
    contact_label: "Contattaci",
    contact_title_1: "Contatti &",
    contact_title_2: "Prenotazioni",
    contact_booking_title: "Richieste di prenotazione",
    contact_booking_desc: "Per richieste di prenotazione e gestione, contatta il nostro team.",
    contact_management: "Management",
    contact_name: "Il Tuo Nome",
    contact_email: "La Tua Email",
    contact_subject: "Oggetto",
    contact_message: "Il Tuo Messaggio",
    contact_send: "Invia Messaggio",
    contact_sending: "Invio...",
    contact_sent: "Messaggio inviato!",
    contact_sent_desc: "Ti risponderemo presto.",
    contact_fill_all: "Compila tutti i campi",
    contact_valid_email: "Inserisci un'email valida",
    contact_error: "Qualcosa è andato storto",
    footer_tagline: "Dove l'eleganza incontra il ritmo dell'anima. Segui il viaggio.",
    footer_quick_links: "Link Rapidi",
    footer_newsletter: "Newsletter",
    footer_newsletter_desc: "Resta aggiornato sulle nuove uscite e le date del tour.",
    footer_email_placeholder: "La tua email",
    footer_join: "Iscriviti",
    footer_already_subscribed: "Sei già iscritto!",
    footer_subscribed: "Benvenuto! Sei iscritto 🎶",
    footer_rights: "Tutti i diritti riservati.",
    player_previous: "Traccia precedente",
    player_next: "Traccia successiva",
  },
  es: {
    nav_about: "Sobre Mí",
    nav_music: "Música",
    nav_gallery: "Galería",
    nav_events: "Eventos",
    nav_merch: "Tienda",
    nav_contact: "Contacto",
    hero_listen: "Escuchar",
    hero_book: "Reservar",
    about_label: "Sobre Mí",
    about_title_1: "La Voz Detrás de",
    about_title_2: "La Magia",
    music_label: "Discografía",
    music_title_1: "Última",
    music_title_2: "Música",
    music_listen_spotify: "Escuchar en Spotify",
    video_label: "Ver",
    video_title_1: "Último",
    video_title_2: "Video",
    gallery_label: "Galería",
    gallery_title_1: "Detrás de",
    gallery_title_2: "Escena",
    gallery_close: "Cerrar",
    events_label: "Gira",
    events_title_1: "Próximos",
    events_title_2: "Eventos",
    events_sold_out: "Agotado",
    events_tickets: "Entradas",
    merch_label: "Tienda",
    merch_title_1: "Merch",
    merch_title_2: "Exclusivo",
    contact_label: "Contáctanos",
    contact_title_1: "Contacto y",
    contact_title_2: "Reservas",
    contact_booking_title: "Consultas de reserva",
    contact_booking_desc: "Para consultas de reserva y gestión, contacta con nuestro equipo.",
    contact_management: "Management",
    contact_name: "Tu Nombre",
    contact_email: "Tu Email",
    contact_subject: "Asunto",
    contact_message: "Tu Mensaje",
    contact_send: "Enviar Mensaje",
    contact_sending: "Enviando...",
    contact_sent: "¡Mensaje enviado!",
    contact_sent_desc: "Te responderemos pronto.",
    contact_fill_all: "Por favor completa todos los campos",
    contact_valid_email: "Por favor ingresa un email válido",
    contact_error: "Algo salió mal",
    footer_tagline: "Donde la elegancia se encuentra con el ritmo del alma. Sigue el viaje.",
    footer_quick_links: "Enlaces Rápidos",
    footer_newsletter: "Newsletter",
    footer_newsletter_desc: "Mantente al día con nuevos lanzamientos y fechas de gira.",
    footer_email_placeholder: "Tu email",
    footer_join: "Unirse",
    footer_already_subscribed: "¡Ya estás suscrito!",
    footer_subscribed: "¡Bienvenido! Estás suscrito 🎶",
    footer_rights: "Todos los derechos reservados.",
    player_previous: "Pista anterior",
    player_next: "Pista siguiente",
  },
  de: {
    nav_about: "Über Mich",
    nav_music: "Musik",
    nav_gallery: "Galerie",
    nav_events: "Events",
    nav_merch: "Shop",
    nav_contact: "Kontakt",
    hero_listen: "Jetzt Hören",
    hero_book: "Jetzt Buchen",
    about_label: "Über Mich",
    about_title_1: "Die Stimme Hinter",
    about_title_2: "Der Magie",
    music_label: "Diskografie",
    music_title_1: "Neueste",
    music_title_2: "Musik",
    music_listen_spotify: "Auf Spotify hören",
    video_label: "Ansehen",
    video_title_1: "Neuestes",
    video_title_2: "Video",
    gallery_label: "Galerie",
    gallery_title_1: "Hinter den",
    gallery_title_2: "Kulissen",
    gallery_close: "Schließen",
    events_label: "Tour",
    events_title_1: "Kommende",
    events_title_2: "Events",
    events_sold_out: "Ausverkauft",
    events_tickets: "Tickets",
    merch_label: "Shop",
    merch_title_1: "Exklusives",
    merch_title_2: "Merch",
    contact_label: "Kontakt",
    contact_title_1: "Kontakt &",
    contact_title_2: "Buchung",
    contact_booking_title: "Buchungsanfragen",
    contact_booking_desc: "Für Buchungs- und Managementanfragen wenden Sie sich an unser Team.",
    contact_management: "Management",
    contact_name: "Ihr Name",
    contact_email: "Ihre Email",
    contact_subject: "Betreff",
    contact_message: "Ihre Nachricht",
    contact_send: "Nachricht Senden",
    contact_sending: "Wird gesendet...",
    contact_sent: "Nachricht gesendet!",
    contact_sent_desc: "Wir melden uns bald bei Ihnen.",
    contact_fill_all: "Bitte füllen Sie alle Felder aus",
    contact_valid_email: "Bitte geben Sie eine gültige Email ein",
    contact_error: "Etwas ist schiefgelaufen",
    footer_tagline: "Wo Eleganz auf den Rhythmus der Seele trifft. Folge der Reise.",
    footer_quick_links: "Schnelllinks",
    footer_newsletter: "Newsletter",
    footer_newsletter_desc: "Bleiben Sie über neue Veröffentlichungen und Tourdaten auf dem Laufenden.",
    footer_email_placeholder: "Ihre Email",
    footer_join: "Anmelden",
    footer_already_subscribed: "Sie sind bereits abonniert!",
    footer_subscribed: "Willkommen! Sie sind abonniert 🎶",
    footer_rights: "Alle Rechte vorbehalten.",
    player_previous: "Vorheriger Titel",
    player_next: "Nächster Titel",
  },
  ru: {
    nav_about: "Обо мне",
    nav_music: "Музыка",
    nav_gallery: "Галерея",
    nav_events: "События",
    nav_merch: "Магазин",
    nav_contact: "Контакты",
    hero_listen: "Слушать",
    hero_book: "Забронировать",
    about_label: "Обо мне",
    about_title_1: "Голос За",
    about_title_2: "Магией",
    music_label: "Дискография",
    music_title_1: "Новая",
    music_title_2: "Музыка",
    music_listen_spotify: "Слушать на Spotify",
    video_label: "Смотреть",
    video_title_1: "Новое",
    video_title_2: "Видео",
    gallery_label: "Галерея",
    gallery_title_1: "За",
    gallery_title_2: "Кулисами",
    gallery_close: "Закрыть",
    events_label: "Тур",
    events_title_1: "Предстоящие",
    events_title_2: "События",
    events_sold_out: "Распродано",
    events_tickets: "Билеты",
    merch_label: "Магазин",
    merch_title_1: "Эксклюзивный",
    merch_title_2: "Мерч",
    contact_label: "Связаться",
    contact_title_1: "Контакты и",
    contact_title_2: "Бронирование",
    contact_booking_title: "Запросы на бронирование",
    contact_booking_desc: "По вопросам бронирования и менеджмента свяжитесь с нашей командой.",
    contact_management: "Менеджмент",
    contact_name: "Ваше Имя",
    contact_email: "Ваш Email",
    contact_subject: "Тема",
    contact_message: "Ваше Сообщение",
    contact_send: "Отправить",
    contact_sending: "Отправка...",
    contact_sent: "Сообщение отправлено!",
    contact_sent_desc: "Мы свяжемся с вами в ближайшее время.",
    contact_fill_all: "Пожалуйста, заполните все поля",
    contact_valid_email: "Пожалуйста, введите корректный email",
    contact_error: "Что-то пошло не так",
    footer_tagline: "Где элегантность встречается с ритмом души. Следуй за путешествием.",
    footer_quick_links: "Быстрые Ссылки",
    footer_newsletter: "Рассылка",
    footer_newsletter_desc: "Будьте в курсе новых релизов и дат туров.",
    footer_email_placeholder: "Ваш email",
    footer_join: "Подписаться",
    footer_already_subscribed: "Вы уже подписаны!",
    footer_subscribed: "Добро пожаловать! Вы подписаны 🎶",
    footer_rights: "Все права защищены.",
    player_previous: "Предыдущий трек",
    player_next: "Следующий трек",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("zaira-lang") as Language;
    return saved && translations[saved] ? saved : "en";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("zaira-lang", lang);
  };

  const t = (key: keyof TranslationKeys): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
