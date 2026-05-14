import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

export function MgAvatar() {
  return (
    <LinearGradient
      colors={[Colors.marigold, Colors.terra]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.avatar}
    >
      <Text style={styles.letter}>v</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  letter: {
    fontFamily: 'InstrumentSerif_400Regular_Italic',
    fontSize: 18,
    color: '#fff',
    lineHeight: 22,
  },
});
