// The classification model from docs/Fitness-Classifier-PRD.pdf, section 4.
// Every video in videos.json uses these ids. Labels are what users see.

export const AGE_GROUPS = [
  { id: 'teen-13-17', label: 'Teen 13–17' },
  { id: 'adult-18-39', label: 'Adult 18–39' },
  { id: 'adult-40-59', label: 'Adult 40–59' },
  { id: 'senior-60', label: 'Senior 60+' },
];

// Bands steer impact level only. They are not health categories; no BMI is shown.
export const SIZE_BANDS = [
  { id: 'comfort', label: 'Comfort', hint: 'Prefers low-impact moves' },
  { id: 'standard', label: 'Standard', hint: 'A mix of impact levels' },
  { id: 'strength-focus', label: 'Strength-focus', hint: 'Building strength and power' },
];

// Optional weight range, used only to prefer low-impact picks. Shown in kg and lb.
export const WEIGHT_RANGES = [
  { id: 'under-60', label: 'Under 60 kg (132 lb)', preferLowImpact: false },
  { id: '60-85', label: '60–85 kg (132–187 lb)', preferLowImpact: false },
  { id: '85-110', label: '85–110 kg (187–243 lb)', preferLowImpact: true },
  { id: '110-plus', label: '110+ kg (243+ lb)', preferLowImpact: true },
];

export const WORKOUT_TYPES = [
  { id: 'strength', label: 'Strength' },
  { id: 'cardio-hiit', label: 'Cardio / HIIT' },
  { id: 'yoga', label: 'Yoga' },
  { id: 'pilates', label: 'Pilates' },
  { id: 'mobility', label: 'Mobility & stretching' },
  { id: 'walking', label: 'Walking' },
  { id: 'dance', label: 'Dance' },
];

export const FOCUS_AREAS = [
  { id: 'glutes', label: 'Glutes', icon: '🍑' },
  { id: 'core', label: 'Core', icon: '🎯', note: 'Abs and tummy control' },
  { id: 'legs', label: 'Legs', icon: '🦵' },
  { id: 'arms', label: 'Arms', icon: '💪' },
  { id: 'back', label: 'Back & posture', icon: '🧍' },
  { id: 'full-body', label: 'Full body', icon: '⭐' },
];

export const INTENSITIES = [
  { id: 'gentle', label: 'Gentle' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'intense', label: 'Intense' },
];

export const IMPACTS = [
  { id: 'low', label: 'Low impact' },
  { id: 'high', label: 'High impact' },
];

export const DURATIONS = [
  { id: 'under-10', label: 'Under 10 min', min: 0, max: 9 },
  { id: '10-20', label: '10–20 min', min: 10, max: 20 },
  { id: '20-40', label: '20–40 min', min: 21, max: 40 },
  { id: '40-plus', label: '40+ min', min: 41, max: Infinity },
];

export const EQUIPMENT = [
  { id: 'none', label: 'No equipment' },
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'bands', label: 'Bands' },
  { id: 'chair', label: 'Chair' },
];

// F7: everyday phrases mapped to tags. Matching is on whole words or phrases.
export const SEARCH_ALIASES = {
  tummy: { focus: 'core' },
  belly: { focus: 'core' },
  abs: { focus: 'core' },
  stomach: { focus: 'core' },
  core: { focus: 'core' },
  booty: { focus: 'glutes' },
  butt: { focus: 'glutes' },
  bum: { focus: 'glutes' },
  glutes: { focus: 'glutes' },
  hips: { focus: 'glutes' },
  thighs: { focus: 'legs' },
  legs: { focus: 'legs' },
  arms: { focus: 'arms' },
  biceps: { focus: 'arms' },
  triceps: { focus: 'arms' },
  posture: { focus: 'back' },
  back: { focus: 'back' },
  'full body': { focus: 'full-body' },
  hiit: { type: 'cardio-hiit' },
  cardio: { type: 'cardio-hiit' },
  yoga: { type: 'yoga' },
  pilates: { type: 'pilates' },
  stretch: { type: 'mobility' },
  stretching: { type: 'mobility' },
  mobility: { type: 'mobility' },
  walk: { type: 'walking' },
  walking: { type: 'walking' },
  dance: { type: 'dance' },
  chair: { equipment: 'chair' },
  seated: { equipment: 'chair' },
  dumbbell: { equipment: 'dumbbells' },
  dumbbells: { equipment: 'dumbbells' },
  weights: { equipment: 'dumbbells' },
  band: { equipment: 'bands' },
  bands: { equipment: 'bands' },
  gentle: { intensity: 'gentle' },
  easy: { intensity: 'gentle' },
  beginner: { intensity: 'gentle' },
  'low impact': { impact: 'low' },
  quiet: { impact: 'low' },
};

export const labelOf = (list, id) => list.find((x) => x.id === id)?.label ?? id;
