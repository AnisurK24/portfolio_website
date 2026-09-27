"use client";

import { useEffect, useState } from "react";
import { GazeVideo } from "@/app/components/GazeVideo";
import { Portrait } from "@/app/components/Portrait";

type Mode = "3d" | "photo";

const STORAGE_KEY = "hero-portrait";

// Where the photo cutout sits inside the 640x720 video frame so the two
// faces match: 406x768 px at (123, 99).
const PHOTO_BOX = { left: "19.16%", top: "13.78%", width: "63.47%" } as const;

const GAZE_SEGMENTS = {
  left: [0, 19],
  right: [20, 34],
  up: [35, 53],
  down: [54, 87],
} satisfies Record<string, [number, number]>;

/**
 * HeroPortrait: the hero's portrait, with a switch between the 3D render
 * whose head follows the cursor and the original photo cutout (with its
 * pointer parallax, entrance, and scroll drift). The choice is remembered
 * per browser, and <html data-portrait> lets CSS adjust copy that only
 * makes sense for one mode.
 */
export function HeroPortrait() {
  const [mode, setMode] = useState<Mode>("3d");

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "photo") setMode("photo");
    } catch {
      // Storage can be blocked; the default is fine.
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.portrait = mode;
  }, [mode]);

  const toggle = () => {
    const next: Mode = mode === "3d" ? "photo" : "3d";
    setMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore; the switch still works for this visit.
    }
  };

  const on = mode === "3d";

  return (
    <div className="hero-drift pointer-events-none relative -mt-6 mx-auto aspect-[640/720] w-[min(92%,26rem)] lg:absolute lg:bottom-0 lg:right-[max(1rem,calc((100vw-1400px)/2+1rem))] lg:mt-0 lg:h-[min(94%,1000px)] lg:w-auto">
      {/* Sits in the empty space beside the head in both modes, clear of the
          hero copy (which is stacked above the portrait). */}
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="3D portrait that follows the cursor"
        onClick={toggle}
        className="portrait-switch pointer-events-auto absolute right-[4%] top-[6%] z-10 lg:right-[8%] lg:top-[14%]"
      >
        <span className="portrait-switch-track" aria-hidden>
          <span className="portrait-switch-thumb" />
        </span>
        <span className="portrait-switch-label">3D</span>
      </button>

      {on ? (
        // The head turns toward the cursor in any direction. Its background
        // matches the hero and the edges are feathered, so it reads as one
        // scene. Frame ranges come from the source render.
        <div className="portrait-in h-full w-full">
          <GazeVideo
            src="/hero-gaze.mp4"
            poster="/hero-gaze-poster.webp"
            fps={24}
            segments={GAZE_SEGMENTS}
            headAnchor={{ x: 0.44, y: 0.24 }}
            mediaClassName="scrub-feather"
            label="Anisur Khan in a black jacket and tan quarter-zip, smiling"
          />
        </div>
      ) : (
        // The original photo, placed so its face lands exactly where the
        // video's face is (face boxes measured in both: the cutout is scaled
        // by 0.48 and offset to match). It runs past the bottom edge, so it
        // is clipped there, where the video's figure also ends; the sides
        // stay open for the parallax.
        <div className="absolute inset-0 [clip-path:inset(-50%_-50%_0_-50%)]">
          <div className="absolute aspect-[846/1600]" style={PHOTO_BOX}>
            <Portrait />
          </div>
        </div>
      )}
    </div>
  );
}
