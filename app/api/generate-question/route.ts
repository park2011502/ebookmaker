import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const BASE_URL = "https://ebookmaker.vercel.app";

// ── 챕터 구성 ─────────────────────────────────────────
const CHAPTERS = [
  {
    number: 1, title: "연애 질문 리스트",
    icon: "💕", color: "rose",
    sections: [
      { title: "썸·고백 단계", icon: "🌸", cardFile: "Cups02.jpg", cardName: "컵 2", count: 10,
        desc: "좋아하는 마음이 생겼을 때, 상대의 마음을 확인하고 싶을 때 사용하는 질문들" },
      { title: "연애 중·권태기", icon: "💑", cardFile: "TheLovers.jpg", cardName: "연인", count: 10,
        desc: "사귀는 중 관계의 온도와 미래를 확인하고 싶을 때 사용하는 질문들" },
      { title: "이별·재회", icon: "🌧️", cardFile: "Cups08.jpg", cardName: "컵 8", count: 10,
        desc: "이별 후 감정 정리와 재회 가능성을 알고 싶을 때 사용하는 질문들" },
    ],
  },
  {
    number: 2, title: "금전 질문 리스트",
    icon: "💰", color: "gold",
    sections: [
      { title: "수입·투자", icon: "📈", cardFile: "Pents01.jpg", cardName: "펜타클 에이스", count: 10,
        desc: "돈이 들어오는 흐름과 투자 타이밍을 알고 싶을 때 사용하는 질문들" },
      { title: "지출·손재수", icon: "💸", cardFile: "Pents05.jpg", cardName: "펜타클 5", count: 10,
        desc: "돈이 새는 이유와 손재수를 파악하고 싶을 때 사용하는 질문들" },
      { title: "사업·창업", icon: "🏢", cardFile: "Wands03.jpg", cardName: "완드 3", count: 10,
        desc: "사업 가능성과 창업 타이밍을 확인하고 싶을 때 사용하는 질문들" },
    ],
  },
  {
    number: 3, title: "직업 질문 리스트",
    icon: "💼", color: "navy",
    sections: [
      { title: "취업·이직", icon: "🎯", cardFile: "RWS_Tarot_07_Chariot.jpg", cardName: "전차", count: 10,
        desc: "취업 합격 가능성과 이직 타이밍을 알고 싶을 때 사용하는 질문들" },
      { title: "승진·직장생활", icon: "⭐", cardFile: "Pents08.jpg", cardName: "펜타클 8", count: 10,
        desc: "승진 가능성과 직장 내 관계를 파악하고 싶을 때 사용하는 질문들" },
      { title: "적성·창업", icon: "🌱", cardFile: "Wands01.jpg", cardName: "완드 에이스", count: 10,
        desc: "나에게 맞는 일과 창업 가능성을 탐색하고 싶을 때 사용하는 질문들" },
    ],
  },
  {
    number: 4, title: "자기 성찰 질문 리스트",
    icon: "🔮", color: "purple",
    sections: [
      { title: "나 자신 탐구", icon: "🪞", cardFile: "RWS_Tarot_09_Hermit.jpg", cardName: "은둔자", count: 10,
        desc: "내면의 욕구와 진짜 나를 이해하고 싶을 때 사용하는 질문들" },
      { title: "미래·방향", icon: "⭐", cardFile: "RWS_Tarot_17_Star.jpg", cardName: "별", count: 10,
        desc: "앞으로 나아갈 방향과 삶의 목적을 찾고 싶을 때 사용하는 질문들" },
    ],
  },
];

// ── CSS (코랄/오렌지 톤) ──────────────────────────────
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --cream:#FFF8F4;--cream-mid:#FFE8DC;
  --coral:#C4440A;--coral-mid:#E05A1A;--coral-lt:#F4A07A;--coral-pale:#FFF0E8;--coral-faint:#FFF8F4;
  --orange:#D4600A;--orange-lt:#F8C4A0;
  --dark:#2A0A00;--mid:#6B2A10;--light:#B05030;--divider:#F0C4A8;
  --serif:'Noto Serif KR',Georgia,serif;--sans:'Noto Sans KR',sans-serif;--display:'Playfair Display','Noto Serif KR',serif;
}
html,body{background:#6B2A10;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.pg{width:148mm;min-height:210mm;background:var(--cream);margin:0 auto 16px;display:flex;flex-direction:column;font-family:var(--serif);page-break-after:always;page-break-inside:avoid;}
@media print{html,body{background:none;}.pg{margin:0;box-shadow:none;}@page{size:A5;margin:0;}}
.pg-hd{display:flex;justify-content:space-between;align-items:center;padding:8px 18px 7px;border-bottom:0.5px solid var(--divider);flex-shrink:0;}
.pg-hd span{font-family:var(--sans);font-size:6.5px;color:var(--light);letter-spacing:0.3px;}
.pg-ft{display:flex;justify-content:space-between;align-items:center;padding:7px 18px 8px;border-top:0.5px solid var(--divider);flex-shrink:0;margin-top:auto;}
.pg-ft .pn{font-family:var(--display);font-size:10px;color:var(--light);}
.pg-ft .pt{font-family:var(--sans);font-size:6.5px;color:var(--coral-lt);letter-spacing:1.5px;text-transform:uppercase;}
.pg-body{padding:10px 17px 20px;display:flex;flex-direction:column;gap:0;flex:1;}

/* 표지 */
.cover-top{background:var(--coral);padding:24px 0 18px;text-align:center;flex-shrink:0;}
.cover-vol-en{font-family:var(--display);font-size:8px;letter-spacing:5px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:5px;}
.cover-vol-kr{font-family:var(--serif);font-size:20px;font-weight:600;color:#fff;letter-spacing:5px;}
.cover-cards-row{display:flex;justify-content:center;align-items:flex-end;gap:10px;padding:26px 24px 18px;flex-shrink:0;}
.c-card{display:flex;flex-direction:column;align-items:center;gap:5px;}
.c-card img{border-radius:4px;box-shadow:4px 8px 22px rgba(80,20,0,0.28);display:block;}
.c-card .clbl{font-family:var(--display);font-size:6.5px;color:var(--light);letter-spacing:1px;text-transform:uppercase;}
.cover-title-block{text-align:center;padding:4px 36px 14px;flex-shrink:0;}
.cover-main-title{font-family:var(--display);font-size:30px;font-weight:700;color:var(--dark);letter-spacing:-1px;line-height:1.1;margin-bottom:10px;}
.cover-rule{width:44px;height:1.5px;background:var(--coral);margin:0 auto 11px;}
.cover-subtitle{font-family:var(--serif);font-size:11px;font-weight:300;color:var(--mid);font-style:italic;line-height:1.7;margin-bottom:4px;}
.cover-tagline{font-family:var(--sans);font-size:8.5px;color:var(--light);letter-spacing:1px;}
.cover-dots{display:flex;justify-content:center;gap:7px;padding:4px 0 12px;flex-shrink:0;}
.cover-dots span{width:6px;height:6px;border-radius:50%;background:var(--coral-lt);display:inline-block;}
.cover-dots .on{background:var(--coral);}
.cover-learn{margin:0 26px;background:var(--coral-faint);border:1px solid var(--coral-lt);border-radius:5px;padding:13px 18px 12px;flex-shrink:0;}
.cover-learn h4{font-family:var(--sans);font-size:7.5px;font-weight:600;color:var(--coral);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:9px;}
.cover-learn ul{list-style:none;display:flex;flex-direction:column;gap:5px;}
.cover-learn li{font-family:var(--sans);font-size:9.5px;color:var(--mid);padding-left:14px;position:relative;line-height:1.55;}
.cover-learn li::before{content:'＋';position:absolute;left:0;color:var(--coral-mid);font-size:9px;line-height:1.55;}
.cover-toc{margin:11px 26px 0;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}
.toc-cell{background:var(--cream-mid);border:1px solid var(--divider);border-radius:4px;padding:7px 5px;text-align:center;}
.toc-cell .tn{font-family:var(--display);font-size:13px;font-weight:700;color:var(--coral-lt);line-height:1;margin-bottom:3px;}
.toc-cell .tl{font-family:var(--sans);font-size:6.5px;color:var(--mid);line-height:1.4;word-break:keep-all;}
.cover-bottom{margin-top:auto;background:var(--coral);padding:11px 26px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
.cover-bottom-l{font-family:var(--display);font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.8);text-transform:uppercase;}
.cover-bottom-r{font-family:var(--sans);font-size:7.5px;color:rgba(255,255,255,0.6);}

/* 챕터 오프너 */
.opener-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 26px;text-align:center;}
.op-label{font-family:var(--display);font-size:9px;color:var(--coral-mid);letter-spacing:5px;text-transform:uppercase;margin-bottom:6px;}
.op-num{font-family:var(--display);font-size:68px;font-weight:700;color:var(--coral-lt);line-height:1;margin-bottom:4px;}
.op-title{font-family:var(--display);font-size:18px;font-weight:700;color:var(--dark);line-height:1.3;margin-bottom:10px;}
.op-rule{width:44px;height:1.5px;background:var(--coral);margin:0 auto 14px;}
.op-desc{font-family:var(--serif);font-size:11px;color:var(--mid);font-style:italic;line-height:1.9;margin-bottom:18px;word-break:keep-all;}
.op-sections{width:100%;background:var(--coral-faint);border:1px solid var(--coral-lt);border-radius:5px;padding:13px 18px;text-align:left;}
.op-sections h4{font-family:var(--sans);font-size:8px;font-weight:600;color:var(--coral);letter-spacing:2px;text-transform:uppercase;margin-bottom:9px;}
.op-sections ul{list-style:none;display:flex;flex-direction:column;gap:6px;}
.op-sections li{font-family:var(--sans);font-size:11px;color:var(--mid);padding-left:13px;position:relative;line-height:1.6;}
.op-sections li::before{content:'›';position:absolute;left:0;color:var(--coral-mid);}

/* 질문 섹션 페이지 */
.q-section-header{display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-shrink:0;}
.q-card-img{flex-shrink:0;}
.q-card-img img{width:52px;border-radius:4px;box-shadow:2px 4px 12px rgba(80,20,0,0.22);display:block;}
.q-header-text{flex:1;}
.q-badge{font-family:var(--sans);font-size:7px;font-weight:600;color:var(--coral);letter-spacing:2px;text-transform:uppercase;margin-bottom:3px;}
.q-section-title{font-family:var(--display);font-size:18px;font-weight:700;color:var(--dark);line-height:1.25;margin-bottom:2px;}
.q-section-title-safe{font-family:var(--display);font-size:18px;font-weight:700;color:var(--dark);}
.q-section-icon{font-size:16px;}
.q-section-desc{font-family:var(--serif);font-size:9.5px;font-style:italic;color:var(--coral-mid);line-height:1.5;margin-bottom:6px;word-break:keep-all;}
.q-rule{width:28px;height:2px;background:var(--coral);margin-bottom:10px;flex-shrink:0;}
.q-tip{background:var(--coral);border-radius:4px;padding:7px 12px;margin-bottom:10px;flex-shrink:0;}
.q-tip-text{font-family:var(--sans);font-size:10px;color:#fff;line-height:1.65;word-break:keep-all;}
.q-list{list-style:none;display:flex;flex-direction:column;gap:5px;flex:1;}
.q-item{display:flex;align-items:flex-start;gap:8px;background:var(--coral-pale);border-radius:4px;padding:7px 10px;}
.q-num{font-family:var(--display);font-size:11px;font-weight:700;color:var(--coral);flex-shrink:0;min-width:22px;}
.q-text{font-family:var(--sans);font-size:10.5px;color:var(--dark);line-height:1.65;word-break:keep-all;}
.q-point{font-family:var(--sans);font-size:9px;color:var(--light);margin-top:2px;line-height:1.4;}`;

// ── trimSentences ─────────────────────────────────────
function trimSentences(text: string, max: number): string {
  if (!text) return "";
  const sentences = text.match(/[^。.!?！？]+[。.!?！？]+/g) || [text];
  return sentences.slice(0, max).join("").trim();
}

// ── 표지 HTML ─────────────────────────────────────────
function buildCoverHtml(): string {
  const cards = [
    { file: "Cups02.jpg", label: "Cups II", w: 48, mb: 12, op: 0.82 },
    { file: "Pents01.jpg", label: "Pentacles I", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_21_World.jpg", label: "The World", w: 80, mb: 0, op: 1 },
    { file: "RWS_Tarot_07_Chariot.jpg", label: "The Chariot", w: 62, mb: 5, op: 1 },
    { file: "RWS_Tarot_17_Star.jpg", label: "The Star", w: 48, mb: 12, op: 0.82 },
  ];
  return `<div class="pg"><div class="cover-top"><div class="cover-vol-en">Special Edition · Tarot Question List</div><div class="cover-vol-kr">부 록 2</div></div><div class="cover-cards-row">${cards.map(c=>`<div class="c-card"><img src="${BASE_URL}/cards/${c.file}" style="width:${c.w}px;margin-bottom:${c.mb}px;opacity:${c.op};" alt="${c.label}"><div class="clbl">${c.label}</div></div>`).join("")}</div><div class="cover-title-block"><div class="cover-main-title">타로에게 묻는<br>질문 리스트 100</div><div class="cover-rule"></div><div class="cover-subtitle">연애·금전·직업·자기성찰 상황별 완벽 질문 모음</div><div class="cover-tagline">부록 2 · 상황별 최적 질문 100개 수록</div></div><div class="cover-dots"><span></span><span class="on"></span><span></span></div><div class="cover-learn"><h4>이 책에서 배울 것들</h4><ul><li>좋은 타로 질문이 리딩 퀄리티를 결정한다</li><li>연애·썸·이별·재회 상황별 질문 30개</li><li>수입·투자·사업·손재수 금전 질문 30개</li><li>취업·이직·승진·적성 직업 질문 30개</li><li>나를 깊이 이해하는 자기성찰 질문 10개</li></ul></div><div class="cover-toc">${["연애","금전","직업","자기성찰"].map((t,i)=>`<div class="toc-cell"><div class="tn">0${i+1}</div><div class="tl">${t}</div></div>`).join("")}</div><div class="cover-bottom"><div class="cover-bottom-l">Tarot Question List</div><div class="cover-bottom-r">부록 2 · 질문 리스트 100</div></div></div>`;
}

// ── 챕터 오프너 HTML ──────────────────────────────────
function buildOpenerHtml(ch: typeof CHAPTERS[0], pageNum: number): string {
  const descs: Record<number, string> = {
    1: "타로 리딩의 퀄리티는 질문에서 결정됩니다. 연애에서 좋은 질문은 막연한 궁금증을 구체적인 답으로 바꿔줘요. 썸부터 재회까지 상황별로 바로 쓸 수 있는 질문들을 모았습니다.",
    2: "돈에 관한 질문은 구체적일수록 정확한 답이 나옵니다. 수입·지출·투자·사업 등 금전의 모든 흐름을 타로로 읽을 수 있도록 현장에서 검증된 질문들을 담았습니다.",
    3: "커리어 리딩에서 질문의 방향이 곧 답의 방향입니다. 취업·이직·승진·창업까지 직업의 모든 고민을 타로에게 제대로 물어볼 수 있는 질문들을 모았습니다.",
    4: "타로는 나 자신을 이해하는 가장 깊은 도구입니다. 내면의 욕구와 삶의 방향을 탐색하고 싶을 때 가장 본질적인 답을 이끌어내는 질문들을 담았습니다.",
  };
  return `<div class="pg"><div class="pg-hd"><span>타로에게 묻는 질문 리스트 100 | 상황별 최적 질문 모음</span><span>CHAPTER 0${ch.number}</span></div><div class="opener-body"><div class="op-label">CHAPTER</div><div class="op-num">0${ch.number}</div><div class="op-title">${ch.icon} ${ch.title}</div><div class="op-rule"></div><div class="op-desc">${descs[ch.number]}</div><div class="op-sections"><h4>이번 챕터 구성</h4><ul>${ch.sections.map(s=>`<li>${s.icon} ${s.title} — ${s.count}개 질문</li>`).join("")}</ul></div></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Question List</div></div></div>`;
}

// ── 질문 섹션 페이지 HTML ─────────────────────────────
interface QuestionData {
  tip: string;
  questions: { num: number; text: string; point: string; }[];
}

function buildQuestionPageHtml(
  ch: typeof CHAPTERS[0],
  sec: typeof CHAPTERS[0]["sections"][0],
  si: number,
  data: QuestionData,
  pageNum: number
): string {
  const qItems = data.questions.slice(0, 10).map(q =>
    `<li class="q-item"><div class="q-num">${q.num}</div><div><div class="q-text">${q.text}</div><div class="q-point">${trimSentences(q.point, 1)}</div></div></li>`
  ).join("");

  return `<div class="pg"><div class="pg-hd"><span>타로에게 묻는 질문 리스트 100 | 상황별 최적 질문 모음</span><span>CH 0${ch.number} · ${ch.title}</span></div><div class="pg-body"><div class="q-section-header"><div class="q-card-img"><img src="${BASE_URL}/cards/${sec.cardFile}" alt="${sec.cardName}"></div><div class="q-header-text"><div class="q-badge">Question List · ${ch.icon} ${ch.title}</div><div class="q-section-title">${sec.icon} ${sec.title}</div><div class="q-section-desc">${sec.desc}</div></div></div><div class="q-rule"></div><div class="q-tip"><div class="q-tip-text">💡 ${trimSentences(data.tip, 1)}</div></div><ul class="q-list">${qItems}</ul></div><div class="pg-ft"><div class="pn">${pageNum}</div><div class="pt">Tarot Question List</div></div></div>`;
}

// ── 질문 프롬프트 ─────────────────────────────────────
function buildQuestionPrompt(ch: typeof CHAPTERS[0], sec: typeof CHAPTERS[0]["sections"][0], startNum: number): string {
  return `타로 전자책 작가입니다. 아래 주제에 맞는 타로 질문 10개를 JSON으로만 작성하세요. JSON 외 텍스트 절대 금지.

주제: ${ch.title} — ${sec.title}
질문 번호 시작: ${startNum}번
카드: ${sec.cardName}

중요 규칙:
- 모든 문장은 반드시 마침표로 완전하게 끝낼 것.
- 질문은 타로 카드에게 실제로 물어볼 수 있는 구체적인 형태로 작성할 것.
- "~할까요?", "~일까요?", "~인가요?" 형태로 끝낼 것.
- point는 이 질문을 언제, 왜 사용하면 좋은지 한 문장으로.
- 각 질문이 서로 중복되지 않게 다양하게 작성할 것.

{
  "tip": "이 상황에서 타로 질문을 잘 만드는 핵심 비결 2문장. 반드시 마침표로 끝낼 것.",
  "questions": [
    ${Array.from({length:10},(_,i)=>`{"num":${startNum+i},"text":"구체적인 타로 질문 ${i+1}. ~할까요?/~일까요? 형태로 끝낼 것.","point":"이 질문을 사용하면 좋은 상황 한 문장. 반드시 마침표로 끝낼 것."}`).join(",\n    ")}
  ]
}
JSON만 출력.`;
}

// ── API Route ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { chapterIndex, sectionIndex, startPage = 1 } = await req.json();

    // chapterIndex 0: 표지
    // chapterIndex 1~4: 챕터 (sectionIndex -1=오프너, 0~2=섹션)

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

    // 질문 번호 계산 (챕터별 30개, 섹션별 10개)
    const chapterStartNum = (chIdx * 30) + 1;
    const startNum = chapterStartNum + (sectionIndex * 10);

    const msg = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4000,
      messages: [{ role: "user", content: buildQuestionPrompt(ch, sec, startNum) }],
    });
    const raw = msg.content[0];
    if (raw.type !== "text") throw new Error("응답 없음");
    let jsonStr = raw.text.trim().replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();

    let data: QuestionData;
    try { data = JSON.parse(jsonStr); }
    catch { return NextResponse.json({ error: "JSON 파싱 실패: " + jsonStr.substring(0,200) }, { status: 500 }); }

    sec.title = sec.title.replace(/&/g, "&amp;");
  const html = buildQuestionPageHtml(ch, sec, sectionIndex, data, startPage);
    return NextResponse.json({ html, nextStartPage: startPage + 1 });

  } catch (error) {
    console.error("오류:", error);
    return NextResponse.json({ error: "생성 중 오류 발생" }, { status: 500 });
  }
}
