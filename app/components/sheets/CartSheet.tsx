import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Sheet } from './Sheet';
import { ItemThumb } from '../chat/ItemThumb';
import { Colors } from '../../constants/colors';
import { CartLine } from '../../utils/aiActions';
import { MENU_BY_ID } from '../../constants/menu';

type Props = {
  open: boolean;
  onClose: () => void;
  cart: CartLine[];
  onChangeQty: (index: number, qty: number) => void;
  onClear: () => void;
  onCheckout: () => void;
};

export function CartSheet({ open, onClose, cart, onChangeQty, onClear, onCheckout }: Props) {
  const subtotal = cart.reduce((s, l) => s + l.qty * l.price, 0);
  const tax = subtotal * 0.0875;
  const total = subtotal + tax;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Your order"
      height={0.86}
      rightAction={cart.length > 0 ? (
        <Pressable onPress={onClear} hitSlop={12}>
          <Text style={styles.clearBtn}>Clear</Text>
        </Pressable>
      ) : undefined}
    >
      {cart.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.emptyBody}>Ask Marigold to add something for you.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          {cart.map((line, idx) => {
            const item = MENU_BY_ID[line.menuId];
            if (!item) return null;
            return (
              <View key={idx} style={styles.line}>
                <ItemThumb item={item} size={56} radius={12} />
                <View style={styles.lineInfo}>
                  <Text style={styles.lineName}>{item.name}</Text>
                  {!!line.notes && <Text style={styles.lineNotes}>{line.notes}</Text>}
                  <Text style={styles.lineTotal}>${(line.qty * line.price).toFixed(2)}</Text>
                </View>
                <Stepper qty={line.qty} onChange={(q) => onChangeQty(idx, q)} />
              </View>
            );
          })}

          <View style={styles.totals}>
            <TotalRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <TotalRow label="Tax" value={`$${tax.toFixed(2)}`} />
            <TotalRow label="Total" value={`$${total.toFixed(2)}`} bold />
          </View>

          <View style={styles.ctaWrap}>
            <Pressable onPress={onCheckout} style={styles.cta}>
              <Text style={styles.ctaLeft}>Place order</Text>
              <Text style={styles.ctaRight}>${total.toFixed(2)} →</Text>
            </Pressable>
          </View>
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </Sheet>
  );
}

function Stepper({ qty, onChange }: { qty: number; onChange: (q: number) => void }) {
  return (
    <View style={styles.stepper}>
      <Pressable onPress={() => onChange(qty - 1)} style={styles.stepBtn} hitSlop={8}>
        <Text style={styles.stepBtnText}>−</Text>
      </Pressable>
      <Text style={styles.stepQty}>{qty}</Text>
      <Pressable onPress={() => onChange(qty + 1)} style={styles.stepBtn} hitSlop={8}>
        <Text style={styles.stepBtnText}>+</Text>
      </Pressable>
    </View>
  );
}

function TotalRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.totalRow}>
      <Text style={[styles.totalLabel, bold && styles.totalBold]}>{label}</Text>
      <Text style={[styles.totalValue, bold && styles.totalBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  clearBtn: { fontFamily: 'Geist_500Medium', fontSize: 14, color: Colors.terra },
  empty: { paddingVertical: 60, paddingHorizontal: 32, alignItems: 'center' },
  emptyTitle: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 28, color: Colors.ink, marginBottom: 8 },
  emptyBody: { fontFamily: 'Geist_400Regular', fontSize: 14, color: Colors.inkSoft, textAlign: 'center' },
  scroll: { flex: 1 },
  line: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: Colors.hairline, alignItems: 'center' },
  lineInfo: { flex: 1, minWidth: 0 },
  lineName: { fontFamily: 'Geist_500Medium', fontSize: 15, color: Colors.ink, lineHeight: 19 },
  lineNotes: { fontFamily: 'Geist_400Regular', fontSize: 12, color: Colors.inkSoft, marginTop: 2 },
  lineTotal: { fontFamily: 'Geist_400Regular', fontSize: 13, color: Colors.ink, marginTop: 4 },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.cream, borderRadius: 100, padding: 2 },
  stepBtn: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontFamily: 'Geist_400Regular', fontSize: 16, color: Colors.ink, lineHeight: 20 },
  stepQty: { fontFamily: 'Geist_600SemiBold', fontSize: 14, color: Colors.ink, minWidth: 24, textAlign: 'center' },
  totals: { marginHorizontal: 20, paddingVertical: 16, borderTopWidth: 0.5, borderStyle: 'dashed', borderTopColor: Colors.hairline, gap: 6, marginTop: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontFamily: 'Geist_400Regular', fontSize: 13.5, color: Colors.inkSoft },
  totalValue: { fontFamily: 'Geist_400Regular', fontSize: 13.5, color: Colors.inkSoft },
  totalBold: { fontFamily: 'Geist_600SemiBold', fontSize: 16, color: Colors.ink },
  ctaWrap: { paddingHorizontal: 20, paddingTop: 8 },
  cta: { backgroundColor: Colors.ink, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ctaLeft: { fontFamily: 'Geist_600SemiBold', fontSize: 15, color: '#fff', letterSpacing: -0.1 },
  ctaRight: { fontFamily: 'Geist_600SemiBold', fontSize: 15, color: '#fff', letterSpacing: -0.1 },
});
