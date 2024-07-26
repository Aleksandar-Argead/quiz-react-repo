import React, { createContext, useState, useContext, ReactNode } from 'react';

interface QuizContextType {
  questions: any[];
  setQuestions: React.Dispatch<React.SetStateAction<any[]>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  lives: number;
  setLives: React.Dispatch<React.SetStateAction<number>>;
  correctQuestions: number[];
  setCorrectQuestions: React.Dispatch<React.SetStateAction<number[]>>;
  incorrectQuestions: number[];
  setIncorrectQuestions: React.Dispatch<React.SetStateAction<number[]>>;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correctQuestions, setCorrectQuestions] = useState<number[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number[]>([]);

  const resetQuiz = () => {
    setQuestions([]);
    setScore(0);
    setLives(3);
    setCorrectQuestions([]);
    setIncorrectQuestions([]);
  };

  return (
    <QuizContext.Provider value={{
      questions,
      setQuestions,
      score,
      setScore,
      lives,
      setLives,
      correctQuestions,
      setCorrectQuestions,
      incorrectQuestions,
      setIncorrectQuestions,
      resetQuiz,
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
