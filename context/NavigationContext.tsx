import { createContext, useContext } from 'react';
import { NavigationContextType } from '../types';

export const NavigationContext = createContext<NavigationContextType>({} as any);

export const useNavigation = () => useContext(NavigationContext);