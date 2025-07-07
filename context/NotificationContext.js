import { useDispatch, useSelector } from 'react-redux';

// Hooks JS (corrigé pour JS, pas TS)
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

// Hooks personnalisés pour les fonctionnalités communes
export const useOffers = () => {
  const dispatch = useAppDispatch();
  const offers = useAppSelector(state => state.offers);
  
  return {
    ...offers,
    dispatch,
  };
};

export const useApplications = () => {
  const dispatch = useAppDispatch();
  const applications = useAppSelector(state => state.applications);
  
  return {
    ...applications,
    dispatch,
  };
};

export const useJournal = () => {
  const dispatch = useAppDispatch();
  const journal = useAppSelector(state => state.journal);
  
  return {
    ...journal,
    dispatch,
  };
};

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notifications);
  
  return {
    ...notifications,
    dispatch,
  };
};

export const useUI = () => {
  const dispatch = useAppDispatch();
  const ui = useAppSelector(state => state.ui);
  
  return {
    ...ui,
    dispatch,
  };
};