export type RootStackParamList = {
  Welcome: undefined;
  WelcomeBack: undefined;
  Login: undefined;
  Plans: undefined;
  MainTabs: undefined;

  PlanDetails: {
    duration: number;
  };

  DayExercises: {
    day: number;
    level: 'beginner' | 'intermediate' | 'advanced';
  };

  DayWorkout: {
    day: number;
    level: 'beginner' | 'intermediate' | 'advanced';
  };
};
