import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from '../src/components/HomeScreen';
import { Onboarding } from '../src/components/Onboarding';
import { useCareStore } from '../src/store/useCareStore';

export default function IndexRoute() {
  const onboardingComplete = useCareStore((state) => state.onboardingComplete);

  return (
    <>
      {onboardingComplete ? <HomeScreen /> : <Onboarding />}
      <StatusBar style="dark" />
    </>
  );
}
