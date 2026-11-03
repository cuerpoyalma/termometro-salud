const explorerData = {
  nacional: {
    title: "La tendencia nacional no se detuvo",
    description: "Prevalencia de obesidad en adultos. Las primeras cuatro cifras son por autorreporte; 2018 incorpora además la primera medición física nacional.",
    badge: "Adultos · Total país",
    values: [
      { label: "2005", value: 14.6 },
      { label: "2009", value: 18.0 },
      { label: "2013", value: 20.8 },
      { label: "2018 · auto", value: 25.3 },
      { label: "2018 · física", value: 32.4, highlight: true }
    ],
    source: "ENFR 2005, 2009, 2013 y 2018",
    note: "El aumento de 73,3% compara autorreporte 2005–2018."
  },
  regiones: {
    title: "La carga cambia según el territorio",
    description: "Prevalencia regional de obesidad en adultos según autorreporte. Las cifras permiten comparar regiones bajo una misma metodología.",
    badge: "ENFR 2018",
    values: [
      { label: "Patagonia", value: 29.0 },
      { label: "Noroeste", value: 28.1 },
      { label: "Cuyo", value: 27.1 },
      { label: "Pampeana y GBA", value: 24.7 },
      { label: "Noreste", value: 23.6 }
    ],
    source: "ENFR 2018 · Secretaría de Gobierno de Salud / INDEC",
    note: "Valores autorreportados; no equivalen a la medición física nacional."
  },
  desigualdad: {
    title: "El riesgo se acumula en los hogares de menores ingresos",
    description: "Comparación entre el quintil de menores ingresos (Q1) y el de mayores ingresos (Q5).",
    badge: "ENFR y ENNyS 2",
    values: [
      { label: "Obesidad · medición física", low: 35.2, high: 25.5, suffix: "%" },
      { label: "Bebidas azucaradas · consumo diario", low: 46.9, high: 20.9, suffix: "%" },
      { label: "Frutas y verduras · ≥5 porciones", low: 4.4, high: 8.2, suffix: "%" }
    ],
    source: "ENFR 2018 y ENNyS 2 (2018–2019)",
    note: "Q1 = menores ingresos; Q5 = mayores ingresos."
  }
};

const explorer = document.querySelector("#explorer");
const viewTabs = [...document.querySelectorAll("[data-view]")];
const formatNumber = value => value.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function chartHeader(data) {
  return `
    <div class="chart-header">
      <div><h3>${data.title}</h3><p>${data.description}</p></div>
      <span class="chart-badge">${data.badge}</span>
    </div>`;
}

function chartFoot(data) {
  return `<div class="chart-foot"><span><strong>Fuente:</strong> ${data.source}</span><span>${data.note}</span></div>`;
}

function renderNational(data) {
  const columns = data.values.map(item => `
    <div class="trend-column ${item.highlight ? "highlight" : ""}">
      <strong>${formatNumber(item.value)}%</strong>
      <i class="trend-bar" style="--value:${item.value}" aria-hidden="true"></i>
      <span>${item.label}</span>
    </div>`).join("");
  return `${chartHeader(data)}<div class="trend-chart" aria-label="Evolución nacional de la obesidad adulta">${columns}</div>${chartFoot(data)}`;
}

function renderRegions(data) {
  const rows = data.values.map(item => `
    <div class="rank-row">
      <span>${item.label}</span>
      <div class="rank-track" aria-hidden="true"><i style="--value:${item.value}"></i></div>
      <strong>${formatNumber(item.value)}%</strong>
    </div>`).join("");
  return `${chartHeader(data)}<div class="rank-list" aria-label="Prevalencia regional de obesidad adulta">${rows}</div>${chartFoot(data)}`;
}

function renderEquity(data) {
  const metrics = data.values.map(item => `
    <div class="equity-metric">
      <span>${item.label}</span>
      <div class="equity-pair">
        <div class="equity-value"><small>Q1 · menor ingreso</small><strong>${formatNumber(item.low)}${item.suffix}</strong></div>
        <div class="equity-value"><small>Q5 · mayor ingreso</small><strong>${formatNumber(item.high)}${item.suffix}</strong></div>
      </div>
    </div>`).join("");
  return `${chartHeader(data)}<div class="equity-grid">${metrics}<div class="equity-summary">La desigualdad aparece en múltiples indicadores: mayor obesidad, mayor consumo diario de bebidas azucaradas y menor acceso a frutas y verduras en los hogares de menores ingresos.</div></div>${chartFoot(data)}`;
}

function renderExplorer(view = "nacional") {
  if (!explorer || !explorerData[view]) return;
  const renderers = { nacional: renderNational, regiones: renderRegions, desigualdad: renderEquity };
  explorer.innerHTML = renderers[view](explorerData[view]);
}

viewTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    viewTabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    renderExplorer(tab.dataset.view);
  });
});

function filterReports(category = "todos") {
  const reports = [...document.querySelectorAll(".report-item")];
  let visible = 0;
  reports.forEach(report => {
    const show = category === "todos" || report.dataset.category === category;
    report.hidden = !show;
    if (show) visible += 1;
  });
  const count = document.querySelector("#report-count");
  if (count) count.textContent = `${visible} ${visible === 1 ? "documento" : "documentos"}`;
}

const filterButtons = [...document.querySelectorAll("[data-filter]")];
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    filterReports(button.dataset.filter);
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}

function updateScrollProgress() {
  const progress = document.querySelector("[data-scroll-progress]");
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  progress.style.width = `${ratio * 100}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

renderExplorer();
filterReports();
updateScrollProgress();
