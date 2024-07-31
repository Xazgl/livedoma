import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import { RobotoSans, MontserratSans } from "../../lib/fonts/fonts";
import { ThemeProvider } from "./component/provider/ThemeProvider";
import { BodyComp } from "./component/body/Body";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({children}: { children: React.ReactNode;}) {
  return (
    <html lang="en">
      <body className={RobotoSans.variable}>
      <ThemeProvider>
        {/* <div className={styles.background}>
          <div className={styles.content}> */}
          <BodyComp >
            {children}
          </BodyComp>
          {/* </div>
        </div> */}
      </ThemeProvider>
      </body>
    </html>
  );
}
