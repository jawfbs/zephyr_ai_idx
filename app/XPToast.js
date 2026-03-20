'use client'
import { useEffect, useState } from 'react'

export default function XPToast({ toasts }) {
  return (
    <div style={{ position:'fixed', bottom:'24px', right:'24px', display:'flex', flexDirection:'column-reverse', gap:'8px', zIndex:99999, pointerEvents:'none' }}>
      {toasts.map(toast => <XPToastItem key={toast.id} toast={toast} />)}
    </div>
  )
}

function XPToastItem({ toast }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const f = requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => setVisible(false), 2800)
    return () => { cancelAnimationFrame(f); clearTimeout(t) }
  }, [])
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 16px', borderRadius:'12px', background:'rgba(15,15,25,0.95)', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 8px 32px rgba(0,0,0,0.4)', backdropFilter:'blur(10px)', transform:visible?'translateX(0)':'translateX(120px)', opacity:visible?1:0, transition:'transform 0.35s cubic-bezier(.34,1.56,.64,1),opacity 0.35s ease', pointerEvents:'none', minWidth:'220px' }}>
      <span style={{ fontSize:'20px' }}>{toast.icon}</span>
      <div style={{ flex:1 }}>
        <p style={{ fontSize:'12px', color:'#e2e8f0', fontWeight:600, margin:0 }}>{toast.label}</p>
        {toast.sub && <p style={{ fontSize:'11px', color:'#94a3b8', margin:'1px 0 0' }}>{toast.sub}</p>}
      </div>
      <div style={{ padding:'3px 10px', borderRadius:'20px', background:'linear-gradient(135deg,#06b6d4,#8b5cf6)', color:'#fff', fontSize:'12px', fontWeight:800, flexShrink:0 }}>+{toast.xp} XP</div>
    </div>
  )
}
