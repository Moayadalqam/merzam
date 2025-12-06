import { useReducer, useEffect, useCallback } from 'react';
import { services } from '../data/services';

const STORAGE_KEY = 'woodLocationForm';

const initialState = {
  // Personal Details
  name: '',
  phone: '',
  email: '',
  area: '',

  // Project
  projectScope: '',
  urgency: '',

  // Services (keyed by service id)
  services: {},

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

    case 'SET_SERVICE':
      return {
        ...state,
        services: {
          ...state.services,
          [action.serviceId]: action.value,
        },
      };

    case 'SET_SERVICE_OPTION':
      return {
        ...state,
        services: {
          ...state.services,
          [action.serviceId]: {
            ...state.services[action.serviceId],
            [action.optionId]: action.value,
          },
        },
      };

    case 'TOGGLE_SERVICE':
      const currentService = state.services[action.serviceId];
      if (currentService?.selected) {
        // Deselect - remove service
        const { [action.serviceId]: _, ...rest } = state.services;
        return { ...state, services: rest };
      } else {
        // Select - add service with selected flag
        return {
          ...state,
          services: {
            ...state.services,
            [action.serviceId]: { selected: true },
          },
        };
      }

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
        name: state.name,
        phone: state.phone,
        email: state.email,
        area: state.area,
        projectScope: state.projectScope,
        urgency: state.urgency,
        services: state.services,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [state]);

  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const toggleService = useCallback((serviceId) => {
    dispatch({ type: 'TOGGLE_SERVICE', serviceId });
  }, []);

  const setServiceOption = useCallback((serviceId, optionId, value) => {
    dispatch({ type: 'SET_SERVICE_OPTION', serviceId, optionId, value });
  }, []);

  const validate = useCallback(() => {
    const errors = {};

    if (!state.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!state.phone.trim()) {
      errors.phone = 'Phone is required';
    } else {
      const digits = state.phone.replace(/\D/g, '');
      if (digits.length < 6) {
        errors.phone = 'Phone must have at least 6 digits';
      }
    }

    if (!state.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(state.email)) {
        errors.email = 'Invalid email format';
      }
    }

    if (!state.area) {
      errors.area = 'Area is required';
    }

    dispatch({ type: 'SET_ERRORS', errors });
    return Object.keys(errors).length === 0;
  }, [state.name, state.phone, state.email, state.area]);

  const formatServicesForEmail = useCallback(() => {
    const selectedServices = Object.entries(state.services)
      .filter(([_, data]) => data?.selected)
      .map(([serviceId, data]) => {
        const service = services.find((s) => s.id === serviceId);
        if (!service) return null;

        let details = service.nameEn;
        const options = [];

        // Collect selected options
        Object.entries(data).forEach(([key, value]) => {
          if (key === 'selected' || key === 'sqm') return;
          if (value) {
            options.push(`${key}: ${value}`);
          }
        });

        if (data.sqm) {
          options.push(`Area: ${data.sqm} sqm`);
        }

        if (options.length > 0) {
          details += ` (${options.join(', ')})`;
        }

        return details;
      })
      .filter(Boolean);

    return selectedServices.join('\n') || 'No services selected';
  }, [state.services]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET' });
    clearSavedFormData();
  }, []);

  return {
    state,
    setField,
    toggleService,
    setServiceOption,
    validate,
    resetForm,
    formatServicesForEmail,
  };
}

function clearSavedFormData() {
  localStorage.removeItem(STORAGE_KEY);
}
