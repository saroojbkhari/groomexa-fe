import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

/** Product typography: Fraunces (soft serif) for headings, Plus Jakarta Sans for UI text. Loaded only by the app layouts. */
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-app-sans", display: "swap" });
const display = Fraunces({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-app-display", display: "swap" });

/** Apply to a wrapper element: exposes the font variables and switches `font-sans`/`font-display` to them. */
export const appFontClass = `${sans.variable} ${display.variable} app-type`;
