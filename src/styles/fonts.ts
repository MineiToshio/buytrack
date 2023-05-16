import {
  Open_Sans,
  Roboto_Condensed,
  Zilla_Slab_Highlight,
} from "next/font/google";

const openSans = Open_Sans({ subsets: ["latin-ext"] });
const robotoCondensed = Roboto_Condensed({ weight: "400", subsets: ["latin"] });
const zilla = Zilla_Slab_Highlight({ weight: "700", subsets: ["latin"] });

export {
  openSans as regularFont,
  robotoCondensed as secondaryFont,
  zilla as logoFont,
};
