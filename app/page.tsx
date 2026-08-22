'use client'

import { useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Minus, MoreHorizontal, Play, Plus, RotateCcw, X } from 'lucide-react'

type Panel = 'tempo' | 'key' | null

const keys = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']

export default function Page() {
  const [panel, setPanel] = useState<Panel>(null)
  const [tempo, setTempo] = useState(116)
  const [key, setKey] = useState('C♯')
  const [playing, setPlaying] = useState(false)

  const changeTempo = (amount: number) => setTempo((value) => Math.min(200, Math.max(40, value + amount)))
  const reset = () => {
    if (panel === 'tempo') setTempo(116)
    if (panel === 'key') setKey('C♯')
  }

  return (
    <main className="player-shell">
      <header className="player-header">
        <button className="round-button" aria-label="Close"><X /></button>
        <h1>Untitled</h1>
        <button className="round-button" aria-label="More options"><MoreHorizontal /></button>
      </header>

      <section className="artwork" aria-label="Music artwork" />

      <section className="transport" aria-label="Playback controls">
        <div className="timeline"><span>0:47</span><div className="progress"><i /><b /></div><span>2:53</span></div>
        <div className="transport-row">
          <button className="skip-button" aria-label="Previous"><ChevronLeft /><ChevronLeft /></button>
          <button className="play-button" aria-label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying(!playing)}>
            {playing ? <span className="pause-bars" /> : <Play fill="currentColor" />}
          </button>
          <button className="skip-button" aria-label="Next"><ChevronRight /><ChevronRight /></button>
        </div>
        <div className="quick-values">
          <button onClick={() => setPanel('tempo')}><strong>{tempo}</strong><span>BPM</span></button>
          <button onClick={() => setPanel('key')}><strong>{key}</strong><span>KEY</span></button>
        </div>
      </section>

      {panel && <div className="sheet-backdrop" onClick={() => setPanel(null)} />}
      <section className={`control-sheet ${panel ? 'is-open' : ''}`} aria-label={`${panel ?? 'music'} controls`}>
        <button className="sheet-handle" aria-label="Close panel" onClick={() => setPanel(null)}><ChevronDown /></button>
        <div className="sheet-heading"><span>{panel === 'key' ? 'KEY' : 'TEMPO'}</span><button onClick={reset}><RotateCcw /> Reset</button></div>
        {panel === 'tempo' ? (
          <>
            <div className="metric-value">{tempo}</div><div className="metric-label">BPM</div>
            <div className="ruler" aria-hidden="true"><div className="ruler-active" style={{ left: `${((tempo - 40) / 160) * 100}%` }} />{Array.from({ length: 17 }).map((_, index) => <i key={index} className={index % 5 === 0 ? 'major' : ''} />)}</div>
            <div className="adjust-row"><button onClick={() => changeTempo(-1)} aria-label="Decrease tempo"><Minus /></button><button onClick={() => changeTempo(1)} aria-label="Increase tempo"><Plus /></button></div>
          </>
        ) : (
          <>
            <div className="metric-value key-value">{key}</div><div className="metric-label">KEY</div>
            <div className="piano" aria-label="Select key">{keys.map((item) => <button key={item} className={`${item === key ? 'selected' : ''} ${item.includes('♯') || item.includes('♭') ? 'black-key' : ''}`} onClick={() => setKey(item)} aria-label={`Key ${item}`}>{item}</button>)}</div>
            <div className="key-adjust"><button onClick={() => setKey(keys[(keys.indexOf(key) + keys.length - 1) % keys.length])} aria-label="Lower key">♭</button><button onClick={() => setKey(keys[(keys.indexOf(key) + 1) % keys.length])} aria-label="Raise key">♯</button></div>
          </>
        )}
      </section>
    </main>
  )
}
