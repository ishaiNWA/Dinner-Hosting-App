import Auth from "@/app/Auth"
import CompleteRegistration from "@/app/CompleteRegistration"
import GuestDashboard from "@/app/GuestDashboard"
import HostDashboard from "@/app/HostDashboard"
import { useAuthContext } from "@/contexts/AuthContext"
import { UserRole } from "@/types/auth"
import { useFonts } from "expo-font"
import { ActivityIndicator } from "react-native"



export default function Index() {

const {isLoggedIn , isRegistrationComplete , userRole, isLoading} = useAuthContext()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  if(isLoading){
    return <ActivityIndicator size="large" color="#0000ff" />
  }
  if(isLoggedIn){
    if(!isRegistrationComplete){
      return <CompleteRegistration />
    } else {
     return userRole === UserRole.HOST ? <HostDashboard /> : <GuestDashboard />
    }
  }
  return <Auth />
}
