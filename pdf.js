// Lightweight PDF builder with jsPDF + autoTable
// Depends on global App and loaded libraries (jspdf, jspdf-autotable)

(function () {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF || !window.jspdf || !window.jspdf) {
    console.warn('jsPDF not found');
  }

  const i18n = () => App.i18n[App.state.currentLang === 'ar' ? 'ar' : 'en'];

  const deepMerge = (base, extra) => {
    const out = Array.isArray(base) ? base.slice() : { ...base };
    if (!extra) return out;
    Object.keys(extra).forEach(k => {
      const v = extra[k];
      if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = deepMerge(out[k] || {}, v);
      else out[k] = v;
    });
    return out;
  };

  const headerMap = {
    '#': 0, name: 1, unit: 2, quantity: 3, costPerUnit: 4, totalCost: 5,
    pct: 6, discount: 7, extra: 8, method: 9, vatAmount: 10, profit: 11, finalPrice: 12, notes: 13
  };

  const translateHeader = (key, locale) => {
    const th = App.i18n[locale].tableHeaders || [];
    if (key === '#') return th[0] || '#';
    const idx = headerMap[key];
    return (idx != null ? th[idx] : key) || key;
  };

  const num = (v, d = 2) => (Number(v) || 0).toFixed(d);

  const buildRows = (cols, rate, locale) => {
    const rows = [];
    const units = App.i18n[locale].units;
    const methods = App.i18n[locale].methods;
    (App.state.items || []).forEach((item, index) => {
      const row = [];
      cols.forEach(c => {
        switch (c) {
          case '#': row.push(index + 1); break;
          case 'name': row.push(item.name || ''); break;
          case 'unit': row.push(units[item.unit] || item.unit || ''); break;
          case 'quantity': row.push(num(item.quantity, 0)); break;
          case 'costPerUnit': row.push(num(item.costPerUnit * rate)); break;
          case 'totalCost': row.push(num((item.totalCost || 0) * rate)); break;
          case 'pct': row.push(num(item.pct, 2)); break;
          case 'discount': {
            const isPercent = item.discountType === 'percent';
            const val = isPercent ? num(item.discount, 2) : num(item.discount * rate);
            row.push(val);
            break; }
          case 'extra': {
            const val = item.extraType === 'perunit' ? (item.extra * (item.quantity || 0)) : item.extra;
            row.push(num(val * rate));
            break; }
          case 'method': row.push(methods[item.method] || item.method || ''); break;
          case 'vatAmount': row.push(num((item.vatAmount || 0) * rate)); break;
          case 'profit': row.push(num((item.profit || 0) * rate)); break;
          case 'finalPrice': row.push(num((item.finalPrice || 0) * rate)); break;
          case 'notes': row.push(item.notes || ''); break;
          default: row.push('');
        }
      });
      rows.push(row);
    });
    return rows;
  };

  const getTotals = (cols, rate, locale) => {
    const t = {
      qty: 0, cost: 0, discount: 0, extra: 0, vat: 0, profit: 0, price: 0
    };
    (App.state.items || []).forEach(item => {
      const qty = Number(item.quantity) || 0;
      const baseCost = Number(item.totalCost) || (Number(item.costPerUnit) * qty) || 0;
      const discountApplied = item.discountType === 'percent' ? baseCost * (Number(item.discount) || 0) / 100 : (Number(item.discount) || 0);
      const extraApplied = item.extraType === 'perunit' ? (Number(item.extra) || 0) * qty : (Number(item.extra) || 0);
      t.qty += qty;
      t.cost += baseCost;
      t.discount += discountApplied;
      t.extra += extraApplied;
      t.vat += Number(item.vatAmount) || 0;
      t.profit += Number(item.profit) || 0;
      t.price += Number(item.finalPrice) || 0;
    });
    const th = App.i18n[locale].totalLabel || 'Totals';
    const foot = cols.map((c, i) => {
      if (i === 0) return { content: th, colSpan: 3, styles: { halign: 'right' } };
      switch (c) {
        case 'quantity': return num(t.qty, 0);
        case 'totalCost': return num(t.cost * rate);
        case 'discount': return num(t.discount * rate);
        case 'extra': return num(t.extra * rate);
        case 'vatAmount': return num(t.vat * rate);
        case 'profit': return num(t.profit * rate);
        case 'finalPrice': return num(t.price * rate);
        default: return '';
      }
    });
    return foot;
  };

  const loadArabicFont = async (doc) => {
    const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/cairo/files/cairo-arabic-400-normal.ttf';
    const buf = await fetch(fontUrl).then(r => r.arrayBuffer());
    // Convert to base64
    let binary = '';
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    const base64 = btoa(binary);
    doc.addFileToVFS('Cairo.ttf', base64);
    doc.addFont('Cairo.ttf', 'Cairo', 'normal');
    doc.setFont('Cairo');
  };

  const defaultColumns = ['#','name','unit','quantity','costPerUnit','totalCost','pct','discount','extra','method','vatAmount','profit','finalPrice','notes'];

  const pdfDefaults = {
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    margin: { top: 18, right: 12, bottom: 16, left: 12 },
    showLogo: true,
    showHeader: true,
    showFooter: true,
    showTotalsRow: true,
    showNotesColumn: true,
    includeColumns: defaultColumns.slice(),
    locale: App.state.currentLang === 'ar' ? 'ar' : 'en',
    rtl: App.state.currentLang === 'ar',
    projectName: App.state.projectName || '',
    currency: App.state.currency || 'SAR',
    currencyRate: App.state.currencyRate || 1.0,
    vatRate: parseFloat(App.elements.vatRateInput.value || '15') / 100,
    embedCharts: true,
    charts: { barCanvasId: 'costProfitBarChart', pieCanvasId: 'costProfitPieChart', width: 180, height: 90 },
    colors: { head: [41,128,185], headText: 255, text: [30,30,30], rowAlt: [248,248,250] }
  };

  function collectOptions() {
    const opts = deepMerge(pdfDefaults, {});
    // Read UI selections if exist
    const $ = id => document.getElementById(id);
    const showHeader = $('optShowHeader');
    if (showHeader) opts.showHeader = !!showHeader.checked;
    const showFooter = $('optShowFooter');
    if (showFooter) opts.showFooter = !!showFooter.checked;
    const showLogo = $('optShowLogo');
    if (showLogo) opts.showLogo = !!showLogo.checked;
    const showTotals = $('optShowTotals');
    if (showTotals) opts.showTotalsRow = !!showTotals.checked;
    const embedCharts = $('optEmbedCharts');
    if (embedCharts) opts.embedCharts = !!embedCharts.checked;
    const orSel = $('optOrientation');
    if (orSel) opts.orientation = orSel.value || 'landscape';
    const colSel = $('optColumns');
    if (colSel) {
      const vals = Array.from(colSel.selectedOptions).map(o => o.value);
      opts.includeColumns = vals.length ? vals : defaultColumns.slice();
    }
    opts.locale = App.state.currentLang === 'ar' ? 'ar' : 'en';
    opts.rtl = App.state.currentLang === 'ar';
    opts.projectName = App.state.projectName || '';
    opts.currency = App.state.currency || 'SAR';
    opts.currencyRate = App.state.currencyRate || 1.0;
    opts.vatRate = parseFloat(App.elements.vatRateInput.value || '15') / 100;
    return opts;
  }

  function renderPdfPreview(options) {
    const opts = deepMerge(pdfDefaults, options || {});
    const locale = opts.locale;
    const preview = document.getElementById('pdf-preview') || (() => {
      const d = document.createElement('div');
      d.id = 'pdf-preview'; d.className = 'pdf-preview';
      document.body.appendChild(d); return d;
    })();

    // Clear content safely
    preview.innerHTML = '';
    preview.classList.remove('d-none');

    const title = document.createElement('h3');
    title.textContent = locale === 'ar' ? `معاينة PDF — ${opts.projectName || ''}` : `PDF Preview — ${opts.projectName || ''}`;
    preview.appendChild(title);

    if (opts.showHeader) {
      const p = document.createElement('p');
      p.textContent = `${i18n().projectNameLabel}: ${opts.projectName} | ${i18n().currencyLabel}: ${opts.currency}, Rate: ${num(opts.currencyRate,4)} | ${i18n().vatRateLabel}: ${(opts.vatRate*100).toFixed(2)}%`;
      preview.appendChild(p);
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    opts.includeColumns.forEach(c => {
      const th = document.createElement('th'); th.textContent = translateHeader(c, locale); trh.appendChild(th);
    });
    thead.appendChild(trh); table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const rows = buildRows(opts.includeColumns, opts.currencyRate, locale).slice(0, 8); // preview first 8 rows
    rows.forEach(r => {
      const tr = document.createElement('tr');
      r.forEach(cell => { const td = document.createElement('td'); td.textContent = String(cell); tr.appendChild(td); });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    preview.appendChild(table);

    if (opts.showFooter) {
      const small = document.createElement('div');
      small.style.marginTop = '8px';
      small.textContent = (locale === 'ar') ? `تم الإنشاء بواسطة AdwanX — ${new Date().toLocaleString('ar-EG')}` : `Generated by AdwanX — ${new Date().toLocaleString('en-US')}`;
      preview.appendChild(small);
    }
  }

  async function exportPDF(options) {
    try {
      if (App && typeof App.calculateAll === 'function') App.calculateAll();
      const opts = deepMerge(pdfDefaults, options || {});
      const locale = opts.locale;
      const rtl = opts.rtl;
      const doc = new jsPDF({ orientation: opts.orientation, unit: opts.unit, format: opts.format });

      if (rtl) { await loadArabicFont(doc); doc.setRTL(true); }

      // Header
      let cursorY = opts.margin.top;
      if (opts.showHeader) {
        try {
          if (opts.showLogo) {
            const logoImg = document.querySelector('.logo-container img');
            if (logoImg && logoImg.naturalWidth) {
              const canvas = document.createElement('canvas');
              canvas.width = logoImg.naturalWidth; canvas.height = logoImg.naturalHeight;
              const ctx = canvas.getContext('2d'); ctx.drawImage(logoImg, 0, 0);
              const logoData = canvas.toDataURL('image/png');
              doc.addImage(logoData, 'PNG', opts.margin.left, cursorY - 8, 20, 12);
            }
          }
        } catch(e) { console.warn('Logo add failed', e); }

        doc.setFontSize(12);
        const title = locale === 'ar' ? `حاسبة التكلفة التقديرية — ${opts.projectName || ''}` : `Material Cost Estimator — ${opts.projectName || ''}`;
        const textX = opts.margin.left + (opts.showLogo ? 24 : 0);
        doc.text(title, textX, cursorY);
        doc.setFontSize(9);
        const now = new Date();
        const lines = [
          `${i18n().projectNameLabel}: ${opts.projectName || ''}`,
          `${i18n().currencyLabel}: ${opts.currency}, Rate: ${num(opts.currencyRate,4)}`,
          `${i18n().vatRateLabel}: ${(opts.vatRate*100).toFixed(2)}%`,
          `${i18n().exportedOnLabel}: ${now.toLocaleString(locale === 'ar' ? 'ar-EG':'en-US')}`
        ];
        lines.forEach((t, idx) => doc.text(t, textX, cursorY + 6 + (idx*5)) );
      }

      // Build table
      const head = [opts.includeColumns.map(c => translateHeader(c, locale))];
      const body = buildRows(opts.includeColumns, opts.currencyRate, locale);
      const foot = opts.showTotalsRow ? [getTotals(opts.includeColumns, opts.currencyRate, locale)] : undefined;

      doc.autoTable({
        startY: opts.margin.top + 20,
        head,
        body,
        foot,
        styles: { font: rtl ? 'Cairo' : 'helvetica', fontSize: 8, cellPadding: 2, halign: rtl ? 'right' : 'left' },
        headStyles: { fillColor: opts.colors.head, textColor: opts.colors.headText, halign: rtl ? 'right' : 'left' },
        alternateRowStyles: { fillColor: opts.colors.rowAlt },
        margin: { top: opts.margin.top + 20, right: opts.margin.right, bottom: opts.margin.bottom, left: opts.margin.left },
        didDrawPage: (data) => {
          // Footer per page
          if (opts.showFooter) {
            const pageSize = doc.internal.pageSize;
            const pageWidth = pageSize.getWidth();
            const pageHeight = pageSize.getHeight();
            const pageCount = doc.getNumberOfPages();
            const pageCurrent = doc.getCurrentPageInfo().pageNumber;
            const footerText = (locale==='ar') ? `الصفحة ${pageCurrent} من ${pageCount}` : `Page ${pageCurrent} of ${pageCount}`;
            doc.setFontSize(8);
            doc.text(footerText, pageWidth - opts.margin.right - 20, pageHeight - 6, { align: 'right' });
            const genText = (locale==='ar') ? `تم الإنشاء بواسطة AdwanX — ${new Date().toLocaleString('ar-EG')}` : `Generated by AdwanX — ${new Date().toLocaleString('en-US')}`;
            doc.text(genText, opts.margin.left, pageHeight - 6);
          }
        }
      });

      // Charts page
      if (opts.embedCharts) {
        const bar = document.getElementById(opts.charts.barCanvasId);
        const pie = document.getElementById(opts.charts.pieCanvasId);
        if (bar || pie) {
          doc.addPage();
          doc.setFontSize(12);
          doc.text(i18n().chartsTitle || 'Charts', opts.margin.left, opts.margin.top);
          let y = opts.margin.top + 4;
          const addIf = (canvas, title) => {
            if (!canvas) return;
            try {
              const dataURL = canvas.toDataURL('image/png', 1.0);
              doc.setFontSize(10);
              y += 6; doc.text(title, opts.margin.left, y);
              y += 2; doc.addImage(dataURL, 'PNG', opts.margin.left, y, opts.charts.width, opts.charts.height);
              y += opts.charts.height + 6;
            } catch (e) { console.warn('Chart embed failed', e); }
          };
          addIf(bar, App.i18n[locale].chartLabels?.costVsProfit || 'Bar');
          addIf(pie, App.i18n[locale].chartLabels?.totalCostVsProfit || 'Pie');
        }
      }

      const date = new Date().toISOString().split('T')[0];
      const filename = `Cost_Estimate_${opts.projectName || 'Project'}_${date}.pdf`;
      doc.save(filename);
    } catch (e) {
      console.error('PDF export failed', e);
      const msg = (App.i18n[App.state.currentLang]?.validation?.pdfExportFailed) || 'Failed to export PDF.';
      alert(msg);
    }
  }

  // Wire UI
  document.addEventListener('DOMContentLoaded', () => {
    // Preselect all columns in the multi-select
    const sel = document.getElementById('optColumns');
    if (sel) Array.from(sel.options).forEach(o => { if (defaultColumns.includes(o.value)) o.selected = true; });

    const previewBtn = document.getElementById('previewPdfBtn');
    if (previewBtn) previewBtn.addEventListener('click', () => renderPdfPreview(collectOptions()));

    const exportBtn = document.getElementById('exportPDFBtn');
    if (exportBtn) {
      // Replace existing handler from App.bindEvents by setting onclick
      exportBtn.onclick = (e) => { e.preventDefault(); exportPDF(collectOptions()); };
    }
  });

  // Expose
  window.PDFExporter = { pdfDefaults, collectOptions, renderPdfPreview, exportPDF };
})();

