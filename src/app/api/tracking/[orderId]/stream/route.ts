import { NextRequest } from 'next/server';
import prisma from '../../../../../../prisma/client';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  const encoder = new TextEncoder();
  let closed = false;
  let pollInterval: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      // Helper to send SSE data
      function send(data: object) {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Stream may already be closed
          closed = true;
        }
      }

      // Handle client disconnect
      req.signal.addEventListener('abort', () => {
        closed = true;
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });

      // Fetch current tracking state
      async function fetchTracking() {
        try {
          const tracking = await prisma.orderTracking.findUnique({
            where: { orderId },
            include: {
              events: { orderBy: { createdAt: 'asc' } },
            },
          });

          if (!tracking) {
            send({ error: 'Not found' });
            closed = true;
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
            controller.close();
            return null;
          }

          return tracking;
        } catch {
          return null;
        }
      }

      // Send initial state
      const initial = await fetchTracking();
      if (!initial || closed) return;

      let lastStatus = initial.status;

      send({
        status: initial.status,
        placedAt: initial.placedAt,
        preparingAt: initial.preparingAt,
        readyAt: initial.readyAt,
        pickedUpAt: initial.pickedUpAt,
        events: initial.events,
      });

      // Close stream if already picked up
      if (initial.status === 'PICKED_UP') {
        closed = true;
        controller.close();
        return;
      }

      // Poll for changes every 2 seconds
      pollInterval = setInterval(async () => {
        if (closed) {
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
          return;
        }

        const tracking = await fetchTracking();
        if (!tracking || closed) return;

        // Only emit when status changes
        if (tracking.status !== lastStatus) {
          lastStatus = tracking.status;

          send({
            status: tracking.status,
            placedAt: tracking.placedAt,
            preparingAt: tracking.preparingAt,
            readyAt: tracking.readyAt,
            pickedUpAt: tracking.pickedUpAt,
            events: tracking.events,
          });

          // Close stream when order is picked up
          if (tracking.status === 'PICKED_UP') {
            closed = true;
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
            try {
              controller.close();
            } catch {
              // Already closed
            }
          }
        }
      }, 2000);
    },

    cancel() {
      closed = true;
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
