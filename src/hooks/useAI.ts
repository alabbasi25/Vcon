import { useState, useCallback } from 'react';
import { getAIGeneratedSuggestion } from '../services/aiService';
import { usePlanet } from '../context/KokabContext';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { tasks, habits, moodLogs, currentUser } = usePlanet();

  const getSmartSuggestion = useCallback(async (type: 'routine' | 'wellness' | 'finance' | 'general') => {
    setLoading(true);
    try {
      let context = '';
      if (type === 'routine') {
        const pending = tasks.filter(t => t.status === 'pending').slice(0, 3).map(t => t.title).join(', ');
        context = `Current pending tasks for user ${currentUser}: ${pending}`;
      } else if (type === 'wellness') {
        const myHabits = habits[currentUser]?.map(h => h.title).join(', ') || 'no habits';
        context = `User habits: ${myHabits}`;
      }

      const prompt = `Based on the ${type} area, provide a romantic or helpful 1-sentence tip.`;
      const result = await getAIGeneratedSuggestion(prompt, context);
      setSuggestion(result);
      return result;
    } catch (error) {
      console.error("useAI error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [tasks, habits, currentUser]);

  return {
    loading,
    suggestion,
    getSmartSuggestion,
    clearSuggestion: () => setSuggestion(null)
  };
};
