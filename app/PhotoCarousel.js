'use client'
import { useState, useCallback } from 'react'

export default function PhotoCarousel({ photos=[], height=190, width='100%', showLabel=true, borderRadius='0px', onPhotoChange }) {
  const [idx, setIdx] = useState(0)

  const prev = useCallback((e) => {
    e.stopPropagation()
    setIdx(i => { const n = i===0?photos.length-1:i-1; onPhotoChange?.(n); return n })
  }, [photos.length, onPhotoChange])

  const next = useCallback((e) => {
    e.stopPropagation()
    setIdx(i => { const n = i===photos.length-1?0:i+1; onPhotoChange?.(n); return n })
  }, [photos.length, onPhotoChange])

  const goTo = useCallback((e, n) => {
    e.stopPropagation(); setIdx(n); onPhotoChange?.(n)
  }, [onPhotoChange])

  if (!photos||photos.length===0) return <div style={{ width, height, background:'#1e1e2e', borderRadius }} />

  const current = photos[idx]

  return (
    <div style={{ position:'relative', width, height, overflow:'hidden', background:'#0a0a0f', borderRadius, flexShrink:0 }}>
      <img key={current.url} src={current.url} alt={current.label||'Photo'} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', animation:'carouselFade 0.3s ease' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 55%)', pointerEvents:'none' }} />

      {photos.length>1 && (
        <button onClick={prev} style={{ position:'absolute', left:'8px', top:'50%', transform:'translateY(-50%)', width:'28px', height:'28px', borderRadius:'50%', background:'rgba(0,0,0,0.55)', border:'1px solid rgba(255,255,255,0.25)', color:'#fff', cursor:'pointer', fontSize:'14px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(6px)', transition:'background 0.2s,transform 0.2s', zIndex:10 }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,0,0,0.82)';e.currentTarget.style.transform='translateY(-50%) scale(1.1)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,0,0,0.55)';e.currentTarget.style.transform='translateY(-50%) scale(1)'}}>‹</button>
      )}

      {photos.length>1 && (
        <button onClick={next} style={{ position:'absolute', right:'8px', top:'50%', transform:'translateY(-50%)', width:'28px', height:'28px', borderRadius:'50%', background:'rgba(0,0,0,0.55)', border:'1px solid rgba(255,255,255,0.25)', color:'#fff', cursor:'pointer', fontSize:'14px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(6px)', transition:'background 0.2s,transform 0.2s', zIndex:10 }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,0,0,0.82)';e.currentTarget.style.transform='translateY(-50%) scale(1.1)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,0,0,0.55)';e.currentTarget.style.transform='translateY(-50%) scale(1)'}}>›</button>
      )}

      {showLabel&&current.label&&(
        <div style={{ position:'absolute', bottom:'28px', left:'50%', transform:'translateX(-50%)', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'20px', padding:'3px 10px', fontSize:'10px', fontWeight:700, color:'#fff', whiteSpace:'nowrap', zIndex:10 }}>{current.label}</div>
      )}

      {photos.length>1&&(
        <div style={{ position:'absolute', bottom:'8px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'4px', zIndex:10 }}>
          {photos.map((_,i)=>(
            <button key={i} onClick={e=>goTo(e,i)} style={{ width:i===idx?'16px':'5px', height:'5px', borderRadius:'3px', background:i===idx?'#fff':'rgba(255,255,255,0.45)', border:'none', cursor:'pointer', padding:0, transition:'all 0.25s' }} />
          ))}
        </div>
      )}

      <style>{`@keyframes carouselFade{from{opacity:0.4;transform:scale(1.02)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}
