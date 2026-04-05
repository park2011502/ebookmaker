import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const BASE_URL = "https://ebookmaker.vercel.app";

// ── 메이저 아르카나 페이지 정의 (2장씩) ──────────────────
const MAJOR_PAGES = [
  { cards: [{ file: "RWS_Tarot_00_Fool.jpg", name: "바보 (The Fool)", num: "0" }, { file: "RWS_Tarot_01_Magician.jpg", name: "마법사 (The Magician)", num: "I" }] },
  { cards: [{ file: "RWS_Tarot_02_High_Priestess.jpg", name: "여사제 (The High Priestess)", num: "II" }, { file: "RWS_Tarot_03_Empress.jpg", name: "여황제 (The Empress)", num: "III" }] },
  { cards: [{ file: "RWS_Tarot_04_Emperor.jpg", name: "황제 (The Emperor)", num: "IV" }, { file: "RWS_Tarot_05_Hierophant.jpg", name: "교황 (The Hierophant)", num: "V" }] },
  { cards: [{ file: "TheLovers.jpg", name: "연인 (The Lovers)", num: "VI" }, { file: "RWS_Tarot_07_Chariot.jpg", name: "전차 (The Chariot)", num: "VII" }] },
  { cards: [{ file: "RWS_Tarot_08_Strength.jpg", name: "힘 (Strength)", num: "VIII" }, { file: "RWS_Tarot_09_Hermit.jpg", name: "은둔자 (The Hermit)", num: "IX" }] },
  { cards: [{ file: "RWS_Tarot_10_Wheel_of_Fortune.jpg", name: "운명의 수레바퀴 (Wheel of Fortune)", num: "X" }, { file: "RWS_Tarot_11_Justice.jpg", name: "정의 (Justice)", num: "XI" }] },
  { cards: [{ file: "RWS_Tarot_12_Hanged_Man.jpg", name: "매달린 사람 (The Hanged Man)", num: "XII" }, { file: "RWS_Tarot_13_Death.jpg", name: "죽음 (Death)", num: "XIII" }] },
  { cards: [{ file: "RWS_Tarot_14_Temperance.jpg", name: "절제 (Temperance)", num: "XIV" }, { file: "RWS_Tarot_15_Devil.jpg", name: "악마 (The Devil)", num: "XV" }] },
  { cards: [{ file: "RWS_Tarot_16_Tower.jpg", name: "탑 (The Tower)", num: "XVI" }, { file: "RWS_Tarot_17_Star.jpg", name: "별 (The Star)", num: "XVII" }] },
  { cards: [{ file: "RWS_Tarot_18_Moon.jpg", name: "달 (The Moon)", num: "XVIII" }, { file: "RWS_Tarot_19_Sun.jpg", name: "태양 (The Sun)", num: "XIX" }] },
  { cards: [{ file: "RWS_Tarot_20_Judgement.jpg", name: "심판 (Judgement)", num: "XX" }, { file: "RWS_Tarot_21_World.jpg", name: "세계 (The World)", num: "XXI" }] },
];

// ── 마이너 아르카나 페이지 정의 (4장씩) ──────────────────
const MINOR_PAGES = [
  { suit: "컵 (Cups) — 감정과 직관", cards: [{ file: "Cups01.jpg", name: "컵 에이스" }, { file: "Cups02.jpg", name: "컵 2" }, { file: "Cups03.jpg", name: "컵 3" }, { file: "Cups04.jpg", name: "컵 4" }] },
  { suit: "컵 (Cups) — 감정과 직관", cards: [{ file: "Cups05.jpg", name: "컵 5" }, { file: "Cups06.jpg", name: "컵 6" }, { file: "Cups07.jpg", name: "컵 7" }, { file: "Cups08.jpg", name: "컵 8" }] },
  { suit: "컵 (Cups) — 감정과 직관", cards: [{ file: "Cups09.jpg", name: "컵 9" }, { file: "Cups10.jpg", name: "컵 10" }, { file: "Cups11.jpg", name: "컵 페이지" }, { file: "Cups12.jpg", name: "컵 나이트" }] },
  { suit: "컵 (Cups) — 감정과 직관", cards: [{ file: "Cups13.jpg", name: "컵 퀸" }, { file: "Cups14.jpg", name: "컵 킹" }, { file: "Wands01.jpg", name: "완드 에이스" }, { file: "Wands02.jpg", name: "완드 2" }] },
  { suit: "완드 (Wands) — 열정과 도전", cards: [{ file: "Wands03.jpg", name: "완드 3" }, { file: "Wands04.jpg", name: "완드 4" }, { file: "Wands05.jpg", name: "완드 5" }, { file: "Wands06.jpg", name: "완드 6" }] },
  { suit: "완드 (Wands) — 열정과 도전", cards: [{ file: "Wands07.jpg", name: "완드 7" }, { file: "Wands08.jpg", name: "완드 8" }, { file: "Tarot_Nine_of_Wands.jpg", name: "완드 9" }, { file: "Wands10.jpg", name: "완드 10" }] },
  { suit: "완드 (Wands) — 열정과 도전", cards: [{ file: "Wands11.jpg", name: "완드 페이지" }, { file: "Wands12.jpg", name: "완드 나이트" }, { file: "Wands13.jpg", name: "완드 퀸" }, { file: "Wands14.jpg", name: "완드 킹" }] },
  { suit: "검 (Swords) — 결단과 소통", cards: [{ file: "Swords01.jpg", name: "검 에이스" }, { file: "Swords02.jpg", name: "검 2" }, { file: "Swords03.jpg", name: "검 3" }, { file: "Swords04.jpg", name: "검 4" }] },
  { suit: "검 (Swords) — 결단과 소통", cards: [{ file: "Swords05.jpg", name: "검 5" }, { file: "Swords06.jpg", name: "검 6" }, { file: "Swords07.jpg", name: "검 7" }, { file: "Swords08.jpg", name: "검 8" }] },
  { suit: "검 (Swords) — 결단과 소통", cards: [{ file: "Swords09.jpg", name: "검 9" }, { file: "Swords10.jpg", name: "검 10" }, { file: "Swords11.jpg", name: "검 페이지" }, { file: "Swords12.jpg", name: "검 나이트" }] },
  { suit: "검 (Swords) — 결단과 소통", cards: [{ file: "Swords13.jpg", name: "검 퀸" }, { file: "Swords14.jpg", name: "검 킹" }, { file: "Pents01.jpg", name: "펜타클 에이스" }, { file: "Pents02.jpg", name: "펜타클 2" }] },
  { suit: "펜타클 (Pentacles) — 성과와 안정", cards: [{ file: "Pents03.jpg", name: "펜타클 3" }, { file: "Pents04.jpg", name: "펜타클 4" }, { file: "Pents05.jpg", name: "펜타클 5" }, { file: "Pents06.jpg", name: "펜타클 6" }] },
  { suit: "펜타클 (Pentacles) — 성과와 안정", cards: [{ file: "Pents07.jpg", name: "펜타클 7" }, { file: "Pents08.jpg", name: "펜타클 8" }, { file: "Pents09.jpg", name: "펜타클 9" }, { file: "Pents10.jpg", name: "펜타클 10" }] },
  { suit: "펜타클 (Pentacles) — 성과와 안정", cards: [{ file: "Pents11.jpg", name: "펜타클 페이지" }, { file: "Pents12.jpg", name: "펜타클 나이트" }, { file: "Pents13.jpg", name: "펜타클 퀸" }, { file: "Pents14.jpg", name: "펜타클 킹" }] },
];

// ── 챕터 2~5 정의 (직업/커리어편) ──────────────────────
const CHAPTERS = [
  {
    number: 2, title: "커리어 타로의 시작 — 질문법과 리딩 준비",
    sections: [
      { title: "직업 관련 질문을 제대로 만드는 법", card: "RWS_Tarot_07_Chariot.jpg", cardName: "전차 (The Chariot)", extraCards: [{ file: "RWS_Tarot_08_Strength.jpg", name: "힘" }] },
      { title: "리딩 전 마음 세팅과 커리어 에너지 다루기", card: "RWS_Tarot_09_Hermit.jpg", cardName: "은둔자 (The Hermit)", extraCards: [{ file: "RWS_Tarot_02_High_Priestess.jpg", name: "여사제" }] },
      { title: "정방향과 역방향, 커리어 해석이 달라지는 원리", card: "RWS_Tarot_11_Justice.jpg", cardName: "정의 (Justice)", extraCards: [{ file: "RWS_Tarot_10_Wheel_of_Fortune.jpg", name: "운명의 수레바퀴" }] },
      { title: "카드가 전하는 커리어 메시지를 읽는 5가지 원칙", card: "RWS_Tarot_21_World.jpg", cardName: "세계 (The World)", extraCards: [{ file: "RWS_Tarot_04_Emperor.jpg", name: "황제" }] },
    ],
  },
  {
    number: 3, title: "카드 위치와 조합 해석 — 커리어 리딩의 핵심",
    sections: [
      { title: "3카드 스프레드 — 과거/현재/미래 커리어 흐름", card: "Pents08.jpg", cardName: "펜타클 8", extraCards: [{ file: "RWS_Tarot_07_Chariot.jpg", name: "전차" }, { file: "RWS_Tarot_19_Sun.jpg", name: "태양" }] },
      { title: "5카드 스프레드 — 상황/원인/장애/조언/결과", card: "Wands03.jpg", cardName: "완드 3", extraCards: [{ file: "Pents05.jpg", name: "펜타클 5" }, { file: "RWS_Tarot_17_Star.jpg", name: "별" }] },
      { title: "카드 조합 해석 — 함께 나오면 달라지는 커리어 의미", card: "Pents03.jpg", cardName: "펜타클 3", extraCards: [{ file: "RWS_Tarot_16_Tower.jpg", name: "탑" }, { file: "RWS_Tarot_07_Chariot.jpg", name: "전차" }] },
      { title: "위치별 강화 및 약화 — 같은 카드도 자리가 다르면", card: "RWS_Tarot_02_High_Priestess.jpg", cardName: "여사제", extraCards: [{ file: "RWS_Tarot_20_Judgement.jpg", name: "심판" }] },
    ],
  },
  {
    number: 4, title: "커리어 상담 실전 완전 정복 I — 취업·이직·승진",
    sections: [
      { title: "취업 운 — 합격 가능성과 최적의 타이밍", card: "RWS_Tarot_19_Sun.jpg", cardName: "태양 (The Sun)", extraCards: [{ file: "RWS_Tarot_07_Chariot.jpg", name: "전차" }, { file: "Wands08.jpg", name: "완드 8" }] },
      { title: "이직 운 — 지금 옮겨도 될까", card: "RWS_Tarot_00_Fool.jpg", cardName: "바보 (The Fool)", extraCards: [{ file: "Cups08.jpg", name: "컵 8" }, { file: "RWS_Tarot_13_Death.jpg", name: "죽음" }] },
      { title: "승진 및 연봉 협상 — 언제 요구할까", card: "RWS_Tarot_04_Emperor.jpg", cardName: "황제 (The Emperor)", extraCards: [{ file: "Pents06.jpg", name: "펜타클 6" }, { file: "RWS_Tarot_11_Justice.jpg", name: "정의" }] },
      { title: "직장 내 인간관계 — 상사, 동료, 팀워크", card: "Pents03.jpg", cardName: "펜타클 3", extraCards: [{ file: "RWS_Tarot_15_Devil.jpg", name: "악마" }, { file: "Swords03.jpg", name: "검 3" }] },
    ],
  },
  {
    number: 5, title: "커리어 상담 실전 완전 정복 II — 창업·적성·미래",
    sections: [
      { title: "창업 및 프리랜서 — 독립해도 될까", card: "Wands01.jpg", cardName: "완드 에이스", extraCards: [{ file: "RWS_Tarot_04_Emperor.jpg", name: "황제" }, { file: "RWS_Tarot_10_Wheel_of_Fortune.jpg", name: "운명의 수레바퀴" }] },
      { title: "적성 및 천직 — 내가 잘할 수 있는 일은", card: "RWS_Tarot_09_Hermit.jpg", cardName: "은둔자 (The Hermit)", extraCards: [{ file: "RWS_Tarot_08_Strength.jpg", name: "힘" }, { file: "RWS_Tarot_19_Sun.jpg", name: "태양" }] },
      { title: "직업적 위기 및 슬럼프 — 어떻게 극복할까", card: "RWS_Tarot_16_Tower.jpg", cardName: "탑 (The Tower)", extraCards: [{ file: "RWS_Tarot_17_Star.jpg", name: "별" }, { file: "RWS_Tarot_20_Judgement.jpg", name: "심판" }] },
      { title: "커리어 고민별 추천 스프레드 완전 가이드", card: "RWS_Tarot_21_World.jpg", cardName: "세계 (The World)", extraCards: [{ file: "Pents08.jpg", name: "펜타클 8" }, { file: "RWS_Tarot_17_Star.jpg", name: "별" }] },
      { title: "나를 위한 리딩 — 커리어 마인드와 성장 준비", card: "RWS_Tarot_08_Strength.jpg", cardName: "힘 (Strength)", extraCards: [{ file: "RWS_Tarot_21_World.jpg", name: "세계" }, { file: "Wands01.jpg", name: "완드 에이스" }] },
    ],
  },
];

// ── CSS (네이비/딥블루 톤) ──────────────────────────────
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --cream:#F4F6FA;--cream-mid:#E8EDF5;
  --navy:#1B3A6B;--navy-mid:#2E5499;--navy-lt:#7BA3D4;--navy-pale:#EEF3FA;--navy-faint:#F4F7FC;
  --blue:#2563B0;--blue-lt:#93B8E0;
  --dark:#0D1B2A;--mid:#2C4A6E;--light:#5B7FA8;--divider:#C5D4E8;
  --serif:'Noto Serif KR',Georgia,serif;--sans:'Noto Sans KR',sans-serif;--display:'Playfair Display','Noto Serif KR',serif;
}
html,body{background:#2C4A6E;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.pg{width:148mm;min-height:210mm;background:var(--cream);margin:0 auto 16px;display:flex;flex-direction:column;font-family:var(--serif);page-break-after:always;page-break-inside:avoid;}
@media print{html,body{background:none;}.pg{margin:0;box-shadow:none;}@page{size:A5;margin:0;}}
.pg-hd{display:flex;justify-content:space-between;align-items:center;padding:8px 18px 7px;border-bottom:0.5px solid var(--divider);flex-shrink:0;}
.pg-hd span{font-family:var(--sans);font-size:6.5px;color:var(--light);letter-spacing:0.3px;}
.pg-ft{display:flex;justify-content:space-between;align-items:center;padding:7px 18px 8px;border-top:0.5px solid var(--divider);flex-shrink:0;margin-top:auto;}
.pg-ft .pn{font-family:var(--display);font-size:10px;color:var(--light);}
.pg-ft .pt{font-family:var(--sans);font-size:6.5px;color:var(--navy-lt);letter-spacing:1.5px;text-transform:uppercase;}
.pg-body{padding:10px 17px 20px;display:flex;flex-direction:column;gap:0;flex:1;}

/* 카드 레퍼런스 — 메이저 */
.card-ref-half{flex:1;display:flex;flex-direction:row;gap:12px;padding:8px 0;border-bottom:0.5px solid var(--divider);}
.card-ref-half:last-child{border-bottom:none;}
.card-ref-img{flex-shrink:0;text-align:center;}
.card-ref-img img{width:52px;border-radius:3px;box-shadow:2px 4px 12px rgba(0,30,80,0.22);display:block;}
.card-ref-img .crn{font-family:var(--display);font-size:7px;color:var(--light);text-align:center;margin-top:3px;font-style:italic;}
.card-ref-content{flex:1;}
.card-ref-name{font-family:var(--display);font-size:12px;font-weight:700;color:var(--dark);margin-bottom:2px;}
.card-ref-num{font-family:var(--display);font-size:8px;color:var(--navy-lt);margin-bottom:5px;letter-spacing:1px;}
.card-ref-kw{font-family:var(--sans);font-size:8.5px;color:var(--blue);font-weight:600;margin-bottom:5px;letter-spacing:0.3px;}
.card-ref-up{margin-bottom:4px;}
.card-ref-down{margin-bottom:4px;}
.card-ref-label{font-family:var(--serif);font-size:8.5px;font-weight:600;color:var(--navy);margin-bottom:2px;}
.card-ref-text{font-family:var(--sans);font-size:9.5px;color:var(--mid);line-height:1.75;word-break:keep-all;}
.card-ref-consult{background:var(--navy-faint);border-left:2px solid var(--navy-lt);padding:4px 7px;margin-top:4px;border-radius:0 3px 3px 0;}
.card-ref-consult-label{font-family:var(--sans);font-size:7.5px;font-weight:600;color:var(--navy);margin-bottom:2px;}
.card-ref-consult-text{font-family:var(--sans);font-size:9px;color:var(--mid);line-height:1.7;word-break:keep-all;}

/* 카드 레퍼런스 — 마이너 */
.minor-suit-title{font-family:var(--serif);font-size:10px;font-weight:600;color:var(--navy);margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--navy-lt);flex-shrink:0;}
.minor-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:1;}
.minor-card{background:var(--navy-faint);border:0.5px solid var(--navy-lt);border-radius:4px;padding:8px;display:flex;flex-direction:column;}
.minor-card-top{display:flex;gap:7px;margin-bottom:5px;}
.minor-card-top img{width:36px;border-radius:2px;box-shadow:1px 2px 6px rgba(0,30,80,0.18);flex-shrink:0;}
.minor-card-name{font-family:var(--display);font-size:9.5px;font-weight:700;color:var(--dark);line-height:1.3;margin-bottom:2px;}
.minor-card-kw{font-family:var(--sans);font-size:7.5px;color:var(--blue);font-weight:600;}
.minor-card-body{}
.minor-card-row{margin-bottom:3px;}
.minor-card-rl{font-family:var(--serif);font-size:8px;font-weight:600;color:var(--navy);margin-bottom:1px;}
.minor-card-rt{font-family:var(--sans);font-size:8.5px;color:var(--mid);line-height:1.65;word-break:keep-all;}

/* 챕터 오프너 */
.opener-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 26px;text-align:center;}
.op-label{font-family:var(--display);font-size:9px;color:var(--navy-mid);letter-spacing:5px;text-transform:uppercase;margin-bottom:6px;}
.op-num{font-family:var(--display);font-size:68px;font-weight:700;color:var(--navy-lt);line-height:1;margin-bottom:4px;}
.op-title{font-family:var(--display);font-size:18px;font-weight:700;color:var(--dark);line-height:1.3;margin-bottom:10px;}
.op-rule{width:44px;height:1.5px;background:var(--navy);margin:0 auto 14px;}
.op-desc{font-family:var(--serif);font-size:11px;color:var(--mid);font-style:italic;line-height:1.9;margin-bottom:18px;word-break:keep-all;}
.op-sections{width:100%;background:var(--navy-faint);border:1px solid var(--navy-lt);border-radius:5px;padding:13px 18px;text-align:left;}
.op-sections h4{font-family:var(--sans);font-size:8px;font-weight:600;color:var(--navy);letter-spacing:2px;text-transform:uppercase;margin-bottom:9px;}
.op-sections ul{list-style:none;display:flex;flex-direction:column;gap:7px;}
.op-sections li{font-family:var(--sans);font-size:11.5px;color:var(--mid);padding-left:13px;position:relative;line-height:1.6;}
.op-sections li::before{content:'›';position:absolute;left:0;color:var(--navy-mid);}

/* 섹션 내용 */
.sec-badge{display:flex;align-items:center;gap:6px;margin-bottom:4px;}
.sec-badge .sn{font-family:var(--display);font-size:9px;font-weight:700;color:var(--navy-lt);letter-spacing:1px;}
.sec-badge .sl{font-family:var(--sans);font-size:6.5px;color:var(--navy);letter-spacing:2px;text-transform:uppercase;}
.sec-title{font-family:var(--display);font-size:17px;font-weight:700;color:var(--dark);line-height:1.25;letter-spacing:-0.3px;margin-bottom:3px;}
.sec-rule{width:28px;height:2px;background:var(--navy);margin-bottom:10px;flex-shrink:0;}
.card-callout{display:flex;gap:12px;background:var(--navy-faint);border:1px solid var(--navy-lt);border-radius:5px;padding:12px 13px;margin:9px 0;flex-shrink:0;}
.cc-img{flex-shrink:0;text-align:center;}
.cc-img img{width:56px;border-radius:3px;box-shadow:2px 4px 12px rgba(0,30,80,0.22);display:block;}
.cc-name{font-family:var(--sans);font-size:7px;color:var(--light);font-style:italic;margin-top:4px;line-height:1.4;text-align:center;}
.cc-body h4{font-family:var(--serif);font-size:12.5px;font-weight:600;color:var(--navy);margin-bottom:6px;}
.cc-body p{font-family:var(--sans);font-size:12px;color:var(--mid);line-height:1.9;word-break:keep-all;}
.cc-tagline{display:block;margin-top:5px;font-family:var(--serif);font-size:9px;font-style:italic;color:var(--navy-mid);}
.multi-cards{display:flex;gap:10px;margin:9px 0;flex-shrink:0;}
.mini-card{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;}
.mini-card img{width:44px;border-radius:3px;box-shadow:2px 4px 10px rgba(0,30,80,0.2);display:block;}
.mini-card .mn{font-family:var(--sans);font-size:6.5px;color:var(--light);text-align:center;font-style:italic;line-height:1.3;}
.mini-card .mi{font-family:var(--sans);font-size:7.5px;color:var(--mid);text-align:center;line-height:1.35;word-break:keep-all;}
.sub-h{font-family:var(--serif);font-size:13px;font-weight:600;color:var(--navy);margin:11px 0 6px;line-height:1.4;}
.body-p{font-family:var(--sans);font-size:12.5px;color:var(--dark);line-height:2.0;letter-spacing:0.05px;margin-bottom:8px;word-break:keep-all;}
.cmp-row{display:flex;gap:8px;margin:8px 0;flex-shrink:0;}
.bad-box{border-left:3px solid var(--blue);background:#EEF3FA;border-radius:0 4px 4px 0;padding:9px 12px;flex:1;}
.good-box{border-left:3px solid var(--navy);background:var(--navy-pale);border-radius:0 4px 4px 0;padding:9px 12px;flex:1;}
.box-title{font-family:var(--serif);font-size:11.5px;font-weight:600;margin-bottom:6px;}
.bad-box .box-title{color:var(--dark);}.good-box .box-title{color:var(--navy);}
.bad-box ul,.good-box ul{list-style:none;display:flex;flex-direction:column;gap:5px;}
.bad-box li,.good-box li{font-family:var(--sans);font-size:11px;color:var(--mid);padding-left:11px;position:relative;line-height:1.7;word-break:keep-all;}
.bad-box li::before{content:'·';position:absolute;left:1px;color:var(--blue);font-size:14px;line-height:1.25;}
.good-box li::before{content:'›';position:absolute;left:1px;color:var(--navy);font-size:12px;line-height:1.35;}
.data-table{width:100%;border-collapse:collapse;margin:9px 0;flex-shrink:0;}
.data-table th{background:var(--navy-pale);color:var(--navy);font-family:var(--serif);font-weight:600;padding:6px 9px;border:1px solid var(--navy-lt);text-align:center;font-size:10.5px;}
.data-table td{font-family:var(--sans);font-size:10.5px;color:var(--dark);padding:6px 9px;border:1px solid var(--divider);line-height:1.6;word-break:keep-all;vertical-align:top;}
.data-table tr:nth-child(even) td{background:var(--cream-mid);}
.quote-box{background:var(--navy);border-radius:5px;padding:10px 14px;margin:8px 0;flex-shrink:0;text-align:center;}
.quote-box p{font-family:var(--display);font-size:11.5px;font-style:italic;color:#fff;line-height:1.7;}
.tip-box{background:var(--navy-pale);border:1px solid var(--navy-lt);border-radius:4px;padding:10px 13px;margin:8px 0;flex-shrink:0;}
.tip-title{font-family:var(--sans);font-size:8px;font-weight:600;color:var(--navy);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;}
.tip-box p{font-family:var(--sans);font-size:11.5px;color:#1B3A6B;line-height:1.8;word-break:keep-all;}
.case-box{background:var(--cream-mid);border:1px solid var(--divider);border-radius:5px;padding:9px 12px;margin:6px 0;flex-shrink:0;}
.case-title{font-family:var(--serif);font-size:11px;font-weight:600;color:var(--blue);letter-spacing:1px;margin-bottom:8px;}
.case-q{font-family:var(--sans);font-size:10px;color:var(--navy);font-style:italic;line-height:1.65;margin-bottom:5px;word-break:keep-all;}
.case-a{font-family:var(--sans);font-size:10px;color:var(--dark);line-height:1.7;word-break:keep-all;}
.div-rule{height:0.5px;background:var(--divider);margin:9px 0 7px;flex-shrink:0;}
.summary-list{list-style:none;display:flex;flex-direction:column;gap:9px;margin:10px 0;}
.summary-list li{font-family:var(--sans);font-size:11.5px;color:var(--dark);padding-left:18px;position:relative;line-height:1.75;word-break:keep-all;}
.summary-list li::before{content:'✦';position:absolute;left:0;color:var(--navy);font-size:9px;line-height:1.8;}
.quiz-box{background:var(--navy-pale);border:2px solid var(--navy-lt);border-radius:6px;padding:9px 12px;margin:7px 0;flex-shrink:0;}
.quiz-title{font-family:var(--serif);font-size:10.5px;font-weight:700;color:var(--navy);margin-bottom:7px;letter-spacing:0.5px;}
.quiz-q{font-family:var(--sans);font-size:10px;color:var(--dark);line-height:1.7;margin-bottom:5px;word-break:keep-all;font-weight:500;}
.quiz-hint{font-family:var(--serif);font-size:9px;color:var(--mid);font-style:italic;line-height:1.6;margin-bottom:5px;word-break:keep-all;}
.quiz-answer-box{background:var(--cream-mid);border-left:3px solid var(--navy);padding:8px 11px;border-radius:0 4px 4px 0;}
.quiz-answer-label{font-family:var(--sans);font-size:8px;font-weight:600;color:var(--navy);margin-bottom:4px;letter-spacing:1px;text-transform:uppercase;}
.quiz-answer{font-family:var(--sans);font-size:9.5px;color:var(--dark);line-height:1.7;word-break:keep-all;}
.cover-top{background:var(--navy);padding:24px 0 18px;text-align:center;flex-shrink:0;}
.cover-vol-en{font-family:var(--display);font-size:8px;letter-spacing:5px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:5px;}
.cover-vol-kr{font-family:var(--serif);font-size:20px;font-weight:600;color:#fff;letter-spacing:5px;}
.cover-cards-row{display:flex;justify-content:center;align-items:flex-end;gap:10px;padding:26px 24px 18px;flex-shrink:0;}
.c-card{display:flex;flex-direction:column;align-items:center;gap:5px;}
.c-card img{border-radius:4px;box-shadow:4px 8px 22px rgba(0,20,60,0.28);display:block;}
.c-card .clbl{font-family:var(--display);font-size:6.5px;color:var(--light);letter-spacing:1px;text-transform:uppercase;}
.cover-title-block{text-align:center;padding:4px 36px 14px;flex-shrink:0;}
.cover-main-title{font-family:var(--display);font-size:30px;font-weight:700;color:var(--dark);letter-spacing:-1px;line-height:1.1;margin-bottom:10px;}
.cover-rule{width:44px;height:1.5px;background:var(--navy);margin:0 auto 11px;}
.cover-subtitle{font-family:var(--serif);font-size:11px;font-weight:300;color:var(--mid);font-style:italic;line-height:1.7;margin-bottom:4px;}
.cover-tagline{font-family:var(--sans);font-size:8.5px;color:var(--light);letter-spacing:1px;}
.cover-dots{display:flex;justify-content:center;gap:7px;padding:4px 0 12px;flex-shrink:0;}
.cover-dots span{width:6px;height:6px;border-radius:50%;background:var(--navy-lt);display:inline-block;}
.cover-dots .on{background:var(--navy);}
.cover-learn{margin:0 26px;background:var(--navy-faint);border:1px solid var(--navy-lt);border-radius:5px;padding:13px 18px 12px;flex-shrink:0;}
.cover-learn h4{font-family:var(--sans);font-size:7.5px;font-weight:600;color:var(--navy);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:9px;}
.cover-learn ul{list-style:none;display:flex;flex-direction:column;gap:5px;}
.cover-learn li{font-family:var(--sans);font-size:9.5px;color:var(--mid);padding-left:14px;position:relative;line-height:1.55;}
.cover-learn li::before{content:'＋';position:absolute;left:0;color:var(--navy-mid);font-size:9px;line-height:1.55;}
.cover-toc{margin:11px 26px 0;display:grid;grid-template-columns:repeat(5,1fr);gap:6px;}
.toc-cell{background:var(--cream-mid);border:1px solid var(--divider);border-radius:4px;padding:7px 5px;text-align:center;}
.toc-cell .tn{font-family:var(--display);font-size:13px;font-weight:700;color:var(--navy-lt);line-height:1;margin-bottom:3px;}
.toc-cell .tl{font-family:var(--sans);font-size:6.5px;color:var(--mid);line-height:1.4;word-break:keep-all;}
.cover-bottom{margin-top:auto;background:var(--navy);padding:11px 26px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
.cover-bottom-l{font-family:var(--display);font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.8);text-transform:uppercase;}
.cover-bottom-r{font-family:var(--sans);font-size:7.5px;color:rgba(255,255,255,0.6);}`;

// ── 표지 ──────────────────────────────────────────────
function buildCoverHtml(): string {
  const cards = [
    { file: "RWS_Tarot_07_Chariot.jpg", label: "The Chariot", w: 48, mb: 12, op: 0.82 },
    { file: "RWS_Tarot_08_Strength.jpg", label: "Strength", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_21_World.jpg", label: "The World", w: 80, mb: 0, op: 1 },
    { file: "RWS_Tarot_19_Sun.jpg", label: "The Sun", w: 62, mb: 5, op: 1 },
    { file: "Pents08.jpg", label: "Pentacles VIII", w: 48, mb: 12, op: 0.82 },
  ];
  return `<div class="pg"><div class="cover-top"><div class="cover-vol-en">Volume 01 · Tarot Career Guide</div><div class="cover-vol-kr">제 1 권</div></div><div class="cover-cards-row">${cards.map(c=>`<div class="c-card"><img src="${BASE_URL}/cards/${c.file}" style="width:${c.w}px;margin-bottom:${c.mb}px;opacity:${c.op};" alt="${c.label}"><div class="clbl">${c.label}</div></div>`).join("")}</div><div class="cover-title-block"><div class="cover-main-title">3초만에 외워지는<br>마법의 직업백서</div><div class="cover-rule"></div><div class="cover-subtitle">타로로 꿰뚫는 나의 커리어 흐름</div><div class="cover-tagline">제1권 · 이 책 한 권으로 타로 커리어 상담사 완전 정복</div></div><div class="cover-dots"><span></span><span class="on"></span><span></span></div><div class="cover-learn"><h4>이 책에서 배울 것들</h4><ul><li>메이저 아르카나 22장 + 마이너 56장 커리어 해석 완전 정복</li><li>정방향·역방향·위치별 해석이 한눈에</li><li>3카드·5카드 스프레드 실전 적용법</li><li>취업·이직·승진·창업·적성 실전 케이스</li><li>이 책 한 권으로 타로 커리어 상담사 데뷔 가능</li></ul></div><div class="cover-toc">${["카드레퍼런스","질문법·준비","위치·조합","실전Ⅰ","실전Ⅱ"].map((t,i)=>`<div class="toc-cell"><div class="tn">0${i+1}</div><div class="tl">${t}</div></div>`).join("")}</div><div class="cover-bottom"><div class="cover-bottom-l">Tarot Career Guide</div><div class="cover-bottom-r">제1권 · 타로 커리어 상담사 완전 정복</div></div></div>`;
}

// ── 챕터 1 오프너 ──────────────────────────────────────
function buildChapter1OpenerHtml(pageNum: number): string {
  return `<div class="pg"><div class="pg-hd"><span>마법의 직업백서 | 타로로 꿰뚫는 나의 커리어 흐름</span><span>CHAPTER 01</span></div><div class="opener-body"><div class="op-label">CHAPTER</div><div class="op-num">01</div><div class="op-title">타로카드 78장<br>커리어 해석 레퍼런스</div><div class="op-rule"></div><div class="op-desc">이 챕터는 타로카드 78장의 직업·커리어 의미를 한눈에 정리한 레퍼런스입니다. 리딩 중 카드가 나왔을 때 바로 찾아볼 수 있도록 정방향·역방향·커리어 상담 적용법을 모두 담았습니다.</div><div class="op-sections"><h4>이번 챕터 구성</h4><ul><li>메이저 아르카나 22장 — 한 페이지에 2장씩 정리</li><li>마이너 아르카나 56장 — 원소별로 4장씩 정리</li><li>각 카드별 정방향·역방향·커리어 상담 적용법 수록</li></ul></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Career Guide</div></div></div>`;
}

// ── 메이저 카드 프롬프트 ────────────────────────────────
function buildMajorPrompt(card1: {file:string;name:string;num:string}, card2: {file:string;name:string;num:string}): string {
  return `타로 전자책 작가입니다. 아래 두 메이저 아르카나 카드의 직업·커리어 해석을 JSON으로만 작성하세요. JSON 외 텍스트 절대 금지.

카드1: ${card1.name} (${card1.num}번)
카드2: ${card2.name} (${card2.num}번)

중요 규칙:
- 모든 문장은 반드시 마침표(.)로 완전하게 끝낼 것.
- 직업/커리어/취업/이직 리딩 전문가 관점으로 구어체로 작성할 것.
- 각 항목을 충분히 자세하게 작성하여 내용이 풍부하게 보일 것.

{
  "card1": {
    "name": "${card1.name}",
    "num": "${card1.num}",
    "keywords": "커리어 핵심 키워드 3개 (예: 새로운 도전 · 승진 기회 · 리더십)",
    "upright": "정방향 커리어 해석. 이 카드가 직업 리딩에서 정방향으로 나왔을 때 의미를 구어체로 3문장 이상 충분히 설명. 반드시 마침표로 끝낼 것.",
    "reversed": "역방향 커리어 해석. 이 카드가 역방향으로 나왔을 때 의미를 구어체로 3문장 이상 충분히 설명. 반드시 마침표로 끝낼 것.",
    "consult": "커리어 상담에서 이 카드가 나오면 어떤 상황을 의미하는지 구어체로 2문장. 반드시 마침표로 끝낼 것."
  },
  "card2": {
    "name": "${card2.name}",
    "num": "${card2.num}",
    "keywords": "커리어 핵심 키워드 3개",
    "upright": "정방향 커리어 해석 3문장 이상. 반드시 마침표로 끝낼 것.",
    "reversed": "역방향 커리어 해석 3문장 이상. 반드시 마침표로 끝낼 것.",
    "consult": "커리어 상담 적용 2문장. 반드시 마침표로 끝낼 것."
  }
}
JSON만 출력.`;
}

// ── 마이너 카드 프롬프트 ────────────────────────────────
function buildMinorPrompt(suit: string, cards: {file:string;name:string}[]): string {
  return `타로 전자책 작가입니다. 아래 마이너 아르카나 카드들의 직업·커리어 해석을 JSON으로만 작성하세요. JSON 외 텍스트 절대 금지.

원소: ${suit}
카드: ${cards.map(c=>c.name).join(", ")}

중요 규칙:
- 모든 문장은 반드시 마침표(.)로 완전하게 끝낼 것.
- 직업/커리어/취업/이직 리딩 전문가 관점으로 구어체로 작성할 것.
- 각 항목 충분히 자세하게 작성할 것.

{
  "cards": [
    ${cards.map(c=>`{
      "name": "${c.name}",
      "keywords": "커리어 핵심 키워드 2~3개",
      "upright": "정방향 커리어 해석 2문장. 반드시 마침표로 끝낼 것.",
      "reversed": "역방향 커리어 해석 2문장. 반드시 마침표로 끝낼 것."
    }`).join(",\n    ")}
  ]
}
JSON만 출력.`;
}

// ── 메이저 카드 HTML 빌더 ──────────────────────────────
interface MajorCardData {
  name: string; num: string; keywords: string;
  upright: string; reversed: string; consult: string;
}

function buildMajorPageHtml(
  card1Data: MajorCardData, card1File: string,
  card2Data: MajorCardData, card2File: string,
  pageNum: number
): string {
  const renderHalf = (data: MajorCardData, file: string) =>
    `<div class="card-ref-half">
      <div class="card-ref-img">
        <img src="${BASE_URL}/cards/${file}" alt="${data.name}">
        <div class="crn">${data.num}</div>
      </div>
      <div class="card-ref-content">
        <div class="card-ref-name">${data.name}</div>
        <div class="card-ref-kw">🔑 ${data.keywords}</div>
        <div class="card-ref-up">
          <div class="card-ref-label">☀️ 정방향</div>
          <div class="card-ref-text">${data.upright}</div>
        </div>
        <div class="card-ref-down">
          <div class="card-ref-label">🌙 역방향</div>
          <div class="card-ref-text">${data.reversed}</div>
        </div>
        <div class="card-ref-consult">
          <div class="card-ref-consult-label">💬 상담에서 나오면</div>
          <div class="card-ref-consult-text">${data.consult}</div>
        </div>
      </div>
    </div>`;

  return `<div class="pg">
  <div class="pg-hd"><span>마법의 직업백서 | 타로로 꿰뚫는 나의 커리어 흐름</span><span>CH 01 · 메이저 아르카나 커리어 해석</span></div>
  <div class="pg-body">
    ${renderHalf(card1Data, card1File)}
    ${renderHalf(card2Data, card2File)}
  </div>
  <div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Career Guide</div></div>
</div>`;
}

// ── 마이너 카드 HTML 빌더 ──────────────────────────────
interface MinorCardData { name: string; keywords: string; upright: string; reversed: string; }

function buildMinorPageHtml(
  suit: string,
  cardsData: MinorCardData[],
  cardFiles: {file:string;name:string}[],
  pageNum: number
): string {
  const grid = cardsData.map((c, i) =>
    `<div class="minor-card">
      <div class="minor-card-top">
        <img src="${BASE_URL}/cards/${cardFiles[i].file}" alt="${c.name}">
        <div>
          <div class="minor-card-name">${c.name}</div>
          <div class="minor-card-kw">🔑 ${c.keywords}</div>
        </div>
      </div>
      <div class="minor-card-body">
        <div class="minor-card-row">
          <div class="minor-card-rl">☀️ 정방향</div>
          <div class="minor-card-rt">${c.upright}</div>
        </div>
        <div class="minor-card-row">
          <div class="minor-card-rl">🌙 역방향</div>
          <div class="minor-card-rt">${c.reversed}</div>
        </div>
      </div>
    </div>`
  ).join("");

  return `<div class="pg">
  <div class="pg-hd"><span>마법의 직업백서 | 타로로 꿰뚫는 나의 커리어 흐름</span><span>CH 01 · ${suit}</span></div>
  <div class="pg-body">
    <div class="minor-suit-title">🃏 ${suit}</div>
    <div class="minor-grid">${grid}</div>
  </div>
  <div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Career Guide</div></div>
</div>`;
}

// ── 챕터 오프너 ────────────────────────────────────────
function buildOpenerHtml(chapterNum: number, chapterTitle: string, chapterDesc: string, sections: {title:string}[], pageNum: number): string {
  return `<div class="pg"><div class="pg-hd"><span>마법의 직업백서 | 타로로 꿰뚫는 나의 커리어 흐름</span><span>CHAPTER 0${chapterNum}</span></div><div class="opener-body"><div class="op-label">CHAPTER</div><div class="op-num">0${chapterNum}</div><div class="op-title">${chapterTitle}</div><div class="op-rule"></div><div class="op-desc">${chapterDesc}</div><div class="op-sections"><h4>이번 챕터에서 배울 것들</h4><ul>${sections.map(s=>`<li>${s.title}</li>`).join("")}</ul></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Career Guide</div></div></div>`;
}

// ── 섹션 HTML 빌더 ─────────────────────────────────────
interface ExtraCard { file: string; name: string; interp: string; }
interface CaseItem { question: string; answer: string; }
interface SectionData {
  title: string; cardFile: string; cardName: string;
  cardDesc: string; cardTagline: string;
  subheadings: { title: string; body: string }[];
  extraCards: ExtraCard[];
  badExamples: string[]; goodExamples: string[];
  tableHeaders: string[]; tableRows: { col1: string; col2: string; col3: string }[];
  quote: string; tip: string;
  cases: CaseItem[];
  summary: string[];
}

function trimSentences(text: string, max: number): string {
  if (!text) return "";
  const sentences = text.match(/[^。.!?！？]+[。.!?！？]+/g) || [text];
  return sentences.slice(0, max).join("").trim();
}

function buildSectionHtml(
  chapterNum: number, chapterTitle: string,
  sec: SectionData,
  extraCardFiles: { file: string; name: string }[],
  si: number, startPage: number
): string {
  let html = "";
  let pg = startPage;
  const hd = `<div class="pg-hd"><span>마법의 직업백서 | 타로로 꿰뚫는 나의 커리어 흐름</span><span>CH 0${chapterNum} · ${chapterTitle}</span></div>`;
  const safeTitle = sec.title.replace(/&/g, "&amp;");
  const badge = `<div class="sec-badge"><span class="sn">0${si+1}</span><span class="sl">Section</span></div><div class="sec-title">${safeTitle}</div><div class="sec-rule"></div>`;

  html += `<div class="pg">${hd}<div class="pg-body">${badge}<div class="card-callout"><div class="cc-img"><img src="${BASE_URL}/cards/${sec.cardFile}" alt="${sec.cardName}"><div class="cc-name">${sec.cardName}</div></div><div class="cc-body"><h4>💡 ${sec.cardName.replace(/\.+$/, "")}이 말하는 것</h4><p>${trimSentences(sec.cardDesc,4)}</p><span class="cc-tagline">${sec.cardTagline}</span></div></div>${sec.subheadings.slice(0,2).map(sh=>`<div class="sub-h">${sh.title}</div><p class="body-p">${trimSentences(sh.body,2)}</p>`).join("")}</div><div class="pg-ft"><div class="pn">${pg++}</div><div class="pt">Tarot Career Guide</div></div></div>`;

  const multiCardsHtml = extraCardFiles.length > 0
    ? `<div class="multi-cards">${extraCardFiles.map(c=>{const interp=sec.extraCards?.find(e=>e.file===c.file);return `<div class="mini-card"><img src="${BASE_URL}/cards/${c.file}" alt="${c.name}"><div class="mn">${c.name}</div><div class="mi">${trimSentences(interp?.interp??"",1)}</div></div>`;}).join("")}</div>`
    : "";
  html += `<div class="pg">${hd}<div class="pg-body">${badge}${multiCardsHtml}<div class="cmp-row"><div class="bad-box"><div class="box-title">✕ 이렇게 하면 안 돼요</div><ul>${sec.badExamples.slice(0,3).map(e=>`<li>${e}</li>`).join("")}</ul></div><div class="good-box"><div class="box-title">✓ 이렇게 해보세요</div><ul>${sec.goodExamples.slice(0,3).map(e=>`<li>${e}</li>`).join("")}</ul></div></div>${sec.subheadings[2]?`<div class="sub-h">${sec.subheadings[2].title}</div><p class="body-p">${trimSentences(sec.subheadings[2].body,3)}</p>`:""}<div class="quote-box"><p>"${sec.quote}"</p></div></div><div class="pg-ft"><div class="pn">${pg++}</div><div class="pt">Tarot Career Guide</div></div></div>`;

  html += `<div class="pg"><div class="pg-hd"><span>마법의 직업백서 | 타로로 꿰뚫는 나의 커리어 흐름</span><span>CH 0${chapterNum} · 실전 정리</span></div><div class="pg-body"><div class="sec-badge"><span class="sn">0${si+1}</span><span class="sl">실전 정리</span></div><div class="sec-title">${safeTitle}</div><div class="sec-rule"></div><table class="data-table"><thead><tr>${sec.tableHeaders.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${sec.tableRows.map(r=>`<tr><td>${r.col1}</td><td>${r.col2}</td><td>${r.col3}</td></tr>`).join("")}</tbody></table><div class="div-rule"></div><div class="sub-h">🌹 핵심 정리</div><p class="body-p">${trimSentences(sec.subheadings[0]?.body??"",2)}</p><div class="tip-box"><div class="tip-title">Golden Tip</div><p>${trimSentences(sec.tip,2)}</p></div></div><div class="pg-ft"><div class="pn">${pg++}</div><div class="pt">Tarot Career Guide</div></div></div>`;

  const secWithQuiz = sec as SectionData & { quiz?: { question: string; hint: string; answer: string } };
  const quizBlock = secWithQuiz.quiz
    ? `<div class="quiz-box"><div class="quiz-title">🎯 실전 퀴즈</div><p class="quiz-q">${secWithQuiz.quiz.question}</p><p class="quiz-hint">${secWithQuiz.quiz.hint}</p><div class="quiz-answer-box"><div class="quiz-answer-label">정답 해설 ▼</div><p class="quiz-answer">${trimSentences(secWithQuiz.quiz.answer,3)}</p></div></div>`
    : "";
  html += `<div class="pg"><div class="pg-hd"><span>마법의 직업백서 | 타로로 꿰뚫는 나의 커리어 흐름</span><span>CH 0${chapterNum} · 실전 상담 케이스</span></div><div class="pg-body"><div class="sec-badge"><span class="sn">0${si+1}</span><span class="sl">실전 상담 케이스</span></div><div class="sec-title">${safeTitle}</div><div class="sec-rule"></div>${sec.cases.slice(0,2).map((c,i)=>`<div class="case-box"><div class="case-title">💬 케이스 ${i+1}</div><p class="case-q">Q. ${c.question}</p><p class="case-a">A. ${trimSentences(c.answer,3)}</p></div>`).join("")}<div class="tip-box"><div class="tip-title">✦ 이 섹션 핵심 요약</div><p>${sec.summary.slice(0,2).join(" ")}</p></div>${quizBlock}</div><div class="pg-ft"><div class="pn">${pg++}</div><div class="pt">Tarot Career Guide</div></div></div>`;

  return html;
}

function buildSummaryHtml(chapterNum: number, chapterTitle: string, summary: string[], quote: string, isLastChapter: boolean, pageNum: number): string {
  return `<div class="pg"><div class="pg-hd"><span>마법의 직업백서 | 타로로 꿰뚫는 나의 커리어 흐름</span><span>CH 0${chapterNum} · 핵심 요약</span></div><div class="pg-body"><div class="sec-badge"><span class="sn">✦</span><span class="sl">Summary</span></div><div class="sec-title">CHAPTER 0${chapterNum} 핵심 요약</div><div class="sec-rule"></div><div class="quote-box"><p>"${quote}"</p></div><ul class="summary-list">${summary.map(s=>`<li>${s}</li>`).join("")}</ul><div class="div-rule"></div><div class="tip-box"><div class="tip-title">${isLastChapter?"마치며":"다음 챕터 미리보기"}</div><p>${isLastChapter?"이 책을 통해 타로는 단순한 점술이 아닌, 나 자신의 커리어 흐름을 깊이 이해하는 도구임을 깨달으셨기를 바랍니다. 이제 어떤 커리어 상담도 자신 있게 리딩할 수 있습니다.":`CHAPTER 0${chapterNum+1}에서는 더 깊은 실전 리딩 기술을 배웁니다. 지금까지 배운 카드 해석을 바탕으로 실제 상황에 바로 적용할 수 있는 스프레드와 케이스를 함께 알아볼게요.`}</p></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Career Guide</div></div></div>`;
}

function buildOpenerPrompt(chapterNum: number, chapterTitle: string, sections: {title:string}[]): string {
  return `타로 전자책 작가입니다. 챕터 오프너 설명을 JSON으로만 작성하세요.
챕터 ${chapterNum}: ${chapterTitle}
섹션: ${sections.map(s=>s.title).join(", ")}
{"chapterDesc":"이 챕터를 읽어야 하는 이유를 흥미롭고 공감되게 2~3문장으로. 직업/커리어 관점으로. 반드시 마침표로 완전하게 끝낼 것."}
JSON만 출력.`;
}

function buildSectionPrompt(
  chapterNum: number, chapterTitle: string,
  section: { title: string; card: string; cardName: string; extraCards: { file: string; name: string }[] },
  si: number
): string {
  const extraList = section.extraCards.map(c=>`- ${c.name} (${c.file})`).join("\n");

  if (chapterNum === 3) {
    return `타로 전자책 전문 작가입니다. 섹션 1개의 내용을 JSON으로만 작성하세요. JSON 외 텍스트 절대 금지.

챕터 3: ${chapterTitle}
섹션 ${si+1}: ${section.title}
참고 카드: ${section.cardName} (${section.card}), ${extraList}

핵심 지시:
- 직업/커리어 리딩 관점으로 작성할 것. 반드시 마침표로 끝낼 것.
- 어떤 카드가 나와도 적용할 수 있는 보편적 원칙을 가르칠 것.
- 메이저/마이너, 원소별, 정방향/역방향에 따른 커리어 해석 원칙 포함.

{
  "title": "${section.title}",
  "cardFile": "${section.card}",
  "cardName": "${section.cardName}",
  "cardDesc": "이 섹션 주제(${section.title})를 한눈에 설명하는 4~5문장. 커리어 리딩 위치/조합 원칙 소개. 반드시 마침표로 끝낼 것.",
  "cardTagline": "이 섹션의 핵심 원칙 한 줄.",
  "subheadings": [
    {"title": "🔮 소제목1 — 원칙 설명", "body": "5~6문장. 커리어 리딩에서 통용되는 위치/조합 해석 원칙. 반드시 마침표로 끝낼 것."},
    {"title": "💡 소제목2 — 원소별 적용", "body": "5~6문장. 컵/완드/검/펜타클이 커리어 위치에 오면 어떻게 해석하는지. 반드시 마침표로 끝낼 것."},
    {"title": "💬 소제목3 — 실전 적용법", "body": "5~6문장. 실제 커리어 리딩에서 이 원칙을 어떻게 적용하는지. 반드시 마침표로 끝낼 것."}
  ],
  "extraCards": [
    ${section.extraCards.map(c=>`{"file": "${c.file}", "name": "${c.name}", "interp": "이 카드가 해당 커리어 위치/조합에서 갖는 의미 한 줄."}`).join(",\n    ")}
  ],
  "badExamples": ["잘못된 커리어 해석 예시1.","잘못된 커리어 해석 예시2.","잘못된 커리어 해석 예시3.","잘못된 커리어 해석 예시4."],
  "goodExamples": ["올바른 커리어 해석 예시1.","올바른 커리어 해석 예시2.","올바른 커리어 해석 예시3.","올바른 커리어 해석 예시4."],
  "tableHeaders": ["위치/상황","어떤 카드든 이렇게 읽는다","주의할 점"],
  "tableRows": [
    {"col1":"위치/상황1","col2":"해석 원칙1","col3":"주의점1"},
    {"col1":"위치/상황2","col2":"해석 원칙2","col3":"주의점2"},
    {"col1":"위치/상황3","col2":"해석 원칙3","col3":"주의점3"},
    {"col1":"위치/상황4","col2":"해석 원칙4","col3":"주의점4"},
    {"col1":"위치/상황5","col2":"해석 원칙5","col3":"주의점5"}
  ],
  "quote": "커리어 위치/조합 해석의 핵심 원칙 한 문장.",
  "tip": "4~5문장. 어떤 카드가 나와도 바로 적용할 수 있는 커리어 리딩 팁. 반드시 마침표로 끝낼 것.",
  "cases": [
    {"question": "실제 커리어 배열 질문 1 (카드 3장 이상).", "answer": "4~5문장. 위치/조합 원칙을 적용한 풍부한 해석. 반드시 마침표로 끝낼 것."},
    {"question": "실제 커리어 배열 질문 2 (카드 3장 이상).", "answer": "4~5문장. 위치/조합 원칙을 적용한 풍부한 해석. 반드시 마침표로 끝낼 것."},
    {"question": "실제 커리어 배열 질문 3 (카드 3장 이상).", "answer": "4~5문장. 위치/조합 원칙을 적용한 풍부한 해석. 반드시 마침표로 끝낼 것."}
  ],
  "quiz": {
    "question": "연습 퀴즈: 아래 커리어 배열이 나왔을 때 어떻게 해석할까요? (카드 3장 위치 제시)",
    "hint": "힌트: 챕터 1에서 배운 카드 의미와 이 섹션의 원칙을 함께 적용해보세요.",
    "answer": "정답 해설: 위치별 원칙과 카드 의미를 조합한 완전한 해석. 반드시 마침표로 끝낼 것."
  },
  "summary": ["핵심 원칙 요약1.","핵심 원칙 요약2.","핵심 원칙 요약3.","핵심 원칙 요약4."]
}
JSON만 출력.`;
  }

  if (chapterNum === 4 || chapterNum === 5) {
    return `타로 전자책 전문 작가입니다. 섹션 1개의 내용을 JSON으로만 작성하세요. JSON 외 텍스트 절대 금지.

챕터 ${chapterNum}: ${chapterTitle}
섹션 ${si+1}: ${section.title}
대표 카드: ${section.cardName} (${section.card}), ${extraList}

핵심 지시:
- 직업/커리어 리딩 관점으로 작성할 것. 반드시 마침표로 끝낼 것.
- 이 상황(${section.title})에서 자주 나오는 카드 5~6가지를 다양하게 다룰 것.
- 독자가 어떤 카드가 나와도 이 커리어 상황을 해석할 수 있도록 여러 옵션 제공.
- 마지막 퀴즈는 실제 3~5장 배열을 제시하고 독자가 스스로 해석해보게 할 것.

{
  "title": "${section.title}",
  "cardFile": "${section.card}",
  "cardName": "${section.cardName}",
  "cardDesc": "이 상황(${section.title})의 커리어 타로 리딩 포인트 4~5문장. 어떤 카드가 나올 수 있는지 소개. 반드시 마침표로 끝낼 것.",
  "cardTagline": "이 상황 커리어 리딩의 핵심 포인트 한 줄.",
  "subheadings": [
    {"title": "🔮 소제목1 — 이 상황에서 자주 나오는 카드들", "body": "5~6문장. 이 커리어 상황에서 긍정 신호 카드(예: 전차, 태양, 세계)와 주의 신호 카드(예: 탑, 달, 검5)를 구체적으로 나열. 반드시 마침표로 끝낼 것."},
    {"title": "💡 소제목2 — 카드별 해석 옵션", "body": "5~6문장. 같은 커리어 질문에 다른 카드가 나올 때 해석이 어떻게 달라지는지 3가지 이상 옵션 포함. 반드시 마침표로 끝낼 것."},
    {"title": "💬 소제목3 — 배열 위치별 적용", "body": "5~6문장. 이 커리어 상황에서 3카드 또는 5카드 배열을 쓸 때 각 위치별로 어떻게 읽는지. 반드시 마침표로 끝낼 것."}
  ],
  "extraCards": [
    ${section.extraCards.map(c=>`{"file": "${c.file}", "name": "${c.name}", "interp": "이 커리어 상황(${section.title})에서 이 카드가 나오면 어떤 의미인지 한 줄."}`).join(",\n    ")}
  ],
  "badExamples": ["이 커리어 상황에서 잘못 해석하는 예시1.","잘못된 해석 예시2.","잘못된 해석 예시3.","잘못된 해석 예시4."],
  "goodExamples": ["올바른 커리어 해석 예시1.","올바른 커리어 해석 예시2.","올바른 커리어 해석 예시3.","올바른 커리어 해석 예시4."],
  "tableHeaders": ["나온 카드","이 커리어 상황에서의 의미","주의/조언"],
  "tableRows": [
    {"col1":"카드1 (구체적 카드명)","col2":"이 상황에서 의미1","col3":"조언1"},
    {"col1":"카드2 (구체적 카드명)","col2":"이 상황에서 의미2","col3":"조언2"},
    {"col1":"카드3 (구체적 카드명)","col2":"이 상황에서 의미3","col3":"조언3"},
    {"col1":"카드4 (구체적 카드명)","col2":"이 상황에서 의미4","col3":"조언4"},
    {"col1":"카드5 (구체적 카드명)","col2":"이 상황에서 의미5","col3":"조언5"}
  ],
  "quote": "이 커리어 상황 리딩의 핵심 메시지 한 문장.",
  "tip": "4~5문장. 이 커리어 상황 리딩에서 바로 쓸 수 있는 팁. 반드시 마침표로 끝낼 것.",
  "cases": [
    {"question": "이 커리어 상황 실제 상담 질문 1 (구체적 상황).", "answer": "4~5문장. 카드 3가지 이상 옵션 포함한 풍부한 답변. 반드시 마침표로 끝낼 것."},
    {"question": "이 커리어 상황 실제 상담 질문 2 (구체적 상황).", "answer": "4~5문장. 카드 3가지 이상 옵션 포함한 풍부한 답변. 반드시 마침표로 끝낼 것."},
    {"question": "이 커리어 상황 실제 상담 질문 3 (구체적 상황).", "answer": "4~5문장. 카드 3가지 이상 옵션 포함한 풍부한 답변. 반드시 마침표로 끝낼 것."}
  ],
  "quiz": {
    "question": "🎯 실전 퀴즈: 아래 커리어 배열이 나왔을 때 어떻게 해석할까요? 1번: [카드명] / 2번: [카드명] / 3번: [카드명] — 구체적인 카드 3~5장으로 실제 배열을 만들어 제시할 것.",
    "hint": "💭 힌트: 챕터 1의 카드 의미 + 챕터 3의 위치 원칙을 함께 적용해보세요.",
    "answer": "✅ 정답 해설: 각 위치의 카드 의미를 단계별로 풍부하게 설명하는 5~6문장. 반드시 마침표로 끝낼 것."
  },
  "summary": ["핵심 요약1.","핵심 요약2.","핵심 요약3.","핵심 요약4."]
}
JSON만 출력.`;
  }

  // 챕터 2
  return `JSON만 출력. 다른 텍스트 금지. 모든 값 반드시 마침표로 끝낼 것.
섹션: ${section.title} / 카드: ${section.cardName}

{"title":"${section.title}","cardFile":"${section.card}","cardName":"${section.cardName}","cardDesc":"4~5문장. 이 카드의 커리어 핵심 의미. 정방향과 역방향 포함. 반드시 마침표로 끝낼 것.","cardTagline":"한 줄.","subheadings":[{"title":"🔮 소제목1","body":"4~5문장. 커리어 핵심 내용을 구체적으로. 반드시 마침표로 끝낼 것."},{"title":"💡 소제목2","body":"4~5문장. 커리어 실전 적용법 포함. 반드시 마침표로 끝낼 것."},{"title":"💬 소제목3","body":"4~5문장. 커리어 예시와 함께 설명. 반드시 마침표로 끝낼 것."}],"extraCards":[${section.extraCards.map(c=>`{"file":"${c.file}","name":"${c.name}","interp":"커리어 리딩에서 한 줄 의미."}`).join(",")}],"badExamples":["예시1.","예시2.","예시3.","예시4."],"goodExamples":["예시1.","예시2.","예시3.","예시4."],"tableHeaders":["상황","정방향","역방향"],"tableRows":[{"col1":"상황1","col2":"정방향1","col3":"역방향1"},{"col1":"상황2","col2":"정방향2","col3":"역방향2"},{"col1":"상황3","col2":"정방향3","col3":"역방향3"},{"col1":"상황4","col2":"정방향4","col3":"역방향4"},{"col1":"상황5","col2":"정방향5","col3":"역방향5"}],"quote":"한 문장.","tip":"한 문장.","cases":[{"question":"질문1.","answer":"답변1."},{"question":"질문2.","answer":"답변2."},{"question":"질문3.","answer":"답변3."}],"quiz":{"question":"🎯 퀴즈: 카드 3장 커리어 배열 제시.","hint":"힌트 한 줄.","answer":"해설 한 문장."},"summary":["요약1.","요약2.","요약3.","요약4."]}`;
}

// ── API Route ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { chapterIndex, sectionIndex, startPage = 1 } = await req.json();

    if (chapterIndex === 0) {
      if (sectionIndex === -1) {
        const coverHtml = buildCoverHtml();
        const openerHtml = buildChapter1OpenerHtml(startPage);
        return NextResponse.json({
          html: coverHtml + openerHtml,
          css: CSS,
          chapterIndex: 0,
          sectionIndex: -1,
          totalSections: MAJOR_PAGES.length + MINOR_PAGES.length,
          nextStartPage: startPage + 1,
        });
      }

      if (sectionIndex < MAJOR_PAGES.length) {
        const page = MAJOR_PAGES[sectionIndex];
        const msg = await client.messages.create({
          model: "claude-opus-4-5",
          max_tokens: 4000,
          messages: [{ role: "user", content: buildMajorPrompt(page.cards[0], page.cards[1]) }],
        });
        const raw = msg.content[0];
        if (raw.type !== "text") throw new Error("응답 없음");
        let jsonStr = raw.text.trim().replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
        const data = JSON.parse(jsonStr);
        const html = buildMajorPageHtml(data.card1, page.cards[0].file, data.card2, page.cards[1].file, startPage);
        return NextResponse.json({
          html, chapterIndex: 0, sectionIndex,
          totalSections: MAJOR_PAGES.length + MINOR_PAGES.length,
          nextStartPage: startPage + 1,
        });
      }

      const minorIdx = sectionIndex - MAJOR_PAGES.length;
      const page = MINOR_PAGES[minorIdx];
      const msg = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 3000,
        messages: [{ role: "user", content: buildMinorPrompt(page.suit, page.cards) }],
      });
      const raw = msg.content[0];
      if (raw.type !== "text") throw new Error("응답 없음");
      let jsonStr = raw.text.trim().replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
      const data = JSON.parse(jsonStr);
      const html = buildMinorPageHtml(page.suit, data.cards, page.cards, startPage);
      return NextResponse.json({
        html, chapterIndex: 0, sectionIndex,
        totalSections: MAJOR_PAGES.length + MINOR_PAGES.length,
        nextStartPage: startPage + 1,
      });
    }

    const chIdx = chapterIndex - 1;
    if (chIdx < 0 || chIdx >= CHAPTERS.length) {
      return NextResponse.json({ error: "올바른 챕터 번호를 입력해주세요." }, { status: 400 });
    }

    const chapter = CHAPTERS[chIdx];
    const isLastChapter = chIdx === CHAPTERS.length - 1;

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
      const openerHtml = buildOpenerHtml(chapter.number, chapter.title, parsed.chapterDesc, chapter.sections, startPage);
      return NextResponse.json({
        html: openerHtml, css: "",
        chapterIndex, sectionIndex: -1,
        totalSections: chapter.sections.length,
        nextStartPage: startPage + 1,
      });
    }

    const section = chapter.sections[sectionIndex];
    if (!section) return NextResponse.json({ error: "섹션을 찾을 수 없습니다." }, { status: 400 });

    const msg = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: chapter.number === 2 ? 4000 : 16000,
      messages: [{ role: "user", content: buildSectionPrompt(chapter.number, chapter.title, section, sectionIndex) }],
    });
    const raw = msg.content[0];
    if (raw.type !== "text") throw new Error("응답 없음");
    let jsonStr = raw.text.trim().replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();

    let secData: SectionData;
    try { secData = JSON.parse(jsonStr); }
    catch { return NextResponse.json({ error: "JSON 파싱 실패: " + jsonStr.substring(0,200) }, { status: 500 }); }

    const isLastSection = sectionIndex === chapter.sections.length - 1;
    const sectionHtml = buildSectionHtml(chapter.number, chapter.title, secData, section.extraCards, sectionIndex, startPage);
    const summaryHtml = isLastSection
      ? buildSummaryHtml(chapter.number, chapter.title, secData.summary, secData.quote, isLastChapter, startPage + 4)
      : "";

    return NextResponse.json({
      html: sectionHtml + summaryHtml,
      chapterIndex, sectionIndex, isLastSection,
      nextStartPage: startPage + 4 + (isLastSection ? 1 : 0),
    });

  } catch (error) {
    console.error("오류:", error);
    return NextResponse.json({ error: "생성 중 오류 발생" }, { status: 500 });
  }
}
