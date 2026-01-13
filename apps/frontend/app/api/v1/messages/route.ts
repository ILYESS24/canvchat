import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('thread_id');

    if (!threadId) {
      return NextResponse.json(
        { success: false, message: 'Thread ID is required' },
        { status: 400 }
      );
    }

    // Mock messages data
    const messages = [
      {
        id: '1',
        thread_id: threadId,
        role: 'user',
        content: 'Hello, can you help me?',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        thread_id: threadId,
        role: 'assistant',
        content: 'Hello! I\'m Suna, your AI assistant. How can I help you today?',
        created_at: new Date().toISOString(),
      }
    ];

    return NextResponse.json({
      success: true,
      data: messages,
      message: 'Messages retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { thread_id, content, role = 'user' } = body;

    if (!thread_id || !content) {
      return NextResponse.json(
        { success: false, message: 'Thread ID and content are required' },
        { status: 400 }
      );
    }

    // Create user message
    const userMessage = {
      id: Date.now().toString(),
      thread_id,
      role,
      content,
      created_at: new Date().toISOString(),
    };

    // Simulate AI response (in a real app, this would call OpenAI/Anthropic)
    const aiResponse = await generateAIResponse(content);

    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      thread_id,
      role: 'assistant',
      content: aiResponse,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: [userMessage, assistantMessage],
      message: 'Messages created successfully'
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create message' },
      { status: 500 }
    );
  }
}

// Mock AI response generator
async function generateAIResponse(userMessage: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simple mock responses based on user input
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm Suna, your AI assistant. How can I help you today?";
  }

  if (lowerMessage.includes('help')) {
    return "I'm here to help you with various tasks! I can assist with coding, writing, analysis, and many other things. What would you like to work on?";
  }

  if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
    return "I'd be happy to help you with coding! Whether it's writing new code, debugging, refactoring, or explaining concepts, I'm here to assist. What specific programming task are you working on?";
  }

  if (lowerMessage.includes('thank')) {
    return "You're welcome! I'm glad I could help. Feel free to ask me anything else anytime.";
  }

  // Default response
  return `I understand you said: "${userMessage}". This is a mock AI response. In a real implementation, this would be connected to OpenAI, Anthropic, or another AI service. How else can I assist you?`;
}
