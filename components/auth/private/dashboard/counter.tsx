import React from 'react'
import {useSpring, animated} from "react-spring"

const Counter = ({toN}) => {
    const {number} = useSpring({
        from: {number: 0},
        number: toN,
        delay: 200,
        config: {mass:1, tension:20, friction:10}
    })

    return (
    <>
        <animated.div>{number.to((toN)=>toN.toFixed(0))}</animated.div>
    </>
  )
}

export default Counter