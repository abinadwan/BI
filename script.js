const { jsPDF } = window.jspdf;

const App = {
  i18n: {
    en: {
      title: "Material Cost Estimator | حاسبة التكلفة التقديرية للمواد",
      headerTitle: "Material Cost Estimator",
      projectDetailsTitle: "Project Details",
      projectNameLabel: "Project Name",
      projectDescLabel: "Project Description",
      vatRateLabel: "VAT Rate %",
      currencyLabel: "Currency",
      exportedOnLabel: "Generated on",
      refreshRateBtn: "Refresh Rate",
      itemManagementTitle: "Item Management",
      addItemBtn: "Add Item",
      clearAllBtn: "Clear All",
      modalTitle: "Add New Item",
      saveItemBtn: "Save Item",
      editModalTitle: "Edit Item",
      updateItemBtn: "Update Item",
      editBtn: "Edit",
      tableHeaders: ["#", "Item", "Unit", "Qty", "Cost/Unit", "Total Cost", "%", "Discount", "Extra Costs", "Method", "VAT Amount", "Profit", "Final Price", "Notes", "Actions"],
      totalLabel: "Totals",
      reportManagementTitle: "Report Management",
      exportExcelBtn: "Export Excel",
      exportPDFBtn: "Export PDF",
      printBtn: "Print Report",
      downloadTemplateBtn: "Download Excel Template",
      importExcelBtn: "Import Excel",
      previewPdfBtn: "Preview PDF",
      pdfOptionsTitle: "PDF Options",
      showHeaderLabel: "Show Header",
      showFooterLabel: "Show Footer",
      showLogoLabel: "Show Logo",
      showTotalsLabel: "Show Totals Row",
      embedChartsLabel: "Embed Charts",
      includeColumnsLabel: "Columns",
      orientationLabel: "Orientation",
      portrait: "Portrait",
      landscape: "Landscape",
      summaryPdfBtn: "Summary Report (PDF)",
      detailedPdfBtn: "Detailed Report (PDF)",
      chartsTitle: "Charts",
      savedMessage: "Auto-saved",
      langLabel: "العربية",
      themeLabel: "Dark Mode",
      units: { Piece: "Piece", Meter: "Meter", Ton: "Ton" },
      methods: { costplus: "Cost Plus", margin: "Margin" },
      discountTypes: { amount: "Amount", percent: "Percent" },
      extraTypes: { total: "Total", perunit: "Per Unit" },
      validation: {
        emptyName: "Item name cannot be empty.",
        marginError: "Percentage must be less than 100 for Margin method.",
        rateFetchFailed: "Failed to fetch currency rate. Using fallback rate of 1.0.",
        noItemsToCalc: "No items to calculate.",
        importSuccess: "Items imported successfully.",
        importError: "Failed to import Excel file. Please check the file format.",
        pdfExportFailed: "Failed to export PDF. Please try again.",
        template: "Cost Estimator Template"
      },
      chartLabels: {
        costVsProfit: "Cost vs. Profit per Item",
        totalCostVsProfit: "Total Cost vs. Profit",
        totalCost: "Total Cost",
        totalProfit: "Total Profit"
      }
    },
    ar: {
      title: "حاسبة التكلفة التقديرية للمواد | Material Cost Estimator",
      headerTitle: "حاسبة التكلفة التقديرية للمواد",
      projectDetailsTitle: "تفاصيل المشروع",
      projectNameLabel: "اسم المشروع",
      vatRateLabel: "نسبة ضريبة القيمة المضافة %",
      currencyLabel: "العملة",
      exportedOnLabel: "تاريخ ووقت التصدير",
      refreshRateBtn: "تحديث السعر",
      itemManagementTitle: "إدارة البنود",
      addItemBtn: "إضافة بند",
      clearAllBtn: "مسح الكل",
      modalTitle: "إضافة بند جديد",
      saveItemBtn: "حفظ البند",
      editModalTitle: "تعديل البند",
      updateItemBtn: "تحديث البند",
      editBtn: "تعديل",
      tableHeaders: ["#", "البند", "الوحدة", "الكمية", "سعر التكلفة/وحدة", "إجمالي التكلفة", "النسبة %", "الخصم", "مصاريف إضافية", "طريقة الحسبة", "مبلغ الضريبة", "الربح", "السعر النهائي", "ملاحظات", "إجراءات"],
      totalLabel: "الإجماليات",
      reportManagementTitle: "إدارة التقارير",
      exportExcelBtn: "تصدير إلى إكسل",
      exportPDFBtn: "تصدير إلى PDF",
      printBtn: "طباعة التقرير",
      downloadTemplateBtn: "تحميل قالب إكسل",
      importExcelBtn: "استيراد إكسل",
      chartsTitle: "الرسوم البيانية",
      savedMessage: "تم الحفظ تلقائياً",
      langLabel: "English",
      themeLabel: "الوضع الداكن",
      units: { Piece: "قطعة", Meter: "متر", Ton: "طن" },
      methods: { costplus: "التكلفة +", margin: "هامش الربح" },
      discountTypes: { amount: "قيمة", percent: "نسبة" },
      extraTypes: { total: "إجمالي", perunit: "للوحدة" },
      validation: {
        emptyName: "لا يمكن أن يكون اسم البند فارغاً.",
        marginError: "يجب أن تكون النسبة أقل من 100 لطريقة هامش الربح.",
        rateFetchFailed: "فشل في جلب سعر الصرف. سيتم استخدام سعر افتراضي 1.0.",
        noItemsToCalc: "لا توجد بنود للحساب.",
        importSuccess: "تم استيراد البنود بنجاح.",
        importError: "فشل في استيراد ملف إكسل. يرجى التحقق من تنسيق الملف.",
        template: "قالب حاسبة التكلفة التقديرية"
      },
      chartLabels: {
        costVsProfit: "التكلفة مقابل الربح لكل بند",
        totalCostVsProfit: "إجمالي التكلفة مقابل الربح",
        totalCost: "إجمالي التكلفة",
        totalProfit: "إجمالي الربح"
      }
    }
  },

  state: {
    items: [],
    currentLang: 'en',
    currentTheme: 'light',
    currencyRate: 1.0,
    currency: 'SAR',
    vatRate: 15,
    projectName: '',
    projectDesc: ''
  },

  editingIndex: null,

  elements: {
    appTitle: document.getElementById('app-title'),
    projectNameInput: document.getElementById('projectName'),
    projectDescInput: document.getElementById('projectDesc'),
    vatRateInput: document.getElementById('vatRate'),
    currencySelect: document.getElementById('currencySelect'),
    rateInfoSpan: document.getElementById('rateInfo'),
    themeToggle: document.getElementById('themeToggle'),
    langToggle: document.getElementById('langToggle'),
    itemsTableBody: document.getElementById('itemsTableBody'),
    totalQtyTd: document.getElementById('totalQty'),
    totalCostTd: document.getElementById('totalCost'),
    totalProfitTd: document.getElementById('totalProfit'),
    totalPriceTd: document.getElementById('totalPrice'),
    totalDiscountTd: document.getElementById('totalDiscount'),
    totalExtraTd: document.getElementById('totalExtra'),
    totalVatTd: document.getElementById('totalVat'),
    savedMessage: document.getElementById('saved-message'),
    importExcelInput: document.getElementById('importExcelInput'),
    costProfitBarChartCanvas: document.getElementById('costProfitBarChart'),
    costProfitPieChartCanvas: document.getElementById('costProfitPieChart'),
    itemModal: document.getElementById('itemModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    addItemBtn: document.getElementById('addItemBtn'),
    saveItemBtn: document.getElementById('saveItemBtn'),
    rateErrorMessage: document.getElementById('rate-error-message')
  },

  charts: { barChart: null, pieChart: null },

  // Utils
  toEnglishDigits(str) {
    return String(str || '').replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]).replace(/٫/g, '.');
  },
  toArabicDigits(str) {
    return String(str || '').replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]).replace(/\./g, '٫');
  },
  formatInputValue(value) {
    const str = value !== undefined && value !== null ? String(value) : '';
    return this.state.currentLang === 'ar' ? this.toArabicDigits(str) : str;
  },
  formatNumber(num, decimals = 2) {
    const str = (Number(num) || 0).toFixed(decimals);
    return this.state.currentLang === 'ar' ? this.toArabicDigits(str) : str;
  },
  updateModalTexts() {
    const titleKey = this.editingIndex !== null ? 'editModalTitle' : 'modalTitle';
    const btnKey = this.editingIndex !== null ? 'updateItemBtn' : 'saveItemBtn';
    document.getElementById('modal-title').textContent = this.i18n[this.state.currentLang][titleKey];
    document.getElementById('save-item-btn-text').textContent = this.i18n[this.state.currentLang][btnKey];
  },

  // Init
  init() {
    this.ensureI18nKeys();
    this.loadState();
    this.bindEvents();
    this.setLanguage();
    this.updateRateInfo();
    // Update KPI cards if present
    const kCost = document.getElementById('kpi-total-cost');
    const kProfit = document.getElementById('kpi-total-profit');
    const kFinal = document.getElementById('kpi-final-price');
    if (kCost && kProfit && kFinal) {
      kCost.textContent = this.formatNumber(totalCost * this.state.currencyRate);
      kProfit.textContent = this.formatNumber(totalProfit * this.state.currencyRate);
      kFinal.textContent = this.formatNumber(totalPrice * this.state.currencyRate);
      const c = this.state.currency;
      const c1 = document.getElementById('kpi-currency-1');
      const c2 = document.getElementById('kpi-currency-2');
      const c3 = document.getElementById('kpi-currency-3');
      if (c1) c1.textContent = c; if (c2) c2.textContent = c; if (c3) c3.textContent = c;
    }

    this.renderTable();
    this.calculateAll();
  },

  // Events
  bindEvents() {
    this.elements.addItemBtn.addEventListener('click', () => this.openAddModal());
    this.elements.saveItemBtn.addEventListener('click', () => this.saveItem());
    this.elements.closeModalBtn.addEventListener('click', () => this.hideModal());
    this.elements.projectNameInput.addEventListener('input', () => this.saveState());
    if (this.elements.projectDescInput) this.elements.projectDescInput.addEventListener('input', () => this.saveState());
    this.elements.vatRateInput.addEventListener('input', () => this.calculateAll());
    this.elements.currencySelect.addEventListener('change', () => this.updateCurrencyRates());
    document.getElementById('refreshRateBtn').addEventListener('click', () => this.updateCurrencyRates());
    document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAll());
    document.getElementById('exportExcelBtn').addEventListener('click', () => this.exportExcel());
    const summaryBtn = document.getElementById('summaryPdfBtn');
    if (summaryBtn) summaryBtn.addEventListener('click', () => this.exportPDFByTemplate('summary'));
    const detailedBtn = document.getElementById('detailedPdfBtn');
    if (detailedBtn) detailedBtn.addEventListener('click', () => this.exportPDFByTemplate('detailed'));
    const exportPdfBtn = document.getElementById('exportPDFBtn');
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.PDFExporter) {
        window.PDFExporter.exportPDF(window.PDFExporter.collectOptions());
      } else {
        this.exportPDF();
      }
    });
    document.getElementById('printBtn').addEventListener('click', () => window.print());
    document.getElementById('downloadTemplateBtn').addEventListener('click', () => this.downloadTemplate());
    document.getElementById('importExcelBtn').addEventListener('click', () => this.elements.importExcelInput.click());
    this.elements.importExcelInput.addEventListener('change', (e) => this.importExcel(e));
    this.elements.themeToggle.addEventListener('change', () => this.setTheme());
    this.elements.langToggle.addEventListener('change', () => this.setLanguage());

    window.addEventListener('click', (event) => {
      if (event.target === this.elements.itemModal) this.hideModal();
    });
  },

  // State
  saveState() {
    this.state.vatRate = parseFloat(this.elements.vatRateInput.value) || 0;
    this.state.projectName = this.elements.projectNameInput.value;
    this.state.projectDesc = this.elements.projectDescInput ? this.elements.projectDescInput.value : '';
    this.state.currency = this.elements.currencySelect.value;
    localStorage.setItem('profitCalculatorState', JSON.stringify(this.state));
    this.showSavedMessage();
  },
  loadState() {
    const state = JSON.parse(localStorage.getItem('profitCalculatorState'));
    if (state) {
      this.state = state;
      this.elements.vatRateInput.value = this.state.vatRate;
      this.elements.projectNameInput.value = this.state.projectName;
      if (this.elements.projectDescInput) this.elements.projectDescInput.value = this.state.projectDesc || '';
      this.elements.currencySelect.value = this.state.currency;
      if (this.state.currentTheme === 'dark') {
        this.elements.themeToggle.checked = true;
        document.documentElement.classList.add('dark');
      }
      if (this.state.currentLang === 'ar') {
        this.elements.langToggle.checked = true;
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
      }
    } else {
      this.addDemoItems();
    }
  },
  addDemoItems() {
    this.state.items = [
      { name: "Steel Rebars", unit: "Ton", quantity: 50, costPerUnit: 2500, pct: 15, discount: 0, discountType: "amount", extra: 0, extraType: "total", method: "costplus", vatChecked: true, notes: "High quality steel" },
      { name: "Concrete", unit: "Meter", quantity: 200, costPerUnit: 350, pct: 25, discount: 500, discountType: "amount", extra: 5, extraType: "perunit", method: "margin", vatChecked: false, notes: "Ready-mix concrete" }
    ];
    this.calculateAll();
  },
  showSavedMessage() {
    this.elements.savedMessage.textContent = this.i18n[this.state.currentLang].savedMessage;
    this.elements.savedMessage.style.display = 'block';
    setTimeout(() => this.elements.savedMessage.style.display = 'none', 2000);
  },

  // Lang & Theme
  setLanguage() {
    this.ensureI18nKeys();
    this.state.currentLang = this.elements.langToggle.checked ? 'ar' : 'en';
    document.documentElement.setAttribute('dir', this.state.currentLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', this.state.currentLang === 'ar' ? 'ar' : 'en');

    const translatableElements = {
      'app-title': 'title', 'project-details-title': 'projectDetailsTitle',
      'project-name-label': 'projectNameLabel', 'project-desc-label': 'projectDescLabel', 'vat-rate-label': 'vatRateLabel',
      'currency-label': 'currencyLabel', 'refresh-rate-btn': 'refreshRateBtn',
      'item-management-title': 'itemManagementTitle', 'add-item-btn': 'addItemBtn',
      'clear-all-btn': 'clearAllBtn', 'total-label': 'totalLabel',
      'report-management-title': 'reportManagementTitle', 'export-excel-btn': 'exportExcelBtn',
      'preview-pdf-btn': 'previewPdfBtn', 'export-pdf-btn': 'exportPDFBtn', 'print-btn': 'printBtn',
      'download-template-btn': 'downloadTemplateBtn', 'import-excel-btn': 'importExcelBtn',
      'summary-pdf-btn': 'summaryPdfBtn', 'detailed-pdf-btn': 'detailedPdfBtn',
      'pdf-options-title': 'pdfOptionsTitle', 'show-header-label': 'showHeaderLabel', 'show-footer-label': 'showFooterLabel',
      'show-logo-label': 'showLogoLabel', 'show-totals-label': 'showTotalsLabel', 'embed-charts-label': 'embedChartsLabel',
      'orientation-label': 'orientationLabel', 'orientation-landscape': 'landscape', 'orientation-portrait': 'portrait',
      'include-columns-label': 'includeColumnsLabel',
      'charts-title': 'chartsTitle', 'lang-label': 'langLabel', 'theme-label': 'themeLabel'
    };

    for (const [id, key] of Object.entries(translatableElements)) {
      const el = document.getElementById(id);
      if (!el) continue;
      const val = (this.i18n[this.state.currentLang] && this.i18n[this.state.currentLang][key]) ?? (this.i18n['en'] && this.i18n['en'][key]);
      if (val != null) el.textContent = val;
    }

    const headers = document.getElementById('table-headers').children;
    this.i18n[this.state.currentLang].tableHeaders.forEach((text, index) => {
      if (headers[index]) headers[index].textContent = text;
    });

    // KPI labels from tableHeaders indices (Total Cost, Profit, Final Price)
    try {
      const th = this.i18n[this.state.currentLang].tableHeaders;
      const labCost = document.getElementById('kpi-total-cost-label');
      const labProfit = document.getElementById('kpi-total-profit-label');
      const labFinal = document.getElementById('kpi-final-price-label');
      if (labCost && th[5]) labCost.textContent = th[5];
      if (labProfit && th[11]) labProfit.textContent = th[11];
      if (labFinal && th[12]) labFinal.textContent = th[12];
    } catch(e) {}


    this.renderModalOptions();
    // Update KPI cards if present
    const kCost = document.getElementById('kpi-total-cost');
    const kProfit = document.getElementById('kpi-total-profit');
    const kFinal = document.getElementById('kpi-final-price');
    if (kCost && kProfit && kFinal) {
      kCost.textContent = this.formatNumber(totalCost * this.state.currencyRate);
      kProfit.textContent = this.formatNumber(totalProfit * this.state.currencyRate);
      kFinal.textContent = this.formatNumber(totalPrice * this.state.currencyRate);
      const c = this.state.currency;
      const c1 = document.getElementById('kpi-currency-1');
      const c2 = document.getElementById('kpi-currency-2');
      const c3 = document.getElementById('kpi-currency-3');
      if (c1) c1.textContent = c; if (c2) c2.textContent = c; if (c3) c3.textContent = c;
    }

    this.renderTable();
    this.drawCharts();
    this.updateRateInfo();
      this.updateModalTexts();
      this.saveState();
  },
  // Ensure required i18n keys for PDF UI exist
  ensureI18nKeys() {
    const en = this.i18n.en || (this.i18n.en = {});
    const ar = this.i18n.ar || (this.i18n.ar = {});
    Object.assign(en, {
      previewPdfBtn: en.previewPdfBtn || 'Preview PDF',
      pdfOptionsTitle: en.pdfOptionsTitle || 'PDF Options',
      showHeaderLabel: en.showHeaderLabel || 'Show Header',
      showFooterLabel: en.showFooterLabel || 'Show Footer',
      showLogoLabel: en.showLogoLabel || 'Show Logo',
      showTotalsLabel: en.showTotalsLabel || 'Show Totals Row',
      embedChartsLabel: en.embedChartsLabel || 'Embed Charts',
      includeColumnsLabel: en.includeColumnsLabel || 'Columns',
      orientationLabel: en.orientationLabel || 'Orientation',
      portrait: en.portrait || 'Portrait',
      landscape: en.landscape || 'Landscape',
      summaryPdfBtn: en.summaryPdfBtn || 'Summary Report (PDF)',
      detailedPdfBtn: en.detailedPdfBtn || 'Detailed Report (PDF)',
      projectDescLabel: en.projectDescLabel || 'Project Description'
    });
    Object.assign(ar, {
      previewPdfBtn: ar.previewPdfBtn || 'معاينة PDF',
      pdfOptionsTitle: ar.pdfOptionsTitle || 'خيارات PDF',
      showHeaderLabel: ar.showHeaderLabel || 'إظهار الترويسة',
      showFooterLabel: ar.showFooterLabel || 'إظهار التذييل',
      showLogoLabel: ar.showLogoLabel || 'إظهار الشعار',
      showTotalsLabel: ar.showTotalsLabel || 'إظهار صف الإجماليات',
      embedChartsLabel: ar.embedChartsLabel || 'إدراج الرسوم البيانية',
      includeColumnsLabel: ar.includeColumnsLabel || 'الأعمدة',
      orientationLabel: ar.orientationLabel || 'الاتجاه',
      portrait: ar.portrait || 'عمودي',
      landscape: ar.landscape || 'أفقي',
      summaryPdfBtn: ar.summaryPdfBtn || 'تقرير مختصر (PDF)',
      detailedPdfBtn: ar.detailedPdfBtn || 'تقرير تفصيلي (PDF)',
      projectDescLabel: ar.projectDescLabel || 'وصف المشروع'
    });
  },
  setTheme() {
    this.state.currentTheme = this.elements.themeToggle.checked ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', this.state.currentTheme === 'dark');
    this.drawCharts();
    this.saveState();
  },

  // Currency
  async updateCurrencyRates() {
    const currency = this.elements.currencySelect.value;
    if (currency === 'SAR') {
      this.state.currencyRate = 1.0;
      this.updateRateInfo();
      this.calculateAll();
      return;
    }

    this.elements.rateErrorMessage.style.display = 'none';
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/SAR`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      this.state.currencyRate = data.rates[currency] || 1.0;
    } catch (error) {
      console.error("Failed to fetch currency rates:", error);
      this.state.currencyRate = 1.0;
      this.elements.rateErrorMessage.textContent = this.i18n[this.state.currentLang].validation.rateFetchFailed;
      this.elements.rateErrorMessage.style.display = 'block';
    }
    this.updateRateInfo();
    this.calculateAll();
    this.saveState();
  },
  updateRateInfo() {
    const currency = this.elements.currencySelect.value;
    this.elements.rateInfoSpan.textContent = `1 SAR = ${this.formatNumber(this.state.currencyRate, 4)} ${currency}`;
  },

  // Core calc
  calculateAll() {
    let totalQty = 0, totalCost = 0, totalProfit = 0, totalPrice = 0, totalDiscount = 0, totalExtra = 0, totalVat = 0;
    const vatRate = parseFloat(this.elements.vatRateInput.value) / 100;

    this.state.items.forEach(item => {
      const qty = parseFloat(item.quantity) || 0;
      const costPerUnit = parseFloat(item.costPerUnit) || 0;
      const pct = parseFloat(item.pct) || 0;
      const discount = parseFloat(item.discount) || 0;
      const extra = parseFloat(item.extra) || 0;

      const baseCost = costPerUnit * qty;
      const extraCostsApplied = item.extraType === 'perunit' ? extra * qty : extra;
      const discountApplied = item.discountType === 'percent' ? (baseCost * discount / 100) : discount;

      let adjustedCost = Math.max(0, baseCost + extraCostsApplied - discountApplied);

      let profit = 0, subtotal = 0, price = 0, vatAmount = 0;

      if (item.method === 'costplus') {
        profit = adjustedCost * (pct / 100);
        subtotal = adjustedCost + profit;
      } else if (item.method === 'margin') {
        if (pct >= 100) { subtotal = 0; profit = 0; }
        else {
          subtotal = adjustedCost / (1 - pct / 100);
          profit = subtotal - adjustedCost;
        }
      }

      if (item.vatChecked) {
        vatAmount = subtotal * vatRate;
        price = subtotal + vatAmount;
      } else price = subtotal;

      item.totalCost = baseCost;
      item.adjustedCost = adjustedCost;
      item.profit = profit;
      item.vatAmount = vatAmount;
      item.finalPrice = price;

      totalQty += qty;
      totalCost += baseCost;
      totalProfit += profit;
      totalPrice += price;
      totalDiscount += discountApplied;
      totalExtra += extraCostsApplied;
      totalVat += vatAmount;
    });

    this.elements.totalQtyTd.textContent = this.formatNumber(totalQty, 0);
    this.elements.totalCostTd.textContent = this.formatNumber(totalCost * this.state.currencyRate);
    this.elements.totalProfitTd.textContent = this.formatNumber(totalProfit * this.state.currencyRate);
    this.elements.totalPriceTd.textContent = this.formatNumber(totalPrice * this.state.currencyRate);
    this.elements.totalDiscountTd.textContent = this.formatNumber(totalDiscount * this.state.currencyRate);
    this.elements.totalExtraTd.textContent = this.formatNumber(totalExtra * this.state.currencyRate);
    this.elements.totalVatTd.textContent = this.formatNumber(totalVat * this.state.currencyRate);

    // Update KPI cards if present
    const kCost = document.getElementById('kpi-total-cost');
    const kProfit = document.getElementById('kpi-total-profit');
    const kFinal = document.getElementById('kpi-final-price');
    if (kCost && kProfit && kFinal) {
      kCost.textContent = this.formatNumber(totalCost * this.state.currencyRate);
      kProfit.textContent = this.formatNumber(totalProfit * this.state.currencyRate);
      kFinal.textContent = this.formatNumber(totalPrice * this.state.currencyRate);
      const c = this.state.currency;
      const c1 = document.getElementById('kpi-currency-1');
      const c2 = document.getElementById('kpi-currency-2');
      const c3 = document.getElementById('kpi-currency-3');
      if (c1) c1.textContent = c; if (c2) c2.textContent = c; if (c3) c3.textContent = c;
    }

    this.renderTable();
    this.drawCharts();
    this.saveState();
  },

  // Modal
  showModal() { this.elements.itemModal.style.display = "flex"; },
  hideModal() { this.elements.itemModal.style.display = "none"; this.editingIndex = null; },
  openAddModal() {
    this.editingIndex = null;
    this.renderModalOptions();
    this.resetModal();
    this.updateModalTexts();
    this.showModal();
  },
  openEditModal(index) {
    this.editingIndex = index;
    const item = this.state.items[index];
    this.renderModalOptions();
    document.getElementById('itemNameModal').value = item.name;
    document.getElementById('itemUnitModal').value = item.unit;
    document.getElementById('itemQuantityModal').value = this.formatInputValue(item.quantity);
    document.getElementById('itemCostModal').value = this.formatInputValue(item.costPerUnit);
    document.getElementById('itemPctModal').value = this.formatInputValue(item.pct);
    document.getElementById('itemDiscountModal').value = this.formatInputValue(item.discount);
    document.getElementById('itemDiscountTypeModal').value = item.discountType;
    document.getElementById('itemExtraModal').value = this.formatInputValue(item.extra);
    document.getElementById('itemExtraTypeModal').value = item.extraType;
    document.getElementById('itemMethodModal').value = item.method;
    document.getElementById('itemVatModal').checked = item.vatChecked;
    document.getElementById('itemNotesModal').value = item.notes;
    document.getElementById('nameErrorModal').style.display = 'none';
    document.getElementById('pctErrorModal').style.display = 'none';
    this.updateModalTexts();
    this.showModal();
  },
  resetModal() {
    document.getElementById('itemNameModal').value = '';
    document.getElementById('itemQuantityModal').value = '';
    document.getElementById('itemCostModal').value = '';
    document.getElementById('itemPctModal').value = '';
    document.getElementById('itemDiscountModal').value = '';
    document.getElementById('itemExtraModal').value = '';
    document.getElementById('itemVatModal').checked = false;
    document.getElementById('itemNotesModal').value = '';
    document.getElementById('nameErrorModal').style.display = 'none';
    document.getElementById('pctErrorModal').style.display = 'none';
  },
  saveItem() {
    const item = {
      name: document.getElementById('itemNameModal').value,
      unit: document.getElementById('itemUnitModal').value,
      quantity: parseFloat(this.toEnglishDigits(document.getElementById('itemQuantityModal').value)) || 0,
      costPerUnit: parseFloat(this.toEnglishDigits(document.getElementById('itemCostModal').value)) || 0,
      pct: parseFloat(this.toEnglishDigits(document.getElementById('itemPctModal').value)) || 0,
      discount: parseFloat(this.toEnglishDigits(document.getElementById('itemDiscountModal').value)) || 0,
      discountType: document.getElementById('itemDiscountTypeModal').value,
      extra: parseFloat(this.toEnglishDigits(document.getElementById('itemExtraModal').value)) || 0,
      extraType: document.getElementById('itemExtraTypeModal').value,
      method: document.getElementById('itemMethodModal').value,
      vatChecked: document.getElementById('itemVatModal').checked,
      notes: document.getElementById('itemNotesModal').value
    };
    if (item.name.trim() === '') {
      const errorEl = document.getElementById('nameErrorModal');
      errorEl.textContent = this.i18n[this.state.currentLang].validation.emptyName;
      errorEl.style.display = 'block';
      return;
    }
    if (item.method === 'margin' && item.pct >= 100) {
      const errorEl = document.getElementById('pctErrorModal');
      errorEl.textContent = this.i18n[this.state.currentLang].validation.marginError;
      errorEl.style.display = 'block';
      return;
    }
    if (this.editingIndex !== null) this.state.items[this.editingIndex] = item;
    else this.state.items.push(item);

    this.calculateAll();
    this.hideModal();
    this.resetModal();
    this.updateModalTexts();
  },

  // Table
  renderTable() {
    this.elements.itemsTableBody.innerHTML = '';
    this.state.items.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.dataset.index = index;
      const tdTemplate = `
        <td>${this.formatNumber(index + 1, 0)}</td>

        <td>
          <input type="text" class="edit-input" data-field="name"
            aria-label="${this.i18n[this.state.currentLang].tableHeaders[1]}"
            value="${item.name}" oninput="App.handleInlineEdit(event, ${index})">
        </td>

        <td>
          <select class="edit-select" data-field="unit"
            aria-label="${this.i18n[this.state.currentLang].tableHeaders[2]}"
            onchange="App.handleInlineEdit(event, ${index})">
            ${this.renderUnitOptions(item.unit)}
          </select>
        </td>

        <td>
          <input type="text" class="edit-input numeric-input" data-field="quantity"
            aria-label="${this.i18n[this.state.currentLang].tableHeaders[3]}"
            value="${this.formatInputValue(item.quantity)}" inputmode="decimal"
            oninput="App.handleInlineEdit(event, ${index})">
        </td>

        <td>
          <input type="text" class="edit-input numeric-input" data-field="costPerUnit"
            aria-label="${this.i18n[this.state.currentLang].tableHeaders[4]}"
            value="${this.formatInputValue(item.costPerUnit)}" inputmode="decimal"
            oninput="App.handleInlineEdit(event, ${index})">
        </td>

        <td>${this.formatNumber(item.totalCost * this.state.currencyRate)}</td>

        <td>
          <input type="text" class="edit-input numeric-input" data-field="pct"
            aria-label="${this.i18n[this.state.currentLang].tableHeaders[6]}"
            value="${this.formatInputValue(item.pct)}" inputmode="decimal"
            oninput="App.handleInlineEdit(event, ${index})">
          <div class="inline-error pct-error-${index}"></div>
        </td>

        <td>
          <input type="text" class="edit-input numeric-input" data-field="discount"
            aria-label="${this.i18n[this.state.currentLang].tableHeaders[7]}"
            value="${this.formatInputValue(item.discount)}" inputmode="decimal"
            oninput="App.handleInlineEdit(event, ${index})">
          <select class="edit-select" data-field="discountType"
            aria-label="${this.i18n[this.state.currentLang].discountTypes.percent}/${this.i18n[this.state.currentLang].discountTypes.amount}"
            onchange="App.handleInlineEdit(event, ${index})">
            ${this.renderDiscountTypeOptions(item.discountType)}
          </select>
        </td>

        <td>
          <input type="text" class="edit-input numeric-input" data-field="extra"
            aria-label="${this.i18n[this.state.currentLang].tableHeaders[8]}"
            value="${this.formatInputValue(item.extra)}" inputmode="decimal"
            oninput="App.handleInlineEdit(event, ${index})">
          <select class="edit-select" data-field="extraType"
            aria-label="${this.i18n[this.state.currentLang].extraTypes.total}/${this.i18n[this.state.currentLang].extraTypes.perunit}"
            onchange="App.handleInlineEdit(event, ${index})">
            ${this.renderExtraTypeOptions(item.extraType)}
          </select>
        </td>

        <td>
          <select class="edit-select" data-field="method"
            aria-label="${this.i18n[this.state.currentLang].tableHeaders[9]}"
            onchange="App.handleInlineEdit(event, ${index})">
            ${this.renderMethodOptions(item.method)}
          </select>
        </td>

        <td>
          <input type="checkbox" class="edit-checkbox" data-field="vatChecked"
            aria-label="${this.i18n[this.state.currentLang].vatRateLabel}"
            ${item.vatChecked ? 'checked' : ''} onchange="App.handleInlineEdit(event, ${index})">
          <span class="vat-amount">${this.formatNumber(item.vatAmount * this.state.currencyRate)}</span>
        </td>

        <td>${this.formatNumber(item.profit * this.state.currencyRate)}</td>
        <td>${this.formatNumber(item.finalPrice * this.state.currencyRate)}</td>

        <td class="notes-cell">
          <input type="text" class="edit-input" data-field="notes"
            aria-label="${this.i18n[this.state.currentLang].tableHeaders[13]}"
            value="${item.notes}" oninput="App.handleInlineEdit(event, ${index})">
        </td>

        <td class="action-cell">
          <button class="edit-btn" title="${this.i18n[this.state.currentLang].editBtn}"
            aria-label="${this.i18n[this.state.currentLang].editBtn}"
            onclick="App.openEditModal(${index})"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" aria-label="Delete"
            onclick="App.deleteItem(${index})"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tr.innerHTML = tdTemplate;
      this.elements.itemsTableBody.appendChild(tr);

      const pctInput = tr.querySelector('input[data-field="pct"]');
      pctInput.addEventListener('input', (e) => this.validateAndHandlePct(e, index));
      const methodSelect = tr.querySelector('select[data-field="method"]');
      methodSelect.addEventListener('change', (e) => this.validateAndHandlePct(e, index));
    });
  },
  validateAndHandlePct(event, index) {
    const method = this.state.items[index].method;
    const pct = parseFloat(this.toEnglishDigits(event.target.value));
    const errorEl = document.querySelector(`.pct-error-${index}`);
    if (method === 'margin' && pct >= 100) {
      errorEl.textContent = this.i18n[this.state.currentLang].validation.marginError;
      errorEl.style.display = 'block';
    } else errorEl.style.display = 'none';
    this.handleInlineEdit(event, index);
  },
  handleInlineEdit(event, index) {
    const field = event.target.dataset.field;
    let value = event.target.value;
    if (event.target.classList.contains('numeric-input')) value = parseFloat(this.toEnglishDigits(value)) || 0;
    else if (event.target.type === 'checkbox') value = event.target.checked;
    this.state.items[index][field] = value;
    this.calculateAll();
  },

  // Modal options
  renderModalOptions() {
    const unitSelect = document.getElementById('itemUnitModal');
    const discountTypeSelect = document.getElementById('itemDiscountTypeModal');
    const extraTypeSelect = document.getElementById('itemExtraTypeModal');
    const methodSelect = document.getElementById('itemMethodModal');
    unitSelect.innerHTML = this.renderUnitOptions('Piece');
    discountTypeSelect.innerHTML = this.renderDiscountTypeOptions('amount');
    extraTypeSelect.innerHTML = this.renderExtraTypeOptions('total');
    methodSelect.innerHTML = this.renderMethodOptions('costplus');
  },
  renderUnitOptions(selected) {
    const units = { Piece: 'Piece', Meter: 'Meter', Ton: 'Ton' };
    return Object.entries(units).map(([key]) =>
      `<option value="${key}" ${key === selected ? 'selected' : ''}>${this.i18n[this.state.currentLang].units[key]}</option>`
    ).join('');
  },
  renderMethodOptions(selected) {
    const methods = { costplus: 'costplus', margin: 'margin' };
    return Object.entries(methods).map(([key]) =>
      `<option value="${key}" ${key === selected ? 'selected' : ''}>${this.i18n[this.state.currentLang].methods[key]}</option>`
    ).join('');
  },
  renderDiscountTypeOptions(selected) {
    const types = { amount: 'amount', percent: 'percent' };
    return Object.entries(types).map(([key]) =>
      `<option value="${key}" ${key === selected ? 'selected' : ''}>${this.i18n[this.state.currentLang].discountTypes[key]}</option>`
    ).join('');
  },
  renderExtraTypeOptions(selected) {
    const types = { total: 'total', perunit: 'perunit' };
    return Object.entries(types).map(([key]) =>
      `<option value="${key}" ${key === selected ? 'selected' : ''}>${this.i18n[this.state.currentLang].extraTypes[key]}</option>`
    ).join('');
  },

  deleteItem(index) { this.state.items.splice(index, 1); this.calculateAll(); },
  clearAll() { this.state.items = []; this.calculateAll(); },

  // Import/Export
  downloadTemplate() {
    const headers = ["name", "unit", "qty", "costPerUnit", "pct", "discount", "discountType", "extra", "extraType", "method", "vat", "notes"];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.i18n[this.state.currentLang].validation.template);
    XLSX.writeFile(wb, `${this.i18n[this.state.currentLang].validation.template}.xlsx`);
  },
  importExcel(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (json.length < 2) throw new Error(this.i18n[this.state.currentLang].validation.importError);

        const headers = json[0].map(h => (h || '').trim());
        const rows = json.slice(1);

        const newItems = rows.map(row => {
          const item = {};
          headers.forEach((header, index) => { item[header] = row[index] ?? ''; });
          return {
            name: item.name,
            unit: item.unit,
            quantity: parseFloat(item.qty) || 0,
            costPerUnit: parseFloat(item.costPerUnit) || 0,
            pct: parseFloat(item.pct) || 0,
            discount: parseFloat(item.discount) || 0,
            discountType: item.discountType,
            extra: parseFloat(item.extra) || 0,
            extraType: item.extraType,
            method: item.method,
            vatChecked: item.vat === true || item.vat === 'TRUE' || item.vat === 'true' || item.vat === 1,
            notes: item.notes
          };
        });

        this.state.items = newItems;
        this.calculateAll();
        alert(this.i18n[this.state.currentLang].validation.importSuccess);
      } catch (error) {
        console.error("Import error:", error);
        alert(this.i18n[this.state.currentLang].validation.importError);
      }
    };
    reader.readAsArrayBuffer(file);
  },
  exportExcel() {
    const data = this.state.items.map(item => ({
      'Name': item.name,
      'Unit': this.i18n[this.state.currentLang].units[item.unit],
      'Qty': item.quantity,
      'Cost/Unit': item.costPerUnit,
      'Total Cost (SAR)': item.totalCost,
      'Total Cost': (item.totalCost * this.state.currencyRate).toFixed(2),
      'Percentage': item.pct,
      'Discount': item.discount,
      'Discount Type': this.i18n[this.state.currentLang].discountTypes[item.discountType],
      'Extra Costs': item.extra,
      'Extra Type': this.i18n[this.state.currentLang].extraTypes[item.extraType],
      'Method': this.i18n[this.state.currentLang].methods[item.method],
      'VAT Amount (SAR)': item.vatAmount.toFixed(2),
      'VAT Amount': (item.vatAmount * this.state.currencyRate).toFixed(2),
      'Profit (SAR)': item.profit.toFixed(2),
      'Profit': (item.profit * this.state.currencyRate).toFixed(2),
      'Final Price (SAR)': item.finalPrice.toFixed(2),
      'Final Price': (item.finalPrice * this.state.currencyRate).toFixed(2),
      'Notes': item.notes
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const summaryData = [
      [this.i18n[this.state.currentLang].projectNameLabel, this.state.projectName],
      [this.i18n[this.state.currentLang].projectDescLabel || 'Description', this.state.projectDesc || ''],
      [this.i18n[this.state.currentLang].currencyLabel, this.state.currency],
      [`Exchange Rate (1 SAR)`, this.state.currencyRate.toFixed(4)],
      [this.i18n[this.state.currentLang].vatRateLabel, this.elements.vatRateInput.value + "%"],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Items & Results");
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
    const date = new Date().toISOString().split('T')[0];
    const filename = `Cost_Estimate_${this.state.projectName || 'Project'}_${date}.xlsx`;
    XLSX.writeFile(wb, filename);
  },
  async exportPDF() {
    const doc = new jsPDF({ orientation: 'landscape' });

    if (this.state.currentLang === 'ar') {
      const fontUrl = 'https://cdn.jsdelivr.net/npm/@fontsource/cairo/files/cairo-arabic-400-normal.ttf';
      try {
        const fontBuffer = await fetch(fontUrl).then(res => res.arrayBuffer());
        const toBase64 = (buffer) => {
          let binary = '';
          const bytes = new Uint8Array(buffer);
          const chunk = 0x8000;
          for (let i = 0; i < bytes.length; i += chunk) {
            binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
          }
          return btoa(binary);
        };
        const fontBase64 = toBase64(fontBuffer);
        doc.addFileToVFS('Cairo.ttf', fontBase64);
        doc.addFont('Cairo.ttf', 'Cairo', 'normal');
        doc.setFont('Cairo');
      } catch (e) {
        console.error('Failed to load Arabic font', e);
      }
    }

    const logoImg = document.querySelector('.logo-container img');
    if (logoImg) {
      const canvas = document.createElement('canvas');
      canvas.width = logoImg.naturalWidth;
      canvas.height = logoImg.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(logoImg, 0, 0);
      const logoData = canvas.toDataURL('image/png');
      doc.addImage(logoData, 'PNG', 10, 5, 30, 20);
    }

    const headers = this.i18n[this.state.currentLang].tableHeaders.filter(h => h !== "Actions");
    const data = this.state.items.map((item, index) => [
      index + 1, item.name, this.i18n[this.state.currentLang].units[item.unit], item.quantity,
      (item.costPerUnit * this.state.currencyRate).toFixed(2),
      (item.totalCost * this.state.currencyRate).toFixed(2), item.pct,
      (item.discount * this.state.currencyRate).toFixed(2),
      (item.extra * this.state.currencyRate).toFixed(2),
      this.i18n[this.state.currentLang].methods[item.method],
      (item.vatAmount * this.state.currencyRate).toFixed(2),
      (item.profit * this.state.currencyRate).toFixed(2),
      (item.finalPrice * this.state.currencyRate).toFixed(2), item.notes
    ]);

    const totals = [
      { content: this.i18n[this.state.currentLang].totalLabel, colSpan: 3, styles: { halign: this.state.currentLang === 'ar' ? 'right' : 'left' } },
      this.elements.totalQtyTd.textContent, '',
      this.elements.totalCostTd.textContent, '',
      this.elements.totalDiscountTd.textContent,
      this.elements.totalExtraTd.textContent, '',
      this.elements.totalVatTd.textContent,
      this.elements.totalProfitTd.textContent,
      this.elements.totalPriceTd.textContent, ''
    ];

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    const pdfTitle = `${this.i18n[this.state.currentLang].headerTitle} - ${this.state.projectName || 'Project'}`;
    const filename = `Cost_Estimate_${this.state.projectName || 'Project'}_${dateStr}_${timeStr.replace(/:/g, '-')}.pdf`;

    doc.text(pdfTitle, 45, 20);
    doc.setFontSize(10);
    let y = 28;
    doc.text(`${this.i18n[this.state.currentLang].projectNameLabel}: ${this.state.projectName}`, 45, y);
    if (this.state.projectDesc) {
      y += 6;
      doc.text(`${this.i18n[this.state.currentLang].projectDescLabel || 'Description'}: ${this.state.projectDesc}`, 45, y);
    }
    y += 6;
    doc.text(`${this.i18n[this.state.currentLang].currencyLabel}: ${this.state.currency}, Rate: ${this.state.currencyRate.toFixed(4)}`, 45, y);
    y += 6;
    doc.text(`${this.i18n[this.state.currentLang].vatRateLabel}: ${this.elements.vatRateInput.value}%`, 45, y);
    y += 6;
    doc.text(`${this.i18n[this.state.currentLang].exportedOnLabel}: ${now.toLocaleString(this.state.currentLang === 'ar' ? 'ar-EG' : 'en-US')}`, 45, y);

    doc.autoTable({
      startY: 56,
      head: [headers],
      body: data,
      foot: [totals],
      styles: { font: this.state.currentLang === 'ar' ? 'Cairo' : 'helvetica', fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      didDrawPage: (data) => {
        if (this.state.currentLang === 'ar') {
          doc.setRTL(true);
          data.table.columns.forEach(col => { col.styles.halign = 'right'; });
        }
      }
    });

    doc.save(filename);
  },

  // ======================= PDF (Local Fonts + Templates) =======================
  Brand: { primary: [0,123,255], gray: [90,90,90], altRow: [245,247,250], kpiFill: [247,249,252] },

  async loadFontAsBase64(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Font fetch failed: ' + url);
    const buf = await res.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  },

  async ensurePdfFonts(doc, lang) {
    try {
      if (lang === 'ar') {
        const reg = await this.loadFontAsBase64('fonts/Almarai-Regular.ttf');
        const bold = await this.loadFontAsBase64('fonts/Almarai-Bold.ttf');
        doc.addFileToVFS('AppFont-Regular.ttf', reg);
        doc.addFileToVFS('AppFont-Bold.ttf', bold);
        doc.addFont('AppFont-Regular.ttf', 'AppFont', 'normal');
        doc.addFont('AppFont-Bold.ttf', 'AppFont', 'bold');
        if (doc.setRTL) doc.setRTL(true);
        doc.setFont('AppFont', 'normal');
      } else {
        try {
          const reg = await this.loadFontAsBase64('fonts/Inter-Regular.ttf');
          const bold = await this.loadFontAsBase64('fonts/Inter-Bold.ttf');
          doc.addFileToVFS('AppFont-Regular.ttf', reg);
          doc.addFileToVFS('AppFont-Bold.ttf', bold);
          doc.addFont('AppFont-Regular.ttf', 'AppFont', 'normal');
          doc.addFont('AppFont-Bold.ttf', 'AppFont', 'bold');
          doc.setFont('AppFont', 'normal');
        } catch (e1) {
          try {
            // Fallback: use Almarai even for EN if no Latin font provided
            const reg = await this.loadFontAsBase64('fonts/Almarai-Regular.ttf');
            const bold = await this.loadFontAsBase64('fonts/Almarai-Bold.ttf');
            doc.addFileToVFS('AppFont-Regular.ttf', reg);
            doc.addFileToVFS('AppFont-Bold.ttf', bold);
            doc.addFont('AppFont-Regular.ttf', 'AppFont', 'normal');
            doc.addFont('AppFont-Bold.ttf', 'AppFont', 'bold');
            doc.setFont('AppFont', 'normal');
          } catch (e2) {
            doc.setFont('helvetica', 'normal');
          }
        }
      }
    } catch (e) { console.warn('PDF fonts fallback', e); }
  },

  drawHeaderBand(doc, { title, logoSrc, y = 36, h = 36, isAr = false, margin = { left: 40, right: 40 } }) {
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFillColor(...this.Brand.primary);
    doc.rect(0, y - h, pageWidth, h, 'F');
    if (logoSrc) { try { doc.addImage(logoSrc, 'PNG', margin.left, y - h + 6, 28, 24); } catch(e){} }
    doc.setTextColor(255);
    doc.setFont(undefined, 'bold');
    const tx = margin.left + (logoSrc ? 36 : 0);
    doc.text(title, tx, y - 12, { align: 'left' });
    doc.setTextColor(0);
    doc.setFont(undefined, 'normal');
  },

  drawFooter(doc, { left = '', right = '', isAr = false }) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageCount = doc.getNumberOfPages();
    const pageCurrent = doc.getCurrentPageInfo().pageNumber;
    const footerText = isAr ? `الصفحة ${pageCurrent} من ${pageCount}` : `Page ${pageCurrent} of ${pageCount}`;
    doc.setFontSize(8);
    doc.setTextColor(...this.Brand.gray);
    doc.text(footerText, pageWidth - 40, pageHeight - 16, { align: 'right' });
    doc.text(left || (isAr ? 'تم الإنشاء بواسطة AdwanX' : 'Generated by AdwanX'), 40, pageHeight - 16);
    doc.setTextColor(0);
  },

  kpiCard(doc, { x, y, w, h, label, value, isAr = false }) {
    doc.setFillColor(...this.Brand.kpiFill);
    doc.roundedRect(x, y, w, h, 6, 6, 'F');
    doc.setFontSize(9);
    doc.setTextColor(...this.Brand.gray);
    doc.text(label, x + 10, y + 16);
    doc.setTextColor(0);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text(value, x + 10, y + 32);
    doc.setFont(undefined, 'normal');
  },

  async exportPDFByTemplate(template = 'summary') {
    const layout = {
      order: ['header', 'kpis', 'table', 'notes', 'footer'],
      includes: { header: true, kpis: template === 'summary', table: true, notes: true, footer: true },
      options: {
        reportTitle: (this.state.currentLang === 'ar' ? 'تقرير' : 'Report') + ' - ' + (this.state.projectName || ''),
        includeColumns: template === 'summary'
          ? ['#', 'name', 'quantity', 'totalCost', 'finalPrice']
          : ['#','name','unit','quantity','costPerUnit','totalCost','pct','discount','extra','method','vatAmount','profit','finalPrice','notes'],
        notesText: this.state.projectDesc || ''
      }
    };
    return this.exportPDFFromLayout(layout);
  },

  async exportPDFFromLayout(layout) {
    try {
      if (typeof this.calculateAll === 'function') this.calculateAll();
      const lang = this.state.currentLang === 'ar' ? 'ar' : 'en';
      const isAr = lang === 'ar';
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      await this.ensurePdfFonts(doc, lang);

      const margin = { left: 40, right: 40, top: 60, bottom: 40 };
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = margin.top;

      const getLogo = () => {
        const img = document.querySelector('.logo-container img');
        if (!img || !img.naturalWidth) return null;
        const c = document.createElement('canvas');
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
        return c.toDataURL('image/png');
      };

      const rate = this.state.currencyRate || 1;
      const currency = this.state.currency || 'SAR';
      const num = (v, d = 2) => (Number(v) || 0).toFixed(d);

      const buildRows = (cols) => (this.state.items || []).map((item, idx) => cols.map(c => {
        switch(c){
          case '#': return idx + 1;
          case 'name': return item.name || '';
          case 'unit': return this.i18n[lang].units[item.unit] || item.unit || '';
          case 'quantity': return num(item.quantity, 0);
          case 'costPerUnit': return num(item.costPerUnit * rate);
          case 'totalCost': return num((item.totalCost || (item.costPerUnit * item.quantity)) * rate);
          case 'pct': return num(item.pct);
          case 'discount': return item.discountType === 'percent' ? num(item.discount) : num(item.discount * rate);
          case 'extra': return num((item.extraType === 'perunit' ? (item.extra * item.quantity) : item.extra) * rate);
          case 'method': return this.i18n[lang].methods[item.method] || item.method;
          case 'vatAmount': return num((item.vatAmount || 0) * rate);
          case 'profit': return num((item.profit || 0) * rate);
          case 'finalPrice': return num((item.finalPrice || 0) * rate);
          case 'notes': return item.notes || '';
          default: return '';
        }
      }));

      const headersMap = { '#':0, name:1, unit:2, quantity:3, costPerUnit:4, totalCost:5, pct:6, discount:7, extra:8, method:9, vatAmount:10, profit:11, finalPrice:12, notes:13 };
      const translateHeader = key => {
        const th = this.i18n[lang].tableHeaders || [];
        if(key==='#') return th[0] || '#';
        const i = headersMap[key];
        return (i!=null ? th[i] : key) || key;
      };

      const order = (layout.order || ['header','kpis','table','notes','footer']).slice();
      const includes = Object.assign({ header:true,kpis:true,table:true,notes:true,footer:true }, layout.includes||{});
      const opts = Object.assign({ includeColumns: ['#','name','quantity','totalCost','finalPrice'], reportTitle: (isAr?'تقرير':'Report') }, layout.options||{});

      const title = (lang==='ar' ? 'حاسبة التكلفة التقديرية — ' : 'Material Cost Estimator — ') + (this.state.projectName || '');
      const logo = getLogo();

      const drawPerPage = (data) => {
        if (includes.header) this.drawHeaderBand(doc, { title, logoSrc: logo, y: 50, h: 40, isAr, margin });
        if (includes.footer) this.drawFooter(doc, { isAr });
      };

      for (const section of order) {
        if (!includes[section]) continue;
        if (section === 'header') {
          this.drawHeaderBand(doc, { title, logoSrc: logo, y: 50, h: 40, isAr, margin });
          y = 100;
        }
        if (section === 'kpis') {
          let totalCost=0, totalProfit=0, totalPrice=0;
          (this.state.items||[]).forEach(it=>{ totalCost += (it.totalCost||0); totalProfit += (it.profit||0); totalPrice += (it.finalPrice||0); });
          totalCost*=rate; totalProfit*=rate; totalPrice*=rate;
          const labels = [ this.i18n[lang].tableHeaders[5], this.i18n[lang].tableHeaders[11], this.i18n[lang].tableHeaders[12] ];
          const values = [ num(totalCost), num(totalProfit), num(totalPrice) ];
          const cardW = (pageWidth - margin.left - margin.right - 20) / 3; const h = 50; let x = margin.left; const g = 10;
          for(let i=0;i<3;i++) { this.kpiCard(doc, { x, y, w: cardW, h, label: labels[i], value: values[i], isAr }); x += cardW + g; }
          y += h + 16;
        }
        if (section === 'table') {
          const head = [opts.includeColumns.map(translateHeader)];
          const body = buildRows(opts.includeColumns);
          doc.autoTable({
            startY: Math.max(y, 110), head, body,
            styles: { font: (lang==='ar'?'AppFont':'AppFont'), fontSize: 8, cellPadding: 3, halign: (lang==='ar'?'right':'left') },
            headStyles: { fillColor: this.Brand.primary, textColor: 255, halign: (lang==='ar'?'right':'left') },
            alternateRowStyles: { fillColor: this.Brand.altRow },
            margin: { left: margin.left, right: margin.right, top: 110, bottom: margin.bottom },
            didDrawPage: drawPerPage
          });
          y = doc.lastAutoTable.finalY + 16;
        }
        if (section === 'notes' && (opts.notesText || this.state.projectDesc)) {
          const notes = opts.notesText || this.state.projectDesc || '';
          doc.setFontSize(10);
          const txt = (lang==='ar'?'ملاحظات: ':'Notes: ') + notes;
          doc.text(txt, margin.left, y + 12, { maxWidth: pageWidth - margin.left - margin.right, align: (lang==='ar'?'right':'left') });
          y += 28;
        }
        if (section === 'footer') { this.drawFooter(doc, { isAr }); }
      }

      const date = new Date().toISOString().split('T')[0];
      const filename = `Cost_Estimate_${this.state.projectName || 'Project'}_${date}_${(layout.options?.reportTitle||'').replace(/\s+/g,'_')}.pdf`;
      doc.save(filename);
    } catch (e) {
      console.error('exportPDFFromLayout failed', e);
      alert(this.i18n[this.state.currentLang].validation.pdfExportFailed || 'PDF export failed');
    }
  },

  // Charts
  drawCharts() {
    const itemNames = this.state.items.map((item, i) => item.name || `Item ${i + 1}`);
    const itemCosts = this.state.items.map(item => item.totalCost * this.state.currencyRate);
    const itemProfits = this.state.items.map(item => item.profit * this.state.currencyRate);
    const totalCost = itemCosts.reduce((a, b) => a + b, 0);
    const totalProfit = itemProfits.reduce((a, b) => a + b, 0);
    const chartFontColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-text').trim();
    const chartGridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim();

    if (this.charts.barChart) this.charts.barChart.destroy();
    this.charts.barChart = new Chart(this.elements.costProfitBarChartCanvas, {
      type: 'bar',
      data: {
        labels: itemNames,
        datasets: [
          { label: this.i18n[this.state.currentLang].tableHeaders[5], data: itemCosts, backgroundColor: 'rgba(54, 162, 235, 0.7)', borderColor: 'rgb(54, 162, 235)', borderWidth: 1 },
          { label: this.i18n[this.state.currentLang].tableHeaders[11], data: itemProfits, backgroundColor: 'rgba(75, 192, 192, 0.7)', borderColor: 'rgb(75, 192, 192)', borderWidth: 1 }
        ]
      },
      options: {
        responsive: true,
        scales: { x: { ticks: { color: chartFontColor }, grid: { color: chartGridColor } }, y: { ticks: { color: chartFontColor }, grid: { color: chartGridColor } } },
        plugins: { legend: { labels: { color: chartFontColor } }, title: { display: true, text: this.i18n[this.state.currentLang].chartLabels.costVsProfit, color: chartFontColor } }
      }
    });

    if (this.charts.pieChart) this.charts.pieChart.destroy();
    this.charts.pieChart = new Chart(this.elements.costProfitPieChartCanvas, {
      type: 'pie',
      data: {
        labels: [this.i18n[this.state.currentLang].chartLabels.totalCost, this.i18n[this.state.currentLang].chartLabels.totalProfit],
        datasets: [{
          data: [totalCost, totalProfit],
          backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)'],
          borderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: chartFontColor } }, title: { display: true, text: this.i18n[this.state.currentLang].chartLabels.totalCostVsProfit, color: chartFontColor } }
      }
    });
  }
};

// ---- App bootstrap
document.addEventListener('DOMContentLoaded', () => {
  App.init();

  // Tabs logic (ARIA + keyboard)
  const nav = document.querySelector('.ax-tabs-nav');
  if (nav && !nav.hasAttribute('role')) nav.setAttribute('role', 'tablist');

  const axTabs = Array.from(document.querySelectorAll('.ax-tab'));
  const axPanels = Array.from(document.querySelectorAll('.ax-tabs-panel'));

  // Ensure roles/associations
  axTabs.forEach((tab, i) => {
    if (!tab.hasAttribute('role')) tab.setAttribute('role', 'tab');
    if (!tab.id) tab.id = `ax-tab-${i}`;
    const target = tab.getAttribute('data-target');
    const panel = axPanels.find(p => p.getAttribute('data-tab') === target) || document.getElementById(`panel-${target}`);
    if (panel) {
      if (!panel.id) panel.id = `ax-panel-${target}`;
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
    }
    tab.setAttribute('tabindex', tab.getAttribute('aria-selected') === 'true' ? '0' : '-1');
  });

  function axActivate(target, { pushHash = false, remember = true } = {}) {
    axTabs.forEach(tab => {
      const selected = tab.getAttribute('data-target') === target;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.setAttribute('tabindex', selected ? '0' : '-1');
      if (selected) tab.focus({ preventScroll: true });
    });

    axPanels.forEach(panel => {
      const isActive = panel.getAttribute('data-tab') === target;
      panel.classList.toggle('ax-active', isActive);
      panel.toggleAttribute('hidden', !isActive);
    });

    if (pushHash) {
      const hash = '#' + encodeURIComponent(target.replace(/\s+/g, '-'));
      if (location.hash !== hash) history.replaceState(null, '', hash);
    }
    if (remember) localStorage.setItem('ax-last-tab', target);
  }

  axTabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => axActivate(tab.getAttribute('data-target')));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = axTabs[(idx + dir + axTabs.length) % axTabs.length];
        next.focus();
        axActivate(next.getAttribute('data-target'));
      }
    });
  });

  // initial target: hash > saved > first selected
  function initialTarget() {
    if (location.hash) {
      const raw = decodeURIComponent(location.hash.slice(1)).replace(/-/g, ' ');
      const has = axPanels.some(p => (p.getAttribute('data-tab') || '').trim() === raw.trim());
      if (has) return raw;
    }
    const saved = localStorage.getItem('ax-last-tab');
    if (saved && axPanels.some(p => (p.getAttribute('data-tab') || '').trim() === saved.trim())) return saved;
    const initialBtn = document.querySelector('.ax-tab[aria-selected="true"]');
    return initialBtn ? initialBtn.getAttribute('data-target') : (axTabs[0]?.getAttribute('data-target') || '');
  }
  const start = initialTarget();
  if (start) axActivate(start, { pushHash: false, remember: false });
});
