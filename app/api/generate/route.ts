import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 챕터별 사용할 타로 카드 매핑
const CHAPTER_CARDS: Record<number, { file: string; name: string; nameKr: string }[]> = {
  1: [
    { file: "RWS_Tarot_18_Moon.jpg",        name: "The Moon",       nameKr: "달" },
    { file: "Cups01.jpg",                    name: "Ace of Cups",    nameKr: "컵 에이스" },
    { file: "RWS_Tarot_08_Strength.jpg",     name: "Strength",       nameKr: "힘" },
  ],
  2: [
    { file: "Cups02.jpg",                    name: "Two of Cups",    nameKr: "컵 2" },
    { file: "RWS_Tarot_00_Fool.jpg",         name: "The Fool",       nameKr: "바보" },
    { file: "Cups06.jpg",                    name: "Six of Cups",    nameKr: "컵 6" },
    { file: "Cups05.jpg",                    name: "Five of Cups",   nameKr: "컵 5" },
  ],
  3: [
    { file: "Cups12.jpg",                    name: "Knight of Cups", nameKr: "컵 나이트" },
    { file: "Cups13.jpg",                    name: "Queen of Cups",  nameKr: "컵 퀸" },
    { file: "TheLovers.jpg",                 name: "The Lovers",     nameKr: "연인" },
    { file: "RWS_Tarot_17_Star.jpg",         name: "The Star",       nameKr: "별" },
  ],
  4: [
    { file: "RWS_Tarot_10_Wheel_of_Fortune.jpg", name: "Wheel of Fortune", nameKr: "운명의 수레바퀴" },
    { file: "Cups07.jpg",                    name: "Seven of Cups",  nameKr: "컵 7" },
    { file: "RWS_Tarot_02_High_Priestess.jpg", name: "High Priestess", nameKr: "여사제" },
  ],
  5: [
    { file: "RWS_Tarot_19_Sun.jpg",          name: "The Sun",        nameKr: "태양" },
    { file: "RWS_Tarot_16_Tower.jpg",        name: "The Tower",      nameKr: "탑" },
    { file: "Cups08.jpg",                    name: "Eight of Cups",  nameKr: "컵 8" },
    { file: "RWS_Tarot_03_Empress.jpg",      name: "The Empress",    nameKr: "여황제" },
  ],
};

// 챕터별 섹션 구성
const CHAPTERS = [
  {
    number: 1,
    title: "연애 타로의 골든 타임",
    sections: [
      "질문이 구체적일수록 정답은 선명해진다",
      "상대방의 속마음을 묻기 전, 나에게 먼저 물어야 할 것들",
      "연애운 리딩에서 가장 많이 범하는 3가지 실수",
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
  },
  {
    number: 3,
    title: "키워드로 보는 타로 연애 궁합",
    sections: [
      "MBTI보다 정확한 캐릭터별 연애 스타일 (코트 카드 활용)",
      "메이저 카드로 보는 우리 인연의 깊이",
      "마이너 원소로 분석하는 스킨십과 애정 표현의 온도차",
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
  },
  {
    number: 5,
    title: "타로가 알려주는 '나를 사랑하는 법'",
    sections: [
      "연애 중 자존감이 떨어질 때 뽑는 힐링 카드",
      "나쁜 인연을 끊어내는 용기, 탑(Tower)과 검(Swords)의 조언",
      "다음 사랑을 위해 마음을 비우는 정화의 시간",
    ],
  },
];

function buildSystemPrompt(): string {
  return `당신은 "전자책 디자이너 + 타로 전문 작가"입니다.
타로 연애 전자책의 각 챕터 내용을 HTML 형식으로 생성합니다.

[절대 규칙]
- 반드시 HTML 형식으로만 출력 (설명 텍스트 절대 금지)
- <div class="ebook-chapter"> 태그로 전체를 감싸서 출력
- 마크다운, 코드블록, 설명 일절 없이 HTML만 출력

[디자인 클래스 사용 규칙]
반드시 아래 CSS 클래스만 사용:
- .chapter-opener : 챕터 시작 페이지
- .content-page : 일반 내용 페이지
- .section-badge : 섹션 번호 배지
- .section-title : 섹션 제목
- .section-rule : 제목 아래 구분선
- .sub-heading : 소제목 (이모지 포함)
- .body-text : 본문 단락
- .card-callout : 타로 카드 + 설명 박스
- .card-callout-img : 카드 이미지 영역
- .card-callout-body : 카드 설명 영역
- .bad-box : 잘못된 예시 박스 (왼쪽 레드 라인)
- .good-box : 좋은 예시 박스 (왼쪽 골드 라인)
- .quote-box : 인용 강조 박스 (로즈 배경)
- .tip-box : 팁 박스 (골드 배경)
- .comparison-row : 두 박스 나란히 배치
- .transform-table : 비교 표
- .highlight-box : 핑크 강조 박스
- .page-break : 페이지 나누기

[페이지 구성 규칙]
- 각 섹션은 반드시 2~3페이지 분량으로 작성
- 모든 페이지는 내용으로 꽉 차야 함 (빈 공간 절대 금지)
- 부족하면 사례, 상담 예시, 상황별 해석 추가
- 각 섹션마다 타로 카드 이미지 반드시 포함

[콘텐츠 규칙]
- 톤: 친근하지만 전문가, 직설적이고 실용적
- 이모지: 소제목 시작에만 (🔮 💡 💔 ⚠️ ✨ 🌙 ☀️ 💬 🃏 🌹)
- 각 섹션: 소제목 3개 이상, 본문 충분히, 표/박스 반드시 포함
- 실전 예시와 상담 케이스 반드시 포함
- 흥미롭고 읽고 싶게, 절대 밋밋하게 작성 금지

[카드 이미지 삽입 방법]
<div class="card-callout">
  <div class="card-callout-img">
    <img src="/cards/파일명.jpg" alt="카드이름">
    <div class="card-name">카드이름 (영문)</div>
  </div>
  <div class="card-callout-body">
    <h4>💡 제목</h4>
    <p>내용</p>
  </div>
</div>`;
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

[챕터 정보]
- 챕터 번호: ${chapterNum}
- 챕터 제목: ${chapterTitle}
- 섹션 목록:
${sections.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}

[사용할 타로 카드 이미지]
${cardList}

[출력 구조]
1. 챕터 오프너 페이지 (chapter-opener)
2. 각 섹션별 내용 페이지 (content-page) — 섹션당 2~3페이지
3. 챕터 마무리 핵심 요약 페이지

[필수 포함 요소]
- 각 섹션에 타로 카드 이미지 최소 1장
- 비교 표 최소 1개
- 강조 박스 (quote-box 또는 tip-box) 최소 2개
- 실전 상담 예시 또는 케이스 스터디
- 챕터 마지막에 핵심 요약 리스트

반드시 <div class="ebook-chapter"> 으로 감싸서 HTML만 출력.`;
}

export async function POST(req: NextRequest) {
  try {
    const { chapterIndex } = await req.json();

    if (chapterIndex === undefined || chapterIndex < 0 || chapterIndex >= CHAPTERS.length) {
      return NextResponse.json({ error: "올바른 챕터 번호를 입력해주세요." }, { status: 400 });
    }

    const chapter = CHAPTERS[chapterIndex];
    const cards = CHAPTER_CARDS[chapter.number] || [];

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(
            chapter.number,
            chapter.title,
            chapter.sections,
            cards
          ),
        },
      ],
      system: buildSystemPrompt(),
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("텍스트 응답을 받지 못했습니다.");
    }

    // HTML만 추출 (혹시 마크다운 코드블록이 있으면 제거)
    let html = content.text;
    html = html.replace(/```html\n?/g, "").replace(/```\n?/g, "").trim();

    return NextResponse.json({
      html,
      chapterIndex,
      chapterTitle: chapter.title,
      totalChapters: CHAPTERS.length,
    });
  } catch (error) {
    console.error("생성 오류:", error);
    return NextResponse.json(
      { error: "전자책 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
