import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const BASE_URL = "https://ebookmaker.vercel.app";

const CHAPTERS = [
  {
    number: 1, title: "연애 타로의 골든 타임",
    sections: [
      { title: "질문이 구체적일수록 정답은 선명해진다", card: "RWS_Tarot_18_Moon.jpg", cardName: "달 (The Moon)" },
      { title: "상대방의 속마음을 묻기 전, 나에게 먼저 물어야 할 것들", card: "Cups01.jpg", cardName: "컵 에이스 (Ace of Cups)" },
      { title: "연애운 리딩에서 가장 많이 범하는 3가지 실수", card: "RWS_Tarot_08_Strength.jpg", cardName: "힘 (Strength)" },
    ],
  },
  {
    number: 2, title: "상황별 실전 리딩: 썸에서 연애까지",
    sections: [
      { title: "저 사람, 나한테 관심 있는 걸까? (호감 신호 포착)", card: "Cups02.jpg", cardName: "컵 2 (Two of Cups)" },
      { title: "고백하면 받아줄까? (최적의 타이밍 잡기)", card: "RWS_Tarot_00_Fool.jpg", cardName: "바보 (The Fool)" },
      { title: "우리 사이, 권태기일까 위기일까? (관계 정체기 극복)", card: "Cups04.jpg", cardName: "컵 4 (Four of Cups)" },
      { title: "이별 후 연락 올까? (재회운의 진실과 거짓)", card: "Cups06.jpg", cardName: "컵 6 (Six of Cups)" },
    ],
  },
  {
    number: 3, title: "키워드로 보는 타로 연애 궁합",
    sections: [
      { title: "MBTI보다 정확한 캐릭터별 연애 스타일 (코트 카드 활용)", card: "Cups12.jpg", cardName: "컵 나이트 (Knight of Cups)" },
      { title: "메이저 카드로 보는 우리 인연의 깊이", card: "TheLovers.jpg", cardName: "연인 (The Lovers)" },
      { title: "마이너 원소로 분석하는 스킨십과 애정 표현의 온도차", card: "RWS_Tarot_17_Star.jpg", cardName: "별 (The Star)" },
    ],
  },
  {
    number: 4, title: "연애 고민 해결사: 스프레드 비법",
    sections: [
      { title: "상대의 속마음과 겉마음을 동시에 읽는 3카드법", card: "RWS_Tarot_02_High_Priestess.jpg", cardName: "여사제 (High Priestess)" },
      { title: "갈등의 원인과 해결책을 찾는 양자택일 리딩", card: "Cups07.jpg", cardName: "컵 7 (Seven of Cups)" },
      { title: "7일간의 연애 기상도: 일주일 운세 보기", card: "RWS_Tarot_10_Wheel_of_Fortune.jpg", cardName: "운명의 수레바퀴 (Wheel of Fortune)" },
    ],
  },
  {
    number: 5, title: "타로가 알려주는 '나를 사랑하는 법'",
    sections: [
      { title: "연애 중 자존감이 떨어질 때 뽑는 힐링 카드", card: "RWS_Tarot_19_Sun.jpg", cardName: "태양 (The Sun)" },
      { title: "나쁜 인연을 끊어내는 용기, 탑(Tower)과 검(Swords)의 조언", card: "RWS_Tarot_16_Tower.jpg", cardName: "탑 (The Tower)" },
      { title: "다음 사랑을 위해 마음을 비우는 정화의 시간", card: "Cups08.jpg", cardName: "컵 8 (Eight of Cups)" },
    ],
  },
];

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--cream:#FAF6F1;--cream-mid:#F2EAE0;--rose:#B5566B;--rose-mid:#C97788;--rose-lt:#E8C2CC;--rose-pale:#F8EFF2;--rose-faint:#FDF7F8;--gold:#9C7040;--gold-lt:#EDE0C8;--dark:#1A110C;--mid:#5A3828;--light:#9A7060;--divider:#DDD0C4;--serif:'Noto Serif KR',Georgia,serif;--sans:'Noto Sans KR',sans-serif;--display:'Playfair Display','Noto Serif KR',serif;}
html,body{background:#C0B4A8;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.pg{width:148mm;min-height:210mm;background:var(--cream);margin:0 auto 16px;display:flex;flex-direction:column;font-family:var(--serif);page-break-after:always;}
@media print{html,body{background:none;}.pg{margin:0;box-shadow:none;}@page{size:A5;margin:0;}}
.pg-hd{display:flex;justify-content:space-between;align-items:center;padding:8px 18px 7px;border-bottom:0.5px solid var(--divider);flex-shrink:0;}
.pg-hd span{font-family:var(--sans);font-size:6.5px;color:var(--light);letter-spacing:0.3px;}
.pg-ft{display:flex;justify-content:space-between;align-items:center;padding:7px 18px 8px;border-top:0.5px solid var(--divider);flex-shrink:0;margin-top:auto;}
.pg-ft .pn{font-family:var(--display);font-size:10px;color:var(--light);}
.pg-ft .pt{font-family:var(--sans);font-size:6.5px;color:var(--rose-lt);letter-spacing:1.5px;text-transform:uppercase;}
.opener-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 26px;text-align:center;}
.op-label{font-family:var(--display);font-size:9px;color:var(--rose-mid);letter-spacing:5px;text-transform:uppercase;margin-bottom:6px;}
.op-num{font-family:var(--display);font-size:68px;font-weight:700;color:var(--rose-lt);line-height:1;margin-bottom:4px;}
.op-title{font-family:var(--display);font-size:20px;font-weight:700;color:var(--dark);line-height:1.3;margin-bottom:10px;}
.op-rule{width:44px;height:1.5px;background:var(--rose);margin:0 auto 14px;}
.op-desc{font-family:var(--serif);font-size:10.5px;color:var(--mid);font-style:italic;line-height:1.85;margin-bottom:18px;word-break:keep-all;}
.op-sections{width:100%;background:var(--rose-faint);border:1px solid var(--rose-lt);border-radius:5px;padding:13px 18px;text-align:left;}
.op-sections h4{font-family:var(--sans);font-size:7.5px;font-weight:600;color:var(--rose);letter-spacing:2px;text-transform:uppercase;margin-bottom:9px;}
.op-sections ul{list-style:none;display:flex;flex-direction:column;gap:6px;}
.op-sections li{font-family:var(--sans);font-size:11.5px;color:var(--mid);padding-left:13px;position:relative;line-height:1.55;}
.op-sections li::before{content:'›';position:absolute;left:0;color:var(--rose-mid);}
.pg-body{padding:14px 18px 10px;display:flex;flex-direction:column;gap:0;flex:1;}
.sec-badge{display:flex;align-items:center;gap:6px;margin-bottom:4px;}
.sec-badge .sn{font-family:var(--display);font-size:9px;font-weight:700;color:var(--rose-lt);letter-spacing:1px;}
.sec-badge .sl{font-family:var(--sans);font-size:6.5px;color:var(--rose);letter-spacing:2px;text-transform:uppercase;}
.sec-title{font-family:var(--display);font-size:17px;font-weight:700;color:var(--dark);line-height:1.25;letter-spacing:-0.3px;margin-bottom:3px;}
.sec-rule{width:28px;height:2px;background:var(--rose);margin-bottom:13px;flex-shrink:0;}
.card-callout{display:flex;gap:13px;background:var(--rose-faint);border:1px solid var(--rose-lt);border-radius:5px;padding:13px 14px;margin:11px 0;flex-shrink:0;}
.cc-img{flex-shrink:0;text-align:center;}
.cc-img img{width:56px;border-radius:3px;box-shadow:2px 4px 12px rgba(80,20,20,0.22);display:block;}
.cc-name{font-family:var(--sans);font-size:7px;color:var(--light);font-style:italic;margin-top:4px;line-height:1.4;text-align:center;}
.cc-body h4{font-family:var(--serif);font-size:12.5px;font-weight:600;color:var(--rose);margin-bottom:7px;}
.cc-body p{font-family:var(--sans);font-size:12px;color:var(--mid);line-height:2.0;word-break:keep-all;}
.cc-tagline{display:block;margin-top:8px;font-family:var(--serif);font-size:9.5px;font-style:italic;color:var(--rose-mid);}
.sub-h{font-family:var(--serif);font-size:13px;font-weight:600;color:var(--rose);margin:13px 0 7px;line-height:1.4;}
.body-p{font-family:var(--sans);font-size:12.5px;color:var(--dark);line-height:2.2;letter-spacing:0.05px;margin-bottom:9px;word-break:keep-all;}
.cmp-row{display:flex;gap:9px;margin:9px 0;flex-shrink:0;}
.bad-box{border-left:3px solid var(--rose-mid);background:#FDF4F6;border-radius:0 4px 4px 0;padding:10px 13px;flex:1;}
.good-box{border-left:3px solid var(--gold);background:var(--gold-lt);border-radius:0 4px 4px 0;padding:10px 13px;flex:1;}
.box-title{font-family:var(--serif);font-size:12px;font-weight:600;margin-bottom:7px;}
.bad-box .box-title{color:var(--dark);}.good-box .box-title{color:var(--gold);}
.bad-box ul,.good-box ul{list-style:none;display:flex;flex-direction:column;gap:5px;}
.bad-box li,.good-box li{font-family:var(--sans);font-size:12px;color:var(--mid);padding-left:11px;position:relative;line-height:1.75;word-break:keep-all;}
.bad-box li::before{content:'·';position:absolute;left:1px;color:var(--rose-mid);font-size:14px;line-height:1.25;}
.good-box li::before{content:'›';position:absolute;left:1px;color:var(--gold);font-size:12px;line-height:1.35;}
.data-table{width:100%;border-collapse:collapse;margin:9px 0;flex-shrink:0;}
.data-table th{background:var(--rose-pale);color:var(--rose);font-family:var(--serif);font-weight:600;padding:8px 10px;border:1px solid var(--rose-lt);text-align:center;font-size:11px;}
.data-table td{font-family:var(--sans);font-size:11px;color:var(--dark);padding:7px 10px;border:1px solid var(--divider);line-height:1.65;word-break:keep-all;vertical-align:top;}
.data-table tr:nth-child(even) td{background:var(--cream-mid);}
.quote-box{background:var(--rose);border-radius:5px;padding:12px 15px;margin:10px 0;flex-shrink:0;text-align:center;}
.quote-box p{font-family:var(--display);font-size:12.5px;font-style:italic;color:#fff;line-height:1.75;}
.tip-box{background:var(--gold-lt);border:1px solid #D0B080;border-radius:4px;padding:11px 14px;margin:10px 0;flex-shrink:0;}
.tip-title{font-family:var(--sans);font-size:8px;font-weight:600;color:var(--gold);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;}
.tip-box p{font-family:var(--sans);font-size:12.5px;color:#5C3A10;line-height:1.9;word-break:keep-all;}
.div-rule{height:0.5px;background:var(--divider);margin:10px 0 8px;flex-shrink:0;}
.summary-list{list-style:none;display:flex;flex-direction:column;gap:9px;margin:10px 0;}
.summary-list li{font-family:var(--sans);font-size:12.5px;color:var(--dark);padding-left:18px;position:relative;line-height:1.8;word-break:keep-all;}
.summary-list li::before{content:'✦';position:absolute;left:0;color:var(--rose);font-size:9px;line-height:1.8;}
.cover-top{background:var(--rose);padding:24px 0 18px;text-align:center;flex-shrink:0;}
.cover-vol-en{font-family:var(--display);font-size:8px;letter-spacing:5px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:5px;}
.cover-vol-kr{font-family:var(--serif);font-size:20px;font-weight:600;color:#fff;letter-spacing:5px;}
.cover-cards-row{display:flex;justify-content:center;align-items:flex-end;gap:10px;padding:26px 24px 18px;flex-shrink:0;}
.c-card{display:flex;flex-direction:column;align-items:center;gap:5px;}
.c-card img{border-radius:4px;box-shadow:4px 8px 22px rgba(60,10,10,0.28);display:block;}
.c-card .clbl{font-family:var(--display);font-size:6.5px;color:var(--light);letter-spacing:1px;text-transform:uppercase;}
.cover-title-block{text-align:center;padding:4px 36px 14px;flex-shrink:0;}
.cover-main-title{font-family:var(--display);font-size:36px;font-weight:700;color:var(--dark);letter-spacing:-1px;line-height:1.05;margin-bottom:10px;}
.cover-rule{width:44px;height:1.5px;background:var(--rose);margin:0 auto 11px;}
.cover-subtitle{font-family:var(--serif);font-size:12px;font-weight:300;color:var(--mid);font-style:italic;line-height:1.7;margin-bottom:4px;}
.cover-tagline{font-family:var(--sans);font-size:8.5px;color:var(--light);letter-spacing:1px;}
.cover-dots{display:flex;justify-content:center;gap:7px;padding:4px 0 12px;flex-shrink:0;}
.cover-dots span{width:6px;height:6px;border-radius:50%;background:var(--rose-lt);display:inline-block;}
.cover-dots .on{background:var(--rose);}
.cover-learn{margin:0 26px;background:var(--rose-faint);border:1px solid var(--rose-lt);border-radius:5px;padding:13px 18px 12px;flex-shrink:0;}
.cover-learn h4{font-family:var(--sans);font-size:7.5px;font-weight:600;color:var(--rose);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:9px;}
.cover-learn ul{list-style:none;display:flex;flex-direction:column;gap:5px;}
.cover-learn li{font-family:var(--sans);font-size:9.5px;color:var(--mid);padding-left:14px;position:relative;line-height:1.55;}
.cover-learn li::before{content:'＋';position:absolute;left:0;color:var(--rose-mid);font-size:9px;line-height:1.55;}
.cover-toc{margin:11px 26px 0;display:grid;grid-template-columns:repeat(5,1fr);gap:6px;}
.toc-cell{background:var(--cream-mid);border:1px solid var(--divider);border-radius:4px;padding:7px 5px;text-align:center;}
.toc-cell .tn{font-family:var(--display);font-size:13px;font-weight:700;color:var(--rose-lt);line-height:1;margin-bottom:3px;}
.toc-cell .tl{font-family:var(--sans);font-size:6.5px;color:var(--mid);line-height:1.4;word-break:keep-all;}
.cover-bottom{margin-top:auto;background:var(--rose);padding:11px 26px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
.cover-bottom-l{font-family:var(--display);font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.8);text-transform:uppercase;}
.cover-bottom-r{font-family:var(--sans);font-size:7.5px;color:rgba(255,255,255,0.6);}`;

function buildCoverHtml(): string {
  const cards = [
    { file: "Cups01.jpg", label: "Ace of Cups", w: 48, mb: 12, op: 0.82 },
    { file: "RWS_Tarot_00_Fool.jpg", label: "The Fool", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_18_Moon.jpg", label: "The Moon", w: 80, mb: 0, op: 1 },
    { file: "RWS_Tarot_17_Star.jpg", label: "The Star", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_08_Strength.jpg", label: "Strength", w: 48, mb: 12, op: 0.82 },
  ];
  return `<div class="pg"><div class="cover-top"><div class="cover-vol-en">Volume 01 · Tarot Love Guide</div><div class="cover-vol-kr">제 1 권</div></div><div class="cover-cards-row">${cards.map(c=>`<div class="c-card"><img src="${BASE_URL}/cards/${c.file}" style="width:${c.w}px;margin-bottom:${c.mb}px;opacity:${c.op};" alt="${c.label}"><div class="clbl">${c.label}</div></div>`).join("")}</div><div class="cover-title-block"><div class="cover-main-title">연애 프리패스</div><div class="cover-rule"></div><div class="cover-subtitle">타로로 꿰뚫는 상대의 속마음</div><div class="cover-tagline">연애의 모든 순간, 타로가 답합니다</div></div><div class="cover-dots"><span></span><span class="on"></span><span></span></div><div class="cover-learn"><h4>이 책에서 배울 것들</h4><ul><li>상대의 속마음을 꿰뚫는 실전 타로 리딩법</li><li>썸부터 이별까지, 상황별 맞춤 스프레드 기술</li><li>MBTI보다 정확한 코트 카드 연애 유형 분석</li><li>갈등·권태기·재회를 읽는 3카드 비법 스프레드</li><li>나를 사랑하게 만드는 힐링 리딩의 기술</li></ul></div><div class="cover-toc">${["골든 타임","실전 리딩","연애 궁합","스프레드","나를 사랑하는 법"].map((t,i)=>`<div class="toc-cell"><div class="tn">0${i+1}</div><div class="tl">${t}</div></div>`).join("")}</div><div class="cover-bottom"><div class="cover-bottom-l">Tarot Love Guide</div><div class="cover-bottom-r">연애 타로 완전 정복</div></div></div>`;
}

function buildOpenerHtml(chapterNum: number, chapterTitle: string, chapterDesc: string, sections: {title:string}[], pageNum: number): string {
  return `<div class="pg"><div class="pg-hd"><span>연애 프리패스 | 타로로 꿰뚫는 상대의 속마음</span><span>CHAPTER ${chapterNum}</span></div><div class="opener-body"><div class="op-label">CHAPTER</div><div class="op-num">0${chapterNum}</div><div class="op-title">${chapterTitle}</div><div class="op-rule"></div><div class="op-desc">${chapterDesc}</div><div class="op-sections"><h4>이번 챕터에서 배울 것들</h4><ul>${sections.map(s=>`<li>${s.title}</li>`).join("")}</ul></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Love Guide</div></div></div>`;
}

interface SectionData {
  title: string; cardFile: string; cardName: string;
  cardDesc: string; cardTagline: string;
  subheadings: { title: string; body: string }[];
  badExamples: string[]; goodExamples: string[];
  tableHeaders: string[]; tableRows: { col1: string; col2: string; col3: string }[];
  quote: string; tip: string; summary: string[];
}

function buildSectionHtml(chapterNum: number, chapterTitle: string, sec: SectionData, si: number, startPage: number): string {
  let html = "";
  let pg = startPage;
  const hd = `<div class="pg-hd"><span>연애 프리패스 | 타로로 꿰뚫는 상대의 속마음</span><span>CH ${chapterNum} · ${chapterTitle}</span></div>`;
  const badge = `<div class="sec-badge"><span class="sn">0${si+1}</span><span class="sl">Section</span></div><div class="sec-title">${sec.title}</div><div class="sec-rule"></div>`;

  html += `<div class="pg">${hd}<div class="pg-body">${badge}<div class="card-callout"><div class="cc-img"><img src="${BASE_URL}/cards/${sec.cardFile}" alt="${sec.cardName}"><div class="cc-name">${sec.cardName}</div></div><div class="cc-body"><h4>💡 ${sec.cardName}이 말하는 것</h4><p>${sec.cardDesc}</p><span class="cc-tagline">${sec.cardTagline}</span></div></div>${sec.subheadings.slice(0,2).map(sh=>`<div class="sub-h">${sh.title}</div><p class="body-p">${sh.body}</p>`).join("")}</div><div class="pg-ft"><div class="pn">${pg++}</div><div class="pt">Tarot Love Guide</div></div></div>`;

  html += `<div class="pg">${hd}<div class="pg-body">${badge}<div class="cmp-row"><div class="bad-box"><div class="box-title">✕ 이렇게 하면 안 돼요</div><ul>${sec.badExamples.map(e=>`<li>${e}</li>`).join("")}</ul></div><div class="good-box"><div class="box-title">✓ 이렇게 해보세요</div><ul>${sec.goodExamples.map(e=>`<li>${e}</li>`).join("")}</ul></div></div>${sec.subheadings[2]?`<div class="sub-h">${sec.subheadings[2].title}</div><p class="body-p">${sec.subheadings[2].body}</p>`:""}<div class="quote-box"><p>"${sec.quote}"</p></div><div class="tip-box"><div class="tip-title">Golden Tip</div><p>${sec.tip}</p></div></div><div class="pg-ft"><div class="pn">${pg++}</div><div class="pt">Tarot Love Guide</div></div></div>`;

  html += `<div class="pg"><div class="pg-hd"><span>연애 프리패스 | 타로로 꿰뚫는 상대의 속마음</span><span>CH ${chapterNum} · 실전 정리</span></div><div class="pg-body"><div class="sec-badge"><span class="sn">0${si+1}</span><span class="sl">실전 정리</span></div><div class="sec-title">${sec.title}</div><div class="sec-rule"></div><table class="data-table"><thead><tr>${sec.tableHeaders.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${sec.tableRows.map(r=>`<tr><td>${r.col1}</td><td>${r.col2}</td><td>${r.col3}</td></tr>`).join("")}</tbody></table><div class="div-rule"></div><div class="sub-h">🌹 이 섹션의 핵심</div><p class="body-p">${sec.subheadings[0]?.body??''}</p><div class="quote-box"><p>"${sec.quote}"</p></div></div><div class="pg-ft"><div class="pn">${pg++}</div><div class="pt">Tarot Love Guide</div></div></div>`;

  return html;
}

function buildSummaryHtml(chapterNum: number, summary: string[], quote: string, isLastChapter: boolean, pageNum: number): string {
  return `<div class="pg"><div class="pg-hd"><span>연애 프리패스 | 타로로 꿰뚫는 상대의 속마음</span><span>CH ${chapterNum} · 핵심 요약</span></div><div class="pg-body"><div class="sec-badge"><span class="sn">✦</span><span class="sl">Summary</span></div><div class="sec-title">CHAPTER ${chapterNum} 핵심 요약</div><div class="sec-rule"></div><div class="quote-box"><p>"${quote}"</p></div><ul class="summary-list">${summary.map(s=>`<li>${s}</li>`).join("")}</ul><div class="div-rule"></div><div class="tip-box"><div class="tip-title">${isLastChapter?"마치며":"다음 챕터 미리보기"}</div><p>${isLastChapter?"이 책을 통해 타로는 단순한 점술이 아닌, 나 자신을 이해하는 도구임을 깨달으셨기를 바랍니다. 오늘부터 카드와 함께 당신만의 연애 이야기를 써내려가세요.":`CHAPTER ${chapterNum+1}에서는 더 깊은 실전 리딩 기술을 배웁니다. 지금까지 배운 내용을 바탕으로 실제 상황에 바로 적용할 수 있는 스프레드와 해석법을 함께 알아볼게요.`}</p></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Love Guide</div></div></div>`;
}

function buildOpenerPrompt(chapterNum: number, chapterTitle: string, sections: {title:string}[]): string {
  return `타로 전자책 작가입니다. 아래 챕터 오프너 설명을 JSON으로만 작성하세요.
챕터 ${chapterNum}: ${chapterTitle}
섹션: ${sections.map(s=>s.title).join(", ")}
{"chapterDesc":"이 챕터를 읽어야 하는 이유를 흥미롭고 공감되게 3~4문장으로."}
JSON만 출력.`;
}

function buildSectionPrompt(chapterNum: number, chapterTitle: string, section: {title:string;card:string;cardName:string}, si: number): string {
  return `타로 전자책 전문 작가입니다. 섹션 1개의 내용을 JSON으로만 작성하세요. JSON 외 텍스트 절대 금지.

챕터 ${chapterNum}: ${chapterTitle}
섹션 ${si+1}: ${section.title}
카드: ${section.cardName} (${section.card})

{
  "title": "${section.title}",
  "cardFile": "${section.card}",
  "cardName": "${section.cardName}",
  "cardDesc": "카드와 섹션 주제 연결 2~3문장. 핵심 상징만 간결하게.",
  "cardTagline": "카드 핵심 메시지 한 줄",
  "subheadings": [
    {"title": "🔮 소제목1", "body": "3~4문장. 구체적 상황과 공감 예시. 반드시 완전한 문장으로 끝낼 것."},
    {"title": "💡 소제목2", "body": "3~4문장. 실전 적용법 포함. 반드시 완전한 문장으로 끝낼 것."},
    {"title": "💬 소제목3", "body": "3~4문장. 실천 가능한 내용. 반드시 완전한 문장으로 끝낼 것."}
  ],
  "badExamples": ["나쁜 예시1 — 상황과 이유","나쁜 예시2 — 상황과 이유","나쁜 예시3 — 상황과 이유","나쁜 예시4 — 상황과 이유"],
  "goodExamples": ["좋은 예시1 — 상황과 이유","좋은 예시2 — 상황과 이유","좋은 예시3 — 상황과 이유","좋은 예시4 — 상황과 이유"],
  "tableHeaders": ["상황","타로 해석","실전 조언"],
  "tableRows": [
    {"col1":"상황1","col2":"해석1","col3":"조언1"},
    {"col1":"상황2","col2":"해석2","col3":"조언2"},
    {"col1":"상황3","col2":"해석3","col3":"조언3"},
    {"col1":"상황4","col2":"해석4","col3":"조언4"},
    {"col1":"상황5","col2":"해석5","col3":"조언5"}
  ],
  "quote": "독자 마음에 남는 핵심 한 문장",
  "tip": "2~3문장. 실천 가능한 조언. 반드시 완전한 문장으로 끝낼 것.",
  "summary": ["핵심 요약1","핵심 요약2","핵심 요약3","핵심 요약4"]
}
JSON만 출력.`;
}

export async function POST(req: NextRequest) {
  try {
    const { chapterIndex, sectionIndex, startPage = 1 } = await req.json();

    if (chapterIndex === undefined || chapterIndex < 0 || chapterIndex >= CHAPTERS.length) {
      return NextResponse.json({ error: "올바른 챕터 번호를 입력해주세요." }, { status: 400 });
    }

    const chapter = CHAPTERS[chapterIndex];
    const isLastChapter = chapterIndex === CHAPTERS.length - 1;

    if (sectionIndex === -1) {
      const msg = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 500,
        messages: [{ role: "user", content: buildOpenerPrompt(chapter.number, chapter.title, chapter.sections) }],
      });
      const raw = msg.content[0];
      if (raw.type !== "text") throw new Error("응답 없음");
      let jsonStr = raw.text.trim().replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
      const parsed = JSON.parse(jsonStr);
      const coverHtml = chapterIndex === 0 ? buildCoverHtml() : "";
      const openerHtml = buildOpenerHtml(chapter.number, chapter.title, parsed.chapterDesc, chapter.sections, startPage);
      return NextResponse.json({
        html: coverHtml + openerHtml,
        css: chapterIndex === 0 ? CSS : "",
        chapterIndex, sectionIndex: -1,
        totalSections: chapter.sections.length,
        nextStartPage: startPage + 1,
      });
    }

    const section = chapter.sections[sectionIndex];
    if (!section) return NextResponse.json({ error: "섹션을 찾을 수 없습니다." }, { status: 400 });

    const msg = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 16000,
      messages: [{ role: "user", content: buildSectionPrompt(chapter.number, chapter.title, section, sectionIndex) }],
    });
    const raw = msg.content[0];
    if (raw.type !== "text") throw new Error("응답 없음");
    let jsonStr = raw.text.trim().replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();

    let secData: SectionData;
    try { secData = JSON.parse(jsonStr); }
    catch { return NextResponse.json({ error: "JSON 파싱 실패: " + jsonStr.substring(0,200) }, { status: 500 }); }

    const isLastSection = sectionIndex === chapter.sections.length - 1;
    const sectionHtml = buildSectionHtml(chapter.number, chapter.title, secData, sectionIndex, startPage);
    const summaryHtml = isLastSection ? buildSummaryHtml(chapter.number, secData.summary, secData.quote, isLastChapter, startPage + 3) : "";

    return NextResponse.json({
      html: sectionHtml + summaryHtml,
      chapterIndex, sectionIndex, isLastSection,
      nextStartPage: startPage + 3 + (isLastSection ? 1 : 0),
    });

  } catch (error) {
    console.error("오류:", error);
    return NextResponse.json({ error: "생성 중 오류 발생" }, { status: 500 });
  }
}
