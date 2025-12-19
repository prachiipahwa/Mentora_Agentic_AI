
import React from 'react';

interface MarkdownTextProps {
    content: string;
    className?: string;
}

export function MarkdownText({ content, className = "" }: MarkdownTextProps) {
    // Split by newlines to handle block-level elements
    const lines = content.split('\n');

    return (
        <div className={`space-y-1 ${className}`}>
            {lines.map((line, i) => {
                const trimmed = line.trim();

                // Allow empty lines to render as spacing
                if (trimmed === '') {
                    return <div key={i} className="h-2" />;
                }

                // Handle Headers (###)
                if (trimmed.startsWith('### ')) {
                    return (
                        <h3 key={i} className="font-semibold text-base mt-2 mb-1">
                            {parseInline(trimmed.substring(4))}
                        </h3>
                    );
                }

                // Handle Bullet Points (- or *)
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    return (
                        <div key={i} className="flex gap-2 pl-2">
                            <span className="opacity-70 mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                            <span className="leading-relaxed">{parseInline(trimmed.substring(2))}</span>
                        </div>
                    );
                }

                // Default Paragraph
                return (
                    <p key={i} className="leading-relaxed">
                        {parseInline(line)}
                    </p>
                );
            })}
        </div>
    );
}

/**
 * Parses inline formatting like **bold** and *italic*
 */
function parseInline(text: string): React.ReactNode[] {
    // Split by bold syntax (**text**)
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={index} className="font-bold text-foreground">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        // Could add italic handling here if needed
        return part;
    });
}
