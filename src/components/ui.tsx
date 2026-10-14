import React from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextProps,
  ViewStyle,
  StyleProp,
  Modal,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { X, ChevronRight, LucideIcon } from 'lucide-react-native';
import { colors as C, fonts as F } from '../theme';
export function T({ style, ...props }: TextProps) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: F.regular, color: C.ink, fontSize: 13, lineHeight: 21 }, style]}
    />
  );
}
export function Icon({
  icon: I,
  size = 20,
  color = C.green,
  ...props
}: {
  icon: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return <I size={size} color={color} strokeWidth={1.7} {...props} />;
}
export function Button({
  children,
  onPress,
  variant = 'primary',
  icon,
  small,
  disabled,
}: {
  children: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'white';
  icon?: LucideIcon;
  small?: boolean;
  disabled?: boolean;
}) {
  const foreground = variant === 'primary' ? '#FFF' : C.green;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ hovered, pressed }: any) => [
        {
          paddingVertical: small ? 10 : 13,
          paddingHorizontal: small ? 15 : 19,
          borderRadius: 9,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 9,
          backgroundColor:
            variant === 'primary'
              ? C.green
              : variant === 'secondary'
                ? C.soft
                : variant === 'white'
                  ? '#FFF'
                  : 'transparent',
          opacity: disabled ? 0.5 : pressed ? 0.7 : hovered ? 0.88 : 1,
        },
        variant === 'secondary' && { borderWidth: 1, borderColor: '#E1EAE1' },
      ]}
    >
      <T style={{ color: foreground, fontFamily: F.semibold, fontSize: 12 }}>{children}</T>
      {icon && <Icon icon={icon} size={15} color={foreground} />}
    </Pressable>
  );
}
export function IconButton({
  icon,
  onPress,
  label,
  color = C.muted,
  active = false,
}: {
  icon: LucideIcon;
  onPress: () => void;
  label: string;
  color?: string;
  active?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ hovered }: any) => ({
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 9,
        backgroundColor: hovered || active ? C.soft : 'transparent',
      })}
    >
      <Icon icon={icon} color={color} size={19} />
    </Pressable>
  );
}
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFF',
          borderWidth: 1,
          borderColor: C.line,
          borderRadius: 16,
          padding: 24,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
export function Badge({ children, gold = false }: { children: string; gold?: boolean }) {
  return (
    <View
      style={{
        backgroundColor: gold ? '#F7F1E5' : '#EDF5ED',
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 9,
        alignSelf: 'flex-start',
      }}
    >
      <T
        style={{
          color: gold ? '#9B7B42' : C.green,
          fontFamily: F.semibold,
          fontSize: 10,
          lineHeight: 16,
        }}
      >
        {children}
      </T>
    </View>
  );
}
export function SectionTitle({
  title,
  caption,
  action,
  onPress,
}: {
  title: string;
  caption?: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 17,
      }}
    >
      <View style={{ flex: 1 }}>
        <T style={{ fontFamily: F.bold, fontSize: 18, lineHeight: 28 }}>{title}</T>
        {caption && <T style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{caption}</T>}
      </View>
      {action && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8 }}
        >
          <T style={{ color: C.green, fontSize: 11, fontFamily: F.semibold }}>{action}</T>
          <Icon icon={ChevronRight} size={15} />
        </Pressable>
      )}
    </View>
  );
}
export function Dialog({
  visible,
  onClose,
  title,
  subtitle,
  children,
  wide = false,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(19,43,35,0.42)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <Pressable
          accessibilityLabel="Tutup dialog"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityViewIsModal
          style={{
            width: '100%',
            maxWidth: wide ? 740 : 480,
            maxHeight: '90%',
            backgroundColor: C.bg,
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 24,
              borderBottomWidth: 1,
              borderBottomColor: C.line,
            }}
          >
            <View style={{ flex: 1 }}>
              <T style={{ fontSize: 21, fontFamily: F.bold, lineHeight: 29 }}>{title}</T>
              {subtitle && <T style={{ color: C.muted, fontSize: 12, marginTop: 5 }}>{subtitle}</T>}
            </View>
            <IconButton icon={X} onPress={onClose} label="Tutup dialog" />
          </View>
          <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
export function Field({
  label,
  value,
  onChange,
  prefix = 'Rp',
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  hint?: string;
}) {
  return (
    <View style={{ marginBottom: 19 }}>
      <T style={{ fontFamily: F.semibold, fontSize: 12, marginBottom: 8 }}>{label}</T>
      <View
        style={{
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: '#DFE6DD',
          borderRadius: 9,
          backgroundColor: '#FFF',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <T style={{ color: C.muted, paddingLeft: 15, fontSize: 13 }}>{prefix}</T>
        <TextInput
          accessibilityLabel={label}
          value={value ? Number(value).toLocaleString('id-ID') : ''}
          onChangeText={(s) => onChange(s.replace(/\D/g, '').slice(0, 15))}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#ABB4AC"
          style={
            {
              flex: 1,
              padding: 14,
              color: C.ink,
              fontFamily: F.medium,
              fontSize: 14,
              outlineWidth: 0,
            } as any
          }
        />
      </View>
      {hint && <T style={{ fontSize: 10, color: C.muted, lineHeight: 17, marginTop: 6 }}>{hint}</T>}
    </View>
  );
}
export function ToggleRow({
  title,
  subtitle,
  value,
  onChange,
  disabled,
}: {
  title: string;
  subtitle?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: C.line,
      }}
    >
      <View style={{ flex: 1 }}>
        <T style={{ fontFamily: F.semibold }}>{title}</T>
        {subtitle && <T style={{ fontSize: 11, color: C.muted }}>{subtitle}</T>}
      </View>
      <Switch
        accessibilityLabel={title}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: '#DEE5DE', true: '#3F8167' }}
        thumbColor="#FFF"
      />
    </View>
  );
}
