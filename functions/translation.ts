/**
 * 翻訳機能のエントリーポイント
 * テキストを英語に翻訳するためのラッパー関数
 */
import { translateText } from "./googleTranslate";

/**
 * 指定されたテキストを英語に翻訳する
 * @param originText - 翻訳元のテキスト
 * @returns 英語に翻訳されたテキスト
 */
export async function translation(originText: string) {
  const convertText = await translateText(originText, "en");
  return convertText;
}
