import { Inter } from "next/font/google";
import "../globals.css";
import Topbar from "@/components/Topbar";
import Provider from "@/components/Provider";
import BottomBar from "@/components/BottomBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ZenChat",
  description: "Chat-app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-2`}>
        <Provider>
          <Topbar />
          <BottomBar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
