import Providers from "@/modules/Providers";
import Navbar from "@/modules/Navbar";
import { regularFont } from "@/styles/fonts";
import "@/styles/globals.css";
import { cn } from "@/styles/utils";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="es">
      <body className={cn("pt-20", regularFont.className)}>
        <Providers>
          {/* @ts-expect-error */}
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
