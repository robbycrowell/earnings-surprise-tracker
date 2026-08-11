import { useState, useMemo, useCallback } from "react";

const SAMPLE_DATA = [
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2026-01-30",epsEstimate:2.35,epsActual:2.42,priceBefore:238.5,priceAfter1D:244.2,priceAfter5D:246.8 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2025-10-30",epsEstimate:1.59,epsActual:1.64,priceBefore:228.1,priceAfter1D:232.8,priceAfter5D:234.2 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2025-08-01",epsEstimate:1.34,epsActual:1.40,priceBefore:217.0,priceAfter1D:222.4,priceAfter5D:225.1 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2025-05-01",epsEstimate:1.61,epsActual:1.65,priceBefore:205.3,priceAfter1D:208.1,priceAfter5D:210.4 },
  { ticker:"AAPL",name:"Apple Inc.",sector:"Technology",date:"2025-01-30",epsEstimate:2.36,epsActual:2.40,priceBefore:222.8,priceAfter1D:225.0,priceAfter5D:227.2 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2026-01-29",epsEstimate:0.76,epsActual:0.71,priceBefore:394.5,priceAfter1D:368.2,priceAfter5D:355.0 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2025-10-23",epsEstimate:0.60,epsActual:0.72,priceBefore:218.6,priceAfter1D:240.1,priceAfter5D:252.3 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2025-07-22",epsEstimate:0.61,epsActual:0.62,priceBefore:252.8,priceAfter1D:264.9,priceAfter5D:258.4 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2025-04-22",epsEstimate:0.41,epsActual:0.27,priceBefore:237.7,priceAfter1D:224.4,priceAfter5D:218.8 },
  { ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Discretionary",date:"2025-01-29",epsEstimate:0.76,epsActual:0.73,priceBefore:398.1,priceAfter1D:376.4,priceAfter5D:362.0 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2026-02-26",epsEstimate:0.89,epsActual:0.96,priceBefore:138.2,priceAfter1D:143.7,priceAfter5D:148.1 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2025-11-20",epsEstimate:0.75,epsActual:0.81,priceBefore:142.0,priceAfter1D:144.8,priceAfter5D:138.6 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2025-08-27",epsEstimate:0.64,epsActual:0.68,priceBefore:124.6,priceAfter1D:127.8,priceAfter5D:118.9 },
  { ticker:"NVDA",name:"NVIDIA Corp.",sector:"Technology",date:"2025-05-28",epsEstimate:0.73,epsActual:0.81,priceBefore:131.3,priceAfter1D:139.2,priceAfter5D:142.8 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2026-01-28",epsEstimate:3.22,epsActual:3.40,priceBefore:442.0,priceAfter1D:454.3,priceAfter5D:458.1 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2025-10-29",epsEstimate:3.10,epsActual:3.30,priceBefore:432.5,priceAfter1D:438.2,priceAfter5D:441.6 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2025-07-22",epsEstimate:2.93,epsActual:3.03,priceBefore:438.7,priceAfter1D:425.1,priceAfter5D:418.3 },
  { ticker:"MSFT",name:"Microsoft Corp.",sector:"Technology",date:"2025-04-30",epsEstimate:3.21,epsActual:3.46,priceBefore:394.0,priceAfter1D:422.3,priceAfter5D:430.8 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2026-01-15",epsEstimate:4.03,epsActual:4.81,priceBefore:242.8,priceAfter1D:253.1,priceAfter5D:256.4 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2025-10-15",epsEstimate:3.98,epsActual:4.44,priceBefore:226.5,priceAfter1D:233.1,priceAfter5D:237.8 },
  { ticker:"JPM",name:"JPMorgan Chase",sector:"Financials",date:"2025-07-11",epsEstimate:4.53,epsActual:4.79,priceBefore:261.0,priceAfter1D:268.4,priceAfter5D:265.2 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2026-01-29",epsEstimate:6.72,epsActual:7.10,priceBefore:612.0,priceAfter1D:636.5,priceAfter5D:641.2 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2025-10-29",epsEstimate:5.70,epsActual:6.03,priceBefore:575.3,priceAfter1D:589.2,priceAfter5D:598.4 },
  { ticker:"META",name:"Meta Platforms",sector:"Technology",date:"2025-07-30",epsEstimate:5.21,epsActual:5.31,priceBefore:508.2,priceAfter1D:518.6,priceAfter5D:536.8 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2026-02-04",epsEstimate:2.12,epsActual:2.15,priceBefore:192.3,priceAfter1D:193.1,priceAfter5D:190.8 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2025-10-29",epsEstimate:1.83,epsActual:2.12,priceBefore:169.2,priceAfter1D:178.6,priceAfter5D:182.3 },
  { ticker:"GOOGL",name:"Alphabet Inc.",sector:"Technology",date:"2025-07-29",epsEstimate:1.84,epsActual:1.89,priceBefore:166.8,priceAfter1D:170.2,priceAfter5D:164.1 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2026-02-06",epsEstimate:1.48,epsActual:1.86,priceBefore:218.5,priceAfter1D:231.4,priceAfter5D:228.9 },
  { ticker:"AMZN",name:"Amazon.com Inc.",sector:"Consumer Discretionary",date:"2025-10-30",epsEstimate:1.28,epsActual:1.43,priceBefore:192.8,priceAfter1D:198.6,priceAfter5D:202.1 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2026-01-21",epsEstimate:4.18,epsActual:4.52,priceBefore:872.4,priceAfter1D:910.3,priceAfter5D:925.6 },
  { ticker:"NFLX",name:"Netflix Inc.",sector:"Communication Services",date:"2025-10-16",epsEstimate:5.07,epsActual:5.40,priceBefore:758.2,priceAfter1D:810.4,priceAfter5D:828.1 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2026-01-15",epsEstimate:8.15,epsActual:11.95,priceBefore:548.2,priceAfter1D:582.4,priceAfter5D:590.1 },
  { ticker:"GS",name:"Goldman Sachs",sector:"Financials",date:"2025-10-15",epsEstimate:6.89,epsActual:8.40,priceBefore:504.2,priceAfter1D:536.8,priceAfter5D:548.2 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2026-02-06",epsEstimate:5.46,epsActual:5.32,priceBefore:782.3,priceAfter1D:752.1,priceAfter5D:745.8 },
  { ticker:"LLY",name:"Eli Lilly & Co.",sector:"Healthcare",date:"2025-10-29",epsEstimate:3.24,epsActual:3.06,priceBefore:832.4,priceAfter1D:795.2,priceAfter5D:780.6 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2026-02-04",epsEstimate:1.08,epsActual:1.09,priceBefore:128.6,priceAfter1D:122.4,priceAfter5D:119.2 },
  { ticker:"AMD",name:"Advanced Micro Devices",sector:"Technology",date:"2025-10-28",epsEstimate:0.92,epsActual:1.03,priceBefore:152.4,priceAfter1D:148.6,priceAfter5D:142.1 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2026-02-05",epsEstimate:1.44,epsActual:1.38,priceBefore:112.6,priceAfter1D:106.8,priceAfter5D:104.2 },
  { ticker:"DIS",name:"Walt Disney Co.",sector:"Communication Services",date:"2025-11-06",epsEstimate:1.09,epsActual:1.14,priceBefore:98.4,priceAfter1D:102.1,priceAfter5D:105.8 },
];

// Alpha Vantage API - free tier: 25 calls/day, returns full earnings history
async function fetchEarningsForTicker(ticker, apiKey) {
  try {
    // Alpha Vantage EARNINGS endpoint returns all quarterly earnings with estimates
    const earningsRes = await fetch(
      `https://www.alphavantage.co/query?function=EARNINGS&symbol=${ticker}&apikey=${apiKey}`
    );
    const earningsData = await earningsRes.json();

    if (earningsData["Note"] || earningsData["Information"]) {
      console.warn("Alpha Vantage rate limit hit. Wait a minute and try again.");
      return [];
    }

    const quarterly = earningsData.quarterlyEarnings;
    if (!Array.isArray(quarterly) || !quarterly.length) return [];

    // Get daily prices
    const priceRes = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&apikey=${apiKey}`
    );
    const priceData = await priceRes.json();

    if (priceData["Note"] || priceData["Information"]) {
      console.warn("Alpha Vantage rate limit hit on price data.");
      return [];
    }

    const dailyPrices = priceData["Time Series (Daily)"];
    if (!dailyPrices) return [];

    // Sort price dates descending
    const priceDates = Object.keys(dailyPrices).sort((a, b) => b.localeCompare(a));

    // Get company name from first earnings entry or use ticker
    const name = ticker; // Alpha Vantage EARNINGS doesn't include company name

    // Try to get overview for name and sector
    let companyName = ticker;
    let sector = "Other";
    try {
      const overviewRes = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`
      );
      const overview = await overviewRes.json();
      if (overview.Name) companyName = overview.Name;
      if (overview.Sector) sector = overview.Sector;
    } catch (e) {
      // Ignore - just use ticker
    }

    const results = [];

    for (const q of quarterly.slice(0, 28)) {
      const reportDate = q.reportedDate || q.fiscalDateEnding;
      const epsEstimate = parseFloat(q.estimatedEPS);
      const epsActual = parseFloat(q.reportedEPS);

      if (!reportDate || isNaN(epsEstimate) || isNaN(epsActual) || epsEstimate === 0) continue;

      // Find the price on the reporting date and surrounding days
      let reportIdx = -1;
      for (let i = 0; i < priceDates.length; i++) {
        if (priceDates[i] <= reportDate) { reportIdx = i; break; }
      }

      if (reportIdx < 0 || reportIdx - 1 < 0) continue;

      const priceBefore = parseFloat(dailyPrices[priceDates[reportIdx]]["4. close"]);
      const priceAfter1D = reportIdx - 1 >= 0
        ? parseFloat(dailyPrices[priceDates[reportIdx - 1]]["4. close"])
        : priceBefore;
      const priceAfter5D = reportIdx - 5 >= 0
        ? parseFloat(dailyPrices[priceDates[reportIdx - 5]]["4. close"])
        : priceAfter1D;

      results.push({
        ticker,
        name: companyName,
        sector,
        date: reportDate,
        epsEstimate,
        epsActual,
        priceBefore,
        priceAfter1D,
        priceAfter5D,
      });
    }

    return results;
  } catch (err) {
    console.error(`Error fetching ${ticker}:`, err);
    return [];
  }
}

function process(raw) {
  return raw.map(d => {
    const surprise = d.epsEstimate !== 0 ? ((d.epsActual - d.epsEstimate) / Math.abs(d.epsEstimate)) * 100 : 0;
    const move1D = d.priceBefore !== 0 ? ((d.priceAfter1D - d.priceBefore) / d.priceBefore) * 100 : 0;
    const move5D = d.priceBefore !== 0 ? ((d.priceAfter5D - d.priceBefore) / d.priceBefore) * 100 : 0;
    return { ...d, surprise, move1D, move5D };
  });
}

function getLatest(data) {
  const m = {};
  data.forEach(d => { if (!m[d.ticker] || d.date > m[d.ticker].date) m[d.ticker] = d; });
  return Object.values(m);
}

const SC = { Technology:"#4f46e5", Financials:"#059669", Healthcare:"#d97706", "Consumer Discretionary":"#dc2626", "Consumer Staples":"#7c3aed", Energy:"#ea580c", "Communication Services":"#0891b2", Industrials:"#0d9488", "Real Estate":"#7c3aed", Utilities:"#ca8a04", Materials:"#e11d48", Other:"#64748b" };

function Stat({ label, value, sub, color }) {
  return (
    <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:10, padding:"14px 18px", flex:"1 1 140px", minWidth:140 }}>
      <div style={{ fontSize:10, color:"var(--dim)", fontFamily:"var(--mono)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>{label}</div>
      <div style={{ fontSize:24, fontWeight:700, color:color||"var(--text)", fontFamily:"var(--display)", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"var(--dim)", marginTop:4, lineHeight:1.3 }}>{sub}</div>}
    </div>
  );
}

function Scatter({ data, moveType, onDotClick }) {
  const [hov, setHov] = useState(null);
  const W=680, H=380, p={t:28,r:28,b:48,l:56};
  const pw=W-p.l-p.r, ph=H-p.t-p.b;
  const xs=data.map(d=>d.surprise), ys=data.map(d=>moveType==="1D"?d.move1D:d.move5D);
  const xMin=Math.min(...xs,-5), xMax=Math.max(...xs,5), yMin=Math.min(...ys,-5), yMax=Math.max(...ys,5);
  const xR=xMax-xMin||10, yR=yMax-yMin||10;
  const tx=v=>p.l+((v-xMin)/xR)*pw, ty=v=>p.t+ph-((v-yMin)/yR)*ph;
  const xT=Array.from({length:7},(_,i)=>xMin+(xR/6)*i);
  const yT=Array.from({length:7},(_,i)=>yMin+(yR/6)*i);
  const n=data.length, sX=xs.reduce((a,b)=>a+b,0), sY=ys.reduce((a,b)=>a+b,0);
  const sXY=xs.reduce((a,x,i)=>a+x*ys[i],0), sX2=xs.reduce((a,x)=>a+x*x,0);
  const slope=n>1?(n*sXY-sX*sY)/(n*sX2-sX*sX):0;
  const intercept=n>0?(sY-slope*sX)/n:0;

  return (
    <div style={{position:"relative"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:W,display:"block"}}>
        <rect x={p.l} y={p.t} width={pw} height={ph} fill="var(--plot)" rx="3"/>
        {xT.map((t,i)=><line key={`xg${i}`} x1={tx(t)} x2={tx(t)} y1={p.t} y2={p.t+ph} stroke="var(--grid)" strokeWidth=".5"/>)}
        {yT.map((t,i)=><line key={`yg${i}`} x1={p.l} x2={p.l+pw} y1={ty(t)} y2={ty(t)} stroke="var(--grid)" strokeWidth=".5"/>)}
        {xMin<0&&xMax>0&&<line x1={tx(0)} x2={tx(0)} y1={p.t} y2={p.t+ph} stroke="var(--zero)" strokeWidth="1" strokeDasharray="4,3"/>}
        {yMin<0&&yMax>0&&<line x1={p.l} x2={p.l+pw} y1={ty(0)} y2={ty(0)} stroke="var(--zero)" strokeWidth="1" strokeDasharray="4,3"/>}
        {n>2&&<line x1={tx(xMin)} y1={ty(slope*xMin+intercept)} x2={tx(xMax)} y2={ty(slope*xMax+intercept)} stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6,4" opacity=".5"/>}
        <text x={p.l+6} y={p.t+14} fill="var(--grid-label)" fontSize="8" fontFamily="var(--mono)">MISS + UP</text>
        <text x={p.l+pw-6} y={p.t+14} fill="var(--grid-label)" fontSize="8" fontFamily="var(--mono)" textAnchor="end">BEAT + UP</text>
        <text x={p.l+6} y={p.t+ph-6} fill="var(--grid-label)" fontSize="8" fontFamily="var(--mono)">MISS + DOWN</text>
        <text x={p.l+pw-6} y={p.t+ph-6} fill="var(--grid-label)" fontSize="8" fontFamily="var(--mono)" textAnchor="end">BEAT + DOWN</text>
        {xT.map((t,i)=><text key={`xl${i}`} x={tx(t)} y={p.t+ph+16} fill="var(--dim)" fontSize="9" textAnchor="middle" fontFamily="var(--mono)">{t.toFixed(1)}%</text>)}
        {yT.map((t,i)=><text key={`yl${i}`} x={p.l-6} y={ty(t)+3} fill="var(--dim)" fontSize="9" textAnchor="end" fontFamily="var(--mono)">{t.toFixed(1)}%</text>)}
        <text x={p.l+pw/2} y={H-2} fill="var(--dim)" fontSize="10" textAnchor="middle" fontFamily="var(--body)" fontWeight="500">EPS Surprise %</text>
        <text transform={`rotate(-90) translate(${-(p.t+ph/2)}, 12)`} fill="var(--dim)" fontSize="10" textAnchor="middle" fontFamily="var(--body)" fontWeight="500">Price Move ({moveType==="1D"?"1-Day":"5-Day"}) %</text>
        {data.map((d,i)=>{
          const cx=tx(d.surprise),cy=ty(moveType==="1D"?d.move1D:d.move5D),h=hov===i;
          return(
            <g key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} onClick={()=>onDotClick?.(d.ticker)} style={{cursor:"pointer"}}>
              <circle cx={cx} cy={cy} r={h?7:5} fill={SC[d.sector]||"#888"} opacity={h?1:.75} stroke={h?"var(--card)":"none"} strokeWidth="2"/>
              {h&&<text x={cx} y={cy-12} fill="var(--text)" fontSize="11" textAnchor="middle" fontWeight="700" fontFamily="var(--mono)">{d.ticker}</text>}
            </g>
          );
        })}
      </svg>
      {hov!==null&&(()=>{const d=data[hov],mv=moveType==="1D"?d.move1D:d.move5D;return(
        <div style={{position:"absolute",bottom:10,right:10,background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 14px",fontSize:12,fontFamily:"var(--mono)",lineHeight:1.6,boxShadow:"0 2px 12px rgba(0,0,0,.08)"}}>
          <div style={{fontWeight:700,fontSize:13,fontFamily:"var(--body)",color:"var(--text)"}}>{d.ticker} · {d.name}</div>
          <div style={{color:"var(--dim)"}}>Surprise: <span style={{color:d.surprise>=0?"var(--green)":"var(--red)"}}>{d.surprise>=0?"+":""}{d.surprise.toFixed(2)}%</span></div>
          <div style={{color:"var(--dim)"}}>{moveType} Move: <span style={{color:mv>=0?"var(--green)":"var(--red)"}}>{mv>=0?"+":""}{mv.toFixed(2)}%</span></div>
          <div style={{fontSize:10,color:"var(--accent)",marginTop:2}}>Click for history →</div>
        </div>
      );})()}
    </div>
  );
}

function Drilldown({ ticker, data, onBack }) {
  const hist=data.filter(d=>d.ticker===ticker).sort((a,b)=>a.date.localeCompare(b.date));
  if(!hist.length) return <div><button onClick={onBack} style={{background:"var(--card)",border:"1px solid var(--border)",color:"var(--accent)",padding:"8px 16px",borderRadius:8,fontSize:12,fontFamily:"var(--mono)",marginBottom:20}}>← Back</button><p style={{color:"var(--dim)"}}>No data for {ticker}</p></div>;
  const name=hist[0]?.name,sector=hist[0]?.sector||"";
  const beats=hist.filter(d=>d.surprise>0),misses=hist.filter(d=>d.surprise<0);
  const avgSurp=hist.reduce((a,d)=>a+d.surprise,0)/hist.length;
  const avg1D=hist.reduce((a,d)=>a+d.move1D,0)/hist.length;
  const beatRate=((beats.length/hist.length)*100).toFixed(0);
  const beatsUp=beats.filter(d=>d.move1D>0).length;
  const missesDown=misses.filter(d=>d.move1D<0).length;
  const consistency=hist.length>0?(((beatsUp+missesDown)/hist.length)*100).toFixed(0):"0";
  const avgBeatMv=beats.length?beats.reduce((a,d)=>a+d.move1D,0)/beats.length:0;
  const avgMissMv=misses.length?misses.reduce((a,d)=>a+d.move1D,0)/misses.length:0;

  const patterns=[];
  if(parseInt(beatRate)>=75) patterns.push({label:"Serial Beater",desc:`Beats estimates ${beatRate}% of the time`,color:"var(--green)"});
  if(parseInt(beatRate)<=25) patterns.push({label:"Chronic Misser",desc:`Misses estimates ${100-parseInt(beatRate)}% of the time`,color:"var(--red)"});
  if(parseInt(consistency)>=80) patterns.push({label:"Predictable Reactor",desc:`Moves in expected direction ${consistency}% of the time`,color:"var(--accent)"});
  if(parseInt(consistency)<=40) patterns.push({label:"Contrarian Reactor",desc:`Often moves opposite to what you'd expect`,color:"var(--orange)"});
  if(misses.length>=2&&Math.abs(avgMissMv)>Math.abs(avgBeatMv)*1.5) patterns.push({label:"Punished on Misses",desc:`Avg miss drop (${avgMissMv.toFixed(1)}%) far exceeds avg beat rally (+${avgBeatMv.toFixed(1)}%)`,color:"var(--red)"});
  if(beats.length>=2&&avgBeatMv>Math.abs(avgMissMv)*1.5) patterns.push({label:"Rewarded on Beats",desc:`Avg beat rally (+${avgBeatMv.toFixed(1)}%) far exceeds avg miss drop (${avgMissMv.toFixed(1)}%)`,color:"var(--green)"});

  const W=680,H=320,pad={t:28,r:28,b:48,l:56};
  const pw=W-pad.l-pad.r,ph=H-pad.t-pad.b;
  const xs=hist.map(d=>d.surprise),ys=hist.map(d=>d.move1D);
  const xMin=Math.min(...xs,-3),xMax=Math.max(...xs,3),yMin=Math.min(...ys,-3),yMax=Math.max(...ys,3);
  const xR=xMax-xMin||6,yR=yMax-yMin||6;
  const tx=v=>pad.l+((v-xMin)/xR)*pw,ty=v=>pad.t+ph-((v-yMin)/yR)*ph;

  const BW=680,BH=260,bp={t:20,r:20,b:60,l:50};
  const bpw=BW-bp.l-bp.r,bph=BH-bp.t-bp.b;
  const barW=Math.min(48,(bpw/hist.length)*.7),gap=bpw/hist.length;
  const allM=hist.map(d=>d.move1D);
  const bYmin=Math.min(...allM,-2),bYmax=Math.max(...allM,2),bYR=bYmax-bYmin||4;
  const bty=v=>bp.t+bph-((v-bYmin)/bYR)*bph;
  const [hovBar,setHovBar]=useState(null);
  const [hovDot,setHovDot]=useState(null);

  return(
    <div>
      <button onClick={onBack} style={{background:"var(--card)",border:"1px solid var(--border)",color:"var(--accent)",padding:"8px 16px",borderRadius:8,fontSize:12,fontFamily:"var(--mono)",marginBottom:20}}>← Back to Overview</button>
      <div style={{display:"flex",alignItems:"baseline",gap:12,flexWrap:"wrap",marginBottom:4}}>
        <h2 style={{fontFamily:"var(--display)",fontSize:26,fontWeight:800,margin:0,letterSpacing:"-.02em",color:"var(--text)"}}>{ticker}</h2>
        <span style={{fontSize:14,color:"var(--dim)"}}>{name}</span>
        <span style={{fontSize:11,color:SC[sector]||"var(--dim)",fontFamily:"var(--mono)",background:"var(--tag-bg)",padding:"2px 8px",borderRadius:4}}>{sector}</span>
      </div>
      <p style={{color:"var(--dim)",fontSize:13,marginBottom:20}}>{hist.length} quarters of earnings data — looking for reaction patterns.</p>

      {patterns.length>0&&(
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
          {patterns.map((pt,i)=>(
            <div key={i} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:10,padding:"12px 16px",flex:"1 1 200px",borderLeft:`3px solid ${pt.color}`}}>
              <div style={{fontSize:13,fontWeight:700,color:pt.color,fontFamily:"var(--display)",marginBottom:3}}>{pt.label}</div>
              <div style={{fontSize:11,color:"var(--dim)",lineHeight:1.4}}>{pt.desc}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
        <Stat label="Beat Rate" value={`${beatRate}%`} sub={`${beats.length} beats / ${misses.length} misses`} color="var(--green)"/>
        <Stat label="Avg Surprise" value={`${avgSurp>=0?"+":""}${avgSurp.toFixed(1)}%`} color={avgSurp>=0?"var(--green)":"var(--red)"}/>
        <Stat label="Avg 1D Move" value={`${avg1D>=0?"+":""}${avg1D.toFixed(1)}%`} color={avg1D>=0?"var(--green)":"var(--red)"}/>
        <Stat label="Consistency" value={`${consistency}%`} sub="Moves in expected direction" color="var(--accent)"/>
      </div>

      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,padding:"16px 12px",marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:600,marginBottom:10,color:"var(--text)"}}>Surprise vs 1D Reaction — Each Quarter</div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:W,display:"block"}}>
          <rect x={pad.l} y={pad.t} width={pw} height={ph} fill="var(--plot)" rx="3"/>
          {xMin<0&&xMax>0&&<line x1={tx(0)} x2={tx(0)} y1={pad.t} y2={pad.t+ph} stroke="var(--zero)" strokeWidth="1" strokeDasharray="4,3"/>}
          {yMin<0&&yMax>0&&<line x1={pad.l} x2={pad.l+pw} y1={ty(0)} y2={ty(0)} stroke="var(--zero)" strokeWidth="1" strokeDasharray="4,3"/>}
          {Array.from({length:5},(_,i)=>xMin+(xR/4)*i).map((t,i)=><text key={i} x={tx(t)} y={pad.t+ph+16} fill="var(--dim)" fontSize="9" textAnchor="middle" fontFamily="var(--mono)">{t.toFixed(1)}%</text>)}
          {Array.from({length:5},(_,i)=>yMin+(yR/4)*i).map((t,i)=><text key={i} x={pad.l-6} y={ty(t)+3} fill="var(--dim)" fontSize="9" textAnchor="end" fontFamily="var(--mono)">{t.toFixed(1)}%</text>)}
          <text x={pad.l+pw/2} y={H-2} fill="var(--dim)" fontSize="10" textAnchor="middle" fontFamily="var(--body)" fontWeight="500">EPS Surprise %</text>
          <text transform={`rotate(-90) translate(${-(pad.t+ph/2)}, 12)`} fill="var(--dim)" fontSize="10" textAnchor="middle" fontFamily="var(--body)" fontWeight="500">1-Day Move %</text>
          {hist.map((d,i)=>{
            const cx=tx(d.surprise),cy=ty(d.move1D),h=hovDot===i;
            return(
              <g key={i} onMouseEnter={()=>setHovDot(i)} onMouseLeave={()=>setHovDot(null)}>
                <circle cx={cx} cy={cy} r={h?8:6} fill={SC[sector]||"#888"} opacity={h?1:.7} stroke={h?"var(--card)":"none"} strokeWidth="2" style={{cursor:"pointer"}}/>
                {h&&<><text x={cx} y={cy-14} fill="var(--text)" fontSize="10" textAnchor="middle" fontWeight="600" fontFamily="var(--mono)">{d.date.slice(0,7)}</text>
                <text x={cx} y={cy-3} fill="var(--dim)" fontSize="9" textAnchor="middle" fontFamily="var(--mono)">{d.surprise>=0?"+":""}{d.surprise.toFixed(1)}% → {d.move1D>=0?"+":""}{d.move1D.toFixed(1)}%</text></>}
              </g>
            );
          })}
        </svg>
        <div style={{textAlign:"center",fontSize:9,color:"var(--dim)",fontFamily:"var(--mono)",marginTop:4}}>Each dot = one quarter · Hover for detail</div>
      </div>

      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,padding:"16px 12px",marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:600,marginBottom:10,color:"var(--text)"}}>1-Day Price Reaction by Quarter</div>
        <svg viewBox={`0 0 ${BW} ${BH}`} style={{width:"100%",maxWidth:BW,display:"block"}}>
          <line x1={bp.l} x2={bp.l+bpw} y1={bty(0)} y2={bty(0)} stroke="var(--zero)" strokeWidth="1"/>
          {[-10,-8,-6,-4,-2,0,2,4,6,8,10,12,14,16].filter(v=>v>=bYmin&&v<=bYmax).map((v,i)=>(
            <g key={i}><line x1={bp.l} x2={bp.l+bpw} y1={bty(v)} y2={bty(v)} stroke="var(--grid)" strokeWidth=".5"/>
            <text x={bp.l-6} y={bty(v)+3} fill="var(--dim)" fontSize="9" textAnchor="end" fontFamily="var(--mono)">{v}%</text></g>
          ))}
          {hist.map((d,i)=>{
            const x=bp.l+gap*i+(gap-barW)/2;
            const pos=d.move1D>=0;
            const bH=Math.abs(d.move1D/bYR)*bph;
            const y=pos?bty(0)-bH:bty(0);
            const h=hovBar===i;
            return(
              <g key={i} onMouseEnter={()=>setHovBar(i)} onMouseLeave={()=>setHovBar(null)}>
                <rect x={x} y={y} width={barW} height={Math.max(bH,1)} rx={3} fill={pos?"var(--green)":"var(--red)"} opacity={h?1:.7}/>
                <circle cx={x+barW/2} cy={bty(d.surprise)} r={4} fill="var(--accent)" stroke="var(--card)" strokeWidth="1.5"/>
                <text x={x+barW/2} y={BH-bp.b+16} fill="var(--dim)" fontSize="9" textAnchor="middle" fontFamily="var(--mono)" transform={`rotate(-35 ${x+barW/2} ${BH-bp.b+16})`}>{d.date.slice(0,7)}</text>
                {h&&<text x={x+barW/2} y={y-6} fill="var(--text)" fontSize="10" textAnchor="middle" fontWeight="600" fontFamily="var(--mono)">{d.move1D>=0?"+":""}{d.move1D.toFixed(1)}%</text>}
              </g>
            );
          })}
        </svg>
        <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:6,fontSize:10,color:"var(--dim)",fontFamily:"var(--mono)"}}>
          <span><span style={{display:"inline-block",width:8,height:8,borderRadius:2,background:"var(--green)",marginRight:4,verticalAlign:"middle"}}/>1D Price Move</span>
          <span><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"var(--accent)",marginRight:4,verticalAlign:"middle"}}/>EPS Surprise %</span>
        </div>
      </div>

      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{borderBottom:"1px solid var(--border)",background:"var(--btn-bg)"}}>
              {["Date","EPS Est","EPS Actual","Surprise","1D Move","5D Move"].map(h=>(<th key={h} style={{padding:"10px 14px",textAlign:"left",fontFamily:"var(--mono)",fontSize:9,textTransform:"uppercase",letterSpacing:".06em",color:"var(--dim)",fontWeight:600}}>{h}</th>))}
            </tr></thead>
            <tbody>
              {[...hist].reverse().map((d,i)=>(
                <tr key={i} style={{borderBottom:"1px solid var(--border)"}}>
                  <td style={{padding:"10px 14px",fontFamily:"var(--mono)",color:"var(--dim)"}}>{d.date}</td>
                  <td style={{padding:"10px 14px",fontFamily:"var(--mono)",color:"var(--text)"}}>${d.epsEstimate.toFixed(2)}</td>
                  <td style={{padding:"10px 14px",fontFamily:"var(--mono)",fontWeight:600,color:"var(--text)"}}>${d.epsActual.toFixed(2)}</td>
                  <td style={{padding:"10px 14px",fontFamily:"var(--mono)",fontWeight:600,color:d.surprise>=0?"var(--green)":"var(--red)"}}>{d.surprise>=0?"+":""}{d.surprise.toFixed(2)}%</td>
                  <td style={{padding:"10px 14px",fontFamily:"var(--mono)",fontWeight:600,color:d.move1D>=0?"var(--green)":"var(--red)"}}>{d.move1D>=0?"+":""}{d.move1D.toFixed(2)}%</td>
                  <td style={{padding:"10px 14px",fontFamily:"var(--mono)",fontWeight:600,color:d.move5D>=0?"var(--green)":"var(--red)"}}>{d.move5D>=0?"+":""}{d.move5D.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sector,setSector]=useState("All");
  const [moveType,setMoveType]=useState("1D");
  const [selectedTicker,setSelectedTicker]=useState(null);
  const [sortKey,setSortKey]=useState("surprise");
  const [sortDir,setSortDir]=useState(-1);
  const [apiKey,setApiKey]=useState("");
  const [showModal,setShowModal]=useState(false);
  const [liveData,setLiveData]=useState(null);
  const [loading,setLoading]=useState(false);
  const [loadProgress,setLoadProgress]=useState("");
  const [customTicker,setCustomTicker]=useState("");

  // Alpha Vantage: 25 calls/day free. Each ticker uses 3 calls (earnings, prices, overview).
  // So ~8 tickers per day on free tier. Load one at a time.
  const handleAddTicker = useCallback(async () => {
    const t = customTicker.trim().toUpperCase();
    if (!t || !apiKey) return;
    setCustomTicker("");
    setLoading(true);
    setLoadProgress(`Loading ${t}... (3 API calls)`);
    const results = await fetchEarningsForTicker(t, apiKey);
    if (results.length) {
      setLiveData(prev => [...(prev || []), ...results]);
      setLoadProgress(`✓ Loaded ${results.length} quarters for ${t}`);
    } else {
      setLoadProgress(`No data found for ${t} — may have hit rate limit (25 calls/day). Wait 1 min and retry.`);
    }
    setLoading(false);
    setTimeout(() => setLoadProgress(""), 4000);
  }, [customTicker, apiKey]);

  const handleSaveKey = () => { setShowModal(false); };

  const rawData = liveData && liveData.length > 0 ? [...SAMPLE_DATA, ...liveData] : SAMPLE_DATA;
  const allData = useMemo(() => process(rawData), [rawData]);
  const sectors = useMemo(() => { const s = new Set(allData.map(d => d.sector)); return ["All", ...Array.from(s).sort()]; }, [allData]);
  const latest = useMemo(() => getLatest(allData), [allData]);
  const filtered = useMemo(() => sector === "All" ? latest : latest.filter(d => d.sector === sector), [latest, sector]);
  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    const av = sortKey === "move" ? (moveType === "1D" ? a.move1D : a.move5D) : a[sortKey];
    const bv = sortKey === "move" ? (moveType === "1D" ? b.move1D : b.move5D) : b[sortKey];
    return typeof av === "string" ? sortDir * av.localeCompare(bv) : sortDir * (av - bv);
  }), [filtered, sortKey, sortDir, moveType]);

  const stats = useMemo(() => {
    const beats = filtered.filter(d => d.surprise > 0), misses = filtered.filter(d => d.surprise < 0);
    const avgB = beats.length ? beats.reduce((a, d) => a + d.move1D, 0) / beats.length : 0;
    const avgM = misses.length ? misses.reduce((a, d) => a + d.move1D, 0) / misses.length : 0;
    const biggest = [...filtered].sort((a, b) => Math.abs(b.move1D) - Math.abs(a.move1D))[0];
    const over = filtered.filter(d => Math.abs(d.move1D) > Math.abs(d.surprise) * 2 && Math.abs(d.surprise) > 1);
    return { beats: beats.length, misses: misses.length, avgB, avgM, biggest, over };
  }, [filtered]);

  const toggleSort = k => { if (sortKey === k) setSortDir(d => d * -1); else { setSortKey(k); setSortDir(-1); } };
  const tickers = useMemo(() => [...new Set(allData.map(d => d.ticker))].sort(), [allData]);

  return (
    <div style={{ fontFamily:"var(--body)", color:"var(--text)", minHeight:"100vh", background:"var(--bg)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        :root {
          --display:'Plus Jakarta Sans',sans-serif;--body:'Inter',sans-serif;--mono:'JetBrains Mono',monospace;
          --bg:#f8fafc;--card:#ffffff;--plot:#f1f5f9;--border:#e2e8f0;--text:#0f172a;--dim:#64748b;
          --grid-label:rgba(100,116,139,.3);--green:#059669;--red:#dc2626;--orange:#d97706;--accent:#4f46e5;
          --grid:rgba(100,116,139,.15);--zero:rgba(100,116,139,.3);--tag-bg:#f1f5f9;--btn-bg:#f1f5f9;--btn-active:#4f46e5;
        }
        *{box-sizing:border-box;margin:0}button{cursor:pointer;border:none;font-family:var(--body)}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
      `}</style>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"28px 20px 60px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:4 }}>
          <h1 onClick={()=>setSelectedTicker(null)} style={{ fontFamily:"var(--display)", fontSize:26, fontWeight:800, letterSpacing:"-.02em", margin:0, cursor:"pointer", color:"var(--text)" }}>Earnings Surprise Tracker</h1>
          <button onClick={()=>setShowModal(true)} style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--accent)", padding:"7px 14px", borderRadius:8, fontSize:11, fontFamily:"var(--mono)", fontWeight:500 }}>
            {apiKey ? "API Key Set ✓" : "Connect API Key"}
          </button>
        </div>
        <p style={{ color:"var(--dim)", fontSize:13, marginBottom:6 }}>How stocks react to earnings surprises — click any stock for its historical pattern.</p>

        {loadProgress && (
          <div style={{ padding:"10px 14px", background:loadProgress.startsWith("✓")?"rgba(5,150,105,.06)":"rgba(79,70,229,.06)", border:`1px solid ${loadProgress.startsWith("✓")?"rgba(5,150,105,.15)":"rgba(79,70,229,.15)"}`, borderRadius:8, fontSize:12, color:loadProgress.startsWith("✓")?"var(--green)":"var(--accent)", marginBottom:12, animation:loading?"pulse 1.5s ease-in-out infinite":"none" }}>
            {loadProgress}
          </div>
        )}

        {!apiKey && (
          <div style={{ marginBottom:16, padding:"8px 12px", background:"rgba(79,70,229,.05)", border:"1px solid rgba(79,70,229,.12)", borderRadius:8, fontSize:11, color:"var(--accent)" }}>
            Showing sample data. Click "Connect API Key" to add an Alpha Vantage key and load live earnings data.
          </div>
        )}

        {/* Add ticker */}
        {!selectedTicker && (
          <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center" }}>
            <input type="text" placeholder={apiKey ? "Add ticker (e.g. INTC)" : "Connect API key first"} value={customTicker}
              onChange={e=>setCustomTicker(e.target.value.toUpperCase())}
              onKeyDown={e=>e.key==="Enter"&&handleAddTicker()}
              disabled={!apiKey}
              style={{ padding:"7px 12px", background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, color:"var(--text)", fontSize:12, fontFamily:"var(--mono)", width:200, outline:"none", opacity:apiKey?1:.5 }}
            />
            <button onClick={handleAddTicker} disabled={!apiKey} style={{ padding:"7px 14px", borderRadius:8, background:apiKey?"var(--accent)":"var(--dim)", color:"#fff", fontSize:12, fontWeight:600, opacity:apiKey?1:.5 }}>Add</button>
            {apiKey && <span style={{fontSize:10,color:"var(--dim)",fontFamily:"var(--mono)"}}>Free tier: ~8 stocks/day (25 API calls)</span>}
          </div>
        )}

        {selectedTicker ? (
          <Drilldown ticker={selectedTicker} data={allData} onBack={()=>setSelectedTicker(null)} />
        ) : (
          <>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}>
              <Stat label="Beats" value={stats.beats} sub={`Avg 1D: ${stats.avgB>=0?"+":""}${stats.avgB.toFixed(1)}%`} color="var(--green)"/>
              <Stat label="Misses" value={stats.misses} sub={`Avg 1D: ${stats.avgM>=0?"+":""}${stats.avgM.toFixed(1)}%`} color="var(--red)"/>
              <Stat label="Biggest Reaction" value={stats.biggest?.ticker||"—"} sub={stats.biggest?`${stats.biggest.move1D>=0?"+":""}${stats.biggest.move1D.toFixed(1)}%`:""} color="var(--accent)"/>
              <Stat label="Overreactors" value={stats.over.length} sub={stats.over.length?stats.over.map(d=>d.ticker).join(", "):"None"}/>
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14, alignItems:"center" }}>
              <div style={{ display:"flex", gap:3, background:"var(--btn-bg)", borderRadius:8, padding:3 }}>
                {["1D","5D"].map(m=>(
                  <button key={m} onClick={()=>setMoveType(m)} style={{ padding:"5px 12px", borderRadius:6, fontSize:11, fontFamily:"var(--mono)", fontWeight:500, background:moveType===m?"var(--btn-active)":"transparent", color:moveType===m?"#fff":"var(--dim)" }}>{m}</button>
                ))}
              </div>
              <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                {sectors.map(s=>(
                  <button key={s} onClick={()=>setSector(s)} style={{ padding:"5px 10px", borderRadius:6, fontSize:10, fontWeight:500, background:sector===s?"var(--card)":"transparent", border:sector===s?"1px solid var(--border)":"1px solid transparent", color:sector===s?"var(--text)":"var(--dim)" }}>{s==="All"?"All":s}</button>
                ))}
              </div>
            </div>

            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
              <span style={{ fontSize:10, color:"var(--dim)", fontFamily:"var(--mono)", lineHeight:"26px" }}>DRILL DOWN:</span>
              {tickers.map(t=>(
                <button key={t} onClick={()=>setSelectedTicker(t)} style={{ padding:"4px 10px", borderRadius:6, fontSize:11, fontFamily:"var(--mono)", fontWeight:600, background:"var(--card)", border:"1px solid var(--border)", color:SC[allData.find(d=>d.ticker===t)?.sector]||"var(--text)" }}>{t}</button>
              ))}
            </div>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:14 }}>
              {Object.entries(SC).filter(([n])=>allData.some(d=>d.sector===n)).map(([n,c])=>(
                <div key={n} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:c }}/>
                  <span style={{ fontSize:9, color:"var(--dim)", fontFamily:"var(--mono)" }}>{n}</span>
                </div>
              ))}
            </div>

            <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:"16px 12px", marginBottom:20, boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
              <Scatter data={filtered} moveType={moveType} onDotClick={setSelectedTicker}/>
              <div style={{ textAlign:"center", marginTop:6, fontSize:9, color:"var(--dim)", fontFamily:"var(--mono)" }}>Dashed = regression · Click any dot for history</div>
            </div>

            <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ borderBottom:"1px solid var(--border)", background:"var(--btn-bg)" }}>
                      {[{k:"ticker",l:"Ticker"},{k:"sector",l:"Sector"},{k:"date",l:"Date"},{k:"surprise",l:"Surprise %"},{k:"move",l:moveType==="1D"?"1D Move":"5D Move"}].map(({k,l})=>(
                        <th key={k} onClick={()=>toggleSort(k)} style={{ padding:"10px 14px", textAlign:"left", fontFamily:"var(--mono)", fontSize:9, textTransform:"uppercase", letterSpacing:".06em", color:"var(--dim)", cursor:"pointer", userSelect:"none", fontWeight:600, whiteSpace:"nowrap" }}>{l} {sortKey===k?(sortDir>0?"↑":"↓"):""}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((d,i)=>{
                      const mv=moveType==="1D"?d.move1D:d.move5D;
                      const over=Math.abs(mv)>Math.abs(d.surprise)*2&&Math.abs(d.surprise)>1;
                      return(
                        <tr key={i} onClick={()=>setSelectedTicker(d.ticker)} style={{ borderBottom:"1px solid var(--border)", cursor:"pointer", background:over?"rgba(79,70,229,.03)":"transparent" }}>
                          <td style={{ padding:"9px 14px", fontFamily:"var(--mono)", fontWeight:600 }}>
                            <span style={{ color:SC[d.sector]||"var(--text)" }}>{d.ticker}</span>
                            <span style={{ color:"var(--dim)", fontWeight:400, fontSize:10, marginLeft:6 }}>{d.name}</span>
                          </td>
                          <td style={{ padding:"9px 14px", color:"var(--dim)", fontSize:10 }}>{d.sector}</td>
                          <td style={{ padding:"9px 14px", fontFamily:"var(--mono)", color:"var(--dim)", fontSize:11 }}>{d.date}</td>
                          <td style={{ padding:"9px 14px", fontFamily:"var(--mono)", fontWeight:600, color:d.surprise>=0?"var(--green)":"var(--red)" }}>{d.surprise>=0?"+":""}{d.surprise.toFixed(2)}%</td>
                          <td style={{ padding:"9px 14px", fontFamily:"var(--mono)", fontWeight:600, color:mv>=0?"var(--green)":"var(--red)" }}>
                            {mv>=0?"+":""}{mv.toFixed(2)}%
                            {over&&<span style={{ marginLeft:5, fontSize:8, color:"var(--accent)", fontWeight:500 }}>OVERREACTION</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {showModal&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.3)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:20 }} onClick={()=>setShowModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:24, maxWidth:420, width:"100%", boxShadow:"0 8px 30px rgba(0,0,0,.12)" }}>
            <h3 style={{ fontFamily:"var(--display)", fontSize:16, fontWeight:700, marginBottom:6, color:"var(--text)" }}>Connect Live Data</h3>
            <p style={{ color:"var(--dim)", fontSize:12, lineHeight:1.5, marginBottom:6 }}>Get a free Alpha Vantage API key:</p>
            <ol style={{ color:"var(--dim)", fontSize:12, lineHeight:1.8, marginBottom:14, paddingLeft:20 }}>
              <li>Go to <span style={{ color:"var(--accent)", fontWeight:500 }}>alphavantage.co/support/#api-key</span></li>
              <li>Fill out the short form</li>
              <li>Copy your API key</li>
              <li>Paste it below</li>
            </ol>
            <p style={{ color:"var(--dim)", fontSize:11, marginBottom:10, lineHeight:1.4 }}>
              Free tier = 25 API calls/day (~8 stocks). Each stock you add pulls full earnings history (20+ quarters).
            </p>
            <input type="text" placeholder="Paste your Alpha Vantage API key" value={apiKey} onChange={e=>setApiKey(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleSaveKey()}
              style={{ width:"100%", padding:"10px 12px", background:"var(--btn-bg)", border:"1px solid var(--border)", borderRadius:8, color:"var(--text)", fontSize:12, marginBottom:12, outline:"none", fontFamily:"var(--mono)" }}
            />
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={handleSaveKey} style={{ flex:1, padding:"10px", borderRadius:8, background:"var(--accent)", color:"#fff", fontWeight:600, fontSize:13 }}>Save</button>
              <button onClick={()=>setShowModal(false)} style={{ flex:1, padding:"10px", borderRadius:8, background:"var(--btn-bg)", color:"var(--dim)", fontWeight:500, fontSize:13, border:"1px solid var(--border)" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
