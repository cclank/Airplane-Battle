import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 核心 Prompt 工程
    const systemPrompt = `你是一个专业的电影导演和分镜规划师。
你的任务是将用户的一句话创意转化为详细的视频分镜脚本。
请输出一个结构化的 JSON 数组，每个对象包含以下字段：
- sceneNumber: 场景序号
- visualDescription: 详细的画面视觉描述
- cameraAngle: 镜头语言（如：特写、全景、航拍、主观镜头等）
- dialogue: 旁白或对白（如果有）
- duration: 预计时长（如：3s, 5s）
- lighting: 光影氛围描述

请确保分镜逻辑连贯，视觉感强。只输出 JSON 代码块，不要有任何多余的解释。`;

    const userPrompt = `创意内容：${prompt}`;

    // 这里通常会调用 OpenAI/Claude API
    // 为了演示，我们先模拟一个 AI 响应，您可以随后填入您的 API Key

    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockScenes = [
      {
        id: "1",
        sceneNumber: 1,
        visualDescription: "镜头从城市的霓虹高空缓缓降落，雨水打在透明的雨伞上。",
        cameraAngle: "俯瞰转中景",
        dialogue: "在这个永远在下雨的城市，每个人都在寻找自己的影子。",
        duration: "5s",
        lighting: "深蓝色调，霓虹红蓝对比光"
      },
      {
        id: "2",
        sceneNumber: 2,
        visualDescription: "主角的特写，眼神深邃，雨水顺着帽檐滴落。",
        cameraAngle: "大特写",
        dialogue: "",
        duration: "3s",
        lighting: "侧逆光，强调面部轮廓"
      },
      {
        id: "3",
        sceneNumber: 3,
        visualDescription: "主角转过街角，消失在深邃的巷弄中，镜头推向巷口的招牌。",
        cameraAngle: "跟拍转固定",
        dialogue: "他知道，那是唯一的线索。",
        duration: "6s",
        lighting: "昏黄的街灯，形成强烈的光影拉伸"
      }
    ];

    return NextResponse.json({ scenes: mockScenes });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
