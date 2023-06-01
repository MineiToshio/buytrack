import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
};

function Portal({ children }: Props) {
  const [portalDiv, setPortalDiv] = useState<HTMLElement>();

  useEffect(() => {
    const div = document.getElementById("portal")!;
    setPortalDiv(div);
  }, []);

  if (!portalDiv) return null;

  return createPortal(children, portalDiv);
}

export default Portal;
