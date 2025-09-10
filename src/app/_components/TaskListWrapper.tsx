import { useState, useEffect } from 'react';
import StickyNotesCycle from './TaskList';

export default function StickyNotesWrapper() {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIsWide(window.innerWidth > 1350);

    checkWidth();
    window.addEventListener('resize', checkWidth); 
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  if (!isWide) return null;

  return (
    <div className="block fixed left-4 top-16 z-50">
      <StickyNotesCycle width={72} height={96} />
    </div>
  );
}
