import React, { type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      tabIndex={pauseOnHover ? 0 : props.tabIndex}
      className={cn(
        "group flex gap-[var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem] motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:overflow-visible",
        vertical ? "flex-col" : "flex-row",
        pauseOnHover && "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
        className
      )}
    >
      {Array.from({ length: repeat }, (_, index) => (
        <div
          key={index}
          aria-hidden={index > 0 ? true : undefined}
          className={cn(
            "flex shrink-0 justify-around gap-[var(--gap)] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
            index > 0 && "motion-reduce:hidden",
            reverse && "[animation-direction:reverse]"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

