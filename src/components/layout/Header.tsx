import { useState, useEffect } from "react";
import Icon from "../ui/Icon";

export default function Header() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="check" />
          </span>
          <span>
            Todo<span className="brand-light">App</span>
          </span>
        </div>
        <time className="header-date">{now.toLocaleTimeString("ja-JP", { hour12: false })}</time>
      </div>
    </header>
  );
}
