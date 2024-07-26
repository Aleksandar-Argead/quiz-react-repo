import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheckIcon, CircleXIcon } from "lucide-react";
import { useQuiz } from "@/context/Quiz";
import { toast } from "sonner";

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { score, questions, correctQuestions, incorrectQuestions } = useQuiz();
  const [nickname, setNickname] = useState("");
  const location = useLocation();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    setPlaces(JSON.parse(localStorage.getItem("quizResults") || "[]"));
  }, [location]);

  const handleSaveResults = () => {
    if (!nickname) {
      toast.error("Please enter a nickname", {duration: 3000});
      return;
    }
    const now = new Date().toISOString();
    const result = {
      id: `${nickname}-${now}`,
      timestamp: now,
      nickname,
      score,
      questions,
      correctQuestions,
      incorrectQuestions,
    };
    localStorage.setItem("quizResults", JSON.stringify([...places, result]));
    navigate("/leaderboard", { state: { id: result.id } });
  };

  const handleRetakeQuiz = () => {
    navigate("/");
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const getPlacement = () => {
    const sortedPlaces = [...places, { score }].sort((a, b) => b.score - a.score);
    const currentIndex = sortedPlaces.findIndex((place) => place.score === score);
    if (currentIndex === 0) return "first";
    if (currentIndex === 1) return "second";
    if (currentIndex === 2) return "third";
    return `${currentIndex + 1}th`;
  };

  const placement = getPlacement();

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Geography Trivia Quiz Results</h1>
          <p className="mt-2 text-muted-foreground">You've completed the quiz. Let's see how you did!</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Your Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-2">
            <div className="text-4xl font-bold text-primary">{score}</div>
            <p className="text-muted-foreground">You placed {placement}.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">Correct Answers</h3>
                <ul className="mt-2 space-y-2 text-muted-foreground">
                  {correctQuestions.map((index) => (
                    <li key={index}>
                      <div className="flex items-center gap-2">
                        <CircleCheckIcon className="w-5 h-5 text-green-500" />
                        <span>{questions[index].question}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Incorrect Answers</h3>
                <ul className="mt-2 space-y-2 text-muted-foreground">
                  {incorrectQuestions.map((index) => (
                    <li key={index}>
                      <div className="flex items-center gap-2">
                        <CircleXIcon className="w-5 h-5 text-red-500" />
                        <span>{questions[index].question}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col items-center space-y-4">
          <Input type="text" value={nickname} onChange={handleNicknameChange} onSubmit={handleSaveResults} placeholder="Enter your nickname" />
          <div className="flex gap-x-4">
            <Button variant="secondary" onClick={handleRetakeQuiz}>
              Home
            </Button>
            <Button  className="px-8" onClick={handleSaveResults}>
              Save Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
