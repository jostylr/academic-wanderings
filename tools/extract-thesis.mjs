import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const thesis = path.join(root, "thesis");
const outDir = path.join(root, "tex");

function isEscaped(text, index) {
  let slashes = 0;
  for (let i = index - 1; i >= 0 && text[i] === "\\"; i--) slashes++;
  return slashes % 2 === 1;
}

function stripComments(text) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "%" && !isEscaped(text, i)) {
      while (i < text.length && text[i] !== "\n") i++;
      if (i < text.length) out += "\n";
    } else {
      out += text[i];
    }
  }
  return out;
}

function skipSpace(text, index) {
  while (index < text.length && /\s/.test(text[index])) index++;
  return index;
}

function parseDelimited(text, index, open, close) {
  if (text[index] !== open) return null;
  let depth = 0;
  let content = "";
  for (let i = index; i < text.length; i++) {
    const ch = text[i];
    if (ch === open && !isEscaped(text, i)) {
      depth++;
      if (depth > 1) content += ch;
    } else if (ch === close && !isEscaped(text, i)) {
      depth--;
      if (depth === 0) return { content, end: i + 1 };
      content += ch;
    } else {
      content += ch;
    }
  }
  throw new Error(`Unclosed ${open} at ${index}`);
}

function commandAt(text, index) {
  if (text[index] !== "\\") return null;
  let end = index + 1;
  if (/[A-Za-z@]/.test(text[end] ?? "")) {
    while (/[A-Za-z@]/.test(text[end] ?? "")) end++;
  } else {
    end++;
  }
  return { name: text.slice(index + 1, end), end };
}

function parseDefinition(text, start, commandEnd) {
  let index = skipSpace(text, commandEnd);
  if (text[index] === "*") index = skipSpace(text, index + 1);
  const nameGroup = parseDelimited(text, index, "{", "}");
  if (!nameGroup) return null;
  const nameMatch = nameGroup.content.match(/\\([A-Za-z@]+)/);
  if (!nameMatch) return null;
  index = skipSpace(text, nameGroup.end);
  let args = 0;
  if (text[index] === "[") {
    const argCount = parseDelimited(text, index, "[", "]");
    args = Number.parseInt(argCount.content, 10);
    index = skipSpace(text, argCount.end);
    if (text[index] === "[") {
      const defaultArg = parseDelimited(text, index, "[", "]");
      index = skipSpace(text, defaultArg.end);
    }
  }
  const body = parseDelimited(text, index, "{", "}");
  if (!body) return null;
  return {
    name: nameMatch[1],
    args,
    body: body.content,
    end: body.end,
  };
}

function collectDefinitions(text) {
  const macros = new Map();
  for (let i = 0; i < text.length; i++) {
    const command = commandAt(text, i);
    if (!command) continue;
    if (command.name === "newcommand" || command.name === "renewcommand") {
      const definition = parseDefinition(text, i, command.end);
      if (definition) {
        macros.set(definition.name, {
          args: definition.args,
          body: definition.body,
        });
        i = definition.end - 1;
      }
    } else if (command.name === "DeclareMathOperator") {
      let index = skipSpace(text, command.end);
      if (text[index] === "*") index = skipSpace(text, index + 1);
      const nameGroup = parseDelimited(text, index, "{", "}");
      if (!nameGroup) continue;
      const nameMatch = nameGroup.content.match(/\\([A-Za-z@]+)/);
      index = skipSpace(text, nameGroup.end);
      const body = parseDelimited(text, index, "{", "}");
      if (nameMatch && body) {
        // Preserve operator semantics so expanded uses of \limits remain
        // valid (several thesis operators use symbols such as \wedge).
        macros.set(nameMatch[1], {
          args: 0,
          body: `\\mathop{${body.content}}`,
        });
        i = body.end - 1;
      }
    }
  }
  return macros;
}

function readArgument(text, index) {
  index = skipSpace(text, index);
  if (text[index] === "{") {
    const group = parseDelimited(text, index, "{", "}");
    return { content: group.content, end: group.end };
  }
  const command = commandAt(text, index);
  if (command) {
    return { content: text.slice(index, command.end), end: command.end };
  }
  return { content: text[index] ?? "", end: index + 1 };
}

function processText(text, macros, depth = 0) {
  if (depth > 30) return text;
  let out = "";
  for (let i = 0; i < text.length; ) {
    const command = commandAt(text, i);
    if (!command) {
      out += text[i];
      i++;
      continue;
    }

    if (command.name === "newcommand" || command.name === "renewcommand") {
      const definition = parseDefinition(text, i, command.end);
      if (definition) {
        macros.set(definition.name, {
          args: definition.args,
          body: definition.body,
        });
        i = definition.end;
        continue;
      }
    }

    if (command.name === "sidecom") {
      const argument = readArgument(text, command.end);
      i = argument.end;
      continue;
    }

    if (command.name === "Yvcentermath") {
      i = command.end;
      while (/[0-9]/.test(text[i] ?? "")) i++;
      continue;
    }

    if (command.name === "young" && text[command.end] === "(") {
      const diagram = parseDelimited(text, command.end, "(", ")");
      out += `\\boxed{\\text{${diagram.content}}}`;
      i = diagram.end;
      continue;
    }

    if (command.name === "chapter") {
      let index = skipSpace(text, command.end);
      if (text[index] === "[") {
        const optional = parseDelimited(text, index, "[", "]");
        index = skipSpace(text, optional.end);
      }
      const title = parseDelimited(text, index, "{", "}");
      if (title) {
        out += `\\section{${processText(title.content, macros, depth + 1)}}`;
        i = title.end;
        continue;
      }
    }

    const macro = macros.get(command.name);
    if (!macro) {
      out += text.slice(i, command.end);
      i = command.end;
      continue;
    }

    let index = command.end;
    const args = [];
    let valid = true;
    for (let n = 0; n < macro.args; n++) {
      const arg = readArgument(text, index);
      if (!arg) {
        valid = false;
        break;
      }
      args.push(arg.content);
      index = arg.end;
    }
    if (!valid) {
      out += text.slice(i, command.end);
      i = command.end;
      continue;
    }
    let expanded = macro.body;
    args.forEach((arg, n) => {
      expanded = expanded.replaceAll(`#${n + 1}`, arg);
    });
    out += processText(expanded, macros, depth + 1);
    i = index;
  }
  return out;
}

function demoteSections(text, levels = 0) {
  let out = text;
  for (let i = 0; i < levels; i++) {
    out = out
      .replaceAll("\\subsubsection", "\\paragraph")
      .replaceAll("\\subsection", "\\subsubsection")
      .replaceAll("\\section", "\\subsection");
  }
  return out;
}

function cleanBody(text) {
  let cleaned = text
    .replaceAll("\\begin{document}", "")
    .replaceAll("\\end{document}", "")
    .replace(/\\bibliography\{[^}]*\}/g, "")
    .replace(/\\bibliographystyle\{[^}]*\}/g, "")
    .replace(/\bwave function s\b/g, "wave functions")
    .replace(/\bWave function s\b/g, "Wave functions")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

  // Removing full-line comments can leave paragraph breaks inside display
  // mathematics. TeX treats those as \par tokens, which are illegal in
  // displays and alignment environments. Preserve line breaks but collapse
  // blank lines only within mathematical blocks.
  const collapseDisplayParagraphs = (block) =>
    block.replace(/\n[ \t]*\n+/g, "\n");
  cleaned = cleaned.replace(
    /\\\[[\s\S]*?\\\]/g,
    collapseDisplayParagraphs,
  );
  cleaned = cleaned.replace(
    /\\begin\{(align\*?|equation\*?|gather\*?|multline\*?|split)\}[\s\S]*?\\end\{\1\}/g,
    collapseDisplayParagraphs,
  );
  cleaned = cleaned.replace(
    /(?<!\\)\$(?:\\.|[^$])*?(?<!\\)\$/gs,
    collapseDisplayParagraphs,
  );
  return cleaned;
}

function sourceChunk(file, options = {}) {
  const full = fs.readFileSync(path.join(thesis, file), "utf8");
  const lines = full.split("\n");
  const start = options.start ?? 1;
  const end = options.end ?? lines.length;
  let body = lines.slice(start - 1, end).join("\n");
  body = stripComments(body);
  const macros = new Map(baseMacros);
  body = processText(body, macros);
  body = cleanBody(body);
  body = demoteSections(body, options.demote ?? 0);
  if (options.heading) {
    body = `\\section{${options.heading}}\n\n${body}`;
  }
  return body;
}

const baseMacros = collectDefinitions(
  stripComments(fs.readFileSync(path.join(thesis, "newcommands.sty"), "utf8")),
);
baseMacros.set("vc", { args: 1, body: "\\boldsymbol{#1}" });
baseMacros.set("sfu", { args: 0, body: "\\mathcal{S}" });
baseMacros.set("rf", { args: 0, body: "\\mathcal{R}" });

const preamble = String.raw`\documentclass[11pt]{article}
\usepackage[margin=1in]{geometry}
\usepackage{amsmath,amssymb,amsfonts,amsthm,mathtools,bm}
\usepackage[T1]{fontenc}
\usepackage{microtype}
\newtheorem{theorem}{Theorem}
\newtheorem{lemma}{Lemma}
\newtheorem{cor}{Corollary}
\newtheorem{defn}{Definition}
\newtheorem{principle}{Principle}
\newtheorem{statement}{Statement}
\theoremstyle{remark}
\newtheorem{statementr}{Statement}
`;

const papers = [
  {
    file: "01-vector-bundle-bohmian-dynamics.tex",
    title:
      "Geometrically Formulating Bohmian Theories on Hermitian Vector Bundles",
    chunks: [{ source: "geom.tex" }],
  },
  {
    file: "02-topological-quantization-exposition.tex",
    title: "Theory Formation and the Topology of Configuration Space",
    note:
      "This expository manuscript overlaps with later published work and is retained as a thesis-derived, self-published treatment with a different organization and emphasis.",
    chunks: [{ source: "top.tex" }],
  },
  {
    file: "03-virtual-boundaries.tex",
    title: "Virtual Boundaries and Cut-Independent Quantum Hamiltonians",
    chunks: [
      { source: "top.tex", start: 885 },
      {
        source: "functan.tex",
        heading: "Functional-analytic supplement",
        demote: 1,
      },
    ],
  },
  {
    file: "04-spin-bundles.tex",
    title:
      "Identical Particles, Set-Indexed Spin Bundles, and Bundle Triviality",
    chunks: [
      { source: "manpart.tex" },
      {
        source: "tensor.tex",
        heading: "Appendix: the set-indexed tensor product",
        demote: 1,
      },
      {
        source: "triviality.tex",
        heading: "Appendix: triviality of the Bose and Fermi bundles",
        demote: 1,
      },
    ],
  },
  {
    file: "05-taylor-expansions.tex",
    title: "Taylor Expansions of Mappings between Manifolds",
    chunks: [
      { source: "taylor.tex" },
      {
        source: "difgeom.tex",
        heading: "Appendix: a useful frame field",
        demote: 1,
      },
    ],
  },
  {
    file: "06-trajectory-iterations.tex",
    title: "Two Algorithms for Exact Quantum Dynamics from Trajectories",
    chunks: [{ source: "algo.tex" }],
  },
  {
    file: "07-jacobians-and-characteristics.tex",
    title:
      "Volume Vectors, Determinants, Trace, and Characteristic Equations",
    chunks: [{ source: "app7.tex" }],
  },
  {
    file: "08-set-indexed-tensor-products.tex",
    title: "The Set-Indexed Tensor Product",
    chunks: [{ source: "tensor.tex" }],
  },
  {
    file: "09-parallel-frames.tex",
    title: "A Very Useful Frame Field",
    chunks: [{ source: "difgeom.tex" }],
  },
  {
    file: "10-velocity-inverse-problem.tex",
    title: "On Recovering a Wave Function from Bohmian Velocities",
    chunks: [{ source: "ubvel.tex" }],
  },
  {
    file: "11-bohmian-story.tex",
    title: "The Bohmian Story: Mechanics, Measurement, and Objections",
    note:
      "This is a thesis-derived expository draft. It preserves the original presentation as a baseline; its historical discussion and references will need updating before publication.",
    replacements: [
      [
        "Chapter\n\\ref{c:geom}",
        "the companion manuscript on geometrically formulating Bohmian theories",
      ],
    ],
    chunks: [
      { source: "simint.tex", start: 3, end: 22 },
      { source: "bohmint.tex", start: 6 },
    ],
  },
];

for (const paper of papers) {
  const chunks = paper.chunks.map((chunk) =>
    sourceChunk(chunk.source, {
      start: chunk.start,
      end: chunk.end,
      heading: chunk.heading,
      demote: chunk.demote,
    }),
  );
  const note = paper.note
    ? `\\begin{quote}\\small ${paper.note}\\end{quote}\n\n`
    : "";
  let body = `${note}${chunks.join("\n\n\\clearpage\n\n")}`;
  for (const [search, replacement] of paper.replacements ?? []) {
    body = body.replaceAll(search, replacement);
  }
  const document = `${preamble}
\\title{${paper.title}}
\\author{James Taylor}
\\date{Working draft derived from the 2003 thesis}
\\begin{document}
\\maketitle

${body}

\\clearpage
\\bibliographystyle{abbrv}
\\bibliography{references}
\\end{document}
`;
  fs.writeFileSync(path.join(outDir, paper.file), document);
}
