import { Product, FlashOffer, CategoryInfo } from '../types';

export const LKR_EXCHANGE_RATE = 310; // 1 USD = 310 LKR

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'phones',
    name: 'Mobiles & Tablets',
    iconName: 'Smartphone',
    description: 'Flagships, budget smartphones, iPads, and tablets',
    itemCount: 48,
    featuredImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'accessories',
    name: 'Phone Accessories & Cables',
    iconName: 'Zap',
    description: 'GaN chargers, lightning/USB-C cables, adapters & cases',
    itemCount: 84,
    featuredImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'audio',
    name: 'Earphones & Speakers',
    iconName: 'Headphones',
    description: 'ANC headphones, Bluetooth speakers, and TWS earbuds',
    itemCount: 52,
    featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'tvs',
    name: 'Televisions & Soundbars',
    iconName: 'Tv',
    description: '4K Ultra HD, QLED, OLED & Google Smart TVs',
    itemCount: 36,
    featuredImage: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'air-conditioners',
    name: 'Air Conditioners',
    iconName: 'Wind',
    description: 'Inverter & split AC units (12,000 to 24,000 BTU) with R32 eco refrigerant',
    itemCount: 22,
    featuredImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'refrigerators',
    name: 'Refrigerators & Freezers',
    iconName: 'Refrigerator',
    description: 'Double door, frost-free & side-by-side inverter refrigerators',
    itemCount: 28,
    featuredImage: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'washing-machines',
    name: 'Washing Machines',
    iconName: 'Shirt',
    description: 'Front load & top load fully automatic washers with steam hygiene',
    itemCount: 24,
    featuredImage: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'stoves',
    name: 'Gas & Electric Stoves',
    iconName: 'Flame',
    description: 'Stainless steel gas stoves, induction and infrared cooktops',
    itemCount: 19,
    featuredImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'kitchen',
    name: 'Rice Cookers & Kitchen',
    iconName: 'Utensils',
    description: 'Deluxe rice cookers, blenders, air fryers & electric kettles',
    itemCount: 45,
    featuredImage: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'fans',
    name: 'Fans & Cooling',
    iconName: 'Fan',
    description: 'Stand fans, ceiling fans, table fans and rechargeable emergency fans',
    itemCount: 30,
    featuredImage: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'laptops',
    name: 'Laptops & Computers',
    iconName: 'Laptop',
    description: 'Workstations, business laptops, and computer peripherals',
    itemCount: 35,
    featuredImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'appliances',
    name: 'Household Appliances',
    iconName: 'Home',
    description: 'Vacuum cleaners, steam irons, water dispensers & heaters',
    itemCount: 40,
    featuredImage: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-xenofold-pro',
    title: 'XenoFold Pro 5G - Titanium Edition',
    brand: 'Xenon',
    category: 'phones',
    price: 1799.00,
    originalPrice: 1999.00,
    discountPercent: 10,
    rating: 4.9,
    reviewsCount: 342,
    stock: 18,
    lowStockThreshold: 5,
    isFeatured: true,
    isFlashDeal: true,
    flashDealExpiry: new Date(Date.now() + 86400000 * 3).toISOString(),
    isBestSeller: true,
    isNewArrival: true,
    sku: 'XENO-FOLD-PRO-01',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Midnight Titanium', hex: '#1E242B', inStock: true },
      { name: 'Astral Silver', hex: '#E0E4E8', inStock: true },
      { name: 'Deep Cosmic Blue', hex: '#1A2942', inStock: true }
    ],
    storageOptions: [
      { label: '256GB Included', priceDelta: 0 },
      { label: '512GB (+$150)', priceDelta: 150 },
      { label: '1TB (+$300)', priceDelta: 300 }
    ],
    specChips: ['7.8" Dynamic Foldable OLED', 'Snapdragon 8 Gen 3', '5400mAh Battery', '100W SuperCharge'],
    specs: [
      { label: 'Display', value: '7.8" 120Hz LTPO Foldable OLED + 6.4" Cover' },
      { label: 'Camera', value: '50MP Sony OIS Triple Matrix Lens 8K' },
      { label: 'Battery', value: '5400mAh Dual-Cell with 100W Fast Charge' },
      { label: 'Processor', value: 'Octa-core 3.4GHz 4nm AI Flagship' }
    ],
    overview: 'The future of mobile multitasking unfolds before your eyes. Built with titanium aerospace-grade hinge mechanisms, crystal-clear 120Hz LTPO display, and IPX8 water resistance.',
    inTheBox: ['XenoFold Pro Device', '100W GaN Super Charger', 'Braided Type-C Cable', 'Premium Protective Case', 'SIM Ejector'],
    warranty: '1 Year Company Warranty + 1-to-1 Replacement Guarantee within 7 Days',
    viewsCount: 4890,
    salesCount: 142
  },
  {
    id: 'prod-macbook-pro-14-m3',
    title: 'MacBook Pro 14" M3 Pro Chip',
    brand: 'Apple',
    category: 'laptops',
    price: 1699.00,
    originalPrice: 1999.00,
    discountPercent: 15,
    rating: 4.9,
    reviewsCount: 128,
    stock: 14,
    lowStockThreshold: 5,
    isFeatured: true,
    isFlashDeal: false,
    isBestSeller: true,
    sku: 'APL-MBP14-M3P',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Space Black', hex: '#242527', inStock: true },
      { name: 'Silver', hex: '#E3E4E6', inStock: true }
    ],
    storageOptions: [
      { label: '512GB SSD Included', priceDelta: 0 },
      { label: '1TB SSD (+$200)', priceDelta: 200 },
      { label: '2TB SSD (+$600)', priceDelta: 600 }
    ],
    specChips: ['M3 PRO 11-CORE', '18GB UNIFIED RAM', '512GB SSD', 'Liquid Retina XDR'],
    specs: [
      { label: 'Display', value: '14.2-inch Liquid Retina XDR 120Hz ProMotion' },
      { label: 'Processor', value: 'Apple M3 Pro 11-Core CPU / 14-Core GPU' },
      { label: 'Memory', value: '18GB Unified High-Bandwidth Memory' },
      { label: 'Battery Life', value: 'Up to 18 Hours Video Playback' }
    ],
    overview: 'Mind-blowing performance meets extreme efficiency. The MacBook Pro 14" with M3 Pro handles demanding 4K video workflows, heavy compiling, and 3D modeling seamlessly.',
    inTheBox: ['14-inch MacBook Pro', '70W USB-C Power Adapter', 'USB-C to MagSafe 3 Cable (2m)'],
    warranty: '1 Year Official Apple International Warranty',
    viewsCount: 6120,
    salesCount: 89
  },
  {
    id: 'prod-rog-zephyrus-g14',
    title: 'ROG Zephyrus G14 OLED Gaming Laptop',
    brand: 'Asus',
    category: 'laptops',
    price: 1599.99,
    originalPrice: 1899.99,
    discountPercent: 16,
    rating: 4.7,
    reviewsCount: 84,
    stock: 8,
    lowStockThreshold: 4,
    isFeatured: true,
    isFlashDeal: true,
    flashDealExpiry: new Date(Date.now() + 86400000 * 2).toISOString(),
    isBestSeller: true,
    sku: 'ASUS-ROG-G14-OLED',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Eclipse Gray', hex: '#313338', inStock: true },
      { name: 'Platinum White', hex: '#F0F2F5', inStock: true }
    ],
    storageOptions: [
      { label: '1TB NVMe PCIe 4.0', priceDelta: 0 },
      { label: '2TB NVMe Upgrade (+$180)', priceDelta: 180 }
    ],
    specChips: ['RYZEN 9 8945HS', 'RTX 4060 8GB', '16GB DDR5', '3K 120Hz OLED'],
    specs: [
      { label: 'Display', value: '14" 3K 120Hz 0.2ms OLED ROG Nebula Display' },
      { label: 'Graphics', value: 'NVIDIA GeForce RTX 4060 8GB GDDR6' },
      { label: 'CPU', value: 'AMD Ryzen 9 8945HS with Ryzen AI' },
      { label: 'Cooling', value: 'ROG Intelligent Cooling with Liquid Metal' }
    ],
    overview: 'Precision craftsmanship in an ultra-slim CNC aluminum chassis. The ROG Zephyrus G14 delivers top-tier esports frame rates and color-accurate OLED fidelity in a lightweight 1.5kg body.',
    inTheBox: ['Zephyrus G14 Laptop', '240W Compact Power Adapter', 'ROG Sleeve', 'Warranty Card'],
    warranty: '2 Years Comprehensive Asus Direct Warranty',
    viewsCount: 3950,
    salesCount: 45
  },
  {
    id: 'prod-protech-x1-ultra',
    title: 'ProTech X1 Ultra 5G Smartphone',
    brand: 'ProTech',
    category: 'phones',
    price: 999.00,
    originalPrice: 1199.00,
    discountPercent: 17,
    rating: 4.8,
    reviewsCount: 1284,
    stock: 22,
    lowStockThreshold: 6,
    isFeatured: true,
    isFlashDeal: false,
    isBestSeller: true,
    sku: 'PT-X1U-TITAN',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Midnight Blue', hex: '#1C2938', inStock: true },
      { name: 'Titanium Silver', hex: '#DCDFE4', inStock: true },
      { name: 'Space Black', hex: '#171717', inStock: true }
    ],
    storageOptions: [
      { label: '256GB Included', priceDelta: 0 },
      { label: '512GB (+$100)', priceDelta: 100 },
      { label: '1TB (+$250)', priceDelta: 250 }
    ],
    specChips: ['6.7" OLED 120Hz', '50MP Main 8K', '5000mAh Battery', 'M3 Pro Chip AI'],
    specs: [
      { label: 'Display', value: '6.7" Super OLED 120Hz ProMotion 2500 nits' },
      { label: 'Camera', value: '50MP Main with OIS + 48MP Ultrawide + 5x Periscope' },
      { label: 'Battery', value: '5000mAh with 45W Fast Charging' },
      { label: 'Processor', value: 'Octa-core 4nm Flagship with Neural Engine' }
    ],
    overview: 'Engineered for photographers, gamers, and mobile professionals. Features cinematic 8K video capture, all-day 5000mAh endurance, and scratch-proof ceramic shield glass.',
    inTheBox: ['ProTech X1 Ultra Handset', '45W USB-C Power Adapter', 'Type-C Braided Cable', 'Quick Start Manual'],
    warranty: '1 Year Comprehensive Brand Warranty + Free Screen Protection for 6 Months',
    viewsCount: 8400,
    salesCount: 310
  },
  {
    id: 'prod-sonicflow-pro',
    title: 'SonicFlow Pro Wireless Noise Canceling Headphones',
    brand: 'SonicFlow',
    category: 'audio',
    price: 299.99,
    originalPrice: 349.99,
    discountPercent: 15,
    rating: 4.8,
    reviewsCount: 520,
    stock: 35,
    lowStockThreshold: 8,
    isFeatured: true,
    isFlashDeal: true,
    flashDealExpiry: new Date(Date.now() + 86400000 * 4).toISOString(),
    isBestSeller: true,
    sku: 'SONIC-FL-PRO-ANC',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Matte Obsidian', hex: '#1C1D1F', inStock: true },
      { name: 'Silver Smoke', hex: '#D8DADD', inStock: true }
    ],
    specChips: ['Hybrid ANC 40dB', '50hr Battery Life', 'LDAC Hi-Res Audio', 'Multipoint Bluetooth'],
    specs: [
      { label: 'Acoustic Driver', value: '40mm Custom Bio-Cellulose Dynamic Drivers' },
      { label: 'Noise Cancellation', value: 'Dual-Feedback Hybrid Active Noise Canceling' },
      { label: 'Battery Life', value: '50 Hours (ANC On), 70 Hours (Standard)' },
      { label: 'Connectivity', value: 'Bluetooth 5.4 + 3.5mm Lossless Audio Jack' }
    ],
    overview: 'Immerse in pure acoustic precision. The SonicFlow Pro eliminates 98% of ambient city drone while reproducing lossless high-resolution audio with ultra-deep bass.',
    inTheBox: ['SonicFlow Pro Headphones', 'Hard Travel Case', 'USB-C Charging Cable', '3.5mm Audio Cable', 'Airplane Adapter'],
    warranty: '1 Year Replacement Warranty',
    viewsCount: 4210,
    salesCount: 198
  },
  {
    id: 'prod-vibefit-series-8',
    title: 'VibeFit Series 8 Pro Smartwatch',
    brand: 'VibeFit',
    category: 'wearables',
    price: 359.00,
    originalPrice: 399.00,
    discountPercent: 10,
    rating: 4.7,
    reviewsCount: 310,
    stock: 28,
    lowStockThreshold: 5,
    isFeatured: true,
    isFlashDeal: false,
    isBestSeller: true,
    sku: 'VIBE-S8-PRO',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Deep Navy', hex: '#192C45', inStock: true },
      { name: 'Midnight Black', hex: '#111215', inStock: true },
      { name: 'Starlight Gold', hex: '#E8DEC8', inStock: true }
    ],
    specChips: ['1.9" AMOLED Sapphire', 'ECG & SpO2 Monitor', 'Dual-Frequency GPS', '50m Water Resistant'],
    specs: [
      { label: 'Display', value: '1.9" Always-On AMOLED 2000 nits Sapphire Crystal' },
      { label: 'Health Sensors', value: 'ECG, Heart Rate, SpO2, Skin Temp, Sleep Stages' },
      { label: 'Battery', value: 'Up to 5 Days Normal Use, 14 Days Power Save' },
      { label: 'Water Rating', value: '5ATM + IP68 Swim Proof' }
    ],
    overview: 'Your ultimate fitness companion and daily smart dashboard. Track over 120 sports modes with millimeter-accurate dual GPS and receive phone calls directly on your wrist.',
    inTheBox: ['VibeFit Smartwatch', 'Magnetic Fast Charger', 'Silicone Sports Strap', 'User Manual'],
    warranty: '1 Year Official Warranty',
    viewsCount: 2900,
    salesCount: 112
  },
  {
    id: 'prod-echohub-gen4',
    title: 'EchoHub Smart Speaker Gen 4 with Hub',
    brand: 'EchoTech',
    category: 'audio',
    price: 69.99,
    originalPrice: 99.99,
    discountPercent: 30,
    rating: 4.6,
    reviewsCount: 440,
    stock: 45,
    lowStockThreshold: 10,
    isFeatured: true,
    isFlashDeal: true,
    flashDealExpiry: new Date(Date.now() + 86400000 * 5).toISOString(),
    sku: 'ECHO-HUB-G4',
    images: [
      'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Charcoal Fabric', hex: '#26282B', inStock: true },
      { name: 'Glacier White', hex: '#ECEEF0', inStock: true }
    ],
    specChips: ['360° Dolby Sound', 'Built-in Zigbee Hub', 'Voice Assistant', 'Room EQ Tuning'],
    specs: [
      { label: 'Audio', value: '3.0" Neodymium Woofer + Dual 0.8" Tweeters' },
      { label: 'Smart Home', value: 'Zigbee, Matter, and Thread protocol support' },
      { label: 'Microphones', value: 'Far-field 4-mic array with physical privacy mute' }
    ],
    overview: 'Fill your home with rich 360-degree sound while seamlessly automating all your smart home lights, ACs, and security locks with voice commands.',
    inTheBox: ['EchoHub Smart Speaker', '30W Power Adapter', 'Quick Setup Guide'],
    warranty: '1 Year Replacement Warranty',
    viewsCount: 2150,
    salesCount: 180
  },
  {
    id: 'prod-samsung-65-neo-qled',
    title: 'Samsung 65" Neo QLED 4K Smart TV (QN90C)',
    brand: 'Samsung',
    category: 'tvs',
    price: 1399.00,
    originalPrice: 1799.00,
    discountPercent: 22,
    rating: 4.9,
    reviewsCount: 165,
    stock: 9,
    lowStockThreshold: 3,
    isFeatured: true,
    isFlashDeal: false,
    isBestSeller: true,
    sku: 'SAM-65-QN90C',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Titan Black Slim Bezel', hex: '#141414', inStock: true }
    ],
    specChips: ['Quantum Mini LED 4K', '144Hz Motion Xcelerator', 'Dolby Atmos 60W', 'Anti-Glare Screen'],
    specs: [
      { label: 'Screen Tech', value: '65" Neo Quantum HDR+ with Mini LED Local Dimming' },
      { label: 'Resolution & Refresh', value: '4K Ultra HD (3840 x 2160) @ 144Hz VRR' },
      { label: 'Audio System', value: '60W 4.2.2 Channel with Object Tracking Sound+' },
      { label: 'Smart OS', value: 'Tizen OS with SmartThings, Netflix, YouTube 4K' }
    ],
    overview: 'Experience pitch blacks, blinding highlights, and ultra-vibrant colors powered by Samsung Quantum Matrix Mini-LED technology. Includes free wall bracket & installation support.',
    inTheBox: ['Samsung 65" Neo QLED TV', 'SolarCell Remote Control', 'Slim Fit Wall Mount & Table Stand', 'Power Cable'],
    warranty: '3 Years Official Singer/Samsung Sri Lanka Agent Warranty',
    viewsCount: 3400,
    salesCount: 32
  },
  {
    id: 'prod-lg-turbowash-9kg',
    title: 'LG 9kg AI DD™ TurboWash Front Load Washing Machine',
    brand: 'LG',
    category: 'appliances',
    price: 649.00,
    originalPrice: 799.00,
    discountPercent: 18,
    rating: 4.8,
    reviewsCount: 92,
    stock: 6,
    lowStockThreshold: 3,
    isFeatured: true,
    isFlashDeal: false,
    isBestSeller: true,
    sku: 'LG-WASH-AI-9KG',
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Platinum Silver', hex: '#7E858E', inStock: true },
      { name: 'Matte Black Stainless', hex: '#222325', inStock: true }
    ],
    specChips: ['AI Direct Drive™', 'TurboWash 39 mins', 'Steam+ Allergy Care', 'ThinQ WiFi Smart'],
    specs: [
      { label: 'Capacity', value: '9.0 kg Heavy Duty Washing Drum' },
      { label: 'Motor System', value: 'Inverter Direct Drive Motor (10 Year Motor Warranty)' },
      { label: 'Energy Rating', value: '5-Star Energy & Water Efficiency' },
      { label: 'Special Cycles', value: 'Steam Hygiene, TurboWash360, Wool, Sports, Quick 14' }
    ],
    overview: 'AI DD motor automatically detects fabric softness and load weight to provide optimal washing motion, reducing clothing damage by 18%. Islandwide free doorstep delivery & plumbing assistance included.',
    inTheBox: ['LG 9kg AI Washing Machine', 'Inlet & Drain Hoses', 'Spanner & Transit Bolt Caps', 'Manual'],
    warranty: '10 Years Inverter Direct Drive Motor Warranty + 2 Years Comprehensive',
    viewsCount: 2200,
    salesCount: 28
  },
  {
    id: 'prod-philips-induction-cooker',
    title: 'Philips HD4928 2100W Smart Induction Cooker Stove',
    brand: 'Philips',
    category: 'appliances',
    price: 79.99,
    originalPrice: 99.99,
    discountPercent: 20,
    rating: 4.7,
    reviewsCount: 215,
    stock: 24,
    lowStockThreshold: 6,
    isFeatured: false,
    isFlashDeal: true,
    flashDealExpiry: new Date(Date.now() + 86400000 * 3).toISOString(),
    sku: 'PHI-IND-2100W',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Gloss Black Crystal Glass', hex: '#111215', inStock: true }
    ],
    specChips: ['2100W High Power', 'Full Glass Micro-Crystal Plate', 'Auto-Off Safety', 'Preset Cooking Programs'],
    specs: [
      { label: 'Power Rating', value: '2100W Electromagnetic Induction' },
      { label: 'Plate Surface', value: 'A-Grade Micro-Crystal Glass (Scratch & Heat Proof)' },
      { label: 'Timer & Controls', value: '0-3 Hour Digital Timer with Touch Sensor controls' }
    ],
    overview: 'Cook fast, clean, and effortlessly. Delivers instant heat directly to your induction cookware, sealing nutrition with precise temperature regulation. Safe, flameless, and energy-efficient.',
    inTheBox: ['Induction Cooker', 'User Guide', 'Warranty Card'],
    warranty: '2 Years Manufacturer Guarantee',
    viewsCount: 1800,
    salesCount: 140
  },
  {
    id: 'prod-baseus-blade-100w',
    title: 'Baseus Blade 100W GaN Ultra-Slim Power Bank 20,000mAh',
    brand: 'Baseus',
    category: 'accessories',
    price: 89.99,
    originalPrice: 109.99,
    discountPercent: 18,
    rating: 4.9,
    reviewsCount: 680,
    stock: 40,
    lowStockThreshold: 10,
    isFeatured: true,
    isFlashDeal: false,
    isBestSeller: true,
    sku: 'BAS-BLADE-100W',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1609592424368-450f38b4a2e5?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#1B1C1E', inStock: true }
    ],
    specChips: ['100W PD Output', '20,000mAh Capacity', 'Charges Laptops & Mobiles', 'Digital LED Display'],
    specs: [
      { label: 'Outputs', value: '2x Type-C (100W max) + 2x USB-A (30W max)' },
      { label: 'Dimensions', value: '18mm Ultra-thin passport profile, Airline Safe' },
      { label: 'Battery Capacity', value: '20000mAh / 74Wh High-Density Lithium Polymer' }
    ],
    overview: 'Charge your MacBook Pro, Dell XPS, iPhone, and Samsung Galaxy simultaneously at full speed with the slimmest 100W power bank on the market.',
    inTheBox: ['Baseus Blade 100W Power Bank', '100W E-marker Type-C Cable', 'Velvet Pouch'],
    warranty: '1 Year Baseus Authorized Warranty',
    viewsCount: 5200,
    salesCount: 420
  },
  {
    id: 'prod-mechpro-rgb-keyboard',
    title: 'MechPro RGB Wireless Mechanical Keyboard',
    brand: 'MechPro',
    category: 'gaming',
    price: 129.99,
    originalPrice: 149.99,
    discountPercent: 13,
    rating: 4.8,
    reviewsCount: 230,
    stock: 19,
    lowStockThreshold: 5,
    isFeatured: false,
    isFlashDeal: false,
    isBestSeller: false,
    sku: 'MECH-RGB-PRO-75',
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Retro Gray & Orange', hex: '#4A4E5A', inStock: true },
      { name: 'All Black Dark Knight', hex: '#18191C', inStock: true }
    ],
    specChips: ['Hot-Swappable Switches', 'Tri-Mode Wireless 2.4G/BT', 'Gasket Mounted', 'RGB South-Facing'],
    specs: [
      { label: 'Layout', value: '75% Compact 82-Key Gasket Structure with Aluminum Knob' },
      { label: 'Switches', value: 'Pre-lubed Custom Linear Silver Speed Switches' },
      { label: 'Battery', value: '4000mAh Rechargeable (up to 200 hours)' }
    ],
    overview: 'Buttery smooth typing acoustics with multi-layer sound dampening foam and gasket suspension. Switch between Mac and Windows with a single toggle.',
    inTheBox: ['Keyboard', 'Type-C Coiled Cable', 'Keycap & Switch Puller', '2.4GHz Dongle', 'Extra Switches'],
    warranty: '1 Year Local Warranty',
    viewsCount: 2800,
    salesCount: 95
  },
  {
    id: 'prod-ergogrip-mouse',
    title: 'ErgoGrip Master Wireless Precision Mouse',
    brand: 'ErgoTech',
    category: 'gaming',
    price: 79.99,
    originalPrice: 99.99,
    discountPercent: 20,
    rating: 4.9,
    reviewsCount: 310,
    stock: 25,
    lowStockThreshold: 6,
    isFeatured: false,
    isFlashDeal: false,
    isBestSeller: true,
    sku: 'ERGO-MASTER-M3',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80'
    ],
    colors: [
      { name: 'Pale Grey', hex: '#DFE2E6', inStock: true },
      { name: 'Graphite Black', hex: '#212226', inStock: true }
    ],
    specChips: ['8000 DPI Darkfield Sensor', 'MagSpeed Electromagnetic Wheel', 'Quiet Clicks', '70-Day Battery'],
    specs: [
      { label: 'Sensor', value: 'Tracks on any surface including glass (200-8000 DPI)' },
      { label: 'Battery', value: 'USB-C Fast Charging (1 minute charge = 3 hours use)' },
      { label: 'Multi-Device', value: 'Pair up to 3 devices with seamless Flow cross-computer control' }
    ],
    overview: 'Sculpted for ergonomic hand support with thumb wheel control and whisper-quiet click switches for peak productivity.',
    inTheBox: ['ErgoGrip Mouse', 'USB-C Charging Cable', 'Logi Bolt USB Receiver'],
    warranty: '1 Year Official Warranty',
    viewsCount: 3100,
    salesCount: 165
  }
];

export const INITIAL_OFFERS: FlashOffer[] = [
  {
    id: 'offer-volts10',
    code: 'VOLTS10',
    title: '⚡ 10% Instant Discount on Any Order',
    discountPercent: 10,
    freeShipping: false,
    minSpendUSD: 50,
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    isActive: true,
    bannerText: '🔥 Use code VOLTS10 at checkout to get 10% off your tech upgrade!'
  },
  {
    id: 'offer-freedel',
    code: 'FREESHIP',
    title: '🚚 Free Islandwide Doorstep Express Delivery',
    discountPercent: 0,
    freeShipping: true,
    minSpendUSD: 100,
    expiresAt: new Date(Date.now() + 86400000 * 14).toISOString(),
    isActive: true,
    bannerText: '✨ FREE Islandwide Delivery across Sri Lanka on orders over $100 / Rs. 30,000!'
  },
  {
    id: 'offer-flash20',
    code: 'FLASH20',
    title: '💥 20% Off Audio & Wearables',
    discountPercent: 20,
    freeShipping: true,
    minSpendUSD: 80,
    expiresAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    isActive: true,
    bannerText: '🎧 FLASH SALE: 20% off all Headphones, Soundbars & Smartwatches with code FLASH20'
  }
];

export const INITIAL_ORDERS: import('../types').Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'VOLTS-89210',
    userId: 'cust-demo-1',
    customer: {
      name: 'Kasun Perera',
      email: 'kasun.p@gmail.com',
      phone: '+94 77 123 4567',
      address: '42/B, Galle Road, Bambalapitiya',
      city: 'Colombo',
      district: 'Colombo',
      postalCode: '00400',
      notes: 'Please call before delivery'
    },
    items: [
      {
        productId: 'prod-xenofold-pro',
        title: 'XenoFold Pro 5G - Titanium Edition',
        price: 1799.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
        color: 'Midnight Titanium',
        storage: '256GB Included'
      }
    ],
    subtotal: 1799.00,
    discountAmount: 179.90,
    shippingFee: 0,
    total: 1619.10,
    currency: 'USD',
    paymentMethod: 'koko_bnpl',
    paymentStatus: 'paid',
    kokoInstallments: {
      totalInstallments: 3,
      amountPerInstallment: 539.70,
      paidInstallments: 1
    },
    status: 'dispatched',
    trackingNumber: 'LK-DOM-994821',
    courierName: 'Pronto Express Sri Lanka',
    estimatedDelivery: 'Tomorrow, by 4:00 PM',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Order placed via Koko BNPL' },
      { status: 'confirmed', timestamp: new Date(Date.now() - 80000000).toISOString(), note: 'Koko 1st installment verified' },
      { status: 'processing', timestamp: new Date(Date.now() - 60000000).toISOString(), note: 'Item packaged & inspected in Colombo 03 hub' },
      { status: 'dispatched', timestamp: new Date(Date.now() - 20000000).toISOString(), note: 'Handed over to Pronto Express (AWB: LK-DOM-994821)' }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'VOLTS-89211',
    userId: 'cust-demo-2',
    customer: {
      name: 'Nadeesha Senanayake',
      email: 'nadeesha.s@yahoo.com',
      phone: '+94 71 987 6543',
      address: '15/4 Peradeniya Road',
      city: 'Kandy',
      district: 'Kandy',
      postalCode: '20000'
    },
    items: [
      {
        productId: 'prod-sonicflow-pro',
        title: 'SonicFlow Pro Wireless Noise Canceling Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        color: 'Matte Obsidian'
      },
      {
        productId: 'prod-baseus-blade-100w',
        title: 'Baseus Blade 100W GaN Ultra-Slim Power Bank 20,000mAh',
        price: 89.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
        color: 'Obsidian Black'
      }
    ],
    subtotal: 389.98,
    discountAmount: 38.99,
    shippingFee: 0,
    total: 350.99,
    currency: 'USD',
    paymentMethod: 'ipg_card',
    paymentStatus: 'paid',
    status: 'processing',
    trackingNumber: 'LK-DOM-994822',
    courierName: 'Certis Lanka Logistics',
    estimatedDelivery: 'In 2 days',
    createdAt: new Date(Date.now() - 36000000).toISOString(),
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 36000000).toISOString(), note: 'Order placed online' },
      { status: 'confirmed', timestamp: new Date(Date.now() - 35000000).toISOString(), note: 'Card payment authorized via IPG' },
      { status: 'processing', timestamp: new Date(Date.now() - 10000000).toISOString(), note: 'Quality check completed, boxing for dispatch' }
    ]
  }
];

