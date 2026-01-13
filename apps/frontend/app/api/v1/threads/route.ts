import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock threads data
    const threads = [
      {
        id: '1',
        title: 'Nouvelle conversation',
        agent_id: '1',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages_count: 0
      }
    ];

    return NextResponse.json({
      success: true,
      data: threads,
      message: 'Threads retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch threads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newThread = {
      id: Date.now().toString(),
      title: body.title || 'Nouvelle conversation',
      agent_id: body.agent_id || '1',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages_count: 0
    };

    return NextResponse.json({
      success: true,
      data: newThread,
      message: 'Thread created successfully'
    });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create thread' },
      { status: 500 }
    );
  }
}
