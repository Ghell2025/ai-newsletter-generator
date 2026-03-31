import { NextRequest } from 'next/server';
import { mockProvider } from '@/lib/ai/mock-provider';
import type { Prospect, Product } from '@/types';

export async function POST(request: NextRequest) {
  const { prospects, products } = (await request.json()) as {
    prospects: Prospect[];
    products: Product[];
  };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < prospects.length; i++) {
        const prospect = prospects[i];

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'start', prospectId: prospect.id, prospectName: prospect.name, current: i + 1, total: prospects.length })}\n\n`
          )
        );

        // Simulate AI processing delay (1.5-3s per prospect)
        const delay = 1500 + Math.random() * 1500;
        await sleep(delay);

        const newsletter = await mockProvider.generateNewsletter(prospect, products);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'complete', prospectId: prospect.id, newsletter })}\n\n`
          )
        );
      }

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
