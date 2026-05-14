import { View, Text, Pressable, StyleSheet, Modal, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { useEffect } from 'react';
import { Colors } from '../../constants/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const EASING = Easing.bezier(0.32, 0.72, 0, 1);

type Props = {
  open: boolean;
  onClose: () => void;
  height?: number; // 0–1 fraction
  title?: string;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
};

export function Sheet({ open, onClose, height = 0.88, title, rightAction, children }: Props) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (open) {
      translateY.value = withTiming(0, { duration: 340, easing: EASING });
      backdropOpacity.value = withTiming(1, { duration: 280 });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 340, easing: EASING });
      backdropOpacity.value = withTiming(0, { duration: 280 });
    }
  }, [open]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));

  const sheetHeight = SCREEN_HEIGHT * height;

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { height: sheetHeight }, sheetStyle]}>
          <View style={styles.handle} />
          {title && (
            <View style={styles.header}>
              <Pressable onPress={onClose} hitSlop={12}>
                <Text style={styles.closeBtn}>Close</Text>
              </Pressable>
              <Text style={styles.title}>{title}</Text>
              <View style={styles.headerRight}>
                {rightAction ?? <Text style={{ opacity: 0 }}>·</Text>}
              </View>
            </View>
          )}
          <View style={styles.body}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(28,24,22,0.18)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  closeBtn: { fontFamily: 'Geist_500Medium', fontSize: 14, color: Colors.inkSoft, letterSpacing: -0.1 },
  title: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 22, color: Colors.ink, lineHeight: 26 },
  headerRight: { minWidth: 40, alignItems: 'flex-end' },
  body: { flex: 1 },
});
