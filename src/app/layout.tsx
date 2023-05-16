import Navbar from "@/modules/Navbar";
import { regularFont } from "@/styles/fonts";
import "@/styles/globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="es">
      <body className={regularFont.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
