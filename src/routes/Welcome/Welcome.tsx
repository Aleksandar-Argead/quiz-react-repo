import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_COUNTRIES } from "../../queries";
import { useQuiz } from "../../context/Quiz";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";

const Welcome: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_COUNTRIES);
  const { setQuestions, resetQuiz } = useQuiz();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    refetch();
  }, [location, refetch]);

  useEffect(() => {
    resetQuiz();
  }, [location]);

  useEffect(() => {
    if (data && data.countries) {
      generateQuestions(data.countries);
    }
  }, [data]);

  const generateQuestions = (countries: any[]) => {
    const validCountries = countries.filter((country) =>
      country &&
      country.name &&
      country.capital &&
      country.languages &&
      country.languages.length > 0 &&
      country.languages[0].name
    );

    const shuffledCountries = [...validCountries].sort(() => 0.5 - Math.random());

    const quizQuestions = shuffledCountries.slice(0, 10).map((country) => {
      const isCapitalQuestion = Math.random() < 0.5;

      let options;
      if (isCapitalQuestion) {
        let capitalOptions = [
          country.capital,
          ...validCountries
            .filter((c) => c.name !== country.name)
            .sort(() => 0.5 - Math.random())
            .map((c) => c.capital)
            .filter(Boolean)
        ];
        capitalOptions = Array.from(new Set(capitalOptions));

        // Ensure there are always 4 options
        while (capitalOptions.length < 4) {
          const randomCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
          if (!capitalOptions.includes(randomCountry.capital)) {
            capitalOptions.push(randomCountry.capital);
          }
        }

        options = capitalOptions.slice(0, 4).sort(() => 0.5 - Math.random());
      } else {
        let languageOptions = [
          country.languages[0].name,
          ...validCountries
            .filter((c) => c.name !== country.name)
            .sort(() => 0.5 - Math.random())
            .map((c) => c.languages[0].name)
            .filter(Boolean)
        ];
        languageOptions = Array.from(new Set(languageOptions));

        // Ensure there are always 4 options
        while (languageOptions.length < 4) {
          const randomCountry = validCountries[Math.floor(Math.random() * validCountries.length)];
          if (!languageOptions.includes(randomCountry.languages[0].name)) {
            languageOptions.push(randomCountry.languages[0].name);
          }
        }

        options = languageOptions.slice(0, 4).sort(() => 0.5 - Math.random());
      }

      return {
        question: isCapitalQuestion
          ? `Which city is the capital of ${country.name}?`
          : `Which language is spoken in ${country.name}?`,
        correctAnswer: isCapitalQuestion ? country.capital : country.languages[0].name,
        options
      };
    });

    setQuestions(quizQuestions);
  };


  const startQuiz = () => {
    if (error) toast.error("Failed to fetch countries. Please try again.", { duration: 5000 });
    else navigate("/quiz/question/0");
  };

  const viewLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background p-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-4">
          <CardTitle className="text-4xl font-bold text-center text-secondary-foreground">Welcome to the Countries Trivia Quiz</CardTitle>
          <CardDescription className="text-muted-foreground">Test your knowledge with our fun and challenging trivia questions. See how much you know and have a great time!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 flex flex-col items-center text-center">
          <Button disabled={loading} className="w-full" onClick={startQuiz}>
          {loading && <LoaderIcon className="mr-2 h-4 w-4 animate-spin"/>}
          {loading ? "Loading..." : "Start Quiz"}
          </Button>
          <Button variant="ghost" className="w-full" onClick={viewLeaderboard}>
            View Leaderboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;
