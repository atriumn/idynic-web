import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { api } from '@/lib/api';

export async function POST(
  request: NextRequest,
  { params }: { params: { solutionId: string } }
) {
  try {
    const { messages } = await request.json();
    const { solutionId } = params;

    // Get the last user message for the refinement instruction
    const lastMessage = messages[messages.length - 1];
    const refinementInstruction = lastMessage?.content || '';

    // Make the refinement request to the backend MCP tool
    // This would typically stream from the backend, but for now we'll simulate
    // In a real implementation, you'd proxy the stream from the backend
    
    // For now, we'll create a mock streaming response
    const result = await streamText({
      model: 'gpt-3.5-turbo', // This would be replaced with your actual streaming implementation
      messages: [
        {
          role: 'system',
          content: `You are helping refine a solution. The refinement instruction is: ${refinementInstruction}`
        },
        {
          role: 'user',
          content: 'Please refine the solution based on the instruction provided.'
        }
      ],
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.error('Error in refine API:', error);
    return NextResponse.json({ error: 'Failed to refine solution' }, { status: 500 });
  }
}