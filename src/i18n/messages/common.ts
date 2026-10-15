const en = {
  language: {
    label: "Language",
    switchTo: "Switch language to Arabic",
    shortCurrent: "EN",
    shortOther: "عربي",
  },
  logout: {
    trigger: "Log out",
    title: "Log out?",
    description: "Are you sure you want to log out?",
    cancel: "Cancel",
    confirm: "Log out",
    pending: "Logging out…",
    error: "We couldn't log you out. Check your connection and try again.",
  },
  errors: {
    generic: "Something went wrong. Please try again.",
    network: "We couldn't reach the server. Check your connection and try again.",
  },
  judyLines: {
    roadTrip: "Road trip!",
    hi: "Hi there!",
    listening: "I am listening.",
    think: "Hmm... let me think.",
    quiet: "Sometimes I need a quiet moment.",
    wheee: "Wheee!",
    yay: "Yay!",
    burger: "A burger! Yum!",
    yum: "Yum!",
    phone: "Hello! How are you?",
    tickle: "Hehe, that tickles!",
    tapHint1: "Psst… tap me!",
    tapHint2: "I'm ticklish. Try tapping me!",
    tapHint3: "Tap me, or drag me anywhere!",
  },
  actions: {
    close: "Close",
    retry: "Try again",
    cancel: "Cancel",
    save: "Save",
    back: "Back",
  },
}

export type CommonMessages = typeof en

const ar: CommonMessages = {
  language: {
    label: "اللغة",
    switchTo: "تغيير اللغة إلى الإنجليزية",
    shortCurrent: "عربي",
    shortOther: "EN",
  },
  logout: {
    trigger: "تسجيل الخروج",
    title: "تسجيل الخروج؟",
    description: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
    cancel: "إلغاء",
    confirm: "تسجيل الخروج",
    pending: "جارٍ تسجيل الخروج…",
    error: "تعذّر تسجيل خروجك. تحقّق من اتصالك وحاول مرة أخرى.",
  },
  errors: {
    generic: "حدث خطأ ما. يُرجى المحاولة مرة أخرى.",
    network: "تعذّر الوصول إلى الخادم. تحقّق من اتصالك وحاول مرة أخرى.",
  },
  judyLines: {
    roadTrip: "رحلة على الطريق!",
    hi: "مرحبًا!",
    listening: "أنا أستمع.",
    think: "همم... دعني أفكّر.",
    quiet: "أحتاج أحيانًا إلى لحظة هدوء.",
    wheee: "ووووه!",
    yay: "يااي!",
    burger: "برغر! لذيذ!",
    yum: "لذيذ!",
    phone: "مرحبًا! كيف حالك؟",
    tickle: "هههه، هذا يُدغدغني!",
    tapHint1: "بسّ… انقر عليّ!",
    tapHint2: "أنا أخاف من الدغدغة، جرّب النقر عليّ!",
    tapHint3: "انقر عليّ، أو اسحبني إلى أي مكان!",
  },
  actions: {
    close: "إغلاق",
    retry: "حاول مرة أخرى",
    cancel: "إلغاء",
    save: "حفظ",
    back: "رجوع",
  },
}

export const common = { en, ar }
