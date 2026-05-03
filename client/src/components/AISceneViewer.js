import { useEffect, useState } from "react";

const SCENE_COLORS = [
  "sunrise",
  "ember",
  "forest",
  "midnight",
  "copper",
  "olive",
];

function AISceneViewer({ scenes, loading }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setIsPlaying(scenes.length > 0);
  }, [scenes]);

  useEffect(() => {
    if (!isPlaying || scenes.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % scenes.length);
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, [isPlaying, scenes.length]);

  const activeScene = scenes[activeIndex] || "";

  const goToScene = (index) => {
    setActiveIndex(index);
    setIsPlaying(false);
  };

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? scenes.length - 1 : current - 1
    );
    setIsPlaying(false);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % scenes.length);
    setIsPlaying(false);
  };

  return (
    <section className="panel ai-panel cinematic-panel">
      <div className="ai-panel-header">
        <div>
          <p className="eyebrow">AI demo reel</p>
          <h2>Recipe walkthrough as a moving visual concept</h2>
          <p className="panel-subtitle">
            CookSphere turns the recipe into a directed sequence of scenes,
            giving the user a cinematic preview of the preparation flow.
          </p>
        </div>
        {scenes.length > 0 ? (
          <div className="demo-summary">
            <strong>{scenes.length}</strong>
            <span>generated scenes</span>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="centered-state storyboard-loading cinematic-loading">
          <div className="pulse-orb" />
          <h3>Generating AI demo reel...</h3>
          <p>
            Building kitchen shots, motion cues, and plating moments from your
            recipe instructions.
          </p>
        </div>
      ) : scenes.length === 0 ? (
        <div className="empty-state ai-empty-state">
          <h3>No demo yet</h3>
          <p>
            Click <strong>AI Visualize</strong> to create a shot-by-shot cooking
            demo. This version simulates a short AI recipe film using animated
            scenes, captions, and timed playback.
          </p>
        </div>
      ) : (
        <div className="cinema-layout">
          <div className={`cinema-stage theme-${SCENE_COLORS[activeIndex % SCENE_COLORS.length]}`}>
            <div className="stage-noise" />
            <div className="stage-copy">
              <span className="stage-chip">Scene {activeIndex + 1}</span>
              <h3>AI Kitchen Direction</h3>
              <p>{activeScene}</p>
            </div>
            <div className="stage-timeline">
              {scenes.map((scene, index) => (
                <button
                  key={`${scene}-${index}`}
                  className={
                    index === activeIndex
                      ? "timeline-segment active"
                      : "timeline-segment"
                  }
                  onClick={() => goToScene(index)}
                  aria-label={`Go to scene ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="cinema-sidebar">
            <div className="player-controls">
              <button className="secondary-button" onClick={goToPrevious}>
                Previous
              </button>
              <button
                className="primary-button"
                onClick={() => setIsPlaying((current) => !current)}
              >
                {isPlaying ? "Pause Demo" : "Play Demo"}
              </button>
              <button className="secondary-button" onClick={goToNext}>
                Next
              </button>
            </div>

            <div className="scene-list">
              {scenes.map((scene, index) => (
                <button
                  key={`${scene}-card-${index}`}
                  className={
                    index === activeIndex ? "scene-card active" : "scene-card"
                  }
                  onClick={() => goToScene(index)}
                >
                  <span className="scene-card-index">0{index + 1}</span>
                  <div>
                    <strong>Shot {index + 1}</strong>
                    <p>{scene}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AISceneViewer;
