"use client";

import { useState } from "react";

const CHAPTERS = [
  { number: 1, title: "연애 타로의 시작 — 기초와 질문법", sections: 4 },
  { number: 2, title: "메이저 아르카나 22장 — 연애 해석 완전 정복", sections: 4 },
  { number: 3, title: "마이너 아르카나 — 원소별 연애 에너지", sections: 4 },
  { number: 4, title: "카드 위치와 조합 해석 — 순서가 바뀌면 의미도 바뀐다", sections: 4 },
  { number: 5, title: "연애 상담 실전 완전 정복", sections: 5 },
];

type Status = "idle" | "generating" | "done" | "error";

export default function Home() {
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

      // 챕터 오프너
      setCurrentStep(`챕터 ${ch.number} 오프너 생성 중...`);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterIndex: ci, sectionIndex: -1, startPage: nextPage }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const data = await res.json();
        combinedHtml += data.html;
        if (data.css) combinedCss = data.css;
        nextPage = data.nextStartPage;
        setAllHtml(combinedHtml);
        setAllCss(combinedCss);
      } catch (e: unknown) {
        setErrorMsg(`챕터 ${ch.number} 오프너 오류: ${e instanceof Error ? e.message : "오류"}`);
        setStatus("error");
        return;
      }

      // 섹션 하나씩
      for (let si = 0; si < ch.sections; si++) {
        setCurrentStep(`챕터 ${ch.number} · 섹션 ${si + 1}/${ch.sections} 생성 중...`);
        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chapterIndex: ci, sectionIndex: si, startPage: nextPage }),
          });
          if (!res.ok) throw new Error((await res.json()).error);
          const data = await res.json();
          combinedHtml += data.html;
          nextPage = data.nextStartPage;
          setAllHtml(combinedHtml);
        } catch (e: unknown) {
          setErrorMsg(`챕터 ${ch.number} 섹션 ${si + 1} 오류: ${e instanceof Error ? e.message : "오류"}`);
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
<title>연애 프리패스 — 타로로 꿰뚫는 상대의 속마음</title>
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
    a.download = "연애프리패스_타로전자책.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalSteps = CHAPTERS.reduce((a, c) => a + c.sections + 1, 0);
  const doneSteps = CHAPTERS.slice(0, doneChapters).reduce((a, c) => a + c.sections + 1, 0);
  const progress = status === "done" ? 100 : Math.round((doneSteps / totalSteps) * 100);

  return (
    <>
      <div id="ctrl">
        <div className="inner">
          <div className="hd">
            <h1>타로 연애 전자책 생성기</h1>
            <p>버튼 하나로 타로 연애 상담사 완전 정복 전자책을 자동 생성합니다</p>
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
                  <span>CH {ch.number}. {ch.title}</span>
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
               status === "done" ? "다시 생성" : "전자책 생성 시작"}
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
        body{background:#E8E0D8;font-family:-apple-system,sans-serif;}
        #ctrl{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid #E0D0C8;padding:14px 20px;box-shadow:0 2px 12px rgba(0,0,0,0.08);}
        .inner{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:11px;}
        .hd h1{font-size:16px;color:#1A110C;font-weight:700;margin-bottom:2px;}
        .hd p{font-size:11px;color:#9A7060;}
        .toc h3{font-size:9.5px;color:#B5566B;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
        .toc ul{list-style:none;display:flex;flex-direction:column;gap:3px;}
        .toc li{display:flex;align-items:center;gap:8px;font-size:11.5px;color:#9A7060;padding:3px 8px;border-radius:4px;}
        .toc li.active{background:#FDF7F8;color:#B5566B;font-weight:600;}
        .toc li.done{color:#5A3828;}
        .ico{font-size:12px;flex-shrink:0;width:18px;}
        .prog{display:flex;flex-direction:column;gap:4px;}
        .bar{height:5px;background:#F0E8E4;border-radius:10px;overflow:hidden;}
        .fill{height:100%;background:#B5566B;border-radius:10px;transition:width 0.4s ease;}
        .lbl{font-size:10.5px;color:#9A7060;}
        .btns{display:flex;gap:9px;}
        .btn-main{padding:9px 20px;background:#B5566B;color:#fff;border:none;border-radius:6px;font-size:12.5px;font-weight:600;cursor:pointer;}
        .btn-main:hover:not(:disabled){background:#9A4458;}
        .btn-main:disabled{background:#C9A0A8;cursor:not-allowed;}
        .btn-dl{padding:9px 20px;background:#fff;color:#B5566B;border:1.5px solid #B5566B;border-radius:6px;font-size:12.5px;font-weight:600;cursor:pointer;}
        .btn-dl:hover{background:#FDF7F8;}
        .guide{font-size:10.5px;color:#7A5040;background:#EDE0C8;padding:8px 12px;border-radius:4px;line-height:1.7;}
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
