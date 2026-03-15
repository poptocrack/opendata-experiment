'use client';

import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';

const definitions: Record<string, string> = {
  LTV: 'Lifetime Value , Revenu total genere par un client sur toute sa duree de vie',
  CAC: "Cout d'Acquisition Client , Ce que ca coute pour obtenir un nouveau client payant",
  'LTV/CAC': "Ratio entre la valeur vie client et le cout d'acquisition. Au-dessus de 3x = sain",
  MRR: 'Monthly Recurring Revenue , Revenu mensuel recurrent',
  ARR: 'Annual Recurring Revenue , Revenu annuel recurrent (MRR × 12)',
  TAM: 'Total Addressable Market , Marche total theorique si on avait 100% de part de marche',
  SAM: "Serviceable Addressable Market , Part du marche total qu'on peut realistement cibler",
  SOM: "Serviceable Obtainable Market , Part du marche qu'on peut capturer a court terme (18 mois)",
  MVP: "Minimum Viable Product , Version minimale du produit pour valider l'hypothese avec de vrais utilisateurs",
  DPE: "Diagnostic de Performance Energetique , Note de A a G sur la consommation energetique d'un logement",
  DVF: 'Demandes de Valeurs Foncieres , Base de donnees de toutes les transactions immobilieres en France',
  SIRENE:
    'Systeme Informatique pour le Repertoire des ENtreprises et des Etablissements , La base de toutes les entreprises francaises',
  BODACC:
    "Bulletin Officiel des Annonces Civiles et Commerciales , Creations, modifications, liquidations d'entreprises",
  DECP: 'Donnees Essentielles de la Commande Publique , Tous les marches publics attribues',
  RNA: 'Repertoire National des Associations , Toutes les associations loi 1901 en France',
  FINESS: 'Fichier National des Etablissements Sanitaires et Sociaux',
  BPE: "Base Permanente des Equipements , Tous les equipements d'une commune (ecoles, medecins, sport...)",
  QPV: 'Quartier Prioritaire de la politique de la Ville , Zones urbaines en difficulte',
  IRVE: 'Infrastructure de Recharge pour Vehicules Electriques',
  BAN: 'Base Adresse Nationale , Referentiel de toutes les adresses francaises',
  BASOL:
    'Base des Anciens Sites Industriels et des Sols Pollues , Inventaire des sites et sols pollues (ou potentiellement) gere par le ministere de la Transition ecologique',
  BDNB: 'Base de Donnees Nationale des Batiments , Donnees enrichies sur chaque batiment de France',
  ROME: 'Repertoire Operationnel des Metiers et des Emplois , Referentiel de France Travail',
  BMO: "Besoins en Main d'Oeuvre , Enquete annuelle de France Travail sur les difficultes de recrutement",
  RGAA: "Referentiel General d'Amerioration de l'Accessibilite , Referentiel d'accessibilite numerique pour les services publics (WCAG en France)",
  RGPD: 'Reglement General sur la Protection des Donnees , Reglementation europeenne sur les donnees personnelles',
  CSRD: 'Corporate Sustainability Reporting Directive , Directive europeenne de reporting ESG',
  BEGES:
    'Bilan des Emissions de Gaz a Effet de Serre , Obligation de reporting carbone pour les entreprises',
  GES: 'Gaz a Effet de Serre',
  SEO: 'Search Engine Optimization , Optimisation pour les moteurs de recherche (trafic gratuit Google)',
  CFE: 'Cotisation Fonciere des Entreprises , Impot local paye par les entreprises',
  TLV: 'Taxe sur les Logements Vacants , Zones ou les logements vides sont taxes',
  PLU: "Plan Local d'Urbanisme , Regles de construction et d'usage des sols par commune",
  ICPE: "Installation Classee pour la Protection de l'Environnement , Sites industriels reglementes",
  RGE: "Reconnu Garant de l'Environnement , Label obligatoire pour les artisans du batiment qui font de la renovation energetique",
  ARS: 'Agence Regionale de Sante',
  SaaS: "Software as a Service , Logiciel vendu sous forme d'abonnement mensuel",
  B2B: 'Business to Business , Vente aux entreprises',
  B2C: 'Business to Consumer , Vente aux particuliers',
  B2B2C:
    'Business to Business to Consumer , Vendre a une entreprise qui revend/integre pour ses propres clients',
  API: 'Application Programming Interface , Interface technique pour echanger des donnees entre systemes',
  NAF: "Nomenclature d'Activites Francaise , Code identifiant le secteur d'activite d'une entreprise",
  CEE: "Certificat d'Economie d'Energie , Mecanisme d'aide a la renovation energetique finance par les energeticiens",
  RPLS: 'Repertoire des logements locatifs des bailleurs sociaux',
  GTFS: 'General Transit Feed Specification , Format standard pour les donnees de transport en commun',
  EHPAD: "Etablissement d'Hebergement pour Personnes Agees Dependantes",
  MDPH: 'Maison Departementale des Personnes Handicapees , Guichet unique pour les droits et aides liees au handicap',
  AAH: 'Allocation aux Adultes Handicapes , Aide financiere versee aux personnes en situation de handicap',
  PCH: 'Prestation de Compensation du Handicap , Aide financiere pour aménager le logement, acheter du materiel, etc.',
  RQTH: 'Reconnaissance de la Qualite de Travailleur Handicape , Statut ouvrant des droits en emploi (obligations employeur, aménagements)',
  CAF: "Caisse d'Allocations Familiales , Verse les aides sociales (allocations, APL, RSA, etc.)",
  AEEH: "Allocation d'Education de l'Enfant Handicape , Aide financiere pour les frais lies au handicap d'un enfant",
  ESAT: "Etablissement ou Service d'Aide par le Travail , Structure d'emploi adapte pour personnes en situation de handicap",
  MAS: "Maison d'Accueil Specialisee , Hebergement pour adultes handicapes dependants avec soins medicaux",
  FAM: "Foyer d'Accueil Medicalise , Hebergement pour adultes handicapes avec besoin d'aide medicale et vie sociale",
  SAVS: "Service d'Accompagnement a la Vie Sociale , Aide a l'insertion sociale (logement, demarches) pour adultes handicapes",
  SAMSAH:
    "Service d'Accompagnement Medico-Social pour Adultes Handicapes , Accompagnement global (sante, social, insertion)",
  ANAS: 'Association Nationale des Assistants de Service Social , Represente les assistants de service social et le travail social',
  CCAS: "Centre Communal d'Action Sociale , Structure communale qui attribue aides sociales et action sociale de proximite",
  APF: 'APF France handicap , Association representant les personnes en situation de handicap et leurs proches (ex Association des Paralyses de France)',
  UNAFAM:
    'Union nationale des amis et familles de personnes malades et/ou handicapees psychiques , Soutien aux proches',
  DYS: 'Troubles DYS , Dyslexie, dyspraxie, dysphasie, dyscalculie, etc. Troubles cognitifs specifiques des apprentissages',
  UNAPEI:
    'Union nationale des associations de parents de personnes handicapees intellectuelles et de leurs amis , Representation et defense des droits'
};

/** Clés des acronymes reconnus, triées par longueur décroissante pour le matching (ex. LTV/CAC avant LTV). */
export const ACRONYM_KEYS = (Object.keys(definitions) as string[]).sort(
  (a, b) => b.length - a.length
);

export function Acronym({ children }: { children: string }) {
  const text = children.trim();
  const definition = definitions[text];

  const triggerRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      left: rect.left + rect.width / 2,
      top: rect.top - 8
    });
  }, []);

  const show = useCallback(() => {
    updatePosition();
    setVisible(true);
  }, [updatePosition]);

  const hide = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (!visible) return;
    const onScrollOrResize = () => updatePosition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [visible, updatePosition]);

  if (!definition) {
    return <span>{text}</span>;
  }

  return (
    <>
      <span
        ref={triggerRef}
        className="relative inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        <span className="border-b border-dotted border-muted-foreground/50 cursor-help">
          {text}
        </span>
      </span>
      {mounted &&
        createPortal(
          <span
            role="tooltip"
            className="pointer-events-none fixed z-[9999] w-64 whitespace-normal rounded-md border border-border bg-popover px-3 py-2 text-left text-xs text-popover-foreground shadow-lg transition-opacity duration-150"
            style={{
              left: coords.left,
              top: coords.top,
              transform: 'translate(-50%, -100%)',
              opacity: visible ? 1 : 0,
            }}
          >
            {definition}
            <span
              className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-border"
              aria-hidden
            />
          </span>,
          document.body
        )}
    </>
  );
}
