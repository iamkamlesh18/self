export const SAMYAMA_PREPARATION_EVENT = "samyama-preparation-change";

const STORAGE_KEY = "come-home-samyama-preparation-session";
const PREPARATION_WINDOW_MS = 60 * 60 * 1000;
const EMPTY_PREPARATION = { breathing: false, sitting: false, readyUntil: 0 };

function notifyPreparationChange() {
  window.dispatchEvent(new Event(SAMYAMA_PREPARATION_EVENT));
}

export function readSamyamaPreparation(now = Date.now()) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    const preparation = {
      breathing: saved.breathing === true,
      sitting: saved.sitting === true,
      readyUntil: Number.isFinite(saved.readyUntil) ? saved.readyUntil : 0
    };

    if (preparation.readyUntil && now >= preparation.readyUntil) {
      sessionStorage.removeItem(STORAGE_KEY);
      return { ...EMPTY_PREPARATION };
    }

    return preparation;
  } catch (error) {
    console.warn("Could not read Samyama preparation from session storage.", error);
    return { ...EMPTY_PREPARATION };
  }
}

export function recordSamyamaPreparation(practice) {
  if (practice !== "breathing" && practice !== "sitting") return readSamyamaPreparation();

  const current = readSamyamaPreparation();
  if (practice === "sitting" && !current.breathing) return current;

  const preparation = { ...current, [practice]: true };
  preparation.readyUntil = preparation.breathing && preparation.sitting
    ? Date.now() + PREPARATION_WINDOW_MS
    : 0;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(preparation));
  } catch (error) {
    console.warn("Could not save Samyama preparation to session storage.", error);
  }

  notifyPreparationChange();
  return preparation;
}

export function clearSamyamaPreparation() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Could not clear Samyama preparation from session storage.", error);
  }

  notifyPreparationChange();
}
