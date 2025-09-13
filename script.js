const { jsPDF } = window.jspdf;
const App = {
   i18n: {
       en: {
           title: "Material Cost Estimator | حاسبة التكلفة التقديرية للمواد",
           headerTitle: "Material Cost Estimator",
           projectDetailsTitle: "Project Details",
           projectNameLabel: "Project Name",
           vatRateLabel: "VAT Rate %",
           currencyLabel: "Currency",
           refreshRateBtn: "Refresh Rate",
           itemManagementTitle: "Item Management",
           addItemBtn: "Add Item",
           clearAllBtn: "Clear All",
           modalTitle: "Add New Item",
           saveItemBtn: "Save Item",
           tableHeaders: ["#", "Item", "Unit", "Qty", "Cost/Unit", "Total Cost", "%", "Discount", "Extra Costs", "Method", "VAT Amount", "Profit", "Final Price", "Notes", "Actions"],
           totalLabel: "Totals",
           reportManagementTitle: "Report Management",
           exportExcelBtn: "Export Excel",
           exportPDFBtn: "Export PDF",
           printBtn: "Print Report",
           downloadTemplateBtn: "Download Excel Template",
           importExcelBtn: "Import Excel",
           chartsTitle: "Charts",
           savedMessage: "Auto-saved",
           langLabel: "العربية",
           themeLabel: "Dark Mode",
           units: {
               Piece: "Piece", Meter: "Meter", Ton: "Ton"
           },
           methods: {
               costplus: "Cost Plus", margin: "Margin"
           },
           discountTypes: {
               amount: "Amount", percent: "Percent"
           },
           extraTypes: {
               total: "Total", perunit: "Per Unit"
           },
           validation: {
               emptyName: "Item name cannot be empty.",
               marginError: "Percentage must be less than 100 for Margin method.",
               rateFetchFailed: "Failed to fetch currency rate. Using fallback rate of 1.0.",
               noItemsToCalc: "No items to calculate.",
               importSuccess: "Items imported successfully.",
               importError: "Failed to import Excel file. Please check the file format.",
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
           refreshRateBtn: "تحديث السعر",
           itemManagementTitle: "إدارة البنود",
           addItemBtn: "إضافة بند",
           clearAllBtn: "مسح الكل",
           modalTitle: "إضافة بند جديد",
           saveItemBtn: "حفظ البند",
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
           units: {
               Piece: "قطعة", Meter: "متر", Ton: "طن"
           },
           methods: {
               costplus: "التكلفة +", margin: "هامش الربح"
           },
           discountTypes: {
               amount: "قيمة", percent: "نسبة"
           },
           extraTypes: {
               total: "إجمالي", perunit: "للوحدة"
           },
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
       projectName: ''
   },
    // UI Elements
   elements: {
       appTitle: document.getElementById('app-title'),
       headerTitle: document.getElementById('header-title'),
       projectNameInput: document.getElementById('projectName'),
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
    // Chart Instances
   charts: {
       barChart: null,
       pieChart: null
   },
   
   // Initialization
   init() {
       this.loadState();
       this.bindEvents();
       this.setLanguage();
       this.updateRateInfo();
       this.renderTable();
       this.calculateAll();
   },
    // Event Binding
   bindEvents() {
       this.elements.addItemBtn.addEventListener('click', () => this.showModal());
       this.elements.saveItemBtn.addEventListener('click', () => this.saveItem());
       this.elements.closeModalBtn.addEventListener('click', () => this.hideModal());
       this.elements.projectNameInput.addEventListener('input', () => this.saveState());
       this.elements.vatRateInput.addEventListener('input', () => this.calculateAll());
       this.elements.currencySelect.addEventListener('change', () => this.updateCurrencyRates());
       document.getElementById('refreshRateBtn').addEventListener('click', () => this.updateCurrencyRates());
       document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAll());
       document.getElementById('exportExcelBtn').addEventListener('click', () => this.exportExcel());
       document.getElementById('exportPDFBtn').addEventListener('click', () => this.exportPDF());
       document.getElementById('printBtn').addEventListener('click', () => window.print());
       document.getElementById('downloadTemplateBtn').addEventListener('click', () => this.downloadTemplate());
       document.getElementById('importExcelBtn').addEventListener('click', () => this.elements.importExcelInput.click());
       this.elements.importExcelInput.addEventListener('change', (e) => this.importExcel(e));
       this.elements.themeToggle.addEventListener('change', () => this.setTheme());
       this.elements.langToggle.addEventListener('change', () => this.setLanguage());
       
       window.addEventListener('click', (event) => {
           if (event.target === this.elements.itemModal) {
               this.hideModal();
           }
       });
   },
    // State Management
   saveState() {
       this.state.vatRate = parseFloat(this.elements.vatRateInput.value) || 0;
       this.state.projectName = this.elements.projectNameInput.value;
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
           this.elements.currencySelect.value = this.state.currency;
           if (this.state.currentTheme === 'dark') {
               this.elements.themeToggle.checked = true;
               document.documentElement.classList.add('dark');
           }
           if (this.state.currentLang === 'ar') {
               this.elements.langToggle.checked = true;
               document.documentElement.setAttribute('dir', 'rtl');
           }
       } else {
           this.addDemoItems();
       }
   },
    addDemoItems() {
       this.state.items = [
           {
               name: "Steel Rebars", unit: "Ton", quantity: 50, costPerUnit: 2500, pct: 15,
               discount: 0, discountType: "amount", extra: 0, extraType: "total",
               method: "costplus", vatChecked: true, notes: "High quality steel"
           },
           {
               name: "Concrete", unit: "Meter", quantity: 200, costPerUnit: 350, pct: 25,
               discount: 500, discountType: "amount", extra: 5, extraType: "perunit",
               method: "margin", vatChecked: false, notes: "Ready-mix concrete"
           }
       ];
       this.calculateAll();
   },
    showSavedMessage() {
       this.elements.savedMessage.textContent = this.i18n[this.state.currentLang].savedMessage;
       this.elements.savedMessage.style.display = 'block';
       setTimeout(() => this.elements.savedMessage.style.display = 'none', 2000);
   },
    // Language & Theme
   setLanguage() {
       this.state.currentLang = this.elements.langToggle.checked ? 'ar' : 'en';
       document.documentElement.setAttribute('dir', this.state.currentLang === 'ar' ? 'rtl' : 'ltr');
       
       const translatableElements = {
           'app-title': 'title', 'header-title': 'headerTitle', 'project-details-title': 'projectDetailsTitle',
           'project-name-label': 'projectNameLabel', 'vat-rate-label': 'vatRateLabel',
           'currency-label': 'currencyLabel', 'refresh-rate-btn': 'refreshRateBtn',
           'item-management-title': 'itemManagementTitle', 'add-item-btn': 'addItemBtn',
           'clear-all-btn': 'clearAllBtn', 'total-label': 'totalLabel',
           'report-management-title': 'reportManagementTitle', 'export-excel-btn': 'exportExcelBtn',
           'export-pdf-btn': 'exportPDFBtn', 'print-btn': 'printBtn',
           'download-template-btn': 'downloadTemplateBtn', 'import-excel-btn': 'importExcelBtn',
           'charts-title': 'chartsTitle', 'lang-label': 'langLabel',
           'theme-label': 'themeLabel', 'modal-title': 'modalTitle', 'save-item-btn-text': 'saveItemBtn'
       };
       
       for (const [id, key] of Object.entries(translatableElements)) {
           const el = document.getElementById(id);
           if (el) el.textContent = this.i18n[this.state.currentLang][key];
       }
       
       const headers = document.getElementById('table-headers').children;
       this.i18n[this.state.currentLang].tableHeaders.forEach((text, index) => {
           if (headers[index]) headers[index].textContent = text;
       });
        this.renderModalOptions();
       this.renderTable();
       this.drawCharts();
       this.updateRateInfo();
       this.saveState();
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
       this.elements.rateInfoSpan.textContent = `1 SAR = ${this.state.currencyRate.toFixed(4)} ${currency}`;
   },
    // Core Calculation
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
           
            let adjustedCost = baseCost + extraCostsApplied - discountApplied;
            adjustedCost = Math.max(0, adjustedCost);

            let profit, basePrice, price, vatAmount = 0;
            if (item.method === 'costplus') {
                profit = adjustedCost * (pct / 100);
                basePrice = adjustedCost + profit;
            } else if (item.method === 'margin') {
                if (pct >= 100) {
                    basePrice = 0;
                    profit = 0;
                } else {
                    basePrice = adjustedCost / (1 - pct / 100);
                    profit = basePrice - adjustedCost;
                }
            }

            if (item.vatChecked) {
                vatAmount = basePrice * vatRate;
                price = basePrice + vatAmount;
            } else {
                price = basePrice;
            }

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
        this.elements.totalQtyTd.textContent = totalQty.toFixed(0);
       this.elements.totalCostTd.textContent = (totalCost * this.state.currencyRate).toFixed(2);
       this.elements.totalProfitTd.textContent = (totalProfit * this.state.currencyRate).toFixed(2);
       this.elements.totalPriceTd.textContent = (totalPrice * this.state.currencyRate).toFixed(2);
       this.elements.totalDiscountTd.textContent = (totalDiscount * this.state.currencyRate).toFixed(2);
       this.elements.totalExtraTd.textContent = (totalExtra * this.state.currencyRate).toFixed(2);
       this.elements.totalVatTd.textContent = (totalVat * this.state.currencyRate).toFixed(2);

       this.renderTable();
       this.drawCharts();
       this.saveState();
   },
    // Modal & Item Management
   showModal() {
       this.elements.itemModal.style.display = "flex";
       this.renderModalOptions();
       this.resetModal();
   },
    hideModal() {
       this.elements.itemModal.style.display = "none";
   },
    resetModal() {
       document.getElementById('itemNameModal').value = '';
       document.getElementById('itemQuantityModal').value = 0;
       document.getElementById('itemCostModal').value = 0;
       document.getElementById('itemPctModal').value = 0;
       document.getElementById('itemDiscountModal').value = 0;
       document.getElementById('itemExtraModal').value = 0;
       document.getElementById('itemVatModal').checked = false;
       document.getElementById('itemNotesModal').value = '';
       document.getElementById('nameErrorModal').style.display = 'none';
       document.getElementById('pctErrorModal').style.display = 'none';
   },
    saveItem() {
       const item = {
           name: document.getElementById('itemNameModal').value,
           unit: document.getElementById('itemUnitModal').value,
           quantity: parseFloat(document.getElementById('itemQuantityModal').value) || 0,
           costPerUnit: parseFloat(document.getElementById('itemCostModal').value) || 0,
           pct: parseFloat(document.getElementById('itemPctModal').value) || 0,
           discount: parseFloat(document.getElementById('itemDiscountModal').value) || 0,
           discountType: document.getElementById('itemDiscountTypeModal').value,
           extra: parseFloat(document.getElementById('itemExtraModal').value) || 0,
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
        this.state.items.push(item);
       this.calculateAll();
       this.hideModal();
   },
    // Table Rendering
   renderTable() {
       this.elements.itemsTableBody.innerHTML = '';
       this.state.items.forEach((item, index) => {
           const tr = document.createElement('tr');
           tr.dataset.index = index;
            const tdTemplate = `
               <td>${index + 1}</td>
               <td><input type="text" class="edit-input" data-field="name" value="${item.name}" oninput="App.handleInlineEdit(event, ${index})"></td>
               <td><select class="edit-select" data-field="unit" onchange="App.handleInlineEdit(event, ${index})">${this.renderUnitOptions(item.unit)}</select></td>
               <td><input type="number" class="edit-input" data-field="quantity" value="${item.quantity}" min="0" step="1" oninput="App.handleInlineEdit(event, ${index})"></td>
               <td><input type="number" class="edit-input" data-field="costPerUnit" value="${item.costPerUnit}" min="0" step="0.01" oninput="App.handleInlineEdit(event, ${index})"></td>
               <td>${(item.totalCost * this.state.currencyRate).toFixed(2) || '0.00'}</td>
               <td><input type="number" class="edit-input" data-field="pct" value="${item.pct}" min="0" max="99.99" step="0.01" oninput="App.handleInlineEdit(event, ${index})">
               <div class="inline-error pct-error-${index}"></div>
               </td>
               <td>
                   <input type="number" class="edit-input" data-field="discount" value="${item.discount}" min="0" step="0.01" oninput="App.handleInlineEdit(event, ${index})">
                   <select class="edit-select" data-field="discountType" onchange="App.handleInlineEdit(event, ${index})">${this.renderDiscountTypeOptions(item.discountType)}</select>
               </td>
               <td>
                   <input type="number" class="edit-input" data-field="extra" value="${item.extra}" min="0" step="0.01" oninput="App.handleInlineEdit(event, ${index})">
                   <select class="edit-select" data-field="extraType" onchange="App.handleInlineEdit(event, ${index})">${this.renderExtraTypeOptions(item.extraType)}</select>
               </td>
               <td><select class="edit-select" data-field="method" onchange="App.handleInlineEdit(event, ${index})">${this.renderMethodOptions(item.method)}</select></td>
               <td>
                   <input type="checkbox" class="edit-checkbox" data-field="vatChecked" ${item.vatChecked ? 'checked' : ''} onchange="App.handleInlineEdit(event, ${index})">
                   <span class="vat-amount">${(item.vatAmount * this.state.currencyRate).toFixed(2) || '0.00'}</span>
               </td>
               <td>${(item.profit * this.state.currencyRate).toFixed(2) || '0.00'}</td>
               <td>${(item.finalPrice * this.state.currencyRate).toFixed(2) || '0.00'}</td>
               <td class="notes-cell"><input type="text" class="edit-input" data-field="notes" value="${item.notes}" oninput="App.handleInlineEdit(event, ${index})"></td>
               <td class="action-cell"><button class="delete-btn" onclick="App.deleteItem(${index})"><i class="fas fa-trash"></i></button></td>
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
       const pct = parseFloat(event.target.value);
       const errorEl = document.querySelector(`.pct-error-${index}`);
       
       if (method === 'margin' && pct >= 100) {
           errorEl.textContent = this.i18n[this.state.currentLang].validation.marginError;
           errorEl.style.display = 'block';
       } else {
           errorEl.style.display = 'none';
       }
       this.handleInlineEdit(event, index);
   },
    handleInlineEdit(event, index) {
       const field = event.target.dataset.field;
       let value = event.target.value;
        if (event.target.type === 'number') {
           value = parseFloat(value) || 0;
       } else if (event.target.type === 'checkbox') {
           value = event.target.checked;
       }
        this.state.items[index][field] = value;
       this.calculateAll();
   },
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
       const options = Object.entries(units).map(([key, value]) =>
           `<option value="${key}" ${key === selected ? 'selected' : ''}>${this.i18n[this.state.currentLang].units[key]}</option>`
       );
       return options.join('');
   },
    renderMethodOptions(selected) {
       const methods = { costplus: 'costplus', margin: 'margin' };
       const options = Object.entries(methods).map(([key, value]) =>
           `<option value="${key}" ${key === selected ? 'selected' : ''}>${this.i18n[this.state.currentLang].methods[key]}</option>`
       );
       return options.join('');
   },
    renderDiscountTypeOptions(selected) {
       const types = { amount: 'amount', percent: 'percent' };
       const options = Object.entries(types).map(([key, value]) =>
           `<option value="${key}" ${key === selected ? 'selected' : ''}>${this.i18n[this.state.currentLang].discountTypes[key]}</option>`
       );
       return options.join('');
   },
    renderExtraTypeOptions(selected) {
       const types = { total: 'total', perunit: 'perunit' };
       const options = Object.entries(types).map(([key, value]) =>
           `<option value="${key}" ${key === selected ? 'selected' : ''}>${this.i18n[this.state.currentLang].extraTypes[key]}</option>`
       );
       return options.join('');
   },
    deleteItem(index) {
       this.state.items.splice(index, 1);
       this.calculateAll();
   },
    clearAll() {
       this.state.items = [];
       this.calculateAll();
   },
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
                if (json.length < 2) {
                   throw new Error(this.i18n[this.state.currentLang].validation.importError);
               }
                const headers = json[0].map(h => h.trim());
               const rows = json.slice(1);
               
               const newItems = rows.map(row => {
                   const item = {};
                   headers.forEach((header, index) => {
                       item[header] = row[index] || '';
                   });
                   
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
           'Name': item.name, 'Unit': this.i18n[this.state.currentLang].units[item.unit], 'Qty': item.quantity,
           'Cost/Unit': item.costPerUnit, 'Total Cost (SAR)': item.totalCost,
           'Total Cost': (item.totalCost * this.state.currencyRate).toFixed(2),
           'Percentage': item.pct, 'Discount': item.discount,
           'Discount Type': this.i18n[this.state.currentLang].discountTypes[item.discountType],
           'Extra Costs': item.extra, 'Extra Type': this.i18n[this.state.currentLang].extraTypes[item.extraType],
           'Method': this.i18n[this.state.currentLang].methods[item.method],
           'VAT Amount (SAR)': item.vatAmount.toFixed(2), 'VAT Amount': (item.vatAmount * this.state.currencyRate).toFixed(2),
           'Profit (SAR)': item.profit.toFixed(2),
           'Profit': (item.profit * this.state.currencyRate).toFixed(2),
           'Final Price (SAR)': item.finalPrice.toFixed(2),
           'Final Price': (item.finalPrice * this.state.currencyRate).toFixed(2),
           'Notes': item.notes
       }));
        const ws = XLSX.utils.json_to_sheet(data);
       const summaryData = [
           [this.i18n[this.state.currentLang].projectNameLabel, this.state.projectName],
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
    exportPDF() {
       const doc = new jsPDF({ orientation: 'landscape' });
       
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
           this.i18n[this.state.currentLang].totalLabel,
           '', '', this.elements.totalQtyTd.textContent, '', this.elements.totalCostTd.textContent,
           '', this.elements.totalDiscountTd.textContent, this.elements.totalExtraTd.textContent,
           '', this.elements.totalVatTd.textContent, this.elements.totalProfitTd.textContent, this.elements.totalPriceTd.textContent, ''
       ];
       data.push(totals);
        const date = new Date().toISOString().split('T')[0];
       const pdfTitle = `${this.i18n[this.state.currentLang].headerTitle} - ${this.state.projectName || 'Project'}`;
       const filename = `Cost_Estimate_${this.state.projectName || 'Project'}_${date}.pdf`;
        doc.text(pdfTitle, 14, 20);
       doc.setFontSize(10);
       doc.text(`${this.i18n[this.state.currentLang].projectNameLabel}: ${this.state.projectName}`, 14, 28);
       doc.text(`${this.i18n[this.state.currentLang].currencyLabel}: ${this.state.currency}, Rate: ${this.state.currencyRate.toFixed(4)}`, 14, 34);
       doc.text(`${this.i18n[this.state.currentLang].vatRateLabel}: ${this.elements.vatRateInput.value}%`, 14, 40);
        doc.autoTable({
           startY: 50,
           head: [headers],
           body: data,
           styles: { font: "helvetica", fontSize: 8 },
           headStyles: { fillColor: [41, 128, 185], textColor: 255 },
           didDrawPage: (data) => {
               if (this.state.currentLang === 'ar') {
                   doc.setRTL(true);
                   data.table.columns.forEach(col => col.styles.halign = 'right');
               }
           }
       });
        doc.save(filename);
   },
    // Charts
   drawCharts() {
       const itemNames = this.state.items.map(item => item.name || `Item ${this.state.items.indexOf(item) + 1}`);
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
                   {
                       label: this.i18n[this.state.currentLang].tableHeaders[5],
                       data: itemCosts,
                       backgroundColor: 'rgba(54, 162, 235, 0.7)',
                       borderColor: 'rgb(54, 162, 235)',
                       borderWidth: 1
                   },
                   {
                       label: this.i18n[this.state.currentLang].tableHeaders[11],
                       data: itemProfits,
                       backgroundColor: 'rgba(75, 192, 192, 0.7)',
                       borderColor: 'rgb(75, 192, 192)',
                       borderWidth: 1
                   }
               ]
           },
           options: {
               responsive: true,
               scales: { x: { ticks: { color: chartFontColor }, grid: { color: chartGridColor } }, y: { ticks: { color: chartFontColor }, grid: { color: chartGridColor } } },
               plugins: {
                   legend: { labels: { color: chartFontColor } },
                   title: { display: true, text: this.i18n[this.state.currentLang].chartLabels.costVsProfit, color: chartFontColor }
               }
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
               plugins: {
                   legend: { labels: { color: chartFontColor } },
                   title: { display: true, text: this.i18n[this.state.currentLang].chartLabels.totalCostVsProfit, color: chartFontColor }
               }
           }
       });
   }
};
document.addEventListener('DOMContentLoaded', () => App.init());

