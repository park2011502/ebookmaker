import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const BASE_URL = "https://ebookmaker.vercel.app";

// ── 스프레드 목록 정의 ────────────────────────────────
const SPREADS = [
  // CH1: 기본 스프레드
  {
    chapter: 1, chapterTitle: "기본 스프레드 — 처음 시작하는 배열법",
    spreads: [
      {
        title: "원 카드 스프레드", subtitle: "하루의 메시지",
        cardCount: 1,
        positions: ["오늘의 에너지"],
        cards: ["RWS_Tarot_00_Fool.jpg"],
        cardNames: ["오늘의 카드"],
        situations: ["오늘 하루 어떤 에너지를 가져가야 할까?", "지금 이 순간 내게 필요한 메시지는?", "이 결정에 대해 타로는 뭐라고 말할까?"],
      },
      {
        title: "쓰리 카드 스프레드", subtitle: "과거·현재·미래",
        cardCount: 3,
        positions: ["과거", "현재", "미래"],
        cards: ["RWS_Tarot_18_Moon.jpg", "RWS_Tarot_10_Wheel_of_Fortune.jpg", "RWS_Tarot_19_Sun.jpg"],
        cardNames: ["과거", "현재", "미래"],
        situations: ["이 상황이 어떻게 흘러가고 있나?", "지금 관계의 과거·현재·미래는?", "이 프로젝트의 흐름은?"],
      },
      {
        title: "원인·현재·결과 스프레드", subtitle: "왜 이렇게 됐을까",
        cardCount: 3,
        positions: ["원인", "현재 상황", "결과"],
        cards: ["RWS_Tarot_15_Devil.jpg", "RWS_Tarot_08_Strength.jpg", "RWS_Tarot_17_Star.jpg"],
        cardNames: ["원인", "현재", "결과"],
        situations: ["왜 이런 상황이 생겼을까?", "이 갈등의 근본 원인은?", "지금 막힌 이유와 돌파구는?"],
      },
      {
        title: "선택 스프레드", subtitle: "A냐 B냐 그것이 문제",
        cardCount: 3,
        positions: ["선택 A", "선택 B", "핵심 조언"],
        cards: ["RWS_Tarot_00_Fool.jpg", "RWS_Tarot_09_Hermit.jpg", "RWS_Tarot_11_Justice.jpg"],
        cardNames: ["선택 A", "선택 B", "조언"],
        situations: ["이직할까 말까?", "고백할까 기다릴까?", "창업할까 취업할까?"],
      },
    ],
  },
  // CH2: 관계/연애 스프레드
  {
    chapter: 2, chapterTitle: "관계 스프레드 — 마음을 읽는 배열법",
    spreads: [
      {
        title: "관계 스프레드", subtitle: "나와 상대방의 마음",
        cardCount: 3,
        positions: ["나의 감정", "상대의 감정", "관계의 방향"],
        cards: ["Cups02.jpg", "RWS_Tarot_18_Moon.jpg", "TheLovers.jpg"],
        cardNames: ["나", "상대", "방향"],
        situations: ["상대방은 나를 어떻게 생각할까?", "이 관계가 발전할 수 있을까?", "우리 사이의 문제는 무엇일까?"],
      },
      {
        title: "재회 스프레드", subtitle: "다시 만날 수 있을까",
        cardCount: 4,
        positions: ["현재 상대 마음", "헤어진 이유", "재회 가능성", "내가 해야 할 것"],
        cards: ["Cups08.jpg", "Swords03.jpg", "RWS_Tarot_20_Judgement.jpg", "RWS_Tarot_17_Star.jpg"],
        cardNames: ["상대 마음", "이유", "가능성", "행동"],
        situations: ["다시 연락해도 될까?", "재회 가능성은 얼마나 될까?", "내가 먼저 다가가야 할까?"],
      },
      {
        title: "삼각관계 스프레드", subtitle: "복잡한 감정 정리하기",
        cardCount: 4,
        positions: ["나의 진심", "A에 대한 감정", "B에 대한 감정", "선택의 방향"],
        cards: ["RWS_Tarot_11_Justice.jpg", "TheLovers.jpg", "Cups07.jpg", "RWS_Tarot_08_Strength.jpg"],
        cardNames: ["나", "A", "B", "방향"],
        situations: ["두 사람 중 누가 나에게 맞을까?", "복잡한 감정을 어떻게 정리할까?"],
      },
      {
        title: "솔로 탈출 스프레드", subtitle: "다음 인연은 언제",
        cardCount: 4,
        positions: ["현재 나의 에너지", "인연을 막는 것", "다음 인연의 특징", "내가 준비해야 할 것"],
        cards: ["RWS_Tarot_19_Sun.jpg", "RWS_Tarot_15_Devil.jpg", "Cups01.jpg", "RWS_Tarot_17_Star.jpg"],
        cardNames: ["현재", "장애물", "인연", "준비"],
        situations: ["언제쯤 좋은 인연이 올까?", "내가 놓치고 있는 것은?", "어떤 사람이 나타날까?"],
      },
    ],
  },
  // CH3: 직업/금전 스프레드
  {
    chapter: 3, chapterTitle: "직업 및 금전 스프레드 — 현실을 읽는 배열법",
    spreads: [
      {
        title: "이직 타이밍 스프레드", subtitle: "지금 옮겨도 될까",
        cardCount: 4,
        positions: ["현재 직장 에너지", "새 기회의 가능성", "이직 시 장애물", "최적의 타이밍"],
        cards: ["Pents08.jpg", "RWS_Tarot_00_Fool.jpg", "RWS_Tarot_16_Tower.jpg", "RWS_Tarot_10_Wheel_of_Fortune.jpg"],
        cardNames: ["현재", "기회", "장애물", "타이밍"],
        situations: ["지금 이직해도 될까?", "제안받은 회사로 가야 할까?", "더 기다려야 할까?"],
      },
      {
        title: "금전 흐름 스프레드", subtitle: "돈이 어떻게 흐르나",
        cardCount: 4,
        positions: ["현재 금전 상태", "수입의 흐름", "지출·손재수", "금전 조언"],
        cards: ["Pents05.jpg", "Pents06.jpg", "RWS_Tarot_15_Devil.jpg", "Pents09.jpg"],
        cardNames: ["현재", "수입", "지출", "조언"],
        situations: ["올해 금전운은 어떨까?", "투자해도 될까?", "왜 돈이 모이지 않을까?"],
      },
      {
        title: "창업 가능성 스프레드", subtitle: "내 사업이 될까",
        cardCount: 5,
        positions: ["아이디어의 잠재력", "시장 반응", "예상 장애물", "파트너 에너지", "전체 성공 가능성"],
        cards: ["Wands01.jpg", "RWS_Tarot_01_Magician.jpg", "RWS_Tarot_16_Tower.jpg", "Pents03.jpg", "RWS_Tarot_21_World.jpg"],
        cardNames: ["잠재력", "시장", "장애물", "파트너", "성공"],
        situations: ["이 사업 아이템이 될까?", "지금 창업해도 될까?", "동업자를 믿어도 될까?"],
      },
      {
        title: "연봉 협상 스프레드", subtitle: "올려달라고 해도 될까",
        cardCount: 3,
        positions: ["회사의 현재 입장", "내 협상 카드", "결과 에너지"],
        cards: ["RWS_Tarot_04_Emperor.jpg", "RWS_Tarot_08_Strength.jpg", "Pents06.jpg"],
        cardNames: ["회사", "나", "결과"],
        situations: ["지금 연봉 올려달라고 해도 될까?", "협상 타이밍이 맞을까?"],
      },
    ],
  },
  // CH4: 심화 스프레드
  {
    chapter: 4, chapterTitle: "심화 스프레드 — 깊이 읽는 배열법",
    spreads: [
      {
        title: "5카드 스프레드", subtitle: "상황·감정·장애·조언·결과",
        cardCount: 5,
        positions: ["현재 상황", "내면 감정", "장애물", "조언", "결과"],
        cards: ["RWS_Tarot_10_Wheel_of_Fortune.jpg", "Cups07.jpg", "RWS_Tarot_15_Devil.jpg", "RWS_Tarot_09_Hermit.jpg", "RWS_Tarot_19_Sun.jpg"],
        cardNames: ["상황", "감정", "장애", "조언", "결과"],
        situations: ["이 상황 전체를 깊이 읽고 싶을 때", "복잡한 문제의 구조를 파악하고 싶을 때"],
      },
      {
        title: "켈틱 크로스 스프레드", subtitle: "타로의 꽃 — 10카드 완전 분석",
        cardCount: 6,
        positions: ["현재 상황", "교차 요소", "먼 과거", "가까운 과거", "가능한 결과", "가까운 미래"],
        cards: ["RWS_Tarot_02_High_Priestess.jpg", "RWS_Tarot_12_Hanged_Man.jpg", "RWS_Tarot_13_Death.jpg", "Cups06.jpg", "RWS_Tarot_21_World.jpg", "RWS_Tarot_10_Wheel_of_Fortune.jpg"],
        cardNames: ["현재", "교차", "먼과거", "가까운과거", "결과", "미래"],
        situations: ["인생의 중요한 기로에서 전체 그림을 보고 싶을 때", "한 주제에 대해 가장 깊이 있는 리딩이 필요할 때"],
      },
      {
        title: "연간 스프레드", subtitle: "12개월 한눈에 보기",
        cardCount: 5,
        positions: ["1~3월 에너지", "4~6월 에너지", "7~9월 에너지", "10~12월 에너지", "올해의 핵심 테마"],
        cards: ["RWS_Tarot_00_Fool.jpg", "RWS_Tarot_08_Strength.jpg", "RWS_Tarot_10_Wheel_of_Fortune.jpg", "RWS_Tarot_21_World.jpg", "RWS_Tarot_17_Star.jpg"],
        cardNames: ["1~3월", "4~6월", "7~9월", "10~12월", "테마"],
        situations: ["새해 첫날 한 해의 흐름을 보고 싶을 때", "내 한 해가 어떻게 펼쳐질지 전체 그림을 보고 싶을 때"],
      },
      {
        title: "자기 성찰 스프레드", subtitle: "나를 깊이 들여다보기",
        cardCount: 5,
        positions: ["현재 나의 모습", "숨겨진 나의 욕구", "내가 가진 강점", "내가 극복해야 할 것", "나아가야 할 방향"],
        cards: ["RWS_Tarot_09_Hermit.jpg", "RWS_Tarot_18_Moon.jpg", "RWS_Tarot_08_Strength.jpg", "RWS_Tarot_15_Devil.jpg", "RWS_Tarot_17_Star.jpg"],
        cardNames: ["현재", "욕구", "강점", "극복", "방향"],
        situations: ["내가 왜 이런 선택을 반복하는지 알고 싶을 때", "삶의 방향을 새로 설정하고 싶을 때"],
      },
    ],
  },
];

// ── CSS (티얼/청록 톤) ────────────────────────────────
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --cream:#F3FAFA;--cream-mid:#E4F4F4;
  --teal:#0F6B6B;--teal-mid:#1E8F8F;--teal-lt:#7DCFCF;--teal-pale:#E8F7F7;--teal-faint:#F3FAFA;
  --cyan:#1AABAB;--cyan-lt:#A8E4E4;
  --dark:#021A1A;--mid:#0D4545;--light:#3D8F8F;--divider:#B8E0E0;
  --serif:'Noto Serif KR',Georgia,serif;--sans:'Noto Sans KR',sans-serif;--display:'Playfair Display','Noto Serif KR',serif;
}
html,body{background:#0D4545;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.pg{width:148mm;min-height:210mm;background:var(--cream);margin:0 auto 16px;display:flex;flex-direction:column;font-family:var(--serif);page-break-after:always;page-break-inside:avoid;}
@media print{html,body{background:none;}.pg{margin:0;box-shadow:none;}@page{size:A5;margin:0;}}
.pg-hd{display:flex;justify-content:space-between;align-items:center;padding:8px 18px 7px;border-bottom:0.5px solid var(--divider);flex-shrink:0;}
.pg-hd span{font-family:var(--sans);font-size:6.5px;color:var(--light);letter-spacing:0.3px;}
.pg-ft{display:flex;justify-content:space-between;align-items:center;padding:7px 18px 8px;border-top:0.5px solid var(--divider);flex-shrink:0;margin-top:auto;}
.pg-ft .pn{font-family:var(--display);font-size:10px;color:var(--light);}
.pg-ft .pt{font-family:var(--sans);font-size:6.5px;color:var(--teal-lt);letter-spacing:1.5px;text-transform:uppercase;}
.pg-body{padding:10px 17px 20px;display:flex;flex-direction:column;gap:0;flex:1;}

/* 표지 */
.cover-top{background:var(--teal);padding:24px 0 18px;text-align:center;flex-shrink:0;}
.cover-vol-en{font-family:var(--display);font-size:8px;letter-spacing:5px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:5px;}
.cover-vol-kr{font-family:var(--serif);font-size:20px;font-weight:600;color:#fff;letter-spacing:5px;}
.cover-cards-row{display:flex;justify-content:center;align-items:flex-end;gap:10px;padding:26px 24px 18px;flex-shrink:0;}
.c-card{display:flex;flex-direction:column;align-items:center;gap:5px;}
.c-card img{border-radius:4px;box-shadow:4px 8px 22px rgba(0,40,40,0.28);display:block;}
.c-card .clbl{font-family:var(--display);font-size:6.5px;color:var(--light);letter-spacing:1px;text-transform:uppercase;}
.cover-title-block{text-align:center;padding:4px 36px 14px;flex-shrink:0;}
.cover-main-title{font-family:var(--display);font-size:30px;font-weight:700;color:var(--dark);letter-spacing:-1px;line-height:1.1;margin-bottom:10px;}
.cover-rule{width:44px;height:1.5px;background:var(--teal);margin:0 auto 11px;}
.cover-subtitle{font-family:var(--serif);font-size:11px;font-weight:300;color:var(--mid);font-style:italic;line-height:1.7;margin-bottom:4px;}
.cover-tagline{font-family:var(--sans);font-size:8.5px;color:var(--light);letter-spacing:1px;}
.cover-dots{display:flex;justify-content:center;gap:7px;padding:4px 0 12px;flex-shrink:0;}
.cover-dots span{width:6px;height:6px;border-radius:50%;background:var(--teal-lt);display:inline-block;}
.cover-dots .on{background:var(--teal);}
.cover-learn{margin:0 26px;background:var(--teal-faint);border:1px solid var(--teal-lt);border-radius:5px;padding:13px 18px 12px;flex-shrink:0;}
.cover-learn h4{font-family:var(--sans);font-size:7.5px;font-weight:600;color:var(--teal);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:9px;}
.cover-learn ul{list-style:none;display:flex;flex-direction:column;gap:5px;}
.cover-learn li{font-family:var(--sans);font-size:9.5px;color:var(--mid);padding-left:14px;position:relative;line-height:1.55;}
.cover-learn li::before{content:'＋';position:absolute;left:0;color:var(--teal-mid);font-size:9px;line-height:1.55;}
.cover-toc{margin:11px 26px 0;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}
.toc-cell{background:var(--cream-mid);border:1px solid var(--divider);border-radius:4px;padding:7px 5px;text-align:center;}
.toc-cell .tn{font-family:var(--display);font-size:13px;font-weight:700;color:var(--teal-lt);line-height:1;margin-bottom:3px;}
.toc-cell .tl{font-family:var(--sans);font-size:6.5px;color:var(--mid);line-height:1.4;word-break:keep-all;}
.cover-bottom{margin-top:auto;background:var(--teal);padding:11px 26px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
.cover-bottom-l{font-family:var(--display);font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.8);text-transform:uppercase;}
.cover-bottom-r{font-family:var(--sans);font-size:7.5px;color:rgba(255,255,255,0.6);}

/* 챕터 오프너 */
.opener-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 26px;text-align:center;}
.op-label{font-family:var(--display);font-size:9px;color:var(--teal-mid);letter-spacing:5px;text-transform:uppercase;margin-bottom:6px;}
.op-num{font-family:var(--display);font-size:68px;font-weight:700;color:var(--teal-lt);line-height:1;margin-bottom:4px;}
.op-title{font-family:var(--display);font-size:18px;font-weight:700;color:var(--dark);line-height:1.3;margin-bottom:10px;}
.op-rule{width:44px;height:1.5px;background:var(--teal);margin:0 auto 14px;}
.op-desc{font-family:var(--serif);font-size:11px;color:var(--mid);font-style:italic;line-height:1.9;margin-bottom:18px;word-break:keep-all;}
.op-sections{width:100%;background:var(--teal-faint);border:1px solid var(--teal-lt);border-radius:5px;padding:13px 18px;text-align:left;}
.op-sections h4{font-family:var(--sans);font-size:8px;font-weight:600;color:var(--teal);letter-spacing:2px;text-transform:uppercase;margin-bottom:9px;}
.op-sections ul{list-style:none;display:flex;flex-direction:column;gap:6px;}
.op-sections li{font-family:var(--sans);font-size:11px;color:var(--mid);padding-left:13px;position:relative;line-height:1.6;}
.op-sections li::before{content:'›';position:absolute;left:0;color:var(--teal-mid);}

/* 스프레드 페이지 */
.spread-badge{display:flex;align-items:center;gap:6px;margin-bottom:4px;}
.spread-badge .sn{font-family:var(--display);font-size:9px;font-weight:700;color:var(--teal-lt);letter-spacing:1px;}
.spread-badge .sl{font-family:var(--sans);font-size:6.5px;color:var(--teal);letter-spacing:2px;text-transform:uppercase;}
.spread-title{font-family:var(--display);font-size:19px;font-weight:700;color:var(--dark);line-height:1.25;margin-bottom:2px;}
.spread-subtitle{font-family:var(--serif);font-size:9.5px;font-style:italic;color:var(--teal-mid);margin-bottom:6px;}
.spread-rule{width:28px;height:2px;background:var(--teal);margin-bottom:10px;flex-shrink:0;}
.spread-desc{font-family:var(--sans);font-size:11px;color:var(--dark);line-height:1.85;margin-bottom:10px;word-break:keep-all;}
.spread-cards{display:flex;justify-content:center;gap:8px;margin:10px 0;flex-shrink:0;flex-wrap:wrap;}
.spread-card-item{display:flex;flex-direction:column;align-items:center;gap:4px;}
.spread-card-item img{width:46px;border-radius:4px;box-shadow:2px 4px 10px rgba(0,40,40,0.22);display:block;}
.spread-card-label{font-family:var(--sans);font-size:7.5px;color:var(--teal);font-weight:600;text-align:center;line-height:1.3;}
.spread-positions{display:flex;flex-direction:column;gap:5px;margin:8px 0;flex-shrink:0;}
.pos-row{display:flex;align-items:flex-start;gap:8px;background:var(--teal-pale);border-radius:4px;padding:7px 10px;}
.pos-num{font-family:var(--display);font-size:11px;font-weight:700;color:var(--teal);flex-shrink:0;min-width:18px;}
.pos-content{flex:1;}
.pos-title{font-family:var(--serif);font-size:10.5px;font-weight:600;color:var(--dark);margin-bottom:2px;}
.pos-desc{font-family:var(--sans);font-size:10px;color:var(--mid);line-height:1.6;word-break:keep-all;}
.spread-situations{background:var(--teal);border-radius:5px;padding:9px 13px;margin-top:8px;flex-shrink:0;}
.sit-label{font-family:var(--sans);font-size:7.5px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;}
.sit-list{list-style:none;display:flex;flex-direction:column;gap:4px;}
.sit-list li{font-family:var(--sans);font-size:10.5px;color:#fff;padding-left:12px;position:relative;line-height:1.6;}
.sit-list li::before{content:'✦';position:absolute;left:0;font-size:7px;line-height:1.9;color:var(--teal-lt);}
.spread-tip{background:var(--teal-pale);border:1px solid var(--teal-lt);border-radius:4px;padding:9px 12px;margin-top:8px;flex-shrink:0;}
.tip-title{font-family:var(--sans);font-size:7.5px;font-weight:600;color:var(--teal);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:5px;}
.tip-text{font-family:var(--sans);font-size:10.5px;color:var(--mid);line-height:1.75;word-break:keep-all;}`;

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
    { file: "RWS_Tarot_10_Wheel_of_Fortune.jpg", label: "The Wheel", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_21_World.jpg", label: "The World", w: 80, mb: 0, op: 1 },
    { file: "RWS_Tarot_17_Star.jpg", label: "The Star", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_09_Hermit.jpg", label: "The Hermit", w: 48, mb: 12, op: 0.82 },
  ];
  return `<div class="pg"><div class="cover-top"><div class="cover-vol-en">Special Edition · Tarot Spread Guide</div><div class="cover-vol-kr">부 록 1</div></div><div class="cover-cards-row">${cards.map(c=>`<div class="c-card"><img src="${BASE_URL}/cards/${c.file}" style="width:${c.w}px;margin-bottom:${c.mb}px;opacity:${c.op};" alt="${c.label}"><div class="clbl">${c.label}</div></div>`).join("")}</div><div class="cover-title-block"><div class="cover-main-title">타로 스프레드<br>완전 모음집</div><div class="cover-rule"></div><div class="cover-subtitle">원 카드부터 켈틱 크로스까지 상황별 배열법 완전 정복</div><div class="cover-tagline">부록 1 · 16가지 스프레드 수록</div></div><div class="cover-dots"><span></span><span class="on"></span><span></span></div><div class="cover-learn"><h4>이 책에서 배울 것들</h4><ul><li>원 카드·3카드·5카드 기본 스프레드 완전 해설</li><li>연애·관계·재회·삼각관계 특화 스프레드</li><li>이직·금전·창업·연봉협상 커리어 스프레드</li><li>켈틱 크로스·연간·자기성찰 심화 스프레드</li><li>각 위치별 카드 해석 방법과 실전 적용 예시 수록</li></ul></div><div class="cover-toc">${["기본","관계","직업·금전","심화"].map((t,i)=>`<div class="toc-cell"><div class="tn">0${i+1}</div><div class="tl">${t}</div></div>`).join("")}</div><div class="cover-bottom"><div class="cover-bottom-l">Tarot Spread Guide</div><div class="cover-bottom-r">부록 1 · 16가지 스프레드 완전 정복</div></div></div>`;
}

// ── 챕터 오프너 HTML ──────────────────────────────────
function buildOpenerHtml(chapterNum: number, title: string, desc: string, spreadTitles: string[], pageNum: number): string {
  return `<div class="pg"><div class="pg-hd"><span>타로 스프레드 완전 모음집 | 상황별 배열법 완전 정복</span><span>CHAPTER 0${chapterNum}</span></div><div class="opener-body"><div class="op-label">CHAPTER</div><div class="op-num">0${chapterNum}</div><div class="op-title">${title}</div><div class="op-rule"></div><div class="op-desc">${desc}</div><div class="op-sections"><h4>이번 챕터 스프레드</h4><ul>${spreadTitles.map(s=>`<li>${s}</li>`).join("")}</ul></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Spread Guide</div></div></div>`;
}

// ── 스프레드 페이지 HTML ──────────────────────────────
interface SpreadContent {
  desc: string;
  positionDescs: string[];
  tip: string;
}

function buildSpreadHtml(
  chapterNum: number, chapterTitle: string,
  spread: typeof SPREADS[0]["spreads"][0],
  si: number,
  content: SpreadContent,
  pageNum: number
): string {
  const safeTitle = spread.title.replace(/&/g, "&amp;");
  const posRows = spread.positions.map((pos, i) =>
    `<div class="pos-row"><div class="pos-num">${i+1}</div><div class="pos-content"><div class="pos-title">${pos}</div><div class="pos-desc">${trimSentences(content.positionDescs[i] || "", 2)}</div></div></div>`
  ).join("");
  const cardItems = spread.cards.map((file, i) =>
    `<div class="spread-card-item"><img src="${BASE_URL}/cards/${file}" alt="${spread.cardNames[i]}"><div class="spread-card-label">${spread.cardNames[i]}</div></div>`
  ).join("");
  const sitItems = spread.situations.map(s => `<li>${s}</li>`).join("");

  return `<div class="pg"><div class="pg-hd"><span>타로 스프레드 완전 모음집 | 상황별 배열법 완전 정복</span><span>CH 0${chapterNum} · ${chapterTitle}</span></div><div class="pg-body"><div class="spread-badge"><span class="sn">0${si+1}</span><span class="sl">Spread</span></div><div class="spread-title">${safeTitle}</div><div class="spread-subtitle">✦ ${spread.subtitle}</div><div class="spread-rule"></div><div class="spread-desc">${trimSentences(content.desc, 3)}</div><div class="spread-cards">${cardItems}</div><div class="spread-positions">${posRows}</div><div class="spread-situations"><div class="sit-label">이런 상황에서 사용하세요</div><ul class="sit-list">${sitItems}</ul></div><div class="spread-tip"><div class="tip-title">💡 리딩 팁</div><div class="tip-text">${trimSentences(content.tip, 2)}</div></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Spread Guide</div></div></div>`;
}

// ── 스프레드 프롬프트 ─────────────────────────────────
function buildSpreadPrompt(spread: typeof SPREADS[0]["spreads"][0], chapterTitle: string): string {
  return `타로 전자책 작가입니다. 아래 스프레드의 상세 설명을 JSON으로만 작성하세요. JSON 외 텍스트 절대 금지.

스프레드명: ${spread.title}
카테고리: ${chapterTitle}
위치 수: ${spread.cardCount}장
위치 이름: ${spread.positions.join(", ")}

중요 규칙:
- 모든 문장은 반드시 마침표로 완전하게 끝낼 것.
- 구어체로 친근하게 작성할 것.
- 각 항목 충분히 자세하고 풍부하게 작성할 것.

{
  "desc": "이 스프레드의 특징과 언제 쓰면 좋은지 4~5문장. 이 배열법이 왜 효과적인지 설명. 반드시 마침표로 끝낼 것.",
  "positionDescs": [
    ${spread.positions.map(pos => `"${pos} 위치에서 카드를 어떻게 해석해야 하는지 2~3문장. 구체적인 해석 방법 포함. 반드시 마침표로 끝낼 것."`).join(",\n    ")}
  ],
  "tip": "이 스프레드를 실전에서 사용할 때 알아두면 좋은 팁 3~4문장. 흔한 실수나 주의사항 포함. 반드시 마침표로 끝낼 것."
}
JSON만 출력.`;
}

// ── API Route ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { chapterIndex, spreadIndex, startPage = 1 } = await req.json();

    // chapterIndex 0: 표지
    // chapterIndex 1~4: 챕터 (spreadIndex -1=오프너, 0~3=스프레드)

    if (chapterIndex === 0) {
      return NextResponse.json({
        html: buildCoverHtml(),
        css: CSS,
        nextStartPage: startPage + 1,
      });
    }

    const chIdx = chapterIndex - 1;
    if (chIdx < 0 || chIdx >= SPREADS.length) {
      return NextResponse.json({ error: "잘못된 챕터" }, { status: 400 });
    }

    const chapter = SPREADS[chIdx];
    const openerDescs = [
      "타로를 처음 시작할 때 가장 먼저 배워야 할 스프레드들입니다. 원 카드부터 3카드까지 기본기를 탄탄히 다지면 어떤 복잡한 스프레드도 쉽게 응용할 수 있어요.",
      "연애와 관계에서 타로는 가장 강력한 도구예요. 상대방의 마음을 읽고 관계의 방향을 파악하는 데 특화된 스프레드들을 모았습니다.",
      "돈과 커리어 문제는 타로로 놀랍도록 정확하게 읽힙니다. 이직 타이밍부터 창업 가능성까지 현실적인 질문에 답하는 스프레드들입니다.",
      "더 깊이 있는 리딩을 원할 때 사용하는 심화 스프레드들입니다. 켈틱 크로스부터 연간 스프레드까지 인생의 큰 그림을 보는 배열법을 담았습니다.",
    ];

    if (spreadIndex === -1) {
      const html = buildOpenerHtml(
        chapter.chapter,
        chapter.chapterTitle,
        openerDescs[chIdx],
        chapter.spreads.map(s => `${s.title} — ${s.subtitle}`),
        startPage
      );
      return NextResponse.json({ html, nextStartPage: startPage + 1 });
    }

    const spread = chapter.spreads[spreadIndex];
    if (!spread) return NextResponse.json({ error: "스프레드를 찾을 수 없습니다." }, { status: 400 });

    const msg = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4000,
      messages: [{ role: "user", content: buildSpreadPrompt(spread, chapter.chapterTitle) }],
    });
    const raw = msg.content[0];
    if (raw.type !== "text") throw new Error("응답 없음");
    let jsonStr = raw.text.trim().replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();

    let content: SpreadContent;
    try { content = JSON.parse(jsonStr); }
    catch { return NextResponse.json({ error: "JSON 파싱 실패: " + jsonStr.substring(0,200) }, { status: 500 }); }

    const html = buildSpreadHtml(chapter.chapter, chapter.chapterTitle, spread, spreadIndex, content, startPage);
    return NextResponse.json({ html, nextStartPage: startPage + 1 });

  } catch (error) {
    console.error("오류:", error);
    return NextResponse.json({ error: "생성 중 오류 발생" }, { status: 500 });
  }
}
