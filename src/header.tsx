import { useState, useEffect } from "react";

const Header = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  return (
    <header className="mb-4 flex w-full items-center justify-between bg-black px-6 py-4">
      <h1 className="m-0 text-2xl font-bold text-white">TodoApp</h1>
      <time className="tabular-nums text-white">
        {now.toLocaleTimeString("ja-JP", { hour12: false })}
      </time>
    </header>
  );
};

export default Header;
