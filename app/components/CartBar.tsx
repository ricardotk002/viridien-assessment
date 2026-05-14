import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';
import { Colors } from '../constants/colors';

type Props = { count: number; total: number; onOpen: () => void };

export function CartBar({ count, total, onOpen }: Props) {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 280, easing: Easing.bezier(0.32, 0.72, 0, 1) });
    opacity.value = withTiming(1, { duration: 280 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, style]}>
      <Pressable onPress={onOpen} style={styles.bar}>
        <View style={styles.left}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
          <Text style={styles.label}>View order</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.total}>${total.toFixed(2)}</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    zIndex: 8,
  },
  bar: {
    backgroundColor: Colors.ink,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.marigold, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: 'Geist_700Bold', fontSize: 12, color: Colors.ink, lineHeight: 16 },
  label: { fontFamily: 'Geist_500Medium', fontSize: 14, color: '#fff', letterSpacing: -0.1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  total: { fontFamily: 'Geist_500Medium', fontSize: 14, color: '#fff' },
  chevron: { color: '#fff', fontSize: 18, lineHeight: 22 },
});
