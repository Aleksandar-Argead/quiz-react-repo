import React, { useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useQuiz } from "../../context/Quiz";

const Quiz = () => {
  const {
    questions,
    setScore,
    score,
    lives,
    setLives,
    correctQuestions,
    setCorrectQuestions,
    incorrectQuestions,
    setIncorrectQuestions
  } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    if (questions.length === 0) navigate("/");
  }, [questions, navigate]);

  const updateQuestions = (questionIndex, isCorrect) => {
    const setQuestions = isCorrect ? setCorrectQuestions : setIncorrectQuestions;
    const questionsArray = isCorrect ? correctQuestions : incorrectQuestions;

    if (!questionsArray.includes(questionIndex)) {
      setQuestions([...questionsArray, questionIndex]);
    }
  };

  const handleTimeout = (questionIndex) => {
    handleLoseLife(questionIndex)
      navigate(`question/${questionIndex + 1}`);
  };

  const handleCorrectAnswer = (questionIndex, timeLeft) => {
    setScore((prevScore) => prevScore + timeLeft);
    updateQuestions(questionIndex, true);
    navigate(`question/${questionIndex + 1}`);
  };

  const handleLoseLife = (questionIndex) => {
    setTimeout(() => {
      setLives((prevLives) => prevLives - 1);
    }, 500);
    updateQuestions(questionIndex, false);
  };

  useEffect(() => {
    if (lives <=0) navigate("/results", { state: { score } });
  }, [lives, navigate, questions.length, score]);

  return <Outlet context={{ questions, lives, handleLoseLife, handleTimeout, handleCorrectAnswer }} />;
};

export default Quiz;
