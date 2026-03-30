let onboardingData = {
  budget: null,
  goal: null,
  risk: null
};

function openOnboardingFlow() {
  const modal = document.getElementById('onboardingModal');
  resetOnboardingFlow();
  modal.classList.add('visible');
}

function closeOnboarding() {
  document.getElementById('onboardingModal').classList.remove('visible');
}

function resetOnboardingFlow() {
  onboardingData = { budget: null, goal: null, risk: null };

  document.querySelectorAll('.onboarding-step').forEach((step, index) => {
    if (index === 0) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  document.querySelectorAll('.budget-option').forEach(btn => btn.classList.remove('selected'));
  document.querySelectorAll('.goal-option').forEach(opt => opt.classList.remove('selected'));
  document.querySelectorAll('.risk-option').forEach(opt => opt.classList.remove('selected'));

  document.getElementById('customBudget').value = '';
}

function selectBudget(amount) {
  onboardingData.budget = amount;
  document.querySelectorAll('.budget-option').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.amount == amount);
  });
  document.getElementById('customBudget').value = '';
}

function selectGoal(goal) {
  onboardingData.goal = goal;
  document.querySelectorAll('.goal-option').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.goal === goal);
  });
}

function selectRisk(risk) {
  onboardingData.risk = risk;
  document.querySelectorAll('.risk-option').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.risk === risk);
  });
}

function nextOnboardingStep(stepNumber) {
  const customBudget = document.getElementById('customBudget').value;
  if (stepNumber === 2 && !onboardingData.budget && !customBudget) {
    showToast('Please select or enter a budget amount');
    return;
  }

  if (customBudget && parseFloat(customBudget) >= 10) {
    onboardingData.budget = parseFloat(customBudget);
  }

  if (stepNumber === 3 && !onboardingData.goal) {
    showToast('Please select your investment goal');
    return;
  }

  if (stepNumber === 4 && !onboardingData.risk) {
    showToast('Please select your risk tolerance');
    return;
  }

  document.querySelectorAll('.onboarding-step').forEach(step => step.classList.remove('active'));
  document.getElementById(`onboarding-step-${stepNumber}`).classList.add('active');

  if (stepNumber === 4) {
    generateStarterPortfolio();
  }
}

function generateStarterPortfolio() {
  const portfolio = calculatePortfolio(onboardingData.budget, onboardingData.risk, onboardingData.goal);
  const container = document.getElementById('starterPortfolio');

  container.innerHTML = portfolio.map(asset => `
    <div class="portfolio-asset">
      <div class="asset-header">
        <div>
          <div class="asset-symbol">${asset.symbol}</div>
          <div class="asset-name">${asset.name}</div>
        </div>
        <div class="asset-allocation">${asset.percentage}%</div>
      </div>
      <div class="asset-amount">$${(onboardingData.budget * asset.percentage / 100).toFixed(2)}</div>
      <div class="asset-reasoning">${asset.reasoning}</div>
    </div>
  `).join('');
}

function calculatePortfolio(budget, risk, goal) {
  const portfolioTemplates = {
    low: [
      { symbol: 'BND', name: 'Total Bond Market', percentage: 50, reasoning: 'Provides stability and steady income with minimal volatility.' },
      { symbol: 'VTI', name: 'Total Stock Market', percentage: 30, reasoning: 'Broad US stock exposure for moderate growth potential.' },
      { symbol: 'VXUS', name: 'International Stocks', percentage: 20, reasoning: 'Geographic diversification outside the US.' }
    ],
    medium: [
      { symbol: 'VTI', name: 'Total Stock Market', percentage: 50, reasoning: 'Your core growth engine — broad exposure to US companies.' },
      { symbol: 'VXUS', name: 'International Stocks', percentage: 30, reasoning: 'Diversifies beyond US borders for balanced global exposure.' },
      { symbol: 'BND', name: 'Total Bond Market', percentage: 20, reasoning: 'Provides stability during market downturns.' }
    ],
    high: [
      { symbol: 'VTI', name: 'Total Stock Market', percentage: 60, reasoning: 'Maximum US stock market exposure for aggressive growth.' },
      { symbol: 'VXUS', name: 'International Stocks', percentage: 30, reasoning: 'Captures growth opportunities in emerging and developed markets.' },
      { symbol: 'VGT', name: 'Technology Sector', percentage: 10, reasoning: 'Concentrated tech exposure for higher growth potential.' }
    ]
  };

  return portfolioTemplates[risk] || portfolioTemplates.medium;
}

async function completeOnboarding() {
  const submitBtn = event.target;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating your account...';

  const userEmail = localStorage.getItem('cornerstone_user_email') || prompt('Enter your email to save your portfolio:');

  if (!userEmail) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Start Investing';
    return;
  }

  try {
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .upsert([{
        email: userEmail,
        starting_budget: onboardingData.budget,
        risk_tolerance: onboardingData.risk,
        investment_goal: onboardingData.goal,
        onboarding_completed: true
      }], {
        onConflict: 'email'
      })
      .select()
      .single();

    if (profileError) throw profileError;

    const portfolio = calculatePortfolio(onboardingData.budget, onboardingData.risk, onboardingData.goal);
    const portfolioInserts = portfolio.map(asset => ({
      user_id: profile.id,
      asset_symbol: asset.symbol,
      asset_name: asset.name,
      allocation_percentage: asset.percentage,
      amount_invested: (onboardingData.budget * asset.percentage / 100),
      reasoning: asset.reasoning
    }));

    await supabaseClient.from('user_portfolios').insert(portfolioInserts);

    const { error: progressError } = await supabaseClient
      .from('user_progress')
      .upsert([{
        user_id: profile.id,
        investment_streak_days: 1,
        portfolio_level: 'beginner',
        modules_completed: [],
        total_deposits: onboardingData.budget,
        last_activity_date: new Date().toISOString(),
        milestones_achieved: ['first_portfolio']
      }], {
        onConflict: 'user_id'
      });

    if (progressError) throw progressError;

    await supabaseClient.from('portfolio_health_scores').insert([{
      user_id: profile.id,
      health_score: 85,
      diversification_score: 90,
      risk_score: risk === 'high' ? 75 : (risk === 'medium' ? 50 : 25),
      performance_score: 80
    }]);

    await supabaseClient.from('ai_suggestions').insert([{
      user_id: profile.id,
      suggestion_text: `Great start! Your portfolio is set up for ${risk} risk ${goal === 'grow_money' ? 'wealth building' : goal === 'learn_investing' ? 'learning' : 'income generation'}. Consider adding $25-50 weekly to build momentum.`,
      suggestion_type: 'next_move',
      is_active: true
    }]);

    localStorage.setItem('cornerstone_user_email', userEmail);
    currentUser = { email: userEmail };

    showToast('Portfolio created successfully!');
    closeOnboarding();
    scrollToDashboard();
    switchDashboardTab('dashboard');
    updateUIForLoggedInUser();

  } catch (error) {
    console.error('Onboarding error:', error);
    showToast('Something went wrong. Please try again.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Start Investing';
  }
}

document.getElementById('onboardingModal').addEventListener('click', function(e) {
  if (e.target === this) closeOnboarding();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeOnboarding();
  }
});
