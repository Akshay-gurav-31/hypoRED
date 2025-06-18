import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface HypothesisCardProps {
  hypothesis: {
    hypothesis: string;
    analysis: string;
    summary: string[];
  };
  isDarkTheme: boolean;
}

const HypothesisCard: React.FC<HypothesisCardProps> = ({ hypothesis, isDarkTheme }) => {
  const textColor = isDarkTheme ? 'text-white' : 'text-black';
  const badgeClasses = isDarkTheme ? 'text-white border-white' : 'text-black border-black';

  return (
    <div className="space-y-6">
      {/* Hypothesis Statement */}
      <Card className="border-l-4 border-l-red-500 shadow-lg">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${textColor}`}>
            <span className="text-2xl">🧬</span>
            Hypothesis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-lg font-semibold ${textColor} leading-relaxed`}>
            {hypothesis.hypothesis}
          </p>
        </CardContent>
      </Card>

      {/* Scientific Analysis */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${textColor}`}>
            <span className="text-2xl">🔬</span>
            Scientific Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`${textColor} leading-relaxed whitespace-pre-line`}>
            {hypothesis.analysis}
          </p>
        </CardContent>
      </Card>

      {/* Summary Points */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${textColor}`}>
            <span className="text-2xl">📋</span>
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {hypothesis.summary.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <Badge variant="outline" className={`mt-1 flex-shrink-0 ${badgeClasses}`}>
                  {index + 1}
                </Badge>
                <span className={textColor}>{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HypothesisCard;