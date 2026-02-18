'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Users, Coffee } from 'lucide-react';
import { useGroupOrderStore } from '@/lib/group-order-store';

export default function JoinGroupOrderPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [name, setName] = useState('');
  const [mounted, setMounted] = useState(false);

  const { currentOrder, joinGroupOrder } = useGroupOrderStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleJoin = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const success = joinGroupOrder(code.toUpperCase(), name.trim());
    if (success) {
      toast.success('Joined the group order!');
      router.push('/group-order');
    } else {
      toast.error('Could not join. The order may have expired or the code is invalid.');
    }
  };

  if (!mounted) return null;

  // Already in a group order
  if (currentOrder) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center pb-20">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Coffee className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-xl font-bold">Already in a Group Order</h1>
          <p className="mt-2 text-gray-500">
            You're already part of a group order. Leave it first to join a new one.
          </p>
          <button
            onClick={() => router.push('/group-order')}
            className="mt-6 rounded-full bg-[#1A3C8B] px-8 py-3 font-medium text-white transition-colors hover:bg-[#2D5BB9]"
          >
            Go to Current Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1A3C8B]/10">
          <Users className="h-8 w-8 text-[#1A3C8B]" />
        </div>

        <h1 className="text-2xl font-bold">Join Group Order</h1>
        <p className="mt-2 text-gray-500">
          You've been invited to join a group order
        </p>

        {/* Code display */}
        <div className="my-6 rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Order Code</p>
          <p className="text-2xl font-bold tracking-widest text-[#1A3C8B]">
            {code.toUpperCase()}
          </p>
        </div>

        {/* Name input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-center focus:border-[#1A3C8B] focus:outline-none"
        />

        <button
          onClick={handleJoin}
          className="w-full rounded-full bg-[#1A3C8B] py-3 font-medium text-white transition-colors hover:bg-[#2D5BB9]"
        >
          Join Order
        </button>

        <p className="mt-4 text-xs text-gray-400">
          By joining, you'll be able to add items to the shared order
        </p>
      </motion.div>
    </div>
  );
}
