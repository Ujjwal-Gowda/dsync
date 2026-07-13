import QueryProvider from '@/provider/query-provider';
import "@radix-ui/themes/styles.css";
import "./global.css";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={cn("font-sans", geist.variable)}>
            <body>
                <ThemeProvider attribute="class">
                    <Theme
                        accentColor="mint"
                        grayColor="gray"
                        panelBackground="solid"
                        scaling="100%"
                    >
                        <QueryProvider>
                            {children}
                        </QueryProvider>
                    </Theme>
                </ThemeProvider>
            </body>
        </html>
    );
}
