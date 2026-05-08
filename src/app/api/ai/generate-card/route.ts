import { generateObject } from "ai";
import { z } from "zod";
import { STRUCTURED_MODEL } from "@/lib/ai/config";
import { CARD_GENERATOR_SYSTEM } from "@/lib/ai/prompts";

export const runtime = "edge";
export const maxDuration = 30;

const cardSchema = z.object({
  cards: z
    .array(
      z.object({
        front: z.string().describe("질문 (앞면). 짧고 명확하게."),
        back: z
          .string()
          .describe("답변 (뒷면). 핵심 + 1~2줄 부연. 수식은 LaTeX $...$"),
        topic: z
          .string()
          .describe(
            "토픽 분류 (예: 옴의 법칙, RLC공진, 직류기, 변압기, 옥내배선 등)"
          ),
        subject: z
          .enum(["전기이론", "전기기기", "전기설비"])
          .describe("3대 과목 중 하나"),
        difficulty: z.enum(["easy", "medium", "hard"]),
        memorizingTip: z
          .string()
          .optional()
          .describe("외우기 팁 (없으면 생략)"),
      })
    )
    .min(1)
    .max(7),
});

export async function POST(req: Request) {
  try {
    const { sourceText } = await req.json();
    if (!sourceText || typeof sourceText !== "string") {
      return new Response(
        JSON.stringify({ error: "sourceText 가 필요합니다" }),
        { status: 400 }
      );
    }
    if (sourceText.length > 6000) {
      return new Response(
        JSON.stringify({ error: "텍스트가 너무 깁니다 (최대 6,000자)" }),
        { status: 400 }
      );
    }

    const result = await generateObject({
      model: STRUCTURED_MODEL,
      schema: cardSchema,
      system: CARD_GENERATOR_SYSTEM,
      prompt: `다음 텍스트에서 시험 출제 가능한 카드 3~7장을 만들어주세요.

[원본 텍스트]
${sourceText}`,
      temperature: 0.4,
    });

    return Response.json(result.object);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "알 수 없는 오류";
    return new Response(
      JSON.stringify({ error: `카드 생성 실패: ${msg}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
