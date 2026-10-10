import { Discipline, CoachProfile, VideoClip, SessionReport, LocalMatchPartner } from '@/types';

export const INITIAL_DISCIPLINES: Discipline[] = [
  {
    id: 'tennis',
    name: 'Tennis & Racquet Sports',
    shortName: 'Tennis',
    category: 'Athletics',
    iconName: 'Activity',
    tagline: 'Master stroke speed, serve toss, and court footwork',
    description: 'Real-time swing biomechanics, wrist stability, and toss repeatability.',
    coachPersona: {
      name: 'Marcus Vance',
      title: 'Pro Tour Performance Coach',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      voiceStyle: 'Punchy, focused, encouraging',
    },
    microFocus: 'Backhand Volley Wrist Lock & Stable Toss',
    prescribedDrill: 'Backhand Wall Punch & Toss Height Calibration',
    beginnerStepByStepPrep: [
      'Step 1: Balanced ready position with knees slightly flexed.',
      'Step 2: Continental grip (V between thumb and index along top bevel).',
      'Step 3: 90-degree shoulder turn before bounce.',
      'Step 4: Step in with lead foot and punch through impact.'
    ],
    overallScore: 5.6,
    baselineOptions: [
      {
        level: 'beginner',
        title: 'Beginner',
        badge: 'Step-by-Step',
        definition: 'New to tennis or building foundational strokes.',
        realWorldScenario: 'Struggling with grip slipping, ball contact, and getting rallies over the net.',
        focusArea: 'Grip hold, ready stance, and low-to-high stroke path'
      },
      {
        level: 'intermediate',
        title: 'Intermediate',
        badge: 'Consistency',
        definition: 'Can rally and play sets, but break down under pressure.',
        realWorldScenario: 'Solid forehand, but weak backhand slice and erratic second serve toss.',
        focusArea: 'Backhand wrist lock, toss repeatability & split-step timing'
      },
      {
        level: 'advanced',
        title: 'Advanced',
        badge: 'Tour Mechanics',
        definition: 'Competitive player looking for marginal velocity gains.',
        realWorldScenario: 'Refining kinetic chain transfer, racket drop lag, and split-second recovery.',
        focusArea: 'Kinetic chain speed & high-velocity micro-cues'
      }
    ],
    modules: [
      {
        id: 't-mod-1',
        disciplineId: 'tennis',
        order: 1,
        title: 'Continental Grip & Ready Stance',
        subtitle: 'The foundational platform for all racquet strokes',
        estimatedMinutes: 10,
        status: 'completed',
        microFocus: 'Index knuckle bevel alignment & athletic knee drop',
        prescribedDrill: 'Ready-Stance Bounce & Grip Check (10 Reps)',
        keyObjectives: ['Grip heel alignment', 'Athletic base', 'Racquet 45° angle'],
        beginnerSteps: ['Place index knuckle on bevel 2', 'Drop weight into balls of feet', 'Keep racquet tip chest high']
      },
      {
        id: 't-mod-2',
        disciplineId: 'tennis',
        order: 2,
        title: 'Forehand Topspin Brush Arc',
        subtitle: 'Generate high clearance and heavy topspin revolutions',
        estimatedMinutes: 15,
        status: 'completed',
        microFocus: 'Early unit turn & windshield-wiper finish',
        prescribedDrill: 'Low-to-High Brush Arc Rhythm Drill (20 Reps)',
        keyObjectives: ['Coil shoulders early', 'Drop racket 8" below ball', 'Wrap finish around shoulder'],
        beginnerSteps: ['Turn upper body sideways', 'Drop racket head below hips', 'Brush up and wrap over shoulder']
      },
      {
        id: 't-mod-3',
        disciplineId: 'tennis',
        order: 3,
        title: 'Backhand Volley & High Toss Stability',
        subtitle: 'Lock your wrist and eliminate net errors',
        estimatedMinutes: 15,
        status: 'in_progress',
        microFocus: 'Wrist angle locked at 90° through contact',
        prescribedDrill: 'Backhand Wall Punch & High Toss Calibration',
        keyObjectives: ['Zero wrist flop', 'Lead foot cross-step', '6-foot toss without drift'],
        beginnerSteps: ['Lock wrist into firm L-shape', 'Step across with front foot', 'Punch cleanly out in front']
      },
      {
        id: 't-mod-4',
        disciplineId: 'tennis',
        order: 4,
        title: 'Serve Pronation & Explosive Snap',
        subtitle: 'Harness ground force into overhead power',
        estimatedMinutes: 20,
        status: 'locked',
        microFocus: 'Trophy position knee bend & outward forearm turn',
        prescribedDrill: 'Trophy Pause & Pronation Fence Drill',
        keyObjectives: ['Deep knee coil', 'Toss 1-ft inside baseline', 'Forearm pronation snap'],
        beginnerSteps: ['Trophy pause with elbow high', 'Drive up from knees', 'Snap wrist outward at contact']
      }
    ],
    subcomponents: [
      { id: 't1', name: 'Ball Toss Height & Stability', score: 5.8, category: 'developing', history: [{ date: '2026-10-01', score: 5.4 }, { date: '2026-10-08', score: 5.8 }] },
      { id: 't2', name: 'Serve Follow-Through', score: 5.5, category: 'developing', history: [{ date: '2026-10-01', score: 5.2 }, { date: '2026-10-08', score: 5.5 }] },
      { id: 't3', name: 'Backhand Volley Prep', score: 4.2, category: 'weakness', history: [{ date: '2026-10-01', score: 3.9 }, { date: '2026-10-08', score: 4.2 }] },
    ],
    systemInstruction: `You are Marcus Vance. Direct, concise feedback on grip and timing.`,
  },
  {
    id: 'boxing',
    name: 'Boxing & Shadowboxing',
    shortName: 'Boxing',
    category: 'Athletics & Combat',
    iconName: 'Zap',
    tagline: 'Snap punches, head movement, and balanced footwork',
    description: 'Real-time stance alignment, chin tuck, jab-cross snap, and slip angles.',
    coachPersona: {
      name: 'Malik Vance',
      title: 'Golden Gloves Boxing Specialist',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
      voiceStyle: 'Energetic, rhythmic, crisp',
    },
    microFocus: 'Guard Protection & 1-2 Snap Extension',
    prescribedDrill: '3-Round Stance Rhythm & 1-2 Straight Combo Calibration',
    beginnerStepByStepPrep: [
      'Step 1: Staggered stance with non-dominant foot forward, knees soft.',
      'Step 2: Hands up to cheekbones, elbows tucked against ribs.',
      'Step 3: Chin tucked down toward chest.',
      'Step 4: Rotate hips and balls of feet with each punch.'
    ],
    overallScore: 5.4,
    baselineOptions: [
      {
        level: 'beginner',
        title: 'Beginner',
        badge: 'Guard & Stance',
        definition: 'New to boxing or fitness shadowboxing.',
        realWorldScenario: 'Hands dropping when punching, square stance, or leaning off balance.',
        focusArea: 'Stance stagger, high guard, and straight punch recoil'
      },
      {
        level: 'intermediate',
        title: 'Intermediate',
        badge: 'Combos & Slips',
        definition: 'Familiar with combos, wanting sharp defense and speed.',
        realWorldScenario: 'Throwing 1-2s cleanly but telegraphing hooks and staying on the centerline.',
        focusArea: 'Head movement off centerline, pivot footwork, and fluid combos'
      },
      {
        level: 'advanced',
        title: 'Advanced',
        badge: 'Ring Mechanics',
        definition: 'Experienced fighter seeking rapid counter-timing.',
        realWorldScenario: 'Fine-tuning sub-second slip-counters, angle shifts, and rotational power.',
        focusArea: 'Slip angles, shoulder roll recovery, and burst cadences'
      }
    ],
    modules: [
      {
        id: 'b-mod-1',
        disciplineId: 'boxing',
        order: 1,
        title: 'Athletic Stance & High Guard Shield',
        subtitle: 'The defensive fortress: chin tucked and elbows glued to ribs',
        estimatedMinutes: 8,
        status: 'completed',
        microFocus: 'Lead heel alignment and non-dominant cheek guard',
        prescribedDrill: 'Step-Slide Footwork & Guard Retention Drill',
        keyObjectives: ['Shoulder-width stagger', 'Chin tucked into lead shoulder', 'Hands glued to temple'],
        beginnerSteps: ['Lead foot angled 45 degrees', 'Rear heel slightly raised', 'Knuckles against cheekbones']
      },
      {
        id: 'b-mod-2',
        disciplineId: 'boxing',
        order: 2,
        title: 'The Jab & Cross (1-2) Snap',
        subtitle: 'Maximize reach and full hip rotation without lunging',
        estimatedMinutes: 12,
        status: 'in_progress',
        microFocus: 'Full rear hip turn and instant hand recoil to cheek',
        prescribedDrill: '100-Rep 1-2 Laser Straight Punch Calibration',
        keyObjectives: ['Lead jab shoulder snap', 'Rear foot squish-the-bug rotation', 'Instant recoil to guard'],
        beginnerSteps: ['Flick lead jab and rotate knuckle flat', 'Drive rear cross with hip pivot', 'Snap hands straight back to guard']
      },
      {
        id: 'b-mod-3',
        disciplineId: 'boxing',
        order: 3,
        title: 'Head Movement & The 2-Way Slip',
        subtitle: 'Move off the center line while maintaining counter balance',
        estimatedMinutes: 15,
        status: 'locked',
        microFocus: 'Knee dip and shoulder tilt without eye contact loss',
        prescribedDrill: 'Slip Left, Slip Right Rhythm Metronome',
        keyObjectives: ['Knee bend slip', 'Eyes fixed on opponent', 'Weight loaded on back hip'],
        beginnerSteps: ['Bend knees slightly', 'Dip lead shoulder 4 inches left', 'Return center and dip right']
      }
    ],
    subcomponents: [
      { id: 'b1', name: 'High Guard & Chin Protection', score: 5.6, category: 'developing', history: [{ date: '2026-10-01', score: 5.2 }, { date: '2026-10-08', score: 5.6 }] },
      { id: 'b2', name: 'Rear Cross Hip Rotation', score: 5.1, category: 'weakness', history: [{ date: '2026-10-01', score: 4.8 }, { date: '2026-10-08', score: 5.1 }] },
    ],
    systemInstruction: `You are Malik Vance. Keep instructions sharp, rhythmic, and guard-focused.`,
  },
  {
    id: 'dance',
    name: 'Dance (Hip-Hop & Salsa)',
    shortName: 'Dance',
    category: 'Performing Arts',
    iconName: 'Sparkles',
    tagline: 'Isolations, rhythm bounce, and 8-count footwork',
    description: 'Real-time tempo synchronization, hip/chest isolations, and weight transitions.',
    coachPersona: {
      name: 'Elena Cruz',
      title: 'Commercial Choreographer & Salsa Artist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      voiceStyle: 'Vibrant, musical, groove-driven',
    },
    microFocus: 'Rhythm Bounce & Weight Shift Footwork',
    prescribedDrill: 'Up-Down Bounce Timing & Salsa Basic 8-Count Step',
    beginnerStepByStepPrep: [
      'Step 1: Soft knees with natural chest bounce on the beat.',
      'Step 2: Step front on 1, replace on 2, feet together on 3.',
      'Step 3: Pause on 4 with clean hip settle.',
      'Step 4: Step back on 5, replace on 6, feet together on 7.'
    ],
    overallScore: 5.2,
    baselineOptions: [
      {
        level: 'beginner',
        title: 'Beginner',
        badge: 'Groove & Beat',
        definition: 'New to dance or finding the 8-count beat.',
        realWorldScenario: 'Stiff posture, stepping off-time, or feeling self-conscious about moves.',
        focusArea: 'Finding the musical downbeat, knee bounce, and basic step'
      },
      {
        level: 'intermediate',
        title: 'Intermediate',
        badge: 'Isolations',
        definition: 'Know basic steps and want musicality and clean isolations.',
        realWorldScenario: 'Steps are on beat, but transitions look robotic and lack hip/chest fluidity.',
        focusArea: 'Chest & hip isolations, weight shifting, and syncopated styling'
      },
      {
        level: 'advanced',
        title: 'Advanced',
        badge: 'Choreography',
        definition: 'Experienced dancer seeking performance polish.',
        realWorldScenario: 'Nailing complex choreography speed, sharp accents, and expressive dynamics.',
        focusArea: 'Sub-second speed changes, texture contrast, and floorwork'
      }
    ],
    modules: [
      {
        id: 'd-mod-1',
        disciplineId: 'dance',
        order: 1,
        title: 'Finding the Pocket: Bounce & Downbeat',
        subtitle: 'Connect your knees and ribcage to the musical pulse',
        estimatedMinutes: 10,
        status: 'completed',
        microFocus: 'Knee compression on beats 1, 3, 5, 7',
        prescribedDrill: 'Hip-Hop Down-Bounce & Groove Drill (64 Beats)',
        keyObjectives: ['Knee relaxation', 'Chest pulse on beat', 'Weight grounded'],
        beginnerSteps: ['Bend knees softly', 'Drop chest on every bass kick', 'Sway naturally without tension']
      },
      {
        id: 'd-mod-2',
        disciplineId: 'dance',
        order: 2,
        title: 'The Salsa 8-Count Basic Step',
        subtitle: 'Master the universal Latin rhythm foundation (Quick-Quick-Slow)',
        estimatedMinutes: 12,
        status: 'in_progress',
        microFocus: 'Clean pause on 4 and 8 with hip weight transfer',
        prescribedDrill: 'Salsa Basic Step Metronome Routine',
        keyObjectives: ['Step 1-2-3 pause 4', 'Step 5-6-7 pause 8', 'Natural Cuban hip motion'],
        beginnerSteps: ['Step left foot forward on 1', 'Rock back on right on 2', 'Feet together on 3 and pause on 4']
      },
      {
        id: 'd-mod-3',
        disciplineId: 'dance',
        order: 3,
        title: 'Torso & Ribcage Isolations',
        subtitle: 'Separate upper body accents from your hips and legs',
        estimatedMinutes: 15,
        status: 'locked',
        microFocus: 'Ribcage sliding left and right without hip sway',
        prescribedDrill: 'Diamond Isolation Pattern (Front, Side, Back, Side)',
        keyObjectives: ['Upper body independence', 'Shoulders level', 'Core engagement'],
        beginnerSteps: ['Lock hips forward', 'Slide ribcage left without tilting shoulders', 'Slide right smoothly']
      }
    ],
    subcomponents: [
      { id: 'd1', name: 'Musical Downbeat Sync', score: 5.5, category: 'developing', history: [{ date: '2026-10-01', score: 5.0 }, { date: '2026-10-08', score: 5.5 }] },
      { id: 'd2', name: 'Cuban Hip Weight Shift', score: 4.8, category: 'weakness', history: [{ date: '2026-10-01', score: 4.5 }, { date: '2026-10-08', score: 4.8 }] },
    ],
    systemInstruction: `You are Elena Cruz. Prioritize musical groove, posture relaxation, and bounce.`,
  },
  {
    id: 'cooking',
    name: 'Culinary Knife Skills & Prep',
    shortName: 'Knife Skills',
    category: 'Culinary Arts',
    iconName: 'Utensils',
    tagline: 'Safe grip, lightning-fast prep, and uniform cuts',
    description: 'Board stabilization, chef pinch grip, protective claw, and rocking cadence.',
    coachPersona: {
      name: 'Chef Laurent',
      title: 'Michelin Star Culinary Instructor',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=250',
      voiceStyle: 'Precise, calm, safety-first',
    },
    microFocus: 'Claw Grip Safety & 1/8" Julienne Uniformity',
    prescribedDrill: 'Onion Brunoise & Pepper Julienne Precision Exercise',
    beginnerStepByStepPrep: [
      'Step 1: Anchor cutting board with a damp paper towel underneath.',
      'Step 2: Pinch blade base between thumb and index finger.',
      'Step 3: Curl off-hand into a protective bear claw over food.',
      'Step 4: Keep blade tip rocking continuously against the board.'
    ],
    overallScore: 5.1,
    baselineOptions: [
      {
        level: 'beginner',
        title: 'Beginner',
        badge: 'Safety First',
        definition: 'Cook occasionally but slow with knife work and fear cuts.',
        realWorldScenario: 'Slipping cutting boards, awkward handle grip, and uneven veggie chunks.',
        focusArea: 'Board anchoring, pinch grip & non-dominant claw formation'
      },
      {
        level: 'intermediate',
        title: 'Intermediate',
        badge: 'Speed & Shape',
        definition: 'Cook regularly, looking for culinary school precision.',
        realWorldScenario: 'Chopping works fine, but dices are uneven and slow when prepping feasts.',
        focusArea: 'Uniform 1/8" julienne, fine brunoise & rocking cadence'
      },
      {
        level: 'advanced',
        title: 'Advanced',
        badge: 'Line Cook Speed',
        definition: 'Fast dexterity seeking restaurant-grade efficiency.',
        realWorldScenario: 'High-speed chiffonade, sub-millimeter tournéing, and zero food waste.',
        focusArea: 'High-cadence rhythm cuts and multi-prep efficiency'
      }
    ],
    modules: [
      {
        id: 'c-mod-1',
        disciplineId: 'cooking',
        order: 1,
        title: 'Board Anchoring & The Chef Pinch Grip',
        subtitle: 'The universal grip used by 100% of executive chefs',
        estimatedMinutes: 8,
        status: 'completed',
        microFocus: 'Damp towel stabilization & thumb-index blade lock',
        prescribedDrill: 'Dry Grip Balance Check & Board Stability Verification',
        keyObjectives: ['Zero board wobble', 'Blade pinched securely', 'Relaxed handle fingers'],
        beginnerSteps: ['Damp paper towel under board', 'Pinch blade steel directly above handle', 'Wrap remaining 3 fingers relaxed']
      },
      {
        id: 'c-mod-2',
        disciplineId: 'cooking',
        order: 2,
        title: 'The Bear Claw & Continuous Rocking Cut',
        subtitle: 'Keep your fingers 100% safe while cutting fast',
        estimatedMinutes: 12,
        status: 'in_progress',
        microFocus: 'Knuckles guiding blade flat without exposed fingertips',
        prescribedDrill: 'Celery Batonnet Glide Drill (3 Stalks)',
        keyObjectives: ['Tuck thumb behind curled fingers', 'Continuous blade contact', 'Locomotive rocking cut'],
        beginnerSteps: ['Curl off-hand like a cat paw', 'Rest knife flat against knuckles', 'Rock blade smoothly forward and down']
      },
      {
        id: 'c-mod-3',
        disciplineId: 'cooking',
        order: 3,
        title: 'French Julienne & Fine Brunoise',
        subtitle: 'Matchstick and tiny cube cuts for clean cooking times',
        estimatedMinutes: 15,
        status: 'locked',
        microFocus: 'Square off vegetables and slice into uniform planks',
        prescribedDrill: 'Carrot French Julienne Matchstick Challenge',
        keyObjectives: ['Square vegetable edges', 'Uniform 1/8" planks', 'Even matchstick slicing'],
        beginnerSteps: ['Shave off round edges', 'Slice 1/8 inch uniform sheets', 'Stack sheets and slice into matchsticks']
      }
    ],
    subcomponents: [
      { id: 'c1', name: 'Claw Grip Safety Technique', score: 5.5, category: 'developing', history: [{ date: '2026-10-01', score: 5.0 }, { date: '2026-10-08', score: 5.5 }] },
      { id: 'c2', name: 'Julienne Speed & Uniformity', score: 4.8, category: 'weakness', history: [{ date: '2026-10-01', score: 4.5 }, { date: '2026-10-08', score: 4.8 }] },
    ],
    systemInstruction: `You are Chef Laurent. Safety, claw grip, and rocking motion first.`,
  },
  {
    id: 'guitar',
    name: 'Guitar / Instrument Technique',
    shortName: 'Guitar',
    category: 'Music',
    iconName: 'Activity',
    tagline: 'Fretboard posture, clean chord transitions, and fingerpicking',
    description: 'Thumb placement, finger arching without buzzing, and rhythmic strumming.',
    coachPersona: {
      name: 'Julian Reed',
      title: 'Studio Guitarist & Music Educator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      voiceStyle: 'Calm, patient, ear-focused',
    },
    microFocus: 'Fret Hand Thumb Center & Buzz-Free Finger Arches',
    prescribedDrill: 'G-C-D Clean Transition & Travis Picking Pattern',
    beginnerStepByStepPrep: [
      'Step 1: Sit tall with guitar body resting comfortably on right thigh.',
      'Step 2: Thumb placed behind neck across from index finger, not over top.',
      'Step 3: Arch fingertips directly onto strings like little hammers.',
      'Step 4: Keep fingers close to the fret wire without touching metal.'
    ],
    overallScore: 5.0,
    baselineOptions: [
      {
        level: 'beginner',
        title: 'Beginner',
        badge: 'Chords & Posture',
        definition: 'Brand new to guitar or struggling with string buzz.',
        realWorldScenario: 'Sore fingertips, muted notes, and taking 4 seconds to switch between C and G chords.',
        focusArea: 'Thumb placement, arched fingertips, and open chord shapes'
      },
      {
        level: 'intermediate',
        title: 'Intermediate',
        badge: 'Rhythm & Barre',
        definition: 'Can play open chords, working on Barre chords and fingerpicking.',
        realWorldScenario: 'Barre chords sound muffled on B string, and strumming hand loses tempo.',
        focusArea: 'F-barre index pressure, Travis picking syncopation, and tempo stability'
      },
      {
        level: 'advanced',
        title: 'Advanced',
        badge: 'Fretboard Speed',
        definition: 'Fluent player seeking clean lead dexterity.',
        realWorldScenario: 'Refining economy picking, scale runs, and expressive bending intonation.',
        focusArea: 'Alternate picking velocity, vibrato consistency, and fretboard visualization'
      }
    ],
    modules: [
      {
        id: 'g-mod-1',
        disciplineId: 'guitar',
        order: 1,
        title: 'Fret Hand Ergonomics & Open G & C Chords',
        subtitle: 'Eliminate wrist strain and play notes that ring out clearly',
        estimatedMinutes: 10,
        status: 'completed',
        microFocus: 'Thumb center on back of neck and arched fingertip tips',
        prescribedDrill: 'One-Finger Hammer Clarity Check across Strings 1-6',
        keyObjectives: ['Thumb behind neck', 'Fingertip arching', 'Zero muted strings'],
        beginnerSteps: ['Place thumb halfway down back of neck', 'Curve fingers like claw', 'Press right behind fret wire']
      },
      {
        id: 'g-mod-2',
        disciplineId: 'guitar',
        order: 2,
        title: 'Clean Chord Switching & The Anchor Finger',
        subtitle: 'Switch between G, C, and D smoothly without stopping your strum',
        estimatedMinutes: 15,
        status: 'in_progress',
        microFocus: 'Keep third finger planted on B string during transition',
        prescribedDrill: '60-BPM Metronome 1-Minute Chord Transition Race',
        keyObjectives: ['Anchor finger stability', 'Move all fingers as a unit', 'Maintain strum cadence'],
        beginnerSteps: ['Leave ring finger down on 3rd fret', 'Lift only index and middle', 'Drop into next shape together']
      },
      {
        id: 'g-mod-3',
        disciplineId: 'guitar',
        order: 3,
        title: 'Introduction to Travis Fingerpicking',
        subtitle: 'Alternating bass thumb and syncopated melody fingers',
        estimatedMinutes: 18,
        status: 'locked',
        microFocus: 'Thumb steady on quarter-note bass beats 1, 2, 3, 4',
        prescribedDrill: 'Thumb-Index-Thumb-Middle Fingerpicking Pattern',
        keyObjectives: ['Steady thumb bass line', 'Fingers plucking up lightly', 'Rhythmic separation'],
        beginnerSteps: ['Thumb plays root bass note', 'Index plucks G string', 'Thumb plays next bass note']
      }
    ],
    subcomponents: [
      { id: 'gt1', name: 'Fingertip Arch & String Clarity', score: 5.3, category: 'developing', history: [{ date: '2026-10-01', score: 4.8 }, { date: '2026-10-08', score: 5.3 }] },
      { id: 'gt2', name: 'Chord Switching Cadence', score: 4.7, category: 'weakness', history: [{ date: '2026-10-01', score: 4.3 }, { date: '2026-10-08', score: 4.7 }] },
    ],
    systemInstruction: `You are Julian Reed. Patient, ear-training focused, emphasize wrist relaxation.`,
  },
  {
    id: 'yoga',
    name: 'Yoga Alignment & Flow',
    shortName: 'Yoga',
    category: 'Mind & Body',
    iconName: 'Heart',
    tagline: 'Joint stacking, breath pacing, and mobility',
    description: 'Postural symmetry, Warrior alignment, spinal length, and hip leveling.',
    coachPersona: {
      name: 'Yogi Maya',
      title: 'Vinyasa & Posture Specialist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      voiceStyle: 'Soothing, grounded, articulate',
    },
    microFocus: 'Warrior II Stance Setup & Knee Stacking',
    prescribedDrill: 'Step-by-Step Warrior II Alignment Pause (5 Breaths)',
    beginnerStepByStepPrep: [
      'Step 1: Stand wide along mat edge (3.5 to 4 feet).',
      'Step 2: Turn front foot 90 degrees outward.',
      'Step 3: Bend front knee directly over ankle.',
      'Step 4: Extend arms wide and relax shoulders away from ears.'
    ],
    overallScore: 5.2,
    baselineOptions: [
      {
        level: 'beginner',
        title: 'Beginner',
        badge: 'Foundations',
        definition: 'New to yoga or tight joints seeking safety.',
        realWorldScenario: 'Unsure of foot angles, feeling strain in lower back or knees in common poses.',
        focusArea: 'Joint stacking, feet spacing, and pelvic leveling'
      },
      {
        level: 'intermediate',
        title: 'Intermediate',
        badge: 'Flow Depth',
        definition: 'Do classes regularly, want to refine alignment.',
        realWorldScenario: 'Can move through sun salutations, but shoulders creep into ears and hips torque.',
        focusArea: 'Scapular depression, hip squaring & thoracic opening'
      },
      {
        level: 'advanced',
        title: 'Advanced',
        badge: 'Inversions',
        definition: 'Daily practitioner seeking subtle balance cues.',
        realWorldScenario: 'Arm balance transitions, hollow-body engagement, and breath pacing.',
        focusArea: 'Arm balances, hollow hold & nervous system regulation'
      }
    ],
    modules: [
      {
        id: 'y-mod-1',
        disciplineId: 'yoga',
        order: 1,
        title: 'Warrior II Stance & Foundation',
        subtitle: 'Anchor the lower body with knee-over-ankle alignment',
        estimatedMinutes: 10,
        status: 'completed',
        microFocus: 'Front knee stacking over ankle and shoulder depression',
        prescribedDrill: 'Step-by-Step Warrior II Alignment Pause (5 Breaths)',
        keyObjectives: ['4-ft stance', 'Knee tracking 2nd toe', 'Shoulders relaxed'],
        beginnerSteps: ['Feet 4 feet apart', 'Front foot angled 90 degrees', 'Bend knee over front ankle']
      },
      {
        id: 'y-mod-2',
        disciplineId: 'yoga',
        order: 2,
        title: 'Downward Dog & Posterior Length',
        subtitle: 'Decompress the spine without forcing heels down',
        estimatedMinutes: 12,
        status: 'in_progress',
        microFocus: 'Spine lengthening with softly bent knees',
        prescribedDrill: 'Soft Knee Downward Dog Spine Extension',
        keyObjectives: ['Finger spread', 'Sitz bones tilted up', 'Shoulders wrapped wide'],
        beginnerSteps: ['Plant hands shoulder-width apart', 'Push hips high with knees soft', 'Lengthen through tailbone']
      }
    ],
    subcomponents: [
      { id: 'y1', name: 'Warrior II Stance Setup', score: 5.0, category: 'weakness', history: [{ date: '2026-10-01', score: 4.8 }, { date: '2026-10-08', score: 5.0 }] },
      { id: 'y2', name: 'Front Knee Alignment Over Ankle', score: 5.4, category: 'weakness', history: [{ date: '2026-10-01', score: 5.1 }, { date: '2026-10-08', score: 5.4 }] },
    ],
    systemInstruction: `You are Yogi Maya. Clear, grounding cues on joints and breath.`,
  },
  {
    id: 'golf',
    name: 'Golf Swing Biomechanics',
    shortName: 'Golf',
    category: 'Athletics',
    iconName: 'Target',
    tagline: 'Repeatable 3:1 tempo, athletic posture, and clean ball contact',
    description: 'Setup spine tilt, hip clearance, tempo ratio, and clubhead path at impact.',
    coachPersona: {
      name: 'Coach Vance',
      title: 'PGA Tour Biomechanics Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      voiceStyle: 'Methodical, calm, analytical',
    },
    microFocus: '3:1 Swing Tempo & Athletic Setup Posture',
    prescribedDrill: '7-Iron Smooth Setup & Metronome Rhythm Drill',
    beginnerStepByStepPrep: [
      'Step 1: Feet shoulder-width apart, knees flexed.',
      'Step 2: Hinge forward from hips with flat spine.',
      'Step 3: Arms hang naturally relaxed below shoulders.',
      'Step 4: 3-beat backswing followed by 1-beat downswing.'
    ],
    overallScore: 5.0,
    baselineOptions: [
      {
        level: 'beginner',
        title: 'Beginner',
        badge: 'Clean Contact',
        definition: 'New to golf, struggling with slices and whiffed contact.',
        realWorldScenario: 'Hitting behind the ball, standing too upright, and erratic ball dispersion.',
        focusArea: 'Hip hinge setup, neutral interlocking grip & ball position'
      },
      {
        level: 'intermediate',
        title: 'Intermediate',
        badge: 'Tempo & Path',
        definition: 'Shoot 85-95, battle casting and over-the-top swing path.',
        realWorldScenario: 'Occasional great drive, but slice returns under pressure when rushing transition.',
        focusArea: '3:1 backswing-to-downswing tempo & hip clearance'
      },
      {
        level: 'advanced',
        title: 'Advanced',
        badge: 'Biomechanics',
        definition: 'Single-digit handicap fine-tuning face-to-path and smash factor.',
        realWorldScenario: 'Tightening dispersion, optimizing dynamic loft, and ground reaction forces.',
        focusArea: 'Rotational deceleration and impact pressure shift'
      }
    ],
    modules: [
      {
        id: 'g-mod-1',
        disciplineId: 'golf',
        order: 1,
        title: 'Interlocking Grip & Neutral Posture',
        subtitle: 'Build a repeatable foundation before swinging the club',
        estimatedMinutes: 10,
        status: 'completed',
        microFocus: 'Neutral V-grip alignment and hip socket hinge',
        prescribedDrill: 'Setup Posture Mirror Alignment Drill',
        keyObjectives: ['Spine straight from tailbone to neck', 'Arms hanging relaxed', 'Neutral grip'],
        beginnerSteps: ['Hinge from hips', 'Let arms hang down relaxed', 'Check grip V points to right shoulder']
      },
      {
        id: 'g-mod-2',
        disciplineId: 'golf',
        order: 2,
        title: '3:1 Swing Tempo Calibration',
        subtitle: 'The universal timing secret of tour pros: 3 beats back, 1 beat through',
        estimatedMinutes: 15,
        status: 'in_progress',
        microFocus: '3-beat takeaway rhythm with zero rushed transition',
        prescribedDrill: 'Acoustic Metronome 3:1 Swing Drill',
        keyObjectives: ['Unrushed top transition', 'Smooth gravity drop downswing', 'Balanced finish pose'],
        beginnerSteps: ['Count 1-2-3 smoothly to the top', 'Pause briefly at transition', 'Drop through on count 1']
      }
    ],
    subcomponents: [
      { id: 'g1', name: 'Grip & Setup Alignment', score: 5.2, category: 'developing', history: [{ date: '2026-10-01', score: 4.8 }, { date: '2026-10-08', score: 5.2 }] },
      { id: 'g2', name: 'Downswing Hip Initiation', score: 4.5, category: 'weakness', history: [{ date: '2026-10-01', score: 4.2 }, { date: '2026-10-08', score: 4.5 }] },
    ],
    systemInstruction: `You are Coach Vance. Methodical cues on posture and 3:1 tempo.`,
  }
];

export const INITIAL_COACH_PROFILE: CoachProfile = {
  studentName: 'Alex Rivera',
  skillLevel: 'intermediate',
  totalHoursLogged: 42.5,
  targetHours: 10000,
  memberSince: 'March 2026',
  activeDisciplineId: 'tennis',
  enrolledDisciplineIds: ['tennis', 'boxing', 'cooking'],
  schedule: {
    daysPerWeek: 3,
    minutesPerDay: 30,
    totalWeeklyMinutes: 90,
  },
  audioGuidanceEnabled: true,
  batteryLevel: 94,
  hasCompletedOnboarding: false, // Default false so landing / onboarding experience is readily tested
  skillsProgress: {
    tennis: {
      disciplineId: 'tennis',
      skillLevel: 'intermediate',
      primaryGoal: 'Master backhand slice and serve consistency',
      schedule: { daysPerWeek: 3, minutesPerDay: 30, totalWeeklyMinutes: 90 },
      completedModuleIds: ['t-mod-1', 't-mod-2'],
      currentModuleId: 't-mod-3',
      progressPercent: 50,
      lastPracticedDate: 'Yesterday',
      hoursSpent: 26.5,
    },
    boxing: {
      disciplineId: 'boxing',
      skillLevel: 'beginner',
      primaryGoal: 'Learn high guard protection and fast 1-2 combo recoil',
      schedule: { daysPerWeek: 3, minutesPerDay: 20, totalWeeklyMinutes: 60 },
      completedModuleIds: ['b-mod-1'],
      currentModuleId: 'b-mod-2',
      progressPercent: 33,
      lastPracticedDate: '2 days ago',
      hoursSpent: 8.0,
    },
    cooking: {
      disciplineId: 'cooking',
      skillLevel: 'beginner',
      primaryGoal: 'Master safe knife claw grip and uniform julienne prep',
      schedule: { daysPerWeek: 2, minutesPerDay: 20, totalWeeklyMinutes: 40 },
      completedModuleIds: ['c-mod-1'],
      currentModuleId: 'c-mod-2',
      progressPercent: 33,
      lastPracticedDate: '4 days ago',
      hoursSpent: 8.0,
    },
  },
  coachNotesLog: [
    {
      id: 'cn-1',
      date: 'Oct 8, 2026',
      disciplineId: 'tennis',
      note: 'Solid topspin windshield-wiper finish on forehand. Focus on locking wrist at 90° for backhand volley.',
      prescription: 'Backhand wall punch drill with lead foot cross-step.',
    },
    {
      id: 'cn-2',
      date: 'Oct 6, 2026',
      disciplineId: 'boxing',
      note: 'Good high guard stance stability. Ensure rear foot rotates completely when throwing the cross.',
      prescription: '1-2 laser combo drill focusing on rear hip pivot.',
    },
    {
      id: 'cn-3',
      date: 'Oct 4, 2026',
      disciplineId: 'cooking',
      note: 'Board stability verified with damp towel. Maintain claw finger curl on celery cuts.',
      prescription: 'Bear claw continuous rocking stroke practice.',
    }
  ]
};

export const INITIAL_VIDEO_CLIPS: VideoClip[] = [
  {
    id: 'clip-tennis-1',
    title: 'Forehand Topspin - Brush Arc & Follow-Through',
    disciplineId: 'tennis',
    createdAt: '2026-10-08T14:30:00Z',
    durationSeconds: 4.8,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-outdoors-42289-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    fpsCaptured: 30,
    isMilestone: true,
    sizeMB: 12.4,
    tags: ['Tennis', 'Module 2 Completed', 'Topspin Arc'],
    repType: 'model',
    coachVoiceoverText: 'Clean brush arc. You dropped the racquet 8 inches below the ball and accelerated smoothly through the follow-through.',
    keyframeNotes: [
      { timeOffsetSeconds: 0.8, label: 'Preparation: Shoulder Coil', description: 'Early 90 degree shoulder turn before bounce.', type: 'good' },
      { timeOffsetSeconds: 1.5, label: 'Drop: Below Contact Zone', description: 'Racquet head dropped cleanly under ball height.', type: 'good' },
      { timeOffsetSeconds: 2.2, label: 'Impact: Brush & Wrap', description: 'Heavy topspin revolution generated with firm wrist.', type: 'good' },
    ]
  },
  {
    id: 'clip-boxing-1',
    title: '1-2 Straight Combo - Hip Rotation & Snap',
    disciplineId: 'boxing',
    createdAt: '2026-10-06T11:15:00Z',
    durationSeconds: 3.5,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-outdoors-42289-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    fpsCaptured: 30,
    isMilestone: true,
    sizeMB: 8.9,
    tags: ['Boxing', 'Module 1 Mastered', 'Guard Shield'],
    repType: 'model',
    coachVoiceoverText: 'Excellent chin tuck. Notice how the lead shoulder protected your jaw during the jab extension.',
    keyframeNotes: [
      { timeOffsetSeconds: 0.6, label: 'Jab: Shoulder Shield', description: 'Lead shoulder raised to cheekbone.', type: 'good' },
      { timeOffsetSeconds: 1.4, label: 'Cross: Rear Foot Pivot', description: 'Full 90 degree hip twist and rear ball-of-foot pivot.', type: 'good' },
      { timeOffsetSeconds: 2.1, label: 'Recoil: Return to Guard', description: 'Hands snapped straight back to temple.', type: 'good' },
    ]
  },
  {
    id: 'clip-cooking-1',
    title: 'Bear Claw Knife Hold & Batonnet Cuts',
    disciplineId: 'cooking',
    createdAt: '2026-10-04T18:45:00Z',
    durationSeconds: 5.2,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-outdoors-42289-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600',
    fpsCaptured: 30,
    isMilestone: true,
    sizeMB: 10.1,
    tags: ['Knife Skills', 'Module 1', 'Safety Pinch'],
    repType: 'model',
    coachVoiceoverText: 'Zero slippage. The cutting board remained anchored and knuckles acted as a firm safety barrier.',
    keyframeNotes: [
      { timeOffsetSeconds: 1.0, label: 'Anchor: Damp Towel', description: 'Board zero play verified.', type: 'good' },
      { timeOffsetSeconds: 2.0, label: 'Pinch Grip: Forefinger Lock', description: 'Direct pinch across blade spine.', type: 'good' },
      { timeOffsetSeconds: 3.5, label: 'Claw: Knuckle Guide', description: 'Fingertips safely curled behind blade.', type: 'good' },
    ]
  }
];

export const INITIAL_SESSIONS: SessionReport[] = [];

export const INITIAL_LOCAL_MATCHES: LocalMatchPartner[] = [
  {
    id: 'p-1',
    name: 'Jordan Chen',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    disciplineId: 'tennis',
    skillScore: 5.6,
    distanceMiles: 1.4,
    locationName: 'Oakwood Tennis Club',
    matchPercentage: 98,
    verifiedByCoach: true,
    recentBreakthrough: 'AI verified Module 2 Topspin Swing Arc',
    badge: 'Intermediate Sparring Partner',
  },
  {
    id: 'p-2',
    name: 'Tasha Williams',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    disciplineId: 'boxing',
    skillScore: 5.4,
    distanceMiles: 2.3,
    locationName: 'Downtown Fight Club & Gym',
    matchPercentage: 95,
    verifiedByCoach: true,
    recentBreakthrough: 'Mastered High Guard & 1-2 Laser Recoil',
    badge: 'Shadowboxing Partner',
  },
  {
    id: 'p-3',
    name: 'Sofia Gomez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    disciplineId: 'cooking',
    skillScore: 5.2,
    distanceMiles: 2.1,
    locationName: 'Culinary Arts Community Kitchen',
    matchPercentage: 94,
    verifiedByCoach: true,
    recentBreakthrough: 'Mastered Safe Pinch Grip & Damp Towel Anchoring',
    badge: 'Culinary Practice Partner',
  }
];
