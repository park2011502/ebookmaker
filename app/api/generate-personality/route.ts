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

// ── 코트 카드 16장 ────────────────────────────────────
const COURT_CARDS = [
  { file: "Cups11.jpg", name: "컵 페이지", suit: "컵" },
  { file: "Cups12.jpg", name: "컵 나이트", suit: "컵" },
  { file: "Cups13.jpg", name: "컵 퀸", suit: "컵" },
  { file: "Cups14.jpg", name: "컵 킹", suit: "컵" },
  { file: "Wands11.jpg", name: "완드 페이지", suit: "완드" },
  { file: "Wands12.jpg", name: "완드 나이트", suit: "완드" },
  { file: "Wands13.jpg", name: "완드 퀸", suit: "완드" },
  { file: "Wands14.jpg", name: "완드 킹", suit: "완드" },
  { file: "Swords11.jpg", name: "검 페이지", suit: "검" },
  { file: "Swords12.jpg", name: "검 나이트", suit: "검" },
  { file: "Swords13.jpg", name: "검 퀸", suit: "검" },
  { file: "Swords14.jpg", name: "검 킹", suit: "검" },
  { file: "Pents11.jpg", name: "펜타클 페이지", suit: "펜타클" },
  { file: "Pents12.jpg", name: "펜타클 나이트", suit: "펜타클" },
  { file: "Pents13.jpg", name: "펜타클 퀸", suit: "펜타클" },
  { file: "Pents14.jpg", name: "펜타클 킹", suit: "펜타클" },
];

// ── CSS (로즈골드/딥핑크 톤) ──────────────────────────
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --cream:#FFF5F8;--cream-mid:#FFE8EF;
  --rose:#8B2252;--rose-mid:#B03070;--rose-lt:#E090B8;--rose-pale:#FFF0F5;--rose-faint:#FFF5F8;
  --pink:#C04080;--pink-lt:#F0B0D0;
  --dark:#2A0818;--mid:#5A1A38;--light:#A05080;--divider:#F0C0D8;
  --serif:'Noto Serif KR',Georgia,serif;--sans:'Noto Sans KR',sans-serif;--display:'Playfair Display','Noto Serif KR',serif;
}
html,body{background:#5A1A38;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.pg{width:148mm;min-height:210mm;background:var(--cream);margin:0 auto 16px;display:flex;flex-direction:column;font-family:var(--serif);page-break-after:always;page-break-inside:avoid;}
@media print{html,body{background:none;}.pg{margin:0;box-shadow:none;}@page{size:A5;margin:0;}}
.pg-hd{display:flex;justify-content:space-between;align-items:center;padding:8px 18px 7px;border-bottom:0.5px solid var(--divider);flex-shrink:0;}
.pg-hd span{font-family:var(--sans);font-size:6.5px;color:var(--light);letter-spacing:0.3px;}
.pg-ft{display:flex;justify-content:space-between;align-items:center;padding:7px 18px 8px;border-top:0.5px solid var(--divider);flex-shrink:0;margin-top:auto;}
.pg-ft .pn{font-family:var(--display);font-size:10px;color:var(--light);}
.pg-ft .pt{font-family:var(--sans);font-size:6.5px;color:var(--rose-lt);letter-spacing:1.5px;text-transform:uppercase;}
.pg-body{padding:10px 17px 20px;display:flex;flex-direction:column;gap:0;flex:1;}

/* 표지 */
.cover-top{background:var(--rose);padding:24px 0 18px;text-align:center;flex-shrink:0;}
.cover-vol-en{font-family:var(--display);font-size:8px;letter-spacing:5px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:5px;}
.cover-vol-kr{font-family:var(--serif);font-size:20px;font-weight:600;color:#fff;letter-spacing:5px;}
.cover-cards-row{display:flex;justify-content:center;align-items:flex-end;gap:10px;padding:26px 24px 18px;flex-shrink:0;}
.c-card{display:flex;flex-direction:column;align-items:center;gap:5px;}
.c-card img{border-radius:4px;box-shadow:4px 8px 22px rgba(80,0,40,0.28);display:block;}
.c-card .clbl{font-family:var(--display);font-size:6.5px;color:var(--light);letter-spacing:1px;text-transform:uppercase;}
.cover-title-block{text-align:center;padding:4px 36px 14px;flex-shrink:0;}
.cover-main-title{font-family:var(--display);font-size:26px;font-weight:700;color:var(--dark);letter-spacing:-1px;line-height:1.15;margin-bottom:10px;}
.cover-rule{width:44px;height:1.5px;background:var(--rose);margin:0 auto 11px;}
.cover-subtitle{font-family:var(--serif);font-size:11px;font-weight:300;color:var(--mid);font-style:italic;line-height:1.7;margin-bottom:4px;}
.cover-tagline{font-family:var(--sans);font-size:8.5px;color:var(--light);letter-spacing:1px;}
.cover-dots{display:flex;justify-content:center;gap:7px;padding:4px 0 12px;flex-shrink:0;}
.cover-dots span{width:6px;height:6px;border-radius:50%;background:var(--rose-lt);display:inline-block;}
.cover-dots .on{background:var(--rose);}
.cover-learn{margin:0 26px;background:var(--rose-faint);border:1px solid var(--rose-lt);border-radius:5px;padding:13px 18px 12px;flex-shrink:0;}
.cover-learn h4{font-family:var(--sans);font-size:7.5px;font-weight:600;color:var(--rose);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:9px;}
.cover-learn ul{list-style:none;display:flex;flex-direction:column;gap:5px;}
.cover-learn li{font-family:var(--sans);font-size:9.5px;color:var(--mid);padding-left:14px;position:relative;line-height:1.55;}
.cover-learn li::before{content:'＋';position:absolute;left:0;color:var(--rose-mid);font-size:9px;line-height:1.55;}
.cover-toc{margin:11px 26px 0;display:grid;grid-template-columns:repeat(2,1fr);gap:6px;}
.toc-cell{background:var(--cream-mid);border:1px solid var(--divider);border-radius:4px;padding:7px 5px;text-align:center;}
.toc-cell .tn{font-family:var(--display);font-size:13px;font-weight:700;color:var(--rose-lt);line-height:1;margin-bottom:3px;}
.toc-cell .tl{font-family:var(--sans);font-size:6.5px;color:var(--mid);line-height:1.4;word-break:keep-all;}
.cover-bottom{margin-top:auto;background:var(--rose);padding:11px 26px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
.cover-bottom-l{font-family:var(--display);font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.8);text-transform:uppercase;}
.cover-bottom-r{font-family:var(--sans);font-size:7.5px;color:rgba(255,255,255,0.6);}

/* 챕터 오프너 */
.opener-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 26px;text-align:center;}
.op-label{font-family:var(--display);font-size:9px;color:var(--rose-mid);letter-spacing:5px;text-transform:uppercase;margin-bottom:6px;}
.op-num{font-family:var(--display);font-size:68px;font-weight:700;color:var(--rose-lt);line-height:1;margin-bottom:4px;}
.op-title{font-family:var(--display);font-size:18px;font-weight:700;color:var(--dark);line-height:1.3;margin-bottom:10px;}
.op-rule{width:44px;height:1.5px;background:var(--rose);margin:0 auto 14px;}
.op-desc{font-family:var(--serif);font-size:11px;color:var(--mid);font-style:italic;line-height:1.9;margin-bottom:18px;word-break:keep-all;}
.op-sections{width:100%;background:var(--rose-faint);border:1px solid var(--rose-lt);border-radius:5px;padding:13px 18px;text-align:left;}
.op-sections h4{font-family:var(--sans);font-size:8px;font-weight:600;color:var(--rose);letter-spacing:2px;text-transform:uppercase;margin-bottom:9px;}
.op-sections ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:4px;}
.op-sections li{font-family:var(--sans);font-size:9px;color:var(--mid);padding-left:10px;position:relative;line-height:1.5;}
.op-sections li::before{content:'›';position:absolute;left:0;color:var(--rose-mid);}

/* 카드 인물 분석 페이지 */
.person-header{display:flex;gap:14px;margin-bottom:8px;flex-shrink:0;align-items:flex-start;}
.person-img{flex-shrink:0;text-align:center;}
.person-img img{width:90px;border-radius:6px;box-shadow:4px 8px 20px rgba(80,0,40,0.30);display:block;}
.person-img .card-roman{font-family:var(--display);font-size:8px;color:var(--light);text-align:center;margin-top:5px;font-style:italic;letter-spacing:1px;}
.person-title-block{flex:1;padding-top:4px;}
.person-badge{font-family:var(--sans);font-size:7px;font-weight:600;color:var(--rose);letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;}
.person-name{font-family:var(--display);font-size:19px;font-weight:700;color:var(--dark);line-height:1.2;margin-bottom:5px;}
.person-tagline{font-family:var(--serif);font-size:10px;font-style:italic;color:var(--rose-mid);line-height:1.55;word-break:keep-all;}
.person-keywords{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:7px;flex-shrink:0;}
.p-kw{background:var(--rose);color:#fff;font-family:var(--sans);font-size:8px;padding:3px 9px;border-radius:20px;}
.person-rule{width:28px;height:2px;background:var(--rose);margin-bottom:8px;flex-shrink:0;}
.person-sections{display:flex;flex-direction:column;gap:5px;flex:1;}
.p-section{background:var(--rose-pale);border-left:3px solid var(--rose);border-radius:0 4px 4px 0;padding:6px 10px;flex-shrink:0;}
.p-section-title{font-family:var(--sans);font-size:8px;font-weight:600;color:var(--rose);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;}
.p-section-text{font-family:var(--sans);font-size:10.5px;color:var(--dark);line-height:1.7;word-break:keep-all;}
.person-summary{background:var(--rose);border-radius:5px;padding:8px 13px;margin-top:7px;flex-shrink:0;}
.person-summary-text{font-family:var(--display);font-size:10.5px;font-style:italic;color:#fff;line-height:1.65;text-align:center;}`;

// ── trimSentences ─────────────────────────────────────
function trimSentences(text: string, max: number): string {
  if (!text) return "";
  const sentences = text.match(/[^。.!?！？]+[。.!?！？]+/g) || [text];
  return sentences.slice(0, max).join("").trim();
}

// ── 표지 HTML ─────────────────────────────────────────
function buildCoverHtml(): string {
  const cards = [
    { file: "RWS_Tarot_02_High_Priestess.jpg", label: "High Priestess", w: 48, mb: 12, op: 0.82 },
    { file: "Cups12.jpg", label: "Knight of Cups", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_18_Moon.jpg", label: "The Moon", w: 80, mb: 0, op: 1 },
    { file: "Wands13.jpg", label: "Queen of Wands", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_19_Sun.jpg", label: "The Sun", w: 48, mb: 12, op: 0.82 },
  ];
  return `<div class="pg"><div class="cover-top"><div class="cover-vol-en">Special Gift · Tarot Personality Guide</div><div class="cover-vol-kr">서비스 부록</div></div><div class="cover-cards-row">${cards.map(c=>`<div class="c-card"><img src="${BASE_URL}/cards/${c.file}" style="width:${c.w}px;margin-bottom:${c.mb}px;opacity:${c.op};" alt="${c.label}"><div class="clbl">${c.label}</div></div>`).join("")}</div><div class="cover-title-block"><div class="cover-main-title">타로로 읽는<br>상대방 유형 분석</div><div class="cover-rule"></div><div class="cover-subtitle">카드 한 장으로 꿰뚫는 그 사람의 성격·연애 스타일·행동 패턴</div><div class="cover-tagline">서비스 부록 · 메이저 22장 + 코트 카드 16장 수록</div></div><div class="cover-dots"><span></span><span class="on"></span><span></span></div><div class="cover-learn"><h4>이 책에서 배울 것들</h4><ul><li>상대방 위치에 카드가 나왔을 때 그 사람을 완전히 읽는 법</li><li>메이저 아르카나 22장 — 각 카드가 상징하는 인물 유형</li><li>코트 카드 16장 — 페이지·나이트·퀸·킹 성격 완전 분석</li><li>성격·연애 스타일·행동 패턴·접근법까지 한 카드에 담아</li><li>상담에서 바로 써먹는 상대방 리딩 핵심 가이드</li></ul></div><div class="cover-toc"><div class="toc-cell"><div class="tn">01</div><div class="tl">메이저 아르카나<br>22가지 인물 유형</div></div><div class="toc-cell"><div class="tn">02</div><div class="tl">코트 카드<br>16가지 인물 유형</div></div></div><div class="cover-bottom"><div class="cover-bottom-l">Tarot Personality Guide</div><div class="cover-bottom-r">서비스 부록 · 상대방 유형 분석 38장</div></div></div>`;
}

// ── 챕터 오프너 HTML ──────────────────────────────────
function buildOpenerHtml(chapterNum: number, title: string, desc: string, items: string[], pageNum: number): string {
  return `<div class="pg"><div class="pg-hd"><span>타로로 읽는 상대방 유형 분석 | 카드로 꿰뚫는 그 사람</span><span>CHAPTER 0${chapterNum}</span></div><div class="opener-body"><div class="op-label">CHAPTER</div><div class="op-num">0${chapterNum}</div><div class="op-title">${title}</div><div class="op-rule"></div><div class="op-desc">${desc}</div><div class="op-sections"><h4>이번 챕터 카드</h4><ul>${items.map(s=>`<li>${s}</li>`).join("")}</ul></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Personality Guide</div></div></div>`;
}

// ── 카드 인물 분석 HTML ───────────────────────────────
interface PersonData {
  tagline: string;
  keywords: string[];
  personality: string;
  loveStyle: string;
  behavior: string;
  howToApproach: string;
  summary: string;
}

function buildPersonPageHtml(
  file: string, name: string, numOrSuit: string,
  chapterNum: number,
  data: PersonData,
  pageNum: number
): string {
  const safeName = name.replace(/\.+$/, "").replace(/&/g, "&amp;");
  const keywords = (data.keywords || []).slice(0, 4).map(k => `<span class="p-kw">${k}</span>`).join("");

  return `<div class="pg"><div class="pg-hd"><span>타로로 읽는 상대방 유형 분석 | 카드로 꿰뚫는 그 사람</span><span>CH 0${chapterNum} · ${chapterNum === 1 ? "메이저 아르카나" : "코트 카드"}</span></div><div class="pg-body"><div class="person-header"><div class="person-img"><img src="${BASE_URL}/cards/${file}" alt="${safeName}"><div class="card-roman">${numOrSuit}</div></div><div class="person-title-block"><div class="person-badge">💕 상대방 유형 분석</div><div class="person-name">${safeName}</div><div class="person-tagline">${trimSentences(data.tagline, 1)}</div></div></div><div class="person-keywords">${keywords}</div><div class="person-rule"></div><div class="person-sections"><div class="p-section"><div class="p-section-title">🌟 성격</div><div class="p-section-text">${trimSentences(data.personality, 2)}</div></div><div class="p-section"><div class="p-section-title">💕 연애 스타일</div><div class="p-section-text">${trimSentences(data.loveStyle, 2)}</div></div><div class="p-section"><div class="p-section-title">🔄 행동 패턴</div><div class="p-section-text">${trimSentences(data.behavior, 2)}</div></div><div class="p-section"><div class="p-section-title">💡 이렇게 접근하세요</div><div class="p-section-text">${trimSentences(data.howToApproach, 2)}</div></div></div><div class="person-summary"><div class="person-summary-text">"${trimSentences(data.summary, 1)}"</div></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Personality Guide</div></div></div>`;
}

// ── 메이저 카드 프롬프트 ──────────────────────────────
function buildMajorPrompt(card: { file: string; name: string; num: string }): string {
  return `타로 전자책 작가입니다. 아래 메이저 아르카나 카드가 연애 상담에서 상대방 위치에 나왔을 때의 인물 분석을 JSON으로만 작성하세요. JSON 외 텍스트 절대 금지.

카드: ${card.name} (${card.num}번)

중요 규칙:
- 이 카드가 상징하는 인물의 성격, 연애 스타일, 행동 패턴을 구체적으로 작성할 것.
- 모든 문장은 반드시 마침표로 완전하게 끝낼 것.
- 구어체로 친근하고 생생하게 작성할 것.
- 읽으면 "아 맞아, 저 사람이 딱 이렇다!"는 느낌이 들도록 작성할 것.

{
  "tagline": "이 카드 인물을 한 줄로 표현. 반드시 마침표로 끝낼 것.",
  "keywords": ["성격키워드1", "성격키워드2", "연애스타일키워드", "행동패턴키워드"],
  "personality": "이 카드가 상징하는 사람의 핵심 성격과 기질을 3~4문장으로. 강점과 약점 포함. 반드시 마침표로 끝낼 것.",
  "loveStyle": "이 사람이 좋아하면 어떻게 행동하는지, 썸탈 때 특징, 연애할 때 모습을 3~4문장으로. 반드시 마침표로 끝낼 것.",
  "behavior": "갈등 상황에서 어떻게 반응하는지, 연락 패턴, 감정 표현 방식을 3~4문장으로. 반드시 마침표로 끝낼 것.",
  "howToApproach": "이 사람에게 어떻게 접근하면 좋은지, 피해야 할 행동, 잘 지내는 법을 3~4문장으로. 반드시 마침표로 끝낼 것.",
  "summary": "이 카드가 상대방 위치에 나왔을 때 핵심 메시지 한 문장. 반드시 마침표로 끝낼 것."
}
JSON만 출력.`;
}

// ── 코트 카드 프롬프트 ────────────────────────────────
function buildCourtPrompt(card: { file: string; name: string; suit: string }): string {
  return `타로 전자책 작가입니다. 아래 코트 카드가 연애 상담에서 상대방 위치에 나왔을 때의 인물 분석을 JSON으로만 작성하세요. JSON 외 텍스트 절대 금지.

카드: ${card.name} (${card.suit} 원소)

중요 규칙:
- 이 카드가 상징하는 인물의 성격, 연애 스타일, 행동 패턴을 구체적으로 작성할 것.
- ${card.suit} 원소의 특성이 잘 드러나도록 작성할 것.
- 모든 문장은 반드시 마침표로 완전하게 끝낼 것.
- 구어체로 친근하고 생생하게 작성할 것.

{
  "tagline": "이 카드 인물을 한 줄로 표현. 반드시 마침표로 끝낼 것.",
  "keywords": ["성격키워드1", "성격키워드2", "연애스타일키워드", "행동패턴키워드"],
  "personality": "이 카드가 상징하는 사람의 핵심 성격과 기질을 3~4문장으로. 강점과 약점 포함. 반드시 마침표로 끝낼 것.",
  "loveStyle": "이 사람이 좋아하면 어떻게 행동하는지, 썸탈 때 특징, 연애할 때 모습을 3~4문장으로. 반드시 마침표로 끝낼 것.",
  "behavior": "갈등 상황에서 어떻게 반응하는지, 연락 패턴, 감정 표현 방식을 3~4문장으로. 반드시 마침표로 끝낼 것.",
  "howToApproach": "이 사람에게 어떻게 접근하면 좋은지, 피해야 할 행동, 잘 지내는 법을 3~4문장으로. 반드시 마침표로 끝낼 것.",
  "summary": "이 카드가 상대방 위치에 나왔을 때 핵심 메시지 한 문장. 반드시 마침표로 끝낼 것."
}
JSON만 출력.`;
}

// ── API Route ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { chapterIndex, cardIndex, startPage = 1 } = await req.json();

    // chapterIndex 0: 표지
    // chapterIndex 1: 메이저 오프너(-1) + 메이저 22장(0~21)
    // chapterIndex 2: 코트 오프너(-1) + 코트 16장(0~15)

    if (chapterIndex === 0) {
      return NextResponse.json({
        html: buildCoverHtml(),
        css: CSS,
        nextStartPage: startPage + 1,
      });
    }

    if (chapterIndex === 1) {
      if (cardIndex === -1) {
        const html = buildOpenerHtml(
          1,
          "메이저 아르카나<br>22가지 인물 유형",
          "메이저 아르카나가 상대방 위치에 나오면 그 사람의 인생 에너지 자체를 읽는 거예요. 바보부터 세계까지 — 각 카드가 상징하는 인물의 성격과 연애 스타일을 완전히 파악해보세요.",
          MAJOR_CARDS.map(c => c.name),
          startPage
        );
        return NextResponse.json({ html, nextStartPage: startPage + 1 });
      }

      const card = MAJOR_CARDS[cardIndex];
      const msg = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 3000,
        messages: [{ role: "user", content: buildMajorPrompt(card) }],
      });
      const raw = msg.content[0];
      if (raw.type !== "text") throw new Error("응답 없음");
      let jsonStr = raw.text.trim().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      let data: PersonData;
      try { data = JSON.parse(jsonStr); }
      catch { return NextResponse.json({ error: "JSON 파싱 실패: " + jsonStr.substring(0, 200) }, { status: 500 }); }

      const html = buildPersonPageHtml(card.file, card.name, card.num, 1, data, startPage);
      return NextResponse.json({ html, nextStartPage: startPage + 1 });
    }

    if (chapterIndex === 2) {
      if (cardIndex === -1) {
        const html = buildOpenerHtml(
          2,
          "코트 카드<br>16가지 인물 유형",
          "코트 카드는 실제 사람을 가장 직접적으로 상징하는 카드예요. 페이지·나이트·퀸·킹 각각의 에너지와 원소가 만나 완전히 다른 인물이 됩니다. 상대방 위치에 코트 카드가 나왔을 때 가장 정확한 분석을 해드릴게요.",
          COURT_CARDS.map(c => c.name),
          startPage
        );
        return NextResponse.json({ html, nextStartPage: startPage + 1 });
      }

      const card = COURT_CARDS[cardIndex];
      const msg = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 3000,
        messages: [{ role: "user", content: buildCourtPrompt(card) }],
      });
      const raw = msg.content[0];
      if (raw.type !== "text") throw new Error("응답 없음");
      let jsonStr = raw.text.trim().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      let data: PersonData;
      try { data = JSON.parse(jsonStr); }
      catch { return NextResponse.json({ error: "JSON 파싱 실패: " + jsonStr.substring(0, 200) }, { status: 500 }); }

      const html = buildPersonPageHtml(card.file, card.name, card.suit, 2, data, startPage);
      return NextResponse.json({ html, nextStartPage: startPage + 1 });
    }

    return NextResponse.json({ error: "잘못된 챕터" }, { status: 400 });

  } catch (error) {
    console.error("오류:", error);
    return NextResponse.json({ error: "생성 중 오류 발생" }, { status: 500 });
  }
}
