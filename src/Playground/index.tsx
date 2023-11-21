import React, { MouseEventHandler, useEffect, useRef } from "react";
import { Bodies, Engine, Render, World } from "matter-js";
import styled from "styled-components";

const engineCreate = Engine.create();

export const Playground = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(engineCreate);

  useEffect(() => {
    const cw = document.body.clientWidth;
    const ch = document.body.clientHeight;

    const render = Render.create({
      element: sceneRef.current!,
      engine: engineRef.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent",
      },
    });

    // boundaries
    World.add(engineRef.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
    ]);

    // run the engine
    Engine.run(engineRef.current);
    Render.run(render);

    // unmount
    return () => {
      // destroy Matter
      Render.stop(render);
      World.clear(engineRef.current.world, true);
      Engine.clear(engineRef.current!);
      render.canvas.remove();
      // render.canvas = null;
      // render.context = null;
      render.textures = {};
    };
  }, []);

  const isPressed = useRef(false);

  const handleDown = () => {
    isPressed.current = true;
  };

  const handleUp = () => {
    isPressed.current = false;
  };

  const handleAddCircle: MouseEventHandler<HTMLDivElement> = (e) => {
    if (isPressed.current) {
      const ball = Bodies.circle(
        e.clientX,
        e.clientY,
        10 + Math.random() * 30,
        {
          mass: 10,
          restitution: 0.9,
          friction: 0.005,
          render: {
            fillStyle: "#0000ff",
          },
        }
      );
      World.add(engineRef.current.world, [ball]);
    }
  };
  return (
    <Rapper
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onMouseMove={handleAddCircle}
    >
      <Ground ref={sceneRef}></Ground>
    </Rapper>
  );
};

const Rapper = styled.div``;

const Ground = styled.div`
  width: 100vw;
  height: 100vh;
  margin-inline: auto;
  background-color: white;
`;
