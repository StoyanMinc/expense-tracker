import { styles } from '@/assets/styles/home.styles'
import { COLORS, THEMES } from '@/constants/colors'
import { useTheme } from '@/contexts/ThemeContexts'
import { useClerk } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Alert, TouchableOpacity } from 'react-native'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const { selectedTheme } = useTheme();

  const handleSignOut = async () => {
    Alert.alert('Logout', 'Are you sure want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => signOut() }
    ])
  }
  return (
    <TouchableOpacity style={[styles.logoutButton, { backgroundColor: THEMES[selectedTheme].card }]} onPress={handleSignOut}>
      <Ionicons name='log-out-outline' size={22} color={COLORS.text} />
    </TouchableOpacity>
  )
}