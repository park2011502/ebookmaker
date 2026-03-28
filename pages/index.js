export default function Home() {
  const generateEbook = async () => {
    const res = await fetch("/api/generate");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ebook.pdf";
    a.click();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>타로 전자책 자동 생성기</h1>
      <button onClick={generateEbook} style={{ padding: "20px", fontSize: "20px" }}>
        전자책 만들기
      </button>
    </div>
  );
}
