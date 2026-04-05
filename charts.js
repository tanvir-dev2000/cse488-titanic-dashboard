/* charts.js — Titanic Dashboard Chart Initialisation */

const GRID_COLOR = 'rgba(255,255,255,0.05)';
const TICK_COLOR = '#5e5d58';
const defaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { bodyFont: { family: 'sans-serif' }, titleFont: { family: 'sans-serif' } } },
  scales: {
    x: { grid: { color: GRID_COLOR }, ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 } } },
    y: { grid: { color: GRID_COLOR }, ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 } } }
  }
};

/* ── 1. Model AUC Bar Chart ─────────────────────────────────────── */
new Chart(document.getElementById('modelChart'), {
  type: 'bar',
  data: {
    labels: ['Logistic Regression', 'Decision Tree', 'Random Forest'],
    datasets: [{
      label: 'AUC Score',
      data: [0.849, 0.624, 0.892],
      backgroundColor: ['rgba(55,138,221,0.7)', 'rgba(216,90,48,0.7)', 'rgba(29,158,117,0.7)'],
      borderColor:     ['#378ADD', '#D85A30', '#1D9E75'],
      borderWidth: 1,
      borderRadius: 4
    }]
  },
  options: {
    ...defaults,
    scales: {
      x: { grid: { color: GRID_COLOR }, ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 } } },
      y: {
        min: 0, max: 1,
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 }, callback: v => v.toFixed(2) }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: ctx => ' AUC: ' + ctx.parsed.y.toFixed(4) }
      },
      annotation: {}
    }
  }
});

/* ── 2. Feature Importance Horizontal Bar ───────────────────────── */
new Chart(document.getElementById('featChart'), {
  type: 'bar',
  data: {
    labels: ['Sex_is_male', 'Pclass', 'Fare', 'Age', 'SibSp', 'Parch', 'Embarked_S', 'Embarked_C'],
    datasets: [{
      label: 'Importance',
      data: [0.481, 0.150, 0.141, 0.088, 0.056, 0.037, 0.035, 0.012],
      backgroundColor: [
        'rgba(216,90,48,0.75)',
        'rgba(239,159,39,0.7)',
        'rgba(239,159,39,0.6)',
        'rgba(29,158,117,0.7)',
        'rgba(29,158,117,0.6)',
        'rgba(55,138,221,0.6)',
        'rgba(55,138,221,0.5)',
        'rgba(55,138,221,0.4)',
      ],
      borderColor: ['#D85A30','#EF9F27','#EF9F27','#1D9E75','#1D9E75','#378ADD','#378ADD','#378ADD'],
      borderWidth: 1,
      borderRadius: 4
    }]
  },
  options: {
    ...defaults,
    indexAxis: 'y',
    scales: {
      x: {
        min: 0,
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 }, callback: v => (v * 100).toFixed(0) + '%' }
      },
      y: { grid: { color: 'transparent' }, ticks: { color: TICK_COLOR, font: { family: 'Courier New', size: 11 } } }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' ' + (ctx.parsed.x * 100).toFixed(1) + '%' } }
    }
  }
});

/* ── 3. ROC Curves (approximated with smooth points) ───────────── */
function genROC(auc, steps = 30) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const fpr = i / steps;
    const tpr = Math.pow(fpr, Math.pow(1 - auc, 1.5) * 0.6 + 0.1) * auc + (1 - auc) * fpr;
    pts.push({ x: parseFloat(fpr.toFixed(3)), y: parseFloat(Math.min(tpr, 1).toFixed(3)) });
  }
  return pts;
}

new Chart(document.getElementById('rocChart'), {
  type: 'scatter',
  data: {
    datasets: [
      {
        label: 'Logistic Regression',
        data: genROC(0.849),
        borderColor: '#378ADD',
        backgroundColor: 'transparent',
        showLine: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2
      },
      {
        label: 'Decision Tree',
        data: genROC(0.624),
        borderColor: '#D85A30',
        backgroundColor: 'transparent',
        showLine: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2
      },
      {
        label: 'Random Forest',
        data: genROC(0.892),
        borderColor: '#1D9E75',
        backgroundColor: 'transparent',
        showLine: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2.5
      },
      {
        label: 'Baseline',
        data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        borderColor: '#5e5d58',
        backgroundColor: 'transparent',
        showLine: true,
        borderDash: [4, 4],
        pointRadius: 0,
        borderWidth: 1
      }
    ]
  },
  options: {
    ...defaults,
    scales: {
      x: {
        min: 0, max: 1,
        title: { display: true, text: 'False Positive Rate', color: TICK_COLOR, font: { family: 'sans-serif', size: 11 } },
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 }, callback: v => v.toFixed(1) }
      },
      y: {
        min: 0, max: 1,
        title: { display: true, text: 'True Positive Rate', color: TICK_COLOR, font: { family: 'sans-serif', size: 11 } },
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 }, callback: v => v.toFixed(1) }
      }
    },
    plugins: { legend: { display: false } }
  }
});

/* ── 4. Gender Doughnut ─────────────────────────────────────────── */
new Chart(document.getElementById('genderChart'), {
  type: 'doughnut',
  data: {
    labels: ['Female Survived', 'Female Died', 'Male Survived', 'Male Died'],
    datasets: [{
      data: [74.2, 25.8, 18.9, 81.1],
      backgroundColor: [
        'rgba(212,83,126,0.85)',
        'rgba(212,83,126,0.25)',
        'rgba(55,138,221,0.85)',
        'rgba(55,138,221,0.25)'
      ],
      borderColor: ['#D4537E','rgba(212,83,126,0.4)','#378ADD','rgba(55,138,221,0.4)'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' ' + ctx.label + ': ' + ctx.parsed.toFixed(1) + '%' } }
    }
  }
});

/* ── 5. Pclass Bar ──────────────────────────────────────────────── */
new Chart(document.getElementById('pclassChart'), {
  type: 'bar',
  data: {
    labels: ['1st Class', '2nd Class', '3rd Class'],
    datasets: [{
      label: 'Survival Rate',
      data: [62.96, 47.28, 24.24],
      backgroundColor: ['rgba(29,158,117,0.75)', 'rgba(239,159,39,0.7)', 'rgba(226,75,74,0.7)'],
      borderColor: ['#1D9E75', '#EF9F27', '#E24B4A'],
      borderWidth: 1,
      borderRadius: 4
    }]
  },
  options: {
    ...defaults,
    scales: {
      x: { grid: { color: GRID_COLOR }, ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 } } },
      y: {
        min: 0, max: 100,
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 }, callback: v => v + '%' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' Survival: ' + ctx.parsed.y.toFixed(1) + '%' } }
    }
  }
});

/* ── 6. Embarkation Bar ─────────────────────────────────────────── */
new Chart(document.getElementById('embarkChart'), {
  type: 'bar',
  data: {
    labels: ['Cherbourg (C)', 'Queenstown (Q)', 'Southampton (S)'],
    datasets: [{
      label: 'Survival Rate',
      data: [55.36, 38.96, 33.90],
      backgroundColor: ['rgba(127,119,221,0.75)', 'rgba(55,138,221,0.7)', 'rgba(136,135,128,0.7)'],
      borderColor: ['#7F77DD', '#378ADD', '#888780'],
      borderWidth: 1,
      borderRadius: 4
    }]
  },
  options: {
    ...defaults,
    scales: {
      x: { grid: { color: GRID_COLOR }, ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 10 } } },
      y: {
        min: 0, max: 70,
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 }, callback: v => v + '%' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' Survival: ' + ctx.parsed.y.toFixed(1) + '%' } }
    }
  }
});

/* ── 7. Age Group Line ──────────────────────────────────────────── */
new Chart(document.getElementById('ageChart'), {
  type: 'line',
  data: {
    labels: ['0–9', '10–19', '20–29', '30–39', '40–49', '50–59', '60+'],
    datasets: [{
      label: 'Survival Rate',
      data: [61.3, 40.2, 32.5, 43.7, 38.2, 41.7, 26.9],
      borderColor: '#1D9E75',
      backgroundColor: 'rgba(29,158,117,0.12)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#1D9E75',
      pointBorderColor: '#0d0f14',
      pointBorderWidth: 2,
      borderWidth: 2
    }]
  },
  options: {
    ...defaults,
    scales: {
      x: { grid: { color: GRID_COLOR }, ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 10 } } },
      y: {
        min: 0, max: 80,
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 }, callback: v => v + '%' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' Survival: ' + ctx.parsed.y.toFixed(1) + '%' } }
    }
  }
});

/* ── 8. Fare Group Bar ──────────────────────────────────────────── */
new Chart(document.getElementById('fareChart'), {
  type: 'bar',
  data: {
    labels: ['£0–24', '£25–49', '£50–99', '£100+'],
    datasets: [{
      label: 'Survival Rate',
      data: [28.7, 42.2, 64.8, 73.6],
      backgroundColor: ['rgba(226,75,74,0.65)','rgba(239,159,39,0.7)','rgba(55,138,221,0.7)','rgba(29,158,117,0.75)'],
      borderColor: ['#E24B4A','#EF9F27','#378ADD','#1D9E75'],
      borderWidth: 1,
      borderRadius: 4
    }]
  },
  options: {
    ...defaults,
    scales: {
      x: { grid: { color: GRID_COLOR }, ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 } } },
      y: {
        min: 0, max: 85,
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 }, callback: v => v + '%' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' Survival: ' + ctx.parsed.y.toFixed(1) + '%' } }
    }
  }
});

/* ── 9. Family Size Line ────────────────────────────────────────── */
new Chart(document.getElementById('familyChart'), {
  type: 'line',
  data: {
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '10'],
    datasets: [{
      label: 'Survival Rate',
      data: [30.4, 55.3, 57.8, 72.4, 20.0, 13.6, 33.3, 0.0, 0.0],
      borderColor: '#EF9F27',
      backgroundColor: 'rgba(239,159,39,0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 5,
      pointBackgroundColor: (ctx) => {
        const vals = [30.4, 55.3, 57.8, 72.4, 20.0, 13.6, 33.3, 0.0, 0.0];
        return vals[ctx.dataIndex] > 50 ? '#1D9E75' : '#E24B4A';
      },
      pointBorderColor: '#0d0f14',
      pointBorderWidth: 2,
      borderWidth: 2
    }]
  },
  options: {
    ...defaults,
    scales: {
      x: {
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 } },
        title: { display: true, text: 'Family size (SibSp+Parch)', color: TICK_COLOR, font: { family: 'sans-serif', size: 10 } }
      },
      y: {
        min: 0, max: 85,
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { family: 'sans-serif', size: 11 }, callback: v => v + '%' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' Survival: ' + ctx.parsed.y.toFixed(1) + '%' } }
    }
  }
});
