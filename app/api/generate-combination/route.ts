import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const BASE_URL = "https://ebookmaker.vercel.app";

// ── 챕터 구성 ─────────────────────────────────────────
const CHAPTERS = [
  {
    number: 1, title: "연애 조합 해석",
    icon: "💕",
    sections: [
      {
        title: "설레는 시작 — 썸·고백 조합",
        combinations: [
          { card1: "Cups02.jpg", name1: "컵 2", card2: "TheLovers.jpg", name2: "연인" },
          { card1: "RWS_Tarot_00_Fool.jpg", name1: "바보", card2: "Cups01.jpg", name2: "컵 에이스" },
          { card1: "RWS_Tarot_19_Sun.jpg", name1: "태양", card2: "Cups02.jpg", name2: "컵 2" },
          { card1: "RWS_Tarot_18_Moon.jpg", name1: "달", card2: "Cups07.jpg", name2: "컵 7" },
        ],
      },
      {
        title: "연인 사이 — 신뢰·미래 조합",
        combinations: [
          { card1: "TheLovers.jpg", name1: "연인", card2: "RWS_Tarot_21_World.jpg", name2: "세계" },
          { card1: "Cups10.jpg", name1: "컵 10", card2: "RWS_Tarot_04_Emperor.jpg", name2: "황제" },
          { card1: "RWS_Tarot_15_Devil.jpg", name1: "악마", card2: "Cups02.jpg", name2: "컵 2" },
          { card1: "RWS_Tarot_16_Tower.jpg", name1: "탑", card2: "RWS_Tarot_20_Judgement.jpg", name2: "심판" },
        ],
      },
      {
        title: "이별·재회 — 끝과 새 시작 조합",
        combinations: [
          { card1: "Swords03.jpg", name1: "검 3", card2: "RWS_Tarot_13_Death.jpg", name2: "죽음" },
          { card1: "RWS_Tarot_20_Judgement.jpg", name1: "심판", card2: "Cups06.jpg", name2: "컵 6" },
          { card1: "Cups08.jpg", name1: "컵 8", card2: "RWS_Tarot_17_Star.jpg", name2: "별" },
          { card1: "RWS_Tarot_18_Moon.jpg", name1: "달", card2: "Swords02.jpg", name2: "검 2" },
        ],
      },
    ],
  },
  {
    number: 2, title: "금전 조합 해석",
    icon: "💰",
    sections: [
      {
        title: "수입·풍요 — 돈이 들어오는 조합",
        combinations: [
          { card1: "Pents01.jpg", name1: "펜타클 에이스", card2: "RWS_Tarot_19_Sun.jpg", name2: "태양" },
          { card1: "Pents09.jpg", name1: "펜타클 9", card2: "Pents10.jpg", name2: "펜타클 10" },
          { card1: "RWS_Tarot_10_Wheel_of_Fortune.jpg", name1: "운명의 수레바퀴", card2: "Pents06.jpg", name2: "펜타클 6" },
          { card1: "RWS_Tarot_21_World.jpg", name1: "세계", card2: "Pents01.jpg", name2: "펜타클 에이스" },
        ],
      },
      {
        title: "손재수·위험 — 돈이 새는 조합",
        combinations: [
          { card1: "RWS_Tarot_15_Devil.jpg", name1: "악마", card2: "Pents05.jpg", name2: "펜타클 5" },
          { card1: "RWS_Tarot_16_Tower.jpg", name1: "탑", card2: "Pents05.jpg", name2: "펜타클 5" },
          { card1: "Swords07.jpg", name1: "검 7", card2: "Pents04.jpg", name2: "펜타클 4" },
          { card1: "RWS_Tarot_18_Moon.jpg", name1: "달", card2: "Pents02.jpg", name2: "펜타클 2" },
        ],
      },
      {
        title: "투자·사업 — 결단의 조합",
        combinations: [
          { card1: "RWS_Tarot_01_Magician.jpg", name1: "마법사", card2: "Pents08.jpg", name2: "펜타클 8" },
          { card1: "Wands03.jpg", name1: "완드 3", card2: "Pents03.jpg", name2: "펜타클 3" },
          { card1: "RWS_Tarot_04_Emperor.jpg", name1: "황제", card2: "Pents09.jpg", name2: "펜타클 9" },
          { card1: "RWS_Tarot_11_Justice.jpg", name1: "정의", card2: "Pents06.jpg", name2: "펜타클 6" },
        ],
      },
    ],
  },
  {
    number: 3, title: "직업 조합 해석",
    icon: "💼",
    sections: [
      {
        title: "취업·이직 — 새 출발 조합",
        combinations: [
          { card1: "RWS_Tarot_07_Chariot.jpg", name1: "전차", card2: "Pents08.jpg", name2: "펜타클 8" },
          { card1: "RWS_Tarot_00_Fool.jpg", name1: "바보", card2: "Wands01.jpg", name2: "완드 에이스" },
          { card1: "RWS_Tarot_19_Sun.jpg", name1: "태양", card2: "Pents03.jpg", name2: "펜타클 3" },
          { card1: "RWS_Tarot_20_Judgement.jpg", name1: "심판", card2: "RWS_Tarot_07_Chariot.jpg", name2: "전차" },
        ],
      },
      {
        title: "승진·성장 — 인정받는 조합",
        combinations: [
          { card1: "RWS_Tarot_04_Emperor.jpg", name1: "황제", card2: "Pents06.jpg", name2: "펜타클 6" },
          { card1: "RWS_Tarot_08_Strength.jpg", name1: "힘", card2: "Wands06.jpg", name2: "완드 6" },
          { card1: "Pents03.jpg", name1: "펜타클 3", card2: "RWS_Tarot_21_World.jpg", name2: "세계" },
          { card1: "RWS_Tarot_11_Justice.jpg", name1: "정의", card2: "Pents08.jpg", name2: "펜타클 8" },
        ],
      },
      {
        title: "직장 갈등·위기 — 주의 조합",
        combinations: [
          { card1: "Swords05.jpg", name1: "검 5", card2: "RWS_Tarot_16_Tower.jpg", name2: "탑" },
          { card1: "RWS_Tarot_15_Devil.jpg", name1: "악마", card2: "Swords08.jpg", name2: "검 8" },
          { card1: "Wands07.jpg", name1: "완드 7", card2: "Swords02.jpg", name2: "검 2" },
          { card1: "RWS_Tarot_12_Hanged_Man.jpg", name1: "매달린 사람", card2: "Swords04.jpg", name2: "검 4" },
        ],
      },
    ],
  },
  {
    number: 4, title: "인생·운명 조합 해석",
    icon: "🔮",
    sections: [
      {
        title: "전환점·변화 — 인생이 바뀌는 조합",
        combinations: [
          { card1: "RWS_Tarot_10_Wheel_of_Fortune.jpg", name1: "운명의 수레바퀴", card2: "RWS_Tarot_13_Death.jpg", name2: "죽음" },
          { card1: "RWS_Tarot_16_Tower.jpg", name1: "탑", card2: "RWS_Tarot_17_Star.jpg", name2: "별" },
          { card1: "RWS_Tarot_13_Death.jpg", name1: "죽음", card2: "RWS_Tarot_21_World.jpg", name2: "세계" },
          { card1: "RWS_Tarot_20_Judgement.jpg", name1: "심판", card2: "RWS_Tarot_00_Fool.jpg", name2: "바보" },
        ],
      },
      {
        title: "성공·완성 — 최고의 조합",
        combinations: [
          { card1: "RWS_Tarot_19_Sun.jpg", name1: "태양", card2: "RWS_Tarot_21_World.jpg", name2: "세계" },
          { card1: "RWS_Tarot_17_Star.jpg", name1: "별", card2: "RWS_Tarot_19_Sun.jpg", name2: "태양" },
          { card1: "RWS_Tarot_01_Magician.jpg", name1: "마법사", card2: "RWS_Tarot_21_World.jpg", name2: "세계" },
          { card1: "RWS_Tarot_10_Wheel_of_Fortune.jpg", name1: "운명의 수레바퀴", card2: "RWS_Tarot_19_Sun.jpg", name2: "태양" },
        ],
      },
      {
        title: "내면·성찰 — 깊이 보는 조합",
        combinations: [
          { card1: "RWS_Tarot_02_High_Priestess.jpg", name1: "여사제", card2: "RWS_Tarot_18_Moon.jpg", name2: "달" },
          { card1: "RWS_Tarot_09_Hermit.jpg", name1: "은둔자", card2: "RWS_Tarot_12_Hanged_Man.jpg", name2: "매달린 사람" },
          { card1: "RWS_Tarot_14_Temperance.jpg", name1: "절제", card2: "RWS_Tarot_17_Star.jpg", name2: "별" },
          { card1: "RWS_Tarot_08_Strength.jpg", name1: "힘", card2: "RWS_Tarot_09_Hermit.jpg", name2: "은둔자" },
        ],
      },
    ],
  },
];

// ── CSS (포레스트그린 톤) ──────────────────────────────
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --cream:#F4FAF4;--cream-mid:#E4F2E4;
  --green:#1A5C2A;--green-mid:#2A8040;--green-lt:#7DC490;--green-pale:#EAF5EA;--green-faint:#F4FAF4;
  --forest:#226B34;--forest-lt:#A8D8B0;
  --dark:#071A0C;--mid:#1A4A24;--light:#3D8050;--divider:#B0D8B8;
  --serif:'Noto Serif KR',Georgia,serif;--sans:'Noto Sans KR',sans-serif;--display:'Playfair Display','Noto Serif KR',serif;
}
html,body{background:#1A4A24;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.pg{width:148mm;min-height:210mm;background:var(--cream);margin:0 auto 16px;display:flex;flex-direction:column;font-family:var(--serif);page-break-after:always;page-break-inside:avoid;}
@media print{html,body{background:none;}.pg{margin:0;box-shadow:none;}@page{size:A5;margin:0;}}
.pg-hd{display:flex;justify-content:space-between;align-items:center;padding:8px 18px 7px;border-bottom:0.5px solid var(--divider);flex-shrink:0;}
.pg-hd span{font-family:var(--sans);font-size:6.5px;color:var(--light);letter-spacing:0.3px;}
.pg-ft{display:flex;justify-content:space-between;align-items:center;padding:7px 18px 8px;border-top:0.5px solid var(--divider);flex-shrink:0;margin-top:auto;}
.pg-ft .pn{font-family:var(--display);font-size:10px;color:var(--light);}
.pg-ft .pt{font-family:var(--sans);font-size:6.5px;color:var(--green-lt);letter-spacing:1.5px;text-transform:uppercase;}
.pg-body{padding:10px 17px 20px;display:flex;flex-direction:column;gap:0;flex:1;}

/* 표지 */
.cover-top{background:var(--green);padding:24px 0 18px;text-align:center;flex-shrink:0;}
.cover-vol-en{font-family:var(--display);font-size:8px;letter-spacing:5px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:5px;}
.cover-vol-kr{font-family:var(--serif);font-size:20px;font-weight:600;color:#fff;letter-spacing:5px;}
.cover-cards-row{display:flex;justify-content:center;align-items:flex-end;gap:10px;padding:26px 24px 18px;flex-shrink:0;}
.c-card{display:flex;flex-direction:column;align-items:center;gap:5px;}
.c-card img{border-radius:4px;box-shadow:4px 8px 22px rgba(0,30,10,0.28);display:block;}
.c-card .clbl{font-family:var(--display);font-size:6.5px;color:var(--light);letter-spacing:1px;text-transform:uppercase;}
.cover-title-block{text-align:center;padding:4px 36px 14px;flex-shrink:0;}
.cover-main-title{font-family:var(--display);font-size:28px;font-weight:700;color:var(--dark);letter-spacing:-1px;line-height:1.1;margin-bottom:10px;}
.cover-rule{width:44px;height:1.5px;background:var(--green);margin:0 auto 11px;}
.cover-subtitle{font-family:var(--serif);font-size:11px;font-weight:300;color:var(--mid);font-style:italic;line-height:1.7;margin-bottom:4px;}
.cover-tagline{font-family:var(--sans);font-size:8.5px;color:var(--light);letter-spacing:1px;}
.cover-dots{display:flex;justify-content:center;gap:7px;padding:4px 0 12px;flex-shrink:0;}
.cover-dots span{width:6px;height:6px;border-radius:50%;background:var(--green-lt);display:inline-block;}
.cover-dots .on{background:var(--green);}
.cover-learn{margin:0 26px;background:var(--green-faint);border:1px solid var(--green-lt);border-radius:5px;padding:13px 18px 12px;flex-shrink:0;}
.cover-learn h4{font-family:var(--sans);font-size:7.5px;font-weight:600;color:var(--green);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:9px;}
.cover-learn ul{list-style:none;display:flex;flex-direction:column;gap:5px;}
.cover-learn li{font-family:var(--sans);font-size:9.5px;color:var(--mid);padding-left:14px;position:relative;line-height:1.55;}
.cover-learn li::before{content:'＋';position:absolute;left:0;color:var(--green-mid);font-size:9px;line-height:1.55;}
.cover-toc{margin:11px 26px 0;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}
.toc-cell{background:var(--cream-mid);border:1px solid var(--divider);border-radius:4px;padding:7px 5px;text-align:center;}
.toc-cell .tn{font-family:var(--display);font-size:13px;font-weight:700;color:var(--green-lt);line-height:1;margin-bottom:3px;}
.toc-cell .tl{font-family:var(--sans);font-size:6.5px;color:var(--mid);line-height:1.4;word-break:keep-all;}
.cover-bottom{margin-top:auto;background:var(--green);padding:11px 26px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
.cover-bottom-l{font-family:var(--display);font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.8);text-transform:uppercase;}
.cover-bottom-r{font-family:var(--sans);font-size:7.5px;color:rgba(255,255,255,0.6);}

/* 챕터 오프너 */
.opener-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 26px;text-align:center;}
.op-label{font-family:var(--display);font-size:9px;color:var(--green-mid);letter-spacing:5px;text-transform:uppercase;margin-bottom:6px;}
.op-num{font-family:var(--display);font-size:68px;font-weight:700;color:var(--green-lt);line-height:1;margin-bottom:4px;}
.op-title{font-family:var(--display);font-size:18px;font-weight:700;color:var(--dark);line-height:1.3;margin-bottom:10px;}
.op-rule{width:44px;height:1.5px;background:var(--green);margin:0 auto 14px;}
.op-desc{font-family:var(--serif);font-size:11px;color:var(--mid);font-style:italic;line-height:1.9;margin-bottom:18px;word-break:keep-all;}
.op-sections{width:100%;background:var(--green-faint);border:1px solid var(--green-lt);border-radius:5px;padding:13px 18px;text-align:left;}
.op-sections h4{font-family:var(--sans);font-size:8px;font-weight:600;color:var(--green);letter-spacing:2px;text-transform:uppercase;margin-bottom:9px;}
.op-sections ul{list-style:none;display:flex;flex-direction:column;gap:6px;}
.op-sections li{font-family:var(--sans);font-size:11px;color:var(--mid);padding-left:13px;position:relative;line-height:1.6;}
.op-sections li::before{content:'›';position:absolute;left:0;color:var(--green-mid);}

/* 조합 페이지 */
.comb-section-header{display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-shrink:0;}
.comb-badge{font-family:var(--sans);font-size:7px;font-weight:600;color:var(--green);letter-spacing:2px;text-transform:uppercase;}
.comb-section-title{font-family:var(--display);font-size:17px;font-weight:700;color:var(--dark);line-height:1.25;margin-bottom:4px;}
.comb-rule{width:28px;height:2px;background:var(--green);margin-bottom:10px;flex-shrink:0;}
.comb-item{background:var(--green-pale);border:1px solid var(--green-lt);border-radius:6px;padding:10px 12px;margin-bottom:8px;flex-shrink:0;}
.comb-item:last-child{margin-bottom:0;}
.comb-cards-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
.comb-card{display:flex;flex-direction:column;align-items:center;gap:4px;}
.comb-card img{width:44px;border-radius:3px;box-shadow:2px 4px 10px rgba(0,30,10,0.2);display:block;}
.comb-card-name{font-family:var(--sans);font-size:7.5px;color:var(--light);text-align:center;font-weight:600;}
.comb-plus{font-family:var(--display);font-size:18px;color:var(--green-lt);font-weight:700;flex-shrink:0;}
.comb-meaning{flex:1;}
.comb-meaning-title{font-family:var(--serif);font-size:11px;font-weight:700;color:var(--green);margin-bottom:4px;}
.comb-meaning-desc{font-family:var(--sans);font-size:10px;color:var(--dark);line-height:1.7;word-break:keep-all;margin-bottom:4px;}
.comb-tags{display:flex;gap:5px;flex-wrap:wrap;}
.comb-tag{font-family:var(--sans);font-size:8px;background:var(--green);color:#fff;padding:2px 8px;border-radius:20px;}
.comb-tip{background:var(--green);border-radius:4px;padding:8px 12px;margin-top:8px;flex-shrink:0;}
.comb-tip-text{font-family:var(--sans);font-size:10px;color:#fff;line-height:1.65;word-break:keep-all;}`;

// ── trimSentences ─────────────────────────────────────
function trimSentences(text: string, max: number): string {
  if (!text) return "";
  const sentences = text.match(/[^。.!?！？]+[。.!?！？]+/g) || [text];
  return sentences.slice(0, max).join("").trim();
}

// ── 표지 HTML ─────────────────────────────────────────
function buildCoverHtml(): string {
  const cards = [
    { file: "TheLovers.jpg", label: "The Lovers", w: 48, mb: 12, op: 0.82 },
    { file: "RWS_Tarot_19_Sun.jpg", label: "The Sun", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_21_World.jpg", label: "The World", w: 80, mb: 0, op: 1 },
    { file: "Pents10.jpg", label: "Pentacles X", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_17_Star.jpg", label: "The Star", w: 48, mb: 12, op: 0.82 },
  ];
  return `<div class="pg"><div class="cover-top"><div class="cover-vol-en">Special Edition · Tarot Combination Guide</div><div class="cover-vol-kr">부 록 3</div></div><div class="cover-cards-row">${cards.map(c=>`<div class="c-card"><img src="${BASE_URL}/cards/${c.file}" style="width:${c.w}px;margin-bottom:${c.mb}px;opacity:${c.op};" alt="${c.label}"><div class="clbl">${c.label}</div></div>`).join("")}</div><div class="cover-title-block"><div class="cover-main-title">타로 카드<br>조합 해석집 50</div><div class="cover-rule"></div><div class="cover-subtitle">함께 나오면 달라지는 카드 조합 50가지 완전 해설</div><div class="cover-tagline">부록 3 · 연애·금전·직업·인생 조합 50가지 수록</div></div><div class="cover-dots"><span></span><span class="on"></span><span></span></div><div class="cover-learn"><h4>이 책에서 배울 것들</h4><ul><li>같은 카드도 함께 나오는 카드에 따라 의미가 완전히 달라진다</li><li>연애 리딩에서 자주 나오는 핵심 조합 12가지</li><li>금전 리딩에서 주목해야 할 조합 12가지</li><li>직업·커리어 리딩의 결정적 조합 12가지</li><li>인생 전환점과 운명을 나타내는 조합 12가지</li></ul></div><div class="cover-toc">${["연애조합","금전조합","직업조합","인생조합"].map((t,i)=>`<div class="toc-cell"><div class="tn">0${i+1}</div><div class="tl">${t}</div></div>`).join("")}</div><div class="cover-bottom"><div class="cover-bottom-l">Tarot Combination Guide</div><div class="cover-bottom-r">부록 3 · 카드 조합 50가지 완전 해설</div></div></div>`;
}

// ── 챕터 오프너 HTML ──────────────────────────────────
function buildOpenerHtml(ch: typeof CHAPTERS[0], pageNum: number): string {
  const descs: Record<number, string> = {
    1: "타로에서 연애를 읽을 때 단 한 장보다 두 장의 조합이 훨씬 정확합니다. 상대의 마음, 관계의 방향, 미래의 가능성까지 — 함께 나온 카드가 모든 것을 말해줍니다.",
    2: "금전 리딩에서 카드 조합은 수입과 손재수를 동시에 보여줍니다. 좋은 카드도 잘못된 카드와 함께 나오면 경고가 되고, 나쁜 카드도 좋은 카드와 함께 나오면 돌파구가 됩니다.",
    3: "직업 리딩에서 조합은 타이밍과 방향을 동시에 알려줍니다. 취업·이직·승진·갈등 각 상황에서 자주 나오는 결정적인 조합들을 모았습니다.",
    4: "인생의 큰 전환점에서 타로는 가장 강력한 메시지를 보냅니다. 운명적 변화, 최고의 성공, 깊은 내면의 성찰을 나타내는 조합들을 담았습니다.",
  };
  return `<div class="pg"><div class="pg-hd"><span>타로 카드 조합 해석집 50 | 함께 나오면 달라지는 의미</span><span>CHAPTER 0${ch.number}</span></div><div class="opener-body"><div class="op-label">CHAPTER</div><div class="op-num">0${ch.number}</div><div class="op-title">${ch.icon} ${ch.title}</div><div class="op-rule"></div><div class="op-desc">${descs[ch.number]}</div><div class="op-sections"><h4>이번 챕터 조합</h4><ul>${ch.sections.map(s=>`<li>${s.title} — ${s.combinations.length}가지 조합</li>`).join("")}</ul></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Combination Guide</div></div></div>`;
}

// ── 조합 페이지 HTML ──────────────────────────────────
interface CombinationData {
  title: string;
  desc: string;
  tags: string[];
}

interface SectionData {
  tip: string;
  combinations: CombinationData[];
}

function buildCombinationPageHtml(
  ch: typeof CHAPTERS[0],
  sec: typeof CHAPTERS[0]["sections"][0],
  data: SectionData,
  pageNum: number
): string {
  const safeTitle = sec.title.replace(/&/g, "&amp;");
  const combItems = sec.combinations.slice(0, 4).map((comb, i) => {
    const d = data.combinations[i] || { title: "", desc: "", tags: [] };
    const tags = (d.tags || []).slice(0, 3).map(t => `<span class="comb-tag">${t}</span>`).join("");
    return `<div class="comb-item">
      <div class="comb-cards-row">
        <div class="comb-card"><img src="${BASE_URL}/cards/${comb.card1}" alt="${comb.name1}"><div class="comb-card-name">${comb.name1}</div></div>
        <div class="comb-plus">＋</div>
        <div class="comb-card"><img src="${BASE_URL}/cards/${comb.card2}" alt="${comb.name2}"><div class="comb-card-name">${comb.name2}</div></div>
        <div class="comb-meaning">
          <div class="comb-meaning-title">${d.title || `${comb.name1} + ${comb.name2}`}</div>
          <div class="comb-meaning-desc">${trimSentences(d.desc, 2)}</div>
          <div class="comb-tags">${tags}</div>
        </div>
      </div>
    </div>`;
  }).join("");

  return `<div class="pg"><div class="pg-hd"><span>타로 카드 조합 해석집 50 | 함께 나오면 달라지는 의미</span><span>CH 0${ch.number} · ${ch.title}</span></div><div class="pg-body"><div class="comb-section-header"><div><div class="comb-badge">${ch.icon} ${ch.title} · Combination</div><div class="comb-section-title">${safeTitle}</div></div></div><div class="comb-rule"></div>${combItems}<div class="comb-tip"><div class="comb-tip-text">💡 ${trimSentences(data.tip, 1)}</div></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Combination Guide</div></div></div>`;
}

// ── 조합 프롬프트 ─────────────────────────────────────
function buildCombinationPrompt(ch: typeof CHAPTERS[0], sec: typeof CHAPTERS[0]["sections"][0]): string {
  return `타로 전자책 작가입니다. 아래 카드 조합들의 해석을 JSON으로만 작성하세요. JSON 외 텍스트 절대 금지.

주제: ${ch.title} — ${sec.title}
조합:
${sec.combinations.map((c,i) => `${i+1}. ${c.name1} + ${c.name2}`).join("\n")}

중요 규칙:
- 모든 문장은 반드시 마침표로 완전하게 끝낼 것.
- 구어체로 친근하고 실용적으로 작성할 것.
- 각 조합의 의미가 실제 리딩에서 어떻게 나타나는지 구체적으로 설명할 것.
- 긍정·경고·중립 등 뉘앙스를 명확히 표현할 것.

{
  "tip": "이 유형의 조합을 해석할 때 핵심 포인트 2문장. 반드시 마침표로 끝낼 것.",
  "combinations": [
    ${sec.combinations.map((c,i) => `{
      "title": "${c.name1} + ${c.name2}의 핵심 의미를 5자 이내 제목으로",
      "desc": "이 조합이 나왔을 때의 의미를 3~4문장으로 풍부하게. ${ch.icon} ${ch.title} 관점으로. 정방향·역방향 뉘앙스 포함. 반드시 마침표로 끝낼 것.",
      "tags": ["핵심키워드1", "핵심키워드2", "핵심키워드3"]
    }`).join(",\n    ")}
  ]
}
JSON만 출력.`;
}

// ── API Route ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { chapterIndex, sectionIndex, startPage = 1 } = await req.json();

    if (chapterIndex === 0) {
      return NextResponse.json({
        html: buildCoverHtml(),
        css: CSS,
        nextStartPage: startPage + 1,
      });
    }

    const chIdx = chapterIndex - 1;
    if (chIdx < 0 || chIdx >= CHAPTERS.length) {
      return NextResponse.json({ error: "잘못된 챕터" }, { status: 400 });
    }

    const ch = CHAPTERS[chIdx];

    if (sectionIndex === -1) {
      const html = buildOpenerHtml(ch, startPage);
      return NextResponse.json({ html, nextStartPage: startPage + 1 });
    }

    const sec = ch.sections[sectionIndex];
    if (!sec) return NextResponse.json({ error: "섹션을 찾을 수 없습니다." }, { status: 400 });

    const msg = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 6000,
      messages: [{ role: "user", content: buildCombinationPrompt(ch, sec) }],
    });
    const raw = msg.content[0];
    if (raw.type !== "text") throw new Error("응답 없음");
    let jsonStr = raw.text.trim().replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();

    let data: SectionData;
    try { data = JSON.parse(jsonStr); }
    catch { return NextResponse.json({ error: "JSON 파싱 실패: " + jsonStr.substring(0,200) }, { status: 500 }); }

    const html = buildCombinationPageHtml(ch, sec, data, startPage);
    return NextResponse.json({ html, nextStartPage: startPage + 1 });

  } catch (error) {
    console.error("오류:", error);
    return NextResponse.json({ error: "생성 중 오류 발생" }, { status: 500 });
  }
}
