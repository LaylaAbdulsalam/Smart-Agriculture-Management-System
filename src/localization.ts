/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { Language } from './types'; 

export const translations = {
  en: {
    // General
    on: 'ON',
    off: 'OFF',
    automatic: 'Automatic',
    manual: 'Manual',
    good: 'Good',
    fair: 'Fair',
    critical: 'Critical',
    acknowledge: 'Acknowledge',
    // Sidebar
    sidebar: {
      mainMenu: 'Main Menu',
      configuration: 'Configuration',
      dashboard: 'Dashboard',
      zones: 'Zones',
      equipment: 'Equipment',
      alerts: 'Alerts',
      reports: 'Reports',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Log Out',
      appName: 'SmartAgri',
    },
     // Landing Header
    landingHeader: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
    },
    // Footer
    footer: {
      rights: 'All rights reserved.',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy',
    },
    // Header
    header: {
      farmOverview: 'Farm Overview',
      zoneManagement: 'Zone Management',
      equipmentStatus: 'Equipment Status',
      alerts: 'System Alerts',
      reportsAnalytics: 'Reports & Analytics',
      systemSettings: 'System Settings',
      userProfile: 'User Profile',
    },
    // Dashboard
    dashboard: {
      temperature: 'Avg. Temp',
      soilMoisture: 'Avg. Soil Moisture',
      humidity: 'Avg. Humidity',
      activeZones: 'Active Zones',
      soilMoistureTrend: 'Farm-Wide Soil Moisture Trend',
      activeAlerts: 'Active Alerts',
      noAlerts: 'All systems are normal.',
      viewAllAlerts: 'View All Alerts',
    },
    // AI Panel
    aiPanel: {
      title: 'AI Precision Agriculture',
      cropHealth: 'Crop Health',
      recommendation: 'Recommendation',
      suggestedSchedule: 'Suggested Schedule',
      placeholder: 'Select a zone to get AI-powered insights for a specific crop and its current growth stage.',
      analyzing: 'Analyzing...',
      analyzeButton: 'Analyze with AI',
      error: 'Failed to get AI recommendation. Please try again.',
    },
    // Zones Page
    zonesPage: {
      title: 'Zone Management',
      description: 'Monitor the status and health of each zone in your farm.',
    },
    // Zone Card
    zoneCard: {
        soilType: 'Soil Type',
        currentCrop: 'Current Crop',
        none: 'None',
        stage: 'Stage',
        planted: 'Planted',
        viewDetails: 'View Details & AI Analysis'
    },
    // Equipment Page
    equipmentPage: {
      title: 'Equipment Status',
      description: 'Monitor all sensors and equipment across your farm zones.',
      equipment: 'Equipment',
      zone: 'Zone',
      type: 'Type',
      status: 'Status',
      lastReading: 'Last Reading',
      value: 'Value',
    },
    // Alerts Page
    alertsPage: {
        title: 'System Alerts',
        description: 'Review and acknowledge all system-generated alerts.',
        zone: 'Zone',
        message: 'Message',
        reading: 'Reading',
        date: 'Date',
        status: 'Status',
        new: 'New',
        acknowledged: 'Acknowledged',
        actions: 'Actions',
        filterByStatus: 'Filter by status',
        all: 'All',
    },
    // Reports Page
    reportsPage: {
      title: 'Generated Reports',
      description: 'View and export historical system reports.',
      exportPDF: 'Export PDF',
      exportCSV: 'Export CSV',
      waterUsageTrend: 'Water Usage Trend (L/hr)',
      reportId: 'Report ID',
      date: 'Date',
      type: 'Type',
      author: 'Author',
      status: 'Status',
    },
    // Settings Page
    settingsPage: {
      title: 'System Settings',
      save: 'Save Changes',
      appearance: 'Appearance',
      theme: 'Theme',
      themeDescription: 'Switch between light and dark mode.',
      language: 'Language',
      languageDescription: 'Choose your preferred language for the dashboard.',
      toastSuccess: 'Settings saved successfully!',
    },
    // Profile Page
    profilePage: {
        title: 'User Profile',
        save: 'Save Changes',
        changePicture: 'Change Picture',
        accountDetails: 'Account Details',
        fullName: 'Full Name',
        emailAddress: 'Email Address',
        role: 'Role',
        changePassword: 'Change Password',
        notificationPrefs: 'Notification Preferences',
        systemAlerts: 'System Alerts',
        systemAlertsDesc: 'Receive critical alerts for sensor malfunctions or extreme weather.',
        weeklyReports: 'Weekly Reports',
        weeklyReportsDesc: 'Get a summary of farm performance delivered to your email.',
        aiRecommendations: 'AI Recommendations',
        aiRecommendationsDesc: 'Be notified when the AI has new insights for your farm.',
        toastSuccess: 'Profile updated successfully!',
    },
    // Auth Pages
    login: {
        title: 'Log in to SmartAgri',
        description: 'Enter your credentials to access your farm dashboard.',
        email: 'Email address',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot your password?',
        loginButton: 'Log in',
        noAccount: "Don't have an account?",
        createAccount: 'Create a new account',
    },
    signup: {
        title: 'Create Your SmartAgri Account',
        choosePhoto: 'Choose profile photo',
        name: 'Name',
        email: 'Email address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        createButton: 'Create Account',
        hasAccount: 'Already have an account?',
        login: 'Log in',
    },
    roleSelection: {
        back: 'Back to Login',
        welcome: 'Welcome, {{name}}!',
        prompt: 'Choose your role to continue managing your smart farm.',
    },
    // Home Page
    home: {
      heroTitle: 'The Future of Farming is Here',
      heroSubtitle: 'Leverage AI and real-time data to optimize irrigation, improve crop health, and increase your yield. SmartAgri brings precision agriculture to your fingertips.',
      getStarted: 'Get Started Now',
      featuresTitle: 'Why Choose SmartAgri?',
      feature1Title: 'Real-time Monitoring',
      feature1Desc: 'Keep track of soil moisture, temperature, and humidity with live data from sensors across your farm.',
      feature2Title: 'AI-Powered Insights',
      feature2Desc: 'Our advanced AI analyzes your farm\'s data to provide actionable recommendations for irrigation and crop management.',
      feature3Title: 'Automated Irrigation',
      feature3Desc: 'Set up automated irrigation schedules based on moisture thresholds and AI suggestions to save water and time.',
      feature4Title: 'Data & Analytics',
      feature4Desc: 'Generate detailed reports to understand water usage patterns, track crop performance, and make informed decisions.',
      visionTitle: 'Our Vision',
      visionDesc: 'To empower farmers everywhere with sustainable and intelligent technology, creating a future where agriculture is more productive, efficient, and environmentally friendly.',
      missionTitle: 'Our Mission',
      missionDesc: 'To provide an accessible, user-friendly platform that integrates cutting-edge AI with practical farming needs, helping to conserve water resources and ensure global food security.',
    },
    // About Page
    about: {
      title: 'About SmartAgri',
      p1: 'SmartAgri was founded by a team of agricultural experts, software engineers, and data scientists who share a common passion: revolutionizing agriculture through technology. We believe that by harnessing the power of data and artificial intelligence, we can help farmers overcome the challenges of a changing climate and increasing global demand for food.',
      p2: 'Our journey began with a simple observation: traditional farming methods often rely on guesswork, leading to inefficient water use and suboptimal crop yields. We saw an opportunity to create a system that provides farmers with the precise information they need, right when they need it. The Smart Agriculture Management System (SAMS) is the result of years of research, development, and collaboration with farmers on the ground.',
      p3: 'We are committed to continuous innovation, constantly improving our algorithms and expanding our platform\'s capabilities to meet the evolving needs of the modern farmer. Our goal is to be a trusted partner in your success, helping you grow smarter, not harder.',
    },
    // Contact Page
    contact: {
      title: 'Contact Us',
      p1: 'We\'d love to hear from you! Whether you have a question about our features, a request for a demo, or anything else, our team is ready to answer all your questions.',
      reachOut: 'You can reach out to us through the following channels:',
      email: 'Email:',
      emailAddress: 'support@smartagri.com',
      phone: 'Phone:',
      phoneNumber: '+1 (555) 123-4567',
      address: 'Address:',
      addressDetails: '123 Green Valley, AgriTech Park, Harveston, 54321',
    },
    // Privacy Policy Page
    privacy: {
      title: 'Privacy Policy',
      p1: 'Your privacy is important to us. It is SmartAgri\'s policy to respect your privacy regarding any information we may collect from you across our website and the Smart Agriculture Management System.',
      p2: 'We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.',
      p3: 'We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.',
      p4: 'We don’t share any personally identifying information publicly or with third-parties, except when required to by law.',
    },
    // Toast
    toast: {
      close: 'Close',
    },
  },
  ar: {
    // General
    on: 'تشغيل',
    off: 'إيقاف',
    automatic: 'تلقائي',
    manual: 'يدوي',
    good: 'جيد',
    fair: 'مقبول',
    critical: 'حرج',
    acknowledge: 'تأكيد الاستلام',
    // Sidebar
    sidebar: {
      mainMenu: 'القائمة الرئيسية',
      configuration: 'الإعدادات',
      dashboard: 'لوحة التحكم',
      zones: 'المناطق',
      equipment: 'المعدات',
      alerts: 'التنبيهات',
      reports: 'التقارير',
      settings: 'الإعدادات',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',
      appName: 'SmartAgri',
    },
     // Landing Header
    landingHeader: {
      home: 'الرئيسية',
      about: 'من نحن',
      contact: 'اتصل بنا',
      login: 'تسجيل الدخول',
    },
     // Footer
    footer: {
      rights: 'كل الحقوق محفوظة.',
      about: 'من نحن',
      contact: 'اتصل بنا',
      privacy: 'سياسة الخصوصية',
    },
    // Header
    header: {
      farmOverview: 'نظرة عامة على المزرعة',
      zoneManagement: 'إدارة المناطق',
      equipmentStatus: 'حالة المعدات',
      alerts: 'تنبيهات النظام',
      reportsAnalytics: 'التقارير والتحليلات',
      systemSettings: 'إعدادات النظام',
      userProfile: 'الملف الشخصي للمستخدم',
    },
    // Dashboard
    dashboard: {
      temperature: 'متوسط الحرارة',
      soilMoisture: 'متوسط رطوبة التربة',
      humidity: 'متوسط الرطوبة',
      activeZones: 'المناطق النشطة',
      soilMoistureTrend: 'اتجاه رطوبة التربة للمزرعة',
      activeAlerts: 'التنبيهات النشطة',
      noAlerts: 'جميع الأنظمة تعمل بشكل طبيعي.',
      viewAllAlerts: 'عرض كل التنبيهات',
    },
    // AI Panel
    aiPanel: {
      title: 'الزراعة الدقيقة بالذكاء الاصطناعي',
      cropHealth: 'صحة المحصول',
      recommendation: 'التوصية',
      suggestedSchedule: 'الجدول الزمني المقترح',
      placeholder: 'اختر منطقة للحصول على رؤى مدعومة بالذكاء الاصطناعي لمحصول معين ومرحلة نموه الحالية.',
      analyzing: 'جارٍ التحليل...',
      analyzeButton: 'تحليل بالذكاء الاصطناعي',
      error: 'فشل في الحصول على توصية الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.',
    },
    // Zones Page
    zonesPage: {
      title: 'إدارة المناطق',
      description: 'راقب حالة وصحة كل منطقة في مزرعتك.',
    },
    // Zone Card
    zoneCard: {
        soilType: 'نوع التربة',
        currentCrop: 'المحصول الحالي',
        none: 'لا يوجد',
        stage: 'المرحلة',
        planted: 'تاريخ الزراعة',
        viewDetails: 'عرض التفاصيل وتحليل الذكاء الاصطناعي'
    },
    // Equipment Page
    equipmentPage: {
      title: 'حالة المعدات',
      description: 'مراقبة جميع أجهزة الاستشعار والمعدات في مناطق مزرعتك.',
      equipment: 'المعدة',
      zone: 'المنطقة',
      type: 'النوع',
      status: 'الحالة',
      lastReading: 'آخر قراءة',
      value: 'القيمة',
    },
    // Alerts Page
    alertsPage: {
        title: 'تنبيهات النظام',
        description: 'مراجعة وتأكيد جميع التنبيهات التي تم إنشاؤها بواسطة النظام.',
        zone: 'المنطقة',
        message: 'الرسالة',
        reading: 'القراءة',
        date: 'التاريخ',
        status: 'الحالة',
        new: 'جديد',
        acknowledged: 'تم التأكيد',
        actions: 'الإجراءات',
        filterByStatus: 'تصفية حسب الحالة',
        all: 'الكل',
    },
    // Reports Page
    reportsPage: {
      title: 'التقارير المُنشأة',
      description: 'عرض وتصدير تقارير النظام التاريخية.',
      exportPDF: 'تصدير PDF',
      exportCSV: 'تصدير CSV',
      waterUsageTrend: 'اتجاه استهلاك المياه (لتر/ساعة)',
      reportId: 'معرف التقرير',
      date: 'التاريخ',
      type: 'النوع',
      author: 'المؤلف',
      status: 'الحالة',
    },
    // Settings Page
    settingsPage: {
      title: 'إعدادات النظام',
      save: 'حفظ التغييرات',
      appearance: 'المظهر',
      theme: 'السمة',
      themeDescription: 'التبديل بين الوضع الفاتح والداكن.',
      language: 'اللغة',
      languageDescription: 'اختر لغتك المفضلة للوحة التحكم.',
      toastSuccess: 'تم حفظ الإعدادات بنجاح!',
    },
    // Profile Page
    profilePage: {
        title: 'الملف الشخصي للمستخدم',
        save: 'حفظ التغييرات',
        changePicture: 'تغيير الصورة',
        accountDetails: 'تفاصيل الحساب',
        fullName: 'الاسم الكامل',
        emailAddress: 'البريد الإلكتروني',
        role: 'الدور',
        changePassword: 'تغيير كلمة المرور',
        notificationPrefs: 'تفضيلات الإشعارات',
        systemAlerts: 'تنبيهات النظام',
        systemAlertsDesc: 'تلقي تنبيهات حرجة لأعطال المستشعرات أو الطقس القاسي.',
        weeklyReports: 'التقارير الأسبوعية',
        weeklyReportsDesc: 'احصل على ملخص لأداء المزرعة على بريدك الإلكتروني.',
        aiRecommendations: 'توصيات الذكاء الاصطناعي',
        aiRecommendationsDesc: 'كن على علم عندما يكون لدى الذكاء الاصطناعي رؤى جديدة لمزرعتك.',
        toastSuccess: 'تم تحديث الملف الشخصي بنجاح!',
    },
    // Auth Pages
    login: {
        title: 'تسجيل الدخول إلى سامز',
        description: 'أدخل بياناتك للوصول إلى لوحة تحكم المزرعة.',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        rememberMe: 'تذكرني',
        forgotPassword: 'هل نسيت كلمة المرور؟',
        loginButton: 'تسجيل الدخول',
        noAccount: 'ليس لديك حساب؟',
        createAccount: 'إنشاء حساب جديد',
    },
    signup: {
        title: 'أنشئ حسابك في سامز',
        choosePhoto: 'اختر صورة الملف الشخصي',
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        createButton: 'إنشاء حساب',
        hasAccount: 'هل لديك حساب بالفعل؟',
        login: 'تسجيل الدخول',
    },
    roleSelection: {
        back: 'العودة إلى تسجيل الدخول',
        welcome: 'مرحبًا، {{name}}!',
        prompt: 'اختر دورك لمواصلة إدارة مزرعتك الذكية.',
    },
    // Home Page
    home: {
      heroTitle: 'مستقبل الزراعة يبدأ هنا',
      heroSubtitle: 'استفد من الذكاء الاصطناعي والبيانات الفورية لتحسين الري، وتعزيز صحة المحاصيل، وزيادة إنتاجك. SmartAgri يضع الزراعة الدقيقة في متناول يديك.',
      getStarted: 'ابدأ الآن',
      featuresTitle: 'لماذا تختار SmartAgri؟',
      feature1Title: 'مراقبة فورية',
      feature1Desc: 'تتبع رطوبة التربة ودرجة الحرارة والرطوبة ببيانات حية من المستشعرات في جميع أنحاء مزرعتك.',
      feature2Title: 'رؤى مدعومة بالذكاء الاصطناعي',
      feature2Desc: 'يقوم الذكاء الاصطناعي المتقدم لدينا بتحليل بيانات مزرعتك لتقديم توصيات عملية للري وإدارة المحاصيل.',
      feature3Title: 'ري آلي',
      feature3Desc: 'قم بإعداد جداول ري آلية بناءً على عتبات الرطوبة واقتراحات الذكاء الاصطناعي لتوفير المياه والوقت.',
      feature4Title: 'البيانات والتحليلات',
      feature4Desc: 'أنشئ تقارير مفصلة لفهم أنماط استهلاك المياه، وتتبع أداء المحاصيل، واتخاذ قرارات مستنيرة.',
      visionTitle: 'رؤيتنا',
      visionDesc: 'تمكين المزارعين في كل مكان بتقنية مستدامة وذكية، وخلق مستقبل تكون فيه الزراعة أكثر إنتاجية وكفاءة وصديقة للبيئة.',
      missionTitle: 'مهمتنا',
      missionDesc: 'توفير منصة سهلة الاستخدام ومتاحة للجميع تدمج أحدث تقنيات الذكاء الاصطناعي مع الاحتياجات الزراعية العملية، مما يساعد على الحفاظ على الموارد المائية وضمان الأمن الغذائي العالمي.',
    },
     // About Page
    about: {
      title: 'عن SmartAgri',
      p1: 'تأسست SmartAgri على يد فريق من خبراء الزراعة ومهندسي البرمجيات وعلماء البيانات الذين يشتركون في شغف واحد: إحداث ثورة في الزراعة من خلال التكنولوجيا. نحن نؤمن بأنه من خلال تسخير قوة البيانات والذكاء الاصطناعي، يمكننا مساعدة المزارعين على التغلب على تحديات المناخ المتغير والطلب العالمي المتزايد على الغذاء.',
      p2: 'بدأت رحلتنا بملاحظة بسيطة: غالبًا ما تعتمد أساليب الزراعة التقليدية على التخمين، مما يؤدي إلى استخدام غير فعال للمياه ومحاصيل دون المستوى الأمثل. رأينا فرصة لإنشاء نظام يزود المزارعين بالمعلومات الدقيقة التي يحتاجونها، في الوقت الذي يحتاجون إليها بالضبط. نظام إدارة الزراعة الذكية (SAMS) هو نتيجة سنوات من البحث والتطوير والتعاون مع المزارعين في الميدان.',
      p3: 'نحن ملتزمون بالابتكار المستمر، وتحسين خوارزمياتنا باستمرار وتوسيع قدرات منصتنا لتلبية الاحتياجات المتطورة للمزارع الحديث. هدفنا هو أن نكون شريكًا موثوقًا به في نجاحك، ومساعدتك على النمو بذكاء أكبر، وليس بجهد أكبر.',
    },
    // Contact Page
    contact: {
      title: 'اتصل بنا',
      p1: 'يسعدنا أن نسمع منك! سواء كان لديك سؤال حول ميزاتنا، أو طلب عرض توضيحي، أو أي شيء آخر، فإن فريقنا مستعد للإجابة على جميع أسئلتك.',
      reachOut: 'يمكنك التواصل معنا عبر القنوات التالية:',
      email: 'البريد الإلكتروني:',
      emailAddress: 'support@smartagri.com',
      phone: 'الهاتف:',
      phoneNumber: '+1 (555) 123-4567',
      address: 'العنوان:',
      addressDetails: '123 الوادي الأخضر، مجمع التقنيات الزراعية، هارفستون، 54321',
    },
    // Privacy Policy Page
    privacy: {
      title: 'سياسة الخصوصية',
      p1: 'خصوصيتك تهمنا. تلتزم سياسة SmartAgri باحترام خصوصيتك فيما يتعلق بأي معلومات قد نجمعها منك عبر موقعنا الإلكتروني ونظام إدارة الزراعة الذكية.',
      p2: 'نحن نطلب فقط المعلومات الشخصية عندما نحتاجها حقًا لتقديم خدمة لك. نقوم بجمعها بوسائل عادلة وقانونية، بمعرفتك وموافقتك. كما نعلمك بسبب جمعها وكيف سيتم استخدامها.',
      p3: 'نحتفظ بالمعلومات التي تم جمعها فقط طالما كان ذلك ضروريًا لتزويدك بالخدمة المطلوبة. البيانات التي نخزنها، نحميها ضمن وسائل مقبولة تجاريًا لمنع الفقدان والسرقة، وكذلك الوصول غير المصرح به أو الكشف أو النسخ أو الاستخدام أو التعديل.',
      p4: 'نحن لا نشارك أي معلومات تعريف شخصية علنًا أو مع أطراف ثالثة، إلا عندما يقتضي القانون ذلك.',
    },
    // Toast
    toast: {
      close: 'إغلاق',
    },
  },
};

// This is the NEW and CORRECT version of the hook
export const useLocalization = (language: Language) => {
    const t = useCallback(
        (key: string, replacements?: Record<string, string | number>): string => {
            const keys = key.split('.');
            let template: any = translations[language] || translations.en;
            for (const k of keys) {
                if (template) {
                    template = template[k];
                } else {
                    return key; // Return the key itself if path is broken
                }
            }

            if (typeof template !== 'string') {
                return key; // Return key if the final value is not a string
            }

            let result = template;
            if (replacements) {
                Object.keys(replacements).forEach(rKey => {
                    const regex = new RegExp(`{{${rKey}}}`, 'g');
                    result = result.replace(regex, String(replacements[rKey]));
                });
            }
            return result;
        },
        [language] // This dependency array is the key to making it reactive
    );

    return { t };
};