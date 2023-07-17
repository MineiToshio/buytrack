import Footer from "@/modules/Footer";
import Navbar from "@/modules/Navbar";
import Providers from "@/modules/Providers";
import { regularFont } from "@/styles/fonts";
import "@/styles/globals.css";
import { cn } from "@/styles/utils";
import NextTopLoader from "nextjs-toploader";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="es">
      <body className={cn("pt-20", regularFont.className)}>
        <NextTopLoader />
        <Providers>
          {/* @ts-expect-error */}
          <Navbar />
          <div className="min-h-[calc(100vh-12.5rem)]">{children}</div>
          <Footer />
        </Providers>
        <div id="portal" />
      </body>
    </html>
  );
};

export default RootLayout;
