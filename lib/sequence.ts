export function analyzeSequence(content: string) {
  const sequence = content
    .split("\n")
    .filter((line) => !line.startsWith(">"))
    .join("")
    .replace(/\s/g, "")
    .toUpperCase();

  const length = sequence.length;

  const gcCount = (sequence.match(/[GC]/g) || []).length;

  const gcPercentage =
    length > 0 ? Number(((gcCount / length) * 100).toFixed(2)) : 0;

  const isDNA = /^[ATGC]*$/.test(sequence);
  const isRNA = /^[AUGC]*$/.test(sequence);

  return {
    length,
    gcPercentage,
    isDNA,
    isRNA,
  };
}

export function detectSequenceType(content: string) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return null;
  }

  const isFasta = lines[0].startsWith(">");

  const sequence = lines
    .filter((line) => !line.startsWith(">"))
    .join("")
    .replace(/\s/g, "")
    .toUpperCase();

  if (!sequence) {
    return null;
  }

  if (!/^[ATGCUN]+$/.test(sequence)) {
    return null;
  }

  if (isFasta) {
    return "FASTA";
  }

  if (/^[ATGC]+$/.test(sequence)) {
    return "DNA";
  }

  if (/^[AUGC]+$/.test(sequence)) {
    return "RNA";
  }

  return null;
}