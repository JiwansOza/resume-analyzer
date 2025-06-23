import { AnalysisResult } from '../pages/Index';

type HuggingFaceResponse = { generated_text: string }[];
interface RoleCriteria {
  requiredSkills: string[];
  weight: number;
}

interface GeminiAnalysisRequest {
  resumeText: string;
  jobRole: string;
}

// Skill variants mapping for better matching
const skillVariants: Record<string, string[]> = {
  'JavaScript': ['JavaScript', 'JS'],
  'TypeScript': ['TypeScript', 'TS'],
  'HTML': ['HTML'],
  'CSS': ['CSS'],
  'React': ['React'],
  'Vue': ['Vue'],
  'Angular': ['Angular'],
  'Node.js': ['Node.js', 'Node'],
  'Python': ['Python'],
  'SQL': ['SQL'],
  'API': ['API', 'APIs', 'REST API', 'RESTful API'],
  'Database': ['Database', 'Databases'],
  'MongoDB': ['MongoDB'],
  'PostgreSQL': ['PostgreSQL'],
  'Docker': ['Docker'],
  'AWS': ['AWS', 'Amazon Web Services'],
  'Figma': ['Figma'],
  'Adobe XD': ['Adobe XD'],
  'Sketch': ['Sketch'],
  'Prototyping': ['Prototyping', 'Prototype'],
  'User Research': ['User Research'],
  'Wireframing': ['Wireframing', 'Wireframe'],
  'Design Systems': ['Design Systems', 'Design System'],
  'Usability Testing': ['Usability Testing'],
  // Add more as needed
};

// Normalize resume text: lowercase, remove extra spaces, punctuation
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const analyzeResumeWithGemini = async ({ resumeText, jobRole }: GeminiAnalysisRequest): Promise<AnalysisResult> => {
  try {
    console.log('Starting AI analysis for role:', jobRole);
    console.log('Resume text length:', resumeText.length);
    
    // Use Hugging Face's free inference API
    const analysis = await analyzeWithHuggingFace(resumeText, jobRole);
    return analysis;
  } catch (error) {
    console.error('AI analysis error:', error);
    // Fallback to enhanced local analysis if API fails
    return await enhancedLocalAnalysis(resumeText, jobRole);
  }
};

const analyzeWithHuggingFace = async (resumeText: string, jobRole: string): Promise<AnalysisResult> => {
  const prompt = createDetailedPrompt(resumeText, jobRole);
  
  try {
    // Using Hugging Face's free inference API
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const result: HuggingFaceResponse = await response.json();
    return await parseAIResponse(result, jobRole, resumeText);
  } catch (error) {
    console.log('Hugging Face API unavailable, using enhanced local analysis');
    throw error;
  }
};

const createDetailedPrompt = (resumeText: string, jobRole: string): string => {
  return `Analyze this resume for a ${jobRole} position and provide structured feedback:

Resume Content:
${resumeText.substring(0, 2000)}...

Please analyze and provide:
1. Job fit assessment
2. Missing skills for ${jobRole}
3. Grammar/formatting issues
4. Improvement suggestions
5. Score out of 100`;
};

const parseAIResponse = async (
  apiResponse: HuggingFaceResponse,
  jobRole: string,
  resumeText: string
): Promise<AnalysisResult> => {
  // Parse the AI response and structure it
  const responseText = apiResponse[0]?.generated_text || '';
  
  // Enhanced analysis based on the AI response and role-specific criteria
  return enhancedLocalAnalysis(resumeText, jobRole, responseText);
};

const enhancedLocalAnalysis = async (resumeText: string, jobRole: string, aiInsight?: string): Promise<AnalysisResult> => {
  console.log('Performing enhanced local analysis for:', jobRole);
  
  const roleSpecificData = getRoleSpecificCriteria(jobRole);
  const normalizedResume = normalizeText(resumeText);
  
  // Improved skill matching using regex and variants
  const foundSkills = roleSpecificData.requiredSkills.filter(skill => {
    const variants = skillVariants[skill] || [skill];
    return variants.some(variant => {
      const regex = new RegExp(`\\b${variant.toLowerCase()}\\b`, 'i');
      return regex.test(normalizedResume);
    });
  });
  
  const missingKeywords = roleSpecificData.requiredSkills.filter(skill => {
    const variants = skillVariants[skill] || [skill];
    return !variants.some(variant => {
      const regex = new RegExp(`\\b${variant.toLowerCase()}\\b`, 'i');
      return regex.test(normalizedResume);
    });
  }).slice(0, 7);
  
  // Basic grammar analysis
  const grammarIssues = analyzeGrammar(resumeText);
  
  // Calculate score based on multiple factors
  const skillMatchPercentage = (foundSkills.length / roleSpecificData.requiredSkills.length) * 100;
  const score = calculateScore(skillMatchPercentage, resumeText, roleSpecificData);
  
  // Generate role-specific suggestions
  const suggestions = generateSuggestions(jobRole, foundSkills, missingKeywords, resumeText);
  
  return {
    jobFit: generateJobFitAnalysis(skillMatchPercentage, jobRole, foundSkills),
    missingKeywords,
    grammarIssues,
    suggestions,
    score: Math.round(score)
  };
};

const getRoleSpecificCriteria = (jobRole: string): RoleCriteria => {
  const criteriaMap: Record<string, RoleCriteria> = {
    'Frontend Developer': {
      requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Vue', 'Angular', 'Responsive Design', 'Git', 'Webpack'],
      weight: 1.2
    },
    'Backend Developer': {
      requiredSkills: ['Node.js', 'Python', 'Java', 'SQL', 'API', 'Database', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'],
      weight: 1.1
    },
    'Full Stack Developer': {
      requiredSkills: ['React', 'Node.js', 'JavaScript', 'SQL', 'API', 'Git', 'Database', 'HTML', 'CSS', 'MongoDB'],
      weight: 1.3
    },
    'Data Scientist': {
      requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'TensorFlow', 'Pandas', 'NumPy', 'SQL', 'R', 'Analytics', 'Visualization'],
      weight: 1.4
    },
    'Data Analyst': {
      requiredSkills: ['SQL', 'Excel', 'Python', 'Tableau', 'Power BI', 'Statistics', 'Analytics', 'Visualization', 'R', 'Data Mining'],
      weight: 1.1
    },
    'UI/UX Designer': {
      requiredSkills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems', 'Usability Testing'],
      weight: 1.0
    },
    'DevOps Engineer': {
      requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Jenkins', 'Terraform', 'Linux', 'Monitoring', 'Git', 'Automation'],
      weight: 1.3
    }
  };
  
  return criteriaMap[jobRole] || criteriaMap['Frontend Developer'];
};

const analyzeGrammar = (text: string): string => {
  const issues = [];
  
  if (text.length < 100) {
    issues.push('Resume appears too short');
  }
  
  if (!/[A-Z]/.test(text)) {
    issues.push('Missing proper capitalization');
  }
  
  if ((text.match(/\./g) || []).length < 3) {
    issues.push('Needs more complete sentences');
  }
  
  if (text.includes('  ')) {
    issues.push('Multiple spaces detected');
  }
  
  return issues.length > 0 ? issues.join('; ') : 'Good grammar and formatting overall';
};

const calculateScore = (skillMatch: number, resumeText: string, roleData: RoleCriteria): number => {
  let score = skillMatch * 0.6; // 60% weight on skills
  
  // Length factor (10% weight)
  const lengthScore = Math.min((resumeText.length / 1000) * 100, 100);
  score += lengthScore * 0.1;
  
  // Structure factor (15% weight)
  const hasStructure = /experience|education|skills|projects/i.test(resumeText);
  score += hasStructure ? 15 : 5;
  
  // Professional language factor (15% weight)
  const professionalWords = ['managed', 'developed', 'implemented', 'designed', 'created', 'improved'];
  const foundProfessional = professionalWords.filter(word => 
    resumeText.toLowerCase().includes(word)
  ).length;
  score += (foundProfessional / professionalWords.length) * 15;
  
  return Math.min(score, 100);
};

const generateJobFitAnalysis = (skillMatch: number, jobRole: string, foundSkills: string[]): string => {
  if (skillMatch >= 70) {
    return `Excellent fit for ${jobRole}! Your resume demonstrates strong alignment with ${foundSkills.length} key skills including ${foundSkills.slice(0, 3).join(', ')}. You show relevant experience and technical competencies.`;
  } else if (skillMatch >= 40) {
    return `Good potential for ${jobRole}. Your resume shows some relevant skills (${foundSkills.join(', ')}), but could benefit from highlighting more ${jobRole}-specific experience and technologies.`;
  } else {
    return `Limited alignment with ${jobRole} requirements. Your resume would benefit from adding more relevant skills and experience specific to ${jobRole} positions.`;
  }
};

const generateSuggestions = (jobRole: string, foundSkills: string[], missingKeywords: string[], resumeText: string): string => {
  const suggestions = [];
  
  if (missingKeywords.length > 0) {
    suggestions.push(`• Add experience with key ${jobRole} technologies: ${missingKeywords.slice(0, 3).join(', ')}`);
  }
  
  if (resumeText.length < 500) {
    suggestions.push('• Expand your resume with more detailed project descriptions and achievements');
  }
  
  if (!resumeText.toLowerCase().includes('project')) {
    suggestions.push('• Include relevant projects that demonstrate your technical skills');
  }
  
  if (!/\d+%|\d+x|increased|decreased|improved/i.test(resumeText)) {
    suggestions.push('• Add quantifiable achievements (e.g., "Improved performance by 40%")');
  }
  
  suggestions.push(`• Tailor your resume more specifically to ${jobRole} by emphasizing relevant experience`);
  
  return suggestions.join('\n');
};
