// Define Action Types
export const ACKNOWLEDGE_REQUESTED = "ACKNOWLEDGE_REQUESTED";
export const ACKNOWLEDGE_COMPLETED = "ACKNOWLEDGE_COMPLETED";
export const ACKNOWLEDGE_ERROR = "ACKNOWLEDGE_ERROR";

export const SNOOZE_REQUESTED = "SNOOZE_REQUESTED";
export const SNOOZE_COMPLETED = "SNOOZE_COMPLETED";
export const SNOOZE_ERROR = "SNOOZE_ERROR";

export const TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_REQUESTED = "TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_REQUESTED";
export const TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_COMPLETED = "TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_COMPLETED";

export const RESOLVE_REQUESTED = "RESOLVE_REQUESTED";
export const RESOLVE_COMPLETED = "RESOLVE_COMPLETED";
export const RESOLVE_ERROR = "RESOLVE_ERROR";

export const UPDATE_PRIORITY_REQUESTED = "UPDATE_PRIORITY_REQUESTED";
export const UPDATE_PRIORITY_COMPLETED = "UPDATE_PRIORITY_COMPLETED";
export const UPDATE_PRIORITY_ERROR = "UPDATE_PRIORITY_ERROR";

export const ADD_NOTE_REQUESTED = "ADD_NOTE_REQUESTED";
export const ADD_NOTE_COMPLETED = "ADD_NOTE_COMPLETED";
export const ADD_NOTE_ERROR = "ADD_NOTE_ERROR";

export const TOGGLE_DISPLAY_ADD_NOTE_MODAL_REQUESTED = "TOGGLE_DISPLAY_ADD_NOTE_MODAL_REQUESTED";
export const TOGGLE_DISPLAY_ADD_NOTE_MODAL_COMPLETED = "TOGGLE_DISPLAY_ADD_NOTE_MODAL_COMPLETED";

export const acknowledge = (incidents, displayModal = true) => ({
  type: ACKNOWLEDGE_REQUESTED,
  incidents,
  displayModal
});

export const snooze = (incidents, duration, displayModal = true) => ({
  type: SNOOZE_REQUESTED,
  incidents,
  duration,
  displayModal
});

export const toggleDisplayCustomSnoozeModal = () => ({
  type: TOGGLE_DISPLAY_CUSTOM_SNOOZE_MODAL_REQUESTED
});

export const resolve = (incidents, displayModal = true) => ({
  type: RESOLVE_REQUESTED,
  incidents,
  displayModal
});

export const updatePriority = (incidents, priorityId, displayModal = true) => ({
  type: UPDATE_PRIORITY_REQUESTED,
  incidents,
  priorityId,
  displayModal
});

export const addNote = (incidents, note, displayModal = true) => ({
  type: ADD_NOTE_REQUESTED,
  incidents,
  note,
  displayModal
});

export const toggleDisplayAddNoteModal = () => ({
  type: TOGGLE_DISPLAY_ADD_NOTE_MODAL_REQUESTED
});