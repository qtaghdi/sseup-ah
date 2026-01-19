import "../app/global.css";
import Providers from "src/widgets/layouts/provider";
import "@bigtablet/design-system/style.css";
import "../shared/styles/token.scss";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "씁.. 아…",
    description: "프로젝트 피드백, 친구처럼 솔직하게",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <link rel="icon" href="/images/logo/img.png" />
        </head>
        <body className="font-sans antialiased">
        <div id="modal" />
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}