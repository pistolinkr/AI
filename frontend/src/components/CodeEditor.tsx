import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeEditorProps {
  code: string;
  language: string;
  readOnly?: boolean;
  onChange?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  language, 
  readOnly = false, 
  onChange 
}) => {
  if (readOnly) {
    return (
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={tomorrow}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            fontSize: '14px',
            lineHeight: '1.5',
            maxHeight: '400px',
            overflow: 'auto'
          }}
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <div className="relative">
      <textarea
        value={code}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-64 p-4 font-mono text-sm bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="코드를 입력하세요..."
        style={{
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          lineHeight: '1.5'
        }}
      />
    </div>
  );
};

export default CodeEditor; 