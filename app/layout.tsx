import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "ASL Knowledge Explorer", description: "Natural-language exploration of an OntoLex-Lemon ASL knowledge graph" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
