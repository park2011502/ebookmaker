import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const BASE_URL = "https://ebookmaker.vercel.app";

// ── 메이저 아르카나 22장 ──────────────────────────────
const MAJOR_CARDS = [
  { file: "RWS_Tarot_00_Fool.jpg", name: "바보 (The Fool)", num: "0" },
  { file: "RWS_Tarot_01_Magician.jpg", name: "마법사 (The Magician)", num: "I" },
  { file: "RWS_Tarot_02_High_Priestess.jpg", name: "여사제 (The High Priestess)", num: "II" },
  { file: "RWS_Tarot_03_Empress.jpg", name: "여황제 (The Empress)", num: "III" },
  { file: "RWS_Tarot_04_Emperor.jpg", name: "황제 (The Emperor)", num: "IV" },
  { file: "RWS_Tarot_05_Hierophant.jpg", name: "교황 (The Hierophant)", num: "V" },
  { file: "TheLovers.jpg", name: "연인 (The Lovers)", num: "VI" },
  { file: "RWS_Tarot_07_Chariot.jpg", name: "전차 (The Chariot)", num: "VII" },
  { file: "RWS_Tarot_08_Strength.jpg", name: "힘 (Strength)", num: "VIII" },
  { file: "RWS_Tarot_09_Hermit.jpg", name: "은둔자 (The Hermit)", num: "IX" },
  { file: "RWS_Tarot_10_Wheel_of_Fortune.jpg", name: "운명의 수레바퀴 (Wheel of Fortune)", num: "X" },
  { file: "RWS_Tarot_11_Justice.jpg", name: "정의 (Justice)", num: "XI" },
  { file: "RWS_Tarot_12_Hanged_Man.jpg", name: "매달린 사람 (The Hanged Man)", num: "XII" },
  { file: "RWS_Tarot_13_Death.jpg", name: "죽음 (Death)", num: "XIII" },
  { file: "RWS_Tarot_14_Temperance.jpg", name: "절제 (Temperance)", num: "XIV" },
  { file: "RWS_Tarot_15_Devil.jpg", name: "악마 (The Devil)", num: "XV" },
  { file: "RWS_Tarot_16_Tower.jpg", name: "탑 (The Tower)", num: "XVI" },
  { file: "RWS_Tarot_17_Star.jpg", name: "별 (The Star)", num: "XVII" },
  { file: "RWS_Tarot_18_Moon.jpg", name: "달 (The Moon)", num: "XVIII" },
  { file: "RWS_Tarot_19_Sun.jpg", name: "태양 (The Sun)", num: "XIX" },
  { file: "RWS_Tarot_20_Judgement.jpg", name: "심판 (Judgement)", num: "XX" },
  { file: "RWS_Tarot_21_World.jpg", name: "세계 (The World)", num: "XXI" },
];

// ── 마이너 아르카나 56장 (원소별) ────────────────────
const MINOR_SUITS = [
  {
    suit: "컵 (Cups)", subtitle: "감정의 언어",
    cards: [
      { file: "Cups01.jpg", name: "컵 에이스" }, { file: "Cups02.jpg", name: "컵 2" },
      { file: "Cups03.jpg", name: "컵 3" }, { file: "Cups04.jpg", name: "컵 4" },
      { file: "Cups05.jpg", name: "컵 5" }, { file: "Cups06.jpg", name: "컵 6" },
      { file: "Cups07.jpg", name: "컵 7" }, { file: "Cups08.jpg", name: "컵 8" },
      { file: "Cups09.jpg", name: "컵 9" }, { file: "Cups10.jpg", name: "컵 10" },
      { file: "Cups11.jpg", name: "컵 페이지" }, { file: "Cups12.jpg", name: "컵 나이트" },
      { file: "Cups13.jpg", name: "컵 퀸" }, { file: "Cups14.jpg", name: "컵 킹" },
    ],
  },
  {
    suit: "완드 (Wands)", subtitle: "불꽃의 의지",
    cards: [
      { file: "Wands01.jpg", name: "완드 에이스" }, { file: "Wands02.jpg", name: "완드 2" },
      { file: "Wands03.jpg", name: "완드 3" }, { file: "Wands04.jpg", name: "완드 4" },
      { file: "Wands05.jpg", name: "완드 5" }, { file: "Wands06.jpg", name: "완드 6" },
      { file: "Wands07.jpg", name: "완드 7" }, { file: "Wands08.jpg", name: "완드 8" },
      { file: "Tarot_Nine_of_Wands.jpg", name: "완드 9" }, { file: "Wands10.jpg", name: "완드 10" },
      { file: "Wands11.jpg", name: "완드 페이지" }, { file: "Wands12.jpg", name: "완드 나이트" },
      { file: "Wands13.jpg", name: "완드 퀸" }, { file: "Wands14.jpg", name: "완드 킹" },
    ],
  },
  {
    suit: "검 (Swords)", subtitle: "날카로운 진실",
    cards: [
      { file: "Swords01.jpg", name: "검 에이스" }, { file: "Swords02.jpg", name: "검 2" },
      { file: "Swords03.jpg", name: "검 3" }, { file: "Swords04.jpg", name: "검 4" },
      { file: "Swords05.jpg", name: "검 5" }, { file: "Swords06.jpg", name: "검 6" },
      { file: "Swords07.jpg", name: "검 7" }, { file: "Swords08.jpg", name: "검 8" },
      { file: "Swords09.jpg", name: "검 9" }, { file: "Swords10.jpg", name: "검 10" },
      { file: "Swords11.jpg", name: "검 페이지" }, { file: "Swords12.jpg", name: "검 나이트" },
      { file: "Swords13.jpg", name: "검 퀸" }, { file: "Swords14.jpg", name: "검 킹" },
    ],
  },
  {
    suit: "펜타클 (Pentacles)", subtitle: "땅의 결실",
    cards: [
      { file: "Pents01.jpg", name: "펜타클 에이스" }, { file: "Pents02.jpg", name: "펜타클 2" },
      { file: "Pents03.jpg", name: "펜타클 3" }, { file: "Pents04.jpg", name: "펜타클 4" },
      { file: "Pents05.jpg", name: "펜타클 5" }, { file: "Pents06.jpg", name: "펜타클 6" },
      { file: "Pents07.jpg", name: "펜타클 7" }, { file: "Pents08.jpg", name: "펜타클 8" },
      { file: "Pents09.jpg", name: "펜타클 9" }, { file: "Pents10.jpg", name: "펜타클 10" },
      { file: "Pents11.jpg", name: "펜타클 페이지" }, { file: "Pents12.jpg", name: "펜타클 나이트" },
      { file: "Pents13.jpg", name: "펜타클 퀸" }, { file: "Pents14.jpg", name: "펜타클 킹" },
    ],
  },
];

// ── CSS (퍼플/딥바이올렛 톤) ────────────────────────
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --cream:#F8F5FF;--cream-mid:#EDE8F8;
  --purple:#4A1B8B;--purple-mid:#6B3BAD;--purple-lt:#B094E0;--purple-pale:#F0EBF9;--purple-faint:#F8F5FF;
  --violet:#7B3FC4;--violet-lt:#C9B0EE;
  --dark:#1A0A2E;--mid:#3D1F6B;--light:#7B5BAD;--divider:#D4C8F0;
  --serif:'Noto Serif KR',Georgia,serif;--sans:'Noto Sans KR',sans-serif;--display:'Playfair Display','Noto Serif KR',serif;
}
html,body{background:#3D1F6B;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.pg{width:148mm;min-height:210mm;background:var(--cream);margin:0 auto 16px;display:flex;flex-direction:column;font-family:var(--serif);page-break-after:always;page-break-inside:avoid;}
@media print{html,body{background:none;}.pg{margin:0;box-shadow:none;}@page{size:A5;margin:0;}}
.pg-hd{display:flex;justify-content:space-between;align-items:center;padding:8px 18px 7px;border-bottom:0.5px solid var(--divider);flex-shrink:0;}
.pg-hd span{font-family:var(--sans);font-size:6.5px;color:var(--light);letter-spacing:0.3px;}
.pg-ft{display:flex;justify-content:space-between;align-items:center;padding:7px 18px 8px;border-top:0.5px solid var(--divider);flex-shrink:0;margin-top:auto;}
.pg-ft .pn{font-family:var(--display);font-size:10px;color:var(--light);}
.pg-ft .pt{font-family:var(--sans);font-size:6.5px;color:var(--purple-lt);letter-spacing:1.5px;text-transform:uppercase;}
.pg-body{padding:10px 17px 20px;display:flex;flex-direction:column;gap:0;flex:1;}

/* 표지 */
.cover-top{background:var(--purple);padding:24px 0 18px;text-align:center;flex-shrink:0;}
.cover-vol-en{font-family:var(--display);font-size:8px;letter-spacing:5px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:5px;}
.cover-vol-kr{font-family:var(--serif);font-size:20px;font-weight:600;color:#fff;letter-spacing:5px;}
.cover-cards-row{display:flex;justify-content:center;align-items:flex-end;gap:10px;padding:26px 24px 18px;flex-shrink:0;}
.c-card{display:flex;flex-direction:column;align-items:center;gap:5px;}
.c-card img{border-radius:4px;box-shadow:4px 8px 22px rgba(30,0,60,0.28);display:block;}
.c-card .clbl{font-family:var(--display);font-size:6.5px;color:var(--light);letter-spacing:1px;text-transform:uppercase;}
.cover-title-block{text-align:center;padding:4px 36px 14px;flex-shrink:0;}
.cover-main-title{font-family:var(--display);font-size:30px;font-weight:700;color:var(--dark);letter-spacing:-1px;line-height:1.1;margin-bottom:10px;}
.cover-rule{width:44px;height:1.5px;background:var(--purple);margin:0 auto 11px;}
.cover-subtitle{font-family:var(--serif);font-size:11px;font-weight:300;color:var(--mid);font-style:italic;line-height:1.7;margin-bottom:4px;}
.cover-tagline{font-family:var(--sans);font-size:8.5px;color:var(--light);letter-spacing:1px;}
.cover-dots{display:flex;justify-content:center;gap:7px;padding:4px 0 12px;flex-shrink:0;}
.cover-dots span{width:6px;height:6px;border-radius:50%;background:var(--purple-lt);display:inline-block;}
.cover-dots .on{background:var(--purple);}
.cover-learn{margin:0 26px;background:var(--purple-faint);border:1px solid var(--purple-lt);border-radius:5px;padding:13px 18px 12px;flex-shrink:0;}
.cover-learn h4{font-family:var(--sans);font-size:7.5px;font-weight:600;color:var(--purple);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:9px;}
.cover-learn ul{list-style:none;display:flex;flex-direction:column;gap:5px;}
.cover-learn li{font-family:var(--sans);font-size:9.5px;color:var(--mid);padding-left:14px;position:relative;line-height:1.55;}
.cover-learn li::before{content:'＋';position:absolute;left:0;color:var(--purple-mid);font-size:9px;line-height:1.55;}
.cover-toc{margin:11px 26px 0;display:grid;grid-template-columns:repeat(5,1fr);gap:6px;}
.toc-cell{background:var(--cream-mid);border:1px solid var(--divider);border-radius:4px;padding:7px 5px;text-align:center;}
.toc-cell .tn{font-family:var(--display);font-size:13px;font-weight:700;color:var(--purple-lt);line-height:1;margin-bottom:3px;}
.toc-cell .tl{font-family:var(--sans);font-size:6.5px;color:var(--mid);line-height:1.4;word-break:keep-all;}
.cover-bottom{margin-top:auto;background:var(--purple);padding:11px 26px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
.cover-bottom-l{font-family:var(--display);font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.8);text-transform:uppercase;}
.cover-bottom-r{font-family:var(--sans);font-size:7.5px;color:rgba(255,255,255,0.6);}

/* 챕터 오프너 */
.opener-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 26px;text-align:center;}
.op-label{font-family:var(--display);font-size:9px;color:var(--purple-mid);letter-spacing:5px;text-transform:uppercase;margin-bottom:6px;}
.op-num{font-family:var(--display);font-size:68px;font-weight:700;color:var(--purple-lt);line-height:1;margin-bottom:4px;}
.op-title{font-family:var(--display);font-size:18px;font-weight:700;color:var(--dark);line-height:1.3;margin-bottom:10px;}
.op-rule{width:44px;height:1.5px;background:var(--purple);margin:0 auto 14px;}
.op-desc{font-family:var(--serif);font-size:11px;color:var(--mid);font-style:italic;line-height:1.9;margin-bottom:18px;word-break:keep-all;}
.op-sections{width:100%;background:var(--purple-faint);border:1px solid var(--purple-lt);border-radius:5px;padding:13px 18px;text-align:left;}
.op-sections h4{font-family:var(--sans);font-size:8px;font-weight:600;color:var(--purple);letter-spacing:2px;text-transform:uppercase;margin-bottom:9px;}
.op-sections ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:4px;}
.op-sections li{font-family:var(--sans);font-size:9px;color:var(--mid);padding-left:10px;position:relative;line-height:1.5;}
.op-sections li::before{content:'›';position:absolute;left:0;color:var(--purple-mid);}

/* 카드 페이지 */
.card-pg-header{display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-shrink:0;}
.card-pg-num{font-family:var(--display);font-size:9px;font-weight:700;color:var(--purple-lt);letter-spacing:1px;}
.card-pg-suit{font-family:var(--sans);font-size:6.5px;color:var(--purple);letter-spacing:2px;text-transform:uppercase;}
.card-pg-title{font-family:var(--display);font-size:22px;font-weight:700;color:var(--dark);line-height:1.2;margin-bottom:2px;}
.card-pg-subtitle{font-family:var(--serif);font-size:9px;font-style:italic;color:var(--purple-mid);margin-bottom:8px;}
.card-pg-rule{width:28px;height:2px;background:var(--purple);margin-bottom:12px;flex-shrink:0;}
.card-main{display:flex;gap:16px;margin-bottom:12px;flex-shrink:0;}
.card-img-wrap{flex-shrink:0;text-align:center;}
.card-img-wrap img{width:80px;border-radius:5px;box-shadow:3px 6px 18px rgba(30,0,60,0.28);display:block;}
.card-img-wrap .card-roman{font-family:var(--display);font-size:9px;color:var(--light);text-align:center;margin-top:5px;font-style:italic;letter-spacing:1px;}
.card-story{flex:1;}
.card-story-label{font-family:var(--sans);font-size:7px;font-weight:600;color:var(--purple);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;}
.card-story-text{font-family:var(--serif);font-size:11.5px;color:var(--dark);line-height:2.0;word-break:keep-all;}
.card-keywords{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 8px;flex-shrink:0;}
.kw-tag{background:var(--purple);color:#fff;font-family:var(--sans);font-size:9px;padding:3px 10px;border-radius:20px;letter-spacing:0.5px;}
.card-divider{height:0.5px;background:var(--divider);margin:8px 0;flex-shrink:0;}
.card-directions{display:flex;gap:10px;flex-shrink:0;}
.dir-box{flex:1;background:var(--purple-pale);border-radius:5px;padding:10px 12px;}
.dir-label{font-family:var(--sans);font-size:8px;font-weight:600;color:var(--purple);letter-spacing:1px;margin-bottom:6px;}
.dir-text{font-family:var(--sans);font-size:10.5px;color:var(--mid);line-height:1.75;word-break:keep-all;}
.card-when{background:var(--purple-faint);border-left:3px solid var(--purple);border-radius:0 4px 4px 0;padding:9px 12px;margin-top:8px;flex-shrink:0;}
.when-label{font-family:var(--sans);font-size:8px;font-weight:600;color:var(--purple);letter-spacing:1px;margin-bottom:5px;}
.when-text{font-family:var(--sans);font-size:11px;color:var(--mid);line-height:1.75;word-break:keep-all;}
.card-quote{background:var(--purple);border-radius:5px;padding:10px 14px;margin-top:10px;flex-shrink:0;text-align:center;}
.card-quote p{font-family:var(--display);font-size:11px;font-style:italic;color:#fff;line-height:1.7;}

/* 원소 오프너 */
.suit-opener{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 26px;text-align:center;}
.suit-icon{font-size:48px;margin-bottom:10px;}
.suit-name{font-family:var(--display);font-size:24px;font-weight:700;color:var(--dark);margin-bottom:4px;}
.suit-sub{font-family:var(--serif);font-size:13px;font-style:italic;color:var(--purple-mid);margin-bottom:12px;}
.suit-rule{width:44px;height:1.5px;background:var(--purple);margin:0 auto 14px;}
.suit-desc{font-family:var(--serif);font-size:11.5px;color:var(--mid);line-height:2.0;word-break:keep-all;}`;

// ── trimSentences ─────────────────────────────────────
function trimSentences(text: string, max: number): string {
  if (!text) return "";
  const sentences = text.match(/[^。.!?！？]+[。.!?！？]+/g) || [text];
  return sentences.slice(0, max).join("").trim();
}

// ── 표지 HTML ─────────────────────────────────────────
function buildCoverHtml(): string {
  const cards = [
    { file: "RWS_Tarot_00_Fool.jpg", label: "The Fool", w: 48, mb: 12, op: 0.82 },
    { file: "RWS_Tarot_09_Hermit.jpg", label: "The Hermit", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_21_World.jpg", label: "The World", w: 80, mb: 0, op: 1 },
    { file: "RWS_Tarot_17_Star.jpg", label: "The Star", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_18_Moon.jpg", label: "The Moon", w: 48, mb: 12, op: 0.82 },
  ];
  return `<div class="pg"><div class="cover-top"><div class="cover-vol-en">Special Edition · Tarot Card Guide</div><div class="cover-vol-kr">부 록</div></div><div class="cover-cards-row">${cards.map(c=>`<div class="c-card"><img src="${BASE_URL}/cards/${c.file}" style="width:${c.w}px;margin-bottom:${c.mb}px;opacity:${c.op};" alt="${c.label}"><div class="clbl">${c.label}</div></div>`).join("")}</div><div class="cover-title-block"><div class="cover-main-title">3초만에 외워지는<br>마법의 카드백서</div><div class="cover-rule"></div><div class="cover-subtitle">바보의 여정으로 읽는 타로 78장 완전 해설</div><div class="cover-tagline">부록 · 이 책 한 권으로 타로카드 78장 완전 정복</div></div><div class="cover-dots"><span></span><span class="on"></span><span></span></div><div class="cover-learn"><h4>이 책에서 배울 것들</h4><ul><li>메이저 아르카나 22장 — 바보의 여정으로 이어지는 이야기체 해설</li><li>마이너 아르카나 56장 — 컵·완드·검·펜타클 원소별 완전 정복</li><li>각 카드의 핵심 키워드 + 정방향·역방향 한눈에</li><li>읽기만 해도 저절로 외워지는 스토리텔링 방식</li><li>78장 전부 수록 — 리딩 중 바로 찾아보는 완벽 레퍼런스</li></ul></div><div class="cover-toc">${["메이저","컵","완드","검","펜타클"].map((t,i)=>`<div class="toc-cell"><div class="tn">0${i+1}</div><div class="tl">${t}</div></div>`).join("")}</div><div class="cover-bottom"><div class="cover-bottom-l">Tarot Card Guide</div><div class="cover-bottom-r">부록 · 타로카드 78장 완전 정복</div></div></div>`;
}

// ── 챕터 오프너 HTML ──────────────────────────────────
function buildChapterOpenerHtml(chapterNum: number, title: string, desc: string, items: string[], pageNum: number): string {
  return `<div class="pg"><div class="pg-hd"><span>마법의 카드백서 | 바보의 여정으로 읽는 타로 78장</span><span>CHAPTER 0${chapterNum}</span></div><div class="opener-body"><div class="op-label">CHAPTER</div><div class="op-num">0${chapterNum}</div><div class="op-title">${title}</div><div class="op-rule"></div><div class="op-desc">${desc}</div><div class="op-sections"><h4>이번 챕터 카드</h4><ul>${items.map(s=>`<li>${s}</li>`).join("")}</ul></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Card Guide</div></div></div>`;
}

// ── 원소 오프너 HTML ──────────────────────────────────
function buildSuitOpenerHtml(chapterNum: number, suit: string, subtitle: string, desc: string, icon: string, pageNum: number): string {
  return `<div class="pg"><div class="pg-hd"><span>마법의 카드백서 | 바보의 여정으로 읽는 타로 78장</span><span>CHAPTER 0${chapterNum} · ${suit}</span></div><div class="pg-body"><div class="suit-opener"><div class="suit-icon">${icon}</div><div class="suit-name">${suit}</div><div class="suit-sub">${subtitle}</div><div class="suit-rule"></div><div class="suit-desc">${desc}</div></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Card Guide</div></div></div>`;
}

// ── 카드 페이지 HTML ──────────────────────────────────
interface CardData {
  story: string;
  keywords: string[];
  upright: string;
  reversed: string;
  quote: string;
  when: string;
}

function buildCardPageHtml(
  file: string, name: string, num: string,
  suitLabel: string,
  data: CardData,
  pageNum: number
): string {
  const safeName = name.replace(/\.+$/, "").replace(/&/g, "&amp;");
  const keywords = data.keywords.slice(0, 3).map(k => `<span class="kw-tag">${k}</span>`).join("");
  return `<div class="pg"><div class="pg-hd"><span>마법의 카드백서 | 바보의 여정으로 읽는 타로 78장</span><span>${suitLabel}</span></div><div class="pg-body"><div class="card-pg-header"><span class="card-pg-num">${num}</span><span class="card-pg-suit">${suitLabel}</span></div><div class="card-pg-title">${safeName}</div><div class="card-pg-rule"></div><div class="card-main"><div class="card-img-wrap"><img src="${BASE_URL}/cards/${file}" alt="${safeName}"><div class="card-roman">${num}</div></div><div class="card-story"><div class="card-story-label">✨ 카드 이야기</div><div class="card-story-text">${trimSentences(data.story, 4)}</div></div></div><div class="card-keywords">${keywords}</div><div class="card-divider"></div><div class="card-directions"><div class="dir-box"><div class="dir-label">☀️ 정방향</div><div class="dir-text">${trimSentences(data.upright, 2)}</div></div><div class="dir-box"><div class="dir-label">🌙 역방향</div><div class="dir-text">${trimSentences(data.reversed, 2)}</div></div></div><div class="card-when"><div class="when-label">💬 이 카드가 나왔을 때</div><div class="when-text">${trimSentences(data.when, 2)}</div></div><div class="card-quote"><p>"${data.quote}"</p></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Card Guide</div></div></div>`;
}

// ── 메이저 카드 프롬프트 ──────────────────────────────
function buildMajorCardPrompt(card: { file: string; name: string; num: string }, prevCard?: string): string {
  return `타로 전자책 작가입니다. 아래 메이저 아르카나 카드의 해설을 JSON으로만 작성하세요. JSON 외 텍스트 절대 금지.

카드: ${card.name} (${card.num}번)
${prevCard ? `이전 카드: ${prevCard} — 이야기가 자연스럽게 이어지도록 작성하세요.` : "이 카드가 바보의 여정의 출발점입니다."}

중요 규칙:
- story는 반드시 이야기체(~했습니다, ~였어요 등 구어체)로 작성할 것.
- 바보라는 청년이 여정을 떠나는 이야기처럼 각 카드가 하나의 챕터가 되어 이어지게 쓸 것.
- 모든 문장은 반드시 마침표로 완전하게 끝낼 것.
- 내용이 풍부하고 읽으면 카드가 저절로 외워질 만큼 생생하게 작성할 것.

{
  "story": "이 카드의 핵심 의미를 이야기체로 5~6문장. 바보의 여정 맥락에서 이 카드가 상징하는 인생의 단계나 교훈을 생생하게. 반드시 마침표로 끝낼 것.",
  "keywords": ["핵심키워드1", "핵심키워드2", "핵심키워드3"],
  "upright": "정방향 의미 2~3문장. 구체적이고 실용적으로. 반드시 마침표로 끝낼 것.",
  "reversed": "역방향 의미 2~3문장. 구체적이고 실용적으로. 반드시 마침표로 끝낼 것.",
  "quote": "이 카드의 본질을 담은 인상적인 한 문장.",
  "when": "연애·금전·직업 등 실제 리딩에서 이 카드가 나왔을 때 어떤 메시지를 전하는지 2문장. 반드시 마침표로 끝낼 것."
}
JSON만 출력.`;
}

// ── 마이너 카드 프롬프트 ──────────────────────────────
function buildMinorCardPrompt(card: { file: string; name: string }, suit: string, subtitle: string): string {
  return `타로 전자책 작가입니다. 아래 마이너 아르카나 카드의 해설을 JSON으로만 작성하세요. JSON 외 텍스트 절대 금지.

카드: ${card.name}
원소: ${suit} (${subtitle})

중요 규칙:
- story는 반드시 이야기체(~했습니다, ~였어요 등 구어체)로 작성할 것.
- ${suit} 원소의 특성(${subtitle})이 잘 드러나도록 쓸 것.
- 모든 문장은 반드시 마침표로 완전하게 끝낼 것.
- 읽으면 카드가 저절로 외워질 만큼 생생하고 풍부하게 작성할 것.

{
  "story": "이 카드의 핵심 의미를 이야기체로 5~6문장. ${suit} 원소의 에너지와 이 카드 번호가 상징하는 단계를 생생하게. 반드시 마침표로 끝낼 것.",
  "keywords": ["핵심키워드1", "핵심키워드2", "핵심키워드3"],
  "upright": "정방향 의미 2~3문장. 구체적이고 실용적으로. 반드시 마침표로 끝낼 것.",
  "reversed": "역방향 의미 2~3문장. 구체적이고 실용적으로. 반드시 마침표로 끝낼 것.",
  "quote": "이 카드의 본질을 담은 인상적인 한 문장.",
  "when": "연애·금전·직업 등 실제 리딩에서 이 카드가 나왔을 때 어떤 메시지를 전하는지 2문장. 반드시 마침표로 끝낼 것."
}
JSON만 출력.`;
}

// ── API Route ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { chapterIndex, cardIndex, startPage = 1 } = await req.json();

    // chapterIndex 0 = 표지 + 메이저 오프너
    // chapterIndex 1 = 메이저 아르카나 (cardIndex 0~21)
    // chapterIndex 2~5 = 마이너 4개 원소 (cardIndex -1=오프너, 0~13=카드)

    // ── 표지 + 메이저 오프너 ──
    if (chapterIndex === 0) {
      const coverHtml = buildCoverHtml();
      const openerHtml = buildChapterOpenerHtml(
        1,
        "바보의 여정<br>메이저 아르카나 22장",
        "타로의 심장부, 메이저 아르카나 22장입니다. 바보(0번)라는 청년이 길을 나서며 시작된 여정은 세계(21번) 카드에서 완성됩니다. 각 카드는 인생의 한 단계를 상징하며, 이야기처럼 이어집니다.",
        MAJOR_CARDS.map(c => c.name),
        startPage
      );
      return NextResponse.json({
        html: coverHtml + openerHtml,
        css: CSS,
        nextStartPage: startPage + 1,
      });
    }

    // ── 메이저 카드 1장 ──
    if (chapterIndex === 1) {
      const card = MAJOR_CARDS[cardIndex];
      const prevCard = cardIndex > 0 ? MAJOR_CARDS[cardIndex - 1].name : undefined;
      const msg = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 2000,
        messages: [{ role: "user", content: buildMajorCardPrompt(card, prevCard) }],
      });
      const raw = msg.content[0];
      if (raw.type !== "text") throw new Error("응답 없음");
      let jsonStr = raw.text.trim().replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
      const data: CardData = JSON.parse(jsonStr);
      const html = buildCardPageHtml(card.file, card.name, card.num, "CH 01 · 메이저 아르카나", data, startPage);
      return NextResponse.json({ html, nextStartPage: startPage + 1 });
    }

    // ── 마이너 원소 ──
    const suitIdx = chapterIndex - 2; // 0~3
    if (suitIdx < 0 || suitIdx >= MINOR_SUITS.length) {
      return NextResponse.json({ error: "잘못된 챕터" }, { status: 400 });
    }
    const suit = MINOR_SUITS[suitIdx];
    const suitIcons = ["🌊", "🔥", "⚔️", "🌿"];
    const chNum = chapterIndex;

    // 원소 오프너
    if (cardIndex === -1) {
      const suitDescs: Record<string, string> = {
        "컵 (Cups)": "컵은 물의 원소입니다. 감정, 직관, 관계, 꿈을 다스리는 컵 카드들은 마음속 깊은 곳의 이야기를 들려줍니다. 에이스에서 킹까지, 감정이 싹트고 성숙해가는 여정을 함께 걸어봐요.",
        "완드 (Wands)": "완드는 불의 원소입니다. 열정, 의지, 창조, 행동을 다스리는 완드 카드들은 가슴 속 불꽃의 이야기를 들려줍니다. 에이스에서 킹까지, 열정이 점화되고 완성되어 가는 여정을 함께 걸어봐요.",
        "검 (Swords)": "검은 바람의 원소입니다. 사고, 진실, 갈등, 결단을 다스리는 검 카드들은 날카로운 지성의 이야기를 들려줍니다. 에이스에서 킹까지, 생각이 깊어지고 진실을 직면해 가는 여정을 함께 걸어봐요.",
        "펜타클 (Pentacles)": "펜타클은 땅의 원소입니다. 물질, 현실, 노력, 성취를 다스리는 펜타클 카드들은 두 발로 딛고 서는 삶의 이야기를 들려줍니다. 에이스에서 킹까지, 씨앗이 뿌려지고 결실을 맺어가는 여정을 함께 걸어봐요.",
      };
      const html = buildSuitOpenerHtml(
        chNum, suit.suit, suit.subtitle,
        suitDescs[suit.suit] || "",
        suitIcons[suitIdx],
        startPage
      );
      return NextResponse.json({ html, nextStartPage: startPage + 1 });
    }

    // 마이너 카드 1장
    const card = suit.cards[cardIndex];
    const msg = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: buildMinorCardPrompt(card, suit.suit, suit.subtitle) }],
    });
    const raw = msg.content[0];
    if (raw.type !== "text") throw new Error("응답 없음");
    let jsonStr = raw.text.trim().replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
    const data: CardData = JSON.parse(jsonStr);
    const html = buildCardPageHtml(card.file, card.name, "", `CH 0${chNum} · ${suit.suit}`, data, startPage);
    return NextResponse.json({ html, nextStartPage: startPage + 1 });

  } catch (error) {
    console.error("오류:", error);
    return NextResponse.json({ error: "생성 중 오류 발생" }, { status: 500 });
  }
}
