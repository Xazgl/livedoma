"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [feed, setFeed] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      const response = await fetch('/api/feed', { method: 'POST' });
      const data = await response.text();
      setFeed(data);
    };

    fetchFeed();
  }, []);

  return (
    <>
      {feed ? (
        <div dangerouslySetInnerHTML={{ __html: feed }} />
      ) : (
        null
      )}
    </>
  );
}
