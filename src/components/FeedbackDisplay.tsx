
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Key, Pen, Brain, BarChart, Download } from 'lucide-react';
import { AnalysisResult } from '../pages/Index';

interface FeedbackDisplayProps {
  result: AnalysisResult;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const downloadFeedback = () => {
    const feedbackText = `Resume Analysis Report

Job Fit: ${result.jobFit}

Missing Keywords: ${result.missingKeywords.join(', ')}

Grammar/Spelling Issues: ${result.grammarIssues}

Suggestions to Improve:
${result.suggestions}

Final Resume Score: ${result.score}/100`;

    const blob = new Blob([feedbackText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-analysis-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Score */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-4">Analysis Complete</CardTitle>
          <div className="flex items-center justify-center space-x-4">
            <div className={`px-6 py-3 rounded-full ${getScoreColor(result.score)} text-2xl font-bold`}>
              {result.score}/100
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {getScoreLabel(result.score)}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Feedback Sections */}
      <div className="grid gap-6">
        {/* Job Fit */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="w-6 h-6 mr-3" />
              Job Fit Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{result.jobFit}</p>
          </CardContent>
        </Card>

        {/* Missing Keywords */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-700">
              <Key className="w-6 h-6 mr-3" />
              Missing Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grammar Issues */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Pen className="w-6 h-6 mr-3" />
              Grammar & Spelling
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{result.grammarIssues}</p>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Brain className="w-6 h-6 mr-3" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.suggestions.split('\n').map((suggestion, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {suggestion}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download Button */}
      <div className="text-center pt-6">
        <Button
          onClick={downloadFeedback}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg font-semibold"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Feedback Report
        </Button>
      </div>
    </div>
  );
};
