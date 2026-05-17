export type Exercise = {
  name: string;
  duration: string;
  video: string;
};

export type DayWorkout = {
  day: number;
  title: string;
  exercises: Exercise[];
};

export type Level = 'beginner' | 'intermediate' | 'advanced';

export const workouts: Record<Level, DayWorkout[]> = {
  /* =======================
     BEGINNER – 90 DAYS
     ======================= */
  beginner: [
    {
      day: 1,
      title: 'Full Body Basics',
      exercises: [
        { name: 'Jumping Jacks', duration: '30 sec', video: 'https://youtu.be/c4DAnQ6DtF8' },
        { name: 'Bodyweight Squats', duration: '12 reps', video: 'https://youtu.be/aclHkVaku9U' },
        { name: 'Knee Push Ups', duration: '10 reps', video: 'https://youtu.be/0GsVJsS6474' },
        { name: 'Standing Crunch', duration: '15 reps', video: 'https://youtu.be/Xyd_fa5zoEU' },
      ],
    },
    {
      day: 2,
      title: 'Lower Body',
      exercises: [
        { name: 'Squats', duration: '15 reps', video: 'https://youtu.be/aclHkVaku9U' },
        { name: 'Reverse Lunges', duration: '10 reps', video: 'https://youtu.be/QOVaHwm-Q6U' },
        { name: 'Calf Raises', duration: '20 reps', video: 'https://youtu.be/-M4-G8p8fmc' },
        { name: 'Wall Sit', duration: '30 sec', video: 'https://youtu.be/y-wV4Venusw' },
      ],
    },
    {
      day: 3,
      title: 'Upper Body',
      exercises: [
        { name: 'Wall Push Ups', duration: '12 reps', video: 'https://youtu.be/9xw5CxkIYbY' },
        { name: 'Arm Circles', duration: '30 sec', video: 'https://youtu.be/140RTNMciH8' },
        { name: 'Shoulder Stretch', duration: '30 sec', video: 'https://youtu.be/2L2lnxIcNmo' },
      ],
    },
    {
      day: 4,
      title: 'Active Recovery',
      exercises: [
        { name: 'Walking', duration: '10 min', video: 'https://youtu.be/enYITYwvPAQ' },
        { name: 'Full Body Stretch', duration: '5 min', video: 'https://youtu.be/g_tea8ZNk5A' },
      ],
    },
    {
      day: 5,
      title: 'Core Strength',
      exercises: [
        { name: 'Crunches', duration: '15 reps', video: 'https://youtu.be/Xyd_fa5zoEU' },
        { name: 'Leg Raises', duration: '10 reps', video: 'https://youtu.be/JB2oyawG9KI' },
        { name: 'Plank', duration: '20 sec', video: 'https://youtu.be/pSHjTRCQxIw' },
      ],
    },
    {
      day: 6,
      title: 'Full Body',
      exercises: [
        { name: 'March in Place', duration: '1 min', video: 'https://youtu.be/W9R4Y7iZ6pI' },
        { name: 'Squats', duration: '12 reps', video: 'https://youtu.be/aclHkVaku9U' },
        { name: 'Standing Side Crunch', duration: '12 reps', video: 'https://youtu.be/2pLT-olgUJs' },
      ],
    },
    {
      day: 7,
      title: 'Rest Day',
      exercises: [
        { name: 'Light Stretching', duration: '5 min', video: 'https://youtu.be/g_tea8ZNk5A' },
      ],
    },
  ],

  /* =======================
     INTERMEDIATE – 60 DAYS
     ======================= */
  intermediate: [
    {
      day: 1,
      title: 'Strength & Core',
      exercises: [
        { name: 'Push Ups', duration: '15 reps', video: 'https://youtu.be/IODxDxX7oi4' },
        { name: 'Plank', duration: '45 sec', video: 'https://youtu.be/pSHjTRCQxIw' },
        { name: 'Mountain Climbers', duration: '30 sec', video: 'https://youtu.be/nmwgirgXLYM' },
      ],
    },
    {
      day: 2,
      title: 'Leg Day',
      exercises: [
        { name: 'Squats', duration: '20 reps', video: 'https://youtu.be/aclHkVaku9U' },
        { name: 'Lunges', duration: '12 reps', video: 'https://youtu.be/QOVaHwm-Q6U' },
        { name: 'Wall Sit', duration: '45 sec', video: 'https://youtu.be/y-wV4Venusw' },
      ],
    },
    {
      day: 3,
      title: 'Upper Body',
      exercises: [
        { name: 'Wide Push Ups', duration: '12 reps', video: 'https://youtu.be/IODxDxX7oi4' },
        { name: 'Plank Shoulder Taps', duration: '20 reps', video: 'https://youtu.be/9p8EBjZs8H4' },
      ],
    },
    {
      day: 4,
      title: 'Cardio',
      exercises: [
        { name: 'High Knees', duration: '30 sec', video: 'https://youtu.be/OAJ_J3EZkdY' },
        { name: 'Jumping Jacks', duration: '40 sec', video: 'https://youtu.be/c4DAnQ6DtF8' },
      ],
    },
    {
      day: 5,
      title: 'Core Blast',
      exercises: [
        { name: 'Leg Raises', duration: '15 reps', video: 'https://youtu.be/JB2oyawG9KI' },
        { name: 'Russian Twists', duration: '20 reps', video: 'https://youtu.be/wkD8rjkodUI' },
      ],
    },
    {
      day: 6,
      title: 'Full Body',
      exercises: [
        { name: 'Burpees', duration: '10 reps', video: 'https://youtu.be/TU8QYVW0gDU' },
        { name: 'Squat Jumps', duration: '12 reps', video: 'https://youtu.be/U4s4mEQ5VqU' },
      ],
    },
    {
      day: 7,
      title: 'Rest & Mobility',
      exercises: [
        { name: 'Stretching', duration: '8 min', video: 'https://youtu.be/g_tea8ZNk5A' },
      ],
    },
  ],

  /* =======================
     ADVANCED – 30 DAYS
     ======================= */
  advanced: [
    {
      day: 1,
      title: 'HIIT Full Body',
      exercises: [
        { name: 'Burpees', duration: '15 reps', video: 'https://youtu.be/TU8QYVW0gDU' },
        { name: 'Mountain Climbers', duration: '40 sec', video: 'https://youtu.be/nmwgirgXLYM' },
        { name: 'Plank', duration: '60 sec', video: 'https://youtu.be/pSHjTRCQxIw' },
      ],
    },
    {
      day: 2,
      title: 'Power Legs',
      exercises: [
        { name: 'Squat Jumps', duration: '15 reps', video: 'https://youtu.be/U4s4mEQ5VqU' },
        { name: 'Jump Lunges', duration: '12 reps', video: 'https://youtu.be/3XDriUn0udo' },
      ],
    },
    {
      day: 3,
      title: 'Upper Body Strength',
      exercises: [
        { name: 'Diamond Push Ups', duration: '12 reps', video: 'https://youtu.be/J0DnG1_S92I' },
        { name: 'Plank Up Downs', duration: '20 reps', video: 'https://youtu.be/6kALZikXxLc' },
      ],
    },
    {
      day: 4,
      title: 'HIIT Cardio',
      exercises: [
        { name: 'High Knees', duration: '45 sec', video: 'https://youtu.be/OAJ_J3EZkdY' },
        { name: 'Burpees', duration: '12 reps', video: 'https://youtu.be/TU8QYVW0gDU' },
      ],
    },
    {
      day: 5,
      title: 'Core Destroyer',
      exercises: [
        { name: 'V Ups', duration: '15 reps', video: 'https://youtu.be/iP2fjvG0g3w' },
        { name: 'Russian Twists', duration: '30 reps', video: 'https://youtu.be/wkD8rjkodUI' },
      ],
    },
    {
      day: 6,
      title: 'Explosive Full Body',
      exercises: [
        { name: 'Burpees', duration: '15 reps', video: 'https://youtu.be/TU8QYVW0gDU' },
        { name: 'Jump Squats', duration: '15 reps', video: 'https://youtu.be/U4s4mEQ5VqU' },
      ],
    },
    {
      day: 7,
      title: 'Active Recovery',
      exercises: [
        { name: 'Deep Stretch', duration: '10 min', video: 'https://youtu.be/g_tea8ZNk5A' },
      ],
    },
  ],
};
