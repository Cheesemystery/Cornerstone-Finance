  function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
    document.getElementById('hamburger').classList.toggle('active');
  }
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('open');
      document.getElementById('hamburger').classList.remove('active');
    });
  });

  /* ─── TOAST ─── */
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }

  /* ─── SIGNUP MODAL ─── */
  function openSignup(plan) {
    const modal = document.getElementById('signupModal');
    const desc = document.getElementById('signupDesc');
    const btn = document.getElementById('signupSubmitBtn');
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('signupSuccess').style.display = 'none';
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupLevel').value = '';

    if (plan === 'pro') {
      desc.textContent = 'Upgrade to Pro \u2014 analyst tools, smart money data, and sentiment scores for $6/mo.';
      btn.textContent = 'Start Pro trial';
    } else {
      desc.textContent = 'Start building your financial foundation today \u2014 it\'s free.';
      btn.textContent = 'Create free account';
    }
    modal.classList.add('visible');
  }
  function closeSignup() {
    document.getElementById('signupModal').classList.remove('visible');
  }
  document.getElementById('signupModal').addEventListener('click', function(e) {
    if (e.target === this) closeSignup();
  });

  function submitSignup() {
    let valid = true;
    const name = document.getElementById('signupName');
    const email = document.getElementById('signupEmail');
    const level = document.getElementById('signupLevel');

    ['fg-name','fg-email','fg-level'].forEach(id => document.getElementById(id).classList.remove('has-error'));

    if (!name.value.trim()) { document.getElementById('fg-name').classList.add('has-error'); valid = false; }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      document.getElementById('fg-email').classList.add('has-error'); valid = false;
    }
    if (!level.value) { document.getElementById('fg-level').classList.add('has-error'); valid = false; }

    if (!valid) return;

    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('signupSuccess').style.display = 'block';
  }

  /* ─── FEATURE DETAIL MODAL ─── */
  const featureDetails = {
    briefing: {
      icon: '\ud83d\udcf0', title: 'Daily Portfolio Briefing', tag: 'Free',
      desc: 'Every morning, Cornerstone scans your portfolio holdings and generates a plain-English summary of what happened overnight \u2014 including sector movements, earnings reports, and macro trends that affect your positions.',
      bullets: ['Personalized to your actual holdings', 'Plain-English explanations of market moves', 'Historical context so you don\'t panic', 'Delivered daily before market open']
    },
    education: {
      icon: '\ud83c\udf93', title: 'Foundation Education', tag: 'Always free',
      desc: 'Our Foundation library is a curated series of short, clear video lessons designed for people who were never taught about money. From "What is a stock?" to "How to read a balance sheet" \u2014 we meet you where you are.',
      bullets: ['Beginner \u2192 Intermediate \u2192 Advanced tracks', 'Short video lessons (3-5 minutes each)', 'Interactive quizzes after each module', 'Progress tracking and completion certificates']
    },
    ai: {
      icon: '\ud83e\udd16', title: 'AI Financial Assistant', tag: 'Free',
      desc: 'Ask Cornerstone AI anything about investing and get honest, educational answers. It\'s like having a financially literate friend available 24/7 \u2014 one who explains things clearly without telling you what to do.',
      bullets: ['Trained on financial literacy best practices', 'Explains jargon in real language', 'Gives historical context for market events', 'Never gives specific financial advice']
    },
    analyst: {
      icon: '\ud83d\udcca', title: 'Analyst Consensus Tracker', tag: 'Pro',
      desc: 'See how Wall Street analysts rate each of your holdings, how those ratings have shifted over time, and what the consensus price target looks like \u2014 presented simply so you can factor it into your own research.',
      bullets: ['Buy/Hold/Sell consensus breakdown', 'Price target ranges and trends', 'Rating change alerts for your holdings', 'Historical rating accuracy scores']
    },
    smartmoney: {
      icon: '\ud83c\udfe6', title: 'Smart Money Flow', tag: 'Pro',
      desc: 'Track what hedge funds, mutual funds, and institutional investors are buying and selling based on SEC 13F filings. See when the big players are moving into or out of stocks you own.',
      bullets: ['Institutional ownership percentages', 'Quarterly position changes from 13F filings', 'Top buyers and sellers for each ticker', 'Alerts when major funds change positions']
    },
    sentiment: {
      icon: '\ud83d\udce1', title: 'News Sentiment Score', tag: 'Pro',
      desc: 'Our AI reads hundreds of financial headlines and articles about your holdings daily, scoring each for real impact vs. media noise. Know when news actually matters and when it\'s just clickbait.',
      bullets: ['AI-powered headline analysis', 'Impact score (1-10) for each news event', 'Separates real catalysts from noise', 'Historical sentiment trend charts']
    }
  };

  function showFeatureDetail(el) {
    const key = el.dataset.feature;
    const d = featureDetails[key];
    if (!d) return;
    const isPro = d.tag === 'Pro';
    const tagClass = isPro ? 'tag-pro' : 'tag-free';
    document.getElementById('featureModalContent').innerHTML =
      '<div style="font-size:36px;margin-bottom:12px">' + d.icon + '</div>' +
      '<h3 style="margin-bottom:4px">' + d.title + '</h3>' +
      '<span class="feature-tag ' + tagClass + '" style="margin-bottom:16px">' + d.tag + '</span>' +
      '<p style="margin-top:12px">' + d.desc + '</p>' +
      '<ul style="list-style:none;padding:0;margin:0 0 20px">' +
      d.bullets.map(function(b) { return '<li style="font-size:13px;color:var(--text-mid);padding:5px 0;display:flex;gap:8px;align-items:flex-start"><span style="color:var(--green);font-weight:500;flex-shrink:0">\u2713</span>' + b + '</li>'; }).join('') +
      '</ul>' +
      '<button class="form-submit" onclick="' + (isPro ? "closeFeatureModal();openSignup('pro')" : "closeFeatureModal();document.getElementById('demo').scrollIntoView({behavior:'smooth'})") + '">' + (isPro ? 'Upgrade to Pro' : 'Try it free') + '</button>';
    document.getElementById('featureModal').classList.add('visible');
  }
  function closeFeatureModal() {
    document.getElementById('featureModal').classList.remove('visible');
  }
  document.getElementById('featureModal').addEventListener('click', function(e) {
    if (e.target === this) closeFeatureModal();
  });

  /* ─── DASHBOARD TAB SWITCHING ─── */
  var portfolioChartRendered = false;
  var currentTab = 'dashboard';

  // AI Placeholder mapping
  const aiPlaceholderMap = {
    'dashboard': 'Ask about today\'s briefing...',
    'portfolio': 'Ask about your allocation or growth...',
    'research': 'Ask about a specific ticker or trend...',
    'news': 'Ask about market headlines...',
    'transactions': 'Ask about your investing streak...',
    'learn': 'Ask about investing basics...',
    'foundation': 'Ask about investing basics...'
  };

  function updateAIPlaceholder(tab) {
    const aiTriggerText = document.querySelector('.ai-trigger-text');
    if (aiTriggerText && aiPlaceholderMap[tab]) {
      aiTriggerText.style.opacity = '0';
      setTimeout(function() {
        aiTriggerText.textContent = aiPlaceholderMap[tab];
        aiTriggerText.style.opacity = '1';
      }, 100);
    }
  }

  document.querySelectorAll('.dash-nav-item[data-tab]').forEach(function(item, index) {
    // Add ARIA attributes for accessibility
    item.setAttribute('role', 'tab');
    item.setAttribute('aria-selected', item.classList.contains('active') ? 'true' : 'false');
    item.setAttribute('tabindex', item.classList.contains('active') ? '0' : '-1');

    item.addEventListener('click', function() {
      var tab = this.getAttribute('data-tab');

      // Hide hero and features when any dashboard tab is clicked
      if (tab !== 'home') {
        toggleDashboardView(true);
      }

      // Update ARIA attributes
      document.querySelectorAll('.dash-nav-item[data-tab]').forEach(function(i) {
        i.classList.remove('active');
        i.setAttribute('aria-selected', 'false');
        i.setAttribute('tabindex', '-1');
      });

      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      this.setAttribute('tabindex', '0');

      document.querySelectorAll('.tab-panel').forEach(function(p) {
        p.classList.remove('active');
        p.setAttribute('aria-hidden', 'true');
      });

      var panel = document.getElementById('tab-' + tab);
      if (panel) {
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
      }

      // Update current tab index for keyboard navigation
      currentTabIndex = tabOrder.indexOf(tab);

      // Update AI placeholder if tab changed
      if (tab !== currentTab) {
        currentTab = tab;
        updateAIPlaceholder(tab);
      }

      // Render portfolio chart on first visit (lazy load Chart.js)
      if (tab === 'portfolio' && !portfolioChartRendered) {
        loadChartJs(function() {
          renderPortfolioChart();
          portfolioChartRendered = true;
        });
      }
    });
  });

  function renderPortfolioChart() {
    var ctx = document.getElementById('portfolioChart');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['SPY (50%)', 'VXUS (25%)', 'BND (25%)'],
        datasets: [{
          data: [50, 25, 25],
          backgroundColor: ['#1D9E75', '#0F6E56', '#D4A853'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: "'DM Sans', sans-serif", size: 11 },
              padding: 12,
              usePointStyle: true,
              pointStyleWidth: 8
            }
          }
        }
      }
    });
  }

  /* ─── CHAT WITH PLACEHOLDER RESPONSES ─── */
  const placeholderResponses = {
    "what's a roth ira?": "A Roth IRA is a retirement account where you put in money you've already paid taxes on. The magic? Everything it earns grows completely tax-free, and when you pull it out in retirement, you don't owe a penny in taxes on any of those gains.\n\nThink of it like planting a tree \u2014 you pay for the seed now, but the fruit it grows is yours forever. If you're young, this is one of the most powerful tools available because your money has decades to grow.\n\nFor 2024, you can contribute up to $7,000 per year if you're under 50. You can invest it in index funds, ETFs, or individual stocks inside the account.\n\nWant me to explain how to actually open one and what to invest in once you do?",
    "should i be worried about my stocks dropping?": "Short answer: drops are normal, and historically, temporary. The S&P 500 has dropped 10% or more about once a year on average \u2014 and it's still up over 10,000% since its inception.\n\nThe real risk isn't that stocks drop. It's that you sell during a drop and lock in your losses. The investors who do best are the ones who stay consistent through the noise.\n\nThat said, your feelings are valid. Watching numbers go red feels terrible, especially when it's money you've worked hard for. The key is to zoom out \u2014 look at your 1-year or 5-year chart instead of today's.\n\nWould you like me to explain what a market correction is and how it's different from a crash?",
    "how do i start investing with $100?": "You'd be surprised how far $100 can go. Here's a simple path:\n\n1. Open a brokerage account \u2014 apps like Fidelity, Schwab, or Vanguard are all free and beginner-friendly.\n2. Put your $100 into a broad index fund like VTI (Total US Stock Market) or VOO (S&P 500). This instantly gives you a tiny piece of hundreds of companies.\n3. Set up automatic contributions \u2014 even $25/month adds up significantly over time thanks to compound growth.\n\nThe most important thing isn't the amount \u2014 it's the habit. Someone who invests $50/month starting at 20 will likely have more than someone who starts with $10,000 at 35.\n\nWant me to break down the difference between VTI and VOO so you can decide which fits your goals?",
    "what is spy?": "SPY is the ticker symbol for the SPDR S&P 500 ETF Trust \u2014 the most popular exchange-traded fund in the world. When you buy a share of SPY, you're essentially buying a tiny piece of the 500 largest publicly traded companies in the US all at once.\n\nThat means companies like Apple, Microsoft, Amazon, JPMorgan, and Google are all in there. Instead of picking individual stocks and hoping you chose right, SPY gives you broad exposure to the entire US market.\n\nHistorically, the S&P 500 has returned about 10% per year on average over the long term. SPY is one of the most common building blocks in beginner portfolios because of this simplicity.\n\nWant me to explain the difference between SPY and similar funds like VOO or VTI?"
  };

  const genericResponses = [
    "That's a great question. Investing can feel overwhelming at first, but the basics are simpler than most people think. The key is to start learning and stay consistent \u2014 you don't need to know everything to begin.\n\nThe three pillars of smart investing for beginners are: diversification (don't put all your eggs in one basket), consistency (invest regularly, not just when you feel like it), and patience (time in the market beats timing the market).\n\nWant me to dive deeper into any of these concepts?",
    "I appreciate you asking \u2014 that's the kind of curiosity that leads to real financial literacy. Many people never ask these questions, so you're already ahead.\n\nThe most important thing I can tell you is that understanding your money is a skill, not a talent. Nobody is born knowing this stuff \u2014 and the finance industry often makes it confusing on purpose.\n\nWant me to recommend where to start based on what you already know?",
    "Good question! Let me break this down in a way that actually makes sense.\n\nFinance has a lot of jargon, but behind every complicated-sounding term is usually a simple concept. My job is to strip away the noise and help you see what actually matters for your situation.\n\nTell me more about what you're trying to understand, and I'll walk you through it step by step."
  ];

  const messagesHistory = [];
  let isLoading = false;
  let genericIndex = 0;

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendMessage(text, role) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg ' + role;
    var formattedText = text.replace(/\n/g, '<br>');
    div.innerHTML = '<div class="msg-bubble">' + formattedText + '</div><div class="msg-time">' + getTime() + '</div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function showTyping() {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg bot'; div.id = 'typingIndicator';
    div.innerHTML = '<div class="typing-indicator" style="display:flex"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
  }

  function sendQuick(btn) {
    const text = btn.textContent;
    document.getElementById('quickPrompts').style.display = 'none';
    sendMessageWithText(text);
  }

  function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text || isLoading) return;
    input.value = '';
    sendMessageWithText(text);
  }

  async function sendMessageWithText(text) {
    if (isLoading) return;
    isLoading = true;
    document.getElementById('sendBtn').disabled = true;
    document.getElementById('quickPrompts').style.display = 'none';

    appendMessage(text, 'user');
    messagesHistory.push({ role: 'user', content: text });
    showTyping();

    // Simulate response delay
    var delay = 800 + Math.random() * 1200;
    await new Promise(function(r) { setTimeout(r, delay); });

    // Check for placeholder match
    var lower = text.toLowerCase().trim().replace(/[?!.,]+$/, '').trim();
    var reply = placeholderResponses[lower + '?'] || placeholderResponses[lower];

    if (!reply) {
      if (lower.includes('roth') && lower.includes('ira')) reply = placeholderResponses["what's a roth ira?"];
      else if (lower.includes('worried') || lower.includes('dropping') || lower.includes('crash')) reply = placeholderResponses["should i be worried about my stocks dropping?"];
      else if (lower.includes('$100') || lower.includes('start investing') || lower.includes('begin investing')) reply = placeholderResponses["how do i start investing with $100?"];
      else if (lower.includes('spy') && lower.length < 30) reply = placeholderResponses["what is spy?"];
      else {
        reply = genericResponses[genericIndex % genericResponses.length];
        genericIndex++;
      }
    }

    removeTyping();
    appendMessage(reply, 'bot');
    messagesHistory.push({ role: 'assistant', content: reply });

    isLoading = false;
    document.getElementById('sendBtn').disabled = false;
  }

  /* ─── CLOSE MODALS ON ESCAPE ─── */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeSignup();
      closeFeatureModal();
    }
  });

  /* ─── NAV LINK SHOW HIDDEN SECTIONS ─── */
  document.querySelectorAll('.nav-links a[href="#features"], .nav-links a[href="#pricing"], .footer-links a[href="#features"], .footer-links a[href="#pricing"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var id = this.getAttribute('href').substring(1);
      var section = document.getElementById(id);
      if (section && section.classList.contains('hidden-section')) {
        e.preventDefault();
        section.classList.remove('hidden-section');
        setTimeout(function() {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    });
  });

  /* ─── NAV SCROLL BEHAVIOR ─── */
  var navEl = document.querySelector('nav');
  function updateNav() {
    if (window.scrollY > 60) {
      navEl.classList.add('scrolled');
    } else {
      navEl.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ─── SCROLL REVEAL ANIMATIONS ─── */
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-reveal').forEach(function(el) {
    revealObserver.observe(el);
  });

  /* ─── STAGGERED CARD ANIMATIONS ─── */
  var cardObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.features-section .feature-card, .pricing-section .pricing-card').forEach(function(el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease ' + (i % 3) * 0.12 + 's, transform 0.5s ease ' + (i % 3) * 0.12 + 's, border-color 0.2s';
    cardObserver.observe(el);
  });

  /* ─── PORTFOLIO AI QUESTIONS ─── */
  function askPortfolioQuestion(input) {
    const question = input.value.trim();
    if (!question) return;

    showToast('AI portfolio insights coming soon!');
    input.value = '';
  }

  function handleQuickPortfolioQ(btn) {
    const question = btn.textContent;
    showToast('AI portfolio insights coming soon!');
  }

  /* ─── SUPABASE & AUTH ─── */
  const SUPABASE_URL = 'https://pgppxjhtqdwjrtjbywtu.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncHB4amh0cWR3anJ0amJ5d3R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NTY0MTgsImV4cCI6MjA5MDMzMjQxOH0.bxPhNK7wLkAeeUhyqUMDo_JDhUo1cE3rKqorM0ppi1s';
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  let currentUser = null;
  let isInDashboard = false;

  async function checkAuth() {
    const email = localStorage.getItem('cornerstone_user_email');
    if (email) {
      currentUser = { email };
      updateUIForLoggedInUser();
      return true;
    }
    return false;
  }

  function updateUIForLoggedInUser() {
    const navCta = document.querySelector('.nav-cta');
    if (navCta && currentUser) {
      navCta.textContent = currentUser.email.substring(0, 2).toUpperCase();
      navCta.style.background = 'var(--green)';
      navCta.onclick = function(e) {
        e.preventDefault();
        showToast('Signed in as ' + currentUser.email);
      };
    }
  }

  function openAuthModal() {
    const modal = document.getElementById('authModal');
    document.getElementById('authForm').style.display = 'block';
    document.getElementById('authSuccess').style.display = 'none';
    document.getElementById('fg-auth-email').classList.remove('has-error');
    document.getElementById('authEmail').value = '';
    modal.classList.add('visible');
  }

  function closeAuthModal() {
    document.getElementById('authModal').classList.remove('visible');
  }

  function closeAuthModalAndRedirect() {
    closeAuthModal();
    scrollToDashboard();
    switchDashboardTab('dashboard');
    updateUIForLoggedInUser();
  }

  document.getElementById('authModal').addEventListener('click', function(e) {
    if (e.target === this) closeAuthModal();
  });

  async function submitAuth() {
    const emailInput = document.getElementById('authEmail');
    const email = emailInput.value.trim();
    const submitBtn = document.getElementById('authSubmitBtn');
    const formGroup = document.getElementById('fg-auth-email');

    formGroup.classList.remove('has-error');

    if (!email || !email.includes('@')) {
      formGroup.classList.add('has-error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Please wait...';

    try {
      const { data: existingUser } = await supabaseClient
        .from('waitlist_users')
        .select('email, last_sign_in')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        await supabaseClient
          .from('waitlist_users')
          .update({ last_sign_in: new Date().toISOString() })
          .eq('email', email);

        localStorage.setItem('cornerstone_user_email', email);
        currentUser = { email };

        document.getElementById('authSuccessMessage').textContent = 'Welcome back to Cornerstone!';
      } else {
        await supabaseClient
          .from('waitlist_users')
          .insert([{ email: email }]);

        localStorage.setItem('cornerstone_user_email', email);
        currentUser = { email };

        document.getElementById('authSuccessMessage').textContent = 'Welcome to Cornerstone! Your journey begins now.';
      }

      document.getElementById('authForm').style.display = 'none';
      document.getElementById('authSuccess').style.display = 'block';

    } catch (error) {
      console.error('Auth error:', error);
      showToast('Something went wrong. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Continue';
    }
  }

  /* ─── DASHBOARD VISIBILITY (Using State Manager) ─── */
  function scrollToDashboard() {
    if (window.stateManager) {
      window.stateManager.enterLoggedInMode();
    }
  }

  function enterDemoMode() {
    if (window.stateManager) {
      window.stateManager.enterDemoMode();
    }
  }

  function toggleDashboardView(showOnlyDashboard) {
    if (showOnlyDashboard) {
      if (currentUser) {
        window.stateManager.enterLoggedInMode();
      } else {
        window.stateManager.enterDemoMode();
      }
    } else {
      window.stateManager.returnToLanding();
    }
  }

  function switchDashboardTab(tabName) {
    document.querySelectorAll('.dash-nav-item[data-tab]').forEach(function(i) { i.classList.remove('active'); });
    const tabItem = document.querySelector('.dash-nav-item[data-tab="' + tabName + '"]');
    if (tabItem) tabItem.classList.add('active');

    document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
    const panel = document.getElementById('tab-' + tabName);
    if (panel) panel.classList.add('active');

    if (tabName === 'portfolio' && !portfolioChartRendered) {
      renderPortfolioChart();
      portfolioChartRendered = true;
    }
  }

  /* ─── RESET TO HOME ─── */
  function resetToHome() {
    if (window.stateManager) {
      window.stateManager.returnToLanding();
    }

    setTimeout(function() {
      switchDashboardTab('dashboard');
    }, 300);
  }

  if (typeof window !== 'undefined') {
    window.enterDemoMode = enterDemoMode;
    window.resetToHome = resetToHome;
  }

  /* ─── AI FAB CONTROL ─── */
  function toggleAIFab(show) {
    const fab = document.getElementById('aiFab');
    if (fab) {
      if (show) {
        fab.classList.add('visible');
      } else {
        fab.classList.remove('visible');
      }
    }
  }

  function openAIChat() {
    // Scroll to the chat section
    const chatSection = document.querySelector('.chat-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
      // Focus the chat input after scrolling
      setTimeout(function() {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) chatInput.focus();
      }, 500);
    }
  }

  /* ─── UPDATE TAB SWITCHING TO CONTROL AI FAB ─── */
  document.querySelectorAll('.dash-nav-item[data-tab]').forEach(function(item) {
    const originalClickHandler = item.onclick;
    item.addEventListener('click', function() {
      const tab = this.getAttribute('data-tab');

      // Show AI FAB only on dashboard tab
      if (tab === 'dashboard') {
        toggleAIFab(true);
      } else {
        toggleAIFab(false);
      }
    });
  });

  /* ─── LEARNING PROGRESS SIMULATION ─── */
  function updateLearningProgress() {
    // This would connect to a real backend in production
    const progressBar = document.getElementById('learningProgressBar');
    const progressPercent = document.getElementById('learningProgressPercent');
    const progressStatus = document.getElementById('learningProgressStatus');

    // Simulate progress (in real app, this would come from database)
    const completedModules = 3;
    const totalModules = 8;
    const percent = Math.round((completedModules / totalModules) * 100);

    if (progressBar) progressBar.style.width = percent + '%';
    if (progressPercent) progressPercent.textContent = percent + '%';
    if (progressStatus) progressStatus.textContent = completedModules + ' of ' + totalModules + ' modules complete';
  }

  /* ─── TILT EFFECT ON CARDS ─── */
  function initTiltEffects() {
    const tiltCards = document.querySelectorAll('.metric-box, .trending-card, .briefing, .holdings');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ─── WATCHLIST STAR TOGGLE ─── */
  let watchlist = JSON.parse(localStorage.getItem('watchlist') || '["AAPL", "MSFT", "GOOGL"]');

  function saveWatchlist() {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }

  function updateWatchlistUI() {
    const watchlistGrid = document.getElementById('watchlistGrid');
    const watchlistEmpty = document.getElementById('watchlistEmpty');
    const trendingGrid = document.getElementById('trendingGrid');

    if (!watchlistGrid || !trendingGrid) return;

    // Update star states in trending section
    trendingGrid.querySelectorAll('.star-icon').forEach(function(star) {
      const ticker = star.getAttribute('data-ticker');
      if (watchlist.includes(ticker)) {
        star.classList.add('starred');
        star.textContent = '★';
        star.setAttribute('title', 'Remove from watchlist');
      } else {
        star.classList.remove('starred');
        star.textContent = '☆';
        star.setAttribute('title', 'Add to watchlist');
      }
    });

    // Rebuild watchlist grid
    watchlistGrid.innerHTML = '';
    if (watchlist.length === 0) {
      watchlistEmpty.style.display = 'block';
      watchlistGrid.style.display = 'none';
    } else {
      watchlistEmpty.style.display = 'none';
      watchlistGrid.style.display = 'grid';

      watchlist.forEach(function(ticker) {
        const trendingCard = trendingGrid.querySelector(`.trending-card[data-ticker="${ticker}"]`);
        if (!trendingCard) return;

        const clone = trendingCard.cloneNode(true);
        clone.classList.remove('trending-card');
        clone.classList.add('watchlist-card');

        const stamp = document.createElement('div');
        stamp.className = 'watchlist-stamp';
        stamp.textContent = 'WATCHING';
        clone.appendChild(stamp);

        const star = clone.querySelector('.star-icon');
        if (star) {
          star.classList.add('starred');
          star.textContent = '★';
        }

        watchlistGrid.appendChild(clone);
      });

      // Re-attach star click handlers
      watchlistGrid.querySelectorAll('.star-icon').forEach(attachStarHandler);
    }
  }

  // Debounce function for star toggles
  let starToggleTimeout;
  function attachStarHandler(star) {
    star.setAttribute('role', 'button');
    star.setAttribute('tabindex', '0');

    const handleToggle = function(e) {
      e.stopPropagation();

      // Debounce rapid clicks
      clearTimeout(starToggleTimeout);
      starToggleTimeout = setTimeout(function() {
        const ticker = star.getAttribute('data-ticker');

        if (watchlist.includes(ticker)) {
          watchlist = watchlist.filter(function(t) { return t !== ticker; });
          showToast(`${ticker} removed from watchlist`);
        } else {
          watchlist.push(ticker);
          showToast(`${ticker} added to watchlist`);
        }

        saveWatchlist();
        updateWatchlistUI();
      }, 150);
    };

    star.addEventListener('click', handleToggle);

    // Keyboard accessibility
    star.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle(e);
      }
    });
  }

  // Watchlist collapse toggle
  const toggleWatchlistBtn = document.getElementById('toggleWatchlist');
  const watchlistSection = document.getElementById('watchlistSection');
  if (toggleWatchlistBtn && watchlistSection) {
    toggleWatchlistBtn.addEventListener('click', function() {
      watchlistSection.classList.toggle('collapsed');
      this.textContent = watchlistSection.classList.contains('collapsed') ? '▶ Expand' : '▼ Collapse';
    });
  }

  /* ─── KEYBOARD NAVIGATION ─── */
  const tabOrder = ['dashboard', 'portfolio', 'research', 'news', 'transactions', 'learn', 'foundation'];
  let currentTabIndex = 0;

  document.addEventListener('keydown', function(e) {
    // Only handle arrow keys when not in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      currentTabIndex = (currentTabIndex + 1) % tabOrder.length;
      const nextTab = document.querySelector(`.dash-nav-item[data-tab="${tabOrder[currentTabIndex]}"]`);
      if (nextTab) nextTab.click();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      currentTabIndex = (currentTabIndex - 1 + tabOrder.length) % tabOrder.length;
      const prevTab = document.querySelector(`.dash-nav-item[data-tab="${tabOrder[currentTabIndex]}"]`);
      if (prevTab) prevTab.click();
    }
  });

  /* ─── PERFORMANCE: LAZY LOAD CHART.JS ─── */
  let chartJsLoaded = false;
  function loadChartJs(callback) {
    if (chartJsLoaded) {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = function() {
      chartJsLoaded = true;
      callback();
    };
    document.head.appendChild(script);
  }

  /* ─── INIT ON LOAD ─── */
  checkAuth();
  updateLearningProgress();

  // Show AI FAB on initial load if on dashboard
  setTimeout(function() {
    const dashboardTab = document.querySelector('.dash-nav-item[data-tab="dashboard"]');
    if (dashboardTab && dashboardTab.classList.contains('active')) {
      toggleAIFab(true);
    }
    initTiltEffects();

    // Initialize watchlist
    updateWatchlistUI();
    document.querySelectorAll('.star-icon').forEach(attachStarHandler);

    // Preload Chart.js if on portfolio tab
    const portfolioTab = document.querySelector('.dash-nav-item[data-tab="portfolio"]');
    if (portfolioTab) {
      portfolioTab.addEventListener('mouseenter', function() {
        loadChartJs(function() {});
      }, { once: true });
    }

    // Add click handlers for interactive navigation
    initNavigationHandlers();
  }, 500);

  /* ─── INTERACTIVE NAVIGATION ─── */
  function initNavigationHandlers() {
    // Make metric boxes clickable to navigate to relevant tabs
    document.querySelectorAll('.metric-box').forEach(function(box) {
      box.style.cursor = 'pointer';
      box.addEventListener('click', function() {
        const label = this.querySelector('.metric-label')?.textContent?.toLowerCase();
        if (label?.includes('portfolio') || label?.includes('total')) {
          switchDashboardTab('portfolio');
        }
      });
    });

    // Make all ticker symbols clickable (navigate to research/market radar)
    document.querySelectorAll('.h-ticker').forEach(function(ticker) {
      ticker.style.cursor = 'pointer';
      ticker.addEventListener('click', function(e) {
        e.stopPropagation();
        switchDashboardTab('research');
        showToast('Viewing ' + ticker.textContent + ' details');
      });
    });

    // Make trending cards fully clickable
    document.querySelectorAll('.trending-card').forEach(function(card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('star-icon')) {
          const ticker = this.getAttribute('data-ticker');
          switchDashboardTab('research');
          showToast('Viewing ' + ticker + ' details');
        }
      });
    });

    // Make watchlist cards clickable
    document.querySelectorAll('.watchlist-card').forEach(function(card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('star-icon')) {
          const ticker = this.getAttribute('data-ticker');
          switchDashboardTab('research');
          showToast('Viewing ' + ticker + ' details');
        }
      });
    });

    // Make holdings rows clickable
    document.querySelectorAll('.h-row').forEach(function(row) {
      row.style.cursor = 'pointer';
      row.addEventListener('click', function() {
        switchDashboardTab('research');
      });
    });

    document.querySelectorAll('.ht-row').forEach(function(row) {
      row.style.cursor = 'pointer';
      row.addEventListener('click', function() {
        switchDashboardTab('research');
      });
    });
  }

  /* ─── AI CHATBOT FUNCTIONALITY ─── */
  let chatbotOpen = false;

  window.toggleAIChatbot = function() {
    chatbotOpen = !chatbotOpen;
    const chatbotWindow = document.getElementById('aiChatbotWindow');
    const chatbotTrigger = document.getElementById('aiChatbotTrigger');

    if (chatbotOpen) {
      chatbotWindow.classList.add('active');
      chatbotTrigger.classList.add('hidden');
      setTimeout(() => {
        document.getElementById('aiChatbotInput').focus();
      }, 400);
    } else {
      chatbotWindow.classList.remove('active');
      chatbotTrigger.classList.remove('hidden');
    }
  };

  window.sendAIMessage = function() {
    const input = document.getElementById('aiChatbotInput');
    const message = input.value.trim();

    if (!message) return;

    addAIChatMessage(message, 'user');
    input.value = '';

    showAITyping();

    setTimeout(() => {
      hideAITyping();
      const response = generateAIResponse(message);
      addAIChatMessage(response, 'bot');
    }, 1500 + Math.random() * 1000);
  };

  window.sendAISuggestion = function(chip) {
    const message = chip.textContent;
    document.getElementById('aiChatbotInput').value = message;
    sendAIMessage();
  };

  function addAIChatMessage(text, type) {
    const messagesContainer = document.getElementById('aiChatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${type}`;

    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    messageDiv.innerHTML = `
      <div class="ai-message-avatar">${type === 'user' ? '👤' : '🤖'}</div>
      <div class="ai-message-content">
        <div class="ai-message-text">${text}</div>
        <div class="ai-message-time">${time}</div>
      </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showAITyping() {
    document.getElementById('aiChatbotTyping').classList.add('active');
    const messagesContainer = document.getElementById('aiChatbotMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function hideAITyping() {
    document.getElementById('aiChatbotTyping').classList.remove('active');
  }

  function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('spy') || lowerMessage.includes('s&p 500')) {
      return "SPY is an ETF that tracks the S&P 500 index — the 500 largest U.S. companies. It's a popular choice for diversified exposure to the U.S. stock market. Your portfolio holds SPY, which gives you instant diversification across multiple sectors.";
    }

    if (lowerMessage.includes('up') || lowerMessage.includes('gain') || lowerMessage.includes('positive')) {
      return "Your portfolio is up 1.4% today, mainly driven by SPY's gain of 2.1%. This is likely due to positive market sentiment around recent rate cut optimism. Remember, daily fluctuations are normal — focus on your long-term strategy.";
    }

    if (lowerMessage.includes('down') || lowerMessage.includes('drop') || lowerMessage.includes('losing')) {
      return "Market drops are a normal part of investing. Your portfolio is built for long-term growth, not day-to-day swings. If you're concerned, let's talk about your risk tolerance and timeline — I'm here to help you stay confident.";
    }

    if (lowerMessage.includes('rebalance') || lowerMessage.includes('adjust')) {
      return "Rebalancing means adjusting your portfolio to match your target allocation. Since you're holding broad index funds like SPY and VXUS, you're already well-diversified. I'd recommend rebalancing quarterly or if any holding drifts more than 5% from target.";
    }

    if (lowerMessage.includes('vxus') || lowerMessage.includes('international')) {
      return "VXUS gives you exposure to international stocks outside the U.S. It's showing -0.4% today, which is typical during periods of dollar strength. International diversification helps reduce risk tied to any single country's economy.";
    }

    if (lowerMessage.includes('briefing') || lowerMessage.includes('explain')) {
      return "Today's briefing shows your portfolio is up 1.4%, led by SPY amid rate cut optimism. VXUS is seeing mild selling — typical during dollar-strength periods. No action needed. Your diversified strategy is working as designed.";
    }

    if (lowerMessage.includes('risk') || lowerMessage.includes('safe')) {
      return "Your current portfolio mix of SPY (U.S. stocks), VXUS (international), and BND (bonds) is moderately balanced. Bonds provide stability, while stocks drive growth. If you want to adjust risk, we can talk about shifting your allocation.";
    }

    if (lowerMessage.includes('bnd') || lowerMessage.includes('bond')) {
      return "BND is a bond ETF that tracks U.S. investment-grade bonds. Bonds typically provide stability and income, and they often move opposite to stocks. Your BND holding is up 0.1% today, providing a steady anchor for your portfolio.";
    }

    return "Great question! I'm here to help you understand your portfolio and make informed decisions. Feel free to ask about specific holdings, market movements, or general investing concepts. What else would you like to know?";
  }
