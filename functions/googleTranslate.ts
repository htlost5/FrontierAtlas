export async function translateText(text: string, target: "en" | "ja") {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    // 翻訳結果は配列の1番目の配列の0番目に入る
    const translated = data[0].map((item: any) => item[0]).join("");
    return translated;
  } catch (e) {
    console.error("Translation error:", e);
    return text; // エラー時はそのまま返す
  }
}