'use client';

import { useState } from 'react';
import { ChordDiagram } from './ChordDiagram';
import { ForceGraph } from './ForceGraph';
import { RadialTree } from './RadialTree';
import { Button } from '@/components/ui/button';

// Sample trait data for demo
const sampleTraits = [
  {
    trait: "MOD.S.18",
    evidence: "Test Case Design",
    confidence: 0.69,
    name: "Quality Assurance Automation",
    weight: 0.69,
    lastObserved: 1751387822,
    traitType: "Skill",
    evidenceSnippets: [
      "engineering management guiding release validation",
      "quality engineering leadership",
      "test automation",
      "Test Driven Development (TDD)",
      "Test Case Design"
    ]
  },
  {
    trait: "MOD.S.8",
    evidence: "Scrum",
    confidence: 0.66,
    name: "Agile Project Management",
    weight: 0.66,
    lastObserved: 1751387820,
    traitType: "Skill",
    evidenceSnippets: [
      "agile delivery process deployment leadership",
      "agile practices leadership",
      "project management",
      "Agile methodologies",
      "Scrum"
    ]
  },
  {
    trait: "MOD.K.19",
    evidence: "21 CFR Part 11",
    confidence: 0.64,
    name: "Regulatory Compliance",
    weight: 0.64,
    lastObserved: 1751387822,
    traitType: "Knowledge",
    evidenceSnippets: [
      "ISO 13485",
      "HIPAA",
      "SOC2",
      "21 CFR Part 11"
    ]
  },
  {
    trait: "MOD.S.3",
    evidence: "DevOps",
    confidence: 0.64,
    name: "DevOps and CI/CD",
    weight: 0.64,
    lastObserved: 1751387818,
    traitType: "Skill",
    evidenceSnippets: [
      "ci/cd implementation and feature delivery strategy",
      "DevOps practices",
      "CI/CD pipelines",
      "DevOps"
    ]
  },
  {
    trait: "4.A.4.b.2",
    evidence: "cross-functional collaboration fostering shared development culture",
    confidence: 0.57,
    name: "Developing and Building Teams",
    weight: 0.57,
    lastObserved: 1751387809,
    traitType: "Work Activity",
    evidenceSnippets: [
      "collaborating with senior leadership",
      "cross-functional collaboration fostering shared development culture"
    ]
  },
  {
    trait: "MOD.W.1",
    evidence: "technical leadership collaboration",
    confidence: 0.57,
    name: "Virtual Team Leadership",
    weight: 0.57,
    lastObserved: 1751387803,
    traitType: "Work Style",
    evidenceSnippets: [
      "mentoring globally distributed teams",
      "technical leadership collaboration"
    ]
  },
  {
    trait: "TOOL.AWS",
    evidence: "Amazon Web Services",
    confidence: 0.5,
    name: "Amazon Web Services",
    weight: 0.5,
    lastObserved: 1751387815,
    traitType: "Tool",
    evidenceSnippets: ["Amazon Web Services"]
  },
  {
    trait: "TOOL.REACT",
    evidence: "React",
    confidence: 0.5,
    name: "React",
    weight: 0.5,
    lastObserved: 1751387815,
    traitType: "Tool",
    evidenceSnippets: ["React"]
  },
  {
    trait: "TOOL.DOCKER",
    evidence: "Docker",
    confidence: 0.5,
    name: "Docker",
    weight: 0.5,
    lastObserved: 1751387817,
    traitType: "Tool",
    evidenceSnippets: ["Docker"]
  }
];

type VisualizationType = 'radial' | 'chord' | 'force';

export function TraitVisualizationDemo() {
  const [activeViz, setActiveViz] = useState<VisualizationType>('radial');

  const renderVisualization = () => {
    switch (activeViz) {
      case 'radial':
        return <RadialTree traits={sampleTraits} width={450} height={450} />;
      case 'chord':
        return <ChordDiagram traits={sampleTraits} width={350} height={350} />;
      case 'force':
        return <ForceGraph traits={sampleTraits} width={500} height={350} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Advanced Identity Visualizations
        </h3>
        <p className="text-gray-600 mb-6">
          Discover skill gaps, semantic clusters, and proficiency levels through interactive AI-powered analysis
        </p>
        
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={activeViz === 'radial' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveViz('radial')}
          >
            🌳 Skill Gaps
          </Button>
          <Button
            variant={activeViz === 'chord' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveViz('chord')}
          >
            🎯 Clusters
          </Button>
          <Button
            variant={activeViz === 'force' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveViz('force')}
          >
            💪 Proficiency
          </Button>
        </div>
      </div>

      <div className="flex justify-center min-h-[400px] items-center">
        {renderVisualization()}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          {activeViz === 'radial' && "Gray nodes show tools commonly used with your skills but missing from your profile"}
          {activeViz === 'chord' && "AI clusters your traits by semantic similarity, revealing skill themes"}
          {activeViz === 'force' && "Bubble size indicates mastery level, connections show shared evidence"}
        </p>
      </div>
    </div>
  );
}