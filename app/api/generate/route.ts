import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CHAPTERS = [
  {
    number: 1,
    title: "연애 타로의 골든 타임",
    sections: [
      "질문이 구체적일수록 정답은 선명해진다",
      "상대방의 속마음을 묻기 전, 나에게 먼저 물어야 할 것들",
      "연애운 리딩에서 가장 많이 범하는 3가지 실수",
    ],
    cards: [
      { file: "RWS_Tarot_18_Moon.jpg", nameKr: "달", name: "The Moon" },
      { file: "Cups01.jpg", nameKr: "컵 에이스", name: "Ace of Cups" },
      { file: "RWS_Tarot_08_Strength.jpg", nameKr: "힘", name: "Strength" },
    ],
  },
  {
    number: 2,
    title: "상황별 실전 리딩: 썸에서 연애까지",
    sections: [
      "[도입] 저 사람, 나한테 관심 있는 걸까? (호감 신호 포착)",
      "[전개] 고백하면 받아줄까? (최적의 타이밍 잡기)",
      "[절정] 우리 사이, 권태기일까 위기일까? (관계 정체기 극복)",
      "[결말] 이별 후 연락 올까? (재회운의 진실과 거짓)",
    ],
    cards: [
      { file: "Cups02.jpg", nameKr: "컵 2", name: "Two of Cups" },
      { file: "RWS_Tarot_00_Fool.jpg", nameKr: "바보", name: "The Fool" },
      { file: "Cups06.jpg", nameKr: "컵 6", name: "Six of Cups" },
      { file: "Cups05.jpg", nameKr: "컵 5", name: "Five of Cups" },
    ],
  },
  {
    number: 3,
    title: "키워드로 보는 타로 연애 궁합",
    sections: [
      "MBTI보다 정확한 캐릭터별 연애 스타일 (코트 카드 활용)",
      "메이저 카드로 보는 우리 인연의 깊이",
      "마이너 원소로 분석하는 스킨십과 애정 표현의 온도차",
    ],
    cards: [
      { file: "Cups12.jpg", nameKr: "컵 나이트", name: "Knight of Cups" },
      { file: "Cups13.jpg", nameKr: "컵 퀸", name: "Queen of Cups" },
      { file: "TheLovers.jpg", nameKr: "연인", name: "The Lovers" },
      { file: "RWS_Tarot_17_Star.jpg", nameKr: "별", name: "The Star" },
    ],
  },
  {
    number: 4,
    title: "연애 고민 해결사: 스프레드 비법",
    sections: [
      "상대의 속마음과 겉마음을 동시에 읽는 3카드법",
      "갈등의 원인과 해결책을 찾는 양자택일 리딩",
      "7일간의 연애 기상도: 일주일 운세 보기",
    ],
    cards: [
      { file: "RWS_Tarot_10_Wheel_of_Fortune.jpg", nameKr: "운명의 수레바퀴", name: "Wheel of Fortune" },
      { file: "Cups07.jpg", nameKr: "컵 7", name: "Seven of Cups" },
      { file: "RWS_Tarot_02_High_Priestess.jpg", nameKr: "여사제", name: "High Priestess" },
    ],
  },
  {
    number: 5,
    title: "타로가 알려주는 '나를 사랑하는 법'",
    sections: [
      "연애 중 자존감이 떨어질 때 뽑는 힐링 카드",
      "나쁜 인연을 끊어내는 용기, 탑(Tower)과 검(Swords)의 조언",
      "다음 사랑을 위해 마음을 비우는 정화의 시간",
    ],
    cards: [
      { file: "RWS_Tarot_19_Sun.jpg", nameKr: "태양", name: "The Sun" },
      { file: "RWS_Tarot_16_Tower.jpg", nameKr: "탑", name: "The Tower" },
      { file: "Cups08.jpg", nameKr: "컵 8", name: "Eight of Cups" },
      { file: "RWS_Tarot_03_Empress.jpg", nameKr: "여황제", name: "The Empress" },
    ],
  },
];

// 전체 디자인 CSS — tarot_sample.html과 완전히 동일
const EBOOK_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --cream:#FAF6F1;--cream-mid:#F2EAE0;--rose:#B5566B;--rose-mid:#C97788;
  --rose-lt:#E8C2CC;--rose-pale:#F8EFF2;--rose-faint:#FDF7F8;
  --gold:#9C7040;--gold-lt:#EDE0C8;--dark:#1A110C;--mid:#5A3828;
  --light:#9A7060;--divider:#DDD0C4;
  --serif:'Noto Serif KR',Georgia,serif;
  --sans:'Noto Sans KR',sans-serif;
  --display:'Playfair Display','Noto Serif KR',serif;
}
html,body{background:#C0B4A8;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.page{width:148mm;height:210mm;background:var(--cream);margin:0 auto 16px;overflow:hidden;display:flex;flex-direction:column;font-family:var(--serif);page-break-after:always;}
@media print{html,body{background:none;}@page{size:A5;margin:0;}.page{margin:0;box-shadow:none;page-break-after:always;}}
.pg-header{display:flex;justify-content:space-between;align-items:center;padding:8px 18px 7px;border-bottom:0.5px solid var(--divider);flex-shrink:0;}
.pg-header span{font-family:var(--sans);font-size:6.5px;color:var(--light);letter-spacing:0.3px;}
.pg-footer{display:flex;justify-content:space-between;align-items:center;padding:7px 18px 8px;border-top:0.5px solid var(--divider);flex-shrink:0;}
.pg-footer .pgn{font-family:var(--display);font-size:9px;color:var(--light);}
.pg-footer .pgt{font-family:var(--sans);font-size:6.5px;color:var(--rose-lt);letter-spacing:1.5px;text-transform:uppercase;}
.opener-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 22px;text-align:center;}
.opener-ch-label{font-family:var(--display);font-size:9px;color:var(--rose-mid);letter-spacing:5px;text-transform:uppercase;margin-bottom:6px;}
.opener-ch-num{font-family:var(--display);font-size:64px;font-weight:700;color:var(--rose-lt);line-height:1;margin-bottom:4px;}
.opener-ch-title{font-family:var(--display);font-size:19px;font-weight:700;color:var(--dark);line-height:1.3;margin-bottom:10px;}
.opener-rule{width:44px;height:1.5px;background:var(--rose);margin:0 auto 12px;}
.opener-desc{font-family:var(--serif);font-size:10px;color:var(--mid);font-style:italic;line-height:1.8;margin-bottom:16px;}
.opener-sections{width:100%;background:var(--rose-faint);border:1px solid var(--rose-lt);border-radius:5px;padding:12px 16px;text-align:left;}
.opener-sections h4{font-family:var(--sans);font-size:7px;font-weight:600;color:var(--rose);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;}
.opener-sections ul{list-style:none;display:flex;flex-direction:column;gap:5px;}
.opener-sections li{font-family:var(--sans);font-size:9px;color:var(--mid);padding-left:12px;position:relative;line-height:1.5;}
.opener-sections li::before{content:'›';position:absolute;left:0;color:var(--rose-mid);}
.opener-card{margin-top:14px;}
.opener-card img{width:60px;border-radius:3px;box-shadow:3px 6px 16px rgba(80,20,20,0.22);}
.pg-body{flex:1;overflow:hidden;padding:13px 18px 10px;display:flex;flex-direction:column;gap:0;}
.section-badge{display:flex;align-items:center;gap:6px;margin-bottom:4px;}
.section-badge .sn{font-family:var(--display);font-size:9px;font-weight:700;color:var(--rose-lt);letter-spacing:1px;}
.section-badge .sl{font-family:var(--sans);font-size:6.5px;color:var(--rose);letter-spacing:2px;text-transform:uppercase;}
.section-title{font-family:var(--display);font-size:16px;font-weight:700;color:var(--dark);line-height:1.25;letter-spacing:-0.3px;margin-bottom:3px;}
.section-rule{width:28px;height:2px;background:var(--rose);margin-bottom:10px;flex-shrink:0;}
.sub-heading{font-family:var(--serif);font-size:10px;font-weight:600;color:var(--rose);margin:10px 0 5px;line-height:1.4;}
.body-text{font-family:var(--sans);font-size:9px;color:var(--dark);line-height:1.9;letter-spacing:0.05px;margin-bottom:7px;word-break:keep-all;}
.card-callout{display:flex;gap:11px;background:var(--rose-faint);border:1px solid var(--rose-lt);border-radius:5px;padding:11px 12px;margin:8px 0;flex-shrink:0;}
.card-callout-img{flex-shrink:0;text-align:center;}
.card-callout-img img{width:52px;border-radius:3px;box-shadow:2px 4px 12px rgba(80,20,20,0.22);display:block;}
.card-callout-img .card-name{font-family:var(--sans);font-size:6.5px;color:var(--light);font-style:italic;margin-top:4px;line-height:1.4;}
.card-callout-body h4{font-family:var(--serif);font-size:9.5px;font-weight:600;color:var(--rose);margin-bottom:5px;}
.card-callout-body p{font-family:var(--sans);font-size:8.5px;color:var(--mid);line-height:1.85;word-break:keep-all;}
.card-tagline{display:block;margin-top:6px;font-family:var(--serif);font-size:8px;font-style:italic;color:var(--rose-mid);}
.bad-box{border-left:3px solid var(--rose-mid);background:#FDF4F6;border-radius:0 4px 4px 0;padding:9px 12px;margin:7px 0;flex-shrink:0;}
.bad-box .box-title{font-family:var(--serif);font-size:9px;font-weight:600;color:var(--dark);margin-bottom:6px;display:flex;align-items:center;gap:5px;}
.good-box{border-left:3px solid var(--gold);background:var(--gold-lt);border-radius:0 4px 4px 0;padding:9px 12px;margin:7px 0;flex-shrink:0;}
.good-box .box-title{font-family:var(--serif);font-size:9px;font-weight:600;color:var(--gold);margin-bottom:6px;}
.bad-box ul,.good-box ul{list-style:none;display:flex;flex-direction:column;gap:3px;}
.bad-box li,.good-box li{font-family:var(--sans);font-size:8.5px;color:var(--mid);padding-left:10px;position:relative;line-height:1.7;word-break:keep-all;}
.bad-box li::before{content:'·';position:absolute;left:1px;color:var(--rose-mid);font-size:13px;line-height:1.25;}
.good-box li::before{content:'›';position:absolute;left:1px;color:var(--gold);font-size:11px;line-height:1.4;}
.comparison-row{display:flex;gap:8px;margin:7px 0;flex-shrink:0;}
.comparison-row .bad-box,.comparison-row .good-box{margin:0;flex:1;}
.quote-box{background:var(--rose);border-radius:5px;padding:10px 13px;margin:8px 0;flex-shrink:0;text-align:center;}
.quote-box p{font-family:var(--display);font-size:9.5px;font-style:italic;color:#fff;line-height:1.7;}
.tip-box{background:var(--gold-lt);border:1px solid #D0B080;border-radius:4px;padding:9px 12px;margin:7px 0;flex-shrink:0;}
.tip-box .tip-title{font-family:var(--sans);font-size:7px;font-weight:600;color:var(--gold);letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;}
.tip-box p{font-family:var(--sans);font-size:8.5px;color:#5C3A10;line-height:1.85;word-break:keep-all;}
.highlight-box{background:var(--rose-pale);border:1px solid var(--rose-lt);border-radius:5px;padding:10px 13px;margin:7px 0;flex-shrink:0;}
.highlight-box h4{font-family:var(--serif);font-size:9.5px;font-weight:600;color:var(--rose);margin-bottom:6px;}
.highlight-box p{font-family:var(--sans);font-size:8.5px;color:var(--mid);line-height:1.85;word-break:keep-all;}
.transform-table{width:100%;border-collapse:collapse;margin:7px 0;flex-shrink:0;}
.transform-table th{background:var(--rose-pale);color:var(--rose);font-family:var(--serif);font-weight:600;padding:5px 7px;border:1px solid var(--rose-lt);text-align:center;font-size:8px;}
.transform-table td{font-family:var(--sans);font-size:8px;color:var(--dark);padding:5px 7px;border:1px solid var(--divider);line-height:1.6;word-break:keep-all;vertical-align:top;}
.transform-table tr:nth-child(even) td{background:var(--cream-mid);}
.div-rule{height:0.5px;background:var(--divider);margin:9px 0 7px;flex-shrink:0;}
.summary-list{list-style:none;display:flex;flex-direction:column;gap:6px;margin:8px 0;}
.summary-list li{font-family:var(--sans);font-size:8.5px;color:var(--dark);padding-left:16px;position:relative;line-height:1.7;word-break:keep-all;}
.summary-list li::before{content:'✦';position:absolute;left:0;color:var(--rose);font-size:8px;line-height:1.7;}
`;

// 표지 HTML 생성
function buildCoverHtml(): string {
  return `
  <div class="page" style="background:var(--cream);">
    <div style="background:var(--rose);padding:24px 0 18px;text-align:center;flex-shrink:0;">
      <div style="font-family:var(--display);font-size:8px;letter-spacing:5px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:5px;">Volume 01 · Tarot Love Guide</div>
      <div style="font-family:var(--serif);font-size:20px;font-weight:600;color:#fff;letter-spacing:5px;">제 1 권</div>
    </div>
    <div style="display:flex;justify-content:center;align-items:flex-end;gap:10px;padding:26px 24px 18px;flex-shrink:0;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
        <img src="/cards/Cups01.jpg" style="width:48px;border-radius:4px;box-shadow:4px 8px 22px rgba(60,10,10,0.28);display:block;opacity:0.82;margin-bottom:12px;">
        <div style="font-family:var(--display);font-size:6.5px;color:var(--light);letter-spacing:1px;text-transform:uppercase;">Ace of Cups</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
        <img src="/cards/RWS_Tarot_00_Fool.jpg" style="width:62px;border-radius:4px;box-shadow:4px 8px 22px rgba(60,10,10,0.28);display:block;margin-bottom:5px;">
        <div style="font-family:var(--display);font-size:6.5px;color:var(--light);letter-spacing:1px;text-transform:uppercase;">The Fool</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
        <img src="/cards/RWS_Tarot_18_Moon.jpg" style="width:80px;border-radius:4px;box-shadow:4px 8px 22px rgba(60,10,10,0.28);display:block;">
        <div style="font-family:var(--display);font-size:6.5px;color:var(--light);letter-spacing:1px;text-transform:uppercase;">The Moon</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
        <img src="/cards/RWS_Tarot_17_Star.jpg" style="width:62px;border-radius:4px;box-shadow:4px 8px 22px rgba(60,10,10,0.28);display:block;margin-bottom:5px;">
        <div style="font-family:var(--display);font-size:6.5px;color:var(--light);letter-spacing:1px;text-transform:uppercase;">The Star</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
        <img src="/cards/RWS_Tarot_08_Strength.jpg" style="width:48px;border-radius:4px;box-shadow:4px 8px 22px rgba(60,10,10,0.28);display:block;opacity:0.82;margin-bottom:12px;">
        <div style="font-family:var(--display);font-size:6.5px;color:var(--light);letter-spacing:1px;text-transform:uppercase;">Strength</div>
      </div>
    </div>
    <div style="text-align:center;padding:4px 36px 14px;flex-shrink:0;">
      <div style="font-family:var(--display);font-size:36px;font-weight:700;color:var(--dark);letter-spacing:-1px;line-height:1.05;margin-bottom:10px;">연애 프리패스</div>
      <div style="width:44px;height:1.5px;background:var(--rose);margin:0 auto 11px;"></div>
      <div style="font-family:var(--serif);font-size:12px;font-weight:300;color:var(--mid);font-style:italic;line-height:1.7;margin-bottom:4px;">타로로 꿰뚫는 상대의 속마음</div>
      <div style="font-family:var(--sans);font-size:8.5px;color:var(--light);letter-spacing:1px;">연애의 모든 순간, 타로가 답합니다</div>
    </div>
    <div style="display:flex;justify-content:center;gap:7px;padding:4px 0 12px;flex-shrink:0;">
      <span style="width:6px;height:6px;border-radius:50%;background:var(--rose-lt);display:inline-block;"></span>
      <span style="width:6px;height:6px;border-radius:50%;background:var(--rose);display:inline-block;"></span>
      <span style="width:6px;height:6px;border-radius:50%;background:var(--rose-lt);display:inline-block;"></span>
    </div>
    <div style="margin:0 26px;background:var(--rose-faint);border:1px solid var(--rose-lt);border-radius:5px;padding:13px 18px 12px;flex-shrink:0;">
      <div style="font-family:var(--sans);font-size:7.5px;font-weight:600;color:var(--rose);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:9px;">이 책에서 배울 것들</div>
      <div style="font-family:var(--sans);font-size:9.5px;color:var(--mid);padding-left:14px;position:relative;line-height:1.8;">
        ＋ 상대의 속마음을 꿰뚫는 실전 타로 리딩법<br>
        ＋ 썸부터 이별까지, 상황별 맞춤 스프레드 기술<br>
        ＋ MBTI보다 정확한 코트 카드 연애 유형 분석<br>
        ＋ 갈등·권태기·재회를 읽는 3카드 비법 스프레드<br>
        ＋ 나를 사랑하게 만드는 힐링 리딩의 기술
      </div>
    </div>
    <div style="margin:11px 26px 0;display:grid;grid-template-columns:repeat(5,1fr);gap:6px;">
      ${["골든 타임","실전 리딩","연애 궁합","스프레드","나를 사랑하는 법"].map((t,i)=>`
      <div style="background:var(--cream-mid);border:1px solid var(--divider);border-radius:4px;padding:7px 5px;text-align:center;">
        <div style="font-family:var(--display);font-size:13px;font-weight:700;color:var(--rose-lt);line-height:1;margin-bottom:3px;">0${i+1}</div>
        <div style="font-family:var(--sans);font-size:6.5px;color:var(--mid);line-height:1.4;word-break:keep-all;">${t}</div>
      </div>`).join("")}
    </div>
    <div style="margin-top:auto;background:var(--rose);padding:11px 26px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
      <div style="font-family:var(--display);font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.8);text-transform:uppercase;">Tarot Love Guide</div>
      <div style="font-family:var(--sans);font-size:7.5px;color:rgba(255,255,255,0.6);">연애 타로 완전 정복</div>
    </div>
  </div>`;
}

function buildSystemPrompt(): string {
  return `당신은 타로 전자책 HTML 생성기입니다.

[절대 규칙]
1. HTML만 출력 — 설명, 마크다운, 코드블록 절대 금지
2. 반드시 아래 구조와 클래스를 그대로 사용
3. 모든 페이지는 반드시 <div class="page"> 로 감쌀 것

[페이지 구조 — 반드시 이 형태로]

챕터 오프너:
<div class="page">
  <div class="pg-header"><span>연애 프리패스</span><span>CHAPTER N</span></div>
  <div class="opener-body">
    <div class="opener-ch-label">CHAPTER</div>
    <div class="opener-ch-num">0N</div>
    <div class="opener-ch-title">챕터제목</div>
    <div class="opener-rule"></div>
    <div class="opener-desc">챕터 한 줄 설명</div>
    <div class="opener-sections">
      <h4>이번 챕터에서 배울 것들</h4>
      <ul><li>섹션1</li><li>섹션2</li></ul>
    </div>
  </div>
  <div class="pg-footer"><div class="pgn">1</div><div class="pgt">Tarot Love Guide</div></div>
</div>

내용 페이지:
<div class="page">
  <div class="pg-header"><span>연애 프리패스</span><span>CHAPTER N · 제목</span></div>
  <div class="pg-body">
    <div class="section-badge"><span class="sn">01</span><span class="sl">SECTION</span></div>
    <div class="section-title">섹션제목</div>
    <div class="section-rule"></div>
    <div class="sub-heading">🔮 소제목</div>
    <p class="body-text">본문내용</p>
    <div class="card-callout">
      <div class="card-callout-img">
        <img src="/cards/파일명.jpg" alt="카드명">
        <div class="card-name">카드명 (영문)</div>
      </div>
      <div class="card-callout-body">
        <h4>💡 제목</h4>
        <p>설명</p>
        <span class="card-tagline">핵심 한 줄</span>
      </div>
    </div>
    <div class="quote-box"><p>"인용문"</p></div>
    <div class="tip-box"><div class="tip-title">GOLDEN TIP</div><p>팁내용</p></div>
  </div>
  <div class="pg-footer"><div class="pgn">2</div><div class="pgt">Tarot Love Guide</div></div>
</div>

[사용 가능한 클래스]
page, pg-header, pg-footer, pgn, pgt,
opener-body, opener-ch-label, opener-ch-num, opener-ch-title, opener-rule, opener-desc, opener-sections, opener-card,
pg-body, section-badge, sn, sl, section-title, section-rule,
sub-heading, body-text,
card-callout, card-callout-img, card-name, card-callout-body, card-tagline,
bad-box, good-box, box-title, quote-box, tip-box, tip-title, highlight-box,
transform-table, div-rule, comparison-row, summary-list

[콘텐츠 규칙]
- 섹션당 반드시 2~3개 page 생성
- 모든 page에 pg-header, pg-body 또는 opener-body, pg-footer 반드시 포함
- 각 섹션마다 card-callout 최소 1개
- transform-table 최소 1개
- quote-box, tip-box 각 최소 1개
- 이모지는 sub-heading 시작에만 (🔮 💡 💔 ⚠️ ✨ 🌙 ☀️ 💬 🃏 🌹)
- 실전 예시, 상담 케이스 반드시 포함
- 마지막 page에 summary-list로 핵심 요약`;
}

function buildUserPrompt(
  chapterNum: number,
  chapterTitle: string,
  sections: string[],
  cards: { file: string; name: string; nameKr: string }[]
): string {
  const cardList = cards
    .map((c) => `- ${c.nameKr} (${c.name}): /cards/${c.file}`)
    .join("\n");

  return `아래 챕터를 HTML로 작성해라.

챕터 번호: ${chapterNum}
챕터 제목: ${chapterTitle}
섹션 목록:
${sections.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}

사용할 타로 카드:
${cardList}

출력 순서:
1. 챕터 오프너 page 1개
2. 각 섹션별 page 2~3개
3. 핵심 요약 page 1개

필수:
- 모든 page는 <div class="page"> 로 감쌀 것
- card-callout 섹션마다 1개 이상
- transform-table 1개 이상
- quote-box 2개 이상
- tip-box 2개 이상
- 마지막 page에 summary-list

HTML만 출력. 설명 금지.`;
}

export async function POST(req: NextRequest) {
  try {
    const { chapterIndex } = await req.json();

    if (chapterIndex === undefined || chapterIndex < 0 || chapterIndex >= CHAPTERS.length) {
      return NextResponse.json({ error: "올바른 챕터 번호를 입력해주세요." }, { status: 400 });
    }

    const chapter = CHAPTERS[chapterIndex];

    // 표지는 chapterIndex 0일 때만 생성
    const coverHtml = chapterIndex === 0 ? buildCoverHtml() : "";

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 8000,
      system: buildSystemPrompt(),
      messages: [
        {
          role: "user",
          content: buildUserPrompt(chapter.number, chapter.title, chapter.sections, chapter.cards),
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("텍스트 응답을 받지 못했습니다.");
    }

    let chapterHtml = content.text;
    chapterHtml = chapterHtml.replace(/```html\n?/g, "").replace(/```\n?/g, "").trim();

    return NextResponse.json({
      html: coverHtml + chapterHtml,
      chapterIndex,
      chapterTitle: chapter.title,
      totalChapters: CHAPTERS.length,
      css: chapterIndex === 0 ? EBOOK_CSS : "",
    });

  } catch (error) {
    console.error("생성 오류:", error);
    return NextResponse.json({ error: "전자책 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
