import { useId } from "react"

type Props = { type: string; color: string; isDark: boolean }

export default function ModuleVisual({ type, color, isDark }: Props) {
  const id = useId().replace(/:/g, "")
  const accent = color === "teal" ? (isDark ? "#42D7C5" : "#087F78") : (isDark ? "#8CB7F5" : "#3267A8")
  const bright = isDark ? "#E5F2F7" : "#142B40"
  const muted = isDark ? "#91A9BD" : "#526B80"
  const line = isDark ? "#385169" : "#B7C9D5"
  const surface = isDark ? "#101F33" : "#EFF6F8"
  const raised = isDark ? "#172C40" : "#FFFFFF"
  const soft = isDark ? "#203A4D" : "#DBEBEE"
  const font = "ui-monospace, SFMono-Regular, Menlo, monospace"
  const label = (x: number, y: number, value: string, fill = muted, size = 10, anchor: "start" | "middle" | "end" = "start") => (
    <text x={x} y={y} fill={fill} fontSize={size} fontFamily={font} fontWeight="600" letterSpacing=".5" textAnchor={anchor}>{value}</text>
  )
  const dot = (x: number, y: number, r = 4) => <circle cx={x} cy={y} r={r} fill={accent} stroke={raised} strokeWidth="2" />
  const card = (x: number, y: number, w: number, h: number, radius = 9) => (
    <rect x={x} y={y} width={w} height={h} rx={radius} fill={raised} stroke={line} strokeWidth="1" />
  )

  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-wash`} x1="0" x2="0" y1="0" y2="1">
          <stop stopColor={accent} stopOpacity=".32" />
          <stop offset="1" stopColor={accent} stopOpacity=".02" />
        </linearGradient>
        <linearGradient id={`${id}-bar`} x1="0" x2="0" y1="0" y2="1">
          <stop stopColor={accent} stopOpacity=".98" />
          <stop offset="1" stopColor={accent} stopOpacity=".3" />
        </linearGradient>
      </defs>

      {type === "bars" && <>
        {label(20, 24, "ACQUISITION / CHANNEL MIX", accent)}
        <path d="M20 164H380 M20 124H380 M20 84H380 M20 44H380" stroke={line} strokeWidth=".8" strokeDasharray="3 6" opacity=".7" />
        {[{ x: 34, h: 42, t: "META" }, { x: 146, h: 72, t: "GOOGLE" }, { x: 258, h: 56, t: "TIKTOK" }].map((item, i) => <g key={item.t}>
          <rect x={item.x} y={164 - item.h} width="19" height={item.h} rx="4" fill={soft} />
          <rect x={item.x + 25} y={164 - item.h - 17 - i * 7} width="19" height={item.h + 17 + i * 7} rx="4" fill={`url(#${id}-bar)`} />
          <rect x={item.x + 50} y={164 - item.h + 12} width="19" height={item.h - 12} rx="4" fill={soft} />
          {label(item.x + 10, 184, item.t, muted, 10)}
        </g>)}
        <path d="M44 113 C85 119 95 99 155 89 S229 80 267 73 S330 61 365 43" fill="none" stroke={bright} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M358 43h8v8" fill="none" stroke={bright} strokeWidth="2" />
        {dot(365, 43, 4)}
      </>}

      {type === "funnel" && <>
        {label(20, 24, "JOURNEY / 04 STAGES", accent)}
        <path d="M77 94H119 M171 94H213 M265 94H307" stroke={accent} strokeWidth="2" strokeLinecap="round" />
        <path d="m112 89 7 5-7 5 m94-10 7 5-7 5 m94-10 7 5-7 5" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {[{x:18,t:"VISIT",n:"01",y:69},{x:112,t:"ENGAGE",n:"02",y:51},{x:206,t:"QUALIFY",n:"03",y:69},{x:300,t:"CONVERT",n:"04",y:51}].map((s,i) => <g key={s.t}>
          {card(s.x,s.y,76,88)}
          <rect x={s.x+8} y={s.y+9} width="60" height="4" rx="2" fill={line} />
          <rect x={s.x+8} y={s.y+21} width={i===3?40:49} height="3" rx="1.5" fill={soft} />
          {i===3 ? <><circle cx={s.x+38} cy={s.y+52} r="13" fill={accent} /><path d={`m${s.x+31} ${s.y+52} 5 5 9-11`} fill="none" stroke={raised} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></> : <rect x={s.x+9} y={s.y+41} width="58" height="26" rx="4" fill={`url(#${id}-wash)`} />}
          {label(s.x+9,s.y+81,s.t,i===3?accent:muted,9)}
          <rect x={s.x+52} y={s.y-8} width="23" height="18" rx="4" fill={accent} />
          {label(s.x+57,s.y+5,s.n,raised,9)}
        </g>)}
        {label(20, 183, "CLICK", muted, 9)}{label(330, 183, "SQL", accent, 9)}
      </>}

      {type === "nodes" && <>
        {label(20, 24, "TRIGGER → ROUTE → RESPOND", accent)}
        <path d="M112 106H144 M238 106C262 106 256 64 280 64 M238 106C262 106 256 148 280 148" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity=".6" />
        <path d="m138 101 6 5-6 5 m130-52 6 5-6 5 m-6 79 6 5-6 5" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {label(244, 76, "YES", muted, 9)}{label(246, 144, "NO", muted, 9)}
        {card(20, 70, 92, 72)}{card(146, 70, 92, 72)}
        <circle cx="66" cy="94" r="14" fill={`url(#${id}-wash)`} stroke={accent} strokeWidth="1.5" />
        <path d="M68 85 60 96h6l-2 8 8-11h-6z" fill={accent} />
        {label(66, 129, "EVENT", bright, 10, "middle")}
        <path d="m192 81 13 13-13 13-13-13z" fill={`url(#${id}-wash)`} stroke={accent} strokeWidth="1.5" />
        {label(192, 129, "IF / THEN", bright, 10, "middle")}
        {card(282, 46, 98, 36, 7)}{card(282, 130, 98, 36, 7)}
        <rect x="292" y="58" width="16" height="12" rx="2" fill={surface} stroke={accent} strokeWidth="1.5" />
        <path d="m293 59 7 5 7-5" fill="none" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
        {label(316, 68, "SEND", bright, 10)}
        {dot(300, 148, 4)}
        {label(314, 152, "NURTURE", bright, 10)}
        {label(20, 188, "AUTOMATED WORKFLOW", muted, 9)}
      </>}

      {type === "grid" && <>
        {label(20, 24, "CRM / PIPELINE", accent)}
        {card(20, 36, 360, 140, 8)}
        <path d="M21 62H379 M21 90H379 M21 118H379 M21 146H379" stroke={line} strokeWidth="1" />
        {label(34, 53, "CONTACT", muted, 9)}{label(160, 53, "SOURCE", muted, 9)}{label(246, 53, "STAGE", muted, 9)}{label(366, 53, "VALUE", muted, 9, "end")}
        {[
          { y: 62, i: "SK", n: "Sara Khan", s: "META", st: "WON", v: "$12.4k", o: 1 },
          { y: 90, i: "OH", n: "Omar Hadi", s: "GOOGLE", st: "PROPOSAL", v: "$8.9k", o: .7 },
          { y: 118, i: "LM", n: "Lena Moss", s: "ORGANIC", st: "QUALIFIED", v: "$5.2k", o: .45 },
          { y: 146, i: "JP", n: "Jae Park", s: "REFERRAL", st: "NEW", v: "$3.1k", o: .25 },
        ].map(r => <g key={r.i}>
          <circle cx="42" cy={r.y + 14} r="9" fill={soft} />
          <text x="42" y={r.y + 17} textAnchor="middle" fill={bright} fontSize="7.5" fontFamily={font} fontWeight="700">{r.i}</text>
          {label(58, r.y + 18, r.n, bright, 10.5)}
          {label(160, r.y + 18, r.s, muted, 9.5)}
          <circle cx="250" cy={r.y + 14} r="3.5" fill={accent} opacity={r.o} />
          {label(259, r.y + 18, r.st, r.o === 1 ? accent : bright, 9.5)}
          {label(366, r.y + 18, r.v, bright, 10.5, "end")}
        </g>)}
        {label(20, 192, "SINGLE SOURCE OF TRUTH", muted, 9)}
      </>}

      {type === "rings" && <>
        {label(20,24,"LEAD PRIORITISATION",accent)}
        {[{y:43,n:"01",name:"HIGH INTENT",w:82,a:1},{y:89,n:"02",name:"ACTIVE",w:57,a:.72},{y:135,n:"03",name:"NURTURE",w:30,a:.45}].map(s=><g key={s.n}>
          {card(20,s.y,260,37,7)}
          {label(32,s.y+24,s.n,accent,12)}{label(66,s.y+24,s.name,bright,10)}
          <rect x="177" y={s.y+16} width="85" height="5" rx="2.5" fill={soft}/>
          <rect x="177" y={s.y+16} width={s.w} height="5" rx="2.5" fill={accent} opacity={s.a}/>
        </g>)}
        <circle cx="338" cy="106" r="46" fill={surface} stroke={line} strokeWidth="2" />
        <circle cx="338" cy="106" r="37" fill="none" stroke={soft} strokeWidth="7" />
        <circle cx="338" cy="106" r="37" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeDasharray="164 233" transform="rotate(-90 338 106)" />
        <text x="338" y="112" textAnchor="middle" fill={bright} fontSize="22" fontFamily={font} fontWeight="700">A</text>
        {label(20,190,"SCORE → ROUTE → ACT",muted,9)}
      </>}

      {type === "spark" && <>
        {label(20,24,"REVENUE SIGNAL",accent)}
        <path d="M25 160H376 M25 120H376 M25 80H376 M25 40H376" stroke={line} strokeWidth=".8" strokeDasharray="3 6" />
        <path d="M25 145 62 134 93 142 129 106 159 113 193 95 222 103 257 69 288 77 321 51 349 56 376 31V160H25Z" fill={`url(#${id}-wash)`} />
        <path d="M25 145 62 134 93 142 129 106 159 113 193 95 222 103 257 69 288 77 321 51 349 56 376 31" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {[{x:129,y:106},{x:257,y:69},{x:321,y:51},{x:376,y:31}].map(p=><g key={p.x}><circle cx={p.x} cy={p.y} r="6" fill={raised} stroke={accent} strokeWidth="2.5" /></g>)}
        <rect x="278" y="139" width="99" height="34" rx="6" fill={raised} stroke={line} />
        <circle cx="293" cy="156" r="4" fill={accent} />{label(305,160,"LIVE DATA",bright,9)}
        {label(26,186,"TIME →",muted,9)}
      </>}
    </svg>
  )
}
