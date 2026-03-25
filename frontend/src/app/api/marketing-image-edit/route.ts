import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, prompt, mask } = body;

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Зураг болон засварлах тайлбар шаардлагатай." },
        { status: 400 },
      );
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");
    const imageFile = await toFile(imageBuffer, "image.png", {
      type: "image/png",
    });

    const editParams: OpenAI.Images.ImageEditParams = {
      model: "gpt-image-1",
      image: imageFile,
      prompt,
      n: 1,
      size: "1024x1024",
    };

    if (mask) {
      const maskBase64 = mask.replace(/^data:image\/\w+;base64,/, "");
      const maskBuffer = Buffer.from(maskBase64, "base64");
      editParams.mask = await toFile(maskBuffer, "mask.png", {
        type: "image/png",
      });
    }

    const response = await openai.images.edit(editParams);
    if (!response.data || response.data.length === 0) {
            throw new Error("No image data returned from OpenAI");
    }
        const editedImageBase64 = response.data[0].b64_json;

    return NextResponse.json(
      { image: `data:image/png;base64,${editedImageBase64}` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Зураг засварлах API алдаа:", error);
    return NextResponse.json(
      { error: "Зураг засварлахад алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 },
    );
  }
}
