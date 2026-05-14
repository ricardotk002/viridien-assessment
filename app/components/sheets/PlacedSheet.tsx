import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sheet } from './Sheet';
import { Colors } from '../../constants/colors';

type Props = { open: boolean; onClose: () => void; total: number; etaMin?: number };

export function PlacedSheet({ open, onClose, total, etaMin = 18 }: Props) {
  return (
    <Sheet open={open} onClose={onClose} height={0.64}>
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.marigold, Colors.terra]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.circle}
        >
          <Text style={styles.check}>✓</Text>
        </LinearGradient>

        <Text style={styles.title}>Order in the kitchen</Text>

        <Text style={styles.body}>
          {'We\'ll have it ready in about '}
          <Text style={styles.bodyBold}>{etaMin} minutes</Text>
          {'. You\'ll get a tap on the shoulder when it\'s up.'}
        </Text>

        <View style={styles.chargeChip}>
          <Text style={styles.chargeText}>
            {'Charged '}
            <Text style={styles.chargeBold}>${total.toFixed(2)}</Text>
            {' to •••• 4242'}
          </Text>
        </View>

        <Pressable onPress={onClose} style={styles.btn}>
          <Text style={styles.btnText}>Start a new order</Text>
        </Pressable>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 16 },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.terra,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
  },
  check: { color: '#fff', fontSize: 28, fontFamily: 'Geist_700Bold' },
  title: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 36, lineHeight: 38, color: Colors.ink, textAlign: 'center' },
  body: { fontFamily: 'Geist_400Regular', fontSize: 15, color: Colors.inkSoft, lineHeight: 22, textAlign: 'center', maxWidth: 280 },
  bodyBold: { fontFamily: 'Geist_700Bold', color: Colors.ink },
  chargeChip: { backgroundColor: Colors.cream, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 18, marginTop: 8 },
  chargeText: { fontFamily: 'Geist_400Regular', fontSize: 13, color: Colors.inkSoft },
  chargeBold: { fontFamily: 'Geist_700Bold', color: Colors.ink },
  btn: { marginTop: 12, backgroundColor: Colors.ink, borderRadius: 100, paddingVertical: 12, paddingHorizontal: 24 },
  btnText: { fontFamily: 'Geist_600SemiBold', fontSize: 14, color: '#fff' },
});
