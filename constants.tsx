
import { Child } from './types';
import React from 'react';

export const COLORS = {
  primary: '#4F46E5', // Indigo
  secondary: '#FB923C', // Soft Orange
  teal: '#2DD4BF', // Teal
};

export const MOCK_CHILDREN: Child[] = [
  { id: '1', name: 'Liam Smith', age: '2y 4m', section: 'Toddlers A', avatar: 'https://picsum.photos/seed/liam/200' },
  { id: '2', name: 'Emma Johnson', age: '1y 8m', section: 'Infants B', avatar: 'https://picsum.photos/seed/emma/200' },
  { id: '3', name: 'Noah Williams', age: '3y 1m', section: 'Preschool C', avatar: 'https://picsum.photos/seed/noah/200' },
  { id: '4', name: 'Olivia Brown', age: '2y 11m', section: 'Toddlers A', avatar: 'https://picsum.photos/seed/olivia/200' },
];

export const APP_LOGO = (
  <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-2xl shadow-lg mb-4">
    <span className="text-4xl font-black text-white">K</span>
    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-400 rounded-full border-2 border-white animate-pulse"></div>
  </div>
);
