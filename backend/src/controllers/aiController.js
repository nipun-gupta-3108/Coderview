import { openai } from "../lib/openai.js";
import { ENV } from "../lib/env.js";

function formatExamples(examples = []) {
  if (!examples.length) return "No examples provided.";

  return examples
    .map((example, index) => {
      const explanation = example.explanation
        ? `\nExplanation: ${example.explanation}`
        : "";

      return `Example ${index + 1}
Input: ${example.input}
Output: ${example.output}${explanation}`;
    })
    .join("\n\n");
}

function formatConstraints(constraints = []) {
  if (!constraints.length) return "No constraints provided.";

  return constraints.map((constraint) => `- ${constraint}`).join("\n");
}

function getHintLevelInstruction(hintLevel) {
  if (hintLevel === 1) {
    return "Give only a light directional hint. Do not reveal the algorithm directly.";
  }

  if (hintLevel === 2) {
    return "Give a medium-strength hint. You may mention the technique, but do not give full steps or code.";
  }

  return "Give a strong hint. You may describe the core idea and likely bug, but do not provide full code or a complete solution.";
}

function getReviewPrompt({ title, description, examples, constraints, language, code }) {
  return `Problem Title: ${title}

Description:
${description}

Examples:
${formatExamples(examples)}

Constraints:
${formatConstraints(constraints)}

Language:
${language}

User Code:
${code || "User has not written code yet."}`;
}

function getExplainPrompt({ title, description, examples, constraints }) {
  return `Problem Title: ${title}

Description:
${description}

Examples:
${formatExamples(examples)}

Constraints:
${formatConstraints(constraints)}`;
}

export async function getHint(req, res) {
  try {
    const {
      title,
      description,
      examples = [],
      constraints = [],
      language,
      code = "",
      hintLevel = 1,
    } = req.body;

    if (!title || !description || !language) {
      return res.status(400).json({
        success: false,
        error: "title, description, and language are required",
      });
    }

    if (!ENV.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY is missing",
      });
    }

    const safeHintLevel = Math.min(Math.max(Number(hintLevel) || 1, 1), 3);
    const truncatedCode = String(code).slice(0, 6000);

    const response = await openai.responses.create({
      model: ENV.OPENAI_MODEL,
      input: [
        {
          role: "developer",
          content: [
            {
              type: "input_text",
              text: `You are a DSA interview hint assistant.

Rules:
- Help the user think. Do not solve the full problem.
- Do not provide full working code.
- Do not provide the final answer directly.
- Keep the response short: 3 to 6 lines maximum.
- Be specific to the user's current problem and code.
- If the user's code is empty or incomplete, guide them toward the next idea.
- If the user's code has a likely bug, point to the bug area without rewriting the whole solution.
- End with one short nudge question when useful.

${getHintLevelInstruction(safeHintLevel)}`,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Problem Title: ${title}

Description:
${description}

Examples:
${formatExamples(examples)}

Constraints:
${formatConstraints(constraints)}

Language:
${language}

User Code:
${truncatedCode || "User has not written code yet."}

Hint Level:
${safeHintLevel}`,
            },
          ],
        },
      ],
    });

    const hint = response.output_text?.trim();

    if (!hint) {
      return res.status(500).json({
        success: false,
        error: "No hint returned by AI",
      });
    }

    return res.status(200).json({
      success: true,
      hint,
      hintLevel: safeHintLevel,
    });
  } catch (error) {
    console.error("Error in getHint:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to get AI hint",
    });
  }
}

export async function reviewCode(req, res) {
  try {
    const {
      title,
      description,
      examples = [],
      constraints = [],
      language,
      code = "",
    } = req.body;

    if (!title || !description || !language) {
      return res.status(400).json({
        success: false,
        error: "title, description, and language are required",
      });
    }

    if (!ENV.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY is missing",
      });
    }

    const truncatedCode = String(code).slice(0, 7000);

    const response = await openai.responses.create({
      model: ENV.OPENAI_MODEL,
      input: [
        {
          role: "developer",
          content: [
            {
              type: "input_text",
              text: `You are a DSA code review assistant.

Rules:
- Review the user's current solution for correctness, likely bugs, edge cases, and complexity.
- Do not rewrite the full solution.
- Do not provide full replacement code.
- Keep the review concise and structured.
- Use exactly these section headers:
Verdict:
Bug Risk:
Complexity:
Next Step:
- Each section should be 1 to 3 short lines.`,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: getReviewPrompt({
                title,
                description,
                examples,
                constraints,
                language,
                code: truncatedCode,
              }),
            },
          ],
        },
      ],
    });

    const review = response.output_text?.trim();

    if (!review) {
      return res.status(500).json({
        success: false,
        error: "No review returned by AI",
      });
    }

    return res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error in reviewCode:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to review code",
    });
  }
}

export async function explainProblem(req, res) {
  try {
    const { title, description, examples = [], constraints = [] } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: "title and description are required",
      });
    }

    if (!ENV.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "OPENAI_API_KEY is missing",
      });
    }

    const response = await openai.responses.create({
      model: ENV.OPENAI_MODEL,
      input: [
        {
          role: "developer",
          content: [
            {
              type: "input_text",
              text: `You are a DSA problem explainer.

Rules:
- Explain the problem in beginner-friendly language.
- Do not provide code.
- Do not provide the full solution.
- Keep the explanation concise and structured.
- Use exactly these section headers:
Core Idea:
Key Constraint:
What To Watch:
First Move:
- Each section should be 1 to 3 short lines.`,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: getExplainPrompt({ title, description, examples, constraints }),
            },
          ],
        },
      ],
    });

    const explanation = response.output_text?.trim();

    if (!explanation) {
      return res.status(500).json({
        success: false,
        error: "No explanation returned by AI",
      });
    }

    return res.status(200).json({
      success: true,
      explanation,
    });
  } catch (error) {
    console.error("Error in explainProblem:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to explain problem",
    });
  }
}
