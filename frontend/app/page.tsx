'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchChirps, postChirp } from '@/lib/api';
import { useState } from 'react';
import { Chirp } from '@/types/chirp';
import { useAuth } from '@/providers';

export default function Feed() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');

  const { data: chirps = [], isLoading } = useQuery({
    queryKey: ['chirps'],
    queryFn: fetchChirps,
  });

  const mutation = useMutation({
    mutationFn: postChirp,
    onMutate: async (newChirpContent) => {
      await queryClient.cancelQueries({ queryKey: ['chirps'] });

      const previousChirps = queryClient.getQueryData(['chirps']);

      queryClient.setQueryData(['chirps'], (old: Chirp[] = []) => [
        {
          id: 'temp-id-' + Date.now(),
          user_id: user?.id,
          username: user?.username,
          content: newChirpContent,
          created_at: new Date().toISOString(),
        },
        ...old,
      ]);

      setText('');

      return { previousChirps };
    },
    onError: (_err, _newChirp, context) => {
      if (context?.previousChirps) {
        queryClient.setQueryData(['chirps'], context.previousChirps);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chirps'] });
    },
});


  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      {user ? (<form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(text);
        }}
        className="flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 border p-2"
        />
        <button className="bg-green-600 text-white px-4">Chirp</button>
      </form>)
      :(
        <p className="text-center text-gray-500">Please <a href='/login' className='text-blue-500'>log in</a> or <a href='/register' className='text-blue-500'>sign up</a> to post a chirp.</p>
      )}

      {isLoading ? (
        <p>Loading chirps...</p>
      ) : (
        <ul className="space-y-2">
          {chirps.map((chirp) => (
            <li key={chirp.id} className="border p-3 rounded bg-white">
              <p className="text-sm text-gray-500">@{chirp.username}</p>
              <p>{chirp.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
