import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Lightbulb, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import HypothesisCard from '@/components/HypothesisCard';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import Header from '@/components/Header';

interface Hypothesis {
  hypothesis: string;
  analysis: string;
  knowledgeGraph: {
    nodes: string[];
    edges: Array<{
      from: string;
      to: string;
      relationship: string;
    }>;
  };
  summary: string[];
}

const Index = () => {
  const [currentHypothesis, setCurrentHypothesis] = useState<Hypothesis | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isUserGenerating, setIsUserGenerating] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  const { toast } = useToast();

  // Internal API key - not exposed to user
  const API_KEY = "AIzaSyB0DNwA9kOEMX0Q0S0UiJDlOf31RnxjDV0";

  const generateHypothesis = async () => {
    setIsGenerating(true);
    
    const prompt = `
You are an autonomous scientific hypothesis engine focused only on redheads (people with natural red hair).

Your job is to create DIVERSE hypotheses covering different domains. Avoid repeating MC1R gene focus every time.

Choose ONE unique domain from these options and create a fresh hypothesis:

🧬 GENETIC DIVERSITY: Rare genetic variants, chromosomal patterns, hereditary traits beyond MC1R
🩺 MEDICAL CONDITIONS: Autoimmune diseases, metabolic disorders, cardiovascular health, neurological conditions
🧠 NEUROLOGICAL & COGNITIVE: Memory formation, learning patterns, brain chemistry, neurotransmitters
💊 PHARMACOLOGY: Drug metabolism, medication responses, anesthesia alternatives, supplement absorption
🌡️ SENSORY PERCEPTION: Temperature sensitivity, taste preferences, smell detection, light sensitivity
🏃 PHYSICAL PERFORMANCE: Athletic abilities, muscle fiber composition, recovery rates, endurance
🧪 BIOCHEMISTRY: Hormone production, enzyme activity, protein synthesis, cellular metabolism
👥 SOCIAL PSYCHOLOGY: Attraction patterns, social perception, behavioral traits, communication styles
🌍 EVOLUTIONARY BIOLOGY: Adaptation advantages, survival traits, population genetics, natural selection
🔬 CELLULAR BIOLOGY: Cell regeneration, aging processes, DNA repair mechanisms, oxidative stress

Requirements:
1. Pick a DIFFERENT domain than typical MC1R/pain sensitivity topics
2. Create a unique, scientifically plausible hypothesis
3. Use diverse vocabulary and concepts
4. Include 4-6 varied knowledge graph nodes
5. Write 150-200 words of scientific analysis
6. Provide 3-5 key insights

Format as valid JSON:
{
  "hypothesis": "Clear hypothesis statement",
  "analysis": "Scientific reasoning and explanation",
  "knowledgeGraph": {
    "nodes": ["Node1", "Node2", "Node3", "Node4"],
    "edges": [
      { "from": "Node1", "to": "Node2", "relationship": "relationship type" }
    ]
  },
  "summary": ["Insight 1", "Insight 2", "Insight 3"]
}

⚠️ Important: Return ONLY valid JSON, no other text. Be creative and explore different scientific angles each time.
`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (output) {
        const cleanOutput = output.replace(/```json\n?|\n?```/g, '').trim();
        const parsedHypothesis = JSON.parse(cleanOutput);
        setCurrentHypothesis(parsedHypothesis);
        
        toast({
          title: "Hypothesis Generated!",
          description: "A new scientific hypothesis has been created.",
        });
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('Error generating hypothesis:', error);
      toast({
        title: "Error",
        description: "Failed to generate hypothesis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateUserHypothesis = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter your topic or question",
        variant: "destructive",
      });
      return;
    }

    setIsUserGenerating(true);

    const checkPrompt = `
Analyze this user input and determine if it's related to redheads, red hair, or people with natural red hair: "${userInput}"

Respond with only "YES" if it's related to redheads/red hair, or "NO" if it's not related.
`;

    try {
      const checkResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: checkPrompt
                }
              ]
            }
          ]
        })
      });

      if (!checkResponse.ok) {
        throw new Error(`HTTP error! status: ${checkResponse.status}`);
      }

      const checkData = await checkResponse.json();
      const checkOutput = checkData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (checkOutput !== 'YES') {
        toast({
          title: "Invalid Topic",
          description: "Sorry, this is only redhead community oriented. Please ask about redheads or red hair related topics.",
          variant: "destructive",
        });
        setIsUserGenerating(false);
        return;
      }

      const hypothesisPrompt = `
You are an autonomous scientific hypothesis engine focused only on redheads (people with natural red hair).

Based on this user input: "${userInput}"

Create a scientifically plausible hypothesis related to redheads that addresses or explores the user's topic/question.

Requirements:
1. Create a unique, scientifically plausible hypothesis about redheads
2. Connect it to the user's input topic
3. Include 4-6 varied knowledge graph nodes
4. Write 150-200 words of scientific analysis
5. Provide 3-5 key insights

Format as valid JSON:
{
  "hypothesis": "Clear hypothesis statement",
  "analysis": "Scientific reasoning and explanation",
  "knowledgeGraph": {
    "nodes": ["Node1", "Node2", "Node3", "Node4"],
    "edges": [
      { "from": "Node1", "to": "Node2", "relationship": "relationship type" }
    ]
  },
  "summary": ["Insight 1", "Insight 2", "Insight 3"]
}

⚠️ Important: Return ONLY valid JSON, no other text.
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: hypothesisPrompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (output) {
        const cleanOutput = output.replace(/```json\n?|\n?```/g, '').trim();
        const parsedHypothesis = JSON.parse(cleanOutput);
        setCurrentHypothesis(parsedHypothesis);
        setUserInput('');
        
        toast({
          title: "Custom Hypothesis Generated!",
          description: "Your custom scientific hypothesis has been created.",
        });
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('Error generating user hypothesis:', error);
      toast({
        title: "Error",
        description: "Failed to generate hypothesis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUserGenerating(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800' : 'bg-gradient-to-br from-gray-50 via-white to-orange-50'}`}>
      <Header isDarkTheme={isDarkTheme} onThemeToggle={() => setIsDarkTheme(!isDarkTheme)} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className={`inline-flex items-center gap-2 ${isDarkTheme ? 'bg-gradient-to-r from-orange-900/40 via-orange-800/30 to-black/40 border-orange-500/30 text-orange-200' : 'bg-gradient-to-r from-orange-100/60 via-orange-200/40 to-white/60 border-orange-400/40 text-orange-800'} px-4 sm:px-6 py-2 sm:py-3 rounded-full border backdrop-blur-sm shadow-xl text-sm sm:text-base font-medium mb-6 sm:mb-8`}>
            <Sparkles className={`h-4 w-4 sm:h-5 sm:w-5 ${isDarkTheme ? 'text-orange-400' : 'text-orange-600'}`} />
            AI-Powered Research Generator
          </div>
          
          <Button
            onClick={generateHypothesis}
            disabled={isGenerating}
            className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 hover:from-orange-700 hover:via-orange-800 hover:to-orange-900 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl shadow-2xl shadow-orange-600/30 transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/40 border border-orange-500/30 mb-4 sm:mb-6"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                Generating Hypothesis...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                Generate New Hypothesis
              </>
            )}
          </Button>
          
          <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base max-w-2xl mx-auto leading-relaxed`}>
            Generate unique, scientifically-grounded hypotheses about redheads and their characteristics using advanced AI technology
          </p>
        </div>

        {/* Custom Input Section */}
        <div className="max-w-3xl mx-auto mb-12 sm:mb-16">
          <Card className={`shadow-2xl ${isDarkTheme ? 'shadow-orange-900/20 border-orange-500/20 bg-gradient-to-br from-gray-900/80 via-black/60 to-gray-800/80' : 'shadow-orange-200/30 border-orange-300/30 bg-gradient-to-br from-white/90 via-orange-50/60 to-white/80'} backdrop-blur-xl`}>
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className={`flex items-center gap-3 text-lg sm:text-xl ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 rounded-lg sm:rounded-xl shadow-lg shadow-orange-600/30 border border-orange-400/30">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                Create Custom Hypothesis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="userInput" className={`block text-sm font-semibold ${isDarkTheme ? 'text-orange-200' : 'text-orange-800'} mb-3`}>
                  Enter your redhead-related research question:
                </label>
                <Textarea
                  id="userInput"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g., Do redheads have different vitamin D absorption? Are redheads more creative? Redhead genetics and climate adaptation..."
                  className={`min-h-[100px] resize-none border-2 ${isDarkTheme ? 'border-orange-500/30 focus:border-orange-400 bg-black/40 text-white placeholder:text-gray-400' : 'border-orange-300/40 focus:border-orange-500 bg-white/60 text-gray-900 placeholder:text-gray-500'} rounded-xl text-base p-4 backdrop-blur-sm shadow-inner`}
                />
              </div>

              <Button
                onClick={generateUserHypothesis}
                disabled={isUserGenerating || !userInput.trim()}
                className={`w-full bg-gradient-to-r from-orange-700 via-orange-800 to-orange-900 hover:from-orange-800 hover:via-orange-900 hover:to-black text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/30 border border-orange-500/30`}
              >
                {isUserGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Custom Hypothesis...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Custom Hypothesis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {currentHypothesis && (
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="space-y-6">
              <HypothesisCard hypothesis={currentHypothesis} isDarkTheme={isDarkTheme} />
            </div>
            <div>
              <KnowledgeGraph data={currentHypothesis.knowledgeGraph} isDarkTheme={isDarkTheme} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentHypothesis && (
          <div className="text-center py-16 sm:py-20">
            <div className={`${isDarkTheme ? 'bg-gradient-to-br from-orange-800/30 via-orange-700/20 to-black/30 border-orange-500/30 shadow-orange-900/30' : 'bg-gradient-to-br from-orange-200/40 via-orange-100/30 to-white/40 border-orange-300/40 shadow-orange-200/30'} w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl border backdrop-blur-sm`}>
              <div className="text-3xl sm:text-4xl">🧬</div>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-4`}>
              Ready to Explore Scientific Hypotheses
            </h2>
            <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} max-w-lg mx-auto text-base sm:text-lg leading-relaxed`}>
              Use the generators above to create unique, scientifically-grounded hypotheses about redheads and their fascinating characteristics.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
