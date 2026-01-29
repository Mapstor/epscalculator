/* EPS CALCULATOR - JAVASCRIPT */

document.addEventListener('DOMContentLoaded', init);

function init() {
  setupTabs();
  setupCalculateButtons();
  setupFAQ();
  setupMobileNav();
}

function setupTabs() {
  document.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + tabId).classList.add('active');
    });
  });
}

function setupCalculateButtons() {
  document.getElementById('calc-basic-btn')?.addEventListener('click', calculateBasicEPS);
  document.getElementById('calc-diluted-btn')?.addEventListener('click', calculateDilutedEPS);
  document.getElementById('calc-pe-btn')?.addEventListener('click', calculatePE);
  document.getElementById('calc-growth-btn')?.addEventListener('click', calculateGrowth);
}

// TAB 1: BASIC EPS
function calculateBasicEPS() {
  const netIncome = parseFloat(document.getElementById('net-income')?.value) || 0;
  const preferredDiv = parseFloat(document.getElementById('preferred-div')?.value) || 0;
  const sharesOutstanding = parseFloat(document.getElementById('shares-outstanding')?.value) || 0;

  if (sharesOutstanding <= 0) {
    alert('Please enter shares outstanding');
    return;
  }

  const earningsAvailable = netIncome - preferredDiv;
  const basicEPS = earningsAvailable / sharesOutstanding;

  const section = document.getElementById('basic-results');
  document.getElementById('basic-eps-value').textContent = '$' + basicEPS.toFixed(2);
  document.getElementById('earnings-available').textContent = '$' + formatNumber(earningsAvailable);
  document.getElementById('shares-display').textContent = formatNumber(sharesOutstanding);
  document.getElementById('net-income-display').textContent = '$' + formatNumber(netIncome);
  document.getElementById('pref-div-display').textContent = '$' + formatNumber(preferredDiv);

  // Input Summary Table
  document.getElementById('basic-input-income').textContent = '$' + formatNumber(netIncome);
  document.getElementById('basic-input-prefdiv').textContent = '$' + formatNumber(preferredDiv);
  document.getElementById('basic-input-shares').textContent = formatNumber(sharesOutstanding);

  // Dynamic interpretation
  let interpretation = '';
  if (basicEPS < 0) {
    interpretation = 'The company has a negative EPS, meaning it lost money during this period. This could indicate operational challenges or one-time charges. Compare to previous periods to understand if this is temporary.';
  } else if (basicEPS < 1) {
    interpretation = `Each share earned $${basicEPS.toFixed(2)} during this period. This is a relatively low EPS, which is normal for companies with many shares outstanding or those in early growth stages.`;
  } else if (basicEPS < 5) {
    interpretation = `Each share earned $${basicEPS.toFixed(2)} during this period. This is a moderate EPS typical of established companies. Compare to the stock price (P/E ratio) and previous periods for context.`;
  } else {
    interpretation = `Each share earned $${basicEPS.toFixed(2)} during this period. This is a strong EPS, suggesting solid profitability. Verify this is sustainable and not from one-time gains.`;
  }
  document.getElementById('basic-interpretation-text').textContent = interpretation;

  section.classList.add('visible');
}

// TAB 2: DILUTED EPS
function calculateDilutedEPS() {
  const netIncome = parseFloat(document.getElementById('diluted-net-income')?.value) || 0;
  const preferredDiv = parseFloat(document.getElementById('diluted-preferred-div')?.value) || 0;
  const sharesOutstanding = parseFloat(document.getElementById('diluted-shares')?.value) || 0;
  const convertibleSecurities = parseFloat(document.getElementById('convertible-securities')?.value) || 0;

  if (sharesOutstanding <= 0) {
    alert('Please enter shares outstanding');
    return;
  }

  const earningsAvailable = netIncome - preferredDiv;
  const basicEPS = earningsAvailable / sharesOutstanding;
  const dilutedShares = sharesOutstanding + convertibleSecurities;
  const dilutedEPS = earningsAvailable / dilutedShares;
  const dilutionEffect = ((basicEPS - dilutedEPS) / Math.abs(basicEPS)) * 100;
  const epsReduction = basicEPS - dilutedEPS;
  const sharesDiff = convertibleSecurities;

  const section = document.getElementById('diluted-results');
  document.getElementById('diluted-eps-value').textContent = '$' + dilutedEPS.toFixed(2);
  document.getElementById('basic-eps-compare').textContent = '$' + basicEPS.toFixed(2);
  document.getElementById('diluted-shares-display').textContent = formatNumber(dilutedShares);
  document.getElementById('dilution-effect').textContent = dilutionEffect.toFixed(1) + '%';
  document.getElementById('eps-reduction').textContent = '$' + epsReduction.toFixed(2);

  // Dilution indicator bar (cap at 25% for visual)
  const barWidth = Math.min(Math.abs(dilutionEffect) * 4, 100); // 25% = 100% width
  const dilutionBar = document.getElementById('dilution-bar');
  dilutionBar.style.width = barWidth + '%';
  dilutionBar.classList.remove('low', 'medium', 'high', 'neutral');
  if (dilutionEffect < 5) {
    dilutionBar.classList.add('low');
  } else if (dilutionEffect < 10) {
    dilutionBar.classList.add('medium');
  } else {
    dilutionBar.classList.add('high');
  }

  // Comparison table
  document.getElementById('comp-basic-eps').textContent = '$' + basicEPS.toFixed(2);
  document.getElementById('comp-diluted-eps').textContent = '$' + dilutedEPS.toFixed(2);
  document.getElementById('comp-eps-diff').textContent = '-$' + epsReduction.toFixed(2);
  document.getElementById('comp-basic-shares').textContent = formatNumber(sharesOutstanding);
  document.getElementById('comp-diluted-shares').textContent = formatNumber(dilutedShares);
  document.getElementById('comp-shares-diff').textContent = '+' + formatNumber(sharesDiff);

  // Dynamic interpretation
  let interpretation = '';
  if (dilutionEffect < 3) {
    interpretation = `Dilution is minimal at ${dilutionEffect.toFixed(1)}%. The potential conversion of options, warrants, or convertibles would have little impact on shareholder value. This is a positive sign.`;
  } else if (dilutionEffect < 10) {
    interpretation = `Dilution of ${dilutionEffect.toFixed(1)}% is moderate. There are ${formatNumber(convertibleSecurities)} potential shares from dilutive securities. Monitor future grants and conversions.`;
  } else if (dilutionEffect < 20) {
    interpretation = `Dilution of ${dilutionEffect.toFixed(1)}% is significant. If all convertible securities are exercised, existing shareholders would see meaningful EPS reduction. Review SEC filings for compensation plans.`;
  } else {
    interpretation = `Dilution of ${dilutionEffect.toFixed(1)}% is very high. This level of potential dilution could substantially impact future shareholder value. Investigate the source of dilutive securities.`;
  }
  document.getElementById('diluted-interpretation-text').textContent = interpretation;

  section.classList.add('visible');
}

// TAB 3: P/E RATIO
function calculatePE() {
  const stockPrice = parseFloat(document.getElementById('stock-price')?.value) || 0;
  const eps = parseFloat(document.getElementById('pe-eps')?.value) || 0;

  if (eps === 0) {
    alert('EPS cannot be zero');
    return;
  }

  const peRatio = stockPrice / eps;
  const earningsYield = (eps / stockPrice) * 100;

  // Interpretation label
  let interpretationLabel = '';
  if (peRatio < 0) {
    interpretationLabel = 'Negative P/E (company has losses)';
  } else if (peRatio < 10) {
    interpretationLabel = 'Low P/E - potentially undervalued or slow growth';
  } else if (peRatio < 20) {
    interpretationLabel = 'Average P/E - fairly valued';
  } else if (peRatio < 30) {
    interpretationLabel = 'Above average P/E - growth stock or overvalued';
  } else {
    interpretationLabel = 'High P/E - high growth expectations or overvalued';
  }

  const section = document.getElementById('pe-results');
  document.getElementById('pe-value').textContent = peRatio.toFixed(2);
  document.getElementById('pe-interpretation').textContent = interpretationLabel;
  document.getElementById('earnings-yield').textContent = earningsYield.toFixed(2) + '%';
  document.getElementById('pe-stock-price').textContent = '$' + stockPrice.toFixed(2);
  document.getElementById('pe-eps-display').textContent = '$' + eps.toFixed(2);

  // Calculate fair values at different P/E ratios
  const fair10 = eps * 10;
  const fair15 = eps * 15;
  const fair20 = eps * 20;
  const fair25 = eps * 25;
  const fair30 = eps * 30;

  document.getElementById('fair-10').textContent = '$' + fair10.toFixed(2);
  document.getElementById('fair-15').textContent = '$' + fair15.toFixed(2);
  document.getElementById('fair-20').textContent = '$' + fair20.toFixed(2);
  document.getElementById('fair-25').textContent = '$' + fair25.toFixed(2);
  document.getElementById('fair-30').textContent = '$' + fair30.toFixed(2);

  // Calculate differences from current price
  const formatDiff = (fairValue) => {
    const diff = fairValue - stockPrice;
    const pct = (diff / stockPrice) * 100;
    const sign = diff >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(0)}%`;
  };

  document.getElementById('fair-10-diff').textContent = formatDiff(fair10);
  document.getElementById('fair-15-diff').textContent = formatDiff(fair15);
  document.getElementById('fair-20-diff').textContent = formatDiff(fair20);
  document.getElementById('fair-25-diff').textContent = formatDiff(fair25);
  document.getElementById('fair-30-diff').textContent = formatDiff(fair30);

  // P/E marker position (0 = left edge, 40+ = right edge)
  const markerPosition = Math.min(Math.max(peRatio, 0) / 40 * 100, 100);
  document.getElementById('pe-marker').style.left = markerPosition + '%';

  // Dynamic interpretation
  let peInterpret = '';
  const interpretBox = document.getElementById('pe-interpret-box');
  interpretBox.classList.remove('success', 'warning', 'error');

  if (peRatio < 0) {
    peInterpret = `A negative P/E of ${peRatio.toFixed(2)} indicates the company is currently unprofitable. The P/E ratio is not meaningful for loss-making companies. Focus on other metrics like price-to-sales or path to profitability.`;
    interpretBox.classList.add('warning');
  } else if (peRatio < 10) {
    peInterpret = `A P/E of ${peRatio.toFixed(2)} is below the market average. This could indicate the stock is undervalued, or investors have concerns about future growth. The earnings yield of ${earningsYield.toFixed(2)}% is attractive compared to bond yields.`;
    interpretBox.classList.add('success');
  } else if (peRatio < 20) {
    peInterpret = `A P/E of ${peRatio.toFixed(2)} is near the historical S&P 500 average of ~15-17. The stock appears fairly valued based on current earnings. Compare to sector peers and growth rate for better context.`;
  } else if (peRatio < 30) {
    peInterpret = `A P/E of ${peRatio.toFixed(2)} is above average, suggesting investors expect above-average growth. Ensure the company's growth rate justifies this premium valuation. Consider the PEG ratio.`;
    interpretBox.classList.add('warning');
  } else {
    peInterpret = `A P/E of ${peRatio.toFixed(2)} is high, implying very strong growth expectations. This valuation requires significant earnings growth to justify. Be cautious of valuation risk if growth disappoints.`;
    interpretBox.classList.add('error');
  }
  document.getElementById('pe-interpret-text').textContent = peInterpret;

  section.classList.add('visible');
}

// TAB 4: EPS GROWTH
function calculateGrowth() {
  const currentEPS = parseFloat(document.getElementById('current-eps')?.value) || 0;
  const previousEPS = parseFloat(document.getElementById('previous-eps')?.value) || 0;
  const years = parseFloat(document.getElementById('growth-years')?.value) || 1;

  if (previousEPS === 0) {
    alert('Previous EPS cannot be zero');
    return;
  }

  // Simple growth rate
  const growthRate = ((currentEPS - previousEPS) / Math.abs(previousEPS)) * 100;

  // CAGR if multiple years
  let cagr = 0;
  let rateForProjections = growthRate;
  if (years > 1 && previousEPS > 0 && currentEPS > 0) {
    cagr = (Math.pow(currentEPS / previousEPS, 1 / years) - 1) * 100;
    rateForProjections = cagr;
  }

  const section = document.getElementById('growth-results');
  const growthEl = document.getElementById('growth-value');
  growthEl.textContent = (growthRate >= 0 ? '+' : '') + growthRate.toFixed(1) + '%';
  growthEl.className = 'result-value ' + (growthRate >= 0 ? 'result-positive' : 'result-negative');

  // Update labels based on year selection
  document.getElementById('growth-label').textContent = years > 1 ? 'Total Growth' : 'YoY Growth';
  document.getElementById('growth-sublabel').textContent = years > 1 ? `over ${years} years (CAGR: ${cagr.toFixed(1)}%)` : 'year-over-year';
  document.getElementById('cagr-value').textContent = years > 1 ? cagr.toFixed(1) + '%' : 'N/A';
  document.getElementById('current-eps-display').textContent = '$' + currentEPS.toFixed(2);
  document.getElementById('previous-eps-display').textContent = '$' + previousEPS.toFixed(2);

  // Calculate projections
  const projRate = rateForProjections / 100;
  const projY1 = currentEPS * Math.pow(1 + projRate, 1);
  const projY2 = currentEPS * Math.pow(1 + projRate, 2);
  const projY3 = currentEPS * Math.pow(1 + projRate, 3);
  const projY5 = currentEPS * Math.pow(1 + projRate, 5);
  const projY10 = currentEPS * Math.pow(1 + projRate, 10);

  document.getElementById('projected-eps').textContent = '$' + projY5.toFixed(2);

  // Projections table
  document.getElementById('proj-y1').textContent = '$' + projY1.toFixed(2);
  document.getElementById('proj-y2').textContent = '$' + projY2.toFixed(2);
  document.getElementById('proj-y3').textContent = '$' + projY3.toFixed(2);
  document.getElementById('proj-y5').textContent = '$' + projY5.toFixed(2);
  document.getElementById('proj-y10').textContent = '$' + projY10.toFixed(2);

  const formatGrowthPct = (projected) => {
    const pct = ((projected - currentEPS) / Math.abs(currentEPS)) * 100;
    return (pct >= 0 ? '+' : '') + pct.toFixed(0) + '%';
  };

  document.getElementById('proj-y1-pct').textContent = formatGrowthPct(projY1);
  document.getElementById('proj-y2-pct').textContent = formatGrowthPct(projY2);
  document.getElementById('proj-y3-pct').textContent = formatGrowthPct(projY3);
  document.getElementById('proj-y5-pct').textContent = formatGrowthPct(projY5);
  document.getElementById('proj-y10-pct').textContent = formatGrowthPct(projY10);

  // Growth marker position (-20% to +20%+ range, centered at 50%)
  // -20% = 0%, 0% = 50%, +20% = 100%
  const markerPosition = Math.min(Math.max((rateForProjections + 20) / 40 * 100, 0), 100);
  document.getElementById('growth-marker').style.left = markerPosition + '%';

  // Dynamic interpretation
  let interpretation = '';
  const effectiveRate = years > 1 ? cagr : growthRate;

  if (effectiveRate < -10) {
    interpretation = `EPS declined by ${Math.abs(effectiveRate).toFixed(1)}%${years > 1 ? ' annually' : ''}. This significant decline suggests business challenges or headwinds. Investigate the causes—is it temporary or structural?`;
  } else if (effectiveRate < 0) {
    interpretation = `EPS declined by ${Math.abs(effectiveRate).toFixed(1)}%${years > 1 ? ' annually' : ''}. A slight decline may be temporary. Check if due to one-time factors or ongoing issues.`;
  } else if (effectiveRate < 5) {
    interpretation = `EPS grew ${effectiveRate.toFixed(1)}%${years > 1 ? ' annually' : ''}, which is slow growth typical of mature, stable businesses. The company may be focused on dividends rather than reinvestment.`;
  } else if (effectiveRate < 15) {
    interpretation = `EPS grew ${effectiveRate.toFixed(1)}%${years > 1 ? ' annually' : ''}, representing moderate, healthy growth. This pace can sustainably compound shareholder value over time.`;
  } else if (effectiveRate < 25) {
    interpretation = `EPS grew ${effectiveRate.toFixed(1)}%${years > 1 ? ' annually' : ''}, indicating strong growth. The company is outperforming and gaining market share. Verify this growth is sustainable.`;
  } else {
    interpretation = `EPS grew ${effectiveRate.toFixed(1)}%${years > 1 ? ' annually' : ''}, which is exceptional growth. Be cautious—very high growth rates rarely persist long-term. Ensure it's not from one-time factors.`;
  }
  document.getElementById('growth-interpretation-text').textContent = interpretation;

  section.classList.add('visible');
}

function formatNumber(num) {
  if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

function setupFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => mobileNav.classList.toggle('active'));
  }
}
