import { useEffect, useRef, useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, Text, Keyboard } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { Colors } from '../constants/colors';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSend: (text?: string) => void;
};

export function Composer({ value, onChange, onSend }: Props) {
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const pendingTranscript = useRef('');
  const canSend = value.trim().length > 0;

  const pulse = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: pulse.value > 1.2 ? 0.2 : 0.5,
  }));

  useEffect(() => {
    if (recording) {
      setElapsed(0);
      const id = setInterval(() => setElapsed((s) => s + 1), 1000);
      return () => clearInterval(id);
    }
  }, [recording]);

  useEffect(() => {
    if (recording) {
      pulse.value = withRepeat(
        withSequence(withTiming(1.8, { duration: 700 }), withTiming(1, { duration: 700 })),
        -1,
      );
    } else {
      pulse.value = withTiming(1, { duration: 150 });
    }
  }, [recording]);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  useSpeechRecognitionEvent('result', (e) => {
    pendingTranscript.current = e.results[0]?.transcript ?? '';
  });

  useSpeechRecognitionEvent('end', () => {
    setRecording(false);
    const text = pendingTranscript.current.trim();
    pendingTranscript.current = '';
    if (text) {
      onChange(text);
      onSend(text);
    }
  });

  useSpeechRecognitionEvent('error', () => {
    setRecording(false);
    pendingTranscript.current = '';
  });

  const startRecording = async () => {
    const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) return;
    pendingTranscript.current = '';
    setRecording(true);
    ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: true, continuous: true, addsPunctuation: true });
  };

  const stopRecording = () => {
    ExpoSpeechRecognitionModule.stop();
  };

  const bottomPad = keyboardVisible ? 8 : Math.max(insets.bottom, 12);

  return (
    <View style={[styles.wrap, { paddingBottom: bottomPad }]}>
      {recording ? (
        <View style={styles.recordingPill}>
          <View style={styles.pulseWrap}>
            <Animated.View style={[styles.pulseRing, pulseStyle]} />
            <View style={styles.pulseDot} />
          </View>
          <Text style={styles.recordingLabel}>Listening…</Text>
          <Text style={styles.timer}>{`${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`}</Text>
          <Pressable onPress={stopRecording} style={styles.stopBtn}>
            <Ionicons name="arrow-up" size={18} color="#fff" />
          </Pressable>
        </View>
      ) : (
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
          {canSend ? (
            <Pressable onPress={() => onSend()} style={styles.sendBtn} hitSlop={8}>
              <Text style={styles.sendArrow}>↑</Text>
            </Pressable>
          ) : (
            <Pressable onPress={startRecording} style={styles.micBtn} hitSlop={8}>
              <Ionicons name="mic" size={17} color={Colors.inkSoft} />
            </Pressable>
          )}
        </View>
      )}
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
  recordingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.terra,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    gap: 10,
  },
  pulseWrap: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.terra,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.terra,
  },
  recordingLabel: {
    flex: 1,
    fontFamily: 'Geist_400Regular',
    fontSize: 15,
    color: Colors.inkSoft,
    letterSpacing: -0.1,
  },
  timer: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: Colors.terra,
    letterSpacing: 0.5,
  },
  stopBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.terra,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontFamily: 'Geist_400Regular',
    fontSize: 15,
    color: Colors.ink,
    paddingVertical: 8,
    letterSpacing: -0.1,
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendArrow: { color: '#fff', fontSize: 18, lineHeight: 22 },
});
