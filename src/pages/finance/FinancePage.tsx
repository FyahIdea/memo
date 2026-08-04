import React from 'react';
import { FinanceView } from '../../components/finance/FinanceView';
import { useApp } from '../../contexts/AppContext';

// Trang Finance: bọc FinanceView và lấy data từ AppContext
const FinancePage: React.FC = () => {
  const {
    appState,
    setInspectedObject,
    handleAddDepositToGoal,
    handleRolloverJarsToSavings,
    handleUnlockReward,
    handleAddBigPurchase,
    handleAddOnlineExpense,
    handleAddSavingsGoal,
  } = useApp();

  return (
    <FinanceView
      jars={appState.jars}
      savingsGoals={appState.savingsGoals}
      bigPurchases={appState.bigPurchases}
      onlineExpenses={appState.onlineExpenses}
      rewards={appState.rewards}
      gamification={appState.gamification}
      onAddDepositToGoal={handleAddDepositToGoal}
      onRolloverJarsToSavings={handleRolloverJarsToSavings}
      onUnlockReward={handleUnlockReward}
      onAddBigPurchase={handleAddBigPurchase}
      onAddOnlineExpense={handleAddOnlineExpense}
      onAddSavingsGoal={handleAddSavingsGoal}
      onSelectObject={setInspectedObject}
    />
  );
};

export default FinancePage;
