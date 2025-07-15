export function buildRadial(traits, aliasTable) {
  const root = { name: "Professional Identity", children: [] };
  const toolsSeen = new Set(traits.filter(t => t.traitType === "Tool")
                                 .map(t => t.name));

  traits
    .filter(t => t.traitType !== "Tool")
    .forEach(trait => {
      const childTools = [];
      const expect = aliasTable[trait.name] || [];

      // tools already in evidence
      toolsSeen.forEach(tool => {
        const evidenceText = trait.evidenceSnippets ? trait.evidenceSnippets.join(' ') : trait.evidence;
        if (evidenceText.toLowerCase().includes(tool.toLowerCase())) {
          childTools.push({ name: tool, present: true });
        }
      });

      // add gaps
      expect.forEach(tool => {
        if (!childTools.some(c => c.name === tool)) {
          childTools.push({ name: tool, present: false });
        }
      });

      root.children.push({ 
        name: trait.name, 
        children: childTools,
        weight: trait.weight 
      });
    });

  return root;
}