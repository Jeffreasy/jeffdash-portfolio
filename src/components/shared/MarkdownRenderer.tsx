import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownRenderer.module.css'; // Importeer CSS Module voor styling

interface MarkdownRendererProps {
  children: string; // De markdown string
}

export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
  if (!children) {
    return null;
  }

  return (
    <div className={styles.markdownContent}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // Activeer GitHub Flavored Markdown
        // Optioneel: Voeg component overrides toe voor custom rendering/styling
        // components={{
        //   h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
        //   p: ({node, ...props}) => <p className="mb-4" {...props} />,
        //   // ... andere overrides voor bv. code blocks, links, etc.
        // }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
} 