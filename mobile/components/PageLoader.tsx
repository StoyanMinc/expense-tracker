import { styles } from '@/assets/styles/home.styles';
import { COLORS } from '@/constants/colors';
import { View, ActivityIndicator } from 'react-native';

export default function PageLoader() {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color={COLORS.primary} />
        </View>
    );
}