import { randomUUID } from "expo-crypto";
import { createContext, useContext, useEffect, useState } from "react";

type Guess = {
  id: string;
  guess: string;
  created_at: number;
  isMatch?: boolean;
};

export interface Round {
  id: string;
  guesses: Guess[];
}

type GameContextType = {
  rounds: Round[];
  currentGuesses: Guess[];
  setCurrentGuesses: (guesses: Guess[]) => void;
  saveRound: (guesses: Guess[]) => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentGuesses, setCurrentGuesses] = useState<Guess[]>([]);

  const saveRound = (guesses: Guess[]) => {
    setRounds((prev) => [...prev, { guesses: guesses, id: randomUUID() }]);
    setCurrentGuesses([]);
  };



  return (
    <GameContext.Provider
      value={{
        rounds,
        currentGuesses,
        setCurrentGuesses,
        saveRound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
};
