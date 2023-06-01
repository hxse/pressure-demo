import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const divRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasNegativeRef = useRef(null);

  const [isDown, setIsDown] = useState(false)
  const [pressure, setPressure] = useState(0)
  const [type, setType] = useState(0)
  const [id, setId] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [twist, setTwist] = useState(0)
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [isPrimary, setIsPrimary] = useState(0)
  const [alpha, setAlpha] = useState(0.7)

  const [lastTime, setLastTime] = useState(0)
  const [spaceTime, setSpaceTime] = useState(20)//ms
  const [pointArray, setPointArray] = useState([])

  useEffect(() => {
    //为了禁止touch的默认拖动行为,所以要传passive
    //为什么手动注册, 因为passive只能手动传进去,react默认是没有的
    //其实不用传passive,用 touch-action: none; 也能禁止, 但不灵活
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event
    console.log('listen event')
    divRef.current.addEventListener('pointerdown', onPressure, { passive: false });
    divRef.current.addEventListener('pointermove', onPressure, { passive: false });
    divRef.current.addEventListener('pointerup', onPressure, { passive: false });

    divRef.current.addEventListener('mousemove', onMouse, { passive: false });

    divRef.current.addEventListener('touchstart', onPrevent, { passive: false });
    divRef.current.addEventListener('touchmove', onPrevent, { passive: false });
    return () => {
      console.log('remove event')
      divRef.current.removeEventListener('pointerdown', onPressure, { passive: false });
      divRef.current.removeEventListener('pointermove', onPressure, { passive: false });
      divRef.current.removeEventListener('pointerup', onPressure, { passive: false });

      divRef.current.removeEventListener('mousemove', onMouse, { passive: false });

      divRef.current.removeEventListener('touchstart', onPrevent, { passive: false });
      divRef.current.removeEventListener('touchmove', onPrevent, { passive: false });
    }
  }, [])
  function onMouse(event: any) {
    // setOffsetX(event.offsetX)
    // setOffsetY(event.offsetY)
  }
  function onPrevent(event: any) {
    event.preventDefault()
    return false
  }
  function onPressure(event: any) {
    // event.preventDefault()
    setPressure(event.pressure)
    setType(event.pointerType)
    setId(event.pointerId)
    setWidth(event.width)
    setHeight(event.height)
    setTwist(event.twist)
    setTiltX(event.tiltX)
    setTiltY(event.tiltY)
    setIsPrimary(event.isPrimary)

    setOffsetX(event.offsetX)
    setOffsetY(event.offsetY)

    if (event.type == 'pointermove' && event.pressure > 0.1) {
      setIsDown(true)
    } else {
      setIsDown(false)
    }
  }

  useLayoutEffect(() => {
    // const ctxNegative = canvasNegativeRef.current.getContext('2d');
    const ctx = canvasRef.current.getContext('2d');//如果先获取了2d,那么webgl就是null
    // ctx.globalCompositeOperation = 'source-over';//'darker'; //'lighter';

    ctx.canvas.width = divRef.current.offsetWidth - 4
    ctx.canvas.height = divRef.current.offsetHeight - 24

  }, [])


  function drawPoint(canvasRef, pointArray) {
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    for (let p of pointArray) {
      const nowtime = p[0]
      const offsetX = p[1]
      const offsetY = p[2]
      ctx.arc(offsetX, offsetY, 15, 0, Math.PI * 2);
      // ctx.stroke();
      ctx.fillStyle = `rgba(192, 80, 77, ${pressure * alpha})`;
      ctx.fill();
    }
    ctx.closePath()
  }
  function drawLine(canvasRef, pointArray) {
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    for (const [i, p] of pointArray.entries()) {
      const nowtime = p[0]
      const offsetX = p[1]
      const offsetY = p[2]
      ctx.moveTo(offsetX - 10, offsetY - 10);//线条开始位置
      ctx.lineTo(offsetX + 10, offsetY + 10);//线条经过点

      // if (i == 0) {
      //   ctx.moveTo(offsetX, offsetY);//线条开始位置
      // } else {
      //   ctx.lineTo(offsetX, offsetY);//线条经过点
      // }
    }
    ctx.lineWidth = 30 / pressure;
    ctx.strokeStyle = `rgba(192, 80, 77, ${pressure * alpha})`;
    ctx.stroke();
    ctx.closePath();//结束绘制线条，不是必须的
  }
  function drawPointWebgl(canvasRef, pointArray) {
  }

  useLayoutEffect(() => {
    //性能有问题, 所以要写个去抖,多少时间后集中画一次
    // const ctxNegative = canvasNegativeRef.current.getContext('2d');
    const nowTime = Date.now()
    if (isDown) {
      if (nowTime - lastTime > spaceTime) {
        setLastTime(nowTime)
        setPointArray([])
        pointArray.sort((a, b) => a[0] - b[0])
        drawPoint(canvasRef, pointArray)
        // drawLine(canvasRef, pointArray)
        // drawPointWebgl(canvasRef, pointArray)
      } else {
        setPointArray((i) => [...i, [nowTime, offsetX, offsetY]])
      }
    } else {
      setPointArray([])
    }
  }, [offsetX, offsetY])
  return (
    <div>
      <div className="my-bar">
        isDown:{isDown ? 1 : 0}  pressure:{pressure} type:{type} id:{id} offsetX:{offsetX} offsetY:{offsetY} width:{width} height:{height}  twist:{twist} tiltX:{tiltX} tiltY:{tiltY} isPrimary :{isPrimary}
      </div>
      <div className="my-div"
        ref={divRef}
        draggable="false"
      >
        {/* <canvas className="my-div-canvas" ref={canvasNegativeRef}></canvas> */}
        <canvas className="my-div-canvas" ref={canvasRef}></canvas>
      </div>

    </div>
  )
}

export default App



