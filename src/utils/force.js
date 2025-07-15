export function buildForce(traits, minShared = 0) {
  const nodes = traits.map(t => ({
    id: t.trait,
    name: t.name,
    group: t.traitType,
    radius: 6 + 30 * Math.max(0, (t.weight - 0.5)),
    weight: t.weight
  }));

  const bag = s => new Set(s.toLowerCase().split(/[^a-z]+/).filter(Boolean));
  const links = [];

  for (let i = 0; i < traits.length; i++) {
    for (let j = i + 1; j < traits.length; j++) {
      const aEvidence = traits[i].evidenceSnippets || [traits[i].evidence];
      const bEvidence = traits[j].evidenceSnippets || [traits[j].evidence];
      
      const a = new Set([...aEvidence.flatMap(e => [...bag(e)])]);
      const b = new Set([...bEvidence.flatMap(e => [...bag(e)])]);
      
      const overlap = [...a].filter(x => b.has(x)).length;
      
      if (overlap >= minShared) {
        links.push({ 
          source: traits[i].trait, 
          target: traits[j].trait, 
          value: overlap 
        });
      }
    }
  }
  
  return { nodes, links };
}