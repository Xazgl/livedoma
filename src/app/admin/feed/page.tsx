"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [feed, setFeed] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      const response = await fetch('/api/feed', { method: 'GET' });
      const data = await response.text();
      setFeed(data);
    };

    fetchFeed();
  }, []);

  return (
    <>
      {feed ? (
        <div className='flex flex-col h-auto w-full text-white text-[14px] ' dangerouslySetInnerHTML={{ __html: feed }} />
      ) : (
        null
      )}
    </>
  );
}
