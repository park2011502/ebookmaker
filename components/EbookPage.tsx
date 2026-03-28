"use client";

import React from "react";

const EBOOK_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

  :root {
    --cream:      #FAF6F1;
    --cream-mid:  #F2EAE0;
    --cream-dk:   #E8DDD2;
    --rose:       #B5566B;
    --rose-mid:   #C97788;
    --rose-lt:    #E8C2CC;
    --rose-pale:  #F8EFF2;
    --rose-faint: #FDF7F8;
    --gold:       #9C7040;
    --gold-lt:    #EDE0C8;
    --dark:       #1A110C;
    --mid:        #5A3828;
    --light:      #9A7060;
    --divider:    #DDD0C4;
    --serif:      'Noto Serif KR', Georgia, serif;
    --sans:       'Noto Sans KR', sans-serif;
    --display:    'Playfair Display', 'Noto Serif KR', serif;
  }

  .ebook-cover {
    width: 148mm;
    height: 210mm;
    background: var(--cream);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    page-break-after: always;
    font-family: var(--serif);
  }
  .cover-top { background: var(--rose); padding: 24px 0 18px; text-align: center; flex-shrink: 0; }
  .cover-vol-en { font-family: var(--display); font-size: 8px; letter-spacing: 5px; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 5px; }
  .cover-vol-kr { font-family: var(--serif); font-size: 20px; font-weight: 600; color: #fff; letter-spacing: 5px; }
  .cover-cards-row { display: flex; justify-content: center; align-items: flex-end; gap: 10px; padding: 26px 24px 18px; flex-shrink: 0; }
  .cover-card { display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .cover-card img { border-radius: 4px; box-shadow: 4px 8px 22px rgba(60,10,10,0.28); display: block; }
  .cover-card .clbl { font-family: var(--display); font-size: 6.5px; color: var(--light); letter-spacing: 1px; text-transform: uppercase; }
  .cover-card.center img { width: 80px; }
  .cover-card.near   img { width: 62px; margin-bottom: 5px; }
  .cover-card.outer  img { width: 48px; margin-bottom: 12px; opacity: 0.82; }
  .cover-title-block { text-align: center; padding: 4px 36px 14px; flex-shrink: 0; }
  .cover-main-title { font-family: var(--display); font-size: 36px; font-weight: 700; color: var(--dark); letter-spacing: -1px; line-height: 1.05; margin-bottom: 10px; }
  .cover-rule { width: 44px; height: 1.5px; background: var(--rose); margin: 0 auto 11px; }
  .cover-subtitle { font-family: var(--serif); font-size: 12px; font-weight: 300; color: var(--mid); font-style: italic; line-height: 1.7; margin-bottom: 4px; }
  .cover-tagline { font-family: var(--sans); font-size: 8.5px; color: var(--light); letter-spacing: 1px; }
  .cover-dots { display: flex; justify-content: center; gap: 7px; padding: 4px 0 12px; flex-shrink: 0; }
  .cover-dots span { width: 6px; height: 6px; border-radius: 50%; background: var(--rose-lt); }
  .cover-dots .on { background: var(--rose); }
  .cover-learn { margin: 0 26px; background: var(--rose-faint); border: 1px solid var(--rose-lt); border-radius: 5px; padding: 13px 18px 12px; flex-shrink: 0; }
  .cover-learn h4 { font-family: var(--sans); font-size: 7.5px; font-weight: 600; color: var(--rose); letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 9px; }
  .cover-learn ul { list-style: none; display: flex; flex-direction: column; gap: 5px; }
  .cover-learn li { font-family: var(--sans); font-size: 9.5px; color: var(--mid); padding-left: 14px; position: relative; line-height: 1.55; }
  .cover-learn li::before { content: '＋'; position: absolute; left: 0; color: var(--rose-mid); font-size: 9px; line-height: 1.55; }
  .cover-toc { margin: 11px 26px 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
  .toc-cell { background: var(--cream-mid); border: 1px solid var(--divider); border-radius: 4px; padding: 7px 5px; text-align: center; }
  .toc-cell .tn { font-family: var(--display); font-size: 13px; font-weight: 700; color: var(--rose-lt); line-height: 1; margin-bottom: 3px; }
  .toc-cell .tl { font-family: var(--sans); font-size: 6.5px; color: var(--mid); line-height: 1.4; word-break: keep-all; }
  .cover-bottom { margin-top: auto; background: var(--rose); padding: 11px 26px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
  .cover-bottom-l { font-family: var(--display); font-size: 8px; letter-spacing: 2px; color: rgba(255,255,255,0.8); text-transform: uppercase; }
  .cover-bottom-r { font-family: var(--sans); font-size: 7.5px; color: rgba(255,255,255,0.6); }

  .ebook-chapter .content-page,
  .ebook-chapter .chapter-opener {
    width: 148mm;
    height: 210mm;
    background: var(--cream);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    page-break-after: always;
    font-family: var(--serif);
    position: relative;
  }

  .pg-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 18px 7px; border-bottom: 0.5px solid var(--divider); flex-shrink: 0; }
  .pg-header span { font-family: var(--sans); font-size: 6.5px; color: var(--light); letter-spacing: 0.3px; }
  .pg-footer { display: flex; justify-content: space-between; align-items: center; padding: 7px 18px 8px; border-top: 0.5px solid var(--divider); flex-shrink: 0; }
  .pg-footer .pgn { font-family: var(--display); font-size: 9px; color: var(--light); }
  .pg-footer .pgt { font-family: var(--sans); font-size: 6.5px; color: var(--rose-lt); letter-spacing: 1.5px; text-transform: uppercase; }

  .chapter-opener .opener-body { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px 22px; text-align: center; }
  .opener-ch-label { font-family: var(--display); font-size: 9px; color: var(--rose-mid); letter-spacing: 5px; text-transform: uppercase; margin-bottom: 6px; }
  .opener-ch-num { font-family: var(--display); font-size: 64px; font-weight: 700; color: var(--rose-lt); line-height: 1; margin-bottom: 4px; }
  .opener-ch-title { font-family: var(--display); font-size: 19px; font-weight: 700; color: var(--dark); line-height: 1.3; margin-bottom: 10px; }
  .opener-rule { width: 44px; height: 1.5px; background: var(--rose); margin: 0 auto 12px; }
  .opener-desc { font-family: var(--serif); font-size: 10px; color: var(--mid); font-style: italic; line-height: 1.8; margin-bottom: 16px; }
  .opener-sections { width: 100%; background: var(--rose-faint); border: 1px solid var(--rose-lt); border-radius: 5px; padding: 12px 16px; text-align: left; }
  .opener-sections h4 { font-family: var(--sans); font-size: 7px; font-weight: 600; color: var(--rose); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
  .opener-sections ul { list-style: none; display: flex; flex-direction: column; gap: 5px; }
  .opener-sections li { font-family: var(--sans); font-size: 9px; color: var(--mid); padding-left: 12px; position: relative; line-height: 1.5; }
  .opener-sections li::before { content: '›'; position: absolute; left: 0; color: var(--rose-mid); }
  .opener-card { margin-top: 14px; }
  .opener-card img { width: 60px; border-radius: 3px; box-shadow: 3px 6px 16px rgba(80,20,20,0.22); }

  .pg-body { flex: 1; overflow: hidden; padding: 13px 18px 10px; display: flex; flex-direction: column; gap: 0; }

  .section-badge { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
  .section-badge .sn { font-family: var(--display); font-size: 9px; font-weight: 700; color: var(--rose-lt); letter-spacing: 1px; }
  .section-badge .sl { font-family: var(--sans); font-size: 6.5px; color: var(--rose); letter-spacing: 2px; text-transform: uppercase; }
  .section-title { font-family: var(--display); font-size: 16px; font-weight: 700; color: var(--dark); line-height: 1.25; letter-spacing: -0.3px; margin-bottom: 3px; }
  .section-rule { width: 28px; height: 2px; background: var(--rose); margin-bottom: 10px; flex-shrink: 0; }
  .sub-heading { font-family: var(--serif); font-size: 10px; font-weight: 600; color: var(--rose); margin: 10px 0 5px; line-height: 1.4; }
  .body-text { font-family: var(--sans); font-size: 9px; color: var(--dark); line-height: 1.9; letter-spacing: 0.05px; margin-bottom: 7px; word-break: keep-all; }

  .card-callout { display: flex; gap: 11px; background: var(--rose-faint); border: 1px solid var(--rose-lt); border-radius: 5px; padding: 11px 12px; margin: 8px 0; flex-shrink: 0; }
  .card-callout-img { flex-shrink: 0; text-align: center; }
  .card-callout-img img { width: 52px; border-radius: 3px; box-shadow: 2px 4px 12px rgba(80,20,20,0.22); display: block; }
  .card-callout-img .card-name { font-family: var(--sans); font-size: 6.5px; color: var(--light); font-style: italic; margin-top: 4px; line-height: 1.4; }
  .card-callout-body h4 { font-family: var(--serif); font-size: 9.5px; font-weight: 600; color: var(--rose); margin-bottom: 5px; }
  .card-callout-body p { font-family: var(--sans); font-size: 8.5px; color: var(--mid); line-height: 1.85; word-break: keep-all; }
  .card-tagline { display: block; margin-top: 6px; font-family: var(--serif); font-size: 8px; font-style: italic; color: var(--rose-mid); }

  .bad-box { border-left: 3px solid var(--rose-mid); background: #FDF4F6; border-radius: 0 4px 4px 0; padding: 9px 12px; margin: 7px 0; flex-shrink: 0; }
  .bad-box .box-title { font-family: var(--serif); font-size: 9px; font-weight: 600; color: var(--dark); margin-bottom: 6px; display: flex; align-items: center; gap: 5px; }
  .good-box { border-left: 3px solid var(--gold); background: var(--gold-lt); border-radius: 0 4px 4px 0; padding: 9px 12px; margin: 7px 0; flex-shrink: 0; }
  .good-box .box-title { font-family: var(--serif); font-size: 9px; font-weight: 600; color: var(--gold); margin-bottom: 6px; display: flex; align-items: center; gap: 5px; }
  .bad-box ul, .good-box ul { list-style: none; display: flex; flex-direction: column; gap: 3px; }
  .bad-box li, .good-box li { font-family: var(--sans); font-size: 8.5px; color: var(--mid); padding-left: 10px; position: relative; line-height: 1.7; word-break: keep-all; }
  .bad-box li::before { content: '·'; position: absolute; left: 1px; color: var(--rose-mid); font-size: 13px; line-height: 1.25; }
  .good-box li::before { content: '›'; position: absolute; left: 1px; color: var(--gold); font-size: 11px; line-height: 1.4; }

  .comparison-row { display: flex; gap: 8px; margin: 7px 0; flex-shrink: 0; }
  .comparison-row .bad-box, .comparison-row .good-box { margin: 0; flex: 1; }

  .quote-box { background: var(--rose); border-radius: 5px; padding: 10px 13px; margin: 8px 0; flex-shrink: 0; text-align: center; }
  .quote-box p { font-family: var(--display); font-size: 9.5px; font-style: italic; color: #fff; line-height: 1.7; }

  .tip-box { background: var(--gold-lt); border: 1px solid #D0B080; border-radius: 4px; padding: 9px 12px; margin: 7px 0; flex-shrink: 0; }
  .tip-box .tip-title { font-family: var(--sans); font-size: 7px; font-weight: 600; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
  .tip-box p { font-family: var(--sans); font-size: 8.5px; color: #5C3A10; line-height: 1.85; word-break: keep-all; }

  .highlight-box { background: var(--rose-pale); border: 1px solid var(--rose-lt); border-radius: 5px; padding: 10px 13px; margin: 7px 0; flex-shrink: 0; }
  .highlight-box h4 { font-family: var(--serif); font-size: 9.5px; font-weight: 600; color: var(--rose); margin-bottom: 6px; }
  .highlight-box p { font-family: var(--sans); font-size: 8.5px; color: var(--mid); line-height: 1.85; word-break: keep-all; }

  .transform-table { width: 100%; border-collapse: collapse; margin: 7px 0; flex-shrink: 0; }
  .transform-table th { background: var(--rose-pale); color: var(--rose); font-family: var(--serif); font-weight: 600; padding: 5px 7px; border: 1px solid var(--rose-lt); text-align: center; font-size: 8px; }
  .transform-table td { font-family: var(--sans); font-size: 8px; color: var(--dark); padding: 5px 7px; border: 1px solid var(--divider); line-height: 1.6; word-break: keep-all; vertical-align: top; }
  .transform-table tr:nth-child(even) td { background: var(--cream-mid); }

  .div-rule { height: 0.5px; background: var(--divider); margin: 9px 0 7px; flex-shrink: 0; }
  .page-break { page-break-after: always; }

  .summary-list { list-style: none; display: flex; flex-direction: column; gap: 6px; margin: 8px 0; }
  .summary-list li { font-family: var(--sans); font-size: 8.5px; color: var(--dark); padding-left: 16px; position: relative; line-height: 1.7; word-break: keep-all; }
  .summary-list li::before { content: '✦'; position: absolute; left: 0; color: var(--rose); font-size: 8px; line-height: 1.7; }

  @media print {
    @page { size: A5; margin: 0; }
    .ebook-cover, .content-page, .chapter-opener { page-break-after: always; }
  }
`;

interface CoverProps {
  cards: { center: string; near1: string; near2: string; outer1: string; outer2: string };
}

export function EbookCover({ cards }: CoverProps) {
  return (
    <div className="ebook-cover">
      <div className="cover-top">
        <div className="cover-vol-en">Volume 01 · Tarot Love Guide</div>
        <div className="cover-vol-kr">제 &thinsp;1 &thinsp;권</div>
      </div>
      <div className="cover-cards-row">
        <div className="cover-card outer">
          <img src={cards.outer1} alt="card" />
          <div className="clbl">Ace of Cups</div>
        </div>
        <div className="cover-card near">
          <img src={cards.near1} alt="card" />
          <div className="clbl">The Fool</div>
        </div>
        <div className="cover-card center">
          <img src={cards.center} alt="card" />
          <div className="clbl">The Moon</div>
        </div>
        <div className="cover-card near">
          <img src={cards.near2} alt="card" />
          <div className="clbl">The Star</div>
        </div>
        <div className="cover-card outer">
          <img src={cards.outer2} alt="card" />
          <div className="clbl">Strength</div>
        </div>
      </div>
      <div className="cover-title-block">
        <div className="cover-main-title">연애 프리패스</div>
        <div className="cover-rule" />
        <div className="cover-subtitle">타로로 꿰뚫는 상대의 속마음</div>
        <div className="cover-tagline">연애의 모든 순간, 타로가 답합니다</div>
      </div>
      <div className="cover-dots">
        <span /><span className="on" /><span />
      </div>
      <div className="cover-learn">
        <h4>이 책에서 배울 것들</h4>
        <ul>
          <li>상대의 속마음을 꿰뚫는 실전 타로 리딩법</li>
          <li>썸부터 이별까지, 상황별 맞춤 스프레드 기술</li>
          <li>MBTI보다 정확한 코트 카드 연애 유형 분석</li>
          <li>갈등·권태기·재회를 읽는 3카드 비법 스프레드</li>
          <li>나를 사랑하게 만드는 힐링 리딩의 기술</li>
        </ul>
      </div>
      <div className="cover-toc">
        {["골든 타임", "실전 리딩", "연애 궁합", "스프레드", "나를 사랑하는 법"].map((t, i) => (
          <div className="toc-cell" key={i}>
            <div className="tn">0{i + 1}</div>
            <div className="tl">{t}</div>
          </div>
        ))}
      </div>
      <div className="cover-bottom">
        <div className="cover-bottom-l">Tarot Love Guide</div>
        <div className="cover-bottom-r">연애 타로 완전 정복</div>
      </div>
    </div>
  );
}

interface EbookPageProps {
  chapters: { html: string; title: string }[];
  showCover?: boolean;
}

export default function EbookPage({ chapters, showCover = true }: EbookPageProps) {
  const coverCards = {
    center: "/cards/RWS_Tarot_18_Moon.jpg",
    near1:  "/cards/RWS_Tarot_00_Fool.jpg",
    near2:  "/cards/RWS_Tarot_17_Star.jpg",
    outer1: "/cards/Cups01.jpg",
    outer2: "/cards/RWS_Tarot_08_Strength.jpg",
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: EBOOK_CSS }} />
      {showCover && <EbookCover cards={coverCards} />}
      {chapters.map((chapter, i) => (
        <div
          key={i}
          className="ebook-chapter"
          dangerouslySetInnerHTML={{ __html: chapter.html }}
        />
      ))}
    </>
  );
}
