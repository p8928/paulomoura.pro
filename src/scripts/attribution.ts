const STORAGE_KEY = 'moura:campaign-attribution:v1';
const CONSENT_CATEGORY = 'campaign';
const RETENTION_DAYS = 90;
const MAX_VALUE_LENGTH = 500;

const campaignParameters = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

type ConsentState = {
  version?: string;
  accepted?: string[];
  updatedAt?: string;
};

export type AttributionTouch = {
  capturedAt: string;
  landingPath: string;
  referrer?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

export type AttributionRecord = {
  version: 1;
  visitorId: string;
  firstTouch: AttributionTouch;
  lastTouch: AttributionTouch;
  expiresAt: string;
};

declare global {
  interface Window {
    mouraCookieConsent?: ConsentState;
  }
}

let initialized = false;

const safeValue = (value: string | null) => {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, MAX_VALUE_LENGTH) : undefined;
};

const sanitizedReferrer = () => {
  if (!document.referrer) return undefined;

  try {
    const url = new URL(document.referrer);
    return (url.origin + url.pathname).slice(0, MAX_VALUE_LENGTH);
  } catch {
    return undefined;
  }
};

const captureTouch = (): AttributionTouch => {
  const url = new URL(window.location.href);
  const touch: AttributionTouch = {
    capturedAt: new Date().toISOString(),
    landingPath: url.pathname.slice(0, MAX_VALUE_LENGTH),
    referrer: sanitizedReferrer(),
  };

  for (const parameter of campaignParameters) {
    const value = safeValue(url.searchParams.get(parameter));
    if (value) touch[parameter] = value;
  }

  return touch;
};

const hasCampaignConsent = (consent = window.mouraCookieConsent) =>
  Array.isArray(consent?.accepted) && consent.accepted.includes(CONSENT_CATEGORY);

const hasCampaignSignal = (touch: AttributionTouch) =>
  campaignParameters.some((parameter) => Boolean(touch[parameter]));

const hasExternalReferrer = (touch: AttributionTouch) => {
  if (!touch.referrer) return false;

  try {
    return new URL(touch.referrer).hostname !== window.location.hostname;
  } catch {
    return false;
  }
};

const expiresAt = () => {
  const date = new Date();
  date.setDate(date.getDate() + RETENTION_DAYS);
  return date.toISOString();
};

export const createApplicationId = () => crypto.randomUUID();

export const readAttribution = (): AttributionRecord | null => {
  if (typeof window === 'undefined' || !hasCampaignConsent()) return null;

  try {
    const record = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as AttributionRecord | null;
    if (!record || record.version !== 1 || !record.visitorId || !record.firstTouch) return null;

    if (Date.parse(record.expiresAt) <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return record;
  } catch {
    return null;
  }
};

const clearAttribution = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const persistTouch = (touch: AttributionTouch) => {
  const existing = readAttribution();
  const refreshLastTouch = !existing || hasCampaignSignal(touch) || hasExternalReferrer(touch);
  const record: AttributionRecord = {
    version: 1,
    visitorId: existing?.visitorId || crypto.randomUUID(),
    firstTouch: existing?.firstTouch || touch,
    lastTouch: refreshLastTouch ? touch : existing.lastTouch,
    expiresAt: expiresAt(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  window.dispatchEvent(new CustomEvent('moura:attribution', { detail: record }));
  return record;
};

export const initializeAttribution = () => {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  const entryTouch = captureTouch();

  if (hasCampaignConsent()) persistTouch(entryTouch);

  window.addEventListener('moura:consent', (event) => {
    const consent = (event as CustomEvent<ConsentState>).detail;
    if (hasCampaignConsent(consent)) {
      persistTouch(entryTouch);
      return;
    }

    clearAttribution();
  });
};

export const attributionStorageKey = STORAGE_KEY;
