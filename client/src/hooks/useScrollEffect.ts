import { useEffect, useState, useCallback } from "react";

type ScrollDirection = "up" | "down" | "none";

interface ScrollEffectOptions {
  threshold?: number;
  scrollUpClassName?: string;
  scrollDownClassName?: string;
  initialClassName?: string;
}

interface ScrollEffectReturn {
  scrollDirection: ScrollDirection;
  scrollPosition: number;
  className: string;
  isThresholdExceeded: boolean;
}

export function useScrollEffect({
  threshold = 100,
  scrollUpClassName = "",
  scrollDownClassName = "",
  initialClassName = "",
}: ScrollEffectOptions = {}): ScrollEffectReturn {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("none");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);
  const [className, setClassName] = useState(initialClassName);
  const [isThresholdExceeded, setIsThresholdExceeded] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    setIsThresholdExceeded(currentScrollPos > threshold);

    if (currentScrollPos > prevScrollPosition) {
      setScrollDirection("down");
      scrollDownClassName && setClassName(scrollDownClassName);
    } else if (currentScrollPos < prevScrollPosition) {
      setScrollDirection("up");
      scrollUpClassName && setClassName(scrollUpClassName);
    }

    setPrevScrollPosition(currentScrollPos);
    setScrollPosition(currentScrollPos);
  }, [prevScrollPosition, threshold, scrollUpClassName, scrollDownClassName]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return {
    scrollDirection,
    scrollPosition,
    className,
    isThresholdExceeded,
  };
}
