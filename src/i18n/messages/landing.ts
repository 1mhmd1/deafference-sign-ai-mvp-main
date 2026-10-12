const en = {
  nav: {
    /** Keyed by section; the landing components map LANDING_NAV / FOOTER_*_NAV hrefs onto these keys. */
    links: {
      howItWorks: "How it works",
      forYou: "For you",
      forOrganisations: "For organisations",
      resources: "Resources",
      pricing: "Pricing",
      features: "Features",
      about: "About us",
      contact: "Contact",
      translate: "Translate",
      demo: "Demo center",
      privacy: "Privacy",
    },
    home: "Deafference home",
    desktopLabel: "Main navigation",
    mobileLabel: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    requestDemo: "Request a demo",
    skipLink: "Skip to main content",
  },
  calm: {
    label: "Calm mode",
    ariaLabel: "Calm mode: reduce motion on this page",
  },
  theme: {
    toDark: "Switch to dark mode",
    toLight: "Switch to light mode",
  },
  judy: {
    floatingLabel: "Judy, the Deafference guide (decorative animation)",
    sceneLabel: "Judy walking through the everyday places where Deafference helps",
  },
  hero: {
    status: "Real-time sign ↔ speech",
    headline: ["BREAKING", "COMMUNICATION", "BARRIERS"],
    intro:
      "Deafference translates sign language into speech and text — and speech back into sign — in real time, so Deaf, hard-of-hearing and hearing people can understand each other at the clinic, at work, in class and in everyday life.",
    primaryCta: "Try Deafference",
    secondaryCta: "Watch it in action",
    scenariosCta: "Explore scenarios",
    badges: ["Privacy-first", "Real-time translation", "Built for accessibility", "English & Arabic", "AI-powered"],
    modeLabel: "Mode",
    modeValue: "Live",
    modeAccent: "two-way",
    privacyLabel: "Privacy",
    privacyValue: "You stay in control",
    illustrationLabel: "How a conversation flows: you sign, the AI understands, the other person hears you, and everyone connects.",
    cards: {
      sign: "You sign",
      understands: "AI understands",
      hear: "They hear you",
      connect: "Everyone connects",
    },
  },
  about: {
    eyebrow: "About us",
    title: "A small team building the bridge between spoken and signed language",
    description:
      "Deafference started from a simple observation: everyday spoken interactions still leave Deaf and hard-of-hearing people waiting on an interpreter who isn't always there. We're building the software that closes that gap.",
    storyEyebrow: "Our story",
    storyLead:
      "Deafference began after watching a routine clinic visit turn stressful for reasons that had nothing to do with the diagnosis:",
    storyBody:
      "no interpreter was booked, the front desk defaulted to writing notes back and forth, and a five-minute check-in took forty. That gap — the everyday moments too small to schedule an interpreter for, but too important to get wrong — is what we set out to close.",
    storyMore:
      "We started in healthcare and public-service settings because the stakes are highest there, then built the same real-time pipeline to work anywhere a spoken conversation happens without a visual alternative on standby.",
    glanceLabel: "At a glance",
    glanceValues: "Core values",
    glanceRoles: "Focus areas",
    glanceGoals: "Goals ahead",
    tabsLabel: "About us subsections",
    tabs: {
      mission: "Mission",
      vision: "Vision",
      values: "Core values",
      team: "Our team",
      future: "Future goals",
    },
    missionTitle: "Our mission",
    missionBody:
      "Bridge the communication gap for Deaf and hard-of-hearing people the moment it matters most — at a hospital intake desk, in an emergency room, at a service counter — by turning spoken language into clear, real-time sign and text, and signing back into speech. No waiting for the conversation to be scheduled: the support is there when it happens.",
    visionTitle: "Our vision",
    visionBody:
      "A world where medical and social communication barriers are no longer something Deaf and hard-of-hearing people have to plan around. We see Deafference as everyday infrastructure — as ordinary and dependable as captions or a ramp — available wherever a spoken conversation can happen.",
    values: [
      {
        title: "Accessibility first",
        description:
          "Every design decision starts from how a Deaf or hard-of-hearing person will experience it — not as an afterthought added to a hearing-first product.",
      },
      {
        title: "Patient safety",
        description:
          "In clinical settings a mistranslation isn't a small bug, it's a safety risk. Output is kept clear and unambiguous, especially for medical and emergency phrases.",
      },
      {
        title: "Cultural respect",
        description:
          "Sign languages are complete languages with their own grammar and regional variation. We treat them that way instead of translating word-for-word from spoken language.",
      },
      {
        title: "Technical care",
        description:
          "Speed and accuracy are one requirement, not a trade-off — a delayed or wrong sign is a missed conversation.",
      },
      {
        title: "Honest about limits",
        description:
          "We're open about what Deafference can't do yet, and we say clearly when a qualified interpreter is the right choice.",
      },
    ],
    teamIntro:
      "We describe our team by what each group is responsible for. Deaf and hard-of-hearing people are involved in shaping the product, not only testing it.",
    teamGroups: [
      {
        heading: "Product & partnerships",
        roles: [
          { role: "Product leadership", note: "Sets direction with accessibility and patient safety as the first requirement." },
          { role: "Healthcare partnerships", note: "Works with clinics and service teams to understand real front-desk and exam-room workflows." },
        ],
      },
      {
        heading: "Engineering",
        roles: [
          { role: "Machine learning", note: "Sign and speech recognition models built for real-time use." },
          { role: "Product engineering", note: "Accessible, bilingual interfaces that work on everyday devices." },
        ],
      },
      {
        heading: "Community & accessibility",
        roles: [
          { role: "Deaf community input", note: "Feedback from Deaf signers shapes sign output and product decisions." },
          { role: "Interpreter guidance", note: "Professional interpreters advise on where a human interpreter should take over." },
        ],
      },
    ],
    hiring: {
      title: "We're hiring",
      body: "We're looking for engineers and community liaisons. Deaf and hard-of-hearing applicants are especially welcome.",
      cta: "Get in touch",
    },
    goals: [
      {
        title: "More sign languages and dialects",
        timeframe: "Next",
        description: "Support for regional sign variation and additional national sign languages beyond the current core set.",
      },
      {
        title: "Integrations for organisations",
        timeframe: "Planned",
        description: "Single sign-on, clinical system connectors and team management so hospitals and agencies can roll out by department.",
      },
      {
        title: "Works with weak connections",
        timeframe: "Ongoing",
        description: "More processing on the device itself so translation keeps working in low-connectivity clinics, classrooms and rural service centres.",
      },
    ],
  },
  why: {
    eyebrow: "Why choose us",
    title: "Built for the conversations that can't wait",
    description:
      "Deafference is designed around the real moments where communication breaks down — and around the people who rely on it most.",
    reasons: [
      {
        title: "Accessibility first",
        description:
          "Designed with Deaf and hard-of-hearing people in mind: visual-first layouts, captions alongside sign, and clear, calm controls.",
      },
      {
        title: "Made for healthcare moments",
        description: "Check-ins, consultations, pharmacies and emergencies — the places where a misunderstanding has real consequences.",
      },
      {
        title: "Two-way, in real time",
        description: "Sign to speech and speech to sign in one flow, so both people can talk without passing notes back and forth.",
      },
      {
        title: "Private by design",
        description:
          "Your camera and microphone are used only when you start a session, and recordings of your conversations aren't saved to your account.",
      },
    ],
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "3 steps from spoken word to visual sign.",
    description: "The highlight moves from step to step on its own. Hovering or tapping a step pauses it there, and calm mode turns the movement off.",
    stages: [
      { title: "Speech capture", caption: "Your device's microphone picks up what the hearing person says.", tag: "Audio input" },
      { title: "AI processing", caption: "The AI recognises the phrase and converts it into sign language structure.", tag: "Sign structure" },
      { title: "Sign output", caption: "An animated signer shows the message, with text captions alongside.", tag: "Ready to watch" },
    ],
  },
  scenarios: {
    eyebrow: "Scenarios",
    title: "Take a walk through everyday life, with Judy as your guide.",
    description:
      "From a check-up at the clinic to a gate change at the airport, Judy visits the everyday places where Deafference helps Deaf and hearing people understand each other.",
    imageAlt:
      "Illustrated map titled “Where Deafference matters — In every place. Every day.” Seven rooms surround a glowing Deafference hub, linked by paths: Healthcare (a doctor talking with a patient), Hospitality (a hotel front desk), Workplaces (a team meeting), Emergencies (an ambulance bay), Travel (an airport check-in counter), Services & Public (a public service desk) and Education (a classroom). Judy, the animated guide, walks between the rooms.",
    listLabel: "Places Judy visits",
    nowLabel: "Now:",
    items: [
      { label: "Healthcare", message: "Every patient understands their doctor." },
      { label: "Hospitality", message: "Check in with no barriers." },
      { label: "Workplaces", message: "A voice in every meeting." },
      { label: "Emergencies", message: "Help arrives, fast and clear." },
      { label: "Travel", message: "Gate change? You'll know right away." },
      { label: "Services & Public", message: "Paperwork, made simple." },
      { label: "Education", message: "Learn live, in sign language." },
    ],
  },
  demo: {
    eyebrow: "Demo center",
    title: "See it in action, then explore how to set it up.",
    description: "An animated walkthrough of a translation, plus the product videos and tutorials we're preparing — no microphone or account needed to preview.",
    tabsLabel: "Demo center categories",
    tabs: { demos: "Product demos", tutorials: "Video & interactive tutorials" },
    flagship: {
      title: "Real-time sign translation",
      badge: "Animated walkthrough",
      note: "This is a simulated walkthrough of the steps, not live translation. Try the live app for the real thing.",
      progressLabel: "Walkthrough progress",
      stepsLabel: "Walkthrough steps",
      current: "Current",
      play: "Play walkthrough",
      pause: "Pause",
      replay: "Replay",
      restart: "Restart",
      captions: "Captions",
      previewTitle: "Sign output preview",
      captionsHidden: "Captions hidden",
      steps: [
        { label: "Speech detected", caption: "“Where is the nearest exit?”" },
        { label: "Phrase recognised", caption: "Meaning converted into sign language structure" },
        { label: "Sign playing", caption: "The signer shows the message, with captions" },
      ],
    },
    media: {
      comingSoon: "Video coming soon",
      preview: "Preview",
      previewAria: "Preview: {title}",
      comingSoonNote: "This video isn't available yet. In the meantime, try the live app.",
    },
    productDemos: [
      {
        title: "Emergency quick actions",
        description: "One-tap presets for common emergency phrases, signed instantly without typing or speaking a full sentence.",
      },
      {
        title: "Text-to-sign",
        description: "Type or paste a phrase and watch it shown in animated sign language.",
      },
    ],
    tutorials: [
      {
        title: "Getting started for Deaf users",
        description: "Set up your profile, camera permission and preferred sign language.",
        audience: "New users",
      },
      {
        title: "Using Deafference at the front desk",
        description: "How healthcare staff can use Deafference for check-in and consultations.",
        audience: "Healthcare staff",
      },
      {
        title: "Setting up emergency phrases",
        description: "Prepare one-tap emergency phrases for high-stress, time-critical situations.",
        audience: "Admins",
      },
    ],
    ctaTitle: "Ready to go beyond the preview?",
    ctaBody: "Open the live app and try real-time translation with your own voice or camera.",
    ctaButton: "Open the live app",
  },
  features: {
    eyebrow: "Features",
    title: "Every direction of translation, covered",
    description: "Deafference moves between spoken, written and signed language — built with the care that high-stakes conversations need.",
    coreHeading: "Core translation directions",
    trustHeading: "Built on trust",
    learnMore: "See it in the demo",
    cards: [
      {
        title: "Speech-to-Sign",
        subtitle: "Spoken words shown as animated sign",
        pill: "SPEECH → SIGN",
        badge: "Voice",
        detail: "Listens to the hearing person and shows their words in sign language through an animated signer, phrase by phrase.",
      },
      {
        title: "Sign-to-Speech",
        subtitle: "Signing turned into a spoken voice",
        pill: "SIGN → SPEECH",
        badge: "Camera",
        detail: "Uses the camera to recognise hand shapes and movement, then speaks the message aloud for the hearing person.",
      },
      {
        title: "Text-to-Sign",
        subtitle: "Typed messages shown in sign",
        pill: "TEXT → SIGN",
        badge: "Text",
        detail: "Type or paste a message and see it in animated sign language — useful when speaking isn't possible.",
      },
      {
        title: "Sign-to-Text",
        subtitle: "Signing turned into captions",
        pill: "SIGN → TEXT",
        badge: "Captions",
        detail: "Turns signing into written captions as the conversation happens, so everyone can follow along.",
      },
    ],
    illustration: {
      audio: "AUDIO",
      signIn: "SIGN",
      captions: "CAPTIONS",
      editor: "Text",
    },
    live: {
      title: "Live translation",
      body: "A continuous, two-way stream — so a conversation flows both ways instead of taking turns waiting for a translation.",
      chip: "Two-way, in real time",
    },
    trust: [
      {
        title: "Private & secure",
        description:
          "Camera and microphone are used only when you start a session, and recordings of your conversations aren't saved to your account.",
      },
      {
        title: "Careful accuracy",
        description:
          "AI models focused on sign recognition, with extra care for everyday and medical vocabulary. For critical decisions, always confirm with a qualified interpreter.",
      },
    ],
    integrations: {
      heading: "Built to integrate",
      description: "Planned integrations that fit the tools organisations already use.",
      items: [
        { title: "Health records (EHR)", text: "Bring translation into clinical workflows." },
        { title: "Video calls", text: "Add sign and captions to remote appointments and meetings." },
        { title: "Intercoms & front desks", text: "Help at reception desks and hospital intercoms." },
        { title: "Custom APIs", text: "Connect Deafference to your own systems." },
      ],
      note: "These integrations are on our roadmap and are set up with each organisation.",
      cta: "Plan an integration",
    },
  },
  performance: {
    eyebrow: "Performance",
    title: "Fast enough for a real conversation",
    description: "Deafference is designed to keep up with natural conversation on the devices people already have — no special hardware needed.",
    metrics: [
      { value: "Real-time", label: "Translation appears while the conversation is happening" },
      { value: "Any screen", label: "Works in a modern browser on phone, tablet or laptop" },
      { value: "2 languages", label: "Full interface in English and Arabic" },
    ],
    qualities: [
      { title: "Nothing to install", text: "Runs in the browser, so you can start from any device." },
      { title: "Clear on every screen", text: "Layouts adapt from small phones to large desktop displays." },
      { title: "Predictable", text: "Consistent controls, so you always know what's happening." },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Plans for every scale, from personal use to hospital networks",
    description:
      "Every plan includes core translation. Higher plans add two-way translation, integrations and dedicated support as your rollout grows.",
    mostPopular: "Most popular",
    note: "Prices are indicative and may change before general availability. Contact us for a quote tailored to your organisation.",
    plans: [
      {
        name: "Free",
        audience: "For individual Deaf and hard-of-hearing users and personal emergency preparation",
        price: "$0",
        cadence: "/month",
        features: ["Emergency quick-action phrases", "Basic offline phrases", "Standard text-to-sign"],
        cta: "Get started",
      },
      {
        name: "Basic",
        audience: "For small clinics, private practices and local community offices",
        price: "$500",
        cadence: "/month",
        features: ["Real-time sign translation", "Digital communication cards", "Single-device access", "Email support"],
        cta: "Choose Basic",
      },
      {
        name: "Premium",
        audience: "For regional hospitals, educational institutions and mid-sized organisations",
        price: "$5,000",
        cadence: "/month",
        features: [
          "Two-way sign-to-speech and speech-to-sign translation",
          "Multiple dialects",
          "Visual waiting-room alerts",
          "Priority technical support",
        ],
        cta: "Choose Premium",
      },
      {
        name: "Enterprise",
        audience: "For hospital networks, government agencies, universities and multi-site organisations",
        price: "$10,000–$50,000",
        cadence: "/year, custom",
        features: [
          "Hospital and clinical system integration",
          "Custom regional dialect training",
          "Support for your security and compliance review",
          "Service-level agreement",
          "Multi-department licensing",
        ],
        cta: "Contact sales",
      },
    ],
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy that respects the conversation",
    description:
      "A plain-language summary of how Deafference handles your camera, microphone and account data. This summary is not the full legal privacy policy.",
    badge: "Plain-language summary",
    principles: [
      {
        title: "Camera and microphone only when you ask",
        description:
          "Your browser asks for permission first, and they're only used while you're translating. You can turn access off at any time in your browser settings.",
      },
      {
        title: "No recordings saved to your account",
        description: "Video and audio are used to produce the translation in the moment. Your account doesn't keep recordings of your conversations.",
      },
      {
        title: "Only what your account needs",
        description:
          "We store your name, email, password (encrypted), an optional profile photo, your preferred sign language and whether you've allowed camera access.",
      },
      {
        title: "You're in control",
        description: "You can update your profile, change your password or delete your account from your profile page.",
      },
    ],
    contact: "Questions about your data? Email us at",
    rights: {
      title: "Your rights",
      items: [
        "See and update your profile information at any time.",
        "Delete your account from your profile page.",
        "Ask for a copy of your data by emailing us.",
        "Clear settings saved on this device (such as calm mode and camera preferences) by clearing your browser's site data.",
      ],
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Common questions, answered simply",
    description: "Everything you need to know before trying Deafference. Can't find your answer? Get in touch below.",
    items: [
      {
        question: "What is Deafference?",
        answer:
          "Deafference is an AI communication platform that helps Deaf, hard-of-hearing and hearing people understand each other. It translates between sign language, speech and text in real time, with a focus on healthcare and everyday services.",
      },
      {
        question: "Which sign languages are supported?",
        answer:
          "Sign language support is being built step by step. You can choose your preferred sign language in your profile, and we're adding regional variation and more national sign languages over time.",
      },
      {
        question: "What happens to my camera and microphone data?",
        answer:
          "They're only used after you give permission and start a session. Video and audio are used to produce the translation in the moment and aren't saved to your account. You can turn access off at any time in your browser.",
      },
      {
        question: "Does Deafference replace a professional interpreter?",
        answer:
          "No. Deafference helps with everyday moments when no interpreter is available. For medical consent, legal matters or other critical decisions, always book a qualified sign language interpreter.",
      },
      {
        question: "How much does it cost? Can I try it for free?",
        answer:
          "Individuals can start with the free plan. Organisations can see our indicative plans in the Pricing section or contact us for a tailored quote.",
      },
      {
        question: "Is Deafference available in Arabic?",
        answer: "Yes. The interface is available in English and Arabic — use the language button at the top of the page to switch.",
      },
      {
        question: "How accurate is the translation?",
        answer:
          "Accuracy keeps improving, with extra care for everyday and medical vocabulary. It can still make mistakes, so for medical consent, legal matters or other critical decisions, always confirm with a qualified interpreter.",
      },
      {
        question: "Does Deafference work without internet?",
        answer:
          "Live translation needs an internet connection. The free plan includes some basic phrases designed for offline use, and we're moving more processing onto the device so it keeps working on weak connections.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your rollout",
    description: "Tell us about your team or use case and we'll follow up with next steps, no matter how early you are.",
    formEyebrow: "Start a conversation",
    formTitle: "Send us a message",
    name: "Name",
    email: "Email",
    message: "Message",
    submit: "Send message",
    organization: "Organisation (optional)",
    topic: "Topic",
    topics: {
      general: "General question",
      demo: "Book a demo",
      sales: "Pricing & sales",
      partnership: "Partnership",
      support: "Support",
    },
    method: "Preferred way to reply",
    methods: {
      email: "Email",
      video: "Video call in sign language",
      chat: "Text chat",
    },
    mailTopic: "Topic",
    mailOrganization: "Organisation",
    mailMethod: "Preferred reply",
    errors: {
      nameRequired: "Please enter your name.",
      emailRequired: "Please enter your email address.",
      emailInvalid: "Please enter a valid email address, like name@example.com.",
      messageRequired: "Please write a message.",
      messageShort: "Please write at least 10 characters.",
      summary: "Please fix the highlighted fields.",
    },
    statusTitle: "Your email app should open with your message.",
    statusBody: "If it didn't open, email us directly at",
    copy: "Copy address",
    copied: "Copied",
    mailSubject: "Website inquiry from {name}",
    channels: [
      { title: "General inquiries", description: "Questions about the product or a demo walkthrough." },
      { title: "Partnerships & sales", description: "Piloting Deafference across a clinic, campus or agency." },
      { title: "Support", description: "Already using the app and need a hand." },
    ],
  },
  cta: {
    eyebrow: "Start here",
    title: "Make your next conversation easier for everyone.",
    body: "Try Deafference for free, or talk to us about bringing it to your clinic, campus or service desk.",
    chip: "Free plan available",
    primary: "Try Deafference",
    secondary: "Contact us",
  },
  footer: {
    tagline:
      "Real-time AI communication between sign language, speech and text — built with and for the Deaf and hard-of-hearing community.",
    explore: "Explore",
    company: "Company",
    contactHeading: "Contact",
    email: "Email",
    rights: "© {year} Deafference. All rights reserved.",
    a11yTitle: "Accessibility statement",
    a11yBody:
      "We aim to meet WCAG 2.2 AA. The site works with a keyboard and screen readers, supports right-to-left Arabic, respects reduced-motion settings, and never relies on sound alone.",
    a11yContact: "Found a barrier? Tell us at",
    backToTop: "Back to top",
  },
}

export type LandingMessages = typeof en

const ar: LandingMessages = {
  nav: {
    links: {
      howItWorks: "كيف يعمل",
      forYou: "لك",
      forOrganisations: "للمؤسسات",
      resources: "الموارد",
      pricing: "الأسعار",
      features: "المزايا",
      about: "من نحن",
      contact: "تواصل معنا",
      translate: "الترجمة",
      demo: "مركز العروض",
      privacy: "الخصوصية",
    },
    home: "الصفحة الرئيسية لـ Deafference",
    desktopLabel: "التنقل الرئيسي",
    mobileLabel: "التنقل على الجوال",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    skipLink: "انتقل إلى المحتوى الرئيسي",
    requestDemo: "اطلب عرضًا توضيحيًا",
  },
  calm: {
    label: "الوضع الهادئ",
    ariaLabel: "الوضع الهادئ: تقليل الحركة في هذه الصفحة",
  },
  theme: {
    toDark: "التبديل إلى الوضع الداكن",
    toLight: "التبديل إلى الوضع الفاتح",
  },
  judy: {
    floatingLabel: "جودي، مرشدة Deafference (رسم متحرك للزينة)",
    sceneLabel: "جودي تتجول في أماكن الحياة اليومية التي يساعد فيها Deafference",
  },
  hero: {
    status: "إشارة ↔ كلام في الوقت الفعلي",
    headline: ["نكسر", "حواجز", "التواصل"],
    intro:
      "يترجم Deafference لغة الإشارة إلى كلام ونص، والكلام إلى إشارة، في الوقت الفعلي، ليتمكّن الصمّ وضعاف السمع والسامعون من فهم بعضهم في العيادة والعمل والدراسة والحياة اليومية.",
    primaryCta: "جرّب Deafference",
    secondaryCta: "شاهده أثناء العمل",
    scenariosCta: "استكشف السيناريوهات",
    badges: ["الخصوصية أولًا", "ترجمة فورية", "مصمَّم لإتاحة الوصول", "العربية والإنجليزية", "مدعوم بالذكاء الاصطناعي"],
    modeLabel: "الوضع",
    modeValue: "مباشر",
    modeAccent: "في الاتجاهين",
    privacyLabel: "الخصوصية",
    privacyValue: "التحكم بيدك",
    illustrationLabel: "كيف تجري المحادثة: أنت تؤشّر، والذكاء الاصطناعي يفهم، والطرف الآخر يسمعك، ويتواصل الجميع.",
    cards: {
      sign: "أنت تؤشّر",
      understands: "الذكاء الاصطناعي يفهم",
      hear: "هم يسمعونك",
      connect: "يتواصل الجميع",
    },
  },
  about: {
    eyebrow: "من نحن",
    title: "فريق صغير يبني جسرًا بين اللغة المنطوقة ولغة الإشارة",
    description:
      "بدأ Deafference من ملاحظة بسيطة: ما زالت التعاملات اليومية المنطوقة تترك الصمّ وضعاف السمع في انتظار مترجم لا يكون متاحًا دائمًا. نحن نبني البرنامج الذي يسدّ هذه الفجوة.",
    storyEyebrow: "قصتنا",
    storyLead: "بدأ Deafference بعد أن رأينا زيارة روتينية لعيادة تتحوّل إلى تجربة مرهقة لأسباب لا علاقة لها بالتشخيص:",
    storyBody:
      "لم يُحجز مترجم، ولجأ مكتب الاستقبال إلى تبادل الملاحظات المكتوبة، فاستغرق تسجيل وصول مدته خمس دقائق أربعين دقيقة. تلك الفجوة — اللحظات اليومية الأصغر من أن يُحجز لها مترجم والأهم من أن نخطئ فيها — هي ما قررنا سدّه.",
    storyMore:
      "بدأنا بالرعاية الصحية والخدمات العامة لأن المخاطر هناك هي الأعلى، ثم صمّمنا المسار الفوري نفسه ليعمل في أي مكان تجري فيه محادثة منطوقة دون بديل مرئي.",
    glanceLabel: "لمحة سريعة",
    glanceValues: "قيم أساسية",
    glanceRoles: "مجالات تركيز",
    glanceGoals: "أهداف قادمة",
    tabsLabel: "أقسام من نحن",
    tabs: {
      mission: "رسالتنا",
      vision: "رؤيتنا",
      values: "قيمنا",
      team: "فريقنا",
      future: "أهدافنا القادمة",
    },
    missionTitle: "رسالتنا",
    missionBody:
      "سدّ فجوة التواصل للصمّ وضعاف السمع في اللحظة الأهم — عند مكتب الاستقبال في المستشفى، وفي قسم الطوارئ، وعند نافذة الخدمة — بتحويل اللغة المنطوقة إلى إشارة ونص واضحين في الوقت الفعلي، وتحويل الإشارة إلى كلام. لا حاجة لانتظار موعد: الدعم حاضر لحظة حدوث المحادثة.",
    visionTitle: "رؤيتنا",
    visionBody:
      "عالم لا يضطر فيه الصمّ وضعاف السمع إلى التخطيط مسبقًا لتجاوز حواجز التواصل الطبية والاجتماعية. نرى Deafference بنية تحتية يومية — مألوفة وموثوقة مثل الترجمة النصية أو المنحدر — متاحة أينما يمكن أن تجري محادثة منطوقة.",
    values: [
      {
        title: "إتاحة الوصول أولًا",
        description: "يبدأ كل قرار تصميمي من تجربة الشخص الأصمّ أو ضعيف السمع، لا كإضافة لاحقة إلى منتج صُمّم للسامعين.",
      },
      {
        title: "سلامة المرضى",
        description: "في البيئات السريرية لا يُعدّ الخطأ في الترجمة خللًا بسيطًا بل خطرًا على السلامة. لذلك نحرص على وضوح المخرجات، خاصة في العبارات الطبية والطارئة.",
      },
      {
        title: "احترام الثقافة",
        description: "لغات الإشارة لغات كاملة لها قواعدها وتنوّعها الإقليمي. نتعامل معها على هذا الأساس بدل الترجمة الحرفية من اللغة المنطوقة.",
      },
      {
        title: "عناية تقنية",
        description: "السرعة والدقة متطلب واحد لا مفاضلة بينهما — فالإشارة المتأخرة أو الخاطئة محادثة ضائعة.",
      },
      {
        title: "الصراحة بشأن الحدود",
        description: "نتحدث بوضوح عمّا لا يستطيع Deafference فعله بعد، ونخبرك متى يكون المترجم المؤهّل هو الخيار الصحيح.",
      },
    ],
    teamIntro: "نعرّف فريقنا بما تتولاه كل مجموعة. يشارك الصمّ وضعاف السمع في تشكيل المنتج، لا في اختباره فقط.",
    teamGroups: [
      {
        heading: "المنتج والشراكات",
        roles: [
          { role: "قيادة المنتج", note: "تحدد الاتجاه مع جعل إتاحة الوصول وسلامة المرضى المتطلب الأول." },
          { role: "شراكات الرعاية الصحية", note: "تعمل مع العيادات وفرق الخدمة لفهم سير العمل الفعلي في الاستقبال وغرف الفحص." },
        ],
      },
      {
        heading: "الهندسة",
        roles: [
          { role: "تعلّم الآلة", note: "نماذج للتعرّف على الإشارة والكلام مصممة للعمل في الوقت الفعلي." },
          { role: "هندسة المنتج", note: "واجهات ثنائية اللغة سهلة الوصول تعمل على الأجهزة اليومية." },
        ],
      },
      {
        heading: "المجتمع وإتاحة الوصول",
        roles: [
          { role: "آراء مجتمع الصمّ", note: "ملاحظات مستخدمي لغة الإشارة من الصمّ تشكّل مخرجات الإشارة وقرارات المنتج." },
          { role: "إرشاد المترجمين", note: "مترجمو لغة الإشارة المحترفون يحددون متى يجب أن يتولى مترجم بشري المهمة." },
        ],
      },
    ],
    hiring: {
      title: "نحن نوظّف",
      body: "نبحث عن مهندسين ومنسّقين للتواصل مع المجتمع، ونرحّب بشكل خاص بالمتقدّمين الصمّ وضعاف السمع.",
      cta: "تواصل معنا",
    },
    goals: [
      {
        title: "المزيد من لغات الإشارة واللهجات",
        timeframe: "التالي",
        description: "دعم التنوّع الإقليمي في الإشارة ولغات إشارة وطنية إضافية تتجاوز المجموعة الأساسية الحالية.",
      },
      {
        title: "تكاملات للمؤسسات",
        timeframe: "مخطط له",
        description: "تسجيل دخول موحّد وروابط مع الأنظمة السريرية وإدارة الفرق، لتتمكن المستشفيات والجهات من التطبيق قسمًا بعد قسم.",
      },
      {
        title: "العمل مع الاتصال الضعيف",
        timeframe: "مستمر",
        description: "معالجة أكبر على الجهاز نفسه لتستمر الترجمة في العيادات والفصول ومراكز الخدمة الريفية ضعيفة الاتصال.",
      },
    ],
  },
  why: {
    eyebrow: "لماذا نحن",
    title: "مصمَّم للمحادثات التي لا تحتمل الانتظار",
    description: "صُمّم Deafference حول اللحظات الحقيقية التي ينقطع فيها التواصل — وحول الأشخاص الذين يعتمدون عليه أكثر من غيرهم.",
    reasons: [
      {
        title: "إتاحة الوصول أولًا",
        description: "مصمَّم مع مراعاة الصمّ وضعاف السمع: تخطيطات مرئية أولًا، ونص مكتوب إلى جانب الإشارة، وعناصر تحكم واضحة وهادئة.",
      },
      {
        title: "لِلحظات الرعاية الصحية",
        description: "تسجيل الوصول والاستشارات والصيدليات والطوارئ — حيث يكون لسوء الفهم عواقب حقيقية.",
      },
      {
        title: "في الاتجاهين وفي الوقت الفعلي",
        description: "من الإشارة إلى الكلام ومن الكلام إلى الإشارة في مسار واحد، ليتحدث الطرفان دون تبادل الملاحظات المكتوبة.",
      },
      {
        title: "الخصوصية في التصميم",
        description: "تُستخدم الكاميرا والميكروفون فقط عند بدء جلسة، ولا تُحفظ تسجيلات محادثاتك في حسابك.",
      },
    ],
  },
  howItWorks: {
    eyebrow: "كيف يعمل",
    title: "3 خطوات من الكلمة المنطوقة إلى الإشارة المرئية.",
    description: "ينتقل التمييز من خطوة إلى أخرى تلقائيًا. يتوقف عند الخطوة التي تمرّر المؤشر فوقها أو تضغط عليها، ويوقف الوضع الهادئ الحركة تمامًا.",
    stages: [
      { title: "التقاط الكلام", caption: "يلتقط ميكروفون جهازك ما يقوله الشخص السامع.", tag: "إدخال صوتي" },
      { title: "المعالجة بالذكاء الاصطناعي", caption: "يتعرّف الذكاء الاصطناعي على العبارة ويحوّلها إلى بنية لغة الإشارة.", tag: "بنية الإشارة" },
      { title: "عرض الإشارة", caption: "يعرض مؤشّر متحرك الرسالة، مع نص مكتوب إلى جانبها.", tag: "جاهز للمشاهدة" },
    ],
  },
  scenarios: {
    eyebrow: "السيناريوهات",
    title: "تجوّل في تفاصيل الحياة اليومية، وجودي ترشدك.",
    description:
      "من فحص في العيادة إلى تغيير بوابة في المطار، تزور جودي أماكن الحياة اليومية التي يساعد فيها Deafference الصمّ والسامعين على فهم بعضهم.",
    imageAlt:
      "خريطة مصوّرة بعنوان «حيث يُحدث Deafference فرقًا — في كل مكان، كل يوم». سبع غرف تحيط بمركز Deafference المضيء وتصل بينها ممرات: الرعاية الصحية (طبيب يتحدث مع مريض)، والضيافة (مكتب استقبال فندق)، وأماكن العمل (اجتماع فريق)، والطوارئ (موقف سيارة إسعاف)، والسفر (مكتب تسجيل في المطار)، والخدمات العامة (مكتب خدمة عامة)، والتعليم (فصل دراسي). تتنقّل جودي، المرشدة المتحركة، بين الغرف.",
    listLabel: "أماكن تزورها جودي",
    nowLabel: "الآن:",
    items: [
      { label: "الرعاية الصحية", message: "كل مريض يفهم طبيبه." },
      { label: "الضيافة", message: "سجّل وصولك بلا حواجز." },
      { label: "أماكن العمل", message: "صوتك مسموع في كل اجتماع." },
      { label: "الطوارئ", message: "المساعدة تصل بسرعة ووضوح." },
      { label: "السفر", message: "تغيّرت البوابة؟ ستعرف فورًا." },
      { label: "الخدمات العامة", message: "معاملاتك أصبحت أسهل." },
      { label: "التعليم", message: "تعلّم مباشرة بلغة الإشارة." },
    ],
  },
  demo: {
    eyebrow: "مركز العروض",
    title: "شاهده أثناء العمل، ثم تعرّف على طريقة إعداده.",
    description: "عرض متحرك لخطوات الترجمة، إضافة إلى مقاطع الفيديو والدروس التي نُعدّها — دون الحاجة إلى ميكروفون أو حساب للمعاينة.",
    tabsLabel: "فئات مركز العروض",
    tabs: { demos: "عروض المنتج", tutorials: "دروس مرئية وتفاعلية" },
    flagship: {
      title: "ترجمة الإشارة في الوقت الفعلي",
      badge: "عرض متحرك",
      note: "هذا عرض محاكى للخطوات وليس ترجمة مباشرة. جرّب التطبيق المباشر للتجربة الفعلية.",
      progressLabel: "تقدّم العرض",
      stepsLabel: "خطوات العرض",
      current: "الحالية",
      play: "تشغيل العرض",
      pause: "إيقاف مؤقت",
      replay: "إعادة التشغيل",
      restart: "البدء من جديد",
      captions: "النص المكتوب",
      previewTitle: "معاينة مخرجات الإشارة",
      captionsHidden: "النص المكتوب مخفي",
      steps: [
        { label: "رُصد كلام", caption: "«أين أقرب مخرج؟»" },
        { label: "تم التعرّف على العبارة", caption: "تحويل المعنى إلى بنية لغة الإشارة" },
        { label: "عرض الإشارة", caption: "يعرض المؤشّر الرسالة مع النص المكتوب" },
      ],
    },
    media: {
      comingSoon: "الفيديو قريبًا",
      preview: "معاينة",
      previewAria: "معاينة: {title}",
      comingSoonNote: "هذا الفيديو غير متاح بعد. يمكنك في الأثناء تجربة التطبيق المباشر.",
    },
    productDemos: [
      {
        title: "إجراءات الطوارئ السريعة",
        description: "عبارات طوارئ جاهزة بلمسة واحدة، تُعرض بالإشارة فورًا دون كتابة أو نطق جملة كاملة.",
      },
      {
        title: "من النص إلى الإشارة",
        description: "اكتب عبارة أو الصقها وشاهدها بلغة إشارة متحركة.",
      },
    ],
    tutorials: [
      {
        title: "البدء للمستخدمين الصمّ",
        description: "أعدّ ملفك الشخصي وإذن الكاميرا ولغة الإشارة المفضلة لديك.",
        audience: "مستخدمون جدد",
      },
      {
        title: "استخدام Deafference في الاستقبال",
        description: "كيف يستخدم الطاقم الصحي Deafference لتسجيل الوصول والاستشارات.",
        audience: "الطاقم الصحي",
      },
      {
        title: "إعداد عبارات الطوارئ",
        description: "جهّز عبارات طوارئ بلمسة واحدة للمواقف العصيبة التي لا تحتمل التأخير.",
        audience: "المسؤولون",
      },
    ],
    ctaTitle: "مستعد لتجاوز المعاينة؟",
    ctaBody: "افتح التطبيق المباشر وجرّب الترجمة الفورية بصوتك أو بالكاميرا.",
    ctaButton: "افتح التطبيق المباشر",
  },
  features: {
    eyebrow: "المزايا",
    title: "كل اتجاهات الترجمة في مكان واحد",
    description: "ينتقل Deafference بين اللغة المنطوقة والمكتوبة ولغة الإشارة — بالعناية التي تحتاجها المحادثات الحساسة.",
    coreHeading: "اتجاهات الترجمة الأساسية",
    trustHeading: "مبني على الثقة",
    learnMore: "شاهده في العرض",
    cards: [
      {
        title: "من الكلام إلى الإشارة",
        subtitle: "الكلمات المنطوقة تظهر بإشارة متحركة",
        pill: "الكلام ← الإشارة",
        badge: "صوت",
        detail: "يستمع إلى الشخص السامع ويعرض كلامه بلغة الإشارة عبر مؤشّر متحرك، عبارة بعد عبارة.",
      },
      {
        title: "من الإشارة إلى الكلام",
        subtitle: "الإشارة تتحول إلى صوت منطوق",
        pill: "الإشارة ← الكلام",
        badge: "كاميرا",
        detail: "يستخدم الكاميرا للتعرّف على أشكال اليد وحركتها، ثم ينطق الرسالة بصوت مسموع للشخص السامع.",
      },
      {
        title: "من النص إلى الإشارة",
        subtitle: "الرسائل المكتوبة تظهر بالإشارة",
        pill: "النص ← الإشارة",
        badge: "نص",
        detail: "اكتب رسالة أو الصقها وشاهدها بلغة إشارة متحركة — مفيد عندما لا يكون الكلام ممكنًا.",
      },
      {
        title: "من الإشارة إلى النص",
        subtitle: "الإشارة تتحول إلى نص مكتوب",
        pill: "الإشارة ← النص",
        badge: "نص مكتوب",
        detail: "يحوّل الإشارة إلى نص مكتوب أثناء المحادثة، ليتمكن الجميع من المتابعة.",
      },
    ],
    illustration: {
      audio: "صوت",
      signIn: "إشارة",
      captions: "نص مكتوب",
      editor: "نص",
    },
    live: {
      title: "ترجمة مباشرة",
      body: "تدفّق متواصل في الاتجاهين — لتسير المحادثة في الاتجاهين بدل تبادل الأدوار في انتظار الترجمة.",
      chip: "في الاتجاهين وفي الوقت الفعلي",
    },
    trust: [
      {
        title: "خاص وآمن",
        description: "تُستخدم الكاميرا والميكروفون فقط عند بدء جلسة، ولا تُحفظ تسجيلات محادثاتك في حسابك.",
      },
      {
        title: "دقة بعناية",
        description: "نماذج ذكاء اصطناعي تركّز على التعرّف على الإشارة، مع عناية خاصة بالمفردات اليومية والطبية. في القرارات الحرجة، تحقّق دائمًا مع مترجم مؤهل.",
      },
    ],
    integrations: {
      heading: "مصمَّم للتكامل",
      description: "تكاملات مخطَّط لها لتناسب الأدوات التي تستخدمها المؤسسات بالفعل.",
      items: [
        { title: "السجلات الصحية الإلكترونية", text: "إدخال الترجمة في سير العمل السريري." },
        { title: "مكالمات الفيديو", text: "إضافة الإشارة والترجمة النصية إلى المواعيد والاجتماعات عن بُعد." },
        { title: "الاتصال الداخلي ومكاتب الاستقبال", text: "المساعدة عند مكاتب الاستقبال وأنظمة الاتصال الداخلي في المستشفيات." },
        { title: "واجهات برمجة مخصّصة", text: "ربط Deafference بأنظمتك الخاصة." },
      ],
      note: "هذه التكاملات ضمن خطتنا القادمة، ويتم إعدادها مع كل مؤسسة.",
      cta: "خطّط لتكاملك",
    },
  },
  performance: {
    eyebrow: "الأداء",
    title: "سريع بما يكفي لمحادثة حقيقية",
    description: "صُمّم Deafference ليواكب المحادثة الطبيعية على الأجهزة التي يملكها الناس أصلًا — دون أي أجهزة خاصة.",
    metrics: [
      { value: "فوري", label: "تظهر الترجمة أثناء جريان المحادثة" },
      { value: "أي شاشة", label: "يعمل في متصفح حديث على الهاتف أو الجهاز اللوحي أو الحاسوب" },
      { value: "لغتان", label: "واجهة كاملة بالعربية والإنجليزية" },
    ],
    qualities: [
      { title: "لا شيء لتثبيته", text: "يعمل في المتصفح، فيمكنك البدء من أي جهاز." },
      { title: "واضح على كل شاشة", text: "تتكيّف التخطيطات من الهواتف الصغيرة إلى شاشات الحاسوب الكبيرة." },
      { title: "متوقَّع", text: "عناصر تحكم ثابتة، لتعرف دائمًا ما يحدث." },
    ],
  },
  pricing: {
    eyebrow: "الأسعار",
    title: "خطط لكل حجم، من الاستخدام الشخصي إلى شبكات المستشفيات",
    description: "تشمل كل خطة الترجمة الأساسية. وتضيف الخطط الأعلى الترجمة في الاتجاهين والتكاملات والدعم المخصص مع توسّع استخدامك.",
    mostPopular: "الأكثر طلبًا",
    note: "الأسعار تقديرية وقد تتغير قبل الإطلاق العام. تواصل معنا للحصول على عرض سعر مناسب لمؤسستك.",
    plans: [
      {
        name: "مجانية",
        audience: "للمستخدمين الصمّ وضعاف السمع الأفراد وللاستعداد الشخصي للطوارئ",
        price: "$0",
        cadence: "/شهريًا",
        features: ["عبارات طوارئ سريعة", "عبارات أساسية دون اتصال", "تحويل النص إلى إشارة"],
        cta: "ابدأ الآن",
      },
      {
        name: "أساسية",
        audience: "للعيادات الصغيرة والممارسات الخاصة والمكاتب المجتمعية المحلية",
        price: "$500",
        cadence: "/شهريًا",
        features: ["ترجمة الإشارة في الوقت الفعلي", "بطاقات تواصل رقمية", "استخدام على جهاز واحد", "دعم عبر البريد الإلكتروني"],
        cta: "اختر الأساسية",
      },
      {
        name: "مميزة",
        audience: "للمستشفيات الإقليمية والمؤسسات التعليمية والمؤسسات متوسطة الحجم",
        price: "$5,000",
        cadence: "/شهريًا",
        features: [
          "ترجمة في الاتجاهين من الإشارة إلى الكلام ومن الكلام إلى الإشارة",
          "لهجات متعددة",
          "تنبيهات مرئية في غرف الانتظار",
          "دعم تقني ذو أولوية",
        ],
        cta: "اختر المميزة",
      },
      {
        name: "المؤسسات",
        audience: "لشبكات المستشفيات والجهات الحكومية والجامعات والمؤسسات متعددة الفروع",
        price: "$10,000–$50,000",
        cadence: "/سنويًا، حسب الطلب",
        features: [
          "التكامل مع أنظمة المستشفى والأنظمة السريرية",
          "تدريب مخصص على اللهجات الإقليمية",
          "دعم مراجعات الأمان والامتثال لديكم",
          "اتفاقية مستوى الخدمة",
          "ترخيص لعدة أقسام",
        ],
        cta: "تواصل مع المبيعات",
      },
    ],
  },
  privacy: {
    eyebrow: "الخصوصية",
    title: "خصوصية تحترم المحادثة",
    description: "ملخص بلغة بسيطة لكيفية تعامل Deafference مع بيانات الكاميرا والميكروفون والحساب. هذا الملخص ليس سياسة الخصوصية القانونية الكاملة.",
    badge: "ملخص بلغة بسيطة",
    principles: [
      {
        title: "الكاميرا والميكروفون عند طلبك فقط",
        description: "يطلب متصفحك الإذن أولًا، ولا يُستخدمان إلا أثناء الترجمة. يمكنك إيقاف الوصول في أي وقت من إعدادات المتصفح.",
      },
      {
        title: "لا تُحفظ تسجيلات في حسابك",
        description: "يُستخدم الفيديو والصوت لإنتاج الترجمة في لحظتها. لا يحتفظ حسابك بتسجيلات لمحادثاتك.",
      },
      {
        title: "فقط ما يحتاجه حسابك",
        description: "نخزّن اسمك وبريدك الإلكتروني وكلمة المرور (مشفّرة) وصورة ملف شخصي اختيارية ولغة الإشارة المفضلة لديك وما إذا كنت سمحت بالوصول إلى الكاميرا.",
      },
      {
        title: "التحكم بيدك",
        description: "يمكنك تحديث ملفك الشخصي أو تغيير كلمة المرور أو حذف حسابك من صفحة ملفك الشخصي.",
      },
    ],
    contact: "لديك أسئلة عن بياناتك؟ راسلنا على",
    rights: {
      title: "حقوقك",
      items: [
        "الاطلاع على معلومات ملفك الشخصي وتحديثها في أي وقت.",
        "حذف حسابك من صفحة ملفك الشخصي.",
        "طلب نسخة من بياناتك عبر مراسلتنا بالبريد الإلكتروني.",
        "مسح الإعدادات المحفوظة على هذا الجهاز (مثل الوضع الهادئ وتفضيلات الكاميرا) بمسح بيانات الموقع من متصفحك.",
      ],
    },
  },
  faq: {
    eyebrow: "الأسئلة الشائعة",
    title: "أسئلة شائعة بإجابات بسيطة",
    description: "كل ما تحتاج معرفته قبل تجربة Deafference. لم تجد إجابتك؟ تواصل معنا أدناه.",
    items: [
      {
        question: "ما هو Deafference؟",
        answer:
          "Deafference منصة تواصل بالذكاء الاصطناعي تساعد الصمّ وضعاف السمع والسامعين على فهم بعضهم. تترجم بين لغة الإشارة والكلام والنص في الوقت الفعلي، مع تركيز على الرعاية الصحية والخدمات اليومية.",
      },
      {
        question: "ما لغات الإشارة المدعومة؟",
        answer: "نبني دعم لغات الإشارة خطوة بخطوة. يمكنك اختيار لغة الإشارة المفضلة في ملفك الشخصي، ونضيف التنوّع الإقليمي ومزيدًا من لغات الإشارة الوطنية مع الوقت.",
      },
      {
        question: "ماذا يحدث لبيانات الكاميرا والميكروفون؟",
        answer:
          "لا تُستخدم إلا بعد منحك الإذن وبدء جلسة. يُستخدم الفيديو والصوت لإنتاج الترجمة في لحظتها ولا يُحفظان في حسابك. يمكنك إيقاف الوصول في أي وقت من متصفحك.",
      },
      {
        question: "هل يحلّ Deafference محل مترجم لغة الإشارة المحترف؟",
        answer: "لا. يساعد Deafference في اللحظات اليومية التي لا يتوفر فيها مترجم. أما الموافقات الطبية والمسائل القانونية وغيرها من القرارات الحرجة، فاحجز دائمًا مترجم لغة إشارة مؤهلًا.",
      },
      {
        question: "كم التكلفة؟ هل يمكنني التجربة مجانًا؟",
        answer: "يمكن للأفراد البدء بالخطة المجانية. ويمكن للمؤسسات الاطلاع على خططنا التقديرية في قسم الأسعار أو التواصل معنا للحصول على عرض سعر مخصص.",
      },
      {
        question: "هل يتوفر Deafference باللغة العربية؟",
        answer: "نعم. الواجهة متاحة بالعربية والإنجليزية — استخدم زر اللغة أعلى الصفحة للتبديل.",
      },
      {
        question: "ما مدى دقة الترجمة؟",
        answer:
          "تتحسّن الدقة باستمرار، مع عناية إضافية بالمفردات اليومية والطبية. ومع ذلك قد تحدث أخطاء، لذا تحقّق دائمًا مع مترجم مؤهّل في حالات الموافقة الطبية أو المسائل القانونية أو القرارات المهمة الأخرى.",
      },
      {
        question: "هل يعمل Deafference بدون إنترنت؟",
        answer:
          "تحتاج الترجمة المباشرة إلى اتصال بالإنترنت. تتضمن الخطة المجانية بعض العبارات الأساسية المصمّمة للاستخدام دون اتصال، ونعمل على نقل المزيد من المعالجة إلى الجهاز ليستمر العمل مع الاتصال الضعيف.",
      },
    ],
  },
  contact: {
    eyebrow: "تواصل معنا",
    title: "لنتحدث عن خطة التطبيق لديكم",
    description: "أخبرنا عن فريقك أو حالة الاستخدام لديك وسنتواصل معك بالخطوات التالية، مهما كانت مرحلتك مبكرة.",
    formEyebrow: "ابدأ المحادثة",
    formTitle: "أرسل لنا رسالة",
    name: "الاسم",
    email: "البريد الإلكتروني",
    message: "الرسالة",
    submit: "إرسال الرسالة",
    organization: "المؤسسة (اختياري)",
    topic: "الموضوع",
    topics: {
      general: "سؤال عام",
      demo: "حجز عرض توضيحي",
      sales: "الأسعار والمبيعات",
      partnership: "شراكة",
      support: "الدعم",
    },
    method: "طريقة الرد المفضّلة",
    methods: {
      email: "البريد الإلكتروني",
      video: "مكالمة فيديو بلغة الإشارة",
      chat: "محادثة نصية",
    },
    mailTopic: "الموضوع",
    mailOrganization: "المؤسسة",
    mailMethod: "طريقة الرد المفضّلة",
    errors: {
      nameRequired: "يُرجى إدخال اسمك.",
      emailRequired: "يُرجى إدخال بريدك الإلكتروني.",
      emailInvalid: "يُرجى إدخال بريد إلكتروني صالح، مثل name@example.com.",
      messageRequired: "يُرجى كتابة رسالة.",
      messageShort: "يُرجى كتابة 10 أحرف على الأقل.",
      summary: "يُرجى تصحيح الحقول المميزة.",
    },
    statusTitle: "من المفترض أن يفتح تطبيق البريد لديك ومعه رسالتك.",
    statusBody: "إن لم يفتح، راسلنا مباشرة على",
    copy: "نسخ العنوان",
    copied: "تم النسخ",
    mailSubject: "استفسار من الموقع من {name}",
    channels: [
      { title: "الاستفسارات العامة", description: "أسئلة عن المنتج أو عرض توضيحي." },
      { title: "الشراكات والمبيعات", description: "تجربة Deafference في عيادة أو حرم جامعي أو جهة حكومية." },
      { title: "الدعم", description: "تستخدم التطبيق وتحتاج إلى مساعدة." },
    ],
  },
  cta: {
    eyebrow: "ابدأ من هنا",
    title: "اجعل محادثتك القادمة أسهل للجميع.",
    body: "جرّب Deafference مجانًا، أو تحدّث معنا عن استخدامه في عيادتك أو حرمك الجامعي أو مكتب الخدمة لديك.",
    chip: "تتوفر خطة مجانية",
    primary: "جرّب Deafference",
    secondary: "تواصل معنا",
  },
  footer: {
    tagline: "تواصل فوري بالذكاء الاصطناعي بين لغة الإشارة والكلام والنص — مبني مع مجتمع الصمّ وضعاف السمع ومن أجله.",
    explore: "استكشف",
    company: "الشركة",
    contactHeading: "تواصل",
    email: "البريد الإلكتروني",
    rights: "© {year} Deafference. جميع الحقوق محفوظة.",
    a11yTitle: "بيان إمكانية الوصول",
    a11yBody:
      "نسعى إلى استيفاء معيار WCAG 2.2 بمستوى AA. يعمل الموقع باستخدام لوحة المفاتيح وقارئات الشاشة، ويدعم العربية من اليمين إلى اليسار، ويحترم إعدادات تقليل الحركة، ولا يعتمد على الصوت وحده أبدًا.",
    a11yContact: "واجهت عائقًا؟ أخبرنا على",
    backToTop: "العودة إلى الأعلى",
  },
}

export const landing = { en, ar }
