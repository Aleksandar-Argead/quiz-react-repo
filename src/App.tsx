// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './routes/Welcome/Welcome';
import Quiz from './routes/Quiz/Quiz';
import Results from './routes/Results/Results';
import Leaderboard from './routes/Leaderboard/Leaderboard';
import { Question } from './routes/Quiz/Question/_id';
import { QuizProvider } from './context/Quiz';
import { Toaster } from '@/components/ui/sonner';

const App: React.FC = () => {
  return (
    <QuizProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/quiz" element={<Quiz />}>
            <Route path="question/:id" element={<Question />} />
          </Route>
          <Route path="/results" element={<Results />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Toaster richColors position="top-center"/>
    </QuizProvider>
  );
};

export default App;
