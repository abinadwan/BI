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
    projectName: ''
  },

  editingIndex: null,

  elements: {
    appTitle: document.getElementById('app-title'),
    projectNameInput: document.getElementById('projectName'),
    vatRateInput: document.getElementById('vatRate'),
    currencySelect: document.getElementById('currencySelect'),
    rateInfoSpan: document.getElementById(
