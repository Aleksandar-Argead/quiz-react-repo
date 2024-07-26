import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../../components/ui/badge";

const Leaderboard: React.FC = () => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.id;

  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem("quizResults")) || [];
    const sortedResults = storedResults.sort((a, b) => b.score - a.score);
    setResults(sortedResults);
  }, []);

  return (
    <div className="bg-background p-6 w-full  flex flex-col items-center ">
      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold">Geography Trivia Leaderboard</h1>
          <p className="text-muted-foreground">Top scorers on the Trivia Quiz</p>
          <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
            Home
          </Button>
        </div>
        <div className="grid gap-4">
          {results.map((result, index) => (
            <div key={result.id} className={`flex justify-between items-center gap-4 rounded-lg p-4 ${result.id === userId ? "bg-primary/20" : "bg-muted"}`}>
              <div className="text-lg font-bold text-primary">{index + 1}</div>
              <div className="flex flex-grow items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">{result.nickname.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="font-medium flex-grow">{result.nickname}</div>
                {userId === result.id && <Badge variant="outline">You</Badge>}
              </div>
              <div className={`text-lg font-bold text-primary`}>{result.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
