import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Ghost, PersonStanding } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface QuestionContextType {
  questions: { question: string; options: string[]; correctAnswer: string }[];
  handleTimeout: (questionIndex: number) => void;
  handleCorrectAnswer: (questionIndex: number, timeLeft: number) => void;
  handleLoseLife: (questionIndex: number) => void;
  lives: number;
}

const QUESTION_TIME = 30;

export const Question: React.FC = () => {
  const { questions, lives, handleTimeout, handleLoseLife, handleCorrectAnswer } = useOutletContext<QuestionContextType>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const questionIndex = id ? parseInt(id, 10) : 0;
  const question = questions[questionIndex];
  const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [correctAnswerSelected, setCorrectAnswerSelected] = useState(false);

  useEffect(() => {
    if (!question) {
      navigate("/");
      return;
    }



  }, [question, questionIndex, navigate, handleTimeout, clearExistingTimer]);

  useEffect(() => {
    setIncorrectAnswers([])
    setCorrectAnswerSelected(false);
    setTimeLeft(QUESTION_TIME);



  }, [id]);

  const handleAnswerClick = (answer: string) => {
    if (answer === question.correctAnswer) {
      setCorrectAnswerSelected(true);

      setTimeout(() => {
        handleCorrectAnswer(questionIndex, timeLeft);
      }, 1000);
    } else {
      setIncorrectAnswers([...incorrectAnswers, answer]);
      handleLoseLife(questionIndex);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-background">
      <Card className="w-full max-w-3xl h-full min-h-96 flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">Geography Trivia Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CardDescription className="text-2xl text-center text-accent-foreground font-semibold">{question?.question}</CardDescription>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {question?.options.map((option, index) => (
              <Button
                key={index}
                variant={incorrectAnswers.includes(option) ? "destructive" : (correctAnswerSelected && option === question.correctAnswer) ? "success" : "outline"}
                className="text-center"
                onClick={() => handleAnswerClick(option)}
                disabled={incorrectAnswers.includes(option) || correctAnswerSelected}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">{[...Array(3)].map((_, i) => (i < 3 - lives ? <Ghost key={i} className="w-6 h-6 text-red-500" /> : <PersonStanding key={i} className="w-6 h-6 text-muted-foreground" />))}</div>
          <Progress value={((questionIndex + 1) / questions.length) * 100} className="flex-1 mx-4" />
          <div className="text-lg font-medium">{timeLeft} seconds left</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Question;
