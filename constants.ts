import { Professional, Service, Review } from './types';

export const CATEGORIES = [
  { id: 'hair', name: 'Cabelo', icon: '✂️' },
  { id: 'nails', name: 'Manicure', icon: '💅' },
  { id: 'nail_design', name: 'Design de Unhas', icon: '🎨' },
  { id: 'eyelashes', name: 'Design de Cílios', icon: '👁️' },
  { id: 'makeup', name: 'Maquiagem', icon: '💄' },
  { id: 'massage', name: 'Massagem', icon: '💆‍♀️' },
  { id: 'barber', name: 'Barbearia', icon: '💈' },
  { id: 'skincare', name: 'Estética', icon: '✨' },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'Ana Silva',
    rating: 5,
    comment: 'Adorei o atendimento! Super atenciosa e o resultado ficou incrível.',
    date: '2023-10-15',
    response: 'Obrigada Ana! Foi um prazer te atender.',
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'Carla Dias',
    rating: 4,
    comment: 'Muito bom, mas atrasou um pouquinho.',
    date: '2023-10-10',
  }
];

export const PROFESSIONALS: Professional[] = [
  {
    id: 'p1',
    name: 'Julia Ferreira',
    businessName: 'Studio Julia Beauty',
    role: 'Especialista em Cabelos',
    avatarUrl: 'https://picsum.photos/id/64/200/200',
    coverUrl: 'https://picsum.photos/id/40/800/400',
    rating: 4.8,
    reviewCount: 124,
    location: 'Centro, São Paulo',
    distance: '1.2 km',
    about: 'Especialista em coloração e cortes modernos. Mais de 10 anos de experiência transformando visuais.',
    isOpen: true,
    reviews: MOCK_REVIEWS,
    services: [
      {
        id: 's1',
        name: 'Corte Feminino',
        description: 'Corte, lavagem e finalização.',
        price: 80,
        durationMinutes: 60,
        category: 'hair',
        imageUrl: 'https://picsum.photos/id/102/300/200'
      },
      {
        id: 's2',
        name: 'Mechas',
        description: 'Mechas criativas, inclui tonalização e hidratação.',
        price: 350,
        durationMinutes: 240,
        category: 'hair',
      }
    ]
  },
  {
    id: 'p2',
    name: 'Carlos Barbearia',
    businessName: 'Carlos Barber Shop',
    role: 'Barbeiro',
    avatarUrl: 'https://picsum.photos/id/91/200/200',
    coverUrl: 'https://picsum.photos/id/338/800/400',
    rating: 4.9,
    reviewCount: 89,
    location: 'Vila Madalena, SP',
    distance: '3.5 km',
    about: 'A melhor barbearia da região. Cerveja gelada e corte na régua.',
    isOpen: true,
    reviews: [],
    services: [
      {
        id: 's3',
        name: 'Corte Masculino',
        description: 'Degradê, social ou militar.',
        price: 50,
        durationMinutes: 40,
        category: 'barber',
      },
      {
        id: 's4',
        name: 'Barba',
        description: 'Barba com toalha quente.',
        price: 40,
        durationMinutes: 30,
        category: 'barber',
      }
    ]
  },
  {
    id: 'p3',
    name: 'Mariana Nails',
    businessName: 'Espaço Mari Nails',
    role: 'Nail Designer',
    avatarUrl: 'https://picsum.photos/id/331/200/200',
    coverUrl: 'https://picsum.photos/id/429/800/400',
    rating: 4.7,
    reviewCount: 215,
    location: 'Moema, SP',
    distance: '2.0 km',
    about: 'Especialista em Design de Unhas, alongamento fibra de vidro e nail art.',
    isOpen: false,
    reviews: MOCK_REVIEWS,
    services: [
      {
        id: 's5',
        name: 'Manicure Simples',
        description: 'Cutilagem e esmaltação.',
        price: 35,
        durationMinutes: 45,
        category: 'nails',
      },
      {
        id: 's6',
        name: 'Alongamento Fibra',
        description: 'Aplicação de fibra de vidro.',
        price: 180,
        durationMinutes: 120,
        category: 'nail_design',
      },
      {
        id: 's7',
        name: 'Banho de Gel',
        description: 'Blindagem das unhas naturais.',
        price: 90,
        durationMinutes: 60,
        category: 'nail_design',
      }
    ]
  },
  {
    id: 'p4',
    name: 'Camila Lash',
    businessName: 'Camila Lash Designer',
    role: 'Lash Designer',
    avatarUrl: 'https://picsum.photos/id/342/200/200',
    coverUrl: 'https://picsum.photos/id/250/800/400',
    rating: 4.9,
    reviewCount: 156,
    location: 'Jardins, SP',
    distance: '4.5 km',
    about: 'Realce seu olhar com cílios naturais e elegantes.',
    isOpen: true,
    reviews: [],
    services: [
      {
        id: 's8',
        name: 'Extensão Fio a Fio',
        description: 'Efeito natural e clássico.',
        price: 150,
        durationMinutes: 120,
        category: 'eyelashes',
      },
      {
        id: 's9',
        name: 'Volume Russo',
        description: 'Volume intenso e marcante.',
        price: 200,
        durationMinutes: 150,
        category: 'eyelashes',
      }
    ]
  }
];