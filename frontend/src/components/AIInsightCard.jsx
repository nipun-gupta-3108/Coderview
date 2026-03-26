function parseSections(content) {
  if (!content) return [];

  const lines = content.split("\n");
  const sections = [];
  let currentSection = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^[A-Za-z ]+:$/.test(line)) {
      currentSection = {
        heading: line.slice(0, -1),
        body: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      currentSection = {
        heading: "Response",
        body: [],
      };
      sections.push(currentSection);
    }

    currentSection.body.push(line.replace(/^[-*]\s*/, ""));
  }

  return sections;
}

function AIInsightCard({ content, emptyText, accent = "emerald" }) {
  const sections = parseSections(content);

  if (!sections.length) {
    return (
      <div className="ai-panel-body">
        <p className="text-sm leading-7 text-slate-600">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="ai-panel-body">
      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={`${section.heading}-${index}`} className="ai-section">
            <p className={`ai-section-title ai-section-title-${accent}`}>{section.heading}</p>
            <div className="space-y-2">
              {section.body.map((line, lineIndex) => (
                <p key={`${section.heading}-${lineIndex}`} className="text-sm leading-7 text-slate-700">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIInsightCard;
