"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const screenshots = [
  { src: "/dashboard.png", label: "Dashboard" },
  { src: "/products.png", label: "Products" },
  { src: "/movements.png", label: "Stock Movements" },
  { src: "/users.png", label: "Users" },
  { src: "/settings.png", label: "Settings" },
];

const AUTOPLAY_INTERVAL = 5000;

export function ScreenshotSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const next = () => go(current === screenshots.length - 1 ? 0 : current + 1);

  // autoplay
  useEffect(() => {
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [current]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border shadow-2xl overflow-hidden bg-muted/30">
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-xs text-muted-foreground ml-2">stocksense</span>
        </div>

        <motion.div
          className="relative overflow-hidden"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50)
              go(current === screenshots.length - 1 ? 0 : current + 1);
            if (info.offset.x > 50)
              go(current === 0 ? screenshots.length - 1 : current - 1);
          }}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={screenshots[current].src}
                  alt={screenshots[current].label}
                  width={1921}
                  height={894}
                  className="w-full"
                  draggable={false}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current
                ? "bg-foreground scale-125"
                : "bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
