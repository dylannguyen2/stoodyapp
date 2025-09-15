import { useState, useEffect } from 'react';
import StickyNotesCycle from './TaskList';

export default function StickyNotesWrapper({ width = 72, height = 96 }) {

  return (
    <div className="">
      <StickyNotesCycle width={width} height={height} />
    </div>
  );
}
