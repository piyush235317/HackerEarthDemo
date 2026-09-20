import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RightSideDrawer from "@/components/RightSideDrawer";
import FullscreenManager from "@/components/FullscreenManager";
import CameraProctor from "@/components/CameraProctor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EXL Digital Campus Assessment",
  description: "Online assessment platform for EXL Digital Campus Test - IIIT Allahabad",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {children}
        <RightSideDrawer />
        <FullscreenManager />
        <CameraProctor />
      </body>
    </html>
  );
}
