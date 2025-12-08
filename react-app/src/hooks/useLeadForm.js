import { useReducer, useEffect, useCallback } from 'react';
import { scopeItems } from '../data/services';

const STORAGE_KEY = 'woodLocationForm';

const initialState = {
  // Contact Details
  firstName: '',
  secondName: '',
  phone: '',
  city: '',

  // Design Requirements
  archDesign: '',
  archDesignAutocad: false,
  interiorDesign: '',

  // Scope (keyed by scope item id)
  scopeItems: {},

  // Site Visit
  visitDate: '',
  visitTimeSlot: '',

  // Project Assessment
  projectPriority: '',
  projectValue: '',

  // Form State
  isSubmitting: false,
  isSubmitted: false,
  errors: {},
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: null },
      };

    case 'TOGGLE_SCOPE_ITEM':
      return {
        ...state,
        scopeItems: {
          ...state.scopeItems,
          [action.itemId]: !state.scopeItems[action.itemId],
        },
      };

    case 'SET_ERRORS':
      return { ...state, errors: action.errors };

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.value };

    case 'SET_SUBMITTED':
      return { ...state, isSubmitted: action.value };

    case 'RESET':
      return { ...initialState };

    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.data };

    default:
      return state;
  }
}

function initFromStorage(initial) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return { ...initial, ...data };
    }
  } catch (e) {
    console.error('Error loading form data:', e);
  }
  return initial;
}

export function useLeadForm() {
  const [state, dispatch] = useReducer(formReducer, initialState, initFromStorage);

  // Check for successful submission on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submitted') === 'true') {
      dispatch({ type: 'SET_SUBMITTED', value: true });
      clearSavedFormData();
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Auto-save to localStorage on state change
  useEffect(() => {
    if (!state.isSubmitting && !state.isSubmitted) {
      const dataToSave = {
        firstName: state.firstName,
        secondName: state.secondName,
        phone: state.phone,
        city: state.city,
        archDesign: state.archDesign,
        archDesignAutocad: state.archDesignAutocad,
        interiorDesign: state.interiorDesign,
        scopeItems: state.scopeItems,
        visitDate: state.visitDate,
        visitTimeSlot: state.visitTimeSlot,
        projectPriority: state.projectPriority,
        projectValue: state.projectValue,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [state]);

  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const toggleScopeItem = useCallback((itemId) => {
    dispatch({ type: 'TOGGLE_SCOPE_ITEM', itemId });
  }, []);

  const validate = useCallback(() => {
    const errors = {};

    if (!state.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!state.secondName.trim()) {
      errors.secondName = 'Second name is required';
    }

    if (!state.phone.trim()) {
      errors.phone = 'Phone is required';
    } else {
      const digits = state.phone.replace(/\D/g, '');
      if (digits.length < 6) {
        errors.phone = 'Phone must have at least 6 digits';
      }
    }

    dispatch({ type: 'SET_ERRORS', errors });
    return Object.keys(errors).length === 0;
  }, [state.firstName, state.secondName, state.phone]);

  const formatScopeForEmail = useCallback(() => {
    const selectedItems = Object.entries(state.scopeItems)
      .filter(([, isSelected]) => isSelected)
      .map(([itemId]) => {
        const item = scopeItems.find((s) => s.id === itemId);
        return item ? item.labelEn : itemId;
      })
      .filter(Boolean);

    return selectedItems.join(', ') || 'No items selected';
  }, [state.scopeItems]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET' });
    clearSavedFormData();
  }, []);

  return {
    state,
    dispatch,
    setField,
    toggleScopeItem,
    validate,
    resetForm,
    formatScopeForEmail,
  };
}

function clearSavedFormData() {
  localStorage.removeItem(STORAGE_KEY);
}
