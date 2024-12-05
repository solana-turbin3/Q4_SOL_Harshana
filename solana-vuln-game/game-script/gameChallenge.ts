export interface Challenge {
    name: string;
    description: string;
    function: string;
    hints?: string[];
  }
  
  export const CHALLENGES: Challenge[] = [
    {
      name: "Space Validation",
      description: "Solve the space validation vulnerability challenge",
      function: "space_validation",
      hints: [
        "Think about how spaces might impact input validation",
        "Are there hidden characters or whitespaces?"
      ]
    },
    {
      name: "Input Validation", 
      description: "Solve the input validation vulnerability challenge",
      function: "input_validation",
      hints: [
        "Consider different types of input sanitization",
        "Look for potential bypasses in input checks"
      ]
    },
    {
      name: "Arithmetic Underflow",
      description: "Solve the arithmetic underflow vulnerability challenge",
      function: "arithmetic_underflow",
      hints: [
        "Think about how numerical operations can cause unexpected behavior",
        "What happens when you subtract from a small number?"
      ]
    },
    {
      name: "Arithmetic Overflow",
      description: "Solve the arithmetic overflow vulnerability challenge", 
      function: "arithmetic_overflow",
      hints: [
        "Consider what happens when a number exceeds its maximum value",
        "How do numerical limits impact calculations?"
      ]
    },
    {
      name: "Program ID Verification",
      description: "Solve the program ID verification vulnerability challenge",
      function: "program_id_verification",
      hints: [
        "Think about how program identities are validated",
        "Are there ways to bypass ID checks?"
      ]
    }
  ];