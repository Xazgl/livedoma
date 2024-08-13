import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RobotoSans, MontserratSans } from "../../lib/fonts/fonts";
import { ThemeProvider } from "./component/provider/ThemeProvider";
import { BodyComp } from "./component/body/Body";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Мультилистинг Волгоград",
  description: "Лучшие предложения для ваших клиентов",
};

export default function RootLayout({children}: { children: React.ReactNode;}) {
  return (
    <html lang="en">
      <body className={RobotoSans.variable}>
      <ThemeProvider>
          <BodyComp >
            {children}
          </BodyComp>
      </ThemeProvider>
      </body>
    </html>
  );
}
