import { useEffect, useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, Text, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
};

export function Composer({ value, onChange, onSend }: Props) {
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const canSend = value.trim().length > 0;

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const bottomPad = keyboardVisible ? 8 : Math.max(insets.bottom, 12);

  return (
    <View style={[styles.wrap, { paddingBottom: bottomPad }]}>
      <View style={styles.pill}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Tell Viridien what you'd like…"
          placeholderTextColor={Colors.inkSoft}
          style={styles.input}
          returnKeyType="send"
          onSubmitEditing={() => canSend && onSend()}
          blurOnSubmit={false}
        />
        <Pressable
          onPress={() => canSend && onSend()}
          style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
          disabled={!canSend}
          hitSlop={8}
        >
          <Text style={[styles.sendArrow, !canSend && styles.sendArrowDisabled]}>↑</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: Colors.creamShade,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: Colors.hairline,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  input: {
    flex: 1,
    fontFamily: 'Geist_400Regular',
    fontSize: 15,
    color: Colors.ink,
    paddingVertical: 8,
    letterSpacing: -0.1,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: 'rgba(28,24,22,0.12)' },
  sendArrow: { color: '#fff', fontSize: 18, lineHeight: 22 },
  sendArrowDisabled: { color: 'rgba(28,24,22,0.4)' },
});
