import { Activity, Category, AudienceType, DayOfWeek, SkillLevel, RegularityType, GoalType, DeliveryMode, MeetingPlatform, BookingType } from '../types';
import { METRO_STATIONS, METRO_LINES } from '../../metro/data/metroData';

export const CATEGORIES: Category[] = [
  'All Categories',
  'Languages',
  'Sports',
  'Dance',
  'Music',
  'Arts',
  'Fitness',
  'Crafts',
  'Business',
  'Technology',
  'Personal Development',
  'Martial Arts',
  'Swimming',
  'Yoga & Pilates',
  'Coding & Robotics',
  'Business & Finance',
  'Photography',
  'Cooking',
  'Chess',
  'Theatre',
  'Public Speaking',
  'STEM',
  'Early Learning',
  'Exam Preparation',
  'Corporate Team Building',
  'Yoga',
  'Pilates',
  'Gym',
  'Tennis',
  'Badminton',
  'Pottery',
  'Singing',
  'Coding',
  'Data Analytics',
  'Finance',
  'Robotics',
  'Math',
  'English',
  'Ballet',
  'Football',
  'Gymnastics',
  'Art',
  'Painting',
  'Science Club',
  'Drama',
  'Team Building',
  'Leadership',
  'AI Workshops',
  'Excel',
  'Cybersecurity',
  'Project Management',
  'Design Thinking',
  'Innovation Workshops',
  'Sales Training',
  'Communication Skills',
];

export const SUB_SKILLS_MAP: Record<string, string[]> = {
  Languages: ['Conversational Russian', 'Business English', 'Spanish Beginners', 'German A2', 'Chinese HSK', 'French Fundamentals'],
  English: ['Conversational English', 'Business English', 'IELTS Prep', 'TOEFL Intensive'],
  Sports: ['Tennis', 'Badminton', 'Football', 'Gymnastics', 'Swimming', 'Ice Skating'],
  Tennis: ['Clay Court Tennis', 'Indoor Hard Court Tennis', 'Beginner Tennis Clinic'],
  Badminton: ['Rally Techniques', 'Doubles Tactics', 'Badminton Agility'],
  Football: ['Futsal Footwork', 'Junior Football Tactics', 'Penalty & Striker Clinic'],
  Gymnastics: ['Rhythmic Gymnastics', 'Tumbling & Acrobatic Gymnastics', 'Core Agility'],
  Dance: ['Bolshoi Classical Ballet', 'Argentine Tango', 'Bachata & Salsa', 'Contemporary Dance', 'Hip Hop Urban', 'Ballet'],
  Ballet: ['Classical Vaganova Ballet', 'Pre-Ballet Grace', 'Adult Ballet Pointe'],
  Music: ['Acoustic & Electric Guitar', 'Classical Piano', 'Vocal Coaching', 'Drums & Rhythm', 'Violin', 'Singing'],
  Singing: ['Vocal Pitch & Resonance', 'Pop & Jazz Vocals', 'Opera Technique'],
  Arts: ['Oil Painting', 'Watercolor Landscapes', 'Pottery & Ceramics', 'Art History', 'Painting', 'Sketching'],
  Art: ['Academic Drawing', 'Watercolor', 'Acrylic Painting'],
  Painting: ['Oil Painting on Canvas', 'Botanical Watercolor', 'Portrait Sketching'],
  Crafts: ['Stained Glass', 'Pottery Wheel', 'Leatherworking', 'Wood Sculpting', 'Pottery'],
  Pottery: ['Potter Wheel Throwing', 'Glazing & Firing', 'Sculptural Clay'],
  Fitness: ['Functional CrossFit', 'Gym Strength Training', 'High-Intensity Cardio', 'Pilates Reformer', 'Gym'],
  Gym: ['Powerlifting Fundamentals', 'Body Sculpting', 'Personal Trainer Strength'],
  Yoga: ['Vinyasa Flow', 'Hatha Yoga', 'Yin Yoga & Meditation', 'Rooftop Sunset Yoga'],
  Pilates: ['Reformer Pilates Core', 'Mat Pilates & Spine Posture', 'Clinical Pilates'],
  'Yoga & Pilates': ['Vinyasa Flow', 'Reformer Pilates Core', 'Yin Yoga & Breathwork'],
  Business: ['Public Speaking', 'Leadership', 'Project Management', 'Finance', 'Design Thinking', 'Sales Training'],
  Finance: ['Corporate Financial Modeling', 'Personal Asset Allocation', 'Investment Analysis'],
  Leadership: ['Executive Leadership', 'High-Performance Team Coaching', 'Strategic Decision Making'],
  Technology: ['React & AI Full-stack', 'Python Data & Machine Learning', 'UI/UX Design', 'Coding', 'Data Analytics', 'Cybersecurity'],
  Coding: ['Full-stack Web Dev', 'Python Scripting', 'React 19 Apps', 'TypeScript Essentials'],
  'Data Analytics': ['SQL BI Dashboarding', 'Python Data Analysis', 'Power BI & Tableau'],
  Cybersecurity: ['Ethical Hacking', 'Enterprise Network Defense', 'Cyber Threat Intelligence'],
  'Personal Development': ['Chess Strategy', 'Creative Writing', 'Mindfulness & Speed Reading', 'Communication Skills'],
  'Communication Skills': ['Conflict Resolution', 'Cross-Cultural Communication', 'Executive Persuasion'],
  'Coding & Robotics': ['Scratch & Python Kids', 'Arduino Robotics', 'Roblox 3D Game Dev', 'Robotics'],
  Robotics: ['Arduino Sensors & Motors', 'Lego Mindstorms Lab', 'Autonomous Robot Code'],
  STEM: ['Physics & Electronics', 'Space Exploration Club', 'Science Club', 'Math Olympiad'],
  Math: ['Olympiad Logic Math', 'Mental Arithmetic', 'Algebra & Geometry Challenge'],
  'Science Club': ['Chemical Reactions Lab', 'Microbiology & Nature', 'Physics Experiments'],
  'Early Learning': ['Montessori Early Skills', 'Sensory Play Studio', 'Toddler Music & Motion'],
  Theatre: ['Acting & Stage Speech', 'Improv Theatre', 'Drama Studio'],
  Drama: ['Musical Drama', 'Youth Stage Acting', 'Voiceover & Expression'],
  'Public Speaking': ['Executive Rhetoric', 'TED Talk Storytelling', 'Stage Presence & Pitch'],
  'Corporate Team Building': ['Corporate Pottery Workshop', 'Executive Culinary Challenge', 'Team Building Quest'],
  'Team Building': ['Corporate Escape Quest', 'Team Culinary Cookoff', 'Outdoor Leadership Challenge'],
  'AI Workshops': ['Generative AI for Business', 'Prompt Engineering', 'AI Automation Pipelines'],
  Excel: ['Advanced Excel & VBA', 'Power Query Data Pipelines', 'Financial Dashboards'],
  'Project Management': ['Agile Scrum Master', 'PMP Exam Prep', 'Jira Sprint Governance'],
  'Design Thinking': ['UX Prototyping Workshop', 'Human-Centered Innovation', 'Design Sprints'],
  'Innovation Workshops': ['Corporate Disruptive Innovation', 'Product Incubator Sprint'],
  'Sales Training': ['B2B Sales Enterprise Strategy', 'High-Stakes Negotiation', 'Sales Psychology'],
};

const IMAGES_BY_CATEGORY: Record<string, string[]> = {
  Languages: [
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
  ],
  English: [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
  ],
  Fitness: [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
  ],
  Gym: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
  ],
  Yoga: [
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
  ],
  Pilates: [
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
  ],
  Dance: [
    'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
  ],
  Ballet: [
    'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=600&q=80',
  ],
  Crafts: [
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
  ],
  Pottery: [
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
  ],
  Music: [
    'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
  ],
  Singing: [
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80',
  ],
  Sports: [
    'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=600&q=80',
  ],
  Tennis: [
    'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80',
  ],
  Badminton: [
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
  ],
  Football: [
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
  ],
  Gymnastics: [
    'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=600&q=80',
  ],
  Swimming: [
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80',
  ],
  Technology: [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
  ],
  Coding: [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
  ],
  Robotics: [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
  ],
  'Data Analytics': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
  ],
  Arts: [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
  ],
  Painting: [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
  ],
  Art: [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
  ],
  Business: [
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
  ],
  Finance: [
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
  ],
  Leadership: [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
  ],
  'Public Speaking': [
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
  ],
  'Personal Development': [
    'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=600&q=80',
  ],
  Chess: [
    'https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=600&q=80',
  ],
  Cooking: [
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
  ],
  Photography: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
  ],
  Theatre: [
    'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=600&q=80',
  ],
  Drama: [
    'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=600&q=80',
  ],
  STEM: [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
  ],
  Math: [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
  ],
  'Science Club': [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
  ],
  'Early Learning': [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
  ],
  'Team Building': [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
  ],
  'AI Workshops': [
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
  ],
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=600&q=80';

// Station realistic address map
const STATION_STREETS: Record<string, string[]> = {
  'okhotny-ryad': ['ul. Okhotny Ryad 2', 'Gazetny Pereulok 5', 'Nikitsky Pereulok 8', 'ul. Tverskaya 4', 'Manezhnaya Ploshchad 1'],
  'park-kultury': ['Krymsky Val 9', 'ul. Ostozhenka 32', 'Komsomolsky Prospekt 14', 'Timura Frunze 11', 'Zubovsky Bulvar 21'],
  'chistye-prudy': ['Chistoprudny Bulvar 12', 'ul. Myasnitskaya 24', 'ul. Pokrovka 19', 'Potapovsky Pereulok 6', 'Armyansky Pereulok 4'],
  'sokolniki': ['Sokolnichesky Val 1', 'ul. Rusakovskaya 28', 'ul. Stromynka 10', 'Poperechny Prosek 4', 'Peschanaya Alley 7'],
  'vorobyovy-gory': ['Vorobyevskoye Shosse 4', 'Universitetsky Prospekt 13', 'ul. Kosygina 17', 'Michurinsky Prospekt 6', 'Mendeleevskaya ul. 3'],
  'mayakovskaya': ['ul. Bolshaya Sadovaya 14', '1st Tverskoy-Yamskoy Pereulok 8', 'ul. Malaya Bronnaya 22', 'Sadovaya-Triumfalnaya 5', 'Tverskaya-Yamskaya 16'],
  'tverskaya': ['ul. Tverskaya 18', 'Pushkinskaya Ploshchad 3', 'Strastnoy Bulvar 8', 'Tverskoy Bulvar 15', 'ul. Malaya Dmitrovka 12'],
  'teatralnaya': ['Teatralny Proyezd 5', 'ul. Petrovka 10', 'ul. Rozhdestvenka 7', 'Neglinnaya ul. 14', 'Kuznetsky Most 18'],
  'novokuznetskaya': ['ul. Pyatnitskaya 25', 'Lavrushinsky Pereulok 10', 'ul. Novokuznetskaya 14', 'Klimentovsky Pereulok 6', 'Bolshaya Ordynka 31'],
  'paveletskaya': ['Paveletskaya Ploshchad 2', 'ul. Valovaya 35', 'Kosmodamianskaya Naberezhnaya 52', 'Zatsepsky Val 8', 'Derbenevskaya ul. 15'],
  'arbatskaya': ['ul. Novy Arbat 15', 'ul. Stary Arbat 28', 'Nikitsky Bulvar 12', 'Vozdvizhenka 9', 'Maly Kislovsky Pereulok 4'],
  'ploshchad-revolyutsii': ['Ploshchad Revolyutsii 2', 'Nikolskaya ul. 17', 'ul. Ilinka 8', 'Vetoshny Pereulok 5', 'Bogoyavlensky Pereulok 3'],
  'smolenskaya': ['Smolenskaya-Sennaya Ploshchad 27', 'Smolensky Bulvar 19', 'Denezhny Pereulok 11', 'Protochny Pereulok 8', 'Glazovsky Pereulok 5'],
  'kiyevskaya': ['Ploshchad Kiyevskogo Vokzala 2', 'Berezhkovskaya Naberezhnaya 12', 'ul. Bryanskaya 5', 'Ukrainsky Bulvar 6', 'Bolshaya Dorogomilovskaya 14'],
  'komsomolskaya': ['Komsomolskaya Ploshchad 6', 'ul. Krasnoprudnaya 22', 'Novoryazanskaya ul. 18', 'Orlikov Pereulok 5', 'ul. Kalanchevskaya 15'],
  'prospekt-mira': ['Prospekt Mira 40', 'ul. Schepkina 28', 'Gilyarovskogo ul. 15', 'Botanichesky Pereulok 7', 'Grokholsky Pereulok 10'],
  'belorusskaya': ['Lesnaya ul. 5', 'Leningradsky Prospekt 18', '1st Tverskaya-Yamskaya 32', '3rd Yamskogo Polya ul. 12', 'Butyrsky Val 10'],
  'krasnopresnenskaya': ['ul. Krasnaya Presnya 24', 'Druzhinnikovskaya ul. 15', 'Konyushkovskaya ul. 31', 'Zamotoryannny Pereulok 6', 'Rochdelskaya ul. 15'],
  'dobryninskaya': ['Serpukhovskaya Ploshchad 36', 'ul. Bolshaya Serpukhovskaya 14', 'ul. Lyusinovskaya 22', 'Korovy Val 7', 'Valovaya ul. 18'],
  'taganskaya': ['Taganskaya Ploshchad 86', 'ul. Taganskaya 19', 'ul. Radischevskaya 10', 'Marksistskaya ul. 24', 'Goncharnaya ul. 12'],
  'kurskaya': ['ul. Zemlyanoy Val 33', 'Nizhnyaya Syromyatnicheskaya 10 (Artplay)', 'Kazakova ul. 18', 'Kostomarovsky Pereulok 7', 'Lyalin Pereulok 14'],
  'delovoy-tsentr': ['Presnenskaya Naberezhnaya 12 (Federation Tower)', 'Testovskaya ul. 10 (OKO Tower)', '1st Krasnogvardeysky Proyezd 21', 'Moscow City Empire Tower', 'Presnenskaya Nab. 8'],
  'cska': ['Khodynsky Bulvar 4', 'Aviakonstruktora Mikoyana 12', 'Grizodubovoy ul. 8', 'Chapaevsky Pereulok 5', 'Leningradsky Prospekt 39'],
  'savyolovskaya': ['ul. Savyolovskoy Linii 5', 'Skladskaya ul. 12', 'Butyrskaya ul. 77', 'Suschevsky Val 5', '2nd Kvesisskaya ul. 9'],
  'pushkinskaya': ['Pushkinskaya Ploshchad 1', 'ul. Malaya Dmitrovka 8', 'Strastnoy Bulvar 4', 'Bolshoy Kozikhinsky 12', 'ul. Tverskaya 20'],
  'barrikadnaya': ['ul. Barrikadnaya 19', 'Bolshaya Gruzinskaya 12', 'ul. Krasnaya Presnya 8', 'Kudrinskaya Ploshchad 1', 'Sadovaya-Kudrinskaya 14'],
  'kuznetsky-most': ['ul. Kuznetsky Most 12', 'ul. Rozhdestvenka 5', 'Neglinnaya ul. 10', 'ul. Petrovka 16', 'Pushechnaya ul. 7'],
  'tushinskaya': ['Tushinskaya ul. 14', 'Proezd Stroiteley 6', 'Volokolamskoye Shosse 88', 'ul. Svobody 20', 'Skhodnenskaya ul. 12'],
};

interface RawBlueprint {
  baseTitle: string;
  category: Category;
  subSkill: string;
  shortDesc: string;
  fullDesc: string;
  outcomes: string[];
  tags: string[];
  goals: GoalType[];
  teacherName: string;
  teacherTitle: string;
  teacherDeg: string;
  studioNameSuffix: string;
  basePrice: number;
  baseTrialPrice: number;
}

// 12 ADULT BLUEPRINTS
const ADULT_BLUEPRINTS: RawBlueprint[] = [
  {
    baseTitle: 'Conversational Russian & Cultural Salon',
    category: 'Languages',
    subSkill: 'Conversational Russian',
    shortDesc: 'Master fluid conversational Russian, urban idioms, and etiquette in an engaging salon environment.',
    fullDesc: 'Immersive language sessions focusing on real-world dialogue, Russian idioms, literature discussions, and cultural etiquette.',
    outcomes: ['Hold fluid 30-minute conversations', 'Master Moscow Metro & restaurant Russian', 'Understand local idioms & humor'],
    tags: ['Russian', 'Conversational', 'Social', 'Languages'],
    goals: ['Learn', 'Meet People'],
    teacherName: 'Elena Volkova',
    teacherTitle: 'Senior Philologist (MSU)',
    teacherDeg: 'MA in Russian Philology',
    studioNameSuffix: 'Language Loft',
    basePrice: 2200,
    baseTrialPrice: 1500,
  },
  {
    baseTitle: 'Vinyasa Sunset Yoga & Breathwork',
    category: 'Yoga',
    subSkill: 'Vinyasa Flow',
    shortDesc: 'Energizing Vinyasa flows, postural lengthening, and meditative breathwork.',
    fullDesc: 'Flow through core stability sequences, spinal decompression, and Pranayama breathwork designed to release city workday stress.',
    outcomes: ['Improve core posture & flexibility', 'Master Pranayama stress reduction', 'Build full-body stamina'],
    tags: ['Yoga', 'Sunset', 'Relaxation', 'Breathwork'],
    goals: ['Exercise', 'Relax'],
    teacherName: 'Sofia Smirnova',
    teacherTitle: 'E-RYT 500 Yoga Instructor',
    teacherDeg: 'BS in Kinesiology',
    studioNameSuffix: 'Movement Studio',
    basePrice: 2500,
    baseTrialPrice: 0, // Free Trial
  },
  {
    baseTitle: 'Bolshoi Technique Classical Ballet',
    category: 'Ballet',
    subSkill: 'Classical Vaganova Ballet',
    shortDesc: 'Authentic Vaganova ballet barre and posture training for adults.',
    fullDesc: 'Learn classic posture, turnout, grace, and expressive choreography taught by former opera and ballet artists.',
    outcomes: ['Master barre posture & turnout', 'Improve flexibility and poise', 'Learn classical variation pieces'],
    tags: ['Ballet', 'Grace', 'Dance', 'Posture'],
    goals: ['Learn', 'Exercise', 'Create'],
    teacherName: 'Anastasia Petrovskaya',
    teacherTitle: 'Former Bolshoi Ballet Artist',
    teacherDeg: 'Vaganova Choreography Academy',
    studioNameSuffix: 'Ballet Atelier',
    basePrice: 2800,
    baseTrialPrice: 1800,
  },
  {
    baseTitle: 'Pottery Wheel Throwing & Ceramics',
    category: 'Pottery',
    subSkill: 'Potter Wheel Throwing',
    shortDesc: 'Throw clay on a potter wheel and craft custom glazed ceramic vessels.',
    fullDesc: 'Unplug and shape raw clay with your hands. Learn wheel throwing, trimming, and glaze finishing with master ceramicists.',
    outcomes: ['Throw clay vessels on the wheel', 'Apply traditional botanical glazes', 'Take home 2 glazed ceramic pieces'],
    tags: ['Pottery', 'Ceramics', 'Crafts', 'Hands-on'],
    goals: ['Create', 'Relax', 'Meet People'],
    teacherName: 'Mikhail Romanov',
    teacherTitle: 'Master Ceramicist',
    teacherDeg: 'Stroganov Academy of Arts',
    studioNameSuffix: 'Clay & Flame Studio',
    basePrice: 3200,
    baseTrialPrice: 2200,
  },
  {
    baseTitle: 'Classical Piano Performance & Sight-Reading',
    category: 'Music',
    subSkill: 'Classical Piano',
    shortDesc: 'Piano technique, chord theory, and sight-reading on grand pianos.',
    fullDesc: 'Study piano performance, sight-reading, chord progressions, and classical repertoire in an intimate acoustic room.',
    outcomes: ['Read treble and bass clef music', 'Play classic pieces by Tchaikovsky & Chopin', 'Master proper finger technique'],
    tags: ['Piano', 'Music Theory', 'Classical', 'Music'],
    goals: ['Learn', 'Create', 'Relax'],
    teacherName: 'Dmitry Orlov',
    teacherTitle: 'Concert Pianist',
    teacherDeg: 'Moscow State Conservatory DMA',
    studioNameSuffix: 'Music Salon',
    basePrice: 3500,
    baseTrialPrice: 2000,
  },
  {
    baseTitle: 'Clay Court Tennis Stroke Clinic',
    category: 'Tennis',
    subSkill: 'Clay Court Tennis',
    shortDesc: 'Refine forehand power, serve mechanics, and court footwork.',
    fullDesc: 'Train under certified Russian Tennis Federation coaches focusing on stroke biomechanics, footwork, and match play tactics.',
    outcomes: ['Master forehand topspin & flat serve', 'Improve court agility & footwork', 'Participate in match play'],
    tags: ['Tennis', 'Sports', 'Clay Court', 'Outdoor'],
    goals: ['Exercise', 'Meet People'],
    teacherName: 'Igor Kuznetsov',
    teacherTitle: 'RTF Certified Head Coach',
    teacherDeg: 'BS in Physical Culture',
    studioNameSuffix: 'Tennis Club',
    basePrice: 2900,
    baseTrialPrice: 1900,
  },
  {
    baseTitle: 'Reformer Pilates Core Alignment',
    category: 'Pilates',
    subSkill: 'Reformer Pilates Core',
    shortDesc: 'Reformer machine core stability, spinal decompression, and posture.',
    fullDesc: 'Intimate reformer machine workouts targeting deep abdominal strength, spinal lengthening, and pain-free posture restoration.',
    outcomes: ['Decompress spine compression', 'Strengthen deep core stabilizers', 'Restore posture alignment'],
    tags: ['Pilates', 'Reformer', 'Posture', 'Fitness'],
    goals: ['Exercise', 'Relax'],
    teacherName: 'Ksenia Sorokina',
    teacherTitle: 'Polestar Pilates Educator',
    teacherDeg: 'BS in Kinesiology',
    studioNameSuffix: 'Reformer Lab',
    basePrice: 3200,
    baseTrialPrice: 0, // Free Trial
  },
  {
    baseTitle: 'Urban Architecture Photography Studio',
    category: 'Photography',
    subSkill: 'Architecture Photography',
    shortDesc: 'Capture street geometry, portrait lighting, and modern urban scenes.',
    fullDesc: 'Hands-on photography workshops teaching manual exposure, composition rules, lighting setups, and Lightroom editing.',
    outcomes: ['Control manual camera shutter & ISO', 'Compose architectural leading lines', 'Edit RAW files in Lightroom'],
    tags: ['Photography', 'Architecture', 'Urban', 'Arts'],
    goals: ['Create', 'Learn'],
    teacherName: 'Artemy Sobolev',
    teacherTitle: 'Professional Photographer',
    teacherDeg: 'BA in Visual Arts',
    studioNameSuffix: 'Photo Atelier',
    basePrice: 3000,
    baseTrialPrice: 1800,
  },
  {
    baseTitle: 'Italian Pasta & Artisanal Cooking Masterclass',
    category: 'Cooking',
    subSkill: 'Italian Pasta Masterclass',
    shortDesc: 'Handcraft fresh pasta dough, handmade ravioli, and rich classic sauces.',
    fullDesc: 'Interactive culinary workshop guided by expert chefs. Roll fresh egg pasta dough, fill ravioli, and enjoy a communal dinner.',
    outcomes: ['Make fresh egg pasta dough from scratch', 'Prepare classic carbonara & pesto sauces', 'Master kitchen knife skills'],
    tags: ['Cooking', 'Culinary', 'Food', 'Social'],
    goals: ['Create', 'Meet People', 'Relax'],
    teacherName: 'Chef Mateo Rossi',
    teacherTitle: 'Executive Culinary Chef',
    teacherDeg: 'ALMA Culinary Institute',
    studioNameSuffix: 'Culinary Studio',
    basePrice: 3800,
    baseTrialPrice: 2800,
  },
  {
    baseTitle: 'Grandmaster Chess Strategy & Tactics',
    category: 'Chess',
    subSkill: 'Grandmaster Tactics',
    shortDesc: 'Master opening principles, positional sacrifices, and endgame tactics.',
    fullDesc: 'Analyze legendary Russian grandmaster games, solve tactical puzzles, and sharpen competitive calculation under timed conditions.',
    outcomes: ['Calculate 4-move tactical combinations', 'Master classic pawn structure plans', 'Increase FIDE chess rating'],
    tags: ['Chess', 'Strategy', 'Tactics', 'Personal Development'],
    goals: ['Learn', 'Meet People'],
    teacherName: 'GM Yuri Korobov',
    teacherTitle: 'International Grandmaster',
    teacherDeg: 'MSU Chess Coaching Degree',
    studioNameSuffix: 'Chess Guild',
    basePrice: 2600,
    baseTrialPrice: 1500,
  },
  {
    baseTitle: 'Olympic Pool Swimming Technique Clinic',
    category: 'Swimming',
    subSkill: 'Olympic Pool Technique',
    shortDesc: 'Master freestyle stroke mechanics, flip turns, and efficient breathing.',
    fullDesc: 'Improve stroke efficiency, hydrodynamics, underwater kicks, and breathing rhythm under elite swim coaching.',
    outcomes: ['Reduce stroke count per lap', 'Master flip turns & streamlined kicks', 'Build aerobic swim stamina'],
    tags: ['Swimming', 'Sports', 'Pool', 'Fitness'],
    goals: ['Exercise'],
    teacherName: 'Denis Tarasov',
    teacherTitle: 'Master of Sports Swim Coach',
    teacherDeg: 'BS in Physical Education',
    studioNameSuffix: 'Aquatic Center',
    basePrice: 2700,
    baseTrialPrice: 1600,
  },
  {
    baseTitle: 'Functional CrossFit & Gym Power Conditioning',
    category: 'Gym',
    subSkill: 'Powerlifting Fundamentals',
    shortDesc: 'High-intensity functional movement, barbell deadlifts, and mobility.',
    fullDesc: 'Comprehensive functional strength program emphasizing compound lifting mechanics, mobility work, and metabolic conditioning.',
    outcomes: ['Master squat & deadlift mechanics', 'Increase explosive power output', 'Burn fat & build lean muscle'],
    tags: ['Gym', 'Fitness', 'CrossFit', 'Strength'],
    goals: ['Exercise'],
    teacherName: 'Maxim Yakovlev',
    teacherTitle: 'Certified Strength Coach',
    teacherDeg: 'CSCS Certified Specialist',
    studioNameSuffix: 'Fitness Club',
    basePrice: 2400,
    baseTrialPrice: 0, // Free Trial
  },
];

// 10 CHILD BLUEPRINTS
const CHILD_BLUEPRINTS: RawBlueprint[] = [
  {
    baseTitle: 'Youth Physics, Robotics & Sensor Lab',
    category: 'Robotics',
    subSkill: 'Arduino Sensors & Motors',
    shortDesc: 'Build robot circuits, program sensors, and solve fun STEM challenges.',
    fullDesc: 'Hands-on electronics lab where children assemble Arduino sensors, motors, and code Scratch navigation algorithms.',
    outcomes: ['Assemble electronic sensor circuits', 'Program Scratch navigation code', 'Build autonomous robots'],
    tags: ['Robotics', 'STEM', 'Kids', 'Coding'],
    goals: ['Kids', 'Learn'],
    teacherName: 'Dr. Nikolai Sidorov',
    teacherTitle: 'MSU Robotics Educator',
    teacherDeg: 'PhD in Robotics (MSU)',
    studioNameSuffix: 'Youth STEM Lab',
    basePrice: 2500,
    baseTrialPrice: 1800,
  },
  {
    baseTitle: 'Kids 3D Roblox Game Dev & Lua Coding',
    category: 'Coding',
    subSkill: 'Roblox 3D Game Dev',
    shortDesc: 'Code Lua scripts and publish original 3D games in Roblox Studio.',
    fullDesc: 'Interactive 3D game development workshop where children design obstacle courses and code Lua scripts for original Roblox games.',
    outcomes: ['Code Lua game mechanics', 'Build 3D interactive environments', 'Publish games online'],
    tags: ['Coding', 'Roblox', 'Kids', 'Game Dev'],
    goals: ['Kids', 'Learn'],
    teacherName: 'Timur Gafurov',
    teacherTitle: 'Game Dev Educator',
    teacherDeg: 'BS in Computer Science',
    studioNameSuffix: 'Kids Code Hub',
    basePrice: 2400,
    baseTrialPrice: 0, // Free Trial
  },
  {
    baseTitle: 'Children\u2019s Oil Painting & Master Sketching',
    category: 'Painting',
    subSkill: 'Oil Painting on Canvas',
    shortDesc: 'Paint still lifes, landscapes, and animals on canvas.',
    fullDesc: 'Nurture your child’s creative talent. Students experiment with oil paints, pastels, and watercolors while studying classic artworks.',
    outcomes: ['Understand color mixing & lighting', 'Paint canvas landscapes & still lifes', 'Develop fine motor artistic skills'],
    tags: ['Painting', 'Art', 'Kids', 'Creative'],
    goals: ['Kids', 'Create'],
    teacherName: 'Anna Voronova',
    teacherTitle: 'Fine Arts Educator',
    teacherDeg: 'MFA Surikov Art Institute',
    studioNameSuffix: 'Youth Art Guild',
    basePrice: 2600,
    baseTrialPrice: 1800,
  },
  {
    baseTitle: 'Olympiad Math & Logical Puzzles Club',
    category: 'Math',
    subSkill: 'Olympiad Logic Math',
    shortDesc: 'Sharpen analytical reasoning, spatial puzzles, and math Olympiad problems.',
    fullDesc: 'Enriching math academy for children to develop logical thinking, spatial visualization, and creative problem solving.',
    outcomes: ['Solve 3-step logical deduction puzzles', 'Master spatial geometry visualizer', 'Excel in school math competitions'],
    tags: ['Math', 'STEM', 'Kids', 'Logic'],
    goals: ['Kids', 'Learn'],
    teacherName: 'Maria Semyonova',
    teacherTitle: 'Olympiad Math Coach',
    teacherDeg: 'MS in Mathematics (HSE)',
    studioNameSuffix: 'Math Olympiad Academy',
    basePrice: 2200,
    baseTrialPrice: 1400,
  },
  {
    baseTitle: 'Interactive Young English Explorers',
    category: 'English',
    subSkill: 'Conversational English',
    shortDesc: 'Fun English games, songs, roleplay, and vocabulary building for kids.',
    fullDesc: 'Immersive native English class for children using storytelling, games, and drama to build natural speaking confidence.',
    outcomes: ['Speak 100+ new English phrases', 'Master natural English pronunciation', 'Participate in group roleplay'],
    tags: ['English', 'Languages', 'Kids', 'Interactive'],
    goals: ['Kids', 'Learn'],
    teacherName: 'Sarah Jenkins',
    teacherTitle: 'Native English Educator',
    teacherDeg: 'BA in Education (Oxford)',
    studioNameSuffix: 'Kids English Club',
    basePrice: 2300,
    baseTrialPrice: 0, // Free Trial
  },
  {
    baseTitle: 'Youth Swim Academy & Stroke Mechanics',
    category: 'Swimming',
    subSkill: 'Junior Water Safety',
    shortDesc: 'Freestyle kicking, breathing rhythm, and water safety for kids.',
    fullDesc: 'Patient youth swim coaching focusing on floatation, kicking rhythm, and freestyle stroke mechanics in heated pools.',
    outcomes: ['Master freestyle stroke & breathing', 'Build water safety confidence', 'Increase swim stamina'],
    tags: ['Swimming', 'Sports', 'Kids', 'Water'],
    goals: ['Kids', 'Exercise'],
    teacherName: 'Vadim Semenov',
    teacherTitle: 'Youth Swim Coach',
    teacherDeg: 'BS in Physical Culture',
    studioNameSuffix: 'Youth Swim Academy',
    basePrice: 2200,
    baseTrialPrice: 1500,
  },
  {
    baseTitle: 'Junior Football Academy & Ball Control',
    category: 'Football',
    subSkill: 'Futsal Footwork',
    shortDesc: 'Dribbling agility, passing precision, and indoor futsal games.',
    fullDesc: 'Dynamic football clinic for children emphasizing ball mastery, team passing, agility drills, and friendly weekend matches.',
    outcomes: ['Master 1v1 dribbling moves', 'Improve passing accuracy & agility', 'Play team match games'],
    tags: ['Football', 'Sports', 'Kids', 'Teamwork'],
    goals: ['Kids', 'Exercise', 'Meet People'],
    teacherName: 'Roman Gusev',
    teacherTitle: 'UEFA Licensed Youth Coach',
    teacherDeg: 'BS in Sports Coaching',
    studioNameSuffix: 'Junior Football Club',
    basePrice: 2100,
    baseTrialPrice: 1400,
  },
  {
    baseTitle: 'Youth Gymnastics & Tumbling Academy',
    category: 'Gymnastics',
    subSkill: 'Tumbling & Acrobatic Gymnastics',
    shortDesc: 'Acrobatic tumbling, balance beam, flexibility, and core coordination.',
    fullDesc: 'Encouraging gymnastics training teaching cartwheels, back handspring basics, flexibility, and core body control.',
    outcomes: ['Execute clean cartwheels & handstands', 'Improve full-body flexibility', 'Build safe tumbling techniques'],
    tags: ['Gymnastics', 'Sports', 'Kids', 'Agility'],
    goals: ['Kids', 'Exercise'],
    teacherName: 'Yulia Zaitseva',
    teacherTitle: 'Gymnastics Master of Sports',
    teacherDeg: 'BS in Physical Culture',
    studioNameSuffix: 'Gymnastics Center',
    basePrice: 2400,
    baseTrialPrice: 1600,
  },
  {
    baseTitle: 'Young Scientists Chemical & Physics Lab',
    category: 'Science Club',
    subSkill: 'Chemical Reactions Lab',
    shortDesc: 'Safe chemical volcano experiments, microscope discovery, and physics.',
    fullDesc: 'Exhilarating science exploration club for children to conduct safe chemical reactions, inspect microscopic life, and build physics models.',
    outcomes: ['Conduct 10+ safe chemical experiments', 'Operate optical lab microscopes', 'Understand laws of motion & gravity'],
    tags: ['Science Club', 'STEM', 'Kids', 'Experiments'],
    goals: ['Kids', 'Learn'],
    teacherName: 'Dr. Pavel Isaev',
    teacherTitle: 'Chemist & Science Educator',
    teacherDeg: 'PhD in Chemistry',
    studioNameSuffix: 'Young Science Guild',
    basePrice: 2600,
    baseTrialPrice: 1800,
  },
  {
    baseTitle: 'Montessori Toddler Early Discovery',
    category: 'Early Learning',
    subSkill: 'Sensory Play Studio',
    shortDesc: 'Sensory play, motor skills, music, and social integration for toddlers.',
    fullDesc: 'Gentle Montessori early learning environment nurturing toddler independence, sensory exploration, and fine motor coordination.',
    outcomes: ['Develop fine motor hand grip', 'Build early social interaction', 'Enhance sensory color recognition'],
    tags: ['Early Learning', 'Montessori', 'Kids', 'Toddler'],
    goals: ['Kids', 'Learn'],
    teacherName: 'Ekaterina Larina',
    teacherTitle: 'Certified Montessori Specialist',
    teacherDeg: 'MA in Early Childhood Pedagogy',
    studioNameSuffix: 'Early Learning Center',
    basePrice: 2000,
    baseTrialPrice: 0, // Free Trial
  },
];

// 6 CORPORATE BLUEPRINTS
const CORPORATE_BLUEPRINTS: RawBlueprint[] = [
  {
    baseTitle: 'Executive Team Building Escape & Quest',
    category: 'Team Building',
    subSkill: 'Corporate Escape Quest',
    shortDesc: 'Immersive problem-solving quests designed to strengthen corporate team synergy.',
    fullDesc: 'High-stakes corporate team building quest combining strategic puzzles, role allocation, and collaborative pressure management.',
    outcomes: ['Boost cross-functional team trust', 'Improve high-pressure decision making', 'Enhance team problem solving'],
    tags: ['Team Building', 'Corporate', 'Leadership', 'Synergy'],
    goals: ['Meet People', 'Career'],
    teacherName: 'Victor Solovyov',
    teacherTitle: 'Corporate Team Facilitator',
    teacherDeg: 'MA in Organizational Psychology',
    studioNameSuffix: 'Corporate Quest Hub',
    basePrice: 4500,
    baseTrialPrice: 3000,
  },
  {
    baseTitle: 'Corporate Leadership & High-Performance Teams',
    category: 'Leadership',
    subSkill: 'Executive Leadership',
    shortDesc: 'Strategic leadership, feedback culture, and executive delegation frameworks.',
    fullDesc: 'Transformative leadership seminar for managers covering motivation frameworks, constructive feedback loops, and strategic OKR alignment.',
    outcomes: ['Master 360-degree feedback frameworks', 'Align team OKRs with company strategy', 'Reduce team burnout & turnover'],
    tags: ['Leadership', 'Business', 'Corporate', 'Executive'],
    goals: ['Career', 'Learn'],
    teacherName: 'Dr. Andrei Kazakov',
    teacherTitle: 'Executive Leadership Coach',
    teacherDeg: 'PhD in Business Management (INSEAD)',
    studioNameSuffix: 'Leadership Institute',
    basePrice: 5200,
    baseTrialPrice: 3500,
  },
  {
    baseTitle: 'Public Speaking & Executive Rhetoric Masterclass',
    category: 'Public Speaking',
    subSkill: 'Executive Rhetoric',
    shortDesc: 'Executive presence, vocal resonance, stage presence, and persuasive pitching.',
    fullDesc: 'Gain commanding vocal presence and persuasive presentation skills. Practice live on stage with instant video feedback from speech directors.',
    outcomes: ['Eliminate stage fright & filler words', 'Structure 3-act executive pitches', 'Master vocal resonance and gestures'],
    tags: ['Public Speaking', 'Rhetoric', 'Executive', 'Career'],
    goals: ['Career', 'Learn'],
    teacherName: 'Valery Morozov',
    teacherTitle: 'Executive Speech Director',
    teacherDeg: 'MA GITIS Theatre Arts',
    studioNameSuffix: 'Rhetoric Institute',
    basePrice: 4800,
    baseTrialPrice: 3200,
  },
  {
    baseTitle: 'Generative AI Prompts & Workflow Automation',
    category: 'AI Workshops',
    subSkill: 'Prompt Engineering',
    shortDesc: 'Leverage LLM prompt engineering to automate marketing, sales, and analytics.',
    fullDesc: 'Business automation workshop teaching corporate managers how to write precision prompts and connect AI workflows for enterprise productivity.',
    outcomes: ['Master ChatGPT & Claude custom prompts', 'Automate daily email & reporting workflows', 'Build enterprise AI productivity pipelines'],
    tags: ['AI Workshops', 'Technology', 'Corporate', 'Automation'],
    goals: ['Career', 'Learn'],
    teacherName: 'Kirill Rodionov',
    teacherTitle: 'Enterprise AI Architect',
    teacherDeg: 'MS in Computer Science (MIPT)',
    studioNameSuffix: 'AI Automation Lab',
    basePrice: 5000,
    baseTrialPrice: 0, // Free Trial
  },
  {
    baseTitle: 'Advanced Corporate Excel & Financial Modeling',
    category: 'Excel',
    subSkill: 'Advanced Excel & VBA',
    shortDesc: 'Power Query, INDEX-MATCH formulas, macros, and dynamic financial dashboards.',
    fullDesc: 'Master-level Excel workshop for financial analysts and operations managers focusing on complex formulas, Power Pivot, and automated VBA scripts.',
    outcomes: ['Build automated Power Query data pipelines', 'Design interactive executive dashboards', 'Model 3-statement financial forecasts'],
    tags: ['Excel', 'Finance', 'Data', 'Corporate'],
    goals: ['Career', 'Learn'],
    teacherName: 'Olga Tarasova',
    teacherTitle: 'Corporate Financial Modeler',
    teacherDeg: 'MA in Finance (HSE)',
    studioNameSuffix: 'Excel Financial Academy',
    basePrice: 4200,
    baseTrialPrice: 2800,
  },
  {
    baseTitle: 'Corporate Data Analytics & Executive Dashboards',
    category: 'Data Analytics',
    subSkill: 'SQL BI Dashboarding',
    shortDesc: 'SQL queries, Power BI data visualization, and business intelligence metrics.',
    fullDesc: 'Comprehensive data analytics course for enterprise teams teaching SQL query optimization, database design, and executive Tableau/Power BI reports.',
    outcomes: ['Write complex multi-table SQL queries', 'Build real-time Power BI dashboards', 'Extract actionable business insights'],
    tags: ['Data Analytics', 'Technology', 'Corporate', 'SQL'],
    goals: ['Career', 'Learn'],
    teacherName: 'Sergei Voronov',
    teacherTitle: 'Principal BI Architect',
    teacherDeg: 'MS in Applied Math',
    studioNameSuffix: 'Data Intelligence Guild',
    basePrice: 4800,
    baseTrialPrice: 3000,
  },
];

// Generator function building the complete marketplace dataset across all 24 stations
function generateFullMarketplaceDataset(): Activity[] {
  const activities: Activity[] = [];

  const WEEKDAY_SETS: DayOfWeek[][] = [
    ['Monday', 'Wednesday'],
    ['Tuesday', 'Thursday'],
    ['Wednesday', 'Friday'],
    ['Monday', 'Thursday'],
    ['Tuesday', 'Friday'],
    ['Saturday', 'Sunday'],
    ['Saturday'],
    ['Sunday'],
    ['Monday', 'Wednesday', 'Friday'],
    ['Tuesday', 'Thursday', 'Saturday'],
  ];

  const MORNING_TIMES = [
    { start: '07:30', end: '08:45', dur: '75 mins', tod: 'Morning' as const },
    { start: '08:30', end: '09:45', dur: '75 mins', tod: 'Morning' as const },
    { start: '09:00', end: '10:30', dur: '90 mins', tod: 'Morning' as const },
    { start: '10:00', end: '11:30', dur: '90 mins', tod: 'Morning' as const },
    { start: '11:00', end: '12:30', dur: '90 mins', tod: 'Morning' as const },
  ];

  const AFTERNOON_TIMES = [
    { start: '13:00', end: '14:30', dur: '90 mins', tod: 'Afternoon' as const },
    { start: '14:30', end: '16:00', dur: '90 mins', tod: 'Afternoon' as const },
    { start: '15:30', end: '17:00', dur: '90 mins', tod: 'Afternoon' as const },
    { start: '16:00', end: '17:30', dur: '90 mins', tod: 'Afternoon' as const },
    { start: '17:00', end: '18:15', dur: '75 mins', tod: 'Afternoon' as const },
  ];

  const EVENING_TIMES = [
    { start: '18:00', end: '19:30', dur: '90 mins', tod: 'Evening' as const },
    { start: '18:30', end: '20:00', dur: '90 mins', tod: 'Evening' as const },
    { start: '19:00', end: '20:30', dur: '90 mins', tod: 'Evening' as const },
    { start: '19:30', end: '21:00', dur: '90 mins', tod: 'Evening' as const },
    { start: '20:00', end: '21:30', dur: '90 mins', tod: 'Evening' as const },
  ];

  const FREQUENCIES: RegularityType[] = [
    'Twice a Week',
    'Once a Week',
    'Weekly Program',
    'Multi-Session Program',
    'One-Time Workshop',
    'Intensive Program',
    'Three Times a Week',
  ];

  const LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  METRO_STATIONS.forEach((station, stationIdx) => {
    const lineObj = METRO_LINES.find((l) => l.id === station.lineId);
    const lineColor = lineObj?.color || '#10B981';
    const stationShortName = station.name.split(' ')[0];
    const streets = STATION_STREETS[station.id] || [`ul. ${stationShortName} 10`, `Prospekt ${stationShortName} 15`];

    let actSeqInStation = 0;

    // Helper to generate unique activity object
    const buildActivity = (
      bp: RawBlueprint,
      audience: AudienceType,
      typeIndex: number
    ): Activity => {
      actSeqInStation++;
      const actId = `act-${station.id}-${audience.toLowerCase()}-${typeIndex + 1}`;
      const streetAddress = `${streets[typeIndex % streets.length]}, Moscow`;
      const walkTime = (actSeqInStation % 4) + 2; // 2 to 5 mins walk
      const travelTime = (actSeqInStation % 5) + 8; // 8 to 12 mins travel

      // Determine schedule based on audience and sequence
      let timeSlot: { start: string; end: string; dur: string; tod: 'Morning' | 'Afternoon' | 'Evening' };
      if (audience === 'Children') {
        // Children activities are mostly morning or afternoon
        timeSlot = (actSeqInStation % 2 === 0) 
          ? MORNING_TIMES[(stationIdx + typeIndex) % MORNING_TIMES.length] 
          : AFTERNOON_TIMES[(stationIdx + typeIndex) % AFTERNOON_TIMES.length];
      } else if (audience === 'Corporate') {
        // Corporate activities are late afternoon or evening
        timeSlot = EVENING_TIMES[(stationIdx + typeIndex) % EVENING_TIMES.length];
      } else {
        // Adult activities mix morning, afternoon, evening
        const timeChoice = (actSeqInStation % 3);
        timeSlot = timeChoice === 0 ? MORNING_TIMES[(stationIdx + typeIndex) % MORNING_TIMES.length]
          : timeChoice === 1 ? AFTERNOON_TIMES[(stationIdx + typeIndex) % AFTERNOON_TIMES.length]
          : EVENING_TIMES[(stationIdx + typeIndex) % EVENING_TIMES.length];
      }

      const days = WEEKDAY_SETS[(stationIdx + actSeqInStation) % WEEKDAY_SETS.length];
      const freq = FREQUENCIES[(stationIdx + actSeqInStation) % FREQUENCIES.length];
      const level = LEVELS[(stationIdx + actSeqInStation) % LEVELS.length];

      // Unique title per station & blueprint
      const title = `${bp.baseTitle} at ${stationShortName}`;
      
      // Unique description incorporating specific station & street
      const shortDescription = `${bp.shortDesc} Located 2–4 mins walk from ${station.name} station on ${streetAddress}.`;
      const fullDescription = `${bp.fullDesc} Our ${stationShortName} studio at ${streetAddress} offers state-of-the-art facilities, certified master instructors, and a supportive community environment. Conveniently accessible from ${station.lineName}.`;

      // Unique pricing variations
      const regularPrice = bp.basePrice + ((typeIndex % 3) * 200);
      const isFreeTrial = bp.baseTrialPrice === 0 || (actSeqInStation % 5 === 0);
      const trialPrice = isFreeTrial ? 0 : bp.baseTrialPrice;

      // Select image
      const categoryImages = IMAGES_BY_CATEGORY[bp.category] || [DEFAULT_IMAGE];
      const coverImage = categoryImages[(stationIdx + typeIndex) % categoryImages.length];

      const availableSeats = (actSeqInStation % 6) + 2;
      const totalSeats = availableSeats + (actSeqInStation % 5) + 4;
      const rating = Number((4.75 + ((stationIdx + actSeqInStation) % 25) * 0.01).toFixed(2));
      const reviewCount = 15 + (stationIdx * 3) + (typeIndex * 7);
      const popularityScore = 85 + ((stationIdx + typeIndex) % 15);

      const studioName = `${stationShortName} ${bp.studioNameSuffix}`;
      const ageGroupStr = audience === 'Children' ? '6-15 years' : audience === 'Corporate' ? 'Corporate Teams' : '18+ Adults';

      // Determine delivery mode deterministically for realistic marketplace distribution
      const modeSeq = (stationIdx * 7 + typeIndex) % 4;
      let deliveryMode: DeliveryMode = 'In Person';
      let meetingPlatform: MeetingPlatform | undefined = undefined;
      let onlineSchedule: string | undefined = undefined;
      let bookingType: BookingType = 'Instant Booking';

      if (modeSeq === 1) {
        deliveryMode = 'Live Online';
        meetingPlatform = (typeIndex % 3 === 0) ? 'Zoom' : (typeIndex % 3 === 1) ? 'Google Meet' : 'Microsoft Teams';
        onlineSchedule = `Live Video Sessions • ${days.join(' & ')} ${timeSlot.start} - ${timeSlot.end}`;
        bookingType = 'Instant Booking';
      } else if (modeSeq === 2) {
        deliveryMode = 'Self-Paced';
        meetingPlatform = 'Custom Platform';
        onlineSchedule = '24/7 Lifetime On-Demand Access + Weekly Q&A';
        bookingType = 'Open Enrollment';
      } else if (modeSeq === 3) {
        deliveryMode = 'Hybrid';
        meetingPlatform = (typeIndex % 2 === 0) ? 'Zoom' : 'Google Meet';
        onlineSchedule = `In-Person Studio (${days[0]}s) & Live Webinar (${days[1] || days[0]}s)`;
        bookingType = 'Request Spot';
      } else {
        deliveryMode = 'In Person';
        bookingType = typeIndex % 2 === 0 ? 'Instant Booking' : 'Request Spot';
      }

      const startDayNum = 15 + ((stationIdx + typeIndex) % 15);
      const monthNameStr = (stationIdx + typeIndex) % 2 === 0 ? 'September' : 'October';
      const startDateStr = `${startDayNum} ${monthNameStr} 2026`;
      const regDayNum = Math.max(1, startDayNum - 2);
      const regDeadlineStr = `${regDayNum} ${monthNameStr} 2026`;

      const isWorkshop = freq === 'One-Time Workshop';
      // Determine if Program or Session
      // Education/Programs with multi-sessions, or single bookable sessions
      const isProgram = bp.baseTitle.toLowerCase().includes('program') || bp.baseTitle.toLowerCase().includes('academy') || (!isWorkshop && (typeIndex % 2 === 0));
      const programType = isProgram ? 'Program' as const : 'Session' as const;

      const durationWeeks = isWorkshop ? 1 : ((typeIndex % 3) + 1) * 4; // 4, 8, or 12 weeks
      const totalSessions = isWorkshop ? 1 : durationWeeks * (days.length || 1);
      const endDateStr = `${Math.min(startDayNum + 25, 30)} ${monthNameStr} 2026`;
      const weeklySched = `${days.join(' & ')} • ${timeSlot.start} - ${timeSlot.end}`;

      // Nested sessions for programs
      const nestedSessions = isProgram ? [
        {
          id: `${actId}-sess-1`,
          title: `Session 1: ${bp.outcomes[0] || 'Foundations & Principles'}`,
          sessionDate: startDateStr,
          sessionTime: `${timeSlot.start} - ${timeSlot.end}`,
          duration: timeSlot.dur,
          availableSeats,
          totalSeats,
          description: `Opening session focusing on ${bp.outcomes[0] || 'fundamental techniques'}.`
        },
        {
          id: `${actId}-sess-2`,
          title: `Session 2: ${bp.outcomes[1] || 'Guided Practice & Techniques'}`,
          sessionDate: `${days[1] || days[0]}, ${startDayNum + 3} ${monthNameStr} 2026`,
          sessionTime: `${timeSlot.start} - ${timeSlot.end}`,
          duration: timeSlot.dur,
          availableSeats: Math.max(1, availableSeats - 1),
          totalSeats,
          description: `Practical application on ${bp.outcomes[1] || 'skill refinement'}.`
        },
        {
          id: `${actId}-sess-3`,
          title: `Session 3: ${bp.outcomes[2] || 'Mastery & Evaluation'}`,
          sessionDate: `${days[0]}, ${startDayNum + 7} ${monthNameStr} 2026`,
          sessionTime: `${timeSlot.start} - ${timeSlot.end}`,
          duration: timeSlot.dur,
          availableSeats,
          totalSeats,
          description: `Advanced workshop on ${bp.outcomes[2] || 'real-world outcomes'}.`
        }
      ] : [];

      const sessionDateStr = startDateStr;
      const sessionTimeStr = `${timeSlot.start} - ${timeSlot.end}`;

        const trustData = {
          isVerified: true,
          isPremium: actSeqInStation % 3 === 0,
          isTopRated: rating >= 4.8,
          isCertified: true,
          isBackgroundChecked: audience === 'Children' || actSeqInStation % 2 === 0,
          yearsActive: 5 + (stationIdx % 10),
          verificationDate: 'Verified Jan 2026',
          licenseNumber: `LIC-${8900 + (stationIdx * 7) + typeIndex}-RU`,
        };

        return {
          id: actId,
          title,
          category: bp.category,
          subSkill: bp.subSkill,
          audience,
          providerTrust: trustData,

          // Program vs Session Architecture
          programType,
          startDate: startDateStr,
          endDate: endDateStr,
          weeklySchedule: weeklySched,
          numberOfSessions: totalSessions,
          programOutcomes: bp.outcomes,

          sessionDate: sessionDateStr,
          sessionTime: sessionTimeStr,
          sessions: nestedSessions,

          registrationDeadline: regDeadlineStr,
          durationWeeks,
          totalSessions,
          nextClassDate: startDateStr,
          isOneTimeWorkshop: isWorkshop,
          frequency: isProgram ? 'Multi-Session Program' : 'Single Session',
          weekdays: days,
          startTime: timeSlot.start,
          endTime: timeSlot.end,
          duration: isProgram ? `${durationWeeks} Weeks (${totalSessions} Sessions)` : `${timeSlot.dur}`,
          nextSession: `${startDateStr} at ${timeSlot.start}`,
          availableSessions: [
            `${startDateStr} • ${timeSlot.start}`,
            `${days[1] || days[0]}, ${startDayNum + 2} ${monthNameStr} • ${timeSlot.start}`,
          ],
          availableSeats,
          totalSeats,
          metroLine: station.lineName,
          metroStation: station.name,
          walkTimeMinutes: walkTime,
          travelTimeMinutes: travelTime,
          address: streetAddress,
          trialPrice,
          regularPrice,
          currency: '₽',
          level,
          language:
            bp.category === 'Languages'
              ? actSeqInStation % 2 === 0
                ? 'English'
                : 'English & Russian'
              : bp.category === 'Coding & Robotics' || bp.category === 'Coding' || bp.category === 'Business' || bp.category === 'Technology'
              ? actSeqInStation % 3 === 0
                ? 'English & Russian'
                : actSeqInStation % 2 === 0
                ? 'English'
                : 'Russian'
              : actSeqInStation % 4 === 0
              ? 'English'
              : actSeqInStation % 3 === 0
              ? 'English & Russian'
              : 'Russian',
          ageGroup: ageGroupStr,
          classSize: `Small Group (max ${totalSeats})`,
          learningOutcomes: bp.outcomes,
          shortDescription,
          fullDescription,
          tags: [...bp.tags, stationShortName, programType],
          goals: bp.goals,
          popularityScore,
          featured: typeIndex === 0,
          newActivity: actSeqInStation % 4 === 0,
          rating,
          reviewCount,
          studioName,
          instructorName: bp.teacherName,
          instructorExperience: `${5 + (stationIdx % 10)}+ years experience`,
          instructorQualifications: bp.teacherDeg,
          coverImage,
          galleryImages: [coverImage],
          instantBooking: true,
          cancellationPolicy: 'Free cancellation up to 24 hours before activity',
          bookingDeadline: '2 hours before session',

          // Delivery Attributes
          deliveryMode,
          meetingPlatform,
          onlineSchedule,
          timezone: 'MSK (UTC+3)',
          bookingType,
          capacity: totalSeats,

          // UI & Legacy Compatibility
          metroStationId: station.id,
          metroStationName: station.name,
          metroLineId: station.lineId,
          metroLineName: station.lineName,
          metroLineColor: lineColor,
          walkMinutes: walkTime,
          price: regularPrice,
          priceUnit: isProgram ? 'per program' : 'per session',
          schedule: {
            days,
            timeOfDay: timeSlot.tod,
            timeRange: `${timeSlot.start} - ${timeSlot.end}`,
            specificDaysText: days.join(' & '),
          },
          syllabi: bp.outcomes.map((o, i) => `Module ${i + 1}: ${o}`),
          teacher: {
            name: bp.teacherName,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            title: bp.teacherTitle,
            qualifications: {
              degree: bp.teacherDeg,
              certificates: ['Certified Expert Instructor'],
              experienceYears: 5 + (stationIdx % 10),
            },
            bio: `Dedicated instructor delivering high quality activities at ${stationShortName}.`,
            rating,
            trust: trustData,
          },
          studio: {
            name: studioName,
            address: streetAddress,
            metroDistanceWalkMinutes: walkTime,
            website: `https://${stationShortName.toLowerCase()}-studio.ru`,
            trust: trustData,
          },
          image: coverImage,
          accentColor: actSeqInStation % 2 === 0 ? 'soft-green' : 'warm-yellow',
          isFreeTrial,
        };
    };

    // 1. Generate 12 Adult Activities
    ADULT_BLUEPRINTS.forEach((bp, idx) => {
      activities.push(buildActivity(bp, 'Adults', idx));
    });

    // 2. Generate 10 Children Activities
    CHILD_BLUEPRINTS.forEach((bp, idx) => {
      activities.push(buildActivity(bp, 'Children', idx));
    });

    // 3. Generate 6 Corporate Activities
    CORPORATE_BLUEPRINTS.forEach((bp, idx) => {
      activities.push(buildActivity(bp, 'Corporate', idx));
    });
  });

  return activities;
}

export const INITIAL_ACTIVITIES: Activity[] = generateFullMarketplaceDataset();

// Validation Function to enforce all requirements
export function validateMarketplaceDataset(activities: Activity[] = INITIAL_ACTIVITIES): {
  valid: boolean;
  totalActivities: number;
  stationErrors: string[];
} {
  const stationErrors: string[] = [];
  
  METRO_STATIONS.forEach((station) => {
    const stationActs = activities.filter((a) => a.metroStationId === station.id);
    const adults = stationActs.filter((a) => a.audience === 'Adults');
    const children = stationActs.filter((a) => a.audience === 'Children');
    const corporate = stationActs.filter((a) => a.audience === 'Corporate');

    if (stationActs.length < 23) {
      stationErrors.push(`Station ${station.name} (${station.id}) has only ${stationActs.length} activities (minimum 23 required).`);
    }
    if (adults.length < 10) {
      stationErrors.push(`Station ${station.name} has only ${adults.length} Adult activities (minimum 10 required).`);
    }
    if (children.length < 8) {
      stationErrors.push(`Station ${station.name} has only ${children.length} Children activities (minimum 8 required).`);
    }
    if (corporate.length < 5) {
      stationErrors.push(`Station ${station.name} has only ${corporate.length} Corporate activities (minimum 5 required).`);
    }
  });

  // Verify every activity has delivery attributes
  const missingDelivery = activities.filter(
    (a) => !a.deliveryMode || !a.timezone || !a.bookingType || !a.capacity || !a.instructorName
  );
  if (missingDelivery.length > 0) {
    stationErrors.push(`${missingDelivery.length} activities are missing required delivery attributes (deliveryMode, timezone, bookingType, capacity, instructor).`);
  }

  return {
    valid: stationErrors.length === 0,
    totalActivities: activities.length,
    stationErrors,
  };
}
