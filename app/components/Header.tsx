import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

type Props = { onOpenMenu: () => void };

export function Header({ onOpenMenu }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <LinearGradient
        colors={[Colors.marigold, Colors.terra]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.brandMark}
      >
        <Text style={styles.brandLetter}>v</Text>
      </LinearGradient>

      <View style={styles.info}>
        <Text style={styles.wordmark}>Viridien</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Open · Table 12</Text>
        </View>
      </View>

      <Pressable onPress={onOpenMenu} style={styles.menuPill}>
        <Text style={styles.menuPillText}>Menu</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: Colors.cream,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.hairline,
    zIndex: 5,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.terra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  brandLetter: {
    fontFamily: 'InstrumentSerif_400Regular_Italic',
    fontSize: 22,
    color: '#fff',
    lineHeight: 26,
  },
  info: { flex: 1 },
  wordmark: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 22, lineHeight: 26, color: Colors.ink },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3a9e4f' },
  statusText: { fontFamily: 'Geist_400Regular', fontSize: 11.5, color: Colors.inkSoft },
  menuPill: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 100,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  menuPillText: { fontFamily: 'Geist_500Medium', fontSize: 13, color: Colors.ink, letterSpacing: -0.1 },
});
