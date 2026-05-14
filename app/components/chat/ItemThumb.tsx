import { View, Text, StyleSheet } from 'react-native';
import { MenuItem } from '../../constants/menu';

type Props = { item: MenuItem; size?: number; radius?: number };

export function ItemThumb({ item, size = 56, radius = 14 }: Props) {
  const h = item.hue ?? 30;
  const initials = item.name.split(' ').slice(0, 2).map((w) => w[0]).join('');

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: radius }]}>
      <View style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
        <View style={[
          StyleSheet.absoluteFill,
          { backgroundColor: `hsl(${h}, 55%, 60%)`, borderRadius: radius },
        ]} />
        <View style={[
          StyleSheet.absoluteFill,
          styles.overlay,
          { borderRadius: radius },
        ]} />
      </View>
      <Text style={[styles.initials, { fontSize: size * 0.28 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  initials: {
    fontFamily: 'InstrumentSerif_400Regular',
    color: 'rgba(255,255,255,0.92)',
    letterSpacing: 0.5,
    padding: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
