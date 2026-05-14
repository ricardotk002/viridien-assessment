import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRef, useState } from 'react';
import { Sheet } from './Sheet';
import { ItemThumb } from '../chat/ItemThumb';
import { Colors } from '../../constants/colors';
import { MENU, CATEGORIES, MenuItem } from '../../constants/menu';

type Props = { open: boolean; onClose: () => void; onAdd: (id: string) => void };

export function MenuSheet({ open, onClose, onAdd }: Props) {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]);
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});
  const isProgrammaticScroll = useRef(false);

  const jumpTo = (cat: string) => {
    isProgrammaticScroll.current = true;
    setActiveCat(cat);
    const offset = sectionOffsets.current[cat];
    if (offset !== undefined) scrollRef.current?.scrollTo({ y: offset - 8, animated: true });
    setTimeout(() => { isProgrammaticScroll.current = false; }, 500);
  };

  return (
    <Sheet open={open} onClose={onClose} title="Menu" height={0.92}>
      <View style={styles.railWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.railContent}>
          {CATEGORIES.map((cat) => (
            <Pressable key={cat} onPress={() => jumpTo(cat)} style={[styles.pill, activeCat === cat && styles.pillActive]}>
              <Text style={[styles.pillText, activeCat === cat && styles.pillTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        onScroll={(e) => {
          if (isProgrammaticScroll.current) return;
          const y = e.nativeEvent.contentOffset.y;
          let current = CATEGORIES[0];
          for (const cat of CATEGORIES) {
            const offset = sectionOffsets.current[cat];
            if (offset !== undefined && offset - y < 80) current = cat;
          }
          setActiveCat(current);
        }}
        scrollEventThrottle={16}
      >
        {CATEGORIES.map((cat) => (
          <View key={cat} onLayout={(e) => { sectionOffsets.current[cat] = e.nativeEvent.layout.y; }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{cat}</Text>
              <View style={styles.sectionLine} />
            </View>
            {MENU.filter((m) => m.cat === cat).map((item) => (
              <MenuRow key={item.id} item={item} onAdd={onAdd} />
            ))}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </Sheet>
  );
}

function MenuRow({ item, onAdd }: { item: MenuItem; onAdd: (id: string) => void }) {
  const [pressed, setPressed] = useState(false);
  const tagColors: Record<string, { bg: string; fg: string; label: string }> = {
    spicy: { bg: 'rgba(200,79,47,0.12)', fg: Colors.terra, label: 'Spicy' },
    veg: { bg: 'rgba(92,117,86,0.14)', fg: Colors.sage, label: 'Veg' },
    popular: { bg: 'rgba(217,155,60,0.18)', fg: '#8a5e1a', label: 'Popular' },
  };

  return (
    <View style={styles.row}>
      <ItemThumb item={item} size={64} radius={12} />
      <View style={styles.rowInfo}>
        <View style={styles.rowTop}>
          <Text style={styles.rowName}>{item.name}</Text>
          <Text style={styles.rowPrice}>{item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}</Text>
        </View>
        <Text style={styles.rowDesc}>{item.desc}</Text>
        <View style={styles.rowBottom}>
          {item.tags.map((t) => {
            const tc = tagColors[t];
            return tc ? (
              <View key={t} style={[styles.tag, { backgroundColor: tc.bg }]}>
                <Text style={[styles.tagText, { color: tc.fg }]}>{tc.label}</Text>
              </View>
            ) : null;
          })}
          <View style={{ flex: 1 }} />
          <Pressable
            onPressIn={() => setPressed(true)}
            onPressOut={() => { setPressed(false); onAdd(item.id); }}
            style={[styles.plusBtn, pressed && styles.plusBtnPressed]}
            hitSlop={8}
          >
            <Text style={styles.plusBtnText}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  railWrap: { borderBottomWidth: 0.5, borderBottomColor: Colors.hairline },
  railContent: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12 },
  pill: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 100 },
  pillActive: { backgroundColor: Colors.ink },
  pillText: { fontFamily: 'Geist_500Medium', fontSize: 13, color: Colors.inkSoft, letterSpacing: -0.1 },
  pillTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  sectionTitle: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 26, color: Colors.ink, lineHeight: 30 },
  sectionLine: { flex: 1, height: 0.5, backgroundColor: Colors.hairline },
  row: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: Colors.hairline, alignItems: 'flex-start' },
  rowInfo: { flex: 1, minWidth: 0 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' },
  rowName: { fontFamily: 'Geist_500Medium', fontSize: 15, color: Colors.ink, lineHeight: 19, letterSpacing: -0.2, flex: 1 },
  rowPrice: { fontFamily: 'Geist_500Medium', fontSize: 14, color: Colors.ink },
  rowDesc: { fontFamily: 'Geist_400Regular', fontSize: 12.5, color: Colors.inkSoft, lineHeight: 17, marginTop: 3 },
  rowBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  tag: { paddingVertical: 3, paddingHorizontal: 7, borderRadius: 100 },
  tagText: { fontFamily: 'Geist_600SemiBold', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.3 },
  plusBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  plusBtnPressed: { transform: [{ scale: 0.85 }] },
  plusBtnText: { color: '#fff', fontSize: 18, fontFamily: 'Geist_500Medium', lineHeight: 22 },
});
