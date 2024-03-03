import { JetBrains_Mono as FontMono, Inter as FontSans, Montserrat, Roboto } from "next/font/google"

export const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const RobotoSans = Roboto({
    subsets: ["cyrillic"],
    weight: ['400', '700'],
    variable: "--font-roboto",
})

export const MontserratSans = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
})