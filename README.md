# BioPaste Lite

A Pastebin-style web application for creating and sharing text and bioinformatics data.

BioPaste Lite combines the simplicity of a paste-sharing service with basic bioinformatics-aware features such as sequence type detection, sequence length, and GC content analysis.

## Current Status

🚧 **Development in progress**

The current version implements the backend API, PostgreSQL database integration, shareable paste pages, paste expiration/view limits, and basic DNA/RNA/FASTA sequence analysis.

---

## Features Implemented

### Paste Creation

Pastes can be created through the REST API with:

- Title
- Content
- Paste type
- Expiration time
- Maximum view count

Supported paste types:

- DNA
- RNA
- PROTEIN
- FASTA
- VCF
- CODE
- TEXT

---

### Bioinformatics Sequence Detection

BioPaste can automatically detect some biological sequences when the paste type is set to `TEXT`.

For example:

```text
ATGGCAGAACTG

can automatically be detected as:

**DNA**

FASTA content is also detected when it begins with a FASTA header:

```text
>BRCA1
ATGGCAGAACTG
```

and is classified as:

**FASTA**

### Sequence Analysis

For DNA, RNA, and FASTA sequences, BioPaste currently calculates:

- Sequence length
- GC percentage
- DNA validity
- RNA validity