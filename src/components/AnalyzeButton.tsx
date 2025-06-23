
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Loader2 } from 'lucide-react';

interface AnalyzeButtonProps {
  onClick: () => void;
  isAnalyzing: boolean;
  disabled: boolean;
}

export const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({
  onClick,
  isAnalyzing,
  disabled
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isAnalyzing}
      size="lg"
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Analyzing Resume...
        </>
      ) : (
        <>
          <Brain className="w-5 h-5 mr-2" />
          Analyze Resume
        </>
      )}
    </Button>
  );
};
