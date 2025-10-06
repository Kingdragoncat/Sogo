"use client";

import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";

interface HtmlEmailProps {
  html: string;
  className?: string;
}

/**
 * Safely renders HTML email content with sanitization
 * Removes dangerous scripts, iframes, and other XSS vectors
 */
export function HtmlEmail({ html, className = "" }: HtmlEmailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !html) return;

    // Configure DOMPurify for email safety
    const clean = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'a', 'b', 'i', 'u', 'strong', 'em', 'p', 'br', 'div', 'span',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'img', 'hr', 'font', 'center'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'width', 'height',
        'style', 'class', 'target', 'rel',
        'align', 'valign', 'bgcolor', 'color', 'size'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      ADD_ATTR: ['target'],
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    });

    containerRef.current.innerHTML = clean;

    // Make all links open in new tab and add security
    const links = containerRef.current.querySelectorAll('a');
    links.forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

    // Lazy load images for performance
    const images = containerRef.current.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={`email-content ${className}`}
      style={{
        maxWidth: '100%',
        overflowX: 'auto',
      }}
    />
  );
}
