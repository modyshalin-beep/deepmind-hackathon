import { Discipline, CoachProfile, VideoClip, SessionReport, LocalMatchPartner } from '@/types';

export const mockDisciplines: Discipline[] = [
  {
    id: 'yoga',
    name: 'Yoga & Flow Alignment',
    category: 'sports',
    iconName: 'Activity',
    description: 'Precision physical posture alignment, joint flexibility, and breathing cadence.',
    prescribedDrill: 'Warrior II Alignment & Hip Opening Sequence',
    microFocus: 'Tracking front knee directly over ankle while grounding outer heel of back foot',
    overallScore: 8.4,
    coachPersona: {
      name: 'Coach Maya',
      title: 'Tactile Alignment Specialist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      voiceStyle: 'Calm, Precise, Encouraging',
    },
    subcomponents: [
      {
        id: 'sub-y1',
        name: 'Front Knee Flexion',
        score: 8.2,
        category: 'strength',
        history: [{ date: '2026-10-01', score: 7.8 }, { date: '2026-10-08', score: 8.2 }]
      },
      {
        id: 'sub-y2',
        name: 'Back Foot Grounding',
        score: 6.5,
        category: 'weakness',
        history: [{ date: '2026-10-01', score: 6.0 }, { date: '2026-10-08', score: 6.5 }]
      }
    ],
    systemInstruction: 'You are Coach Maya, an expert Yoga alignment specialist.',
    beginnerStepByStepPrep: [
      'Step 1: Stand at center of mat, feet parallel, spine long and shoulders relaxed.',
      'Step 2: Step feet wide apart (approx 4 to 4.5 feet) with arms extended wide.',
      'Step 3: Turn front right foot 90 degrees out; turn back left foot inward 15 degrees.',
      'Step 4: Align front right heel in a direct straight line with back left arch.',
      'Step 5: Press firmly into outer edge of back foot, lifting inner arch off floor.',
      'Step 6: Exhale deeply and bend front right knee until directly over ankle.',
      'Step 7: Check knee tracking—ensure knee points directly over 2nd and 3rd toe.',
      'Step 8: Stack torso directly over hips; do not lean forward over front thigh.',
      'Step 9: Extend both arms parallel to floor, reaching actively through fingertips.',
      'Step 10: Relax shoulders down and back, away from ears, opening collarbones.',
      'Step 11: Turn head to gaze steadily over front right middle fingertip.',
      'Step 12: Inhale deeply into chest; exhale to sink hips 1 inch lower into stance.',
      'Step 13: Hold alignment for 5 deep breaths, grounding both feet equally into mat.',
      'Step 14: Press into front heel to straighten leg, returning arms smoothly to center.',
      'Step 15: Repeat Warrior II sequence on left side with full camera motion burst capture.',
    ],
  },
  {
    id: 'tennis',
    name: 'Tennis Mechanics',
    category: 'sports',
    iconName: 'Zap',
    description: 'Kinetic chain stroke production, serve toss rhythm, and footwork split-steps.',
    prescribedDrill: 'Flat Serve Toss & Racquet Drop Sync',
    microFocus: 'Maintaining racquet drop depth until ball reaches apex height',
    overallScore: 7.9,
    coachPersona: {
      name: 'Coach Marcus',
      title: 'Dynamic Kinetic Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      voiceStyle: 'Energetic, Analytical, Dynamic',
    },
    subcomponents: [
      {
        id: 'sub-t1',
        name: 'Serve Toss Height',
        score: 8.0,
        category: 'strength',
        history: [{ date: '2026-10-01', score: 7.5 }, { date: '2026-10-08', score: 8.0 }]
      }
    ],
    systemInstruction: 'You are Coach Marcus, a pro Tennis kinetic chain coach.',
    beginnerStepByStepPrep: [
      'Step 1: Assume continental hammer grip, feet angled 45 degrees to baseline.',
      'Step 2: Hold ball with fingertips of non-dominant hand, resting against racquet throat.',
      'Step 3: Initiate weight transfer back onto rear foot while lowering both arms together.',
      'Step 4: Lift non-dominant tossing arm straight up like an elevator without bending elbow.',
      'Step 5: Release ball cleanly at eye level, lifting tossing arm high toward sky.',
      'Step 6: Simultaneously turn shoulders into 90 degree trophy position.',
      'Step 7: Flex knees into power position as ball reaches apex toss height.',
      'Step 8: Let racquet drop behind back into deep elbow flex scratch position.',
      'Step 9: Explode upward with legs, driving hip forward into baseline.',
      'Step 10: Drive racquet upward toward contact point at full arm reach.',
      'Step 11: Lock wrist hinge firm at impact, pronating forearm outward.',
      'Step 12: Keep head and eyes locked up on contact point through impact.',
      'Step 13: Allow racquet to follow through smoothly across opposite hip.',
      'Step 14: Land on front foot inside baseline, landing light on toes.',
      'Step 15: Split-step immediately back into ready position for return ball.',
    ],
  },
  {
    id: 'golf',
    name: 'Golf Swing Precision',
    category: 'sports',
    iconName: 'Target',
    description: 'Spine tilt angle hold, lead wrist flatness, and iron turf divot compression.',
    prescribedDrill: 'Iron Backswing Shoulder Turn & Plane Hold',
    microFocus: 'Rotating lead shoulder under chin without swaying trail hip outward',
    overallScore: 8.1,
    coachPersona: {
      name: 'Coach David',
      title: 'Biomechanics Specialist',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
      voiceStyle: 'Calm, Tactical, Analytical',
    },
    subcomponents: [
      {
        id: 'sub-g1',
        name: 'Lead Wrist Flatness',
        score: 8.3,
        category: 'strength',
        history: [{ date: '2026-10-01', score: 8.0 }, { date: '2026-10-08', score: 8.3 }]
      }
    ],
    systemInstruction: 'You are Coach David, a PGA Golf biomechanics specialist.',
    beginnerStepByStepPrep: [
      'Step 1: Set feet shoulder-width apart, ball positioned center-left of stance.',
      'Step 2: Bend forward from hips with neutral spine, flexing knees slightly.',
      'Step 3: Form neutral interlocking grip with lead thumb resting on trail palm.',
      'Step 4: Take club back with hands, arms, and shoulders moving as 1 unit.',
      'Step 5: Keep lead arm straight as club shaft reaches parallel to ground.',
      'Step 6: Continue shoulder turn, rotating lead shoulder directly under chin.',
      'Step 7: Load 70% weight into trail heel without swaying trail hip outward.',
      'Step 8: Pause at top of backswing with shaft pointing on target line.',
      'Step 9: Initiate downswing by shifting lead hip laterally toward target.',
      'Step 10: Pull arms down into slot position, maintaining lag angle at wrist.',
      'Step 11: Drive trail hip through impact while holding spine tilt constant.',
      'Step 12: Strike ball first, compressing turf divot ahead of ball position.',
      'Step 13: Extend both arms toward target through impact zone.',
      'Step 14: Rotate chest toward target into balanced high finish stance.',
      'Step 15: Hold finish position balanced on trail toe for 3 seconds.',
    ],
  },
  {
    id: 'cooking',
    name: 'Culinary Knife Mastery',
    category: 'skills',
    iconName: 'Utensils',
    description: 'Michelin knife cuts, claw hand knuckle safety, and rolling rocking chop technique.',
    prescribedDrill: 'Precision Brunoise Dice & Claw Grip Technique',
    microFocus: 'Tucking guide thumb behind fingers while maintaining rolling rocking cut',
    overallScore: 8.8,
    coachPersona: {
      name: 'Chef Elena',
      title: 'Culinary Precision Master',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=300',
      voiceStyle: 'Sharp, Encouraging, Precision Focused',
    },
    subcomponents: [
      {
        id: 'sub-c1',
        name: 'Claw Grip Knuckle Protection',
        score: 9.1,
        category: 'strength',
        history: [{ date: '2026-10-01', score: 8.8 }, { date: '2026-10-08', score: 9.1 }]
      }
    ],
    systemInstruction: 'You are Chef Elena, a Michelin trained culinary prep coach.',
    beginnerStepByStepPrep: [
      'Step 1: Anchor cutting board on damp towel to prevent board slippage.',
      'Step 2: Grip chef knife with pinch grip—thumb and index finger pinching blade heel.',
      'Step 3: Form claw grip with non-knife hand, curling fingertips inward like a bear claw.',
      'Step 4: Tuck non-knife thumb safely behind fingers into protective claw.',
      'Step 5: Position flat side of knife blade flat against middle knuckles of claw hand.',
      'Step 6: Slice vegetable in half to create flat, stable working surface on board.',
      'Step 7: Cut 1/8-inch uniform planks down length of vegetable.',
      'Step 8: Stack 2 planks and slice into 1/8-inch matchstick julienne strips.',
      'Step 9: Gather julienne matchsticks neatly parallel under claw fingertips.',
      'Step 10: Guide blade with smooth circular rocking motion—tip stays anchored to board.',
      'Step 11: Dice julienne strips into 1/8-inch brunoise cubes across fingertips.',
      'Step 12: Step back claw hand gradually as blade rocks forward smoothly.',
      'Step 13: Maintain steady rhythmic cut cadence without lifting knife tip high.',
      'Step 14: Inspect dice uniformity across cutting board surface.',
      'Step 15: Clear cutting board safely using spine of blade, not sharp edge.',
    ],
  },
];

export const mockCoachProfile: CoachProfile = {
  studentName: 'Alex Chen',
  skillLevel: 'beginner',
  totalHoursLogged: 505.5,
  targetHours: 10000,
  memberSince: 'October 2026',
  activeDisciplineId: 'yoga',
  airPodsConnected: true,
  batteryLevel: 94,
  hasCompletedOnboarding: true,
  coachNotesLog: [
    {
      id: 'note-1',
      date: '2026-10-08',
      disciplineId: 'yoga',
      note: 'Alex completed a 15-step Warrior II alignment lesson with 100% video keyframe capture.',
      prescription: 'Practice 15-step flow daily.',
    },
  ],
};

export const mockVideoClips: VideoClip[] = [
  {
    id: 'clip-1',
    title: 'Model Rep - Warrior II Hip Opening',
    disciplineId: 'yoga',
    createdAt: '2026-10-08T14:32:00Z',
    durationSeconds: 5.4,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-outdoors-42289-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    fpsCaptured: 30,
    isMilestone: true,
    sizeMB: 14.2,
    tags: ['Yoga', 'Milestone Vault'],
    repType: 'model',
    coachVoiceoverText: 'Ideal 90 degree front knee flex and level shoulder stacking.',
    keyframeNotes: [
      { timeOffsetSeconds: 1.2, label: 'Knee Flexed 90°', description: 'Directly over front ankle.', type: 'good' },
      { timeOffsetSeconds: 2.8, label: 'Level Shoulders', description: 'Gaze extending over front fingertips.', type: 'good' }
    ]
  }
];

export const mockLocalMatches: LocalMatchPartner[] = [
  {
    id: 'p-1',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    disciplineId: 'yoga',
    skillScore: 8.4,
    distanceMiles: 1.2,
    locationName: 'Central Park Studio',
    matchPercentage: 96,
    verifiedByCoach: true,
    recentBreakthrough: 'Completed 15-step Warrior II flow',
    badge: 'Top Practitioner',
  }
];

export const mockSessions: SessionReport[] = [];

// Export Initial State Aliases for Storage & Page
export const INITIAL_DISCIPLINES = mockDisciplines;
export const INITIAL_COACH_PROFILE = mockCoachProfile;
export const INITIAL_VIDEO_CLIPS = mockVideoClips;
export const INITIAL_LOCAL_MATCHES = mockLocalMatches;
export const INITIAL_SESSIONS = mockSessions;
