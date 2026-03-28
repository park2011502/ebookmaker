"use client";

import { useState } from "react";

const CHAPTERS = [
  { number: 1, title: "연애 타로의 골든 타임" },
  { number: 2, title: "상황별 실전 리딩: 썸에서 연애까지" },
  { number: 3, title: "키워드로 보는 타로 연애 궁합" },
  { number: 4, title: "연애 고민 해결사: 스프레드 비법" },
  { number: 5, title: "타로가 알려주는 '나를 사랑하는 법'" },
];

type Status = "idle" | "generating" | "done" | "error";

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [currentChapter, setCurrentChapter] = useState(0);
  const [allHtml, setAllHtml] = useState("");
  const [allCss, setAllCss] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [doneCount, setDoneCount] = useState(0);

  async function generateAll() {
    setStatus("generating");
    setAllHtml("");
    setAllCss("");
    setErrorMsg("");
    setDoneCount(0);

    let combinedHtml = "";
    let combinedCss = "";

    for (let i = 0; i < CHAPTERS.length; i++) {
      setCurrentChapter(i);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterIndex: i }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "생성 실패");
        }

        const data = await res.json();
        combinedHtml += data.html;
        if (data.css) combinedCss = data.css;

        setAllHtml(combinedHtml);
        setAllCss(combinedCss);
        setDoneCount(i + 1);

      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "알 수 없는 오류";
        setErrorMsg(`챕터 ${i + 1} 생성 실패: ${message}`);
        setStatus("error");
        return;
      }
    }

    setStatus("done");
  }

  // HTML 파일로 다운로드
  function handleDownload() {
    const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>연애 프리패스</title>
<style>${allCss}</style>
</head>
<body>
${allHtml}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "연애프리패스_타로전자책.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  const progress = status === "done" ? 100
    : status === "generating" ? Math.round((doneCount / CHAPTERS.length) * 100) : 0;

  return (
    <>
      <div id="control-panel">
        <div className="inner">
          <div className="header">
            <h1>타로 전자책 생성기</h1>
            <p>버튼 하나로 80페이지 전자책을 자동 생성합니다</p>
          </div>

          <div className="toc">
            <h3>생성할 목차</h3>
            <ul>
              {CHAPTERS.map((ch, i) => (
                <li key={i} className={
                  i < doneCount ? "done" :
                  status === "generating" && i === currentChapter ? "active" : ""
                }>
                  <span>{i < doneCount ? "✅" : status === "generating" && i === currentChapter ? "⏳" : "○"}</span>
                  <span>CHAPTER {ch.number}. {ch.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {status !== "idle" && (
            <div className="progress-wrap">
              <div className="bar">
                <div className="fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="label">
                {status === "generating"
                  ? `챕터 ${currentChapter + 1} / ${CHAPTERS.length} 생성 중... (${progress}%)`
                  : status === "done" ? "전체 생성 완료!"
                  : `오류: ${errorMsg}`}
              </div>
            </div>
          )}

          <div className="btns">
            <button
              className="btn-main"
              onClick={generateAll}
              disabled={status === "generating"}
            >
              {status === "generating" ? "생성 중..." :
               status === "done" ? "다시 생성" : "전자책 생성 시작"}
            </button>

            {status === "done" && (
              <button className="btn-down" onClick={handleDownload}>
                HTML 다운로드
              </button>
            )}
          </div>

          {status === "done" && (
            <div className="guide">
              💡 다운로드한 HTML 파일을 크롬으로 열고<br/>
              Ctrl+P → 용지 A5 · 여백 없음 · 배경 그래픽 ✅ → PDF 저장
            </div>
          )}
        </div>
      </div>

      {/* 미리보기 */}
      {allHtml && (
        <div id="preview">
          <style dangerouslySetInnerHTML={{ __html: allCss }} />
          <div dangerouslySetInnerHTML={{ __html: allHtml }} />
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #E8E0D8; font-family: -apple-system, sans-serif; }
        #control-panel {
          position: sticky; top: 0; z-index: 100;
          background: #fff; border-bottom: 1px solid #E0D0C8;
          padding: 16px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .inner { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
        .header h1 { font-size: 17px; color: #1A110C; font-weight: 700; margin-bottom: 2px; }
        .header p { font-size: 12px; color: #9A7060; }
        .toc h3 { font-size: 10px; color: #B5566B; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 7px; }
        .toc ul { list-style: none; display: flex; flex-direction: column; gap: 3px; }
        .toc li { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #9A7060; padding: 4px 8px; border-radius: 4px; }
        .toc li.active { background: #FDF7F8; color: #B5566B; font-weight: 600; }
        .toc li.done { color: #5A3828; }
        .progress-wrap { display: flex; flex-direction: column; gap: 5px; }
        .bar { height: 5px; background: #F0E8E4; border-radius: 10px; overflow: hidden; }
        .fill { height: 100%; background: #B5566B; border-radius: 10px; transition: width 0.4s ease; }
        .label { font-size: 11px; color: #9A7060; }
        .btns { display: flex; gap: 10px; }
        .btn-main { padding: 9px 20px; background: #B5566B; color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .btn-main:hover:not(:disabled) { background: #9A4458; }
        .btn-main:disabled { background: #C9A0A8; cursor: not-allowed; }
        .btn-down { padding: 9px 20px; background: #fff; color: #B5566B; border: 1.5px solid #B5566B; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .btn-down:hover { background: #FDF7F8; }
        .guide { font-size: 11px; color: #7A5040; background: #EDE0C8; padding: 8px 12px; border-radius: 4px; line-height: 1.6; }
        #preview { display: flex; flex-direction: column; align-items: center; padding: 30px 20px; gap: 16px; }
        @media print {
          #control-panel { display: none !important; }
          #preview { padding: 0; gap: 0; background: none; }
          body { background: none; }
          @page { size: A5; margin: 0; }
        }
      `}</style>
    </>
  );
}
