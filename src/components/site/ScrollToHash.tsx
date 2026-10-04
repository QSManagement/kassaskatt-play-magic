import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0 });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer: number | undefined;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (tries++ < 20) timer = window.setTimeout(attempt, 50);
    };
    attempt();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
}
