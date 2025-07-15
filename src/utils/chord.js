function topic(traitName) {
  const noun = traitName.split(/ |-/)[0].toLowerCase();
  return (
    {
      agile: "Agile",
      devops: "DevOps", 
      quality: "QA",
      incident: "Ops",
      financial: "Finance",
      regulatory: "Compliance",
      virtual: "Remote Work",
      stakeholder: "Communication",
      developing: "Leadership",
      infrastructure: "Infrastructure",
      performance: "Marketing",
      microservices: "Architecture",
      prompt: "AI/ML",
      business: "Analytics"
    }[noun] || "Other"
  );
}

export function buildChord(traits) {
  const groups = [...new Set(traits.map(t => topic(t.name)))];
  const idx = Object.fromEntries(groups.map((g, i) => [g, i]));
  const m = Array.from({length: groups.length}, () => Array(groups.length).fill(0));

  traits.forEach(t => {
    const topicIdx = idx[topic(t.name)];
    m[topicIdx][topicIdx] += 1;
  });

  return { groups, matrix: m };
}