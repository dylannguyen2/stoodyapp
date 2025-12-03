"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import TrashIcon from "./icons/TrashIcon";
import CheckIcon from "./icons/CheckIcon";
import BroomIcon from "./icons/BroomIcon";

type Task = { id: string; text: string; done: boolean };

const colors = ["#C18FFF", "#5EB1FF", "#FFC645"];
const maxVisibleDots = 5;

// default fallback item height (px) used if measurement fails
const FALLBACK_ITEM_HEIGHT = 40;

export default function StickyNotesCycle({width = 72, height = 72}: {width?: number | string, height?: number | string}) {
  const [index, setIndex] = useState(0);
  const [tasks, setTasks] = useLocalStorage<Task[]>("stoody_tasks_all", []);
  const [maxTasksPerCard, setMaxTasksPerCard] = useState<number>(5);
  const [input, setInput] = useState("");
  const [expandedTask, setExpandedTask] = useState<Task | null>(null); // For modal
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [availableListHeight, setAvailableListHeight] = useState<number | null>(null);

  // compute task pages using the dynamic maxTasksPerCard
  const tasksList: Task[][] = [];
  const totalCards = Math.max(Math.ceil(tasks.length / maxTasksPerCard), 3);
  for (let i = 0; i < totalCards; i++) {
    tasksList.push(tasks.slice(i * maxTasksPerCard, (i + 1) * maxTasksPerCard));
  }

  const [pageCount, setPageCount] = useLocalStorage<number>("stoody_page_count", Math.max(3, totalCards));
  const [currentPage, setCurrentPage] = useLocalStorage<number>("stoody_current_page", 1);

  // measure available space inside the visible card and compute how many items fit
  useEffect(() => {
    if (!rootRef.current) return;

    const measure = () => {
      // find the rendered card with pos === 0 (visible front card)
      const cardEl = rootRef.current!.querySelector<HTMLDivElement>('[data-pos="0"]');
      if (!cardEl) return;

      const cardHeight = cardEl.clientHeight;
      // find header, input and footer heights (selectors added below)
      const header = cardEl.querySelector<HTMLElement>('.card-header');
      const inputWrap = cardEl.querySelector<HTMLElement>('.card-input');
      const footer = cardEl.querySelector<HTMLElement>('.card-footer');

      const headerH = header?.offsetHeight ?? 48;
      const inputH = inputWrap?.offsetHeight ?? 0;
      const footerH = footer?.offsetHeight ?? 28;

      // compute available list height (clientHeight already excludes margins)
      const available = Math.max(0, cardHeight - headerH - inputH - footerH - 8); // small buffer
      setAvailableListHeight(available);

      const itemEl = cardEl.querySelector<HTMLLIElement>('li');
      const itemH = itemEl ? Math.ceil(itemEl.offsetHeight) : FALLBACK_ITEM_HEIGHT;
      const fit = Math.max(1, Math.floor(available / itemH));
      setMaxTasksPerCard(fit);
    };

    // use ResizeObserver on the root so changes in layout re-measure
    const ro = new ResizeObserver(measure);
    ro.observe(rootRef.current);
    // also measure once now
    measure();
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width, height, tasks.length]);

  useEffect(() => {
    const newTotal = Math.max(Math.ceil(tasks.length / maxTasksPerCard), 3);
    if (pageCount !== newTotal) setPageCount(newTotal);
    if (currentPage > newTotal) setCurrentPage(newTotal);
    if (currentPage < 1) setCurrentPage(1);
    const maxIndex = Math.max(0, newTotal - 1, Math.ceil(tasks.length / maxTasksPerCard) - 1);
    if (index > maxIndex) setIndex(maxIndex);
  }, [tasks.length]);

  useEffect(() => {
    const page = Math.min(Math.max(1, index + 1), pageCount);
    if (currentPage !== page) setCurrentPage(page);
  }, [index]);

  useEffect(() => {
    const target = Math.min(Math.max(1, currentPage), tasksList.length) - 1;
    if (index !== target) setIndex(target);
  }, [currentPage]);

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0 && index < tasksList.length - 1) setIndex(index + 1);
    else if (e.deltaY < 0 && index > 0) setIndex(index - 1);
  };

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    const newTask: Task = { id: Date.now().toString(), text, done: false };
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    setInput("");

    const cardIndex = Math.floor((newTasks.length - 1) / maxTasksPerCard);
    setIndex(cardIndex);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)));
  };

  const removeTask = (taskId: string) => {
    const newTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(newTasks);
    const currentCardTasks = tasksList[index] ?? [];
    if (currentCardTasks.length === 1) {
      for (let i = 1; i <= tasksList.length; i++) {
        const prevIndex = (index - i + tasksList.length) % tasksList.length;
        if ((tasksList[prevIndex]?.length ?? 0) > 0) {
          setIndex(prevIndex);
          break;
        }
      }
    }
  };

  const clearCompleted = () => {
    const newTasks = tasks.filter((t) => !t.done);
    setTasks(newTasks);
    const newTotal = Math.max(Math.ceil(newTasks.length / maxTasksPerCard), 3);
    if (currentPage > newTotal) setCurrentPage(newTotal);
    if (index > Math.max(0, newTotal - 1)) setIndex(Math.max(0, newTotal - 1));
  };

  const getVisibleDots = () => {
    const totalPages = tasksList.length;
    let start = Math.max(0, index - Math.floor(maxVisibleDots / 2));
    let end = start + maxVisibleDots;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(0, end - maxVisibleDots);
    }
    return { start, end };
  };

  const { start: dotStart, end: dotEnd } = getVisibleDots();

  const getTaskPageIndex = (taskId: string) => {
    for (let i = 0; i < tasksList.length; i++) {
      if (tasksList[i]?.some((t) => t.id === taskId)) return i;
    }
    return 0;
  };

  let expandedColor = "#ffffff";
  if (expandedTask) {
    const pi = getTaskPageIndex(expandedTask.id);
    expandedColor = colors[pi % colors.length] ?? "#ffffff";
  }

  const [expandedMounted, setExpandedMounted] = useState(false);
  useEffect(() => {
    if (expandedTask) {
      setExpandedMounted(false);
      const id = requestAnimationFrame(() => setExpandedMounted(true));
      return () => cancelAnimationFrame(id);
    } else {
      setExpandedMounted(false);
    }
  }, [expandedTask]);

  const expandedStyle: React.CSSProperties = {
    backgroundColor: expandedColor,
    left: "50%",
    top: "50%",
    transform: `translate(-50%,-50%) rotate(-1deg) scale(${expandedMounted ? 1.04 : 0.96})`,
    opacity: expandedMounted ? 1 : 0,
    transition: "transform 260ms cubic-bezier(.2,.9,.2,1), box-shadow 260ms ease, opacity 180ms ease",
    boxShadow: expandedMounted
      ? "0 40px 90px rgba(0,0,0,0.42), 0 18px 40px rgba(0,0,0,0.22), inset 0 -8px 18px rgba(0,0,0,0.08)"
      : "0 12px 30px rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.65)",
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02)), repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 6px)",
    WebkitBackdropFilter: "none",
  };

  const resolvedWidth = typeof width === 'number' ? `${width * 4}px` : width;
  const resolvedHeight = typeof height === 'number' ? `${height * 4}px` : height;

  return (
    <div className="relative mx-auto" onWheel={handleScroll} style={{ width: resolvedWidth, height: resolvedHeight }}>
      {tasksList.map((cardTasks, i) => {
        const pos = (i - index + tasksList.length) % tasksList.length;
        const rotate = pos === 0 ? 0 : pos === 1 ? -3 : -6;
        const offset = pos * 6;
        const z = pos === 0 ? 30 : pos === 1 ? 20 : 10;
        const opacity = pos === 0 ? 1 : 0.6;
        const color = colors[i % colors.length];

        return (
          <div
            key={i}
            data-pos={pos}
            className={`absolute rounded-xl shadow-xl transition-all duration-500 ease-in-out p-4 overflow-hidden`}
            style={{
              backgroundColor: color,
              zIndex: z,
              top: offset,
              left: offset,
              transform: `rotate(${rotate}deg)`,
              opacity,
              width: resolvedWidth,
              height: resolvedHeight,
            }}
          >
            <div className="flex items-center justify-between mb-2 pr-2 w-full">
              <h2 className="text-2xl gochi-hand-regular font-bold underline card-header">To-do List</h2>
              {pos === 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearCompleted();
                    }}
                    className="p-1 rounded bg-white/80 hover:opacity-90 shadow-sm"
                    title="Clear completed tasks"
                    aria-label="Clear completed tasks"
                  >
                    <CheckIcon width={16} height={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTasks([]);
                      setIndex(0);
                      setCurrentPage(1);
                    }}
                    className="p-1 rounded text-white hover:opacity-90 shadow-sm"
                    title="Remove all tasks"
                    aria-label="Remove all tasks"
                  >
                    <BroomIcon width={16} height={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="relative flex flex-col h-full pb-8">
              {pos === 0 && (
                <div className="flex gap-2 mb-2 pr-2 card-input">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    placeholder="Add a task"
                    className="flex-1 min-w-0 px-2 py-1 rounded-sm bg-[#ead7ff] placeholder-black/40 focus:outline-none"
                  />
                  <button
                    onClick={addTask}
                    className="flex-shrink-0 px-3 py-1 rounded-md bg-[#0077FF] text-white font-semibold shadow-sm"
                  >
                    Add
                  </button>
                </div>
              )}

              <ul
                className="flex-1 overflow-hidden space-y-2 pr-2"
                style={{ height: availableListHeight ? `${availableListHeight}px` : 'auto' }}
              >
                {cardTasks.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center bg-white/30 rounded-md p-2 shadow-[0_2px_0_rgba(0,0,0,0.08)] cursor-pointer gap-2"
                    onClick={() => setExpandedTask(t)}
                  >
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(t.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 flex-shrink-0"
                      disabled={pos !== 0}
                      aria-label={`Toggle task ${t.text}`}
                    />
                    <span
                      className={`text-sm ${
                        t.done ? "line-through text-gray-500" : "text-black font-medium"
                      } truncate min-w-0 flex-1`}
                    >
                      {t.text}
                    </span>
                    {pos === 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTask(t.id);
                        }}
                        className="flex-shrink-0 text-sm text-red-600 hover:opacity-80 p-1 rounded"
                        aria-label={`Delete task ${t.text}`}
                      >
                        <TrashIcon className="text-red-600" width={16} height={16} />
                      </button>
                    )}
                  </li>

                ))}
              </ul>

              {pos === 0 && (
                <>
                  <div className="flex gap-1 items-center justify-center mt-2">
                    {tasksList.slice(dotStart, dotEnd).map((_, idx) => {
                      const pageNum = dotStart + idx;
                      const isCurrent = pageNum === index;
                      const fade =
                        isCurrent ? 1 : 0.4 + 0.6 * (1 - Math.abs(pageNum - index) / maxVisibleDots);
                      return (
                        <span
                          key={pageNum}
                          className={`rounded-full transition-all duration-300`}
                          style={{
                            width: isCurrent ? 6 : 4,
                            height: isCurrent ? 6 : 4,
                            opacity: fade,
                            backgroundColor: "#000",
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="card-footer" />
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Expanded task rendered as a sticky note on top of the pile (no screen popup) */}
      {expandedTask && (
        <>
          {/* transparent click-catcher to allow clicking outside to close (no visual backdrop) */}
          <div
            className="absolute inset-0 z-40"
            onClick={() => setExpandedTask(null)}
            aria-hidden
          />

          <div
            className={`absolute z-50 rounded-xl p-6 max-h-[70vh] overflow-auto`}
            style={{ ...expandedStyle, width: resolvedWidth }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl gochi-hand-regular font-bold mb-3">Task</h3>
            <p className="text-sm whitespace-pre-wrap break-words mb-4">{expandedTask.text}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setExpandedTask(null)}
                className="px-4 py-2 bg-white/80 text-black rounded-md font-medium shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
