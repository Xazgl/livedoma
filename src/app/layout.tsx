import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RobotoSans, MontserratSans } from "../../lib/fonts/fonts";
import { ThemeProvider } from "./component/provider/ThemeProvider";
import { BodyComp } from "./component/body/Body";
import { store } from "./redux/store";
import { ProviderRedux } from "./component/provider/ProviderRedux";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Мультилистинг Волгоград",
  description: "Лучшие предложения для ваших клиентов",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={RobotoSans.variable}>
        <ProviderRedux>
          <ThemeProvider>
            <BodyComp>{children}</BodyComp>
          </ThemeProvider>
        </ProviderRedux>
      </body>
    </html>
  );
}
