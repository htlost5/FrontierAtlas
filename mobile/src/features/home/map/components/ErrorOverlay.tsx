// 初回エラー（fullscreen）とフロア切替エラー（overlay）の両方に対応する統合エラーコンポーネント
import React, { useCallback, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FONT_SIZE } from "@/src/shared/constants/typography";

type Props = {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant: "fullscreen" | "overlay";
  visible: boolean;
};

const RETRY_THROTTLE_MS = 2000;

export function ErrorOverlay({
  message,
  onRetry,
  onDismiss,
  variant,
  visible,
}: Props) {
  const lastRetryRef = useRef<number>(0);

  const handleRetry = useCallback(() => {
    const now = Date.now();
    if (now - lastRetryRef.current < RETRY_THROTTLE_MS) return;
    lastRetryRef.current = now;
    onRetry?.();
  }, [onRetry]);

  if (!visible) return null;

  if (variant === "fullscreen") {
    return (
      <View style={styles.fullscreenContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorMessage}>{message}</Text>
        {onRetry && (
          <Pressable onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>再試行</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // variant === "overlay"
  return (
    <View style={styles.overlayContainer} pointerEvents="box-none">
      <View style={styles.overlayBanner}>
        <Text style={styles.overlayMessage} numberOfLines={2}>
          {message}
        </Text>
        <View style={styles.overlayActions}>
          {onRetry && (
            <Pressable onPress={handleRetry} style={styles.overlayButton}>
              <Text style={styles.overlayButtonText}>再試行</Text>
            </Pressable>
          )}
          {onDismiss && (
            <Pressable onPress={onDismiss} style={styles.overlayButton}>
              <Text style={styles.overlayButtonText}>閉じる</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F7F9",
    padding: 32,
  },
  errorIcon: {
    fontSize: FONT_SIZE.errorIcon,
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: FONT_SIZE.body,
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: FONT_SIZE.body,
    fontWeight: "600",
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  overlayBanner: {
    backgroundColor: "#FF3B30",
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  overlayMessage: {
    color: "white",
    fontSize: FONT_SIZE.overlay,
    flex: 1,
    marginRight: 8,
  },
  overlayActions: {
    flexDirection: "row",
    gap: 8,
  },
  overlayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  overlayButtonText: {
    color: "white",
    fontSize: FONT_SIZE.overlay,
    fontWeight: "600",
  },
});
