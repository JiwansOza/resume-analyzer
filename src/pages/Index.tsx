import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { FeedbackDisplay } from '../components/FeedbackDisplay';
import { AnalyzeButton } from '../components/AnalyzeButton';
import { Brain, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { extractTextFromFile } from '../utils/fileProcessor';
import { analyzeResumeWithGemini } from '../services/geminiService';
import Footer from '../components/Footer';

export interface AnalysisResult {
  jobFit: string;
  missingKeywords: string[];
  grammarIssues: string;
  suggestions: string;
  score: number;
  foundSkills: string[];
}

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setAnalysisResult(null);
    toast.success('Resume uploaded successfully!');
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
  };

  const handleJDChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile || !jobDescription) {
      toast.error('Please upload a resume and provide a job description');
      return;
    }
    setIsAnalyzing(true);
    try {
      console.log('Starting analysis for file:', uploadedFile.name);
      toast.info('Extracting text from your resume...');
      const resumeText = await extractTextFromFile(uploadedFile);
      console.log('Extracted text length:', resumeText.length);
      if (resumeText.length < 50) {
        toast.error('Could not extract enough text from the file. Please ensure your file contains readable text.');
        return;
      }
      toast.info('AI is analyzing your resume...');
      const result = await analyzeResumeWithGemini({
        resumeText,
        jobRole: '',
        jobDescription
      });
      console.log('Analysis completed:', result);
      setAnalysisResult(result);
      toast.success('Resume analysis completed!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Unable to analyze resume. Please try again or check your file format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">AI Resume Analyzer</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get professional feedback on your resume with AI-powered analysis. 
            Upload your resume, select your target role, and receive actionable insights.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* File Upload Section */}
              <div>
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-800">Upload Resume</h2>
                </div>
                <FileUpload
                  onFileUpload={handleFileUpload}
                  onFileRemove={handleFileRemove}
                  uploadedFile={uploadedFile}
                />
              </div>

              {/* Job Description Section */}
              <div>
                <div className="mt-6">
                  <label htmlFor="jd-input" className="block text-lg font-semibold text-gray-800 mb-2">Paste Job Description</label>
                  <textarea
                    id="jd-input"
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={handleJDChange}
                  />
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <div className="text-center">
              <AnalyzeButton
                onClick={handleAnalyze}
                isAnalyzing={isAnalyzing}
                disabled={!uploadedFile || !jobDescription}
              />
            </div>
          </div>

          {/* Results Section */}
          {analysisResult && (
            <FeedbackDisplay result={analysisResult} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
