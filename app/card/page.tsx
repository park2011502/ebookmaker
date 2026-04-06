"use client";

import { useState } from "react";

// 총 섹션 구성
// chapterIndex 0: 표지 + 메이저 오프너 (1회)
// chapterIndex 1: 메이저 22장 (cardIndex 0~21)
// chapterIndex 2~5: 마이너 4원소 (cardIndex -1=오프너, 0~13=카드)

const CHAPTERS = [
  { chapterIndex: 0, label: "표지 및 메이저 오프너", cards: [{ cardIndex: -1, label: "표지 + 오프너" }] },
  { chapterIndex: 1, label: "CH 01 · 바보의 여정 — 메이저 아르카나 22장", cards: Array.from({length:22},(_,i)=>({cardIndex:i,label:`메이저 ${i+1}/22`})) },
  { chapterIndex: 2, label: "CH 02 · 감정의 언어 — 컵 14장", cards: [{cardIndex:-1,label:"컵 오프너"},...Array.from({length:14},(_,i)=>({cardIndex:i,label:`컵 ${i+1}/14`}))] },
  { chapterIndex: 3, label: "CH 03 · 불꽃의 의지 — 완드 14장", cards: [{cardIndex:-1,label:"완드 오프너"},...Array.from({length:14},(_,i)=>({cardIndex:i,label:`완드 ${i+1}/14`}))] },
  { chapterIndex: 4, label: "CH 04 · 날카로운 진실 — 검 14장", cards: [{cardIndex:-1,label:"검 오프너"},...Array.from({length:14},(_,i)=>({cardIndex:i,label:`검 ${i+1}/14`}))] },
  { chapterIndex: 5, label: "CH 05 · 땅의 결실 — 펜타클 14장", cards: [{cardIndex:-1,label:"펜타클 오프너"},...Array.from({length:14},(_,i)=>({cardIndex:i,label:`펜타클 ${i+1}/14`}))] },
];

type Status = "idle" | "generating" | "done" | "error";

export default function CardPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [currentStep, setCurrentStep] = useState("");
  const [allHtml, setAllHtml] = useState("");
  const [allCss, setAllCss] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [doneChapters, setDoneChapters] = useState(0);

  async function generateAll() {
    setStatus("generating");
    setAllHtml("");
    setAllCss("");
    setErrorMsg("");
    setDoneChapters(0);

    let combinedHtml = "";
    let combinedCss = "";
    let nextPage = 1;

    for (let ci = 0; ci < CHAPTERS.length; ci++) {
      const ch = CHAPTERS[ci];

      for (let ki = 0; ki < ch.cards.length; ki++) {
        const card = ch.cards[ki];
        setCurrentStep(`${ch.label} · ${card.label} 생성 중...`);

        try {
          const res = await fetch("/api/generate-card", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chapterIndex: ch.chapterIndex,
              cardIndex: card.cardIndex,
              startPage: nextPage,
            }),
          });
          if (!res.ok) throw new Error((await res.json()).error);
          const data = await res.json();
          combinedHtml += data.html;
          if (data.css) combinedCss = data.css;
          nextPage = data.nextStartPage;
          setAllHtml(combinedHtml);
          setAllCss(combinedCss);
        } catch (e: unknown) {
          setErrorMsg(`${ch.label} · ${card.label} 오류: ${e instanceof Error ? e.message : "오류"}`);
          setStatus("error");
          return;
        }
      }

      setDoneChapters(ci + 1);
    }

    setStatus("done");
    setCurrentStep("완성! 🎉");
  }

  function handleDownload() {
    const full = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>3초만에 외워지는 마법의 카드백서</title>
<style>${allCss}</style>
</head>
<body>
${allHtml}
</body>
</html>`;
    const blob = new Blob([full], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "마법의카드백서_타로전자책.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalSteps = CHAPTERS.reduce((a, c) => a + c.cards.length, 0);
  const doneSteps = CHAPTERS.slice(0, doneChapters).reduce((a, c) => a + c.cards.length, 0);
  const progress = status === "done" ? 100 : Math.round((doneSteps / totalSteps) * 100);

  return (
    <>
      <div id="ctrl">
        <div className="inner">
          <div className="hd">
            <h1>마법의 카드백서 생성기</h1>
            <p>타로카드 78장 이야기체 완전 해설 부록</p>
          </div>

          <div className="toc">
            <h3>챕터 진행 상황</h3>
            <ul>
              {CHAPTERS.map((ch, i) => (
                <li key={i} className={
                  i < doneChapters ? "done" :
                  status === "generating" && i === doneChapters ? "active" : ""
                }>
                  <span className="ico">
                    {i < doneChapters ? "✅" :
                     status === "generating" && i === doneChapters ? "⏳" : "○"}
                  </span>
                  <span>{ch.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {status !== "idle" && (
            <div className="prog">
              <div className="bar"><div className="fill" style={{ width: `${progress}%` }} /></div>
              <div className="lbl">
                {status === "done" ? "전체 생성 완료! 🎉" :
                 status === "error" ? `오류: ${errorMsg}` : currentStep}
              </div>
            </div>
          )}

          <div className="btns">
            <button className="btn-main" onClick={generateAll} disabled={status === "generating"}>
              {status === "generating" ? "생성 중..." :
               status === "done" ? "다시 생성" : "카드백서 생성 시작"}
            </button>
            {status === "done" && (
              <button className="btn-dl" onClick={handleDownload}>HTML 다운로드</button>
            )}
          </div>

          {status === "done" && (
            <div className="guide">
              💡 다운로드한 HTML을 크롬으로 열고<br/>
              Ctrl+P → 용지 <strong>A5</strong> · 여백 <strong>없음</strong> · 배경 그래픽 <strong>✅</strong> → PDF 저장
            </div>
          )}
        </div>
      </div>

      {allHtml && (
        <div id="preview">
          <style dangerouslySetInnerHTML={{ __html: allCss }} />
          <div dangerouslySetInnerHTML={{ __html: allHtml }} />
        </div>
      )}

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#3D1F6B;font-family:-apple-system,sans-serif;}
        #ctrl{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid #D4C8F0;padding:14px 20px;box-shadow:0 2px 12px rgba(0,0,0,0.08);}
        .inner{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:11px;}
        .hd h1{font-size:16px;color:#1A0A2E;font-weight:700;margin-bottom:2px;}
        .hd p{font-size:11px;color:#7B5BAD;}
        .toc h3{font-size:9.5px;color:#4A1B8B;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
        .toc ul{list-style:none;display:flex;flex-direction:column;gap:3px;}
        .toc li{display:flex;align-items:center;gap:8px;font-size:11.5px;color:#7B5BAD;padding:3px 8px;border-radius:4px;}
        .toc li.active{background:#F8F5FF;color:#4A1B8B;font-weight:600;}
        .toc li.done{color:#3D1F6B;}
        .ico{font-size:12px;flex-shrink:0;width:18px;}
        .prog{display:flex;flex-direction:column;gap:4px;}
        .bar{height:5px;background:#EDE8F8;border-radius:10px;overflow:hidden;}
        .fill{height:100%;background:#4A1B8B;border-radius:10px;transition:width 0.4s ease;}
        .lbl{font-size:10.5px;color:#7B5BAD;}
        .btns{display:flex;gap:9px;}
        .btn-main{padding:9px 20px;background:#4A1B8B;color:#fff;border:none;border-radius:6px;font-size:12.5px;font-weight:600;cursor:pointer;}
        .btn-main:hover:not(:disabled){background:#3A1470;}
        .btn-main:disabled{background:#B094E0;cursor:not-allowed;}
        .btn-dl{padding:9px 20px;background:#fff;color:#4A1B8B;border:1.5px solid #4A1B8B;border-radius:6px;font-size:12.5px;font-weight:600;cursor:pointer;}
        .btn-dl:hover{background:#F8F5FF;}
        .guide{font-size:10.5px;color:#3D1F6B;background:#EDE8F8;padding:8px 12px;border-radius:4px;line-height:1.7;}
        #preview{display:flex;flex-direction:column;align-items:center;padding:28px 20px;gap:14px;}
        @media print{
          #ctrl{display:none!important;}
          #preview{padding:0;gap:0;background:none;}
          body{background:none;}
          @page{size:A5;margin:0;}
        }
      `}</style>
    </>
  );
}
