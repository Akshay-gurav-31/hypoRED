
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KnowledgeGraphData {
  nodes: string[];
  edges: Array<{
    from: string;
    to: string;
    relationship: string;
  }>;
}

interface KnowledgeGraphProps {
  data: KnowledgeGraphData;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ data }) => {
  const getNodeColor = (node: string) => {
    if (node.toLowerCase().includes('redhead') || node.toLowerCase().includes('red hair')) {
      return 'bg-red-100 border-red-300 text-red-800';
    }
    if (node.toLowerCase().includes('gene') || node.toLowerCase().includes('mc1r') || node.toLowerCase().includes('dna')) {
      return 'bg-green-100 border-green-300 text-green-800';
    }
    if (node.toLowerCase().includes('pain') || node.toLowerCase().includes('anesthesia') || node.toLowerCase().includes('sensitivity')) {
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    }
    if (node.toLowerCase().includes('hormone') || node.toLowerCase().includes('estrogen') || node.toLowerCase().includes('testosterone')) {
      return 'bg-purple-100 border-purple-300 text-purple-800';
    }
    if (node.toLowerCase().includes('skin') || node.toLowerCase().includes('melanin') || node.toLowerCase().includes('pigment')) {
      return 'bg-orange-100 border-orange-300 text-orange-800';
    }
    return 'bg-blue-100 border-blue-300 text-blue-800';
  };

  return (
    <Card className="shadow-lg h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🕸️</span>
          Knowledge Graph
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Nodes */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Concepts</h4>
            <div className="flex flex-wrap gap-2">
              {data.nodes.map((node, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 rounded-full border-2 font-medium text-sm ${getNodeColor(node)}`}
                >
                  {node}
                </div>
              ))}
            </div>
          </div>

          {/* Relationships */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Relationships</h4>
            <div className="space-y-3">
              {data.edges.map((edge, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-blue-700">{edge.from}</span>
                    <span className="text-gray-500">→</span>
                    <span className="italic text-gray-600 bg-white px-2 py-1 rounded border">
                      {edge.relationship}
                    </span>
                    <span className="text-gray-500">→</span>
                    <span className="font-medium text-purple-700">{edge.to}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraph;
