"use client";

import { useState } from "react";

const CHAPTERS = [
  { chapterIndex: 0, label: "표지", items: [{ sectionIndex: -1, label: "표지" }] },
  { chapterIndex: 1, label: "CH 01 · 💕 연애 조합 해석", items: [
    { sectionIndex: -1, label: "오프너" },
    { sectionIndex: 0, label: "설레는 시작 — 썸·고백 조합" },
    { sectionIndex: 1, label: "연인 사이 — 신뢰·미래 조합" },
    { sectionIndex: 2, label: "이별·재회 — 끝과 새 시작 조합" },
  ]},
  { chapterIndex: 2, label: "CH 02 · 💰 금전 조합 해석", items: [
    { sectionIndex: -1, label: "오프너" },
    { sectionIndex: 0, label: "수입·풍요 — 돈이 들어오는 조합" },
    { sectionIndex: 1, label: "손재수·위험 — 돈이 새는 조합" },
    { sectionIndex: 2, label: "투자·사업 — 결단의 조합" },
  ]},
  { chapterIndex: 3, label: "CH 03 · 💼 직업 조합 해석", items: [
    { sectionIndex: -1, label: "오프너" },
    { sectionIndex: 0, label: "취업·이직 — 새 출발 조합" },
    { sectionIndex: 1, label: "승진·성장 — 인정받는 조합" },
    { sectionIndex: 2, label: "직장 갈등·위기 — 주의 조합" },
  ]},
  { chapterIndex: 4, label: "CH 04 · 🔮 인생·운명 조합 해석", items: [
    { sectionIndex: -1, label: "오프너" },
    { sectionIndex: 0, label: "전환점·변화 — 인생이 바뀌는 조합" },
    { sectionIndex: 1, label: "성공·완성 — 최고의 조합" },
    { sectionIndex: 2, label: "내면·성찰 — 깊이 보는 조합" },
  ]},
];

type Status = "idle" | "generating" | "done" | "error";

export default function CombinationPage() {
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

      for (let ii = 0; ii < ch.items.length; ii++) {
        const item = ch.items[ii];
        setCurrentStep(`${ch.label} · ${item.label} 생성 중...`);

        try {
          const res = await fetch("/api/generate-combination", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chapterIndex: ch.chapterIndex,
              sectionIndex: item.sectionIndex,
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
          setErrorMsg(`${ch.label} · ${item.label} 오류: ${e instanceof Error ? e.message : "오류"}`);
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
<title>타로 카드 조합 해석집 50</title>
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
    a.download = "타로카드조합해석집50.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalSteps = CHAPTERS.reduce((a, c) => a + c.items.length, 0);
  const doneSteps = CHAPTERS.slice(0, doneChapters).reduce((a, c) => a + c.items.length, 0);
  const progress = status === "done" ? 100 : Math.round((doneSteps / totalSteps) * 100);

  return (
    <>
      <div id="ctrl">
        <div className="inner">
          <div className="hd">
            <h1>타로 카드 조합 해석집 생성기</h1>
            <p>함께 나오면 달라지는 카드 조합 50가지 완전 해설</p>
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
               status === "done" ? "다시 생성" : "조합 해석집 생성 시작"}
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
        body{background:#1A4A24;font-family:-apple-system,sans-serif;}
        #ctrl{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid #B0D8B8;padding:14px 20px;box-shadow:0 2px 12px rgba(0,0,0,0.08);}
        .inner{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:11px;}
        .hd h1{font-size:16px;color:#071A0C;font-weight:700;margin-bottom:2px;}
        .hd p{font-size:11px;color:#3D8050;}
        .toc h3{font-size:9.5px;color:#1A5C2A;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
        .toc ul{list-style:none;display:flex;flex-direction:column;gap:3px;}
        .toc li{display:flex;align-items:center;gap:8px;font-size:11.5px;color:#3D8050;padding:3px 8px;border-radius:4px;}
        .toc li.active{background:#F4FAF4;color:#1A5C2A;font-weight:600;}
        .toc li.done{color:#1A4A24;}
        .ico{font-size:12px;flex-shrink:0;width:18px;}
        .prog{display:flex;flex-direction:column;gap:4px;}
        .bar{height:5px;background:#E4F2E4;border-radius:10px;overflow:hidden;}
        .fill{height:100%;background:#1A5C2A;border-radius:10px;transition:width 0.4s ease;}
        .lbl{font-size:10.5px;color:#3D8050;}
        .btns{display:flex;gap:9px;}
        .btn-main{padding:9px 20px;background:#1A5C2A;color:#fff;border:none;border-radius:6px;font-size:12.5px;font-weight:600;cursor:pointer;}
        .btn-main:hover:not(:disabled){background:#144820;}
        .btn-main:disabled{background:#7DC490;cursor:not-allowed;}
        .btn-dl{padding:9px 20px;background:#fff;color:#1A5C2A;border:1.5px solid #1A5C2A;border-radius:6px;font-size:12.5px;font-weight:600;cursor:pointer;}
        .btn-dl:hover{background:#F4FAF4;}
        .guide{font-size:10.5px;color:#1A4A24;background:#E4F2E4;padding:8px 12px;border-radius:4px;line-height:1.7;}
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
