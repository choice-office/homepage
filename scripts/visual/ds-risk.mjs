import { chromium } from "playwright";
const BASE = "http://localhost:3200";
const ROUTES = ["/","/greeting","/members","/services","/services/f4","/reviews","/blog","/blog/한국여권-부정사용-범칙금-시민권-취득","/faq","/location","/contact"];
const VPS = [["mobile",390,844],["tablet",768,1024],["desktop",1440,900]];
// .ds-* 기본 규칙만 레이어로 옮긴다고 가정 → 그 규칙이 유틸리티에 지는 지점을 찾는다
const IN = () => {
  const util=[], ds=[];
  const walk=(l,layer,media)=>{for(const r of l){
    const t=r.constructor.name;
    if(t==="CSSLayerBlockRule"){walk(r.cssRules,r.name||"?",media);continue;}
    if(t==="CSSMediaRule"){walk(r.cssRules,layer,r.conditionText);continue;}
    if(r.selectorText&&r.style){
      const rec={sel:r.selectorText,style:r.style,media};
      if(layer==="utilities") util.push(rec);
      // 이동 대상: .ds-* 로 시작하고 후손 결합자가 없는 '기본' 규칙만
      else if(!layer && /^\.ds-[\w-]+(:hover|:focus|\.is-[\w-]+)?$/.test(r.selectorText.trim())) ds.push(rec);
    }
    if(r.cssRules?.length&&t==="CSSStyleRule") walk(r.cssRules,layer,media);
  }};
  for(const s of document.styleSheets){try{walk(s.cssRules,null,null)}catch{}}
  const out=new Map();
  for(const el of document.querySelectorAll("*")){
    const u=new Map();
    for(const r of util){let m=false;try{m=el.matches(r.sel)}catch{continue}
      if(!m)continue; if(r.media&&!matchMedia(r.media).matches)continue;
      for(const p of r.style) u.set(p,{v:r.style.getPropertyValue(p),s:r.sel});}
    if(!u.size)continue;
    for(const r of ds){let m=false;try{m=el.matches(r.sel)}catch{continue}
      if(!m)continue; if(r.media&&!matchMedia(r.media).matches)continue;
      for(const p of r.style){ if(!u.has(p))continue;
        const g=r.style.getPropertyValue(p), x=u.get(p);
        if(g.trim()===x.v.trim())continue;
        out.set(`${r.sel} { ${p}: ${g} }  vs 유틸 ${x.s} → ${x.v}`,(out.get(...[])||0)+1);}}
  }
  return {risks:[...out.keys()], dsRules:ds.length, utilRules:util.length};
};
const b=await chromium.launch(); const agg=new Set(); let meta;
for(const [vp,w,h] of VPS){const c=await b.newContext({viewport:{width:w,height:h}});const p=await c.newPage();
  for(const r of ROUTES){try{await p.goto(BASE+r,{waitUntil:"domcontentloaded",timeout:60000});
    await p.waitForLoadState("load").catch(()=>{});
    const x=await p.evaluate(IN); meta??=x; for(const k of x.risks) agg.add(`[${vp}] ${k}`);}catch(e){}}
  await c.close();}
await b.close();
console.log(`이동 대상 .ds-* 기본 규칙 ${meta?.dsRules}개 · utilities 규칙 ${meta?.utilRules}개\n`);
console.log(`레이어 이동 시 유틸리티에 질 지점: ${agg.size}종`);
for(const k of agg) console.log("  "+k);
