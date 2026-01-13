import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock agents data - replace with real logic
    const agents = [
      {
        id: '1',
        name: 'Assistant IA',
        description: 'Assistant virtuel intelligent',
        model: 'gpt-4',
        status: 'active',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Code Assistant',
        description: 'Assistant spécialisé dans le code',
        model: 'claude-3',
        status: 'active',
        created_at: new Date().toISOString(),
      }
    ];

    return NextResponse.json({
      success: true,
      data: agents,
      message: 'Agents retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Mock agent creation - replace with real logic
    const newAgent = {
      id: Date.now().toString(),
      name: body.name || 'New Agent',
      description: body.description || 'New AI Agent',
      model: body.model || 'gpt-4',
      status: 'active',
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newAgent,
      message: 'Agent created successfully'
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
