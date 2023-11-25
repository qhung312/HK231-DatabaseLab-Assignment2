import { configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { TypedUseSelectorHook, useDispatch } from 'react-redux';
import sessionReducer from './reducers/sessionReducer';
import addPatientReducer from './reducers/addPatientReducer';
import addInstaceReducer from './reducers/addInstaceReducer';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    addPatient: addPatientReducer,
    addInstance: addInstaceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

type dispatchFunc = () => AppDispatch;
export const useAppDispatch: dispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
