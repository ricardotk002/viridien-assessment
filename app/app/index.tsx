import { useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useStore } from '../store/useStore';
import { Colors } from '../constants/colors';
import { Header } from '../components/Header';
import { Composer } from '../components/Composer';
import { CartBar } from '../components/CartBar';
import { MenuSheet } from '../components/sheets/MenuSheet';
import { CartSheet } from '../components/sheets/CartSheet';
import { PlacedSheet } from '../components/sheets/PlacedSheet';
import {
  AssistantText, UserText, TypingDots, QuickChips,
  AssistantOrderCard, AssistantSuggestCard, AssistantCheckoutCard,
} from '../components/chat/Bubbles';

export default function ChatScreen() {
  const {
    messages, cart, draft, thinking, sheets, lastTotal,
    setDraft, openSheet, closeSheet,
    sendMessage, addItem, changeQty, clearCart, checkout, reset,
  } = useStore();

  const scrollRef = useRef<ScrollView>(null);
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const cartTotal = cart.reduce((s, l) => s + l.qty * l.price, 0);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, thinking]);

  const handleSend = (voiceText?: string) => {
    const text = voiceText ?? draft;
    setDraft('');
    sendMessage(text);
  };

  return (
    <View style={styles.root}>
      <Header onOpenMenu={() => openSheet('menu')} />

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        {/* Scroll area with CartBar floating inside it */}
        <View style={styles.scrollArea}>
          <ScrollView
            ref={scrollRef}
            style={styles.flex}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((m) => {
              if (m.kind === 'asst-text') return <AssistantText key={m.id} text={m.text} />;
              if (m.kind === 'user-text') return <UserText key={m.id} text={m.text} />;
              if (m.kind === 'chips') return <QuickChips key={m.id} chips={m.chips} onPick={sendMessage} />;
              if (m.kind === 'order') return <AssistantOrderCard key={m.id} added={m.added} removed={m.removed} onOpenCart={() => openSheet('cart')} />;
              if (m.kind === 'suggest') return <AssistantSuggestCard key={m.id} ids={m.ids} onAdd={addItem} />;
              if (m.kind === 'checkout') return <AssistantCheckoutCard key={m.id} total={m.total} count={m.count} onCheckout={checkout} />;
              return null;
            })}
            {thinking && <TypingDots />}
          </ScrollView>

          {cart.length > 0 && (
            <CartBar count={cartCount} total={cartTotal} onOpen={() => openSheet('cart')} />
          )}
        </View>

        {/* Composer is in normal flow — KAV pushes it up with the keyboard */}
        <Composer value={draft} onChange={setDraft} onSend={handleSend} />
      </KeyboardAvoidingView>

      <MenuSheet open={sheets.menu} onClose={() => closeSheet('menu')} onAdd={addItem} />
      <CartSheet
        open={sheets.cart}
        onClose={() => closeSheet('cart')}
        cart={cart}
        onChangeQty={changeQty}
        onClear={clearCart}
        onCheckout={checkout}
      />
      <PlacedSheet
        open={sheets.placed}
        onClose={() => { closeSheet('placed'); reset(); }}
        total={lastTotal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream },
  flex: { flex: 1 },
  scrollArea: { flex: 1, position: 'relative' },
  chatContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 80,
    gap: 10,
  },
});
