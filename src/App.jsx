
import React, { useMemo, useState } from "react";
import {
  Building2,
  GraduationCap,
  Search,
  User,
  Bookmark,
  Share2,
  MessageCircle,
  ChevronRight,
  MapPin,
  Clock3,
  Filter,
  X,
  Plus,
  Lock,
  LogIn,
  UserPlus,
  CheckCircle2,
  Sparkles,
  Briefcase,
  Globe2,
  BookOpen,
  School,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";

const BRAND = "STUDYSIA";
const WHATSAPP_FALLBACK = "+24100000000";
const AUDIO_TRACKS = [
  "/audio/ambient-1.mp3",
  "/audio/ambient-2.mp3",
  "/audio/ambient-3.mp3",
];
const DEFAULT_ADMISSION = "Dossier + entretien";
const DEFAULT_CONTACT = "contact@etablissement.ga";
const GENERIC_LOGO = "/logo-afram.png";

const API_URL = import.meta.env.VITE_API_URL || "";

const filters = [
  { id: "Tous", label: "Toutes les filiÃƒÂ¨res", icon: Sparkles },
  { id: "Business", label: "Business & Gestion", icon: Briefcase },
  { id: "Tech", label: "Tech & Digital", icon: Globe2 },
  { id: "SantÃƒÂ©", label: "SantÃƒÂ©", icon: GraduationCap },
  { id: "IngÃƒÂ©nierie", label: "IngÃƒÂ©nierie", icon: Building2 },
  { id: "Arts", label: "Arts & CrÃƒÂ©ation", icon: BookOpen },
];

const programs = [
  {
    id: 6,
    field: "Business",
    degree: "Master",
    duration: "2 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Master en Management des Organisations",
    institution: "UniversitÃƒÂ© Omar Bongo",
    handle: "@uob_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Ãƒâ‚¬ partir de 787 148 FCFA / an",
    mode: "PrÃƒÂ©sentiel",
    saves: "980",
    contacts: "Candidatures ouvertes",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Programme axÃƒÂ© sur la stratÃƒÂ©gie, la gestion des ressources humaines et la conduite du changement.",
    institutionBio:
      "UniversitÃƒÂ© publique de rÃƒÂ©fÃƒÂ©rence au Gabon, avec une forte implantation ÃƒÂ  Libreville.",
    highlights: ["StratÃƒÂ©gie", "RH", "Pilotage"],
    outcomes: ["Chef de projet", "Manager RH", "Consultant junior"],
    accent: "from-orange-400/15 via-amber-300/20 to-transparent",
  },
  {
    id: 7,
    field: "Tech",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Septembre 2026",
    title: "Licence en Informatique et RÃƒÂ©seaux",
    institution: "UniversitÃƒÂ© des Sciences et Techniques de Masuku",
    handle: "@ustm_gabon",
    city: "Franceville, Gabon",
    country: "Gabon",
    tuition: "Ãƒâ‚¬ partir de 918 340 FCFA / an",
    mode: "PrÃƒÂ©sentiel",
    saves: "1,1k",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Formation en systÃƒÂ¨mes, rÃƒÂ©seaux, dÃƒÂ©veloppement et bases de donnÃƒÂ©es appliquÃƒÂ©es.",
    institutionBio:
      "UniversitÃƒÂ© scientifique de rÃƒÂ©fÃƒÂ©rence, orientÃƒÂ©e vers lÃ¢â‚¬â„¢ingÃƒÂ©nierie et les sciences appliquÃƒÂ©es.",
    highlights: ["RÃƒÂ©seaux", "DÃƒÂ©veloppement", "Bases de donnÃƒÂ©es"],
    outcomes: ["Admin systÃƒÂ¨mes", "DÃƒÂ©veloppeur junior", "Technicien rÃƒÂ©seaux"],
    accent: "from-pink-400/15 via-orange-300/20 to-transparent",
  },
  {
    id: 8,
    field: "SantÃƒÂ©",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence en Sciences BiomÃƒÂ©dicales",
    institution: "UniversitÃƒÂ© des Sciences de la SantÃƒÂ©",
    handle: "@uss_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Ãƒâ‚¬ partir de 1 180 723 FCFA / an",
    mode: "PrÃƒÂ©sentiel",
    saves: "760",
    contacts: "Places limitÃƒÂ©es",
    image:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Parcours biomÃƒÂ©dical avec initiation aux techniques de laboratoire et ÃƒÂ  la recherche clinique.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur orientÃƒÂ© santÃƒÂ© publique et formation clinique.",
    highlights: ["Biologie", "Laboratoire", "Recherche"],
    outcomes: ["Assistant de recherche", "Technicien biomÃƒÂ©dical", "AttachÃƒÂ© clinique"],
    accent: "from-rose-400/15 via-pink-300/20 to-transparent",
  },
  {
    id: 9,
    field: "IngÃƒÂ©nierie",
    degree: "Master",
    duration: "2 ans",
    intake: "RentrÃƒÂ©e Novembre 2026",
    title: "Master en GÃƒÂ©nie PÃƒÂ©trolier et Ãƒâ€°nergie",
    institution: "Institut du PÃƒÂ©trole et du Gaz",
    handle: "@ipg_gabon",
    city: "Port-Gentil, Gabon",
    country: "Gabon",
    tuition: "Ãƒâ‚¬ partir de 1 705 488 FCFA / an",
    mode: "PrÃƒÂ©sentiel",
    saves: "1,3k",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&q=80",
    summary:
      "SpÃƒÂ©cialisation en exploration, production et gestion des infrastructures ÃƒÂ©nergÃƒÂ©tiques.",
    institutionBio:
      "Institut spÃƒÂ©cialisÃƒÂ© orientÃƒÂ© vers les mÃƒÂ©tiers du pÃƒÂ©trole, du gaz et de lÃ¢â‚¬â„¢ÃƒÂ©nergie.",
    highlights: ["Forage", "Production", "Ãƒâ€°nergie"],
    outcomes: ["IngÃƒÂ©nieur production", "IngÃƒÂ©nieur forage", "Chef de projet ÃƒÂ©nergie"],
    accent: "from-[#f7c300]/20 via-[#f36b21]/20 to-transparent",
  },
  {
    id: 10,
    field: "Arts",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence en Design Graphique et Communication Visuelle",
    institution: "Ãƒâ€°cole SupÃƒÂ©rieure des MÃƒÂ©tiers de lÃ¢â‚¬â„¢Image",
    handle: "@esmi_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Ãƒâ‚¬ partir de 1 311 914 FCFA / an",
    mode: "Hybride",
    saves: "640",
    contacts: "Portfolio requis",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Formation crÃƒÂ©ative en identitÃƒÂ© visuelle, UI/UX et production multimÃƒÂ©dia.",
    institutionBio:
      "Ãƒâ€°cole privÃƒÂ©e dÃƒÂ©diÃƒÂ©e aux mÃƒÂ©tiers de la crÃƒÂ©ation et de la communication.",
    highlights: ["IdentitÃƒÂ© visuelle", "UI/UX", "MultimÃƒÂ©dia"],
    outcomes: ["Designer graphique", "UI designer", "CrÃƒÂ©atif digital"],
    accent: "from-[#d90b6f]/20 via-[#f36b21]/20 to-transparent",
  },
  {
    id: 11,
    field: "Business",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence en Finance ComptabilitÃƒÂ©",
    institution: "Institut National des Sciences de Gestion (INSG)",
    handle: "@insg_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "1,0k",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Parcours en finance et comptabilitÃƒÂ© proposÃƒÂ© au sein des formations de lÃ¢â‚¬â„¢INSG.",
    institutionBio:
      "Institut public gabonais spÃƒÂ©cialisÃƒÂ© en sciences de gestion et management.",
    highlights: ["Finance", "ComptabilitÃƒÂ©", "Gestion"],
    outcomes: ["Comptable", "Assistant financier", "ContrÃƒÂ´leur junior"],
    accent: "from-orange-400/15 via-amber-300/20 to-transparent",
  },
  {
    id: 12,
    field: "Business",
    degree: "Master",
    duration: "2 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Master en Marketing StratÃƒÂ©gique et Commercial",
    institution: "Institut National des Sciences de Gestion (INSG)",
    handle: "@insg_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "920",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Master orientÃƒÂ© stratÃƒÂ©gie marketing et dÃƒÂ©veloppement commercial.",
    institutionBio:
      "Institut public gabonais spÃƒÂ©cialisÃƒÂ© en sciences de gestion et management.",
    highlights: ["Marketing", "StratÃƒÂ©gie", "Commerce"],
    outcomes: ["Chef de produit", "Responsable commercial", "ChargÃƒÂ© marketing"],
    accent: "from-pink-400/15 via-orange-300/20 to-transparent",
  },
  {
    id: 13,
    field: "Business",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Septembre 2026",
    title: "Licence Achat Ã¢â‚¬â€œ QualitÃƒÂ© Ã¢â‚¬â€œ Logistique",
    institution: "Institut SupÃƒÂ©rieur de Technologie (IST)",
    handle: "@ist_gabon",
    city: "Bikele, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "1,2k",
    contacts: "Concours dÃ¢â‚¬â„¢entrÃƒÂ©e",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Licence professionnalisante du pÃƒÂ´le Management de lÃ¢â‚¬â„¢IST.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur ÃƒÂ  Bikele proposant des formations en management et technologie.",
    highlights: ["Achat", "QualitÃƒÂ©", "Logistique"],
    outcomes: ["Assistant logistique", "ChargÃƒÂ© achats", "ContrÃƒÂ´leur qualitÃƒÂ©"],
    accent: "from-[#f7c300]/20 via-[#f36b21]/20 to-transparent",
  },
  {
    id: 14,
    field: "Tech",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Septembre 2026",
    title: "GÃƒÂ©nie Logiciel : Maintenance Mobile et DÃƒÂ©veloppement dÃ¢â‚¬â„¢Applications",
    institution: "Institut SupÃƒÂ©rieur de Technologie (IST)",
    handle: "@ist_gabon",
    city: "Bikele, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "1,4k",
    contacts: "Concours dÃ¢â‚¬â„¢entrÃƒÂ©e",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Parcours technologique orientÃƒÂ© dÃƒÂ©veloppement dÃ¢â‚¬â„¢applications et maintenance mobile.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur ÃƒÂ  Bikele proposant des formations en management et technologie.",
    highlights: ["DÃƒÂ©veloppement", "Mobile", "GÃƒÂ©nie logiciel"],
    outcomes: ["DÃƒÂ©veloppeur mobile", "IntÃƒÂ©grateur", "Technicien applicatif"],
    accent: "from-pink-400/15 via-orange-300/20 to-transparent",
  },
  {
    id: 15,
    field: "Business",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence en Marketing et Communication Digitale",
    institution: "African University of Management & Technologies (AUM)",
    handle: "@aum_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "980",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Formation orientÃƒÂ©e marketing digital et communication, en phase avec les spÃƒÂ©cialisations de lÃ¢â‚¬â„¢AUM.",
    institutionBio:
      "UniversitÃƒÂ© privÃƒÂ©e de management et technologies basÃƒÂ©e ÃƒÂ  Libreville.",
    highlights: ["Marketing digital", "Communication", "Projet"],
    outcomes: ["ChargÃƒÂ© marketing", "Community manager", "Assistant communication"],
    accent: "from-[#f36b21]/20 via-[#d90b6f]/20 to-transparent",
  },
  {
    id: 16,
    field: "Business",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence (AFRAM)",
    institution: "AcadÃƒÂ©mie Franco-AmÃƒÂ©ricaine de Management (AFRAM)",
    handle: "@afram_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "720",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1600&q=80",
    summary:
      "LÃ¢â‚¬â„¢AFRAM propose des parcours de licence et de master en enseignement supÃƒÂ©rieur.",
    institutionBio:
      "Ãƒâ€°tablissement privÃƒÂ© dÃ¢â‚¬â„¢enseignement supÃƒÂ©rieur habilitÃƒÂ© et reconnu par lÃ¢â‚¬â„¢Ãƒâ€°tat gabonais.",
    highlights: ["Management", "Business school", "Professionnalisation"],
    outcomes: ["Assistant manager", "ChargÃƒÂ© dÃ¢â‚¬â„¢ÃƒÂ©tudes", "Gestionnaire junior"],
    accent: "from-[#f36b21]/20 via-[#f7c300]/20 to-transparent",
  },
  {
    id: 17,
    field: "Business",
    degree: "FiliÃƒÂ¨re",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Science de Gestion",
    institution: "Institut des Hautes Ãƒâ€°tudes Ãƒâ€°conomiques et Entrepreneuriales (IHEE)",
    handle: "@ihee_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "860",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
    summary:
      "FiliÃƒÂ¨re de sciences de gestion proposÃƒÂ©e par lÃ¢â‚¬â„¢IHEE.",
    institutionBio:
      "Ãƒâ€°tablissement dÃ¢â‚¬â„¢enseignement supÃƒÂ©rieur reconnu par lÃ¢â‚¬â„¢Ãƒâ€°tat gabonais depuis 2003.",
    highlights: ["Gestion", "Administration", "Entrepreneuriat"],
    outcomes: ["Assistant gestion", "ChargÃƒÂ© administratif", "Entrepreneur junior"],
    accent: "from-pink-400/15 via-rose-300/20 to-transparent",
  },
  {
    id: 18,
    field: "Business",
    degree: "FiliÃƒÂ¨re",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Science Juridique",
    institution: "Institut des Hautes Ãƒâ€°tudes Ãƒâ€°conomiques et Entrepreneuriales (IHEE)",
    handle: "@ihee_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "840",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
    summary:
      "FiliÃƒÂ¨re en sciences juridiques proposÃƒÂ©e par lÃ¢â‚¬â„¢IHEE.",
    institutionBio:
      "Ãƒâ€°tablissement dÃ¢â‚¬â„¢enseignement supÃƒÂ©rieur reconnu par lÃ¢â‚¬â„¢Ãƒâ€°tat gabonais depuis 2003.",
    highlights: ["Droit", "RÃƒÂ©glementation", "Analyse juridique"],
    outcomes: ["Assistant juridique", "Gestionnaire conformitÃƒÂ©", "ChargÃƒÂ© de dossiers"],
    accent: "from-[#f7c300]/20 via-[#f36b21]/20 to-transparent",
  },
  {
    id: 19,
    field: "Tech",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Septembre 2026",
    title: "Licence en Informatique Industrielle",
    institution: "Institut des Sciences et Techniques AvancÃƒÂ©es (ISTA)",
    handle: "@ista_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "780",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Parcours orientÃƒÂ© systÃƒÂ¨mes industriels, automatisation et outils numÃƒÂ©riques.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur orientÃƒÂ© sciences et techniques appliquÃƒÂ©es.",
    highlights: ["SystÃƒÂ¨mes industriels", "Automatisation", "Informatique"],
    outcomes: ["Technicien systÃƒÂ¨mes", "Assistant ingÃƒÂ©nieur", "Support industriel"],
    accent: "from-pink-400/15 via-orange-300/20 to-transparent",
  },
  {
    id: 20,
    field: "IngÃƒÂ©nierie",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence en GÃƒÂ©nie Civil",
    institution: "Institut de Technologie AppliquÃƒÂ©e (ITA)",
    handle: "@ita_gabon",
    city: "Port-Gentil, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "690",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Formation axÃƒÂ©e sur la construction, la topographie et la gestion de chantier.",
    institutionBio:
      "Institut orientÃƒÂ© mÃƒÂ©tiers techniques et ingÃƒÂ©nierie appliquÃƒÂ©e.",
    highlights: ["Construction", "Topographie", "Chantier"],
    outcomes: ["Conducteur de travaux", "Technicien chantier", "Assistant ingÃƒÂ©nieur"],
    accent: "from-[#f7c300]/20 via-[#f36b21]/20 to-transparent",
  },
  {
    id: 21,
    field: "Tech",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Septembre 2026",
    title: "Licence en CybersÃƒÂ©curitÃƒÂ© et RÃƒÂ©seaux",
    institution: "Ãƒâ€°cole SupÃƒÂ©rieure des MÃƒÂ©tiers du NumÃƒÂ©rique (Gabon)",
    handle: "@esmn_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "870",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Parcours orientÃƒÂ© sÃƒÂ©curitÃƒÂ© des systÃƒÂ¨mes, rÃƒÂ©seaux et pratiques de cybersÃƒÂ©curitÃƒÂ©.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur orientÃƒÂ© mÃƒÂ©tiers du numÃƒÂ©rique au Gabon.",
    highlights: ["CybersÃƒÂ©curitÃƒÂ©", "RÃƒÂ©seaux", "SystÃƒÂ¨mes"],
    outcomes: ["Analyste SOC junior", "Administrateur rÃƒÂ©seau", "Technicien sÃƒÂ©curitÃƒÂ©"],
    accent: "from-pink-400/15 via-orange-300/20 to-transparent",
  },
  {
    id: 22,
    field: "Tech",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Septembre 2026",
    title: "Licence en DÃƒÂ©veloppement Web & Mobile",
    institution: "Ãƒâ€°cole SupÃƒÂ©rieure des MÃƒÂ©tiers du NumÃƒÂ©rique (Gabon)",
    handle: "@esmn_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "910",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Formation appliquÃƒÂ©e en dÃƒÂ©veloppement front-end, back-end et applications mobiles.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur orientÃƒÂ© mÃƒÂ©tiers du numÃƒÂ©rique au Gabon.",
    highlights: ["Web", "Mobile", "Full-stack"],
    outcomes: ["DÃƒÂ©veloppeur web", "DÃƒÂ©veloppeur mobile", "IntÃƒÂ©grateur"],
    accent: "from-[#f7c300]/20 via-[#f36b21]/20 to-transparent",
  },
  {
    id: 23,
    field: "SantÃƒÂ©",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence en SantÃƒÂ© Publique",
    institution: "Institut SupÃƒÂ©rieur de SantÃƒÂ© du Gabon",
    handle: "@iss_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "740",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Parcours axÃƒÂ© prÃƒÂ©vention, ÃƒÂ©pidÃƒÂ©miologie et gestion des programmes de santÃƒÂ©.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur orientÃƒÂ© santÃƒÂ© publique et formation clinique au Gabon.",
    highlights: ["PrÃƒÂ©vention", "Ãƒâ€°pidÃƒÂ©miologie", "SantÃƒÂ© communautaire"],
    outcomes: ["ChargÃƒÂ© de programme", "Superviseur santÃƒÂ©", "Agent de terrain"],
    accent: "from-rose-400/15 via-pink-300/20 to-transparent",
  },
  {
    id: 24,
    field: "SantÃƒÂ©",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence en Sciences InfirmiÃƒÂ¨res",
    institution: "Institut SupÃƒÂ©rieur de SantÃƒÂ© du Gabon",
    handle: "@iss_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "820",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1580281658629-6d1ed0ee5b04?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Formation clinique orientÃƒÂ©e soins infirmiers et pratiques hospitaliÃƒÂ¨res.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur orientÃƒÂ© santÃƒÂ© publique et formation clinique au Gabon.",
    highlights: ["Soins", "Pratique clinique", "Stages"],
    outcomes: ["Infirmier", "Assistant soins", "Coordinateur terrain"],
    accent: "from-pink-400/15 via-rose-300/20 to-transparent",
  },
  {
    id: 25,
    field: "Business",
    degree: "Master",
    duration: "2 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Master en Audit et ContrÃƒÂ´le de Gestion",
    institution: "Ãƒâ€°cole SupÃƒÂ©rieure de Commerce du Gabon",
    handle: "@escg_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "930",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
    summary:
      "SpÃƒÂ©cialisation en audit, contrÃƒÂ´le interne et pilotage de la performance.",
    institutionBio:
      "Ãƒâ€°cole supÃƒÂ©rieure gabonaise orientÃƒÂ©e management, finance et commerce.",
    highlights: ["Audit", "ContrÃƒÂ´le", "Finance"],
    outcomes: ["Auditeur junior", "ContrÃƒÂ´leur de gestion", "Analyste financier"],
    accent: "from-orange-400/15 via-amber-300/20 to-transparent",
  },
  {
    id: 26,
    field: "Business",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Septembre 2026",
    title: "Licence en Entrepreneuriat et Gestion PME",
    institution: "Ãƒâ€°cole SupÃƒÂ©rieure de Commerce du Gabon",
    handle: "@escg_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "790",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Licence orientÃƒÂ©e crÃƒÂ©ation dÃ¢â‚¬â„¢entreprise, gestion opÃƒÂ©rationnelle et financement.",
    institutionBio:
      "Ãƒâ€°cole supÃƒÂ©rieure gabonaise orientÃƒÂ©e management, finance et commerce.",
    highlights: ["Entrepreneuriat", "Gestion", "PME"],
    outcomes: ["Assistant manager", "ChargÃƒÂ© dÃ¢â‚¬â„¢affaires", "Entrepreneur junior"],
    accent: "from-pink-400/15 via-orange-300/20 to-transparent",
  },
  {
    id: 27,
    field: "Tech",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence Informatique, DÃƒÂ©veloppement Web, GÃƒÂ©nie Logiciel et Electronique",
    institution: "Institut Facultaire dÃ¢â‚¬â„¢Informatique et de Management (IFIM)",
    handle: "@ifim_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "640",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Parcours informatique incluant dÃƒÂ©veloppement web, gÃƒÂ©nie logiciel et ÃƒÂ©lectronique.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur gabonais listant des filiÃƒÂ¨res en informatique et management.",
    highlights: ["Informatique", "DÃƒÂ©veloppement web", "GÃƒÂ©nie logiciel"],
    outcomes: ["DÃƒÂ©veloppeur junior", "Technicien logiciel", "Support applicatif"],
    accent: "from-pink-400/15 via-orange-300/20 to-transparent",
  },
  {
    id: 28,
    field: "Tech",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence TÃƒÂ©lÃƒÂ©communications et RÃƒÂ©seaux",
    institution: "Institut Facultaire dÃ¢â‚¬â„¢Informatique et de Management (IFIM)",
    handle: "@ifim_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "610",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
    summary:
      "FiliÃƒÂ¨re orientÃƒÂ©e rÃƒÂ©seaux et tÃƒÂ©lÃƒÂ©communications.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur gabonais listant des filiÃƒÂ¨res en informatique et management.",
    highlights: ["RÃƒÂ©seaux", "TÃƒÂ©lÃƒÂ©coms", "SystÃƒÂ¨mes"],
    outcomes: ["Technicien rÃƒÂ©seaux", "Admin junior", "Support tÃƒÂ©lÃƒÂ©coms"],
    accent: "from-orange-400/15 via-amber-300/20 to-transparent",
  },
  {
    id: 29,
    field: "Business",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence Management des Entreprises et Gestion des Projets",
    institution: "Institut Facultaire dÃ¢â‚¬â„¢Informatique et de Management (IFIM)",
    handle: "@ifim_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "700",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    summary:
      "FiliÃƒÂ¨re en management des entreprises et gestion de projets.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur gabonais listant des filiÃƒÂ¨res en informatique et management.",
    highlights: ["Management", "Gestion de projet", "Organisation"],
    outcomes: ["Assistant manager", "Chef de projet junior", "ChargÃƒÂ© dÃ¢â‚¬â„¢ÃƒÂ©tudes"],
    accent: "from-[#f7c300]/20 via-[#f36b21]/20 to-transparent",
  },
  {
    id: 30,
    field: "Tech",
    degree: "Licence Pro (Bac+3)",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence Pro CybersÃƒÂ©curitÃƒÂ©",
    institution: "Ãƒâ€°cole SupÃƒÂ©rieure dÃ¢â‚¬â„¢IngÃƒÂ©nierie et dÃ¢â‚¬â„¢Innovation Technologique (ESIITECH)",
    handle: "@esiitech_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "820",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Licence informatique orientÃƒÂ©e cyber dÃƒÂ©fense.",
    institutionBio:
      "Ãƒâ€°cole supÃƒÂ©rieure gabonaise proposant des licences et masters informatiques.",
    highlights: ["Cyber dÃƒÂ©fense", "SÃƒÂ©curitÃƒÂ©", "RÃƒÂ©seaux"],
    outcomes: ["Analyste SOC junior", "Technicien sÃƒÂ©curitÃƒÂ©", "Admin systÃƒÂ¨mes"],
    accent: "from-pink-400/15 via-orange-300/20 to-transparent",
  },
  {
    id: 31,
    field: "Tech",
    degree: "Licence Pro (Bac+3)",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence Pro DÃƒÂ©veloppement Web",
    institution: "Ãƒâ€°cole SupÃƒÂ©rieure dÃ¢â‚¬â„¢IngÃƒÂ©nierie et dÃ¢â‚¬â„¢Innovation Technologique (ESIITECH)",
    handle: "@esiitech_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "780",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Licence informatique en dÃƒÂ©veloppement web et mobile.",
    institutionBio:
      "Ãƒâ€°cole supÃƒÂ©rieure gabonaise proposant des licences et masters informatiques.",
    highlights: ["Web", "Mobile", "Full-stack"],
    outcomes: ["DÃƒÂ©veloppeur web", "DÃƒÂ©veloppeur mobile", "IntÃƒÂ©grateur"],
    accent: "from-[#f7c300]/20 via-[#f36b21]/20 to-transparent",
  },
  {
    id: 32,
    field: "Tech",
    degree: "Licence Pro (Bac+3)",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence Pro MonÃƒÂ©tique",
    institution: "Ãƒâ€°cole SupÃƒÂ©rieure dÃ¢â‚¬â„¢IngÃƒÂ©nierie et dÃ¢â‚¬â„¢Innovation Technologique (ESIITECH)",
    handle: "@esiitech_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "860",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Licence professionnelle en monÃƒÂ©tique et services de paiement.",
    institutionBio:
      "Ãƒâ€°cole supÃƒÂ©rieure gabonaise proposant des formations Bac+3 dans les nouvelles technologies.",
    highlights: ["MonÃƒÂ©tique", "Paiements", "SystÃƒÂ¨mes"],
    outcomes: ["Technicien monÃƒÂ©tique", "Support paiement", "OpÃƒÂ©rateur SI"],
    accent: "from-[#f36b21]/20 via-[#f7c300]/20 to-transparent",
  },
  {
    id: 34,
    field: "Tech",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence Ãƒâ€°conomie, Finance, Banques et Assurances",
    institution: "Institut Facultaire dÃ¢â‚¬â„¢Informatique et de Management (IFIM)",
    handle: "@ifim_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "720",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
    summary:
      "FiliÃƒÂ¨re en ÃƒÂ©conomie, finance, banques et assurances.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur gabonais listant des filiÃƒÂ¨res en informatique et management.",
    highlights: ["Finance", "Banque", "Assurance"],
    outcomes: ["Assistant financier", "ChargÃƒÂ© clientÃƒÂ¨le", "Analyste junior"],
    accent: "from-[#f7c300]/20 via-[#f36b21]/20 to-transparent",
  },
  {
    id: 35,
    field: "Business",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence Administration des Entreprises, Ressources Humaines",
    institution: "Institut Facultaire dÃ¢â‚¬â„¢Informatique et de Management (IFIM)",
    handle: "@ifim_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "690",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    summary:
      "FiliÃƒÂ¨re administration des entreprises et ressources humaines.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur gabonais listant des filiÃƒÂ¨res en informatique et management.",
    highlights: ["Administration", "RH", "Organisation"],
    outcomes: ["Assistant RH", "ChargÃƒÂ© administratif", "Gestionnaire junior"],
    accent: "from-pink-400/15 via-orange-300/20 to-transparent",
  },
  {
    id: 36,
    field: "Business",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence Achat, Logistique, Douanes et Transport International",
    institution: "Institut Facultaire dÃ¢â‚¬â„¢Informatique et de Management (IFIM)",
    handle: "@ifim_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "760",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80",
    summary:
      "FiliÃƒÂ¨re achat, logistique, douanes et transport international.",
    institutionBio:
      "Ãƒâ€°tablissement supÃƒÂ©rieur gabonais listant des filiÃƒÂ¨res en informatique et management.",
    highlights: ["Achats", "Logistique", "Transport"],
    outcomes: ["Assistant logistique", "Agent transit", "ChargÃƒÂ© achats"],
    accent: "from-orange-400/15 via-amber-300/20 to-transparent",
  },
  {
    id: 33,
    field: "IngÃƒÂ©nierie",
    degree: "Licence",
    duration: "3 ans",
    intake: "RentrÃƒÂ©e Octobre 2026",
    title: "Licence (FiliÃƒÂ¨res sciences et ingÃƒÂ©nierie)",
    institution: "Institut SupÃƒÂ©rieur dÃ¢â‚¬â„¢IngÃƒÂ©nierie (ISI)",
    handle: "@isi_gabon",
    city: "Libreville, Gabon",
    country: "Gabon",
    tuition: "Frais selon filiÃƒÂ¨re",
    mode: "PrÃƒÂ©sentiel",
    saves: "740",
    contacts: "Admissions en cours",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    summary:
      "FiliÃƒÂ¨res de sciences et ingÃƒÂ©nierie listÃƒÂ©es par lÃ¢â‚¬â„¢ISI: biomÃƒÂ©dical, informatique, ÃƒÂ©lectronique, maintenance, mines, pÃƒÂ©trole & gaz, production.",
    institutionBio:
      "Institut privÃƒÂ© dÃ¢â‚¬â„¢ingÃƒÂ©nierie accrÃƒÂ©ditÃƒÂ© par le ministÃƒÂ¨re de lÃ¢â‚¬â„¢Enseignement supÃƒÂ©rieur gabonais.",
    highlights: ["GÃƒÂ©nie biomÃƒÂ©dical", "GÃƒÂ©nie informatique", "GÃƒÂ©nie ÃƒÂ©lectronique"],
    outcomes: ["Assistant ingÃƒÂ©nieur", "Technicien production", "Support technique"],
    accent: "from-[#f7c300]/20 via-[#f36b21]/20 to-transparent",
  },
];

function FilterPanel({ selectedFilter, setSelectedFilter, open, setOpen }) {
  if (!open) return null;

  return (
    <div className="absolute right-4 top-[72px] z-50 w-[92vw] max-w-[340px] rounded-[28px] border border-[#f3d6dd] bg-white p-4 shadow-2xl shadow-pink-100 lg:right-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Recherche par filiÃƒÂ¨re</div>
          <div className="mt-1 text-xs leading-5 text-slate-500">
            Les filtres restent discrets dans le feed et servent surtout ÃƒÂ  la recherche ciblÃƒÂ©e.
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const active = selectedFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                active ? "bg-slate-900 text-white" : "bg-[#fff0f7] text-slate-700 hover:bg-[#ffeaf5]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AuthModal({ open, onClose, onLogin, onOpenPublish, onOpenAdmin }) {
  const [mode, setMode] = useState("candidate");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/35 backdrop-blur-sm">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-4">
        <div className="grid w-full overflow-hidden rounded-[36px] border border-[#eecde0] bg-white shadow-2xl shadow-pink-100 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden bg-[linear-gradient(160deg,#fff1f5,#eef2ff)] p-8 lg:block">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-700 shadow-sm">
              <School className="h-3.5 w-3.5 text-[#d90b6f]" /> Marketplace dÃ¢â‚¬â„¢enseignement supÃƒÂ©rieur
            </div>
            <h3 className="mt-6 text-3xl font-semibold text-slate-900">Identifier les ÃƒÂ©tablissements. Orienter les ÃƒÂ©tudiants. Simplifier la mise en relation.</h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
              Le feed reste consultable librement. Les ÃƒÂ©tablissements se connectent pour publier, et les usagers peuvent crÃƒÂ©er un compte pour enregistrer, comparer et contacter.
            </p>
          </div>

          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-slate-900">AccÃƒÂ¨s ÃƒÂ  la plateforme</div>
                <div className="mt-1 text-sm text-slate-500">Compte ÃƒÂ©tablissement ou compte usager</div>
              </div>
              <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex gap-2 rounded-full bg-[#fff0f7] p-1">
              <button onClick={() => setMode("candidate")} className={`flex-1 rounded-full px-4 py-2.5 text-sm ${mode === "candidate" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}>
                Usager
              </button>
              <button onClick={() => setMode("institution")} className={`flex-1 rounded-full px-4 py-2.5 text-sm ${mode === "institution" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}>
                Ãƒâ€°tablissement
              </button>
              <button onClick={onOpenAdmin} className="rounded-full px-4 py-2.5 text-sm text-slate-600 hover:bg-white">
                Admin
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <input className="rounded-2xl border border-[#efd1e2] bg-white px-4 py-3 text-sm text-slate-900 outline-none" placeholder="Email" />
              <input className="rounded-2xl border border-[#efd1e2] bg-white px-4 py-3 text-sm text-slate-900 outline-none" placeholder="Mot de passe" type="password" />
              {mode === "institution" && <input className="rounded-2xl border border-[#efd1e2] bg-white px-4 py-3 text-sm text-slate-900 outline-none" placeholder="Nom de lÃ¢â‚¬â„¢ÃƒÂ©tablissement" />}
            </div>

            <div className="mt-6 space-y-3 rounded-[26px] border border-[#d0daf3] bg-[#fff7fb] p-4 text-sm text-slate-600">
              <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#d90b6f]" /> Consultation libre des offres de formation.</div>
              <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#d90b6f]" /> Publication rÃƒÂ©servÃƒÂ©e aux ÃƒÂ©tablissements connectÃƒÂ©s.</div>
              <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#d90b6f]" /> Sauvegarde et prise de contact simplifiÃƒÂ©es pour les usagers.</div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  onLogin(mode);
                  onClose();
                  if (mode === "institution") onOpenPublish();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                {mode === "institution" ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />} Continuer
              </button>
              <button onClick={onClose} className="rounded-2xl border border-[#efd1e2] bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function PublishDrawer({ open, onClose, currentUser }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl rounded-t-[32px] border border-[#eecde0] bg-white p-6 shadow-2xl shadow-pink-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">Publier une offre de formation</div>
            <div className="mt-1 text-sm text-slate-500">RÃƒÂ©servÃƒÂ© aux ÃƒÂ©tablissements identifiÃƒÂ©s</div>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-slate-700">
          Vous publiez en tant que <span className="font-semibold">{currentUser?.name}</span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm text-slate-900 outline-none" placeholder="IntitulÃƒÂ© de la formation" />
          <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm text-slate-900 outline-none" placeholder="Ville / Pays" />
          <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm text-slate-900 outline-none" placeholder="Niveau (Licence, Master...)" />
          <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm text-slate-900 outline-none" placeholder="CoÃƒÂ»t ou fourchette" />
          <textarea className="md:col-span-2 rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm text-slate-900 outline-none" rows={4} placeholder="RÃƒÂ©sumÃƒÂ© de lÃ¢â‚¬â„¢offre" />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-[#efd1e2] bg-white px-5 py-3 text-sm font-semibold text-slate-700">Annuler</button>
          <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Publier</button>
        </div>
      </div>
    </div>
  );
}

function TopBar({ activeTab, searchQuery, setSearchQuery, selectedFilter, setSelectedFilter, filterOpen, setFilterOpen, soundEnabled, soundVolume, onVolumeChange, onToggleSound, onOpenAuth, onPublishRequest, currentUser }) {
  const selectedLabel = filters.find((f) => f.id === selectedFilter)?.label || "Toutes les filiÃƒÂ¨res";

  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-[#f2d7e6] bg-white/90 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 gap-y-2 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-pink-100">
            <img src="/logo-studysia.jpg" alt="Studysia" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-slate-900">{BRAND}</div>
          </div>
        </div>

        {activeTab === "search" ? (
          <div className="hidden min-w-0 flex-1 lg:flex lg:justify-center">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[#efd1e2] bg-white py-3 pl-11 pr-5 text-sm text-slate-900 outline-none"
                placeholder="Rechercher une formation ou un ÃƒÂ©tablissement"
              />
            </div>
          </div>
        ) : (
          <div className="hidden lg:block text-xs uppercase tracking-[0.2em] text-slate-400">
            feed fluide Ã¢â‚¬Â¢ filtre actif : {selectedLabel}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === "feed" && (
            <div className="flex items-center gap-2 rounded-full border border-[#efd1e2] bg-white px-4 py-2 text-sm text-slate-700">
              <button onClick={onToggleSound} className="inline-flex items-center gap-2">
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span className="hidden sm:inline">Son</span>
                <span className="text-xs text-slate-500">{soundEnabled ? "Actif" : "Muet"}</span>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundVolume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-24 accent-slate-900"
                aria-label="Volume"
              />
            </div>
          )}
          <button onClick={() => setFilterOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-full border border-[#efd1e2] bg-white px-4 py-2 text-sm text-slate-700 hover:bg-[#fff2f8]">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtrer</span>
          </button>
          {currentUser?.role === "institution" ? (
            <button onClick={onPublishRequest} className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white lg:inline-flex lg:items-center lg:gap-2">
              <Plus className="h-4 w-4" /> Publier
            </button>
          ) : !currentUser ? (
            <button onClick={onOpenAuth} className="hidden rounded-full border border-[#efd1e2] bg-white px-4 py-2 text-sm text-slate-700 lg:inline-flex lg:items-center lg:gap-2">
              <Lock className="h-4 w-4" /> AccÃƒÂ¨s
            </button>
          ) : null}
          <button onClick={onOpenAuth} className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff0f7] text-slate-700 hover:bg-[#ffe6f3]">
            <User className="h-4 w-4" />
          </button>
        </div>

        <FilterPanel selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} open={filterOpen} setOpen={setFilterOpen} />
      </div>
    </div>
  );
}

function ActionRail({ item }) {
  return (
    <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-4 lg:right-6">
      {[
        [Bookmark, item.saves],
        [MessageCircle, "Contact"],
        [Share2, "Partager"],
      ].map(([Icon, value], index) => (
        <button key={`${item.id}-${index}`} className="flex flex-col items-center gap-2 text-slate-700 transition hover:scale-105">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg shadow-pink-100">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-white drop-shadow-sm lg:text-slate-700">{value}</span>
        </button>
      ))}
    </div>
  );
}

function ProgramSlide({ item, onViewOffer }) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onViewOffer?.(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onViewOffer?.(item);
      }}
      className="relative min-w-full h-full cursor-pointer overflow-hidden bg-white"
    >
      <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className={`absolute inset-0 bg-gradient-to-br ${item.accent}`} />
      <div className="relative flex h-full flex-col justify-center px-3 pb-10 pt-20 sm:px-4 sm:pb-24 sm:pt-24 lg:px-8 lg:pb-12">
        <div className="w-full max-w-none rounded-[26px] border border-white/80 bg-white/85 p-4 shadow-xl shadow-pink-100 backdrop-blur sm:max-w-xl sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#fff2f8] px-3 py-1 text-xs text-slate-700">{item.degree}</span>
            <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs text-slate-700">{item.mode}</span>
            <span className="rounded-full bg-[#fff2f8] px-3 py-1 text-xs text-slate-700">{item.intake}</span>
          </div>
          <h1 className="mt-4 text-xl font-semibold leading-tight text-slate-900 sm:text-2xl lg:text-4xl">{item.title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:leading-7">{item.summary}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#fff7fb] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Ãƒâ€°tablissement</div>
              <div className="mt-2 text-sm font-semibold text-slate-900">{item.institution}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" /> {item.city}</div>
            </div>
            <div className="rounded-2xl bg-[#fff7fb] p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Infos clÃƒÂ©s</div>
              <div className="mt-2 text-sm text-slate-700">{item.duration}</div>
              <div className="mt-1 text-sm text-slate-700">{item.tuition}</div>
            </div>
          </div>
        </div>

      </div>

      <ActionRail item={item} />
    </article>
  );
}
function InstitutionSlide({ item }) {
  return (
    <section className="relative min-w-full h-full overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fff7f9,#fff)]" />
      <div className="relative flex h-full items-end px-3 pb-24 pt-20 sm:px-4 sm:pt-24 lg:px-8 lg:pb-12">
        <div className="grid w-full gap-4 lg:grid-cols-[360px_1fr]">
          <div className="rounded-[30px] border border-[#f2d7e6] bg-white p-6 shadow-lg shadow-pink-100">
            <div className="flex items-start gap-4">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#d90b6f] via-[#f36b21] to-[#f7c300] text-white shadow-md">
                <School className="h-7 w-7" />
              </div>
              <div>
                <div className="text-xl font-semibold text-slate-900">{item.institution}</div>
                <div className="mt-1 text-sm text-slate-500">{item.handle}</div>
                <div className="mt-1 text-sm text-slate-500">{item.city}, {item.country}</div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">{item.institutionBio}</p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                [item.degree, "niveau"],
                [item.duration, "durÃƒÂ©e"],
                [item.mode, "format"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-[#fff7fb] p-3 text-center">
                  <div className="text-sm font-semibold text-slate-900">{value}</div>
                  <div className="mt-1 text-[11px] text-slate-500">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <button className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Contacter</button>
              <button className="flex-1 rounded-2xl border border-[#efd1e2] bg-white px-4 py-3 text-sm font-semibold text-slate-700">Sauvegarder</button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[30px] border border-[#f2d7e6] bg-white p-6 shadow-lg shadow-pink-100">
              <div className="text-lg font-semibold text-slate-900">Points forts</div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {item.highlights.map((h) => (
                  <p key={h}>Ã¢â‚¬Â¢ {h}</p>
                ))}
              </div>
            </div>
            <div className="rounded-[30px] border border-[#f2d7e6] bg-white p-6 shadow-lg shadow-pink-100">
              <div className="text-lg font-semibold text-slate-900">DÃƒÂ©bouchÃƒÂ©s</div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {item.outcomes.map((o) => (
                  <p key={o}>Ã¢â‚¬Â¢ {o}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeedSection({ item, onViewOffer }) {
  return (
    <section className="snap-start">
      <div className="h-[calc(100svh-120px)] sm:h-screen">
        <ProgramSlide item={item} onViewOffer={onViewOffer} />
      </div>
    </section>
  );
}

function SearchScreen({ searchQuery, setSearchQuery, selectedFilter, setSelectedFilter, onViewOffer, programsData }) {
  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return programsData.filter((item) => {
      const matchFilter = selectedFilter === "Tous" || item.field === selectedFilter;
      const haystack = `${item.title} ${item.institution} ${item.city} ${item.summary}`.toLowerCase();
      const matchQuery = !q || haystack.includes(q);
      return matchFilter && matchQuery;
    });
  }, [searchQuery, selectedFilter, programsData]);

  return (
    <div className="min-h-screen bg-white px-4 pb-28 pt-24 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[30px] border border-[#f2d7e6] bg-white p-5 shadow-lg shadow-pink-100 lg:p-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[#efd1e2] bg-white py-3 pl-11 pr-5 text-sm text-slate-900 outline-none"
                placeholder="Rechercher une formation, une ville, un ÃƒÂ©tablissement"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {filters.map((filter) => {
                const Icon = filter.icon;
                const active = selectedFilter === filter.id;
                return (
                  <button key={filter.id} onClick={() => setSelectedFilter(filter.id)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${active ? "bg-slate-900 text-white" : "bg-[#fff0f7] text-slate-700"}`}>
                    <Icon className="h-4 w-4" /> {filter.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {results.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-[24px] border border-[#f2d7e6] bg-white">
                  <div className="relative h-52">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-sm font-semibold text-white">{item.title}</div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-semibold text-slate-900">{item.institution}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.city} Ã¢â‚¬Â¢ {item.degree}</div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-700">{item.tuition}</span>
                      <button
                        onClick={() => onViewOffer?.(item)}
                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[#f2d7e6] bg-white p-5 shadow-lg shadow-pink-100 lg:p-6">
            <div className="text-lg font-semibold text-slate-900">RepÃƒÂ¨res</div>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
              <p>Ã¢â‚¬Â¢ Le feed prÃƒÂ©sente les offres une ÃƒÂ  une, en plein ÃƒÂ©cran.</p>
              <p>Ã¢â‚¬Â¢ La fiche ÃƒÂ©tablissement est affichÃƒÂ©e juste aprÃƒÂ¨s la fiche formation.</p>
              <p>Ã¢â‚¬Â¢ Les filtres de filiÃƒÂ¨res servent ÃƒÂ  la recherche sans encombrer la navigation principale.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OfferDetailScreen({ item, onBack, onOpenInstitution, programsData }) {
  if (!item) {
    return (
      <div className="min-h-screen bg-white px-4 pb-28 pt-24 lg:px-6">
        <div className="mx-auto max-w-3xl rounded-[30px] border border-[#f2d7e6] bg-white p-8 text-center shadow-lg shadow-pink-100">
          <div className="text-xl font-semibold text-slate-900">Aucune offre sÃƒÂ©lectionnÃƒÂ©e</div>
          <button
            onClick={onBack}
            className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const phone = (item.whatsapp || WHATSAPP_FALLBACK).replace(/\D/g, "");
  const message = `Bonjour, je souhaite des informations sur "${item.title}" ÃƒÂ  ${item.institution}.`;
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const admission = item.admission || DEFAULT_ADMISSION;
  const contact = item.contact || DEFAULT_CONTACT;
  const gallery = Array.from(
    new Set([
      item.image,
      ...(item.gallery || []),
      ...programsData.filter((p) => p.institution === item.institution).map((p) => p.image),
    ])
  ).slice(0, 5);
  const related = programsData.filter((p) => p.institution === item.institution && p.id !== item.id);
  const grouped = related.reduce((acc, p) => {
    const key = `${p.degree} Ã¢â‚¬Â¢ ${p.field}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white px-4 pb-28 pt-24 lg:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="overflow-hidden rounded-[30px] border border-[#f2d7e6] bg-white shadow-lg shadow-pink-100">
          <div className="relative h-64">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-sm font-semibold text-white/90">{item.institution}</div>
              <div className="mt-1 text-2xl font-semibold text-white">{item.title}</div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#fff2f8] px-3 py-1 text-xs text-slate-700">{item.degree}</span>
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs text-slate-700">{item.mode}</span>
              <span className="rounded-full bg-[#fff2f8] px-3 py-1 text-xs text-slate-700">{item.intake}</span>
            </div>

            <div className="mt-4 text-sm leading-7 text-slate-600">{item.summary}</div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#fff7fb] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">CoÃƒÂ»t</div>
                <div className="mt-2 text-sm text-slate-700">{item.tuition}</div>
              </div>
              <div className="rounded-2xl bg-[#fff7fb] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Condition dÃ¢â‚¬â„¢admission</div>
                <div className="mt-2 text-sm text-slate-700">{admission}</div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-[#f2d7e6] bg-[#fff9fc] p-5">
                <div className="text-sm font-semibold text-slate-900">DÃƒÂ©bouchÃƒÂ©s</div>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  {item.outcomes.map((o) => (
                    <div key={o}>Ã¢â‚¬Â¢ {o}</div>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-[#f2d7e6] bg-[#fff9fc] p-5">
                <div className="text-sm font-semibold text-slate-900">Contact ÃƒÂ©tablissement</div>
                <div className="mt-3 text-sm text-slate-600">{contact}</div>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                >
                  Contacter
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={onOpenInstitution}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                >
                  Etablissement
                </button>
              <button
                onClick={onBack}
                className="rounded-2xl border border-[#efd1e2] bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InstitutionDetailScreen({ item, onBack, onViewOffer, programsData }) {
  if (!item) return null;
  const contact = item.contact || DEFAULT_CONTACT;
  const gallery = Array.from(
    new Set([
      item.image,
      ...(item.gallery || []),
      ...programsData.filter((p) => p.institution === item.institution).map((p) => p.image),
    ])
  ).slice(0, 5);
  const related = programsData.filter((p) => p.institution === item.institution);
  const grouped = related.reduce((acc, p) => {
    const key = `${p.degree} Ã¢â‚¬Â¢ ${p.field}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white px-4 pb-28 pt-24 lg:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[30px] border border-[#f2d7e6] bg-white shadow-lg shadow-pink-100">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[24px] bg-white ring-1 ring-[#f2d7e6]">
                <img src={item.logo || GENERIC_LOGO} alt={`${item.institution} logo`} className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="text-xl font-semibold text-slate-900">{item.institution}</div>
                <div className="mt-1 text-sm text-slate-500">{item.city}, {item.country}</div>
                <div className="mt-1 text-sm text-slate-500">{contact}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-[24px] border border-[#f2d7e6] bg-[#fff9fc] p-5">
                <div className="text-sm font-semibold text-slate-900">Adresse</div>
                <div className="mt-2 text-sm text-slate-600">{item.address || `${item.city}, ${item.country}`}</div>
              </div>
              <div className="rounded-[24px] border border-[#f2d7e6] bg-[#fff9fc] p-5">
                <div className="text-sm font-semibold text-slate-900">Contact WhatsApp</div>
                <div className="mt-2 text-sm text-slate-600">{item.whatsapp || WHATSAPP_FALLBACK}</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-900">Galerie</div>
              <div className="mt-3 overflow-x-auto">
                <div className="flex gap-3">
                  {gallery.map((src, idx) => (
                    <div
                      key={`${src}-${idx}`}
                      className="min-w-[70%] sm:min-w-[45%] lg:min-w-[28%] overflow-hidden rounded-2xl ring-1 ring-[#f2d7e6]"
                    >
                      <img
                        src={src}
                        alt={`${item.institution} ${idx + 1}`}
                        className="h-36 w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {gallery.map((_, idx) => (
                  <span
                    key={`dot-${idx}`}
                    className={`h-1.5 rounded-full ${idx === 0 ? "w-6 bg-slate-900" : "w-2 bg-slate-300"}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#f2d7e6] bg-[#fff9fc] p-5">
              <div className="text-sm font-semibold text-slate-900">Autres formations</div>
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                {Object.entries(grouped).map(([group, list]) => (
                  <div key={group}>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{group}</div>
                    <div className="mt-1">
                      {list.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => onViewOffer?.(p)}
                          className="block text-left text-slate-700 hover:text-slate-900"
                        >
                          Ã¢â‚¬Â¢ {p.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={onBack}
                className="rounded-2xl border border-[#efd1e2] bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminScreen({ apiUrl, token, onLogin, programsSample }) {
  const [email, setEmail] = useState("admin@studysia.com");
  const [password, setPassword] = useState("Admin123!");
  const [status, setStatus] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [programsList, setProgramsList] = useState([]);
  const [editingInstitutionId, setEditingInstitutionId] = useState(null);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    handle: "",
    city: "",
    country: "Gabon",
    address: "",
    contact: "",
    whatsapp: "",
    logo_url: "",
  });
  const [programForm, setProgramForm] = useState({
    institution_id: "",
    field: "",
    degree: "",
    duration: "",
    intake: "",
    title: "",
    summary: "",
    tuition: "",
    mode: "",
    admission: "",
    highlights: "",
    outcomes: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const loadInstitutions = async () => {
    if (!apiUrl) return;
    const res = await fetch(`${apiUrl}/api/institutions`);
    const data = await res.json();
    setInstitutions(data);
  };

  const loadPrograms = async () => {
    if (!apiUrl) return;
    const res = await fetch(`${apiUrl}/api/programs`);
    const data = await res.json();
    setProgramsList(data);
  };

  React.useEffect(() => {
    if (token) {
      loadInstitutions();
      loadPrograms();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!apiUrl) return setStatus("API_URL manquante");
    setStatus("Connexion...");
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      onLogin(data.token);
      setStatus("ConnectÃƒÂ©");
    } else {
      setStatus(data.error || "Erreur de connexion");
    }
  };

  const createInstitution = async () => {
    const name = form.name.trim();
    const city = form.city.trim();
    const country = form.country.trim();
    if (!name || !city || !country) {
      setStatus("Ville, pays et nom sont obligatoires pour lÃ¢â‚¬â„¢ÃƒÂ©tablissement.");
      return;
    }
    setStatus("CrÃƒÂ©ation ÃƒÂ©tablissement...");
    const res = await fetch(`${apiUrl}/api/institutions${editingInstitutionId ? `/${editingInstitutionId}` : ""}`, {
      method: editingInstitutionId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, name, city, country }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(editingInstitutionId ? "Ãƒâ€°tablissement mis ÃƒÂ  jour" : "Ãƒâ€°tablissement crÃƒÂ©ÃƒÂ©");
      setEditingInstitutionId(null);
      setForm({ ...form, name: "", handle: "", address: "", contact: "", whatsapp: "", logo_url: "" });
      await loadInstitutions();
      if (!programForm.institution_id && data.id) setProgramForm({ ...programForm, institution_id: data.id });
    } else {
      setStatus(data.error || "Erreur");
    }
  };

  const deleteInstitution = async (id) => {
    if (!confirm("Supprimer cet ÃƒÂ©tablissement ?")) return;
    const res = await fetch(`${apiUrl}/api/institutions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStatus(res.ok ? "Ãƒâ€°tablissement supprimÃƒÂ©" : data.error || "Erreur");
    await loadInstitutions();
  };

  const createProgram = async () => {
    const admission = programForm.admission.trim();
    if (!admission) {
      setStatus("La condition dÃ¢â‚¬â„¢accÃƒÂ¨s est obligatoire pour la formation.");
      return;
    }
    setStatus("CrÃƒÂ©ation formation...");
    const payload = {
      ...programForm,
      admission,
      highlights: programForm.highlights.split(",").map((s) => s.trim()).filter(Boolean),
      outcomes: programForm.outcomes.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const res = await fetch(`${apiUrl}/api/programs${editingProgramId ? `/${editingProgramId}` : ""}`, {
      method: editingProgramId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(editingProgramId ? "Formation mise ÃƒÂ  jour" : "Formation crÃƒÂ©ÃƒÂ©e");
      setEditingProgramId(null);
      setProgramForm({ ...programForm, title: "", summary: "", highlights: "", outcomes: "", image_url: "" });
      await loadPrograms();
    } else {
      setStatus(data.error || "Erreur");
    }
  };

  const deleteProgram = async (id) => {
    if (!confirm("Supprimer cette formation ?")) return;
    const res = await fetch(`${apiUrl}/api/programs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStatus(res.ok ? "Formation supprimÃƒÂ©e" : data.error || "Erreur");
  };

  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${apiUrl}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();
    setUploading(false);
    if (res.ok) {
      setProgramForm({ ...programForm, image_url: `${apiUrl}${data.url}` });
      setStatus("Image uploadÃƒÂ©e");
    } else {
      setStatus(data.error || "Erreur upload");
    }
  };

  const uploadGallery = async () => {
    if (!galleryFiles.length) return;
    setGalleryUploading(true);
    for (const file of galleryFiles) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        const instId = programForm.institution_id;
        if (instId) {
          await fetch(`${apiUrl}/api/institutions/${instId}/gallery`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ image_url: `${apiUrl}${data.url}` }),
          });
        }
      }
    }
    setGalleryUploading(false);
    setGalleryFiles([]);
    setStatus("Galerie mise ÃƒÂ  jour");
  };

  const editInstitution = (inst) => {
    setEditingInstitutionId(inst.id);
    setForm({
      name: inst.name || "",
      handle: inst.handle || "",
      city: inst.city || "",
      country: inst.country || "Gabon",
      address: inst.address || "",
      contact: inst.contact || "",
      whatsapp: inst.whatsapp || "",
      logo_url: inst.logo_url || "",
    });
  };

  const editProgram = (p) => {
    setEditingProgramId(p.id);
    setProgramForm({
      institution_id: p.institution_id || "",
      field: p.field || "",
      degree: p.degree || "",
      duration: p.duration || "",
      intake: p.intake || "",
      title: p.title || "",
      summary: p.summary || "",
      tuition: p.tuition || "",
      mode: p.mode || "",
      admission: p.admission || "",
      highlights: (() => {
        try { return (p.highlights ? JSON.parse(p.highlights) : []).join(", "); } catch { return ""; }
      })(),
      outcomes: (() => {
        try { return (p.outcomes ? JSON.parse(p.outcomes) : []).join(", "); } catch { return ""; }
      })(),
      image_url: p.image_url || "",
    });
  };

  const exportCSV = () => {
    const instMap = new Map(institutions.map((i) => [i.id, i]));
    const headers = [
      "institution","field","degree","duration","intake","title","summary","tuition","mode","admission",
      "highlights","outcomes","image_url","city","country","address","contact","whatsapp","handle","logo_url",
    ];
    const rows = programsList.map((p) => {
      const i = instMap.get(p.institution_id) || {};
      return [
        i.name || "",
        p.field || "",
        p.degree || "",
        p.duration || "",
        p.intake || "",
        p.title || "",
        p.summary || "",
        p.tuition || "",
        p.mode || "",
        p.admission || "",
        p.highlights || "",
        p.outcomes || "",
        p.image_url || "",
        i.city || "",
        i.country || "",
        i.address || "",
        i.contact || "",
        i.whatsapp || "",
        i.handle || "",
        i.logo_url || "",
      ].map((v) => String(v).replace(/\r?\n/g, " "));
    });
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "studysia_programs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = async (file) => {
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return;
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((l) => l.split(","));
    const instCache = new Map(institutions.map((i) => [i.name, i]));
    for (const row of rows) {
      const data = Object.fromEntries(headers.map((h, idx) => [h, row[idx] || ""]));
      const instName = data.institution || "Sans nom";
      let inst = instCache.get(instName);
      if (!inst) {
        const res = await fetch(`${apiUrl}/api/institutions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: instName,
            handle: data.handle,
            city: data.city,
            country: data.country,
            address: data.address,
            contact: data.contact,
            whatsapp: data.whatsapp,
            logo_url: data.logo_url,
          }),
        });
        const created = await res.json();
        if (res.ok) {
          inst = { id: created.id, name: instName };
          instCache.set(instName, inst);
        }
      }
      if (!inst?.id) continue;
      await fetch(`${apiUrl}/api/programs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          institution_id: inst.id,
          field: data.field,
          degree: data.degree,
          duration: data.duration,
          intake: data.intake,
          title: data.title,
          summary: data.summary,
          tuition: data.tuition,
          mode: data.mode,
          admission: data.admission,
          highlights: (data.highlights || "").split(";").map((s) => s.trim()).filter(Boolean),
          outcomes: (data.outcomes || "").split(";").map((s) => s.trim()).filter(Boolean),
          image_url: data.image_url,
        }),
      });
    }
    setStatus("Import CSV terminÃƒÂ©");
    await loadInstitutions();
    await loadPrograms();
  };

  const seedSample = async () => {
    if (!apiUrl) return;
    setStatus("Seed en cours...");
    // group by institution name
    const instMap = new Map();
    programsSample.forEach((p) => {
      if (!instMap.has(p.institution)) {
        instMap.set(p.institution, {
          name: p.institution,
          handle: p.handle,
          city: p.city,
          country: p.country,
          address: p.city ? `${p.city}, ${p.country}` : "",
          contact: p.contact || DEFAULT_CONTACT,
          whatsapp: p.whatsapp || WHATSAPP_FALLBACK,
          logo_url: p.logo || "",
        });
      }
    });
    // create institutions
    const instIds = new Map();
    for (const inst of instMap.values()) {
      const res = await fetch(`${apiUrl}/api/institutions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(inst),
      });
      const data = await res.json();
      if (res.ok) instIds.set(inst.name, data.id);
    }
    // create programs
    for (const p of programsSample) {
      const institution_id = instIds.get(p.institution);
      if (!institution_id) continue;
      await fetch(`${apiUrl}/api/programs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          institution_id,
          field: p.field,
          degree: p.degree,
          duration: p.duration,
          intake: p.intake,
          title: p.title,
          summary: p.summary,
          tuition: p.tuition,
          mode: p.mode,
          admission: p.admission || DEFAULT_ADMISSION,
          highlights: p.highlights,
          outcomes: p.outcomes,
          image_url: p.image,
        }),
      });
    }
    setStatus("Seed terminÃƒÂ©");
    await loadInstitutions();
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-white px-4 pb-28 pt-24 lg:px-6">
        <form onSubmit={handleLogin} className="mx-auto max-w-md rounded-[30px] border border-[#f2d7e6] bg-white p-6 shadow-lg shadow-pink-100">
          <div className="text-lg font-semibold text-slate-900">Admin - Connexion</div>
          <div className="mt-4 grid gap-3">
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" type="password" />
          </div>
          <button className="mt-4 w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Se connecter</button>
          {status && <div className="mt-3 text-sm text-slate-600">{status}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pb-28 pt-24 lg:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[30px] border border-[#f2d7e6] bg-white p-6 shadow-lg shadow-pink-100">
          <div className="text-lg font-semibold text-slate-900">Admin - DonnÃƒÂ©es</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={seedSample} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Seed donnÃƒÂ©es dÃƒÂ©mo</button>
            <button onClick={exportCSV} className="rounded-2xl border border-[#efd1e2] px-4 py-2 text-sm">Exporter CSV</button>
            <label className="rounded-2xl border border-[#efd1e2] px-4 py-2 text-sm">
              Importer CSV
              <input type="file" className="hidden" accept=".csv" onChange={(e) => importCSV(e.target.files?.[0])} />
            </label>
            {status && <div className="text-sm text-slate-600">{status}</div>}
          </div>
          <div className="mt-4 text-sm text-slate-600">Institutions existantes: {institutions.length}</div>
        </div>

        <div className="rounded-[30px] border border-[#f2d7e6] bg-white p-6 shadow-lg shadow-pink-100">
          <div className="text-lg font-semibold text-slate-900">CrÃƒÂ©er un ÃƒÂ©tablissement</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Handle" value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Ville *" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Pays *" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="WhatsApp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Logo URL" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
          </div>
          <button onClick={createInstitution} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">CrÃƒÂ©er</button>
          <div className="mt-5 space-y-2">
            {institutions.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-2xl border border-[#f2d7e6] bg-[#fff9fc] px-4 py-3 text-sm">
                <div>{i.name}</div>
                <div className="flex items-center gap-3">
                  <button onClick={() => editInstitution(i)} className="text-slate-600 hover:text-slate-900">Ãƒâ€°diter</button>
                  <button onClick={() => deleteInstitution(i.id)} className="text-slate-600 hover:text-slate-900">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[#f2d7e6] bg-white p-6 shadow-lg shadow-pink-100">
          <div className="text-lg font-semibold text-slate-900">CrÃƒÂ©er une formation</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <select className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" value={programForm.institution_id} onChange={(e) => setProgramForm({ ...programForm, institution_id: e.target.value })}>
              <option value="">Ãƒâ€°tablissement</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="FiliÃƒÂ¨re" value={programForm.field} onChange={(e) => setProgramForm({ ...programForm, field: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Niveau" value={programForm.degree} onChange={(e) => setProgramForm({ ...programForm, degree: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="DurÃƒÂ©e" value={programForm.duration} onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="RentrÃƒÂ©e" value={programForm.intake} onChange={(e) => setProgramForm({ ...programForm, intake: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="IntitulÃƒÂ©" value={programForm.title} onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="CoÃƒÂ»t" value={programForm.tuition} onChange={(e) => setProgramForm({ ...programForm, tuition: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Mode" value={programForm.mode} onChange={(e) => setProgramForm({ ...programForm, mode: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Condition dÃ¢â‚¬â„¢accÃƒÂ¨s *" value={programForm.admission} onChange={(e) => setProgramForm({ ...programForm, admission: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Points forts (comma)" value={programForm.highlights} onChange={(e) => setProgramForm({ ...programForm, highlights: e.target.value })} />
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="DÃƒÂ©bouchÃƒÂ©s (comma)" value={programForm.outcomes} onChange={(e) => setProgramForm({ ...programForm, outcomes: e.target.value })} />
          </div>
          <textarea className="mt-3 w-full rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Description" rows={3} value={programForm.summary} onChange={(e) => setProgramForm({ ...programForm, summary: e.target.value })} />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input className="rounded-2xl border border-[#efd1e2] px-4 py-3 text-sm" placeholder="Image URL" value={programForm.image_url} onChange={(e) => setProgramForm({ ...programForm, image_url: e.target.value })} />
            <label className="rounded-2xl border border-[#efd1e2] px-4 py-2 text-sm">
              Upload image
              <input type="file" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} />
            </label>
            {uploading && <span className="text-sm text-slate-500">Upload...</span>}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="rounded-2xl border border-[#efd1e2] px-4 py-2 text-sm">
              Galerie (max 5)
              <input type="file" className="hidden" multiple onChange={(e) => setGalleryFiles(Array.from(e.target.files || []).slice(0, 5))} />
            </label>
            <button onClick={uploadGallery} className="rounded-2xl border border-[#efd1e2] px-4 py-2 text-sm">
              Upload galerie
            </button>
            {galleryUploading && <span className="text-sm text-slate-500">Upload...</span>}
          </div>
          <button onClick={createProgram} className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">CrÃƒÂ©er</button>
          <div className="mt-5 space-y-2">
            {programsList.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-2xl border border-[#f2d7e6] bg-[#fff9fc] px-4 py-3 text-sm">
                <div>{p.title}</div>
                <div className="flex items-center gap-3">
                  <button onClick={() => editProgram(p)} className="text-slate-600 hover:text-slate-900">Ãƒâ€°diter</button>
                  <button onClick={() => deleteProgram(p.id)} className="text-slate-600 hover:text-slate-900">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InboxScreen({ currentUser, onOpenAuth }) {
  const messages = [
    ["UniversitÃƒÂ© Horizon", "Votre demande dÃ¢â‚¬â„¢informations a bien ÃƒÂ©tÃƒÂ© reÃƒÂ§ue."],
    ["Institut Tech Afrique", "Une brochure dÃƒÂ©taillÃƒÂ©e est disponible pour ce programme."],
    ["Campus SantÃƒÂ© Dakar", "Les admissions sont encore ouvertes pour la session de septembre."],
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white px-4 pb-28 pt-24 lg:px-6">
        <div className="mx-auto max-w-3xl rounded-[30px] border border-[#f2d7e6] bg-white p-8 text-center shadow-lg shadow-pink-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#fff0f7] text-slate-700">
            <Lock className="h-7 w-7" />
          </div>
          <div className="mt-5 text-2xl font-semibold text-slate-900">Messagerie rÃƒÂ©servÃƒÂ©e aux comptes</div>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600">Connectez-vous pour ÃƒÂ©changer avec les ÃƒÂ©tablissements et suivre vos demandes.</p>
          <button onClick={onOpenAuth} className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Se connecter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pb-28 pt-24 lg:px-6">
      <div className="mx-auto max-w-4xl rounded-[30px] border border-[#f2d7e6] bg-white p-5 shadow-lg shadow-pink-100 lg:p-6">
        <div className="text-xl font-semibold text-slate-900">Messagerie</div>
        <div className="mt-4 space-y-3">
          {messages.map(([title, message]) => (
            <div key={title} className="rounded-[22px] border border-[#f2d7e6] bg-[#fff9fc] p-4">
              <div className="text-sm font-semibold text-slate-900">{title}</div>
              <div className="mt-2 text-sm text-slate-600">{message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ currentUser, onOpenAuth, onPublishRequest, programsData }) {
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white px-4 pb-28 pt-24 lg:px-6">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-[#f2d7e6] bg-white p-6 shadow-lg shadow-pink-100 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#fff0f7] px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-600">
                <Lock className="h-3.5 w-3.5" /> Compte usager ou ÃƒÂ©tablissement
              </div>
              <div className="mt-5 text-3xl font-semibold text-slate-900">Un compte permet dÃ¢â‚¬â„¢aller plus loin.</div>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">CrÃƒÂ©er un compte pour sauvegarder, contacter, comparer ou publier si vous ÃƒÂªtes un ÃƒÂ©tablissement.</p>
              <button onClick={onOpenAuth} className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">CrÃƒÂ©er ou connecter un compte</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Candidat", "Sauvegarder et contacter"],
                ["Ãƒâ€°tablissement", "Publier ses offres"],
                ["Recherche", "Explorer les formations"],
                ["Messagerie", "Suivre ses ÃƒÂ©changes"],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[24px] border border-[#f2d7e6] bg-[#fff9fc] p-5">
                  <div className="text-base font-semibold text-slate-900">{title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pb-28 pt-24 lg:px-6">
      <div className="mx-auto max-w-6xl grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="rounded-[30px] border border-[#f2d7e6] bg-white p-6 shadow-lg shadow-pink-100">
          <div className="flex items-center gap-4">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#d90b6f] via-[#f36b21] to-[#f7c300] text-3xl font-bold text-white">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="text-xl font-semibold text-slate-900">{currentUser.name}</div>
              <div className="mt-1 text-sm text-slate-500">{currentUser.handle} Ã¢â‚¬Â¢ {currentUser.city}</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              [currentUser.role === "institution" ? "12" : "8", currentUser.role === "institution" ? "offres" : "sauvegardes"],
              ["24", "contacts"],
              ["5", "suivis"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-[#fff7fb] p-3 text-center">
                <div className="text-base font-semibold text-slate-900">{value}</div>
                <div className="mt-1 text-[11px] text-slate-500">{label}</div>
              </div>
            ))}
          </div>
          {currentUser.role === "institution" && <button onClick={onPublishRequest} className="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Publier une offre</button>}
        </div>

        <div className="rounded-[30px] border border-[#f2d7e6] bg-white p-6 shadow-lg shadow-pink-100">
          <div className="text-lg font-semibold text-slate-900">AperÃƒÂ§u</div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {programsData.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-[24px] border border-[#f2d7e6] bg-[#fff9fc] p-4">
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                <div className="mt-2 text-xs text-slate-500">{item.institution} Ã¢â‚¬Â¢ {item.degree}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ activeTab, setActiveTab, onPublishRequest, currentUser, onOpenAuth }) {
  const items = [
    ["feed", GraduationCap, "Feed"],
    ["search", Search, "Recherche"],
    ["publish", Plus, currentUser?.role === "institution" ? "Publier" : "AccÃƒÂ¨s"],
    ["inbox", Send, "Messages"],
    ["profile", User, "Profil"],
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#f2d7e6] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto grid max-w-3xl grid-cols-5 px-2 py-2">
        {items.map(([key, Icon, label]) => (
          <button
            key={key}
            onClick={() => {
              if (key === "publish") {
                currentUser?.role === "institution" ? onPublishRequest() : onOpenAuth();
              } else {
                setActiveTab(key);
              }
            }}
            className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 ${activeTab === key ? "bg-[#fff0f7] text-slate-900" : "text-slate-500 hover:bg-[#fff7fb] hover:text-slate-900"}`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[11px]">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AfrikArtsMarketplacePrototype() {
  const [activeTab, setActiveTab] = useState("feed");
  const [lastTab, setLastTab] = useState("feed");
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem("studysia_admin_token") || "");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.35);
  const [programsData, setProgramsData] = useState(programs);
  const audioRef = React.useRef(null);
  const selectedTrack = useMemo(() => {
    if (!AUDIO_TRACKS.length) return null;
    const index = Math.floor(Math.random() * AUDIO_TRACKS.length);
    return AUDIO_TRACKS[index];
  }, []);

  const filteredPrograms = useMemo(() => {
    if (selectedFilter === "Tous") return programsData;
    return programsData.filter((item) => item.field === selectedFilter);
  }, [selectedFilter, programsData]);

  const handleLogin = (roleMode) => {
    setCurrentUser({
      name: roleMode === "institution" ? "UniversitÃƒÂ© DÃƒÂ©mo Afrique" : "Usager DÃƒÂ©mo",
      handle: roleMode === "institution" ? "@univdemo" : "@candidatdemo",
      city: "Libreville, Gabon",
      role: roleMode,
    });
  };

  const handlePublishRequest = () => {
    if (currentUser?.role !== "institution") {
      setAuthOpen(true);
      return;
    }
    setPublishOpen(true);
  };

  const startSound = async () => {
    if (!selectedTrack) return;
    if (!audioRef.current) {
      const audio = new Audio(selectedTrack);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = soundVolume;
      audioRef.current = audio;
    }
    audioRef.current.volume = soundVolume;
    try {
      await audioRef.current.play();
    } catch {
      // Autoplay might be blocked until user interaction; toggle is user-initiated.
    }
  };

  const stopSound = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleToggleSound = async () => {
    if (soundEnabled) {
      setSoundEnabled(false);
      stopSound();
      return;
    }
    setSoundEnabled(true);
    await startSound();
  };

  React.useEffect(() => {
    const saved = localStorage.getItem("studysia_sound_enabled");
    const savedVolume = localStorage.getItem("studysia_sound_volume");
    if (savedVolume) {
      const parsed = Number(savedVolume);
      if (!Number.isNaN(parsed)) setSoundVolume(Math.min(1, Math.max(0, parsed)));
    }
    if (saved === "true") {
      setSoundEnabled(true);
      startSound();
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("studysia_sound_enabled", soundEnabled ? "true" : "false");
    if (!soundEnabled) {
      stopSound();
    }
  }, [soundEnabled]);

  React.useEffect(() => {
    localStorage.setItem("studysia_sound_volume", String(soundVolume));
    if (audioRef.current) {
      audioRef.current.volume = soundVolume;
    }
  }, [soundVolume]);

  const handleViewOffer = (item) => {
    setLastTab(activeTab);
    setSelectedOffer(item);
    setActiveTab("offer");
    setFilterOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminLogin = (token) => {
    setAdminToken(token);
    localStorage.setItem("studysia_admin_token", token);
    setActiveTab("admin");
  };

  const handleOpenInstitution = (item) => {
    setSelectedInstitution(item);
    setActiveTab("institution");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  React.useEffect(() => {
    if (!API_URL) return;
    const load = async () => {
      try {
        const [instRes, progRes] = await Promise.all([
          fetch(`${API_URL}/api/institutions`),
          fetch(`${API_URL}/api/programs`),
        ]);
        const inst = await instRes.json();
        const prog = await progRes.json();
        const instMap = new Map(inst.map((i) => [i.id, i]));
        const mapped = prog.map((p) => {
          const i = instMap.get(p.institution_id) || {};
          let highlights = [];
          let outcomes = [];
          try {
            highlights = p.highlights ? JSON.parse(p.highlights) : [];
          } catch {
            highlights = [];
          }
          try {
            outcomes = p.outcomes ? JSON.parse(p.outcomes) : [];
          } catch {
            outcomes = [];
          }
          return {
            id: p.id,
            field: p.field,
            degree: p.degree,
            duration: p.duration,
            intake: p.intake,
            title: p.title,
            institution: i.name,
            handle: i.handle,
            city: i.city,
            country: i.country,
            tuition: p.tuition,
            mode: p.mode,
            saves: "0",
            contacts: p.admission || i.contact,
            image: p.image_url,
            summary: p.summary,
            institutionBio: i.address || "",
            highlights,
            outcomes,
            accent: "from-[#d90b6f]/20 via-[#f36b21]/20 to-transparent",
            whatsapp: i.whatsapp,
            contact: i.contact,
            logo: i.logo_url,
            address: i.address,
            gallery: [],
          };
        });
        if (mapped.length) setProgramsData(mapped);
      } catch {
        // fallback to local data
      }
    };
    load();
  }, []);

  return (
    <div className="bg-white text-slate-900">
      <TopBar
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        soundEnabled={soundEnabled}
        soundVolume={soundVolume}
        onVolumeChange={setSoundVolume}
        onToggleSound={handleToggleSound}
        onOpenAuth={() => setAuthOpen(true)}
        onPublishRequest={handlePublishRequest}
        currentUser={currentUser}
      />

      {activeTab === "feed" && (
        <main className="h-[calc(100svh-120px)] overflow-y-auto snap-y snap-mandatory scroll-smooth sm:h-screen">
          {filteredPrograms.map((item) => (
            <FeedSection key={item.id} item={item} onViewOffer={handleViewOffer} />
          ))}
        </main>
      )}

      {activeTab === "search" && (
        <SearchScreen
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          onViewOffer={handleViewOffer}
          programsData={programsData}
        />
      )}

      {activeTab === "offer" && (
        <OfferDetailScreen
          item={selectedOffer}
          onBack={() => setActiveTab(lastTab)}
          onOpenInstitution={() => handleOpenInstitution(selectedOffer)}
          programsData={programsData}
        />
      )}
      {activeTab === "institution" && (
        <InstitutionDetailScreen
          item={selectedInstitution}
          onBack={() => setActiveTab("offer")}
          onViewOffer={handleViewOffer}
          programsData={programsData}
        />
      )}
      {activeTab === "admin" && (
        <AdminScreen apiUrl={API_URL} token={adminToken} onLogin={handleAdminLogin} programsSample={programs} />
      )}

      {activeTab === "inbox" && <InboxScreen currentUser={currentUser} onOpenAuth={() => setAuthOpen(true)} />}
      {activeTab === "profile" && (
        <ProfileScreen
          currentUser={currentUser}
          onOpenAuth={() => setAuthOpen(true)}
          onPublishRequest={handlePublishRequest}
          programsData={programsData}
        />
      )}

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPublishRequest={handlePublishRequest}
        currentUser={currentUser}
        onOpenAuth={() => setAuthOpen(true)}
      />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={handleLogin}
        onOpenPublish={() => setPublishOpen(true)}
        onOpenAdmin={() => {
          setAuthOpen(false);
          setActiveTab("admin");
        }}
      />
      <PublishDrawer open={publishOpen} onClose={() => setPublishOpen(false)} currentUser={currentUser} />
    </div>
  );
}

