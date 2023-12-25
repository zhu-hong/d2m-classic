import 'react-simple-keyboard/build/css/index.css'
import Keyboard from 'react-simple-keyboard'
import { useEffect } from 'react'
import { useState } from 'react'
import { IconButton } from '@mui/material'
import { useRef } from 'react'
import { useDeyboardStore } from '@/store.jsx'
import chinese from 'simple-keyboard-layouts/build/layouts/chinese.js'

export const DeyBoard = ({ onChanges, value, onClose, open }) => {
  const [kref, setKref] = useState(null)
  const { layoutName, setLayoutName, setPosition, position } = useDeyboardStore()

  const onKeyPress = (button) => {
    if (button !== "{shift}" && button !== "{lock}") return

    setLayoutName(layoutName === 'default' ? 'shift' : 'default')
  }

  const onKChange = (e) => {
    if(layoutName === 'number' && e.substr(e.length-1) === '.' && value.toString().includes('.')) {
      kref.setInput(value)
      return
    }
    onChanges.forEach((func) => {
      if(typeof func === 'function') {
        func(e)
      }
    })
  }

  useEffect(() => {
    if(kref !== null) {
      kref.setInput(value)
    }
  }, [value])

  useEffect(() => {
    if(!open) {
      setLayoutName('default')
      setPosition('top')
      return
    }

    const el = document.activeElement
    let { x, y } = el.getBoundingClientRect()

    if(position === 'top') {
      setAxis({
        x: window.innerWidth - x - deyboardRef.current.clientWidth + (deyboardRef.current.clientWidth - el.clientWidth) / 2,
        y: window.innerHeight - y + 20,
      })
    } else if(position === 'bottom') {
      setAxis({
        x: window.innerWidth - x - deyboardRef.current.clientWidth + (deyboardRef.current.clientWidth - el.clientWidth) / 2,
        y: window.innerHeight - y - el.clientHeight - deyboardRef.current.clientHeight - 20,
      })
    }
  }, [open])

  const [startDrag, setStartDrag] = useState(false)
  const [axis, setAxis] = useState({x:0,y:0})
  const [axisBase, setAxisBase] = useState({x:0,y:0})
  const deyboardRef = useRef()

  useEffect(() => {
    const onMove = (e) => {
      if(startDrag == false) return

      const distanceX = e.changedTouches[0].clientX - axisBase.x
      const distanceY = e.changedTouches[0].clientY - axisBase.y

      let x = axis.x - distanceX
      let y = axis.y - distanceY
      if(x < 0) {
        x = 0
      }
      if(x > innerWidth - deyboardRef.current.clientWidth) {
        x = innerWidth - deyboardRef.current.clientWidth
      }
      if(y < 0) {
        y = 0
      }
      if(y > innerHeight - deyboardRef.current.clientHeight) {
        y = innerHeight - deyboardRef.current.clientHeight
      }

      setAxis({
        x,
        y,
      })
    }
    const onUp = () => {
      if(!startDrag) return
      setStartDrag(false)
    }

    document.addEventListener('touchmove', onMove)
    document.addEventListener('touchend', onUp)
    document.addEventListener('touchcancel', onUp)

    return () => {
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onUp)
      document.removeEventListener('touchcancel', onUp)
    }
  }, [startDrag])

  const onPointerDown = (e) => {
    setStartDrag(true)
    setAxisBase({
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    })
    setAxis({
      x: parseInt(deyboardRef.current.style.right),
      y: parseInt(deyboardRef.current.style.bottom),
    })
  }

  return <div ref={deyboardRef} className='fixed z-99999 text-black text-xl opacity-90 bg-[#ececec] rounded deyboard' style={{ display: open?'block':'none', bottom: axis.y, right: axis.x, width: layoutName === 'number' ? 300 : 520 }}>
    <div className='flex justify-end items-center' onTouchStart={onPointerDown}>
      <IconButton><svg className='cursor-move' xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#000000" d="M12 23.414L7.586 19L9 17.586l2 2V13H4.414l2 2L5 16.414L.586 12L5 7.586L6.414 9l-2 2H11V4.414l-2 2L7.586 5L12 .586L16.414 5L15 6.414l-2-2V11h6.586l-2-2L19 7.586L23.414 12L19 16.414L17.586 15l2-2H13v6.586l2-2L16.414 19z"></path></svg></IconButton>
      <IconButton onClick={onClose}><svg className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#F04848" d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6L8.4 17Zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"></path></svg></IconButton>
    </div>
    <Keyboard
      keyboardRef={(ref) => {
        ref.setInput(value)
        setKref(ref)
      }}
      layoutName={layoutName}
      layoutCandidates={layoutName === 'default' ? chinese.layoutCandidates : null}
      layout={{
        default: [
          '` 1 2 3 4 5 6 7 8 9 0 - {backspace}',
          'q w e r t y u i o p',
          'a s d f g h j k l ; \'',
          '{shift} z x c v b n m , . /'
        ],
        shift: [
          '~ ! @ # $ % ^ & * ( ) _ + {backspace}',
          'Q W E R T Y U I O P { } |',
          'A D F G H J K L : "',
          '{lock} Z X C V B N M < > ?',
        ],
        number: [
          '1 2 3',
          '4 5 6',
          '7 8 9',
          '0 {backspace}',
        ],
      }}
      display={{
        "{shift}": "⇧",
        "{lock}": "⇪",
        '{backspace}': '',
      }}
      onKeyPress={onKeyPress}
      onChange={onKChange}
    />
  </div>
}
