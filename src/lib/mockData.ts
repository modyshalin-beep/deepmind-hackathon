import { Discipline, CoachProfile, VideoClip, SessionReport, LocalMatchPartner } from '@/types';

export const INITIAL_DISCIPLINES: Discipline[] = [
  {
    id: 'yoga',
    name: 'Yoga Alignment & Flow',
    category: 'Mind & Body',
    iconName: 'Heart',
    description: 'Refine Warrior II stance, hip squareness, shoulder depression, and breath pacing.',
    coachPersona: {
      name: 'Yogi Maya',
      title: 'Master Vinyasa & Posture Specialist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      voiceStyle: 'Soothing, grounded, articulate',
    },
    microFocus: 'Warrior II Stance Setup & Knee Alignment',
    prescribedDrill: 'Beginner Step-by-Step Warrior II Alignment & Standing Flow',
    beginnerStepByStepPrep: [
      'Step 1: Stand facing the long edge of your mat with feet wide apart (about 3.5 to 4 feet).',
      'Step 2: Turn your front right foot outward at a 90-degree angle, facing the top of your mat.',
      'Step 3: Keep your back left foot slightly angled inward (about 45 degrees) with your back leg straight.',
      'Step 4: Bend your front right knee directly over your front ankle until your thigh is parallel to the ground.',
      'Step 5: Extend both arms out parallel to the floor, reaching actively through your fingertips, and gaze gently over your front right hand.'
    ],
    overallScore: 5.2,
    subcomponents: [
      { id: 'y1', name: 'Warrior II Stance Setup', score: 5.0, category: 'weakness', history: [{ date: '2026-10-01', score: 4.8 }, { date: '2026-10-08', score: 5.0 }] },
      { id: 'y2', name: 'Front Knee Alignment Over Ankle', score: 5.4, category: 'weakness', history: [{ date: '2026-10-01', score: 5.1 }, { date: '2026-10-08', score: 5.4 }] },
      { id: 'y3', name: 'Core & Breath Relaxation', score: 5.2, category: 'developing', history: [{ date: '2026-10-01', score: 5.0 }, { date: '2026-10-08', score: 5.2 }] },
    ],
    systemInstruction: `You are Yogi Maya. For beginners, explain step-by-step stance setup clearly before holding poses.`,
  },
  {
    id: 'tennis',
    name: 'Tennis & Racquet Sports',
    category: 'Athletics',
    iconName: 'Activity',
    description: 'Master fast swing mechanics, toss consistency, and backhand preparation.',
    coachPersona: {
      name: 'Coach Marcus',
      title: 'ATP High Performance Specialist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      voiceStyle: 'Direct, focused, encouraging',
    },
    microFocus: 'Backhand Volley Wrist Stability & High Ball Toss',
    prescribedDrill: '20-Minute Focused Backhand Prep & Impact Drilling',
    beginnerStepByStepPrep: [
      'Step 1: Stand at the baseline in a balanced ready position with knees bent.',
      'Step 2: Hold racquet with Continental Grip (like holding a hammer).',
      'Step 3: Turn shoulders 90 degrees to prepare racquet early before ball bounces.',
      'Step 4: Step forward with front foot and punch racquet cleanly through impact.'
    ],
    overallScore: 5.5,
    subcomponents: [
      { id: 't1', name: 'Ball Toss Height & Stability', score: 5.8, category: 'developing', history: [{ date: '2026-10-01', score: 5.4 }, { date: '2026-10-08', score: 5.8 }] },
      { id: 't2', name: 'Serve Follow-Through', score: 5.5, category: 'developing', history: [{ date: '2026-10-01', score: 5.2 }, { date: '2026-10-08', score: 5.5 }] },
      { id: 't3', name: 'Backhand Volley Prep', score: 4.2, category: 'weakness', history: [{ date: '2026-10-01', score: 3.9 }, { date: '2026-10-08', score: 4.2 }] },
    ],
    systemInstruction: `You are Coach Marcus. Explain grip and shoulder preparation step-by-step.`,
  },
  {
    id: 'cooking',
    name: 'Culinary Knife Skills & Prep',
    category: 'Culinary',
    iconName: 'Utensils',
    description: 'Precision knife safety, claw grip posture, and high-speed julienne execution.',
    coachPersona: {
      name: 'Chef Laurent',
      title: 'Michelin Star Master Instructor',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=250',
      voiceStyle: 'Precise, calm, safety-focused',
    },
    microFocus: 'Claw Grip Safety & Consistent 1/8" Julienne Thickness',
    prescribedDrill: '15-Minute Onion Brunoise & Pepper Julienne Precision Exercise',
    beginnerStepByStepPrep: [
      'Step 1: Anchor cutting board with a damp towel underneath for zero slippage.',
      'Step 2: Hold chef knife with Pinch Grip (thumb and index finger gripping blade base).',
      'Step 3: Curl non-knife hand into a Claw Grip like a bear paw protecting fingertips.',
      'Step 4: Rock blade tip smoothly against board while guiding with claw knuckles.'
    ],
    overallScore: 5.1,
    subcomponents: [
      { id: 'c1', name: 'Claw Grip Safety Technique', score: 5.5, category: 'developing', history: [{ date: '2026-10-01', score: 5.0 }, { date: '2026-10-08', score: 5.5 }] },
      { id: 'c2', name: 'Julienne Speed & Uniformity', score: 4.8, category: 'weakness', history: [{ date: '2026-10-01', score: 4.5 }, { date: '2026-10-08', score: 4.8 }] },
    ],
    systemInstruction: `You are Chef Laurent. Prioritize safety and claw grip setup first.`,
  },
  {
    id: 'golf',
    name: 'Golf Swing & Tempo',
    category: 'Athletics',
    iconName: 'Target',
    description: 'Optimize shoulder turn, hip rotation, tempo ratio, and clubhead path at impact.',
    coachPersona: {
      name: 'Coach Vance',
      title: 'PGA Tour Biomechanics Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      voiceStyle: 'Methodical, calm, analytical',
    },
    microFocus: '3:1 Backswing-to-Downswing Tempo Ratio & Setup Alignment',
    prescribedDrill: '7-Iron Smooth Swing Setup & Rotation Alignment',
    beginnerStepByStepPrep: [
      'Step 1: Stand feet shoulder-width apart, knees slightly flexed.',
      'Step 2: Hinge forward from hips while keeping spine neutral.',
      'Step 3: Let arms hang naturally down beneath shoulders holding grip.',
      'Step 4: Smooth 3-second backswing followed by 1-second downswing rhythm.'
    ],
    overallScore: 5.0,
    subcomponents: [
      { id: 'g1', name: 'Grip & Setup Alignment', score: 5.2, category: 'developing', history: [{ date: '2026-10-01', score: 4.8 }, { date: '2026-10-08', score: 5.2 }] },
      { id: 'g2', name: 'Downswing Hip Initiation', score: 4.5, category: 'weakness', history: [{ date: '2026-10-01', score: 4.2 }, { date: '2026-10-08', score: 4.5 }] },
    ],
    systemInstruction: `You are Coach Vance. Guide setup and tempo step-by-step.`,
  }
];

export const INITIAL_COACH_PROFILE: CoachProfile = {
  studentName: 'Alex Rivera',
  skillLevel: 'beginner', // Default skill level is Beginner as requested
  totalHoursLogged: 42.5,
  targetHours: 10000,
  memberSince: 'March 2026',
  activeDisciplineId: 'yoga',
  airPodsConnected: true,
  batteryLevel: 94,
  hasCompletedOnboarding: false,
  coachNotesLog: [
    {
      id: 'cn-1',
      date: 'Oct 8, 2026',
      disciplineId: 'yoga',
      note: 'Alex is starting as a Beginner. Coach Maya broke down Warrior II step-by-step before flow execution.',
      prescription: 'Guide step-by-step stance setup before holding poses.',
    }
  ]
};

export const INITIAL_VIDEO_CLIPS: VideoClip[] = [
  {
    id: 'clip-model-1',
    title: 'Beginner Warrior II - Step-by-Step Alignment',
    disciplineId: 'yoga',
    createdAt: '2026-10-08T14:30:00Z',
    durationSeconds: 4.8,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-outdoors-42289-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    fpsCaptured: 30,
    isMilestone: true,
    sizeMB: 12.4,
    tags: ['Yoga', 'Beginner Step-by-Step', 'Milestone Vault'],
    repType: 'model',
    coachVoiceoverText: 'Before holding Warrior II, notice how we set up feet 4 feet apart, turned the right foot 90 degrees, and tracked front knee directly over ankle.',
    keyframeNotes: [
      { timeOffsetSeconds: 0.8, label: 'Step 1: Stance Width', description: 'Feet placed 4 feet apart facing side wall.', type: 'good' },
      { timeOffsetSeconds: 1.5, label: 'Step 2: 90 Degree Foot Turn', description: 'Right foot rotated outward 90 degrees.', type: 'good' },
      { timeOffsetSeconds: 2.2, label: 'Step 3: Knee Over Ankle', description: 'Front knee bent directly above front ankle.', type: 'good' },
    ]
  }
];

export const INITIAL_SESSIONS: SessionReport[] = [];

export const INITIAL_LOCAL_MATCHES: LocalMatchPartner[] = [
  {
    id: 'p-1',
    name: 'Jordan Chen',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    disciplineId: 'yoga',
    skillScore: 5.3,
    distanceMiles: 1.4,
    locationName: 'Oakwood Yoga Studio',
    matchPercentage: 98,
    verifiedByCoach: true,
    recentBreakthrough: 'AI verified Beginner Warrior II Stance Setup',
    badge: 'Beginner Practitioner',
  }
];
