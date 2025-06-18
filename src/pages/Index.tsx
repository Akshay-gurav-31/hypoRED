
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb } from 'lucide-react';
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

      const data = await response.json();
      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (output) {
        // Clean the output and parse JSON
        const cleanOutput = output.replace(/```json\n?|\n?```/g, '').trim();
        const parsedHypothesis = JSON.parse(cleanOutput);
        setCurrentHypothesis(parsedHypothesis);
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('Error generating hypothesis:', error);
      alert('Error generating hypothesis. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-black-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Generate Button */}
        <div className="text-center">
          <Button
            onClick={generateHypothesis}
            disabled={isGenerating}
            className="bg-gradient-to-r from-orange-600 to-black-300 hover:from-orange-700 hover:to-red-700 text-white px-12 py-4 text-xl font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Generating Hypothesis...
              </>
            ) : (
              <>
                <Lightbulb className="mr-3 h-6 w-6" />
                Generate New Hypothesis
              </>
            )}
          </Button>
          <p className="text-gray-600 mt-4 text-lg">
            Click to generate a unique scientific hypothesis about redheads
          </p>
        </div>

        {/* Results */}
        {currentHypothesis && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <HypothesisCard hypothesis={currentHypothesis} />
            </div>
            <div>
              <KnowledgeGraph data={currentHypothesis.knowledgeGraph} />
            </div>
          </div>
        )}

        {!currentHypothesis && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🧬</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Ready to Generate Scientific Hypotheses
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Click the button above to generate a unique, scientifically-grounded hypothesis about redheads and their characteristics.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
