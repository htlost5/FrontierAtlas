import { translateText } from "./googleTranslate";

export default async function translation(originText: string) {
    const convertText = await translateText(originText, "en");
    return convertText;
}