// Hardcoded puzzle answer and format validation
// In production, this should come from a secure backend or Cloud Function

export const CORRECT_ANSWER = '42'; // Ultra-hard puzzle answer (example)

// Format regex - matches the expected format of the answer
// Adjust based on your puzzle's answer format
export const FORMAT_REGEX = /^[\d\w\s\.\-\@\:]+$/; // Flexible format for now

export interface ValidationResult {
  correct: boolean;
  formatValid: boolean;
  message: string;
}

/**
 * Validate the format of the user's answer
 */
export function validateFormat(input: string): boolean {
  return FORMAT_REGEX.test(input.trim());
}

/**
 * Validate if the answer is correct (case-insensitive, trimmed)
 */
export function isCorrectAnswer(input: string): boolean {
  return input.trim().toLowerCase() === CORRECT_ANSWER.trim().toLowerCase();
}

/**
 * Full validation: check both format and correctness
 */
export function validateAnswer(input: string): ValidationResult {
  const trimmedInput = input.trim();
  const formatValid = validateFormat(trimmedInput);
  const correct = isCorrectAnswer(trimmedInput);

  if (!formatValid) {
    return {
      correct: false,
      formatValid: false,
      message: 'Invalid format. Please check the hint and try again.',
    };
  }

  if (correct) {
    return {
      correct: true,
      formatValid: true,
      message: 'Correct answer! Temporary password generated. Check your email or click login to continue.',
    };
  }

  return {
    correct: false,
    formatValid: true,
    message: 'Incorrect answer. You have more attempts. Try again!',
  };
}
