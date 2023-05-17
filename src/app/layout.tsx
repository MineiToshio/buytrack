import Providers from "@/modules/Providers";
import Navbar from "@/modules/Navbar";
import { regularFont } from "@/styles/fonts";
import "@/styles/globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="es">
      <body className={regularFont.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
