import React from "react";

/**
 * A simple, lightweight, and dependency-free parser that converts basic Markdown 
 * formatting (**bold**, *italic*, [text](url), and list items) into React elements.
 */
export function renderMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];
  
  const lines = text.split("\n");
  const parsedNodes: React.ReactNode[] = [];
  let inList = false;
  let listType: "ul" | "ol" | null = null;
  let currentListItems: React.ReactNode[] = [];

  const flushList = (key: number) => {
    if (currentListItems.length > 0) {
      if (listType === "ul") {
        parsedNodes.push(
          <ul key={`ul-${key}`} className="list-disc pl-5 my-2 space-y-1">
            {...currentListItems}
          </ul>
        );
      } else if (listType === "ol") {
        parsedNodes.push(
          <ol key={`ol-${key}`} className="list-decimal pl-5 my-2 space-y-1">
            {...currentListItems}
          </ol>
        );
      }
      currentListItems = [];
      inList = false;
      listType = null;
    }
  };

  lines.forEach((line, idx) => {
    // Unordered List Match: - item or * item
    const ulMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        flushList(idx);
        inList = true;
        listType = "ul";
      }
      currentListItems.push(
        <li key={`li-${idx}`} className="text-neutral-600 dark:text-neutral-400 font-mono text-xs sm:text-sm leading-relaxed">
          {parseInline(ulMatch[1])}
        </li>
      );
      return;
    }

    // Ordered List Match: 1. item
    const olMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!inList || listType !== "ol") {
        flushList(idx);
        inList = true;
        listType = "ol";
      }
      currentListItems.push(
        <li key={`li-${idx}`} className="text-neutral-600 dark:text-neutral-400 font-mono text-xs sm:text-sm leading-relaxed">
          {parseInline(olMatch[1])}
        </li>
      );
      return;
    }

    // Normal line: Flush list if we were in one
    flushList(idx);

    if (line.trim() === "") {
      parsedNodes.push(<div key={`empty-${idx}`} className="h-2" />);
      return;
    }

    parsedNodes.push(
      <p key={`p-${idx}`} className="font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
        {parseInline(line)}
      </p>
    );
  });

  // Flush any remaining list items at the end
  flushList(lines.length);

  return parsedNodes;
}

function parseInline(text: string): React.ReactNode[] {
  let parts: React.ReactNode[] = [text];
  
  // Link parser: [label](url)
  parts = parts.flatMap((part, idx) => {
    if (typeof part !== "string") return part;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const result: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    while ((match = linkRegex.exec(part)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        result.push(part.substring(lastIndex, matchIndex));
      }
      const label = match[1];
      const url = match[2];
      result.push(
        <a
          key={`link-${idx}-${matchIndex}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-500 hover:text-sky-400 hover:underline inline-flex items-center gap-0.5"
        >
          {label}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    
    if (lastIndex < part.length) {
      result.push(part.substring(lastIndex));
    }
    
    return result;
  });

  // Bold parser: **text**
  parts = parts.flatMap((part, idx) => {
    if (typeof part !== "string") return part;
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const result: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    while ((match = boldRegex.exec(part)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        result.push(part.substring(lastIndex, matchIndex));
      }
      const boldText = match[1];
      result.push(
        <strong key={`bold-${idx}-${matchIndex}`} className="font-bold text-neutral-900 dark:text-white">
          {boldText}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }
    
    if (lastIndex < part.length) {
      result.push(part.substring(lastIndex));
    }
    
    return result;
  });

  // Italic parser: *text*
  parts = parts.flatMap((part, idx) => {
    if (typeof part !== "string") return part;
    const italicRegex = /\*([^*]+)\*/g;
    const result: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    while ((match = italicRegex.exec(part)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        result.push(part.substring(lastIndex, matchIndex));
      }
      const italicText = match[1];
      result.push(
        <em key={`italic-${idx}-${matchIndex}`} className="italic">
          {italicText}
        </em>
      );
      lastIndex = italicRegex.lastIndex;
    }
    
    if (lastIndex < part.length) {
      result.push(part.substring(lastIndex));
    }
    
    return result;
  });

  return parts;
}
