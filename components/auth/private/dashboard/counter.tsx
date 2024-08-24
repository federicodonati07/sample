import React from 'react';
import { useSpring, animated } from 'react-spring';

const Counter = ({ n }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 15 },
  });

  return (
    <>
      <div className="flex flex-row">
        <span className="text-4xl font-black">+</span>
        <animated.div className="text-4xl font-black">{number.to(n => n.toFixed(0))}</animated.div>
      </div>
    </>
  );
};

export default Counter;
