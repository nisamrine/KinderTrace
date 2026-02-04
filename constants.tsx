
import { Child } from './types';
import React from 'react';

export const COLORS = {
  primary: '#4F46E5', // Indigo
  secondary: '#FB923C', // Soft Orange
  teal: '#2DD4BF', // Teal
};

export const MOCK_CHILDREN: Child[] = [
  { 
    id: '001', 
    name: 'Rita Fora', 
    age: 'Baby', 
    section: 'Baby', 
    avatar: 'data/media/001_rita_fora_portrait.jpg',
    visualDescription: 'A cute black baby girl with voluminous afro hair, wearing a white t-shirt, smiling broadly.'
  },
  { 
    id: '002', 
    name: 'Liam Rey', 
    age: 'Toddler', 
    section: 'Middle', 
    avatar: 'data/media/002_liam_rey_portrait.jpg',
    visualDescription: 'A caucasian toddler boy with messy blonde hair and green eyes, wearing a striped black and white shirt and a dark bandana bib.'
  },
  { 
    id: '003', 
    name: 'Iyad Mimi', 
    age: 'Toddler', 
    section: 'Middle', 
    avatar: 'data/media/003_iyad_mimi_portrait.jpg',
    visualDescription: 'A toddler boy with short light brown hair and brown eyes, wearing a blue sleeveless top, looking calm.'
  },
];

export const APP_LOGO = (
  <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-2xl shadow-lg mb-4">
    <span className="text-4xl font-black text-white">K</span>
    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-400 rounded-full border-2 border-white animate-pulse"></div>
  </div>
);
