import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, withDelay } from 'react-native-reanimated';
import { useEffect, memo } from 'react';
import { Colors } from '../../constants/colors';
import { MgAvatar } from './MgAvatar';
import { ItemThumb } from './ItemThumb';
import { MENU_BY_ID } from '../../constants/menu';

function AsstRow({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.asstRow}>
      <MgAvatar />
      <View style={styles.asstContent}>{children}</View>
    </View>
  );
}

export function AssistantText({ text }: { text: string }) {
  return (
    <AsstRow>
      <View style={styles.asstBubble}>
        <Text style={styles.asstText}>{text}</Text>
      </View>
    </AsstRow>
  );
}

export function UserText({ text }: { text: string }) {
  return (
    <View style={styles.userRow}>
      <View style={styles.userBubble}>
        <Text style={styles.userText}>{text}</Text>
      </View>
    </View>
  );
}

function Dot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.25);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(withSequence(
      withTiming(1, { duration: 400 }),
      withTiming(0.25, { duration: 700 }),
    ), -1));
    translateY.value = withDelay(delay, withRepeat(withSequence(
      withTiming(-2, { duration: 400 }),
      withTiming(0, { duration: 700 }),
    ), -1));
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));
  return <Animated.View style={[styles.dot, style]} />;
}

export function TypingDots() {
  return (
    <AsstRow>
      <View style={styles.typingBubble}>
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </AsstRow>
  );
}

export function AssistantOrderCard({
  added, removed, onOpenCart,
}: {
  added: { menuId: string; qty: number; notes: string }[];
  removed: { menuId: string; qty: number }[];
  onOpenCart: () => void;
}) {
  return (
    <AsstRow>
      <View style={styles.card}>
        <Text style={styles.cardEyebrow}>Order updated</Text>
        {added.map((a, i) => {
          const item = MENU_BY_ID[a.menuId];
          if (!item) return null;
          return (
            <View key={`a${i}`} style={styles.orderRow}>
              <ItemThumb item={item} size={42} radius={10} />
              <View style={styles.orderInfo}>
                <Text style={styles.orderName}>{item.name}</Text>
                <Text style={styles.orderMeta}>{a.qty} × ${item.price.toFixed(2)}{a.notes ? ` · ${a.notes}` : ''}</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: Colors.sage }]}>
                <Text style={styles.statusPillText}>+</Text>
              </View>
            </View>
          );
        })}
        {removed.map((r, i) => {
          const item = MENU_BY_ID[r.menuId];
          if (!item) return null;
          return (
            <View key={`r${i}`} style={[styles.orderRow, { opacity: 0.7 }]}>
              <ItemThumb item={item} size={42} radius={10} />
              <View style={styles.orderInfo}>
                <Text style={[styles.orderName, styles.strikethrough]}>{item.name}</Text>
                <Text style={styles.orderMeta}>Removed</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: Colors.terra }]}>
                <Text style={styles.statusPillText}>−</Text>
              </View>
            </View>
          );
        })}
        <Pressable onPress={onOpenCart} style={styles.viewCartBtn}>
          <Text style={styles.viewCartText}>View cart</Text>
        </Pressable>
      </View>
    </AsstRow>
  );
}

export function AssistantSuggestCard({ ids, onAdd }: { ids: string[]; onAdd: (id: string) => void }) {
  const items = ids.map((id) => MENU_BY_ID[id]).filter(Boolean);
  if (!items.length) return null;
  return (
    <AsstRow>
      <View style={[styles.card, { paddingRight: 0, paddingBottom: 12 }]}>
        <Text style={[styles.cardEyebrow, { marginBottom: 10, paddingRight: 12 }]}>You might like</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestScroll}>
          {items.map((item) => (
            <View key={item!.id} style={styles.suggestCard}>
              <ItemThumb item={item!} size={116} radius={10} />
              <Text style={styles.suggestName}>{item!.name}</Text>
              <View style={styles.suggestFooter}>
                <Text style={styles.suggestPrice}>${item!.price.toFixed(2)}</Text>
                <Pressable onPress={() => onAdd(item!.id)} style={styles.addBtn} hitSlop={8}>
                  <Text style={styles.addBtnText}>+</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </AsstRow>
  );
}

export function AssistantCheckoutCard({ total, count, onCheckout }: { total: number; count: number; onCheckout: () => void }) {
  return (
    <AsstRow>
      <View style={styles.checkoutCard}>
        <View style={styles.checkoutGlow} />
        <Text style={styles.checkoutEyebrow}>Ready when you are</Text>
        <Text style={styles.checkoutTitle}>{count} {count === 1 ? 'item' : 'items'} · ${total.toFixed(2)}</Text>
        <Pressable onPress={onCheckout} style={styles.checkoutBtn}>
          <Text style={styles.checkoutBtnText}>Place order →</Text>
        </Pressable>
      </View>
    </AsstRow>
  );
}

export const QuickChips = memo(function QuickChips({ chips, onPick }: { chips: string[]; onPick: (c: string) => void }) {
  return (
    <View style={styles.chipsRow}>
      {chips.map((c, i) => (
        <Pressable key={i} onPress={() => onPick(c)} style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}>
          <Text style={styles.chipText}>{c}</Text>
        </Pressable>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  asstRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', maxWidth: '88%' },
  asstContent: { flex: 1, minWidth: 0 },
  asstBubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  asstText: { fontFamily: 'Geist_400Regular', fontSize: 15, lineHeight: 21, letterSpacing: -0.1, color: Colors.ink },
  userRow: { alignItems: 'flex-end' },
  userBubble: {
    maxWidth: '82%',
    backgroundColor: Colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
  userText: { fontFamily: 'Geist_400Regular', fontSize: 15, lineHeight: 21, letterSpacing: -0.1, color: '#fff' },
  typingBubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    flexDirection: 'row',
    gap: 4,
    alignSelf: 'flex-start',
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.inkSoft },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 12,
    borderWidth: 0.5,
    borderColor: Colors.hairline,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    gap: 8,
  },
  cardEyebrow: { fontFamily: 'Geist_600SemiBold', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.inkSoft },
  orderRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  orderInfo: { flex: 1, minWidth: 0 },
  orderName: { fontFamily: 'Geist_500Medium', fontSize: 14, color: Colors.ink, lineHeight: 17 },
  orderMeta: { fontFamily: 'Geist_400Regular', fontSize: 12, color: Colors.inkSoft, marginTop: 2 },
  strikethrough: { textDecorationLine: 'line-through' },
  statusPill: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statusPillText: { color: '#fff', fontSize: 13, fontFamily: 'Geist_700Bold', lineHeight: 16 },
  viewCartBtn: { backgroundColor: Colors.cream, borderRadius: 12, paddingVertical: 9, paddingHorizontal: 12, marginTop: 4 },
  viewCartText: { fontFamily: 'Geist_600SemiBold', fontSize: 13, color: Colors.ink, letterSpacing: -0.1, textAlign: 'center' },
  suggestScroll: { paddingRight: 12, gap: 10 },
  suggestCard: { width: 132, backgroundColor: Colors.cream, borderRadius: 14, padding: 8, gap: 6 },
  suggestName: { fontFamily: 'Geist_500Medium', fontSize: 13, lineHeight: 16, color: Colors.ink },
  suggestFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  suggestPrice: { fontFamily: 'Geist_400Regular', fontSize: 12, color: Colors.inkSoft },
  addBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 16, fontFamily: 'Geist_500Medium', lineHeight: 20 },
  checkoutCard: {
    backgroundColor: Colors.ink,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    padding: 14,
    overflow: 'hidden',
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    gap: 4,
  },
  checkoutGlow: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.marigold,
    opacity: 0.5,
  },
  checkoutEyebrow: { fontFamily: 'Geist_600SemiBold', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' },
  checkoutTitle: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 24, lineHeight: 27, color: '#fff', marginBottom: 8 },
  checkoutBtn: { backgroundColor: Colors.marigold, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16 },
  checkoutBtnText: { fontFamily: 'Geist_600SemiBold', fontSize: 14, letterSpacing: -0.1, color: Colors.ink, textAlign: 'center' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingLeft: 36 },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 0.5,
    borderColor: Colors.hairline,
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 12,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  chipPressed: { opacity: 0.6 },
  chipText: { fontFamily: 'Geist_500Medium', fontSize: 13, color: Colors.ink, letterSpacing: -0.1 },
});
