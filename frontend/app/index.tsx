import Auth from "@/app/Auth"
import CompleteRegistration from "@/app/CompleteRegistration"
import GuestDashboard from "@/app/GuestDashboard"
import HostDashboard from "@/app/HostDashboard"
import { useAuthContext } from "@/contexts/AuthContext"
import { UserRoles } from "@/types/auth"
import { useFonts } from "expo-font"
import { ActivityIndicator } from "react-native"



export default function Index() {

const {isLoggedIn , isRegistrationComplete , userRole, isLoading} = useAuthContext()

  console.log('🔄 INDEX.TSX RENDER - States:', {
    isLoggedIn,
    isRegistrationComplete, 
    userRole,
    isLoading
  });

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    console.log('📝 INDEX.TSX: Fonts not loaded yet');
    return null;
  }
  if(isLoading){  // Now false, so skip this
    console.log('⏳ INDEX.TSX: Still loading - showing spinner');
    return <ActivityIndicator size="large" color="#0000ff" />
}
  if(isLoggedIn){
    console.log('✅ INDEX.TSX: User is logged in');
    if(!isRegistrationComplete){
      console.log('📋 INDEX.TSX: Registration incomplete - showing CompleteRegistration');
      return <CompleteRegistration />
    } else {
      console.log(`🏠 INDEX.TSX: Registration complete - showing ${userRole} dashboard`);
     return userRole === UserRoles.HOST ? <HostDashboard /> : <GuestDashboard />
    }
  }
  console.log('🔐 INDEX.TSX: User not logged in - showing Auth');
  return <Auth />
}
