import * as natural from "natural";

export const calculateSimilarity = (str1: string, str2: string) => {
  const tokenizer = new natural.WordTokenizer();

  const tokens1 = tokenizer.tokenize(str1).join(" ");
  const tokens2 = tokenizer.tokenize(str2).join(" ");

  const levenshteinDistance = natural.LevenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  const normalizedLevenshtein = 1 - levenshteinDistance / maxLength;

  const jaroWinkler = natural.JaroWinklerDistance(tokens1, tokens2);
  const diceCoefficient = natural.DiceCoefficient(tokens1, tokens2);

  return (normalizedLevenshtein + jaroWinkler + diceCoefficient) / 3;
};
