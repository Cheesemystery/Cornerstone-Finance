// Enhanced AI Coach - Constrained, Actionable Advice
const aiCoachResponses = {
  portfolio_check: {
    responses: [
      {
        message: "Your portfolio looks solid. Here's what to focus on:",
        actions: [
          "✅ Keep your current allocation — it's well-diversified",
          "💰 Add $25 to SPY this week to maintain momentum",
          "📚 Read 'Understanding Market Cycles' in the Learn tab"
        ],
        reasoning: "You're 90% diversified and beating the market by 2.1%. Stay consistent."
      }
    ]
  },
  market_dip: {
    responses: [
      {
        message: "Market dipped today. Here's your move:",
        actions: [
          "🛡️ Don't panic sell — dips are buying opportunities",
          "💵 If you have $50+ available, add to your ETFs now",
          "📖 Review 'Why Panic Selling Hurts' in Avoid Mistakes section"
        ],
        reasoning: "Historical data shows buying during 5%+ dips yields 14% higher returns long-term."
      }
    ]
  },
  overexposed: {
    responses: [
      {
        message: "You're overexposed to tech. Let's rebalance:",
        actions: [
          "⚖️ Reduce tech holdings by 10% (sell $120 of VGT)",
          "🌍 Reinvest into VXUS for international exposure",
          "🔔 Set a reminder to review quarterly"
        ],
        reasoning: "Tech is 40% of your portfolio. Ideal target for beginners is 25-30%."
      }
    ]
  },
  streak_risk: {
    responses: [
      {
        message: "Your 14-day streak is at risk! Here's how to maintain it:",
        actions: [
          "📱 Enable daily check-in reminders in Settings",
          "💰 Schedule auto-invest for $25/week",
          "🎯 Join the Weekly Challenge to stay motivated"
        ],
        reasoning: "Users with 30+ day streaks have 3x better returns. Consistency beats timing."
      }
    ]
  },
  beginner_guidance: {
    responses: [
      {
        message: "Welcome! Here's how to get started right:",
        actions: [
          "🎯 Complete your first deposit of at least $50",
          "📚 Watch 'What is an Index Fund?' in Learn section",
          "🔥 Set a goal to check in daily for 7 days straight"
        ],
        reasoning: "80% of successful investors start with index funds and build consistency first."
      }
    ]
  },
  good_performance: {
    responses: [
      {
        message: "You're crushing it! Here's how to keep winning:",
        actions: [
          "🚀 Increase weekly contributions from $25 to $50",
          "📈 Your returns are 3.2% above average — share your progress",
          "🎓 Level up: Read 'Advanced Asset Allocation' to reach Intermediate"
        ],
        reasoning: "You're in the top 28% of beginners. Time to compound harder."
      }
    ]
  }
};

function getAICoachResponse(scenario, userContext = {}) {
  const responseData = aiCoachResponses[scenario];
  if (!responseData) return getDefaultResponse();

  const response = responseData.responses[0];

  return {
    message: response.message,
    actions: response.actions,
    reasoning: response.reasoning,
    timestamp: new Date(),
    personality: getPersonalityTone(userContext)
  };
}

function getDefaultResponse() {
  return {
    message: "Let me help you with that:",
    actions: [
      "📊 Check your Portfolio Health Score",
      "💡 Review your Next Move suggestion",
      "📚 Explore the Learn section for guidance"
    ],
    reasoning: "I'm here to keep your investing simple and on track.",
    timestamp: new Date()
  };
}

function getPersonalityTone(userContext) {
  const { streak = 0, level = 'beginner', performance = 0 } = userContext;

  if (streak >= 30) return 'veteran';
  if (performance > 15) return 'confident';
  if (streak >= 7) return 'encouraging';
  return 'supportive';
}

function renderAICoachMessage(scenario, userContext) {
  const response = getAICoachResponse(scenario, userContext);
  const personality = response.personality || 'supportive';

  const toneIntro = {
    veteran: "Nice to see you back.",
    confident: "You're doing great!",
    encouraging: "You're building real momentum.",
    supportive: "I'm here to help."
  };

  const html = `
    <div class="ai-message bot">
      <div class="ai-message-avatar">🤖</div>
      <div class="ai-message-content">
        <div class="ai-coach-intro">${toneIntro[personality]}</div>
        <div class="ai-message-text">${response.message}</div>
        <div class="ai-action-list">
          ${response.actions.map((action, i) => `
            <div class="ai-action-item" data-action="${i}">
              <span class="action-number">${i + 1}</span>
              <span class="action-text">${action}</span>
            </div>
          `).join('')}
        </div>
        <div class="ai-reasoning">
          <strong>Why?</strong> ${response.reasoning}
        </div>
        <div class="ai-message-time">${formatTime(response.timestamp)}</div>
      </div>
    </div>
  `;

  return html;
}

function formatTime(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return date.toLocaleDateString();
}

function suggestNextMove(portfolioData, userProgress) {
  const { value, change, streak } = portfolioData;
  const { level, lastDeposit } = userProgress;

  if (streak === 0) return 'streak_risk';
  if (change > 5) return 'good_performance';
  if (change < -3) return 'market_dip';
  if (level === 'beginner' && value < 500) return 'beginner_guidance';

  const daysSinceDeposit = Math.floor((Date.now() - new Date(lastDeposit)) / (1000 * 60 * 60 * 24));
  if (daysSinceDeposit > 14) {
    return {
      message: "Time to add more fuel to your portfolio:",
      actions: [
        "💰 Add $50-100 to maintain growth trajectory",
        "📈 Your returns are slowing — consistent deposits = compound gains",
        "🎯 Set up auto-invest to never miss a contribution"
      ],
      reasoning: "You haven't deposited in 2+ weeks. Regular deposits grow wealth 4x faster."
    };
  }

  return 'portfolio_check';
}

function handleQuickPrompt(prompt, userContext) {
  const promptMap = {
    'Why did my portfolio change?': 'portfolio_check',
    'What should I do this week?': 'portfolio_check',
    'Am I doing this right?': 'good_performance',
    'Should I buy more?': 'market_dip',
    'Help me stay consistent': 'streak_risk'
  };

  const scenario = promptMap[prompt] || 'portfolio_check';
  return renderAICoachMessage(scenario, userContext);
}

function addAIMessageToChat(message, isUser = false) {
  const messagesContainer = document.getElementById('aiChatMessages') || document.querySelector('.ai-chatbot-messages');
  if (!messagesContainer) return;

  const messageHTML = isUser ? `
    <div class="ai-message user">
      <div class="ai-message-avatar">👤</div>
      <div class="ai-message-content">
        <div class="ai-message-text">${message}</div>
        <div class="ai-message-time">Just now</div>
      </div>
    </div>
  ` : message;

  messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function initAICoach() {
  const quickPrompts = document.querySelectorAll('.ai-quick-q, .ai-suggestion-chip');
  quickPrompts.forEach(btn => {
    btn.addEventListener('click', function() {
      const prompt = this.textContent.trim();
      addAIMessageToChat(prompt, true);

      setTimeout(() => {
        const response = handleQuickPrompt(prompt, {
          streak: 14,
          level: 'beginner',
          performance: 12.3
        });
        addAIMessageToChat(response);
      }, 800);
    });
  });
}

if (typeof window !== 'undefined') {
  window.getAICoachResponse = getAICoachResponse;
  window.renderAICoachMessage = renderAICoachMessage;
  window.suggestNextMove = suggestNextMove;
  window.handleQuickPrompt = handleQuickPrompt;
  window.addAIMessageToChat = addAIMessageToChat;
  window.initAICoach = initAICoach;
}
