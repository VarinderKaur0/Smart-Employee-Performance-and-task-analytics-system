// Define API Endpoint
const API_URL = 'http://localhost:5000/api';

// --- Theme Logic ---
window.toggleTheme = function () {
  const currentTheme = document.body.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.outerHTML = `<i data-feather="${newTheme === 'light' ? 'sun' : 'moon'}" id="themeIcon"></i>`;
    if (window.feather) feather.replace();
  }
}

// Init theme on load
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);

// --- UI Logic ---

// Dropdown Menu Toggle
document.getElementById('dropdownBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('dropdownContent').classList.toggle('show');
});

// Close dropdown when clicking outside
window.addEventListener('click', () => {
  const dropdown = document.getElementById('dropdownContent');
  if (dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  }
});

// --- Routing & Views ---
const appContainer = document.getElementById('app-container');

async function navigateTo(view, params = {}) {
  appContainer.innerHTML = '';
  appContainer.classList.remove('page-transition');
  void appContainer.offsetWidth;
  appContainer.classList.add('page-transition');

  if (!view || view === 'home') {
    appContainer.classList.add('home-layout');
  } else {
    appContainer.classList.remove('home-layout');
  }

  switch (view) {
    case 'home': await renderHome(); break;
    case 'reports-hub': renderReportsHub(); break;
    case 'admin-login': renderAdminLogin(); break;
    case 'dashboard-login': renderDashboardLogin(params.target); break;
    case 'admin-dashboard': await renderAdminDashboard(); break;
    case 'employee-login': renderEmployeeLogin(); break;
    case 'employee-dashboard': await renderEmployeeDashboard(params.employee); break;
    case 'powerbi': renderPowerBI(); break;
    case 'about': renderAbout(); break;
    default: await renderHome();
  }

  if (view === 'powerbi') {
    document.body.classList.add('fullscreen-mode');
  } else {
    document.body.classList.remove('fullscreen-mode');
    appContainer.innerHTML += renderFooter();
  }

  setTimeout(() => { if (window.feather) feather.replace(); }, 100);
}

function renderAbout() {
  appContainer.innerHTML = `
    <div class="about-page" style="width: 100%; margin: 0 auto; padding: 2rem 0;">
      <!-- Header -->
      <div class="about-header text-center" style="margin-bottom: 4rem;">
        <span class="section-tag" style="font-size: 0.75rem; letter-spacing: 0.1em; margin-bottom: 1rem;">System Overview</span>
        <h1 class="hero-title" style="font-size: 2.2rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-primary); letter-spacing: -0.02em; background: none; -webkit-text-fill-color: var(--text-primary);">Smart Employee Performance & Task Analytic System</h1>
        <p class="section-desc" style="max-width: 800px; margin: 0 auto; font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">A unified, enterprise-grade platform designed to centralize organizational metrics, streamline performance tracking, and empower teams with deep, actionable intelligence.</p>
      </div>
      
      <!-- Core Philosophy (2 columns) -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 4rem;">
        <div class="glass-panel" style="padding: 2.5rem; border-radius: 12px; background: linear-gradient(145deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.2)); border: none; box-shadow: none; text-align: left;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.75rem;"><i data-feather="server" style="color: var(--accent); width: 22px;"></i> The SEPTAS Architecture</h2>
          <p style="font-size: 0.9rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 1rem;">
            SEPTAS is built on a robust, dual-portal architecture separating administrative oversight from individual employee insights. By aggregating diverse data points—from technical proficiency to teamwork metrics—the system provides a holistic view of workforce health and productivity.
          </p>
        </div>
        <div class="glass-panel" style="padding: 2.5rem; border-radius: 12px; background: linear-gradient(145deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.2)); border: none; box-shadow: none; text-align: left;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.75rem;"><i data-feather="users" style="color: #10b981; width: 22px;"></i> Dual-Portal Access</h2>
          <p style="font-size: 0.9rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 1rem;">
            Administrators can securely manage personnel data, configure dynamic scoring thresholds, and seamlessly upload batch data via Excel intelligence. Employees gain access to personalized, visually rich dashboards that pinpoint exact areas for growth compared against real-time company-wide averages.
          </p>
        </div>
      </div>

      <!-- Data Flow Diagram -->
      <div style="margin-bottom: 4rem; padding: 2.5rem; background: rgba(15, 23, 42, 0.4); border-radius: 12px; border: 1px solid rgba(255,255,255,0.03);">
        <h3 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); text-align: center; margin-bottom: 2.5rem;">System Data Flow</h3>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="flex: 1; text-align: center;">
            <div style="background: rgba(59, 130, 246, 0.1); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2);"><i data-feather="upload-cloud"></i></div>
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">1. Data Ingestion</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Excel & Manual Entry</div>
          </div>
          <div style="color: var(--text-secondary); opacity: 0.5;"><i data-feather="arrow-right"></i></div>
          <div style="flex: 1; text-align: center;">
            <div style="background: rgba(16, 185, 129, 0.1); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);"><i data-feather="cpu"></i></div>
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">2. Engine Processing</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Dynamic Validation</div>
          </div>
          <div style="color: var(--text-secondary); opacity: 0.5;"><i data-feather="arrow-right"></i></div>
          <div style="flex: 1; text-align: center;">
            <div style="background: rgba(139, 92, 246, 0.1); width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.2);"><i data-feather="pie-chart"></i></div>
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">3. Live Analytics</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Dashboards & BI Sync</div>
          </div>
        </div>
      </div>

      <!-- Core Metrics Evaluated (4 Columns) -->
      <h3 style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1.5rem; text-align: center;">Core Performance Metrics</h3>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 4rem;">
        <div class="glass-panel" style="padding: 1.5rem; border-radius: 8px; background: rgba(15, 23, 42, 0.4); border: none; box-shadow: none; text-align: center;">
          <i data-feather="code" style="color: #3b82f6; margin-bottom: 0.75rem; width: 20px;"></i>
          <div style="font-size: 0.85rem; font-weight: 600;">Technical Skill</div>
        </div>
        <div class="glass-panel" style="padding: 1.5rem; border-radius: 8px; background: rgba(15, 23, 42, 0.4); border: none; box-shadow: none; text-align: center;">
          <i data-feather="message-square" style="color: #10b981; margin-bottom: 0.75rem; width: 20px;"></i>
          <div style="font-size: 0.85rem; font-weight: 600;">Communication</div>
        </div>
        <div class="glass-panel" style="padding: 1.5rem; border-radius: 8px; background: rgba(15, 23, 42, 0.4); border: none; box-shadow: none; text-align: center;">
          <i data-feather="star" style="color: #f59e0b; margin-bottom: 0.75rem; width: 20px;"></i>
          <div style="font-size: 0.85rem; font-weight: 600;">Leadership</div>
        </div>
        <div class="glass-panel" style="padding: 1.5rem; border-radius: 8px; background: rgba(15, 23, 42, 0.4); border: none; box-shadow: none; text-align: center;">
          <i data-feather="users" style="color: #8b5cf6; margin-bottom: 0.75rem; width: 20px;"></i>
          <div style="font-size: 0.85rem; font-weight: 600;">Teamwork</div>
        </div>
      </div>

      <!-- Features (3 columns) -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 4rem;">
        <div class="glass-panel" style="padding: 2rem; border-radius: 12px; background: linear-gradient(145deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.2)); border: none; box-shadow: none; text-align: left;">
          <div style="color: var(--accent); margin-bottom: 1rem;"><i data-feather="database" style="width: 20px; height: 20px;"></i></div>
          <h3 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 0.5rem;">Data Integrity Protocols</h3>
          <p style="font-size: 0.8rem; line-height: 1.6; color: var(--text-secondary); margin: 0;">Strict validation protocols during data ingestion flag anomalous scores instantly, maintaining high analytic fidelity.</p>
        </div>
        <div class="glass-panel" style="padding: 2rem; border-radius: 12px; background: linear-gradient(145deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.2)); border: none; box-shadow: none; text-align: left;">
          <div style="color: #10b981; margin-bottom: 1rem;"><i data-feather="layout" style="width: 20px; height: 20px;"></i></div>
          <h3 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 0.5rem;">Premium Interface Design</h3>
          <p style="font-size: 0.8rem; line-height: 1.6; color: var(--text-secondary); margin: 0;">Minimalist, high-density corporate aesthetic with flat frosted-glass components and sophisticated typography.</p>
        </div>
        <div class="glass-panel" style="padding: 2rem; border-radius: 12px; background: linear-gradient(145deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.2)); border: none; box-shadow: none; text-align: left;">
          <div style="color: #f59e0b; margin-bottom: 1rem;"><i data-feather="lock" style="width: 20px; height: 20px;"></i></div>
          <h3 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 0.5rem;">Secure Access Tiers</h3>
          <p style="font-size: 0.8rem; line-height: 1.6; color: var(--text-secondary); margin: 0;">Enterprise-grade security preventing unauthorized autocomplete or credential harvesting across all portal entry points.</p>
        </div>
      </div>

      <div class="text-center">
        <button class="btn btn-primary" onclick="navigateTo('home')" style="padding: 0.6rem 1.25rem; font-size: 0.9rem;">
          <i data-feather="arrow-left" style="width: 16px;"></i> Return to Dashboard
        </button>
      </div>
    </div>
  `;
}

async function renderHome() {
  let metrics = { total_employees: 0, average_overall: 0.0, high_performers: 0 };

  try {
    const res = await fetch(`${API_URL}/metrics/home`);
    metrics = await res.json();
  } catch (err) {
    console.error("Backend not running yet", err);
  }

  appContainer.innerHTML = `
    <!-- Hero Section -->
    <div class="home-hero">
      <div class="hero-content">
        <h1 class="hero-title" style="font-size: 2.8rem; line-height: 1.25; font-weight: 600; margin-bottom: 1rem;">Smart Employee Performance & Task Analytic System</h1>
        <p class="hero-subtitle" style="font-size: 1.05rem; line-height: 1.6; color: var(--text-secondary); max-width: 600px; margin-bottom: 2.5rem;">Empowering teams with actionable insights, seamless task analytics, and transparent performance tracking in one premium platform.</p>
        
        <div class="hero-buttons">
          <a href="#" class="btn btn-primary" onclick="navigateTo('dashboard-login', {target: 'powerbi'}); return false;">
            <i data-feather="pie-chart"></i> Explore Dashboard
          </a>
          <a href="#" class="btn btn-secondary" onclick="navigateTo('reports-hub'); return false;">
            <i data-feather="file-text"></i> Access Portal
          </a>
        </div>
      </div>
      <div class="hero-visual">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Analytics Illustration" class="hero-image" style="object-fit: cover; aspect-ratio: 4/3; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);">
      </div>
    </div>

    <!-- Stats Section -->
    <div class="kpi-cards" style="margin-bottom: 8rem;">
      <div class="kpi-card">
        <div class="kpi-icon"><i data-feather="users" width="28" height="28"></i></div>
        <div class="kpi-value">${metrics.total_employees}</div>
        <div class="kpi-label">Active Users</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon"><i data-feather="star" width="28" height="28"></i></div>
        <div class="kpi-value">${metrics.average_overall}</div>
        <div class="kpi-label">Avg Rating</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon"><i data-feather="award" width="28" height="28"></i></div>
        <div class="kpi-value">${metrics.high_performers}</div>
        <div class="kpi-label">Top Performers</div>
      </div>
    </div>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-header">
        <span class="section-tag">Core Capabilities</span>
        <h2 class="section-title">Everything you need to scale performance</h2>
        <p class="section-desc">Our comprehensive suite of tools helps you monitor, analyze, and optimize your team's productivity with ease.</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon"><i data-feather="bar-chart-2"></i></div>
          <h3 class="feature-name">Dynamic Analytics</h3>
          <p class="feature-text">Track overall team metrics and high-performer counts in real-time directly from the home dashboard.</p>
          <div style="margin-top: 1.5rem; display: flex; align-items: center; gap: 0.5rem; color: #3b82f6; font-weight: 600; font-size: 0.9rem; cursor: pointer;">
            Explore Data <i data-feather="arrow-right" style="width: 16px;"></i>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i data-feather="shield"></i></div>
          <h3 class="feature-name">Secure Multi-Portal</h3>
          <p class="feature-text">Separate, password-protected access points for both administrators and individual employees.</p>
          <div style="margin-top: 1.5rem; display: flex; align-items: center; gap: 0.5rem; color: #10b981; font-weight: 600; font-size: 0.9rem; cursor: pointer;">
            Secure Login <i data-feather="arrow-right" style="width: 16px;"></i>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i data-feather="file-text"></i></div>
          <h3 class="feature-name">Excel Intelligence</h3>
          <p class="feature-text">Seamlessly upload and parse employee performance data from Excel spreadsheets for instant system updates.</p>
          <div style="margin-top: 1.5rem; display: flex; align-items: center; gap: 0.5rem; color: #8b5cf6; font-weight: 600; font-size: 0.9rem; cursor: pointer;">
            Upload Data <i data-feather="arrow-right" style="width: 16px;"></i>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i data-feather="layers"></i></div>
          <h3 class="feature-name">Power BI Integration</h3>
          <p class="feature-text">Deep integration with Power BI allows you to embed and view live, interactive corporate dashboards.</p>
          <div style="margin-top: 1.5rem; display: flex; align-items: center; gap: 0.5rem; color: #f59e0b; font-weight: 600; font-size: 0.9rem; cursor: pointer;">
            View Dashboards <i data-feather="arrow-right" style="width: 16px;"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Workflow Section -->
    <section class="workflow-section">
      <div class="section-header">
        <span class="section-tag">The Process</span>
        <h2 class="section-title">How SEPTAS works for you</h2>
        <p class="section-desc">A simple, 3-step workflow to transform raw data into actionable organizational intelligence.</p>
      </div>
      
      <div class="workflow-steps">
        <div class="workflow-step">
          <div class="step-number">01</div>
          <h3 class="step-title">Data Ingestion</h3>
          <p class="step-desc">Upload Excel files or connect directly to your database through our secure admin portal.</p>
        </div>
        <div class="workflow-step">
          <div class="step-number">02</div>
          <h3 class="step-title">Processing & Sync</h3>
          <p class="step-desc">Our system automatically calculates scores, ranks, and categories based on company averages.</p>
        </div>
        <div class="workflow-step">
          <div class="step-number">03</div>
          <h3 class="step-title">Actionable Insights</h3>
          <p class="step-desc">Access personalized dashboards and visual reports to drive growth and recognize excellence.</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-container">
        <h2 class="cta-title">Ready to empower your team?</h2>
        <p class="cta-desc">Join hundreds of organizations using SEPTAS to drive performance and transparency across their workforce.</p>
        <div class="hero-buttons" style="justify-content: center;">
          <button class="btn btn-primary" onclick="navigateTo('reports-hub')">Get Started Now</button>
          <button class="btn btn-secondary" onclick="navigateTo('about')">Learn More</button>
        </div>
      </div>
    </section>
  `;
  if (window.feather) feather.replace();
}

function renderFooter() {
  return `
    <footer>
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo">
            <i data-feather="hexagon" class="logo-icon"></i>
            SEPTAS
          </div>
          <p class="footer-text">
            Smart Employee Performance and Task Analytic System. Leading the way in modern workforce management and data-driven insights.
          </p>
        </div>
        
        <div>
          <h4 class="footer-title">Platform</h4>
          <ul class="footer-links">
            <li><a href="#" onclick="navigateTo('home'); return false;">Home</a></li>
            <li><a href="#" onclick="navigateTo('dashboard-login', {target: 'powerbi'}); return false;">Dashboards</a></li>
            <li><a href="#" onclick="navigateTo('reports-hub'); return false;">Portal Login</a></li>
            <li><a href="#" onclick="navigateTo('about'); return false;">About Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="footer-title">Resources</h4>
          <ul class="footer-links">
            <li><a href="#">Documentation</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">API Reference</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="footer-title">Contact</h4>
          <ul class="footer-links">
            <li><a href="#">support@septas.com</a></li>
            <li><a href="#">+1 (555) 000-0000</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2026 SEPTAS Analytics. All rights reserved.</p>
        <div class="social-links">
          <a href="#" class="social-link"><i data-feather="twitter" width="18"></i></a>
          <a href="#" class="social-link"><i data-feather="linkedin" width="18"></i></a>
          <a href="#" class="social-link"><i data-feather="github" width="18"></i></a>
        </div>
      </div>
    </footer>
  `;
}

function renderReportsHub() {
  appContainer.innerHTML = `
    <div style="min-height: 60vh; display: flex; align-items: center; justify-content: center;">
      <div class="glass-panel" style="padding: 4rem; width: 100%; max-width: 600px; border-radius: 24px;">
        <div style="margin-bottom: 3rem;">
          <h2 style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--text-primary);">Access Portal</h2>
          <p style="color: var(--text-secondary);">Select your access level to proceed to the secure portal.</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr; gap: 1.25rem;">
          <button class="btn btn-primary" onclick="navigateTo('employee-login')" style="padding: 1.25rem; font-size: 1.1rem; justify-content: center;">
            <i data-feather="user"></i> Employee Login
          </button>

          <button class="btn btn-outline" onclick="navigateTo('admin-login')" style="padding: 1.25rem; font-size: 1.1rem; justify-content: center;">
            <i data-feather="shield"></i> Admin Login
          </button>
        </div>
        
        <div style="margin-top: 3rem;">
          <a href="#" onclick="navigateTo('home'); return false;" style="color: var(--text-secondary); text-decoration: none; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 0.5rem; transition: color 0.3s ease;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-secondary)'">
            <i data-feather="arrow-left" style="width: 16px;"></i> Return to Homepage
          </a>
        </div>
      </div>
    </div>
  `;
  if (window.feather) feather.replace();
}

function renderAdminLogin() {
  appContainer.innerHTML = `
    <div style="min-height: 75vh; display: flex; align-items: center; justify-content: center;">
      <div class="glass-panel" style="padding: 4rem 3rem; position: relative; width: 100%; max-width: 500px; margin: 0; border-radius: 24px;">
        <div style="margin-bottom: 2rem; color: var(--accent);"><i data-feather="shield" style="width: 48px; height: 48px;"></i></div>
        <h2 class="panel-title" style="font-size: 2rem; margin-bottom: 0.5rem;">Admin Login</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2.5rem;">Enter master credentials to access the control center.</p>
        
        <div class="password-wrapper" style="margin-bottom: 2rem;">
          <input type="password" id="adminPassword" class="input-field" placeholder="Enter Master Key" autocomplete="new-password" style="font-size: 1.1rem; padding: 1.2rem; margin-bottom: 0; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color);">
          <button type="button" class="toggle-password" onclick="toggleVisibility('adminPassword', this)" style="right: 1rem;">
            <i data-feather="eye"></i>
          </button>
        </div>
        <button class="btn btn-primary btn-block" onclick="verifyAdmin()" style="padding: 1.1rem; font-size: 1.1rem; justify-content: center;">
          <i data-feather="key"></i> Authenticate
        </button>
        <div id="adminLoginError" class="alert alert-error" style="margin-top: 1.5rem; display: none;">Access Denied.</div>
        <div id="adminLoginNetworkError" class="alert alert-error" style="margin-top: 1.5rem; display: none;">Connection Error.</div>
        
        <div style="margin-top: 2rem;">
          <a href="#" onclick="navigateTo('reports-hub'); return false;" style="color: var(--text-secondary); text-decoration: none; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 0.5rem; transition: color 0.3s ease;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-secondary)'">
            <i data-feather="arrow-left" style="width: 16px;"></i> Back to Portal Hub
          </a>
        </div>
      </div>
    </div>
  `;
}

window.verifyAdmin = async function () {
  const pwd = document.getElementById('adminPassword').value;
  const loginError = document.getElementById('adminLoginError');
  const networkError = document.getElementById('adminLoginNetworkError');

  loginError.style.display = 'none';
  networkError.style.display = 'none';

  try {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd, require_2fa: false })
    });
    const data = await res.json();
    
    if (res.ok && data.success) {
      navigateTo('admin-dashboard');
    } else {
      loginError.style.display = 'block';
    }
  } catch (e) {
    networkError.style.display = 'block';
    console.error(e);
  }
}

function renderDashboardLogin(target = 'powerbi') {
  window.currentDashboardLoginTarget = target;
  const title = 'Dashboard Authentication';
  const subtitle = 'Enter admin credentials to access the dashboards.';

  appContainer.innerHTML = `
    <div style="min-height: 75vh; display: flex; align-items: center; justify-content: center;">
      <div id="login-box" class="security-panel" style="padding: 4rem 3rem; width: 100%; max-width: 500px; text-align: center; border-radius: 12px; margin: 0;">
        
        <div id="password-section">
          <div style="margin-bottom: 2rem; color: var(--accent);"><i data-feather="shield" style="width: 48px; height: 48px;"></i></div>
          <h2 class="panel-title glitch" data-text="${title}" style="font-size: 2rem; margin-bottom: 1rem; color: var(--accent);">${title}</h2>
          <p style="color: var(--text-secondary); margin-bottom: 2.5rem;">${subtitle}</p>
          
          <div class="password-wrapper" style="margin-bottom: 2rem;">
            <input type="password" id="dashboardPassword" class="input-field cyber-input" placeholder="Enter Master Key" autocomplete="new-password" style="font-size: 1.1rem; padding: 1.2rem; margin-bottom: 0;">
            <button type="button" class="toggle-password" onclick="toggleVisibility('dashboardPassword', this)" style="right: 1rem; color: var(--accent);">
              <i data-feather="eye"></i>
            </button>
          </div>
          <button class="btn btn-block btn-cyber" onclick="verifyDashboardAdmin()" style="padding: 1rem; font-size: 1.1rem; justify-content: center; display: flex; align-items: center; gap: 0.5rem; width: 100%;">
            <i data-feather="key"></i> Authenticate
          </button>
          <div id="dashboardLoginError" class="alert alert-error" style="margin-top: 1.5rem; display: none;">Access Denied.</div>
          <div id="dashboardLoginNetworkError" class="alert alert-error" style="margin-top: 1.5rem; display: none;">Connection Error.</div>
        </div>

        <div id="otp-section" style="display: none; animation: fadeIn 0.4s ease;">
          <div style="margin-bottom: 2rem; color: var(--accent);"><i data-feather="radio" style="width: 48px; height: 48px;"></i></div>
          <h2 class="panel-title glitch" data-text="2FA Verification" style="font-size: 2rem; margin-bottom: 1rem; color: var(--accent);">2FA Verification</h2>
          <p style="color: var(--text-secondary); margin-bottom: 2.5rem; line-height: 1.6;">A secure 6-digit code has been dispatched to the administrator email. Enter it below to proceed.</p>
          
          <div class="otp-container">
            <input type="text" class="otp-box" maxlength="1" onkeyup="moveToNext(this, event)">
            <input type="text" class="otp-box" maxlength="1" onkeyup="moveToNext(this, event)">
            <input type="text" class="otp-box" maxlength="1" onkeyup="moveToNext(this, event)">
            <input type="text" class="otp-box" maxlength="1" onkeyup="moveToNext(this, event)">
            <input type="text" class="otp-box" maxlength="1" onkeyup="moveToNext(this, event)">
            <input type="text" class="otp-box" maxlength="1" onkeyup="moveToNext(this, event)">
          </div>
          
          <button class="btn btn-primary btn-block" id="verifyOtpBtn" onclick="verifyDashboardOTP()" style="padding: 1rem; font-size: 1.1rem; justify-content: center; display: flex; align-items: center; gap: 0.5rem; width: 100%;">
            <i data-feather="check-circle"></i> Verify Code
          </button>
          <div id="otpLoginError" class="alert alert-error" style="margin-top: 1.5rem; display: none;">Invalid OTP Code.</div>
        </div>

        <div style="margin-top: 2rem;">
          <a href="#" onclick="navigateTo('home'); return false;" style="color: var(--text-secondary); text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem;"><i data-feather="arrow-left" style="width: 14px;"></i> Abort</a>
        </div>
      </div>
    </div>
  `;
}

window.moveToNext = function(elem, event) {
  if (elem.value.length >= elem.maxLength) {
    let next = elem.nextElementSibling;
    if (next && next.tagName === 'INPUT') {
      next.focus();
    }
  } else if (event.key === "Backspace") {
    let prev = elem.previousElementSibling;
    if (prev && prev.tagName === 'INPUT') {
      prev.focus();
    }
  }
}

window.verifyDashboardAdmin = async function () {
  const pwd = document.getElementById('dashboardPassword').value;
  const loginError = document.getElementById('dashboardLoginError');
  const networkError = document.getElementById('dashboardLoginNetworkError');

  loginError.style.display = 'none';
  networkError.style.display = 'none';

  try {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd, require_2fa: true })
    });
    const data = await res.json();
    
    if (res.ok && data.success) {
      if (data.pending) {
        window.dashboardLoginToken = data.token;
        document.getElementById('password-section').style.display = 'none';
        document.getElementById('otp-section').style.display = 'block';
        if (window.feather) feather.replace();
        setTimeout(() => document.querySelectorAll('.otp-box')[0].focus(), 100);
      } else {
        navigateTo(window.currentDashboardLoginTarget || 'powerbi');
      }
    } else {
      loginError.style.display = 'block';
      const box = document.getElementById('login-box');
      box.classList.remove('shake');
      void box.offsetWidth;
      box.classList.add('shake');
    }
  } catch (e) {
    networkError.style.display = 'block';
    console.error(e);
  }
}

window.verifyDashboardOTP = async function() {
  const inputs = document.querySelectorAll('.otp-box');
  let code = '';
  inputs.forEach(i => code += i.value);
  
  const otpError = document.getElementById('otpLoginError');
  otpError.style.display = 'none';
  
  if (code.length < 6) {
    otpError.textContent = 'Please enter all 6 digits.';
    otpError.style.display = 'block';
    const box = document.getElementById('login-box');
    box.classList.remove('shake');
    void box.offsetWidth;
    box.classList.add('shake');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/admin/verify_code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: window.dashboardLoginToken, code: code })
    });
    const data = await res.json();
    
    if (res.ok && data.success) {
      navigateTo(window.currentDashboardLoginTarget || 'powerbi');
    } else {
      otpError.textContent = data.error || 'Invalid verification code.';
      otpError.style.display = 'block';
      const box = document.getElementById('login-box');
      box.classList.remove('shake');
      void box.offsetWidth;
      box.classList.add('shake');
    }
  } catch(e) {
    otpError.textContent = "Network Error.";
    otpError.style.display = 'block';
  }
}

async function renderAdminDashboard() {
  let state = {
    topPerformerThreshold: '300',
    powerBiLink: '',
    employeeCount: 0,
    missingDataCount: 0
  };

  try {
    const res = await fetch(`${API_URL}/admin/config`);
    state = await res.json();
  } catch (err) {
    console.error(err);
  }

  appContainer.innerHTML = `
    <h1 style="margin-bottom: 1.5rem; font-size: 1.8rem;">Admin Control Center</h1>
    
    <div class="admin-dashboard">
      <div class="admin-section">
        <h2 style="margin-bottom: 1rem;"><i data-feather="database"></i> System Settings & KPI</h2>
        
        <div class="form-group" style="margin-bottom: 1rem;">
          <label>Top Performer Threshold</label>
          <input type="number" id="topThreshold" class="input-field" value="${state.topPerformerThreshold || 300}" placeholder="300" style="max-width: 120px;">
        </div>
        
        <hr style="border-color: var(--border-color); margin: 1rem 0; border-top: 1px solid var(--border-color); border-bottom:none;">
        
        <h2 style="margin-bottom: 1rem;"><i data-feather="upload-cloud"></i> Employee Reports Data</h2>
        <div class="form-group">
          <div class="file-upload btn btn-secondary">
             <span><i data-feather="file"></i> Upload Excel File</span>
             <input type="file" id="excelUpload" accept=".xlsx, .xls" onchange="handleExcelUpload(event)">
          </div>
          <div class="employee-status" id="uploadStatus" style="display:flex; flex-direction:column; gap:0.4rem; margin-top:1rem;">
            <span style="color:#10b981;">Currently tracking: <strong>${state.employeeCount}</strong> active employee records.</span>
            ${state.missingDataCount > 0 ? 
              `<span style="color:#ef4444; font-weight:600;"><i data-feather="alert-circle" style="width:14px; height:14px; vertical-align:middle;"></i> ${state.missingDataCount} records have missing values. <a href="#" onclick="showMissingDataIds(); return false;" style="color:#ef4444; text-decoration:underline; margin-left:0.5rem;">View IDs</a></span>` : 
              `<span style="color:#10b981;"><i data-feather="check-circle" style="width:14px; height:14px; vertical-align:middle;"></i> All data integrity checks passed.</span>`}
          </div>
        </div>
        
        <div style="display:flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="saveAdminSettings()">Save Settings</button>
          <button class="btn btn-secondary" onclick="fetchAdminData()" style="color: var(--accent); border-color: rgba(59, 130, 246, 0.5);">View Uploaded Data</button>
          <button class="btn btn-secondary" onclick="clearEmployeeData()" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.5);">Clear Data</button>
        </div>
        
        <div id="adminSaveAlert" class="alert alert-success mt-1">Settings successfully updated!</div>
        
        <div id="warningsSection" style="margin-top: 2rem; display: none;">
          <h3 style="color: #f59e0b; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-feather="alert-triangle"></i> Data Integrity Warnings
          </h3>
          <div id="warningsList" class="alert alert-error" style="background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.3); color: #f59e0b; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 0.9rem;">
          </div>
          <button class="btn btn-secondary" style="margin-top: 0.5rem; padding: 0.25rem 0.75rem; font-size: 0.8rem;" onclick="document.getElementById('warningsSection').style.display='none'">Clear Warnings</button>
        </div>
      </div>
      
      <div class="admin-section">
        <h2><i data-feather="link"></i> Power BI Integration</h2>
        <div class="form-group">
          <label>Power BI Embed URL</label>
          <input type="url" id="pbiLink" class="input-field" value="${state.powerBiLink}" placeholder="https://app.powerbi.com/view?r=...">
        </div>
      </div>
    </div>

    <!-- Missing Data Modal -->
    <div id="missingIdsModal" class="modal-overlay" style="display:none; align-items: center; justify-content: center; z-index: 2000;">
      <div class="modal-content glass-panel" style="max-width: 400px; padding: 2rem;">
        <h2 style="margin-bottom: 1rem;">Missing Data Records</h2>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">The following Employee IDs have at least one missing field:</p>
        <div id="missingIdsList" style="max-height: 250px; overflow-y: auto; text-align: left; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; font-family: monospace; line-height: 1.8; margin-bottom: 1.5rem;">
        </div>
        <button class="btn btn-primary btn-block" onclick="document.getElementById('missingIdsModal').style.display='none'">Close</button>
      </div>
    </div>
  `;
  if (window.feather) feather.replace();
}

window.fetchAdminData = async function () {
  try {
    const res = await fetch(`${API_URL}/admin/employees`);
    const data = await res.json();
    if (res.ok && data.success) {
      renderAdminData(data.data);
    } else {
      alert("Error: " + (data.error || "Failed to fetch data."));
    }
  } catch (e) {
    alert("Network error.");
  }
}

window.escapeHTML = function (str) {
  if (str === null || str === undefined || str === '') return '<span style="color:#ef4444; font-weight:bold;">-</span>';
  return String(str).replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag])
  );
}

window.renderAdminData = function (employees) {
  employees.sort((a, b) => {
    let numA = parseInt((a.id.match(/\d+/) || [0])[0], 10);
    let numB = parseInt((b.id.match(/\d+/) || [0])[0], 10);
    return numA - numB;
  });
  let rows = '';
  employees.forEach(emp => {
    rows += `
      <tr>
        <td>${escapeHTML(emp.id)}</td>
        <td>${escapeHTML(emp.name)}</td>
        <td>${escapeHTML(emp.department)}</td>
        <td>${escapeHTML(emp.experience)}</td>
        <td>${escapeHTML(emp.technical)}</td>
        <td>${escapeHTML(emp.leadership)}</td>
        <td>${escapeHTML(emp.communication)}</td>
        <td>${escapeHTML(emp.teamwork)}</td>
        <td>${escapeHTML(emp.overall)}</td>
        <td>${escapeHTML(emp.work_hours)}</td>
        <td>${escapeHTML(emp.overtime)}</td>
        <td>${escapeHTML(emp.performance_category)}</td>
        <td>
          <button class="btn btn-secondary" style="color:#ef4444; border-color:rgba(239,68,68,0.5); padding:0.25rem 0.5rem; font-size:0.8rem;" onclick="deleteEmployee('${escapeHTML(emp.id)}')">
            <i data-feather="trash-2" style="width:16px;height:16px;"></i> Delete
          </button>
        </td>
      </tr>
    `;
  });

  appContainer.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
      <h1>Employee Data Grid</h1>
      <div style="display:flex; align-items:center; gap: 1rem; flex-wrap: wrap;">
        <div class="search-wrapper" style="position:relative;">
          <i data-feather="search" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); width:16px; color:var(--text-secondary);"></i>
          <input type="text" id="gridSearch" placeholder="Search ID..." class="input-field" style="padding-left:36px; margin-bottom:0; max-width:180px; height:38px; font-size:0.9rem;" onkeyup="filterGridBySearch()">
        </div>
        <button class="btn btn-primary" onclick="showAddEmployeeModal()"><i data-feather="plus"></i> Add New Employee</button>
        <button class="btn btn-secondary" onclick="exportToPDF()" style="color: #10b981; border-color: rgba(16, 185, 129, 0.5);"><i data-feather="download"></i> Download PDF</button>
        <button class="btn btn-secondary" onclick="navigateTo('admin-dashboard')"><i data-feather="arrow-left"></i> Dashboard</button>
      </div>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Dept</th>
            <th>Exp</th>
            <th>Tech</th>
            <th>Lead</th>
            <th>Comm</th>
            <th>Team</th>
            <th>Rating</th>
            <th>Hours</th>
            <th>Overtime</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
    <div id="modalContainer"></div>
  `;
  if (window.feather) feather.replace();
}

window.filterGridBySearch = function() {
  const query = document.getElementById('gridSearch').value.toLowerCase();
  const rows = document.querySelectorAll('.data-table tbody tr');
  
  rows.forEach(row => {
    const idCell = row.cells[0];
    if (idCell) {
      const idText = idCell.textContent.toLowerCase();
      row.style.display = idText.includes(query) ? '' : 'none';
    }
  });
}

window.deleteEmployee = async function (id) {
  if (!confirm(`Are you sure you want to delete employee information for ${id}?`)) return;
  try {
    const res = await fetch(`${API_URL}/admin/employees/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchAdminData();
    }
  } catch (e) {
    alert("Error deleting employee");
  }
}

window.showAddEmployeeModal = async function () {
  const container = document.getElementById('modalContainer');

  container.innerHTML = `
    <div class="modal-overlay" id="addEmpModal" style="align-items: flex-start; padding-top: 5vh;">
      <div class="modal-content glass-panel" style="margin: 0 auto; padding: 1.5rem; max-width: 800px; text-align:left; animation: fadeInDown 0.3s ease;">
        <h2 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; font-size: 1.5rem;">Add New Employee Data</h2>
        
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;">
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.8rem; margin-bottom:0.25rem;">Employee ID</label>
            <input type="text" id="add_id" class="input-field" style="margin-bottom:0; padding:0.5rem; font-size:0.85rem;" placeholder="">
          </div>
          <div class="form-group" style="margin-bottom:0; grid-column: span 2;">
            <label style="font-size:0.8rem; margin-bottom:0.25rem;">Employee Name</label>
            <input type="text" id="add_name" class="input-field" style="margin-bottom:0; padding:0.5rem; font-size:0.85rem;" placeholder="">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.8rem; margin-bottom:0.25rem;">Department</label>
            <input type="text" id="add_dept" class="input-field" style="margin-bottom:0; padding:0.5rem; font-size:0.85rem;" placeholder="">
          </div>
          
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.8rem; margin-bottom:0.25rem;">Experience (Yrs)</label>
            <input type="number" id="add_exp" class="input-field" style="margin-bottom:0; padding:0.5rem; font-size:0.85rem;" placeholder="">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.8rem; margin-bottom:0.25rem;">Technical Score</label>
            <input type="number" id="add_tech" class="input-field" style="margin-bottom:0; padding:0.5rem; font-size:0.85rem;" placeholder="">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.8rem; margin-bottom:0.25rem;">Leadership Score</label>
            <input type="number" id="add_lead" class="input-field" style="margin-bottom:0; padding:0.5rem; font-size:0.85rem;" placeholder="">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.8rem; margin-bottom:0.25rem;">Communication</label>
            <input type="number" id="add_comm" class="input-field" style="margin-bottom:0; padding:0.5rem; font-size:0.85rem;" placeholder="">
          </div>
          
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.8rem; margin-bottom:0.25rem;">Teamwork Score</label>
            <input type="number" id="add_team" class="input-field" style="margin-bottom:0; padding:0.5rem; font-size:0.85rem;" placeholder="">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.8rem; margin-bottom:0.25rem;">Work Hours</label>
            <input type="number" id="add_hours" class="input-field" style="margin-bottom:0; padding:0.5rem; font-size:0.85rem;" placeholder="">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label style="font-size:0.8rem; margin-bottom:0.25rem;">Overtime</label>
            <input type="number" id="add_overtime" class="input-field" style="margin-bottom:0; padding:0.5rem; font-size:0.85rem;" placeholder="">
          </div>
        </div>
        
        <div id="modalError" style="color:#ef4444; margin-top:0.75rem; display:none; font-weight: 500; font-size:0.85rem;"></div>
        
        <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:1.5rem;">
          <button class="btn btn-secondary" style="padding: 0.5rem 1rem;" onclick="closeAddEmployeeModal()">Cancel</button>
          <button class="btn btn-primary" style="padding: 0.5rem 1rem;" onclick="submitNewEmployee()">Save Data</button>
        </div>
      </div>
    </div>
  `;
}

window.closeAddEmployeeModal = function () {
  document.getElementById('modalContainer').innerHTML = '';
}

window.submitNewEmployee = async function () {
  let companyAvg = 0;
  try {
    const res = await fetch(`${API_URL}/metrics/home`);
    if (res.ok) {
      const data = await res.json();
      companyAvg = data.average_overall || 0;
    }
  } catch (e) { }

  let t = parseFloat(document.getElementById('add_tech').value) || 0;
  let l = parseFloat(document.getElementById('add_lead').value) || 0;
  let c = parseFloat(document.getElementById('add_comm').value) || 0;
  let tm = parseFloat(document.getElementById('add_team').value) || 0;
  let overallScore = (((t + l + c + tm) / 400) * 5);
  overallScore = Math.round(Math.min(Math.max(overallScore, 0), 5));

  let liveCategory = "Needs Improvement";
  if (parseFloat(overallScore) > companyAvg) {
    liveCategory = "Good Performer";
  } else if (Math.abs(parseFloat(overallScore) - companyAvg) < 0.01) {
    liveCategory = "Average Performer";
  } else {
    liveCategory = "Needs Improvement";
  }

  const payload = {
    id: document.getElementById('add_id').value,
    name: document.getElementById('add_name').value,
    department: document.getElementById('add_dept').value,
    experience: document.getElementById('add_exp').value,
    technical: document.getElementById('add_tech').value,
    leadership: document.getElementById('add_lead').value,
    communication: document.getElementById('add_comm').value,
    teamwork: document.getElementById('add_team').value,
    overall: overallScore,
    work_hours: document.getElementById('add_hours').value,
    overtime: document.getElementById('add_overtime').value,
    performance_category: liveCategory
  };

  try {
    const res = await fetch(`${API_URL}/admin/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (data.warnings && data.warnings.length > 0) {
        const warnSection = document.getElementById('warningsSection');
        const warnList = document.getElementById('warningsList');
        if (warnSection && warnList) {
          warnSection.style.display = 'block';
          warnList.innerHTML += data.warnings.map(w => `<div>• ${w}</div>`).join('');
        }
        alert("Employee added successfully, but with warnings. Please check the dashboard.");
      } else {
        alert("Employee data successfully added!");
      }
      closeAddEmployeeModal();
      fetchAdminData();
    } else {
      const errEl = document.getElementById('modalError');
      errEl.innerHTML = `<i data-feather="alert-circle" style="width:14px; height:14px;"></i> Error: ` + (data.error || "Failed to add employee");
      errEl.style.display = 'block';
      if (window.feather) feather.replace();
    }
  } catch (e) {
    const errEl = document.getElementById('modalError');
    errEl.innerHTML = `<i data-feather="alert-circle" style="width:14px; height:14px;"></i> Network error. Please check your connection.`;
    errEl.style.display = 'block';
    if (window.feather) feather.replace();
  }
}

window.showMissingDataIds = async function () {
  try {
    const res = await fetch(`${API_URL}/admin/missing-data-ids`);
    const data = await res.json();
    if (res.ok && data.success) {
      const modal = document.getElementById('missingIdsModal');
      const list = document.getElementById('missingIdsList');
      if (data.ids.length > 0) {
        list.innerHTML = data.ids.map(id => `<div>• ${id}</div>`).join('');
      } else {
        list.innerHTML = "No missing data found.";
      }
      modal.style.display = 'flex';
    }
  } catch (e) {
    alert("Error fetching missing IDs.");
  }
}

window.exportToPDF = async function () {
  try {
    const res = await fetch(`${API_URL}/admin/employees`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      alert("Could not fetch latest data for PDF.");
      return;
    }
    
    const employees = data.data;
    employees.sort((a, b) => {
      let numA = parseInt((a.id.match(/\d+/) || [0])[0], 10);
      let numB = parseInt((b.id.match(/\d+/) || [0])[0], 10);
      return numA - numB;
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape

    // Title
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("SEPTAS - Employee Performance Report", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = [
      "ID", "Name", "Dept", "Exp", "Tech", "Lead", "Comm", "Team", "Rating", "Hours", "Overtime", "Category"
    ];
    const tableRows = [];

    employees.forEach(emp => {
      const empData = [
        emp.id,
        emp.name,
        emp.department,
        emp.experience ?? 'N/A',
        emp.technical ?? 'N/A',
        emp.leadership ?? 'N/A',
        emp.communication ?? 'N/A',
        emp.teamwork ?? 'N/A',
        emp.overall ?? 'N/A',
        emp.work_hours ?? 'N/A',
        emp.overtime ?? 'N/A',
        emp.performance_category
      ];
      tableRows.push(empData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 }
      }
    });

    doc.save(`SEPTAS_Employee_Report_${new Date().getTime()}.pdf`);
  } catch (err) {
    console.error(err);
    alert("An error occurred during PDF generation.");
  }
}

window.saveAdminSettings = async function () {
  const payload = {
    topPerformerThreshold: document.getElementById('topThreshold').value,
    powerBiLink: document.getElementById('pbiLink').value
  };

  try {
    await fetch(`${API_URL}/admin/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const alertEl = document.getElementById('adminSaveAlert');
    alertEl.style.display = 'block';
    setTimeout(() => { alertEl.style.display = 'none'; }, 3000);
  } catch (e) {
    alert("Error saving settings.");
  }
}

window.clearEmployeeData = async function () {
  if (confirm('Are you sure you want to clear all employee records?')) {
    try {
      await fetch(`${API_URL}/admin/clear`, { method: 'POST' });
      document.getElementById('uploadStatus').textContent = 'Currently tracking: 0 active employee records.';
    } catch (e) {
      alert("Failed to clear data.");
    }
  }
}

window.handleExcelUpload = async function (event) {
  const file = event.target.files[0];
  if (!file) return;

  document.getElementById('uploadStatus').textContent = 'Uploading...';
  const warnSection = document.getElementById('warningsSection');
  const warnList = document.getElementById('warningsList');
  if (warnSection) warnSection.style.display = 'none';
  if (warnList) warnList.innerHTML = '';

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${API_URL}/admin/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok && data.success) {
      document.getElementById('uploadStatus').textContent =
        'Currently tracking: ' + data.count + ' active employee records.';
      event.target.value = '';

      const warnSection = document.getElementById('warningsSection');
      const warnList = document.getElementById('warningsList');

      if (data.warnings && data.warnings.length > 0) {
        warnSection.style.display = 'block';
        warnList.innerHTML = data.warnings.map(w => `<div>• ${w}</div>`).join('');
        alert('Employee records imported with some warnings. Please check the dashboard.');
      } else {
        warnSection.style.display = 'none';
        alert('Employee records imported successfully!');
      }
    } else {
      alert('Error: ' + (data.error || "Unknown error during upload"));
      document.getElementById('uploadStatus').textContent = 'Upload failed: ' + (data.error || "Check file format");
      event.target.value = '';
    }
  } catch (e) {
    alert('Network error during upload. Is the backend running?');
    document.getElementById('uploadStatus').textContent = 'Network error.';
    event.target.value = '';
  }
}

function renderEmployeeLogin() {
  appContainer.innerHTML = `
    <div style="min-height: 75vh; display: flex; align-items: center; justify-content: center;">
      <div class="glass-panel" style="padding: 4rem 3rem; position: relative; width: 100%; max-width: 500px; margin: 0; border-radius: 24px;">
        <div style="margin-bottom: 2rem; color: var(--accent);"><i data-feather="user" style="width: 48px; height: 48px;"></i></div>
        <h2 class="panel-title" style="font-size: 2rem; margin-bottom: 0.5rem;">Employee Login</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2.5rem;">Access your personal performance dashboard.</p>
        
        <input type="text" id="empId" class="input-field" placeholder="Enter Employee ID" autocomplete="off" style="font-size: 1.1rem; padding: 1.2rem; margin-bottom: 1rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color);">
        <div class="password-wrapper" style="margin-bottom: 2rem;">
          <input type="password" id="empPassword" class="input-field" placeholder="Enter Unique Password" autocomplete="new-password" style="font-size: 1.1rem; padding: 1.2rem; margin-bottom: 0; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color);">
          <button type="button" class="toggle-password" onclick="toggleVisibility('empPassword', this)" style="right: 1rem;">
            <i data-feather="eye"></i>
          </button>
        </div>
        <button class="btn btn-primary btn-block" onclick="verifyEmployee()" style="padding: 1.1rem; font-size: 1.1rem; justify-content: center;">
          <i data-feather="bar-chart-2"></i> View Performance
        </button>
        <div id="empLoginError" class="alert alert-error" style="margin-top: 1.5rem; display: none;">Invalid ID or Password combination.</div>
        
        <div style="margin-top: 2rem;">
          <a href="#" onclick="navigateTo('reports-hub'); return false;" style="color: var(--text-secondary); text-decoration: none; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 0.5rem; transition: color 0.3s ease;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-secondary)'">
            <i data-feather="arrow-left" style="width: 16px;"></i> Back to Portal Hub
          </a>
        </div>
      </div>
    </div>
  `;
}

window.verifyEmployee = async function () {
  const eid = document.getElementById('empId').value.trim();
  const pwd = document.getElementById('empPassword').value.trim();

  try {
    const res = await fetch(`${API_URL}/employee/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: eid, password: pwd })
    });

    const json = await res.json();
    if (res.ok && json.success) {
      navigateTo('employee-dashboard', { employee: json.data });
    } else {
      document.getElementById('empLoginError').style.display = 'block';
    }
  } catch (e) {
    document.getElementById('empLoginError').textContent = "Network error. Backend down.";
    document.getElementById('empLoginError').style.display = 'block';
  }
}

window.toggleVisibility = function (inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i data-feather="eye-off"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i data-feather="eye"></i>';
  }
  if (window.feather) feather.replace();
}

async function renderEmployeeDashboard(emp) {
  if (!emp) {
    navigateTo('home');
    return;
  }

  let companyAvg = 0;
  try {
    const res = await fetch(`${API_URL}/metrics/home`);
    if (res.ok) {
      const metrics = await res.json();
      companyAvg = metrics.average_overall;
    }
  } catch (err) {
    companyAvg = 70.0;
  }

  const skills = [
    { name: 'Technical', score: emp.technical },
    { name: 'Communication', score: emp.communication },
    { name: 'Leadership', score: emp.leadership },
    { name: 'Teamwork', score: emp.teamwork }
  ];

  const sortedSkills = [...skills].sort((a, b) => b.score - a.score);

  const strongSkills = sortedSkills.filter(s => s.score > 50).slice(0, 2).map(s => s.name);

  let weakSkillsList = sortedSkills.filter(s => s.score < 50).map(s => s.name);
  if (weakSkillsList.length === 0) {
    weakSkillsList = [sortedSkills[sortedSkills.length - 1].name];
  }

  let perfSummaryHtml = "";
  if (strongSkills.length === 0) {
    perfSummaryHtml = `<span style="color: #ef4444; font-weight: 500;">All skills</span> are in need of improvement.`;
  } else {
    let strongNames = strongSkills.map(s => `<strong style="color: #3b82f6; font-style: italic; font-weight: 600;">${s}</strong>`).join(' and ');
    let weakNames = weakSkillsList.map(s => `<strong style="color: #ef4444; font-style: italic; font-weight: 600;">${s}</strong>`).join(', ');
    perfSummaryHtml = `Strong ${strongNames} performance.<br><span style="color: #ef4444; font-style: italic;">${weakNames}</span> is the main improvement area.`;
  }

  const bestSkill = sortedSkills[0];
  const weakestSkill = sortedSkills[sortedSkills.length - 1];

  let perfLevel = emp.performance_category || 'Stable Performer';
  let promotionPotential = "Low";
  let potColor = "#ef4444";
  if (emp.overall > companyAvg + 0.1) {
    promotionPotential = "High";
    potColor = "#10b981";
  } else if (emp.overall >= companyAvg - 0.2 && emp.overall <= companyAvg + 0.1) {
    promotionPotential = "Stable";
    potColor = "#f59e0b";
  }

  let neededPoints = (companyAvg / 5) * 400 - (emp.technical + emp.communication + emp.leadership + emp.teamwork);
  let recText = "";
  if (neededPoints <= 0) {
    recText = `Maintain your current performance across all skills to stay above the company average.`;
  } else {
    let skillsToImprove = [];
    let pointsToCover = neededPoints;
    let sortedAsc = [...skills].sort((a, b) => a.score - b.score);
    for (let s of sortedAsc) {
      if (pointsToCover <= 0) break;
      let room = 100 - s.score;
      if (room > 0) {
        skillsToImprove.push(s.name);
        pointsToCover -= room;
      }
    }
    if (skillsToImprove.length === 0) {
      skillsToImprove = [sortedAsc[0].name, sortedAsc[1].name].filter(Boolean);
    }
    let skillsStr = skillsToImprove.length > 1
      ? skillsToImprove.slice(0, -1).map(s => `<strong>${s}</strong>`).join(', ') + ' and <strong>' + skillsToImprove[skillsToImprove.length - 1] + '</strong>'
      : `<strong>${skillsToImprove[0] || 'your skills'}</strong>`;

    recText = `Focus on ${skillsStr} to improve promotion readiness.`;
  }

  const MARGIN = 0.2;
  if (emp.overall < companyAvg && emp.overall >= companyAvg - MARGIN) {
    perfLevel = "Stable Performer";
  }

  let headerMessage = '';
  if (emp.overall > companyAvg) {
    headerMessage = `<div style="color: #10b981; font-size: 1.2rem; font-weight: 500; margin-bottom: 0.5rem; display:flex; align-items:center; justify-content:center; gap:0.5rem;"><i data-feather="star" fill="#10b981" style="color:#10b981;"></i> Status: ${perfLevel}</div>`;
  } else if (emp.overall < companyAvg - MARGIN) {
    headerMessage = `<div style="color: #ef4444; font-size: 1.2rem; font-weight: 500; margin-bottom: 0.5rem; display:flex; align-items:center; justify-content:center; gap:0.5rem;"><i data-feather="alert-triangle" style="color:#ef4444;"></i> Status: ${perfLevel}</div>`;
  } else {
    headerMessage = `<div style="color: #3b82f6; font-size: 1.2rem; font-weight: 500; margin-bottom: 0.5rem; display:flex; align-items:center; justify-content:center; gap:0.5rem;"><i data-feather="activity" style="color:#3b82f6;"></i> Status: ${perfLevel}</div>`;
  }

  let comparisonLabel = 'Average';
  let comparisonColor = 'var(--text-secondary)';
  let comparisonRGB = '148, 163, 184';
  let comparisonIcon = 'minus';

  if (emp.overall > companyAvg) {
    comparisonLabel = 'Above Average';
    comparisonColor = '#10b981';
    comparisonRGB = '16, 185, 129';
    comparisonIcon = 'trending-up';
  } else if (emp.overall < companyAvg - MARGIN) {
    comparisonLabel = 'Below Average';
    comparisonColor = '#ef4444';
    comparisonRGB = '239, 68, 68';
    comparisonIcon = 'trending-down';
  } else if (emp.overall < companyAvg) {
    comparisonLabel = 'Slightly Below Average';
    comparisonColor = '#f59e0b';
    comparisonRGB = '245, 158, 11';
    comparisonIcon = 'minus';
  }

  appContainer.innerHTML = `
    <div class="employee-header" style="margin-bottom: 3rem;">
      <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 700;">Welcome back, ${emp.name}</h1>
      <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 1rem;">Employee ID: ${emp.id} &nbsp;|&nbsp; Department: ${emp.department || 'General'}</p>
      ${headerMessage}
    </div>
    
    <div style="display: flex; flex-wrap: wrap; gap: 3rem; align-items: flex-start; margin-bottom: 3rem;">
      <!-- Insights Panel -->
      <div class="glass-panel" style="flex: 1; min-width: 300px; max-width: 350px; margin: 0; display: flex; flex-direction: column; text-align: left; font-family: var(--font-family); padding: 2rem;">
        
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1.5rem; margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i data-feather="award" style="color: var(--accent);"></i>
            <h3 style="font-size: 1.25rem; color: var(--text-primary); margin: 0; font-weight: 700;">Promotion Potential</h3>
          </div>
          <span style="padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600; border: 1px solid ${potColor}; color: ${potColor}; background: rgba(239,68,68,0.05);">${promotionPotential}</span>
        </div>

        <div>
          <h4 style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Performance Summary</h4>
          <p style="color: var(--text-primary); font-size: 0.95rem; line-height: 1.6; margin: 0 0 2rem 0;">
            ${perfSummaryHtml}
          </p>
        </div>

        <div>
          <h4 style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Key Insights</h4>
          <ul style="list-style: none; padding:0; margin:0 0 2rem 0; color: var(--text-primary); font-size: 0.95rem; line-height: 2;">
            <li style="display:flex; align-items:center; gap:0.75rem;"><i data-feather="check-circle" style="width:18px; color:#10b981;"></i> Best skill: <strong style="margin-left:0.25rem;">${bestSkill.name}</strong></li>
            <li style="display:flex; align-items:center; gap:0.75rem;"><i data-feather="alert-circle" style="width:18px; color:#ef4444;"></i> Weakest skill: <strong style="margin-left:0.25rem;">${weakestSkill.name}</strong></li>
            <li style="display:flex; align-items:center; gap:0.75rem;"><i data-feather="activity" style="width:18px; color:#3b82f6;"></i> Level: <strong style="margin-left:0.25rem;">${perfLevel}</strong></li>
          </ul>
        </div>

        <div>
          <h4 style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Recommendation</h4>
          <div style="background: rgba(15, 23, 42, 0.4); border-left: 3px solid var(--accent); padding: 1.25rem; border-radius: 0 4px 4px 0;">
            <p style="color: var(--text-primary); font-size: 0.95rem; line-height: 1.6; margin:0;">
              ${recText}
            </p>
          </div>
        </div>

      </div>

      <!-- Core Metrics Grid -->
      <div class="metrics-grid" style="flex: 2; min-width: 400px; display: flex; flex-direction: column; gap: 2rem;">
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem;">
          <div class="metric-card metric-technical" style="margin:0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1rem;">
              <h3 style="margin: 0; color: var(--text-secondary); font-size: 1rem; font-weight: 600;">Technical Score</h3>
              <div class="metric-value" style="font-size: 1.5rem;">${emp.technical}</div>
            </div>
            <div class="progress-bar-container" style="height: 8px; border-radius: 4px;">
              <div class="progress-bar" id="pb-tech"></div>
            </div>
          </div>
          
          <div class="metric-card metric-communication" style="margin:0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1rem;">
              <h3 style="margin: 0; color: var(--text-secondary); font-size: 1rem; font-weight: 600;">Communication Score</h3>
              <div class="metric-value" style="font-size: 1.5rem;">${emp.communication}</div>
            </div>
            <div class="progress-bar-container" style="height: 8px; border-radius: 4px;">
              <div class="progress-bar" id="pb-comm"></div>
            </div>
          </div>
          
          <div class="metric-card metric-leadership" style="margin:0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1rem;">
              <h3 style="margin: 0; color: var(--text-secondary); font-size: 1rem; font-weight: 600;">Leadership Score</h3>
              <div class="metric-value" style="font-size: 1.5rem;">${emp.leadership}</div>
            </div>
            <div class="progress-bar-container" style="height: 8px; border-radius: 4px;">
              <div class="progress-bar" id="pb-lead"></div>
            </div>
          </div>
          
          <div class="metric-card metric-teamwork" style="margin:0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1rem;">
              <h3 style="margin: 0; color: var(--text-secondary); font-size: 1rem; font-weight: 600;">Teamwork Score</h3>
              <div class="metric-value" style="font-size: 1.5rem;">${emp.teamwork}</div>
            </div>
            <div class="progress-bar-container" style="height: 8px; border-radius: 4px;">
              <div class="progress-bar" id="pb-team"></div>
            </div>
          </div>
        </div>
        
        <div class="metric-card metric-overall" style="margin:0; padding: 2rem; display: flex; align-items: stretch; flex-wrap: wrap; gap: 2rem;">
          
          <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; justify-content: center;">
            <h3 style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1rem; text-align: left; font-weight: 600;">Overall Rating</h3>
            <div style="display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: 1.5rem;">
              <span style="font-size: 4rem; font-weight: 800; color: var(--text-primary); line-height: 1;">${emp.overall}</span>
              <span style="font-size: 1.5rem; color: var(--text-secondary); font-weight: 500;">/ 5</span>
            </div>
            <div class="progress-bar-container" style="height: 8px; border-radius: 4px; margin-bottom: 0;">
              <div class="progress-bar" id="pb-overall"></div>
            </div>
          </div>

          <div style="flex: 1; min-width: 250px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; display: flex; flex-direction: column; justify-content: center;">
            <h4 style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem; text-transform: uppercase; font-weight: 600;">Performance Comparison</h4>
            
            <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <div>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Your Average</p>
                <p style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin:0;">${emp.overall}</p>
              </div>
              <div style="height: 40px; width: 1px; background: rgba(255,255,255,0.1);"></div>
              <div>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Company Avg</p>
                <p style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin:0;">${companyAvg}</p>
              </div>
            </div>
            
            <div style="display:flex; align-items:center; gap: 0.5rem; color: ${comparisonColor}; font-weight: 600; font-size: 0.95rem; background: rgba(0, 0, 0, 0.2); padding: 0.75rem; border-radius: 8px; justify-content: center; border: 1px solid rgba(${comparisonRGB}, 0.2);">
               <i data-feather="${comparisonIcon}" style="width: 18px; height: 18px;"></i> ${comparisonLabel}
            </div>
          </div>

        </div>

      </div>
    </div>
    
    <div style="text-align: center; margin-top: 1rem;">
      <button class="btn btn-secondary" onclick="navigateTo('home')" style="padding: 0.75rem 2rem;">Back to Home</button>
    </div>
  `;

  setTimeout(() => {
    if (window.feather) feather.replace();
    if (document.getElementById('pb-tech')) document.getElementById('pb-tech').style.width = emp.technical + '%';
    if (document.getElementById('pb-comm')) document.getElementById('pb-comm').style.width = emp.communication + '%';
    if (document.getElementById('pb-lead')) document.getElementById('pb-lead').style.width = emp.leadership + '%';
    if (document.getElementById('pb-team')) document.getElementById('pb-team').style.width = emp.teamwork + '%';
    if (document.getElementById('pb-overall')) document.getElementById('pb-overall').style.width = (emp.overall / 5 * 100) + '%';
  }, 100);
}

async function renderPowerBI() {
  let link = '';
  try {
    const res = await fetch(`${API_URL}/admin/config`);
    const state = await res.json();
    link = state.powerBiLink || '';
  } catch (e) {
    console.error(e);
  }

  document.body.classList.add('fullscreen-mode');

  if (!link) {
    appContainer.innerHTML = `
      <div class="no-data">
        <h2><i data-feather="alert-circle" style="width: 48px; height: 48px; margin-bottom: 1rem; color: var(--accent);"></i></h2>
        <h2 style="margin-bottom: 1rem;">No Dashboard Configured</h2>
        <p>The system administrator has not configured a Power BI dashboard link yet.</p>
        <button class="btn btn-primary" style="margin-top:2rem;" onclick="navigateTo('home')">Return Home</button>
      </div>
    `;
    setTimeout(() => { if (window.feather) feather.replace(); }, 50);
    return;
  }

  appContainer.innerHTML = `
    <div class="powerbi-fullscreen">
      <button class="floating-back-btn" title="Return to SEPTAS" onclick="navigateTo('home')">
        <i data-feather="arrow-left"></i>
      </button>
      <iframe title="Power BI Dashboard" src="${link}" allowFullScreen="true"></iframe>
    </div>
  `;
  setTimeout(() => { if (window.feather) feather.replace(); }, 50);
}

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = document.body.getAttribute('data-theme');
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.outerHTML = `<i data-feather="${savedTheme === 'light' ? 'sun' : 'moon'}" id="themeIcon"></i>`;
  }

  setTimeout(() => {
    if (window.feather) feather.replace();
  }, 50);

  navigateTo('home');
});
