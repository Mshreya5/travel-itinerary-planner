const express = require('express');
const TravelPlan = require('../models/TravelPlan');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ─── REAL DESTINATION DATA ───────────────────────────────────────────────────
// Comprehensive destination-specific places, hotels, and experiences

const DESTINATION_DATA = {
  paris: {
    country: 'France',
    description: 'The City of Light, known for art, fashion, and culture',
    hotels: {
      budget: [
        { name: 'Hotel Le Marais', location: 'Le Marais', price: '$80-120', rating: 4.0, amenities: ['Free WiFi', 'Breakfast'] },
        { name: 'Ibis Paris Canal', location: 'Canal St-Martin', price: '$90-130', rating: 4.1, amenities: ['WiFi', 'Bar'] }
      ],
      'mid-range': [
        { name: 'Hotel Le Saint', location: 'Saint-Germain-des-Prés', price: '$150-220', rating: 4.5, amenities: ['WiFi', 'Restaurant', 'Gym'] },
        { name: 'Hotel Montmartre', location: 'Montmartre', price: '$140-200', rating: 4.3, amenities: ['WiFi', 'Breakfast', 'Spa'] }
      ],
      luxury: [
        { name: 'Le Meurice', location: 'Place Vendôme', price: '$450-700', rating: 4.9, amenities: ['Spa', 'Michelin Restaurant', 'Concierge'] },
        { name: 'Four Seasons George V', location: 'Champs-Élysées', price: '$500-800', rating: 4.9, amenities: ['Spa', 'Pool', 'Fine Dining'] }
      ]
    },
    restaurants: [
      { name: 'Le Comptoir du Panthéon', cuisine: 'French', price: '$$', rating: 4.4 },
      { name: 'Café de Flore', cuisine: 'French', price: '$$$', rating: 4.2 },
      { name: 'L\'Ambroisie', cuisine: 'French', price: '$$$$', rating: 4.8 }
    ],
    attractions: [
      { name: 'Eiffel Tower', category: 'landmark', time: '2-3 hrs', cost: '$15-25', description: 'Iconic iron lattice tower with stunning city views' },
      { name: 'Louvre Museum', category: 'museum', time: '3-4 hrs', cost: '$15-20', description: 'World\'s largest art museum housing Mona Lisa' },
      { name: 'Notre-Dame Cathedral', category: 'historic', time: '1-2 hrs', cost: 'Free', description: 'Medieval Catholic cathedral on Île de la Cité' },
      { name: 'Champs-Élysées', category: 'shopping', time: '2-3 hrs', cost: 'Free', description: 'Famous avenue with shops and cafés' },
      { name: 'Montmartre & Sacré-Cœur', category: 'landmark', time: '2-3 hrs', cost: '$8-12', description: 'Bohemian hilltop with stunning basilica views' },
      { name: 'Musée d\'Orsay', category: 'museum', time: '2-3 hrs', cost: '$12-16', description: 'Impressionist art in former railway station' },
      { name: 'Seine River Cruise', category: 'cruise', time: '1-2 hrs', cost: '$15-25', description: 'Scenic boat tour along the Seine' },
      { name: 'Palace of Versailles', category: 'palace', time: '4-5 hrs', cost: '$20-30', description: 'Opulent royal palace with gardens' }
    ]
  },
  tokyo: {
    country: 'Japan',
    description: 'A fascinating blend of ultra-modern and traditional',
    hotels: {
      budget: [
        { name: 'Capsule Hotel An', location: 'Shinjuku', price: '$30-50', rating: 4.0, amenities: ['WiFi', 'Sauna'] },
        { name: 'Sakura Hotel Jimbocho', location: 'Jimbocho', price: '$60-90', rating: 4.2, amenities: ['WiFi', 'Breakfast'] }
      ],
      'mid-range': [
        { name: 'Shinjuku Granbell Hotel', location: 'Shinjuku', price: '$120-180', rating: 4.4, amenities: ['WiFi', 'Restaurant', 'Bar'] },
        { name: 'Mitsui Garden Hotel Ginza', location: 'Ginza', price: '$140-200', rating: 4.5, amenities: ['WiFi', 'Spa', 'Gym'] }
      ],
      luxury: [
        { name: 'Aman Tokyo', location: 'Otemachi', price: '$500-800', rating: 4.9, amenities: ['Spa', 'Pool', 'Fine Dining'] },
        { name: 'The Peninsula Tokyo', location: 'Ginza', price: '$450-700', rating: 4.9, amenities: ['Spa', 'Pool', 'Butler Service'] }
      ]
    },
    restaurants: [
      { name: 'Ichiran Shibuya', cuisine: 'Ramen', price: '$', rating: 4.5 },
      { name: 'Sukiyabashi Jiro', cuisine: 'Sushi', price: '$$$$', rating: 4.9 },
      { name: 'Gonpachi Nishi-Azabu', cuisine: 'Japanese', price: '$$', rating: 4.3 }
    ],
    attractions: [
      { name: 'Senso-ji Temple', category: 'temple', time: '1-2 hrs', cost: 'Free', description: 'Tokyo\'s oldest Buddhist temple in Asakusa' },
      { name: 'Shibuya Crossing', category: 'landmark', time: '1 hr', cost: 'Free', description: 'World\'s busiest pedestrian crossing' },
      { name: 'Tokyo Skytree', category: 'landmark', time: '2-3 hrs', cost: '$15-25', description: '634m broadcasting tower with observation decks' },
      { name: 'Meiji Shrine', category: 'shrine', time: '1-2 hrs', cost: 'Free', description: 'Shinto shrine dedicated to Emperor Meiji' },
      { name: 'Tsukiji Outer Market', category: 'market', time: '2-3 hrs', cost: '$', description: 'Fresh seafood and street food paradise' },
      { name: 'Tokyo Disneyland', category: 'theme park', time: '1 day', cost: '$70-90', description: 'Japan\'s magical theme park' },
      { name: 'Akihabara', category: 'shopping', time: '2-3 hrs', cost: 'Free', description: 'Electronics and anime culture hub' },
      { name: 'Imperial Palace', category: 'historic', time: '2-3 hrs', cost: 'Free', description: 'Emperor\'s residence with gardens' }
    ]
  },
  bali: {
    country: 'Indonesia',
    description: 'Tropical paradise with ancient temples and rice terraces',
    hotels: {
      budget: [
        { name: 'Kuta Beach Hotel', location: 'Kuta', price: '$25-45', rating: 3.8, amenities: ['Pool', 'WiFi'] },
        { name: 'Ubud Tropical Guesthouse', location: 'Ubud', price: '$20-40', rating: 4.0, amenities: ['WiFi', 'Breakfast'] }
      ],
      'mid-range': [
        { name: 'Maya Ubud Resort', location: 'Ubud', price: '$100-150', rating: 4.5, amenities: ['Pool', 'Spa', 'Restaurant'] },
        { name: 'Theanna Resort', location: 'Seminyak', price: '$120-180', rating: 4.6, amenities: ['Pool', 'WiFi', 'Spa'] }
      ],
      luxury: [
        { name: 'Four Seasons Sayan', location: 'Ubud', price: '$400-600', rating: 4.9, amenities: ['Spa', 'Pool', 'River Rafting'] },
        { name: 'COMO Uma Ubud', location: 'Ubud', price: '$350-500', rating: 4.8, amenities: ['Spa', 'Pool', 'Wellness'] }
      ]
    },
    restaurants: [
      { name: 'Warung Babi Guling', cuisine: 'Balinese', price: '$', rating: 4.5 },
      { name: 'Locavore', cuisine: 'Indonesian Fusion', price: '$$$', rating: 4.8 },
      { name: 'Maya Ubud Food', cuisine: 'International', price: '$$', rating: 4.4 }
    ],
    attractions: [
      { name: 'Tegallalang Rice Terraces', category: 'nature', time: '2-3 hrs', cost: '$10-15', description: 'Stunning terraced rice paddies in Ubud' },
      { name: 'Tanah Lot Temple', category: 'temple', time: '1-2 hrs', cost: '$5-10', description: 'Ancient sea temple on rocky outcrop' },
      { name: 'Uluwatu Temple', category: 'temple', time: '2-3 hrs', cost: '$5-10', description: 'Cliffside temple with Kecak dance' },
      { name: 'Sacred Monkey Forest', category: 'nature', time: '2-3 hrs', cost: '$3-5', description: 'Ubud forest with playful monkeys' },
      { name: 'Mount Batur Sunrise', category: 'adventure', time: '4-5 hrs', cost: '$50-80', description: 'Volcano hike with sunrise views' },
      { name: 'Seminyak Beach', category: 'beach', time: '3-4 hrs', cost: 'Free', description: 'Trendy beach with sunset views' },
      { name: 'Tirta Empul Temple', category: 'temple', time: '2-3 hrs', cost: '$5-8', description: 'Holy water spring for purification' },
      { name: 'Campuhan Ridge Walk', category: 'hiking', time: '2-3 hrs', cost: 'Free', description: 'Scenic walk through rice fields' }
    ]
  },
  london: {
    country: 'United Kingdom',
    description: 'Historic royal capital with world-class museums',
    hotels: {
      budget: [
        { name: 'YHA London Central', location: 'Bloomsbury', price: '$40-70', rating: 4.0, amenities: ['WiFi', 'Kitchen'] },
        { name: 'Generator Hostel', location: 'King\'s Cross', price: '$35-60', rating: 4.1, amenities: ['WiFi', 'Bar'] }
      ],
      'mid-range': [
        { name: 'The Hoxton Holborn', location: 'Holborn', price: '$150-220', rating: 4.4, amenities: ['WiFi', 'Restaurant', 'Gym'] },
        { name: 'The Ned', location: 'City of London', price: '$180-280', rating: 4.5, amenities: ['Spa', 'Pool', 'Restaurants'] }
      ],
      luxury: [
        { name: 'The Savoy', location: 'Strand', price: '$450-700', rating: 4.9, amenities: ['Spa', 'Fine Dining', 'Butler'] },
        { name: 'Claridge\'s', location: 'Mayfair', price: '$500-800', rating: 4.9, amenities: ['Spa', 'Restaurant', 'Art Deco'] }
      ]
    },
    restaurants: [
      { name: 'Dishoom', cuisine: 'Indian', price: '$$', rating: 4.6 },
      { name: 'The Ledbury', cuisine: 'British', price: '$$$$', rating: 4.8 },
      { name: 'Borough Market', cuisine: 'Various', price: '$', rating: 4.5 }
    ],
    attractions: [
      { name: 'Tower of London', category: 'historic', time: '3-4 hrs', cost: '$25-35', description: '900-year-old fortress and Crown Jewels' },
      { name: 'British Museum', category: 'museum', time: '3-4 hrs', cost: 'Free', description: 'World\'s largest collection of artifacts' },
      { name: 'Big Ben & Parliament', category: 'landmark', time: '1-2 hrs', cost: 'Free', description: 'Iconic clock tower and Houses of Parliament' },
      { name: 'Buckingham Palace', category: 'palace', time: '2-3 hrs', cost: '$25-35', description: 'Royal residence with Changing the Guard' },
      { name: 'Tower Bridge', category: 'landmark', time: '1-2 hrs', cost: '$10-15', description: 'Victorian suspension bridge with glass floor' },
      { name: 'Westminster Abbey', category: 'historic', time: '1-2 hrs', cost: '$15-20', description: 'Royal wedding and coronation church' },
      { name: 'Hyde Park', category: 'park', time: '2-3 hrs', cost: 'Free', description: 'Central park with Serpentine Lake' },
      { name: 'Harry Potter Studio Tour', category: 'experience', time: '4-5 hrs', cost: '$45-60', description: 'Behind-the-scenes of the films' }
    ]
  },
  'new york': {
    country: 'USA',
    description: 'The city that never sleeps, offering endless entertainment',
    hotels: {
      budget: [
        { name: 'Pod 51', location: 'Midtown East', price: '$80-130', rating: 3.9, amenities: ['WiFi', 'Shared rooms'] },
        { name: 'The Jane Hotel', location: 'West Village', price: '$90-140', rating: 4.0, amenities: ['WiFi', 'Bar'] }
      ],
      'mid-range': [
        { name: 'The Standard East Village', location: 'East Village', price: '$180-280', rating: 4.4, amenities: ['WiFi', 'Rooftop', 'Gym'] },
        { name: 'Arlo SoHo', location: 'SoHo', price: '$160-250', rating: 4.3, amenities: ['WiFi', 'Restaurant', 'Bar'] }
      ],
      luxury: [
        { name: 'The Plaza', location: 'Central Park South', price: '$600-1000', rating: 4.9, amenities: ['Spa', 'Butler', 'Fine Dining'] },
        { name: 'The Mark Hotel', location: 'Upper East Side', price: '$550-900', rating: 4.9, amenities: ['Spa', 'Restaurant', 'Concierge'] }
      ]
    },
    restaurants: [
      { name: 'Katz\'s Delicatessen', cuisine: 'Jewish', price: '$', rating: 4.6 },
      { name: 'Le Bernardin', cuisine: 'French Seafood', price: '$$$$', rating: 4.8 },
      { name: 'Carbone', cuisine: 'Italian', price: '$$$', rating: 4.5 }
    ],
    attractions: [
      { name: 'Statue of Liberty', category: 'landmark', time: '3-4 hrs', cost: '$20-25', description: 'Iconic symbol of freedom and democracy' },
      { name: 'Central Park', category: 'park', time: '3-4 hrs', cost: 'Free', description: '840-acre urban oasis in Manhattan' },
      { name: 'Empire State Building', category: 'landmark', time: '1-2 hrs', cost: '$40-50', description: 'Art Deco skyscraper with observation deck' },
      { name: 'Metropolitan Museum of Art', category: 'museum', time: '4-5 hrs', cost: '$25-30', description: 'One of the world\'s finest art museums' },
      { name: 'Times Square', category: 'landmark', time: '1-2 hrs', cost: 'Free', description: 'Bright lights and Broadway shows' },
      { name: 'Brooklyn Bridge', category: 'landmark', time: '1-2 hrs', cost: 'Free', description: 'Historic bridge with Manhattan views' },
      { name: 'Broadway Show', category: 'entertainment', time: '2-3 hrs', cost: '$50-200', description: 'World-class theatrical performances' },
      { name: 'One World Trade Center', category: 'landmark', time: '2-3 hrs', cost: '$35-45', description: ' tallest building in Western Hemisphere' }
    ]
  },
  rome: {
    country: 'Italy',
    description: 'The Eternal City, a living museum of ancient history',
    hotels: {
      budget: [
        { name: 'Hotel Panda', location: 'Near Termini', price: '$60-90', rating: 4.0, amenities: ['WiFi', 'Breakfast'] },
        { name: 'Hostel 7', location: 'Trastevere', price: '$50-80', rating: 4.1, amenities: ['WiFi', 'Kitchen'] }
      ],
      'mid-range': [
        { name: 'Hotel Navona', location: 'Navona Square', price: '$120-180', rating: 4.4, amenities: ['WiFi', 'Restaurant'] },
        { name: 'Hotel Campo de\' Fiori', location: 'Campo de\' Fiori', price: '$130-190', rating: 4.5, amenities: ['WiFi', 'Terrace'] }
      ],
      luxury: [
        { name: 'Hotel Hassler', location: 'Spanish Steps', price: '$400-600', rating: 4.9, amenities: ['Spa', 'Fine Dining', 'Concierge'] },
        { name: 'Rocco Forte Hotel de la Ville', location: 'Via Veneto', price: '$350-550', rating: 4.8, amenities: ['Spa', 'Pool', 'Restaurant'] }
      ]
    },
    restaurants: [
      { name: 'Da Enzo al 29', cuisine: 'Roman', price: '$$', rating: 4.7 },
      { name: 'Roscioli Salumeria', cuisine: 'Italian', price: '$$$', rating: 4.6 },
      { name: 'Pizzarium', cuisine: 'Pizza', price: '$', rating: 4.5 }
    ],
    attractions: [
      { name: 'Colosseum', category: 'historic', time: '2-3 hrs', cost: '$15-20', description: 'Ancient Roman amphitheater' },
      { name: 'Vatican Museums', category: 'museum', time: '4-5 hrs', cost: '$15-20', description: 'Sistine Chapel and papal collections' },
      { name: 'Trevi Fountain', category: 'landmark', time: '1 hr', cost: 'Free', description: 'Baroque masterpiece throwing coin' },
      { name: 'Roman Forum', category: 'historic', time: '2-3 hrs', cost: '$12-16', description: 'Ancient Roman political center' },
      { name: 'Pantheon', category: 'historic', time: '1 hr', cost: 'Free', description: 'Perfectly preserved Roman temple' },
      { name: 'Spanish Steps', category: 'landmark', time: '1-2 hrs', cost: 'Free', description: '135-step baroque staircase' },
      { name: 'St. Peter\'s Basilica', category: 'religious', time: '1-2 hrs', cost: 'Free', description: 'Renaissance masterpiece in Vatican' },
      { name: 'Trastevere', category: 'neighborhood', time: '2-3 hrs', cost: 'Free', description: 'Charming medieval quarter' }
    ]
  },
  barcelona: {
    country: 'Spain',
    description: 'Gaudi\'s masterpieces meet Mediterranean beaches',
    hotels: {
      budget: [
        { name: 'Kabul Party Hostel', location: 'Las Ramblas', price: '$25-45', rating: 4.0, amenities: ['WiFi', 'Bar'] },
        { name: 'Sant Jordi Hostel', location: 'Gràcia', price: '$30-50', rating: 4.2, amenities: ['WiFi', 'Terrace'] }
      ],
      'mid-range': [
        { name: 'Hotel 1898', location: 'Las Ramblas', price: '$140-200', rating: 4.5, amenities: ['Pool', 'Spa', 'Restaurant'] },
        { name: 'W Barcelona', location: 'Barceloneta', price: '$180-280', rating: 4.6, amenities: ['Pool', 'Spa', 'Beach'] }
      ],
      luxury: [
        { name: 'Mandarin Oriental', location: 'Passeig de Gràcia', price: '$400-600', rating: 4.9, amenities: ['Spa', 'Pool', 'Fine Dining'] },
        { name: 'Hotel Arts Barcelona', location: 'Barceloneta', price: '$350-500', rating: 4.8, amenities: ['Spa', 'Pool', 'Beach'] }
      ]
    },
    restaurants: [
      { name: 'Tickets', cuisine: 'Spanish Tapas', price: '$$$', rating: 4.7 },
      { name: 'La Boqueria', cuisine: 'Market', price: '$', rating: 4.5 },
      { name: 'Can Culleretes', cuisine: 'Catalan', price: '$$', rating: 4.4 }
    ],
    attractions: [
      { name: 'Sagrada Familia', category: 'landmark', time: '2-3 hrs', cost: '$15-25', description: 'Gaudi\'s unfinished masterpiece' },
      { name: 'Park Güell', category: 'park', time: '2-3 hrs', cost: '$10-15', description: 'Gaudi\'s colorful mosaic park' },
      { name: 'La Rambla', category: 'landmark', time: '1-2 hrs', cost: 'Free', description: 'Famous tree-lined pedestrian street' },
      { name: 'Gothic Quarter', category: 'neighborhood', time: '2-3 hrs', cost: 'Free', description: 'Medieval narrow streets and squares' },
      { name: 'Casa Batlló', category: 'landmark', time: '1-2 hrs', cost: '$25-35', description: 'Gaudi\'s modernist facade' },
      { name: 'Barceloneta Beach', category: 'beach', time: '3-4 hrs', cost: 'Free', description: 'Popular urban beach' },
      { name: 'Picasso Museum', category: 'museum', time: '2-3 hrs', cost: '$10-15', description: 'Works from Picasso\'s early years' },
      { name: 'Camp Nou', category: 'stadium', time: '2-3 hrs', cost: '$25-40', description: 'FC Barcelona football stadium' }
    ]
  },
  dubai: {
    country: 'UAE',
    description: 'Futuristic skyscrapers in the desert',
    hotels: {
      budget: [
        { name: 'Rove Downtown', location: 'Downtown', price: '$80-120', rating: 4.3, amenities: ['WiFi', 'Pool'] },
        { name: 'Ibis Dubai Al Barsha', location: 'Al Barsha', price: '$60-100', rating: 4.0, amenities: ['WiFi', 'Gym'] }
      ],
      'mid-range': [
        { name: 'Jumeirah Beach Hotel', location: 'Jumeirah', price: '$200-300', rating: 4.6, amenities: ['Pool', 'Beach', 'Spa'] },
        { name: 'The Ritz-Carlton DIFC', location: 'DIFC', price: '$220-320', rating: 4.7, amenities: ['Spa', 'Pool', 'Restaurant'] }
      ],
      luxury: [
        { name: 'Burj Al Arab', location: 'Jumeirah', price: '$800-1500', rating: 4.9, amenities: ['Private Beach', 'Helipad', 'Butler'] },
        { name: 'Atlantis The Royal', location: 'Palm Jumeirah', price: '$600-1000', rating: 4.9, amenities: ['Spa', 'Pool', 'Beach'] }
      ]
    },
    restaurants: [
      { name: 'Al Mahara', cuisine: 'Seafood', price: '$$$$', rating: 4.7 },
      { name: 'Shake Shack', cuisine: 'Fast Food', price: '$', rating: 4.3 },
      { name: 'Zuma', cuisine: 'Japanese', price: '$$$', rating: 4.6 }
    ],
    attractions: [
      { name: 'Burj Khalifa', category: 'landmark', time: '1-2 hrs', cost: '$40-60', description: 'World\'s tallest building at 828m' },
      { name: 'Dubai Mall', category: 'shopping', time: '3-4 hrs', cost: 'Free', description: 'One of the world\'s largest malls' },
      { name: 'Palm Jumeirah', category: 'landmark', time: '2-3 hrs', cost: 'Free', description: 'Man-made island with resorts' },
      { name: 'Dubai Marina', category: 'neighborhood', time: '2-3 hrs', cost: 'Free', description: 'Modern waterfront district' },
      { name: 'Desert Safari', category: 'adventure', time: '4-5 hrs', cost: '$50-80', description: 'Dune bashing and Bedouin camp' },
      { name: 'Dubai Frame', category: 'landmark', time: '1-2 hrs', cost: '$10-15', description: 'Giant picture frame structure' },
      { name: 'Gold & Diamond Park', category: 'shopping', time: '2-3 hrs', cost: 'Free', description: 'Jewelry shopping destination' },
      { name: 'Dubai Museum', category: 'museum', time: '1-2 hrs', cost: '$3-5', description: 'History in Al Fahidi Fort' }
    ]
  },
  sydney: {
    country: 'Australia',
    description: 'Stunning harbor city with iconic landmarks',
    hotels: {
      budget: [
        { name: 'Sydney Central YHA', location: 'Central Station', price: '$40-70', rating: 4.1, amenities: ['WiFi', 'Kitchen'] },
        { name: 'The Pod Sydney', location: 'Kings Cross', price: '$35-60', rating: 4.0, amenities: ['WiFi'] }
      ],
      'mid-range': [
        { name: 'The Park Hyatt Sydney', location: 'Circular Quay', price: '$250-400', rating: 4.7, amenities: ['Pool', 'Spa', 'Harbor Views'] },
        { name: 'The Little National Sydney', location: 'Darling Harbour', price: '$150-220', rating: 4.4, amenities: ['WiFi', 'Gym'] }
      ],
      luxury: [
        { name: 'Park Hyatt Sydney', location: 'Circular Quay', price: '$400-600', rating: 4.9, amenities: ['Spa', 'Pool', 'Harbor Views'] },
        { name: 'Four Seasons Sydney', location: 'Circular Quay', price: '$350-500', rating: 4.8, amenities: ['Spa', 'Pool', 'Restaurant'] }
      ]
    },
    restaurants: [
      { name: 'Bennelong', cuisine: 'Australian', price: '$$$$', rating: 4.8 },
      { name: 'The Grounds', cuisine: 'Modern Australian', price: '$$', rating: 4.5 },
      { name: 'Icebergs', cuisine: 'Italian', price: '$$$', rating: 4.6 }
    ],
    attractions: [
      { name: 'Sydney Opera House', category: 'landmark', time: '2-3 hrs', cost: '$25-40', description: 'Iconic sail-shaped performing arts center' },
      { name: 'Sydney Harbour Bridge', category: 'landmark', time: '2-3 hrs', cost: '$15-25', description: 'Climb or walk across the coathanger' },
      { name: 'Bondi Beach', category: 'beach', time: '3-4 hrs', cost: 'Free', description: 'Famous surfing beach' },
      { name: 'Taronga Zoo', category: 'zoo', time: '3-4 hrs', cost: '$40-50', description: 'Animals with harbor views' },
      { name: 'The Rocks', category: 'neighborhood', time: '2-3 hrs', cost: 'Free', description: 'Historic waterfront precinct' },
      { name: 'Blue Mountains', category: 'nature', time: '1 day', cost: '$30-50', description: 'Eucalyptus forests and waterfalls' },
      { name: 'Darling Harbour', category: 'entertainment', time: '2-3 hrs', cost: 'Free', description: 'Waterfront dining and attractions' },
      { name: 'Royal Botanic Garden', category: 'park', time: '2-3 hrs', cost: 'Free', description: 'Harbor-side gardens' }
    ]
  },
  bangkok: {
    country: 'Thailand',
    description: 'Vibrant city of temples, street food, and modern malls',
    hotels: {
      budget: [
        { name: 'Nap Hotel', location: 'Sukhumvit', price: '$20-40', rating: 3.9, amenities: ['WiFi', 'Pool'] },
        { name: 'Khaosan Palace Hotel', location: 'Khao San Road', price: '$25-45', rating: 4.0, amenities: ['WiFi', 'Breakfast'] }
      ],
      'mid-range': [
        { name: 'Anantara Riverside', location: 'Riverside', price: '$100-160', rating: 4.5, amenities: ['Pool', 'Spa', 'Restaurant'] },
        { name: 'Siam @ Siam Design Hotel', location: 'Sukhumvit', price: '$80-130', rating: 4.4, amenities: ['Pool', 'WiFi', 'Gym'] }
      ],
      luxury: [
        { name: 'The Peninsula Bangkok', location: 'Riverside', price: '$300-500', rating: 4.9, amenities: ['Spa', 'Pool', 'River Views'] },
        { name: 'Mandarin Oriental', location: 'Riverside', price: '$350-550', rating: 4.9, amenities: ['Spa', 'Pool', 'Fine Dining'] }
      ]
    },
    restaurants: [
      { name: 'Jay Fai', cuisine: 'Thai Street Food', price: '$$$', rating: 4.8 },
      { name: 'Thipsamai', cuisine: 'Thai', price: '$', rating: 4.6 },
      { name: 'Gaggan', cuisine: 'Progressive Indian', price: '$$$$', rating: 4.9 }
    ],
    attractions: [
      { name: 'Grand Palace', category: 'landmark', time: '2-3 hrs', cost: '$15-20', description: 'Stunning royal palace and Wat Phra Kaew' },
      { name: 'Wat Pho', category: 'temple', time: '1-2 hrs', cost: '$5-10', description: 'Reclining Buddha and Thai massage school' },
      { name: 'Chatuchak Weekend Market', category: 'shopping', time: '3-4 hrs', cost: 'Free', description: 'Massive weekend market with 15,000 stalls' },
      { name: 'Khao San Road', category: 'nightlife', time: '2-3 hrs', cost: 'Free', description: 'Backpacker hub with nightlife' },
      { name: 'Wat Arun', category: 'temple', time: '1-2 hrs', cost: '$3-5', description: 'Temple of dawn with porcelain mosaic' },
      { name: 'Jim Thompson House', category: 'museum', time: '1-2 hrs', cost: '$10-15', description: 'Thai silk entrepreneur\'s home' },
      { name: 'Chao Phraya River', category: 'cruise', time: '2-3 hrs', cost: '$15-30', description: 'River boat tours and dinner cruises' },
      { name: 'MBK Center', category: 'shopping', time: '2-3 hrs', cost: 'Free', description: 'Popular electronics and fashion mall' }
    ]
  },
  singapore: {
    country: 'Singapore',
    description: 'Futuristic city-state with diverse cultures',
    hotels: {
      budget: [
        { name: 'Hotel 81 Princess', location: 'Geylang', price: '$50-80', rating: 3.8, amenities: ['WiFi', 'AC'] },
        { name: 'Capsule Hotel', location: 'Chinatown', price: '$30-50', rating: 4.0, amenities: ['WiFi'] }
      ],
      'mid-range': [
        { name: 'Park Hotel Clarke Quay', location: 'Clarke Quay', price: '$150-220', rating: 4.4, amenities: ['Pool', 'WiFi', 'Gym'] },
        { name: 'The Quincy Hotel', location: 'Orchard', price: '$180-260', rating: 4.5, amenities: ['Pool', 'Spa', 'Restaurant'] }
      ],
      luxury: [
        { name: 'Marina Bay Sands', location: 'Marina Bay', price: '$400-600', rating: 4.9, amenities: ['Infinity Pool', 'Casino', 'Spa'] },
        { name: 'Raffles Hotel', location: 'Marina Bay', price: '$500-800', rating: 4.9, amenities: ['Spa', 'Butler', 'Fine Dining'] }
      ]
    },
    restaurants: [
      { name: 'Liao Fan Hong Kong Soya', cuisine: 'Chicken Rice', price: '$', rating: 4.5 },
      { name: 'Burnt Ends', cuisine: 'Australian', price: '$$$', rating: 4.7 },
      { name: 'Odette', cuisine: 'French', price: '$$$$', rating: 4.9 }
    ],
    attractions: [
      { name: 'Marina Bay Sands', category: 'landmark', time: '2-3 hrs', cost: '$25-35', description: 'Iconic hotel with rooftop infinity pool' },
      { name: 'Gardens by the Bay', category: 'park', time: '3-4 hrs', cost: '$20-30', description: 'Supertree grove and cloud forest' },
      { name: 'Sentosa Island', category: 'resort', time: '1 day', cost: '$30-50', description: 'Beach resort with attractions' },
      { name: 'Universal Studios', category: 'theme park', time: '1 day', cost: '$80-100', description: 'Southeast Asia\'s first theme park' },
      { name: 'Chinatown', category: 'neighborhood', time: '2-3 hrs', cost: 'Free', description: 'Historic streets and temples' },
      { name: 'Little India', category: 'neighborhood', time: '2-3 hrs', cost: 'Free', description: 'Colorful Indian culture and food' },
      { name: 'Clarke Quay', category: 'nightlife', time: '2-3 hrs', cost: 'Free', description: 'Riverside dining and nightlife' },
      { name: 'Singapore Zoo', category: 'zoo', time: '4-5 hrs', cost: '$40-50', description: 'World-renowned open-air zoo' }
    ]
  },
  goa: {
    country: 'India',
    description: 'Beach paradise with Portuguese heritage',
    hotels: {
      budget: [
        { name: 'Seashell Beach Resort', location: 'Calangute', price: '$30-60', rating: 3.9, amenities: ['Pool', 'WiFi'] },
        { name: 'Hotel Sunshine', location: 'Baga', price: '$25-50', rating: 3.8, amenities: ['WiFi', 'Restaurant'] }
      ],
      'mid-range': [
        { name: 'Taj Holiday Village', location: 'Candolim', price: '$120-180', rating: 4.5, amenities: ['Pool', 'Beach', 'Spa'] },
        { name: 'Alila Diwa Goa', location: 'Majorda', price: '$140-200', rating: 4.6, amenities: ['Pool', 'Spa', 'Restaurant'] }
      ],
      luxury: [
        { name: 'Taj Exotica', location: 'Benaulim', price: '$250-400', rating: 4.8, amenities: ['Beach', 'Pool', 'Spa'] },
        { name: 'The Leela Goa', location: 'Cavelossim', price: '$200-350', rating: 4.7, amenities: ['Beach', 'Pool', 'Golf'] }
      ]
    },
    restaurants: [
      { name: 'Fisherman\'s Wharf', cuisine: 'Seafood', price: '$$', rating: 4.5 },
      { name: 'Gunpowder', cuisine: 'Goan', price: '$$', rating: 4.6 },
      { name: 'Shore', cuisine: 'Seafood', price: '$$$', rating: 4.4 }
    ],
    attractions: [
      { name: 'Baga Beach', category: 'beach', time: '3-4 hrs', cost: 'Free', description: 'Popular North Goa beach' },
      { name: 'Fort Aguada', category: 'historic', time: '2-3 hrs', cost: '$5-10', description: 'Portuguese fort with lighthouse' },
      { name: 'Basilica of Bom Jesus', category: 'religious', time: '1-2 hrs', cost: 'Free', description: 'UNESCO World Heritage site' },
      { name: 'Dudhsagar Falls', category: 'nature', time: '4-5 hrs', cost: '$5-10', description: 'Majestic four-tiered waterfall' },
      { name: 'Anjuna Flea Market', category: 'shopping', time: '2-3 hrs', cost: 'Free', description: 'Famous Wednesday market' },
      { name: 'Se Cathedral', category: 'religious', time: '1-2 hrs', cost: 'Free', description: 'Largest church in Asia' },
      { name: 'Palolem Beach', category: 'beach', time: '3-4 hrs', cost: 'Free', description: 'Scenic South Goa beach' },
      { name: 'Spice Plantation', category: 'tour', time: '2-3 hrs', cost: '$15-25', description: 'Goan spice farm tour' }
    ]
  },
  kerala: {
    country: 'India',
    description: 'God\'s Own Country with backwaters and Ayurveda',
    hotels: {
      budget: [
        { name: 'Kumarakom Lake Resort', location: 'Kumarakom', price: '$40-70', rating: 4.0, amenities: ['Pool', 'WiFi'] },
        { name: 'Fort Kochi Hotel', location: 'Fort Kochi', price: '$30-60', rating: 4.1, amenities: ['WiFi', 'Restaurant'] }
      ],
      'mid-range': [
        { name: 'Taj Bekal Resort', location: 'Bekal', price: '$120-180', rating: 4.6, amenities: ['Pool', 'Spa', 'Beach'] },
        { name: 'Spice Village', location: 'Thekkady', price: '$100-150', rating: 4.5, amenities: ['Pool', 'Restaurant', 'Nature'] }
      ],
      luxury: [
        { name: 'Taj Malabar Resort', location: 'Kochi', price: '$200-300', rating: 4.7, amenities: ['Pool', 'Spa', 'Heritage'] },
        { name: 'Kumarakom Lake Resort', location: 'Kumarakom', price: '$180-280', rating: 4.6, amenities: ['Pool', 'Spa', 'Backwaters'] }
      ]
    },
    restaurants: [
      { name: 'The Rice Boat', cuisine: 'Kerala', price: '$$$', rating: 4.6 },
      { name: 'Kashi Art Cafe', cuisine: 'Cafe', price: '$$', rating: 4.5 },
      { name: 'Paragon', cuisine: 'Kerala', price: '$', rating: 4.4 }
    ],
    attractions: [
      { name: 'Alappuzha Backwaters', category: 'nature', time: '4-6 hrs', cost: '$30-50', description: 'Famous houseboat cruise in Kerala' },
      { name: 'Munnar Tea Gardens', category: 'nature', time: '3-4 hrs', cost: '$10-20', description: 'Endless tea plantations in the hills' },
      { name: 'Kochi Spice Market', category: 'market', time: '2-3 hrs', cost: 'Free', description: 'Historic spice trading hub' },
      { name: 'Periyar Wildlife Sanctuary', category: 'nature', time: '3-4 hrs', cost: '$10-20', description: 'Tiger and elephant reserve' },
      { name: 'Kovalam Beach', category: 'beach', time: '3-4 hrs', cost: 'Free', description: 'Beautiful South Kerala beach' },
      { name: 'Padmanabhaswamy Temple', category: 'temple', time: '1-2 hrs', cost: 'Free', description: 'Richest temple in the world' },
      { name: 'Wayanad Hills', category: 'nature', time: '3-4 hrs', cost: '$10-20', description: 'Misty mountains and waterfalls' },
      { name: 'Kumarakom Bird Sanctuary', category: 'nature', time: '2-3 hrs', cost: '$5-10', description: 'Migratory bird paradise' }
    ]
  },
  maldives: {
    country: 'Maldives',
    description: 'Crystal clear waters and overwater bungalows',
    hotels: {
      budget: [
        { name: 'Malahini Kuda Bandos', location: 'North Malé Atoll', price: '$100-150', rating: 4.0, amenities: ['Beach', 'WiFi'] },
        { name: 'Crystal Beach Resort', location: 'North Malé Atoll', price: '$120-180', rating: 4.1, amenities: ['Beach', 'Restaurant'] }
      ],
      'mid-range': [
        { name: 'Kurumba Maldives', location: 'North Malé Atoll', price: '$250-400', rating: 4.5, amenities: ['Beach', 'Pool', 'Spa'] },
        { name: 'One & Only Reethi Rah', location: 'North Malé Atoll', price: '$300-500', rating: 4.7, amenities: ['Beach', 'Pool', 'Spa'] }
      ],
      luxury: [
        { name: 'Soneva Fushi', location: 'Baa Atoll', price: '$600-1000', rating: 4.9, amenities: ['Private Beach', 'Spa', 'Diving'] },
        { name: ' Cheval Blanc Randheli', location: 'Noonu Atoll', price: '$800-1500', rating: 4.9, amenities: ['Private Island', 'Spa', 'Butler'] }
      ]
    },
    restaurants: [
      { name: 'Ithaa Restaurant', cuisine: 'Seafood', price: '$$$$', rating: 4.8 },
      { name: 'Sea.Fire.Salt', cuisine: 'Seafood', price: '$$$', rating: 4.7 },
      { name: 'Atoll Market', cuisine: 'International', price: '$$', rating: 4.5 }
    ],
    attractions: [
      { name: 'Snorkeling at Coral Reefs', category: 'water', time: '2-3 hrs', cost: '$30-50', description: 'Colorful marine life and coral gardens' },
      { name: 'Whale Shark Diving', category: 'diving', time: '3-4 hrs', cost: '$80-120', description: 'Swim with gentle whale sharks' },
      { name: 'Sunset Dolphin Cruise', category: 'cruise', time: '2-3 hrs', cost: '$40-60', description: 'Watch dolphins at golden hour' },
      { name: 'Male City Tour', category: 'city', time: '2-3 hrs', cost: '$20-30', description: 'Explore the capital city' },
      { name: 'Sandbank Picnic', category: 'beach', time: '3-4 hrs', cost: '$50-80', description: 'Private sandbank experience' },
      { name: 'Night Fishing', category: 'fishing', time: '3-4 hrs', cost: '$40-60', description: 'Traditional Maldivian fishing' },
      { name: 'Bioluminescent Beach', category: 'nature', time: '1-2 hrs', cost: '$30-50', description: 'Glowing plankton at night' },
      { name: 'Island Hopping', category: 'tour', time: '4-5 hrs', cost: '$50-80', description: 'Visit multiple local islands' }
    ]
  },
  switzerland: {
    country: 'Switzerland',
    description: 'Alpine mountains, chocolate, and precision',
    hotels: {
      budget: [
        { name: 'Youth Hostel Interlaken', location: 'Interlaken', price: '$50-80', rating: 4.1, amenities: ['WiFi', 'Kitchen'] },
        { name: 'City Backpacker', location: 'Zurich', price: '$60-90', rating: 4.0, amenities: ['WiFi', 'Bar'] }
      ],
      'mid-range': [
        { name: 'Hotel Victoria Jungfrau', location: 'Interlaken', price: '$200-300', rating: 4.6, amenities: ['Spa', 'Pool', 'Restaurant'] },
        { name: 'Grand Hotel Bellevue', location: 'Gstaad', price: '$250-350', rating: 4.5, amenities: ['Spa', 'Restaurant', 'Mountain Views'] }
      ],
      luxury: [
        { name: 'The Dolder Grand', location: 'Zurich', price: '$500-800', rating: 4.9, amenities: ['Spa', 'Pool', 'Fine Dining'] },
        { name: 'Palace Hotel Gstaad', location: 'Gstaad', price: '$600-1000', rating: 4.9, amenities: ['Spa', 'Ski', 'Helipad'] }
      ]
    },
    restaurants: [
      { name: 'Schloss Schauenstein', cuisine: 'Swiss', price: '$$$$', rating: 4.9 },
      { name: 'Café Zürich', cuisine: 'Swiss', price: '$$', rating: 4.5 },
      { name: 'Le Chalet', cuisine: 'Fondue', price: '$$$', rating: 4.6 }
    ],
    attractions: [
      { name: 'Jungfrau Summit', category: 'mountain', time: '4-5 hrs', cost: '$100-150', description: 'Top of Europe at 3,454m' },
      { name: 'Matterhorn', category: 'mountain', time: '3-4 hrs', cost: '$50-80', description: 'Iconic pyramid peak in Zermatt' },
      { name: 'Lake Geneva', category: 'lake', time: '3-4 hrs', cost: '$20-30', description: 'Beautiful lakeside with vineyards' },
      { name: 'Lucerne Old Town', category: 'city', time: '2-3 hrs', cost: 'Free', description: 'Medieval streets and chapel bridge' },
      { name: 'Mount Pilatus', category: 'mountain', time: '3-4 hrs', cost: '$60-90', description: 'Dragon mountain with panoramic views' },
      { name: 'Rhine Falls', category: 'waterfall', time: '2-3 hrs', cost: '$15-25', description: 'Europe\'s largest waterfall' },
      { name: 'Zermatt Village', category: 'town', time: '2-3 hrs', cost: 'Free', description: 'Car-free alpine village' },
      { name: 'Swiss Chocolate Factory', category: 'tour', time: '2-3 hrs', cost: '$20-30', description: 'Learn chocolate making' }
    ]
  },
  greece: {
    country: 'Greece',
    description: 'Ancient ruins and stunning islands',
    hotels: {
      budget: [
        { name: 'Hotel Athens', location: 'Plaka', price: '$60-100', rating: 4.0, amenities: ['WiFi', 'Breakfast'] },
        { name: 'Cavo Tagoo', location: 'Mykonos', price: '$80-130', rating: 4.2, amenities: ['Pool', 'WiFi'] }
      ],
      'mid-range': [
        { name: 'Electra Metropolis', location: 'Athens', price: '$150-220', rating: 4.5, amenities: ['Rooftop', 'WiFi', 'Restaurant'] },
        { name: 'Canaves Oia', location: 'Santorini', price: '$200-300', rating: 4.7, amenities: ['Pool', 'Caldera Views', 'Spa'] }
      ],
      luxury: [
        { name: 'Four Seasons Astir Palace', location: 'Athens', price: '$400-600', rating: 4.9, amenities: ['Beach', 'Pool', 'Spa'] },
        { name: 'Canaves Oia Epitome', location: 'Santorini', price: '$500-800', rating: 4.9, amenities: ['Private Pool', 'Butler', 'Spa'] }
      ]
    },
    restaurants: [
      { name: 'Spondi', cuisine: 'Greek', price: '$$$', rating: 4.7 },
      { name: 'Taverna Kostas', cuisine: 'Greek', price: '$', rating: 4.6 },
      { name: 'Lobster', cuisine: 'Seafood', price: '$$$', rating: 4.5 }
    ],
    attractions: [
      { name: 'Acropolis', category: 'historic', time: '2-3 hrs', cost: '$15-25', description: 'Ancient citadel with Parthenon' },
      { name: 'Santorini Caldera', category: 'landmark', time: '2-3 hrs', cost: 'Free', description: 'Stunning volcanic crater views' },
      { name: 'Mykonos Windmills', category: 'landmark', time: '1-2 hrs', cost: 'Free', description: 'Iconic island windmills' },
      { name: 'Delphi Ruins', category: 'historic', time: '3-4 hrs', cost: '$15-20', description: 'Ancient oracle and theater' },
      { name: 'Meteora Monasteries', category: 'religious', time: '4-5 hrs', cost: '$10-15', description: 'Monasteries on giant rocks' },
      { name: 'Ancient Olympia', category: 'historic', time: '2-3 hrs', cost: '$10-15', description: 'Birthplace of Olympic Games' },
      { name: 'Blue Dome Church', category: 'landmark', time: '1 hr', cost: 'Free', description: 'Famous Santorini church' },
      { name: 'Coliseum', category: 'historic', time: '1-2 hrs', cost: '$10-15', description: 'Roman amphitheater in Athens' }
    ]
  }
};

// ─── Weather ──────────────────────────────────────────────────────────────────
const WEATHER = {
  paris:     { temp: '18–22°C', condition: 'Partly cloudy', desc: 'Mild spring weather perfect for sightseeing'       },
  tokyo:     { temp: '20–25°C', condition: 'Sunny',         desc: 'Warm and pleasant weather'                         },
  bali:      { temp: '28–32°C', condition: 'Sunny',         desc: 'Tropical climate with high humidity'               },
  london:    { temp: '12–16°C', condition: 'Cloudy',        desc: 'Typical British weather, bring a jacket'           },
  'new york':{ temp: '15–20°C', condition: 'Clear',         desc: 'Comfortable weather for city exploration'          },
  dubai:     { temp: '30–38°C', condition: 'Sunny',         desc: 'Hot and dry desert climate'                        },
  rome:      { temp: '20–26°C', condition: 'Sunny',         desc: 'Beautiful Mediterranean weather'                   },
  barcelona: { temp: '22–27°C', condition: 'Sunny',         desc: 'Warm coastal climate'                              },
  maldives:  { temp: '28–31°C', condition: 'Sunny',         desc: 'Tropical paradise weather year-round'              },
  sydney:    { temp: '18–24°C', condition: 'Sunny',         desc: 'Mild and pleasant Southern Hemisphere climate'     },
  goa:       { temp: '26–32°C', condition: 'Sunny',         desc: 'Warm tropical weather, great for beaches'          },
  kerala:    { temp: '24–30°C', condition: 'Partly cloudy', desc: 'Tropical climate, lush greenery year-round'        },
  bangkok:   { temp: '28–34°C', condition: 'Sunny',         desc: 'Hot and humid, expect afternoon showers'           },
  singapore: { temp: '27–32°C', condition: 'Humid',        desc: 'Tropical climate, occasional rain'                 },
  switzerland:{ temp: '10–20°C', condition: 'Variable',      desc: 'Mountain weather, bring layers'                     },
  greece:    { temp: '20–28°C', condition: 'Sunny',         desc: 'Mediterranean climate, perfect for sightseeing'     },
};

const getWeather = (dest) => {
  const w = WEATHER[dest.toLowerCase()] || { temp: '20–25°C', condition: 'Pleasant', desc: 'Good weather for travel' };
  return `${w.condition}, ${w.temp}. ${w.desc}`;
};

// ─── Activity templates by interest ──────────────────────────────────────────
const ACTIVITIES = {
  culture: [
    { name: 'Visit Local Museum',      description: 'Explore cultural artifacts and history',           time: '2–3 hrs', cost: '$10–20',  location: 'City Center'      },
    { name: 'Historical Walking Tour', description: "Learn about the city's rich history",              time: '3–4 hrs', cost: '$15–30',  location: 'Old Town'         },
    { name: 'Art Gallery Visit',       description: 'Discover local and international art collections', time: '1–2 hrs', cost: '$8–15',   location: 'Art District'     },
  ],
  food: [
    { name: 'Food Market Tour',        description: 'Sample local delicacies and street food',          time: '2–3 hrs', cost: '$20–40',  location: 'Local Market'     },
    { name: 'Cooking Class',           description: 'Learn to cook traditional dishes',                 time: '3–4 hrs', cost: '$50–80',  location: 'Cooking School'   },
    { name: 'Restaurant Hopping',      description: 'Try different cuisines at local restaurants',      time: '3–4 hrs', cost: '$30–60',  location: 'Various'          },
  ],
  adventure: [
    { name: 'Hiking Trail',            description: 'Explore nature trails and scenic views',           time: '4–6 hrs', cost: '$5–15',   location: 'Nearby Mountains' },
    { name: 'Adventure Sports',         description: 'Try thrilling activities like zip-lining',         time: '2–4 hrs', cost: '$40–80',  location: 'Adventure Park'   },
    { name: 'Water Sports',            description: 'Kayaking, surfing, or boat tours',                 time: '3–5 hrs', cost: '$30–70',  location: 'Beach / Lake'     },
  ],
  relaxation: [
    { name: 'Spa Day',                 description: 'Relax with massages and treatments',               time: '2–4 hrs', cost: '$50–150', location: 'Spa Resort'       },
    { name: 'Beach Time',              description: 'Relax on beautiful beaches',                       time: '4–6 hrs', cost: '$0–20',   location: 'Beach'            },
    { name: 'Garden & Park Visit',     description: 'Stroll through beautiful gardens',                 time: '2–3 hrs', cost: '$0–10',   location: 'City Park'        },
  ],
  shopping: [
    { name: 'Local Markets',           description: 'Browse unique local crafts and souvenirs',         time: '2–3 hrs', cost: '$20–50',  location: 'Market District'  },
    { name: 'Shopping Mall',           description: 'Modern shopping experience',                       time: '3–4 hrs', cost: '$30–100', location: 'City Mall'        },
    { name: 'Boutique Shopping',       description: 'Unique shops and local designers',                 time: '2–3 hrs', cost: '$40–80',  location: 'Boutique District'},
  ],
  nature: [
    { name: 'Nature Walk',             description: 'Explore local flora and fauna',                    time: '2–4 hrs', cost: '$0–10',   location: 'Nature Reserve'   },
    { name: 'Waterfall Visit',         description: 'Visit scenic waterfalls and natural pools',        time: '3–5 hrs', cost: '$5–20',   location: 'Outskirts'        },
    { name: 'Sunrise / Sunset Point',  description: 'Catch breathtaking views at golden hour',          time: '1–2 hrs', cost: '$0–5',    location: 'Viewpoint'        },
  ],
};

const MULTIPLIERS = { budget: 0.7, 'mid-range': 1, luxury: 1.8 };
const DAY_THEMES  = ['Exploration Day', 'Culture & History', 'Adventure & Thrills', 'Relaxation Day', 'Food & Shopping'];

// ─── Packing List ─────────────────────────────────────────────────────────────
const BASE_PACKING = [
  { category: 'Documents', items: ['Passport / ID', 'Travel insurance', 'Hotel bookings printout', 'Flight tickets', 'Emergency contacts'] },
  { category: 'Money', items: ['Credit / Debit cards', 'Local currency cash', 'Travel wallet'] },
  { category: 'Health', items: ['Prescription medicines', 'Basic first-aid kit', 'Hand sanitiser', 'Face masks', 'Sunscreen SPF 50+'] },
  { category: 'Electronics', items: ['Phone + charger', 'Power bank', 'Universal adapter', 'Earphones', 'Camera'] },
  { category: 'Clothing', items: ['Comfortable walking shoes', 'Weather-appropriate clothes', 'Undergarments (extra)', 'Sleepwear', 'Light jacket'] },
];

const DESTINATION_PACKING = {
  beach:   { category: 'Beach Essentials', items: ['Swimwear', 'Beach towel', 'Flip-flops', 'Waterproof bag', 'Snorkelling gear'] },
  cold:    { category: 'Cold Weather', items: ['Thermal innerwear', 'Heavy jacket / parka', 'Gloves & scarf', 'Woollen socks', 'Snow boots'] },
  tropical:{ category: 'Tropical Climate', items: ['Insect repellent', 'Light breathable clothes', 'Rain poncho', 'Rehydration sachets', 'Cooling towel'] },
  temple:  { category: 'Temple / Religious Sites', items: ['Modest clothing (cover shoulders & knees)', 'Scarf / shawl', 'Slip-on shoes', 'Small offering / donation'] },
  adventure:{ category: 'Adventure / Trekking', items: ['Trekking shoes', 'Backpack (day pack)', 'Water bottle (reusable)', 'Energy bars', 'Headlamp / torch'] },
  city:    { category: 'City Travel', items: ['Metro / transit card', 'City map / offline maps', 'Compact umbrella', 'Anti-theft bag', 'Portable WiFi / SIM'] },
};

const DEST_PACK_MAP = {
  bali: ['beach', 'tropical', 'temple'], maldives: ['beach', 'tropical'],
  goa: ['beach', 'tropical'], kerala: ['tropical', 'temple'],
  tokyo: ['city', 'temple'], kyoto: ['city', 'temple'],
  paris: ['city'], london: ['city'], 'new york': ['city'],
  dubai: ['city', 'beach'], singapore: ['city', 'tropical'],
  bangkok: ['city', 'temple', 'tropical'], rome: ['city', 'temple'],
  barcelona: ['city', 'beach'], sydney: ['city', 'beach'],
  switzerland: ['cold', 'adventure'], greece: ['beach', 'city'],
  mysore: ['city', 'temple'], mangalore: ['tropical', 'beach'],
  udupi: ['tropical', 'temple'], bangalore: ['city'],
};

const getPackingList = (destination, interests) => {
  const key = destination.toLowerCase().trim();
  const types = DEST_PACK_MAP[key] || ['city'];
  const interestList = interests.toLowerCase();
  if (interestList.includes('adventure')) types.push('adventure');
  if (interestList.includes('beach') || interestList.includes('relaxation')) types.push('beach');
  const unique = [...new Set(types)];
  const extra = unique.map((t) => DESTINATION_PACKING[t]).filter(Boolean);
  return [...BASE_PACKING, ...extra];
};

// Helper to get destination data (case-insensitive)
const getDestinationData = (destination) => {
  const key = destination.toLowerCase().trim();
  return DESTINATION_DATA[key] || null;
};

// Helper to get real hotels for destination
const getHotels = (destData, budget) => {
  if (!destData?.hotels) return [];
  return destData.hotels[budget] || destData.hotels['mid-range'] || [];
};

// Helper to get real attractions for destination
const getAttractions = (destData, interests) => {
  if (!destData?.attractions) return [];
  const interestCategories = {
    culture: ['museum', 'historic', 'temple', 'palace', 'religious'],
    food: ['market', 'restaurant'],
    adventure: ['adventure', 'hiking', 'water'],
    relaxation: ['beach', 'park', 'spa'],
    shopping: ['shopping', 'market'],
    nature: ['nature', 'lake', 'waterfall', 'mountain']
  };
  
  const list = interests.toLowerCase().split(',').map((i) => i.trim()).filter(Boolean);
  const matchedAttractions = [];
  
  list.forEach(interest => {
    const categories = interestCategories[interest] || [];
    destData.attractions.forEach(attraction => {
      if (categories.includes(attraction.category) && !matchedAttractions.includes(attraction)) {
        matchedAttractions.push(attraction);
      }
    });
  });
  
  // If no matches by category, return some default attractions
  if (matchedAttractions.length === 0) {
    return destData.attractions.slice(0, 4);
  }
  
  return matchedAttractions.slice(0, 4);
};

// Helper to get real restaurants for destination
const getRestaurants = (destData) => {
  if (!destData?.restaurants) return [];
  return destData.restaurants.slice(0, 3);
};

const generateItinerary = (destination, numDays, budget, interests) => {
  const destData = getDestinationData(destination);
  const multiplier = MULTIPLIERS[budget] || 1;
  let totalCost = 0;
  
  // Get real hotels for the destination
  const hotels = getHotels(destData, budget);
  const restaurants = getRestaurants(destData);
  const attractions = getAttractions(destData, interests);
  
  const days = Array.from({ length: numDays }, (_, idx) => {
    const activities = [];
    let dayCost = 0;
    
    // Use real attractions from the destination
    const dayAttractions = attractions.slice(idx % attractions.length, (idx % attractions.length) + 2);
    
    dayAttractions.forEach((attraction, i) => {
      // Adjust cost based on budget multiplier
      let cost = attraction.cost;
      if (cost !== 'Free' && cost.startsWith('$')) {
        const costMatch = cost.match(/\$(\d+)[–-]?(\d+)?/);
        if (costMatch) {
          const baseCost = costMatch[2] ? (parseInt(costMatch[1]) + parseInt(costMatch[2])) / 2 : parseInt(costMatch[1]);
          const adjustedCost = Math.round(baseCost * multiplier);
          cost = `$${adjustedCost}`;
          dayCost += adjustedCost;
        }
      }
      
      activities.push({
        name: attraction.name,
        description: attraction.description,
        time: attraction.time,
        cost: cost,
        location: attraction.category,
        category: attraction.category
      });
    });
    
    // Add a meal experience from local restaurants
    if (restaurants.length > 0) {
      const restaurant = restaurants[idx % restaurants.length];
      const mealCost = Math.round(25 * multiplier);
      activities.push({
        name: `Dinner at ${restaurant.name}`,
        description: `Experience authentic ${restaurant.cuisine} cuisine at this highly-rated restaurant`,
        time: '1-2 hrs',
        cost: `$${mealCost}-$${mealCost * 2}`,
        location: 'Restaurant',
        category: 'dining'
      });
      dayCost += mealCost * 1.5;
    }
    
    totalCost += dayCost;
    
    // Generate meal plan
    const breakfastCost = Math.round(8 * multiplier);
    const lunchCost = Math.round(15 * multiplier);
    const dinnerCost = Math.round(30 * multiplier);
    const meals = `Breakfast: Local café ($${breakfastCost}-$${breakfastCost * 2}), Lunch: ${dayAttractions[0]?.name || 'Restaurant'} area ($${lunchCost}-$${lunchCost * 2}), Dinner: ${restaurants[idx % restaurants.length]?.name || 'Fine dining'} ($${dinnerCost}-$${dinnerCost * 2})`;
    
    return { 
      day: idx + 1, 
      theme: DAY_THEMES[idx % DAY_THEMES.length], 
      activities, 
      meals 
    };
  });
  
  // Calculate total accommodation cost
  const hotelPrice = hotels[0]?.price || '$100-150';
  const hotelMatch = hotelPrice.match(/\$(\d+)[–-](\d+)/);
  let avgHotelCost = 120;
  if (hotelMatch) {
    avgHotelCost = (parseInt(hotelMatch[1]) + parseInt(hotelMatch[2])) / 2;
  }
  const totalHotelCost = Math.round(avgHotelCost * multiplier * numDays);
  
  return {
    destination,
    country: destData?.country || 'Unknown',
    description: destData?.description || 'A wonderful travel destination',
    days,
    totalCost: `$${Math.round(totalCost + totalHotelCost)}–$${Math.round((totalCost + totalHotelCost) * 1.25)}`,
    weather: getWeather(destination),
    bestTime: destData ? `Best time to visit: October to March for pleasant weather` : 'Year-round, but best in spring (March–May)',
    hotels: hotels.slice(0, 3),
    restaurants: restaurants.slice(0, 3),
    attractions: attractions.slice(0, 6),
    packingList: getPackingList(destination, interests),
  };
};

// ─── POST /api/plan ───────────────────────────────────────────────────────────
// Generates itinerary AND stores it in MongoDB
router.post('/plan', optionalAuth, async (req, res) => {
  try {
    const { destination, days, budget, interests } = req.body;

    if (!destination || !days || !budget || !interests) {
      return res.status(400).json({ error: 'All fields are required: destination, days, budget, interests.' });
    }
    const numDays = parseInt(days);
    if (isNaN(numDays) || numDays < 1 || numDays > 30) {
      return res.status(400).json({ error: 'Days must be between 1 and 30.' });
    }

    // Generate the itinerary
    const itinerary = generateItinerary(destination, numDays, budget, interests);

    // Save to MongoDB — always attempt, report if it fails
    let savedId = null;
    try {
      const doc = await new TravelPlan({
        destination,
        days:      numDays,
        budget,
        interests,
        itinerary,
        userId:    req.user?.userId || null,
      }).save();
      savedId = doc._id;
      console.log(`✅ Itinerary saved to DB — ID: ${savedId} | Destination: ${destination}`);
    } catch (dbErr) {
      // DB unavailable — still return the itinerary to the user
      console.warn(`⚠️  DB save failed (MongoDB may not be running): ${dbErr.message}`);
    }

    res.json({ ...itinerary, _id: savedId });
  } catch (err) {
    console.error('Error generating itinerary:', err);
    res.status(500).json({ error: 'Failed to generate itinerary.' });
  }
});

// ─── GET /api/plans/all ───────────────────────────────────────────────────────
// View ALL stored plans (no auth — for testing/demo purposes)
router.get('/plans/all', async (req, res) => {
  try {
    const plans = await TravelPlan.find({}).sort({ createdAt: -1 }).limit(50);
    res.json({
      count: plans.length,
      message: plans.length === 0 ? 'No plans stored yet. Generate an itinerary first.' : `${plans.length} plan(s) found.`,
      plans: plans.map((p) => ({
        _id:         p._id,
        destination: p.destination,
        days:        p.days,
        budget:      p.budget,
        interests:   p.interests,
        totalCost:   p.itinerary?.totalCost,
        createdAt:   p.createdAt,
        userId:      p.userId,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans. Is MongoDB running?', detail: err.message });
  }
});

// ─── POST /api/plans/save ─────────────────────────────────────────────────────
// Explicitly save / update an itinerary (requires login)
router.post('/plans/save', auth, async (req, res) => {
  try {
    const itinerary = req.body;
    if (!itinerary?.destination) {
      return res.status(400).json({ error: 'Invalid itinerary data.' });
    }
    const plan = await TravelPlan.findOneAndUpdate(
      { destination: itinerary.destination, userId: req.user.userId },
      {
        destination: itinerary.destination,
        days:        itinerary.days?.length || 0,
        budget:      itinerary.budget || 'mid-range',
        interests:   itinerary.interests || '',
        itinerary,
        userId:      req.user.userId,
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Plan saved by user ${req.user.userId} — ${itinerary.destination}`);
    res.json({ message: 'Itinerary saved successfully.', id: plan._id });
  } catch (err) {
    console.error('Error saving plan:', err);
    res.status(500).json({ error: 'Failed to save itinerary.' });
  }
});

// ─── GET /api/plans ───────────────────────────────────────────────────────────
// Fetch saved plans for the logged-in user
router.get('/plans', auth, async (req, res) => {
  try {
    const plans = await TravelPlan.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    console.error('Error fetching plans:', err);
    res.status(500).json({ error: 'Failed to fetch saved plans.' });
  }
});

// ─── DELETE /api/plans/:id ────────────────────────────────────────────────────
router.delete('/plans/:id', auth, async (req, res) => {
  try {
    await TravelPlan.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: 'Trip deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete plan.' });
  }
});

module.exports = router;
