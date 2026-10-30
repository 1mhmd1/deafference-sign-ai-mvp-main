const en = {
  nav: {
    /** Keyed by section; the landing components map LANDING_NAV / FOOTER_*_NAV hrefs onto these keys. */
    links: {
      homeLink: "Home",
      scenarios: "Scenarios",
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
      faq: "FAQ",
      security: "Security",
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
  /** The header's accessibility menu (accessibility-menu.tsx). Text size names come from the app's own settings copy. */
  a11y: {
    button: "Accessibility settings",
    title: "Accessibility",
    subtitle: "Change how this site looks. Your choices are saved in this browser.",
    textSize: "Text size",
    contrast: "High contrast",
    contrastDesc: "Darker text and stronger lines.",
    calm: "Calm mode",
    calmDesc: "Stops moving pictures and animations.",
    on: "On",
    off: "Off",
    emergency: "Emergency phrases",
    reset: "Reset",
    close: "Close accessibility settings",
  },
  /** The "Watch in sign language" button and player (sign-video.tsx); shown only where a video exists. */
  signVideo: {
    watch: "Watch in sign language",
    title: "This page in sign language",
    close: "Close video",
    captions: "English captions",
    error: "This video couldn't be loaded. Please try again later.",
  },
  judy: {
    floatingLabel: "Judy, the Deafference guide (decorative animation)",
    sceneLabel: "Judy walking through the everyday places where Deafference helps",
  },
  hero: {
    status: "Real-time sign ↔ speech",
    headline: ["BREAKING", "COMMUNICATION", "BARRIERS"],
    /** One supporting line under the headline; the illustration shows the rest. */
    tagline: "Sign, speech and text, translated both ways, so both sides understand.",
    primaryCta: "Try Deafference",
    /** Opens the emergency phrases panel (the same one as the floating button); it works without an account. */
    emergency: "Emergency phrases",
    emergencyNote: "Ready-made messages, shown full screen in one tap. No sign-up needed.",
    secondaryCta: "Watch it in action",
    scenariosCta: "Explore scenarios",
    modeLabel: "Mode",
    modeValue: "Live",
    modeAccent: "two-way",
    privacyLabel: "Privacy",
    privacyValue: "You stay in control",
    illustrationLabel: "How a conversation flows: you sign, Deafference translates, and the other person hears and reads your words.",
    /** The three connected stages around the hero globe, in order. */
    cards: {
      sign: "You sign",
      understands: "Deafference translates",
      hear: "They understand",
    },
    /** The home hero picture (df-hero-net.tsx): Deafference in the middle, linked to four steps. */
    net: {
      label: "Deafference in the middle of a conversation: you sign, the AI understands, they hear you, and everyone connects.",
      sign: "You sign",
      ai: "AI understands",
      hear: "They hear you",
      connect: "Everyone connects",
    },
  },
  about: {
    eyebrow: "About us",
    /** Home page link from "Our story" to the full /about page. */
    moreLink: "More about us",
    title: "A small team building the bridge between spoken and signed language",
    description:
      "Deafference started from a simple observation: everyday spoken interactions still leave Deaf and hard-of-hearing people waiting on an interpreter who isn't always there. We're building the software that closes that gap.",
    storyEyebrow: "Our story",
    storyLead: "It started at a clinic, where a five-minute check-in took forty.",
    /** The story as four connected scenes: the difficulty, the problem made visible, Deafference, understanding. */
    storyScenesLabel: "Our story in four steps",
    storyScenes: [
      { title: "No interpreter", caption: "None was booked for a routine visit." },
      { title: "Notes on paper", caption: "Five minutes became forty." },
      { title: "Deafference", caption: "Built to translate sign, speech and text." },
      { title: "Understood", caption: "Both sides can follow the conversation." },
    ],
    storyMinutes: "min",
    tabsLabel: "About us subsections",
    tabs: {
      mission: "Mission",
      vision: "Vision",
      values: "Core values",
      team: "Our team",
      future: "Future goals",
    },
    missionTitle: "Our mission",
    // Plain language throughout /about: short sentences, everyday words, no idioms (for readers whose
    // first language is a sign language).
    missionBody:
      "We want Deaf and hard-of-hearing people to be understood when it matters most: at a hospital desk, in an emergency room or at a service counter. Deafference turns speech into sign and text, and sign into speech. No one should have to book help in advance. Help should be there when the conversation happens.",
    visionTitle: "Our vision",
    visionBody:
      "A world where Deaf and hard-of-hearing people do not have to plan ahead to be understood, at the doctor or anywhere else. We want Deafference to be as normal and reliable as captions or a ramp, and ready wherever people talk.",
    /** Labels in the pictures on the mission and vision cards (/about). */
    missionPlaces: ["Hospital intake", "Emergency room", "Service counter"],
    visionItems: ["Captions", "A ramp", "Deafference"],
    values: [
      {
        title: "Accessibility first",
        description: "Every design choice starts with the Deaf or hard-of-hearing person. Accessibility is not added at the end.",
      },
      {
        title: "Patient safety",
        description:
          "In a clinic, a wrong translation can hurt someone. We keep the words clear and simple, especially in medical and emergency phrases.",
      },
      {
        title: "Cultural respect",
        description:
          "Sign languages are full languages, with their own grammar and local signs. We do not translate them word for word from spoken language.",
      },
      {
        title: "Technical care",
        description: "We need speed and accuracy together. A late or wrong sign means a lost conversation.",
      },
      {
        title: "Honest about limits",
        description: "We say clearly what Deafference cannot do yet, and when you should use a qualified interpreter instead.",
      },
    ],
    teamIntro: "We describe our team by what each group does. Deaf and hard-of-hearing people help shape the product, not only test it.",
    teamGroups: [
      {
        heading: "Product & partnerships",
        roles: [
          { role: "Product leadership", note: "Sets the direction. Accessibility and patient safety come first." },
          { role: "Healthcare partnerships", note: "Works with clinics to learn how their front desks and exam rooms really work." },
        ],
      },
      {
        heading: "Engineering",
        roles: [
          { role: "Machine learning", note: "Builds the AI that recognises signs and speech, made for live conversation." },
          { role: "Product engineering", note: "Builds clear screens in English and Arabic that work on everyday phones and computers." },
        ],
      },
      {
        heading: "Community & accessibility",
        roles: [
          { role: "Deaf community input", note: "Deaf signers give feedback that shapes the signing and the product." },
          { role: "Interpreter guidance", note: "Professional interpreters tell us when a human interpreter should take over." },
        ],
      },
    ],
    hiring: {
      title: "We're hiring",
      body: "We are looking for engineers and for people to work with the Deaf community. Deaf and hard-of-hearing applicants are very welcome.",
      cta: "Get in touch",
    },
    goals: [
      {
        title: "More sign languages and dialects",
        timeframe: "Next",
        description: "Support for local signs and for more national sign languages.",
      },
      {
        title: "Integrations for organisations",
        timeframe: "Planned",
        description: "One login for staff, links to clinic systems and team management, so hospitals and agencies can start one department at a time.",
      },
      {
        title: "Works with weak connections",
        timeframe: "Ongoing",
        description: "More of the work done on the device itself, so translation keeps working where the internet is weak.",
      },
    ],
  },
  why: {
    eyebrow: "Why choose us",
    title: "Built for the conversations that can't wait",
    description:
      "Deafference is designed around the real moments where communication breaks down — and around the people who rely on it most.",
    reasons: [
      { title: "Accessibility first", description: "Adjustable text size, high contrast and reduced motion, built in." },
      { title: "Made for healthcare moments", description: "Check-ins, consultations, pharmacies and emergencies." },
      { title: "Two-way, in real time", description: "Sign to speech and speech to sign, in one flow." },
      { title: "Private by design", description: "Camera and mic run only during a session; recordings aren't saved to your account." },
    ],
    /** Labels inside the small diagram on each card (why-choose-us.tsx). */
    visual: {
      textSize: "Text size",
      contrast: "High contrast",
      motion: "Reduced motion",
      on: "On",
      patient: "Patient",
      clinician: "Clinician",
      places: ["Check-in", "Consultation", "Pharmacy", "Emergency"],
      sign: "Sign",
      speech: "Speech",
      text: "Text",
      sessionOn: "Session on",
      sessionOff: "Session off",
      notSaved: "Not saved to your account",
    },
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "3 steps from spoken word to visual sign.",
    description: "The highlight moves from step to step on its own. Hovering or tapping a step pauses it there, and calm mode turns the movement off.",
    stages: [
      { title: "Speech capture", caption: "Your device's microphone picks up what the hearing person says.", tag: "Audio input" },
      { title: "AI processing", caption: "The AI understands the sentence and puts it in sign language order.", tag: "Sign structure" },
      { title: "Sign output", caption: "An animated signer shows the message, with text captions alongside.", tag: "Ready to watch" },
    ],
    // The other direction, shown when the visitor flips the direction switch.
    titleReverse: "3 steps from visual sign to text and speech.",
    stagesReverse: [
      { title: "Sign capture", caption: "The camera follows the Deaf person's hands, face and movement.", tag: "Camera input" },
      { title: "AI processing", caption: "The AI reads the signs and turns them into a natural sentence.", tag: "Sentence structure" },
      { title: "Text & speech output", caption: "The hearing person reads the words on screen and hears them spoken aloud.", tag: "Ready to read & hear" },
    ],
    direction: {
      label: "Translation direction",
      speech: "Speech",
      sign: "Sign",
      textSpeech: "Text & speech",
      /** Button name; {from} and {to} are the chip labels of the direction it switches to. */
      switchTo: "Switch to {from} to {to}",
    },
  },
  scenarios: {
    eyebrow: "Scenarios",
    title: "Take a walk through everyday life, with Judy as your guide.",
    description:
      "From a check-up at the clinic to a gate change at the airport, Judy visits the everyday places where Deafference helps Deaf and hearing people understand each other.",
    imageAlt:
      "Illustrated map titled “Where Deafference matters — In every place. Every day.” Seven rooms surround a glowing Deafference hub, linked by paths: Healthcare (a doctor talking with a patient), Hospitality (a hotel front desk), Workplaces (a team meeting), Emergencies (an ambulance bay), Travel (an airport check-in counter), Services & Public (a public service desk) and Education (a classroom). Judy, the animated guide, walks between the rooms.",
    listLabel: "Places Judy visits",
    /** Shown on the left of the exchange in the selected place: you, then Deafference, then `with`. */
    you: "You",
    items: [
      { label: "Healthcare", message: "Every patient understands their doctor.", with: "Doctor" },
      { label: "Hospitality", message: "Check in with no barriers.", with: "Front desk" },
      { label: "Workplaces", message: "A voice in every meeting.", with: "Your team" },
      { label: "Emergencies", message: "Help arrives, fast and clear.", with: "Paramedics" },
      { label: "Travel", message: "Gate change? You'll know right away.", with: "Gate staff" },
      { label: "Services & Public", message: "Paperwork, made simple.", with: "Service desk" },
      { label: "Education", message: "Learn live, in sign language.", with: "Teacher" },
    ],
    /** Accessible name for each clickable road marker; {place} is the room's label. */
    askJudy: "Ask Judy about {place}",
    // What Judy says at each clickable road marker, in the order of RINGS in scenarios.tsx.
    rings: [
      "I sign how I feel, and the doctor understands me right away.",
      "At the hotel desk, check-in is quick — no notes on paper.",
      "In meetings, my team hears me and I see what they say.",
      "Job interviews are fair when both sides understand each other.",
      "In an emergency every second counts — I can explain fast.",
      "Paramedics understand me, and I understand them.",
      "Tip: the Emergency Phrases button has ready-made messages.",
      "At the airport, I'll know about a gate change right away.",
      "Lost on a trip? I can ask anyone for directions.",
      "At public offices, I don't have to wait for an interpreter.",
      "Questions at the counter go both ways: signed and spoken.",
      "Banks, post offices, city hall — Deafference comes with me.",
      "In class, the teacher's words reach me live.",
      "I can ask a question in sign, and the whole class hears it.",
    ],
  },
  demo: {
    eyebrow: "Demo center",
    title: "See it in action, then explore how to set it up.",
    description: "Video and interactive tutorials we're preparing to help you set up and use Deafference — and the live app, ready whenever you are.",
    tutorialsTitle: "Video & interactive tutorials",
    media: {
      comingSoon: "Video coming soon",
      tryIt: "Try it in the app",
    },
    /** `steps` are drawn as the thumbnail; `description` is its text alternative. */
    tutorials: [
      {
        title: "Getting started for Deaf users",
        description: "Set up your profile, camera permission and preferred sign language.",
        audience: "New users",
        steps: ["Your profile", "Allow camera", "Pick sign language"],
      },
      {
        title: "Using Deafference at the front desk",
        description: "How healthcare staff can use Deafference for check-in and consultations.",
        audience: "Healthcare staff",
        steps: ["Patient signs", "Text on screen", "Staff replies"],
      },
      {
        title: "Setting up emergency phrases",
        description: "Prepare one-tap emergency phrases for high-stress, time-critical situations.",
        audience: "Admins",
        steps: ["Open Emergency", "Pick a phrase", "Shown full screen"],
      },
    ],
    // The app is an early preview (it says sign recognition isn't connected yet), so the CTA says so.
    ctaTitle: "Try the Deafference app",
    ctaBody: "An early preview: sign recognition is still being connected.",
    ctaButton: "Open the app preview",
    ctaImageAlt: "The Deafference listening workspace, with the live camera, current status and live translation panels.",
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
          "The camera and microphone work only when you start a session. Recordings of your conversations are not saved to your account.",
      },
      {
        title: "Careful accuracy",
        description:
          "Our AI focuses on reading signs, with extra care for everyday and medical words. For important decisions, always check with a qualified interpreter.",
      },
    ],
    /** Labels in the "Careful accuracy" picture. */
    accuracyVisual: {
      everyday: "Everyday words",
      medical: "Medical words",
      critical: "Critical decision",
      interpreter: "Qualified interpreter",
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
    note: "Prices are estimates and may change before launch. Contact us for a price for your organisation.",
    paths: {
      label: "Who is Deafference for?",
      back: "Back to both options",
      switchTo: "Switch to",
      personal: {
        title: "Personal use",
        body: "For Deaf and hard-of-hearing people using Deafference in their own everyday life.",
        cta: "See the personal plan",
      },
      industries: {
        title: "Industries",
        body: "For clinics, hospitals, schools, agencies and teams that serve Deaf and hard-of-hearing people.",
        cta: "See options for organisations",
      },
      tracksLabel: "How would your organisation like to pay?",
      subscription: {
        title: "Subscription",
        body: "Monthly plans for single sites and growing teams. Pro or Premium.",
      },
      enterprise: {
        title: "Enterprise",
        body: "A tailored annual contract for networks and multi-site organisations.",
      },
      contract: "Annual contract",
      chooseHint: "Choose Subscription or Enterprise to see the details.",
    },
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
        name: "Pro",
        audience: "For small clinics, private practices and local community offices",
        price: "$500",
        cadence: "/month",
        features: ["Real-time sign translation", "Digital communication cards", "Single-device access", "Email support"],
        cta: "Choose Pro",
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
      "A short, simple summary of how Deafference uses your camera, microphone and account data. It is not the full legal privacy policy.",
    badge: "Plain-language summary",
    principles: [
      {
        title: "Camera and microphone only when you ask",
        description:
          "Your browser asks you first. They work only while you are translating. You can turn them off at any time in your browser settings.",
      },
      {
        title: "No recordings saved to your account",
        description: "Video and audio are used only to make the translation at that moment. Your account does not keep recordings of your conversations.",
      },
      {
        title: "Only what your account needs",
        description:
          "We keep only your name, your email, your password (encrypted), a profile photo if you add one, your sign language, and whether you allowed the camera.",
      },
      {
        title: "You're in control",
        description: "On your profile page you can change your details, change your password or delete your account.",
      },
    ],
    contact: "Questions about your data? Email us at",
    rights: {
      title: "Your rights",
      items: [
        "See and update your profile information at any time.",
        "Delete your account from your profile page.",
        "Ask for a copy of your data by emailing us.",
        "Remove settings saved on this device (like calm mode and camera choices) by clearing this site's data in your browser.",
      ],
    },
    /** Labels in the browser permission picture on the first principle. */
    visual: {
      prompt: "Use your camera and microphone?",
      allow: "Allow",
      block: "Block",
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Common questions, answered simply",
    /** Shown under the first two questions; {count} is how many more there are. */
    viewMore: "View more questions ({count})",
    viewLess: "Show fewer questions",
    description: "Everything you need to know before trying Deafference. Can't find your answer? Get in touch below.",
    /** Card beside the questions on /faq. */
    ask: {
      title: "Still have a question?",
      body: "Write to us and we'll answer by email.",
      cta: "Contact us",
    },
    items: [
      // Answers in plain language: short sentences, one idea each.
      {
        question: "What is Deafference?",
        answer:
          "Deafference is an AI app that helps Deaf, hard-of-hearing and hearing people understand each other. It is built to translate between sign language, speech and text, for healthcare and everyday services.",
      },
      {
        question: "Which sign languages are supported?",
        answer:
          "We are adding sign languages step by step. You can choose your sign language in your profile. Over time we will add local signs and more national sign languages.",
      },
      {
        question: "What happens to my camera and microphone data?",
        answer:
          "They are used only after you allow them and start a session. Video and audio make the translation at that moment. They are not saved to your account. You can turn access off at any time in your browser.",
      },
      {
        question: "Does Deafference replace a professional interpreter?",
        answer:
          "No. Deafference helps in everyday moments when no interpreter is available. For medical consent, legal matters and other important decisions, always book a qualified sign language interpreter.",
      },
      {
        question: "How much does it cost? Can I try it for free?",
        answer: "People can start with the free plan. Organisations can see our estimated prices on the Pricing page, or contact us for a price.",
      },
      {
        question: "Is Deafference available in Arabic?",
        answer: "Yes. The site is in English and Arabic. Use the language button at the top of the page to switch.",
      },
      {
        question: "How accurate is the translation?",
        answer:
          "It keeps getting better, with extra care for everyday and medical words. It can still make mistakes. For medical consent, legal matters and other important decisions, always check with a qualified interpreter.",
      },
      {
        question: "Does Deafference work without internet?",
        answer:
          "Live translation needs the internet. The free plan has some basic phrases made to work offline. We are moving more of the work onto the device, so it keeps working when the internet is weak.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your rollout",
    description: "Tell us about your team or use case and we'll follow up with next steps, no matter how early you are.",
    formEyebrow: "Start a conversation",
    formTitle: "Send us a message",
    /** How sending works, drawn above the form: there's no contact API, the visitor's own email app sends it. */
    flow: ["Write your message", "Your email app opens", "We reply by email"],
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
    method: "How you'd like to get in touch",
    methods: {
      email: "Email",
      video: "Attach a sign-language video",
      chat: "Text chat",
    },
    /** The video picker shown when "Attach a sign-language video" is chosen. */
    video: {
      choose: "Choose or record a video",
      change: "Change video",
      remove: "Remove video",
      hint: "MP4, MOV or WebM, up to 25 MB (most email apps can't send larger files).",
      previewLabel: "Preview of your video: {file}",
    },
    mailTopic: "Topic",
    mailOrganization: "Organisation",
    mailMethod: "Contact preference",
    mailVideo: "Video",
    errors: {
      nameRequired: "Please enter your name.",
      emailRequired: "Please enter your email address.",
      emailInvalid: "Please enter a valid email address, like name@example.com.",
      messageRequired: "Please write a message.",
      messageShort: "Please write at least 10 characters.",
      videoRequired: "Please choose a video to attach, or pick another way to get in touch.",
      videoTooBig: "This video is {size} MB. Most email apps can't send files over 25 MB, so please choose a shorter clip.",
      summary: "Please fix the highlighted fields.",
    },
    statusTitle: "Your email app should open with your message.",
    statusBody: "If it didn't open, email us directly at",
    /** Shown after sending when the browser can't attach the video itself (mailto can't carry files). */
    statusAttach: "Before you send, attach your video ({file}) to the email. Browsers can't attach it for you.",
    statusShared: "Your video and message are ready in the app you chose. Send them from there.",
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
  /** Home page band linking to the sections that moved to their own pages. */
  explore: {
    eyebrow: "Learn more",
    title: "Pricing, questions, security and contact",
    items: {
      pricing: { title: "Pricing", cta: "See pricing" },
      faq: { title: "Questions", cta: "Read the FAQ" },
      security: { title: "Security & privacy", cta: "See how we protect it" },
      contact: { title: "Contact", cta: "Get in touch" },
    },
  },
  /**
   * The home page drawn from the website design (components/landing/home). Copy that already existed
   * (scenario places, demo tutorials, the explore links, why-choose-us reasons) is reused from its own block.
   */
  home: {
    /** Read before each chat bubble so it's clear who is talking. */
    signed: "Signed",
    spoken: "Spoken",
    hero: {
      titleLead: "Breaking communication",
      titleAccent: "barriers.",
      facts: ["Full screen in one tap", "No sign-up needed", "Private"],
      live: "Live",
      youSay: "Hi, I am Deaf.",
      theySay: "Hi! How can I help?",
    },
    how: {
      titleLead: "Three steps.",
      titleAccent: "Both ways.",
      steps: ["Open the app", "Sign or speak", "Read or watch"],
      stepLabel: "Step {n}",
      or: "or",
      flowTitle: "Two-way, in real time",
      flowHint: "Tap swap to switch sides",
      youSign: "You sign",
      theySpeak: "They speak",
      translates: "Deafference translates",
      theyHearRead: "They hear + read",
      youReadSee: "You read + see sign",
      sign: "Sign",
      speech: "Speech",
      /** Spoken between the two direction words on the swap button ("Sign to Speech"). */
      to: "to",
      swap: "Swap direction",
      more: "See how it works in detail",
      /** The worked example under the two-way flow (the hero's two lines, going through the app). */
      example: "Example",
      saidAloud: "Said out loud",
      captions: "Captions",
      signedBy: "Signed by the avatar",
    },
    places: {
      titleLead: "Take a walk through",
      titleAccent: "everyday life.",
      lead: "With Judy as your guide.",
      /** A tiny example conversation for each place, in the order of `scenarios.items`. */
      exchanges: [
        { you: "My head hurts", them: "1 pill, twice a day" },
        { you: "A room for 2 nights", them: "Room 204" },
        { you: "Meeting at 10?", them: "Yes, in room B" },
        { you: "He fell. Help!", them: "We are on our way" },
        { you: "Which gate?", them: "Gate 12, in 30 min" },
        { you: "Renew my ID", them: "Fill in this form" },
        { you: "Again, please?", them: "Page 12" },
      ],
    },
    sos: {
      kicker: "Ready-made messages",
      title: "Emergency phrases",
      noSignup: "No sign-up needed",
      how: ["Tap", "Show", "Get help"],
      show: "Show full screen",
      close: "Close",
      sheetLabel: "Phrase shown full screen",
      more: "All emergency phrases",
    },
    videos: {
      titleLead: "See it in action,",
      titleAccent: "then set it up.",
      lead: "Video & interactive tutorials — captioned and signed.",
      cc: "CC",
      sign: "Sign",
    },
    explore: {
      titleLead: "Pricing, questions,",
      titleAccent: "security & contact.",
    },
    why: {
      titleLead: "Built for the conversations",
      titleAccent: "that can't wait.",
      displayLabel: "Display settings",
      look: "Look",
      light: "Light",
      dark: "Dark",
      contrast: "High contrast",
      motion: "Reduce motion",
      chips: ["Aiming for WCAG 2.2 AA", "Keyboard", "Never sound-only"],
      private: ["Camera + mic only during a session", "Recordings not saved"],
    },
    app: {
      kicker: "Early preview",
      title: "Try the Deafference app.",
      list: ["In your browser", "On your phone", "Sign recognition: being connected"],
      browserTitle: "Deafference — Listening workspace",
      workspace: "Listening workspace",
      textSpeech: "Text / Speech",
      camera: "Your camera",
      avatar: "Signing avatar",
      youSay: "Hi, I am Deaf. I have an appointment.",
      theySay: "Welcome! Please take a seat.",
      imageLabel:
        "A drawing of the Deafference listening workspace: your camera on one side, the signing avatar on the other, and the conversation underneath.",
    },
    footer: {
      /** Badge 4 is shown after the word "عربي". */
      badges: ["Aiming for WCAG 2.2 AA", "Keyboard", "Screen readers", "RTL", "Reduced motion", "Never sound-only"],
    },
  },
  /**
   * The landing's own pages (components/landing/pages), drawn like the home page. Most of their copy
   * comes from the blocks above (about, pricing, faq, privacy, contact…); these are the new bits.
   */
  pages: {
    /** Accessible names of the page header's "Home › Page" trail and its section links. */
    crumbs: "Breadcrumb",
    onThisPage: "On this page",
    howItWorks: {
      titleLead: "How Deafference",
      titleAccent: "works.",
      lead: "Deafference is built to turn speech into sign and text, and sign into text and speech. Here is each step, in both directions.",
      steps: "Step by step",
    },
    faq: {
      pills: ["Short answers", "Plain words", "English and Arabic"],
    },
    scenarios: {
      titleLead: "Where Deafference",
      titleAccent: "matters.",
      lead: "In every place, every day. Seven everyday places where a missing interpreter should not mean a missed conversation.",
    },
  },
  footer: {
    tagline:
      "Real-time AI communication between sign language, speech and text — built with and for the Deaf and hard-of-hearing community.",
    product: "Product",
    company: "Company",
    help: "Help & legal",
    openApp: "Open the app",
    terms: "Terms of service",
    accessibility: "Accessibility",
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
      homeLink: "الرئيسية",
      scenarios: "السيناريوهات",
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
      faq: "الأسئلة الشائعة",
      security: "الأمان",
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
  a11y: {
    button: "إعدادات إمكانية الوصول",
    title: "إمكانية الوصول",
    subtitle: "غيّر طريقة عرض الموقع. تُحفظ اختياراتك في هذا المتصفح.",
    textSize: "حجم النص",
    contrast: "تباين عالٍ",
    contrastDesc: "نص أغمق وخطوط أوضح.",
    calm: "الوضع الهادئ",
    calmDesc: "يوقف الصور والرسوم المتحركة.",
    on: "مفعّل",
    off: "متوقف",
    emergency: "عبارات الطوارئ",
    reset: "إعادة الضبط",
    close: "إغلاق إعدادات إمكانية الوصول",
  },
  signVideo: {
    watch: "شاهد بلغة الإشارة",
    title: "هذه الصفحة بلغة الإشارة",
    close: "إغلاق الفيديو",
    captions: "ترجمة نصية بالعربية",
    error: "تعذّر تحميل هذا الفيديو. حاول مرة أخرى لاحقًا.",
  },
  judy: {
    floatingLabel: "جودي، مرشدة Deafference (رسم متحرك للزينة)",
    sceneLabel: "جودي تتجول في أماكن الحياة اليومية التي يساعد فيها Deafference",
  },
  hero: {
    status: "إشارة ↔ كلام في الوقت الفعلي",
    headline: ["نكسر", "حواجز", "التواصل"],
    tagline: "إشارة وكلام ونص، تُترجَم في الاتجاهين ليفهم الطرفان بعضهما.",
    primaryCta: "جرّب Deafference",
    emergency: "عبارات الطوارئ",
    emergencyNote: "رسائل جاهزة تظهر بملء الشاشة بلمسة واحدة. لا حاجة إلى التسجيل.",
    secondaryCta: "شاهده أثناء العمل",
    scenariosCta: "استكشف السيناريوهات",
    modeLabel: "الوضع",
    modeValue: "مباشر",
    modeAccent: "في الاتجاهين",
    privacyLabel: "الخصوصية",
    privacyValue: "التحكم بيدك",
    illustrationLabel: "كيف تجري المحادثة: أنت تؤشّر، وDeafference يترجم، والطرف الآخر يسمع كلامك ويقرؤه.",
    cards: {
      sign: "أنت تؤشّر",
      understands: "Deafference يترجم",
      hear: "هم يفهمونك",
    },
    net: {
      label: "Deafference في قلب المحادثة: أنت تؤشّر، والذكاء الاصطناعي يفهم، وهم يسمعونك، والجميع يتواصلون.",
      sign: "أنت تؤشّر",
      ai: "الذكاء الاصطناعي يفهم",
      hear: "هم يسمعونك",
      connect: "الجميع يتواصلون",
    },
  },
  about: {
    eyebrow: "من نحن",
    moreLink: "المزيد عنّا",
    title: "فريق صغير يبني جسرًا بين اللغة المنطوقة ولغة الإشارة",
    description:
      "بدأ Deafference من ملاحظة بسيطة: ما زالت التعاملات اليومية المنطوقة تترك الصمّ وضعاف السمع في انتظار مترجم لا يكون متاحًا دائمًا. نحن نبني البرنامج الذي يسدّ هذه الفجوة.",
    storyEyebrow: "قصتنا",
    storyLead: "بدأت القصة في عيادة، حيث استغرق تسجيل وصول مدته خمس دقائق أربعين دقيقة.",
    storyScenesLabel: "قصتنا في أربع خطوات",
    storyScenes: [
      { title: "لا مترجم", caption: "لم يُحجز مترجم لزيارة روتينية." },
      { title: "ملاحظات على الورق", caption: "خمس دقائق صارت أربعين." },
      { title: "Deafference", caption: "صُمّم لترجمة الإشارة والكلام والنص." },
      { title: "تفاهم", caption: "يستطيع الطرفان متابعة المحادثة." },
    ],
    storyMinutes: "دقيقة",
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
      "نريد أن يُفهَم الصمّ وضعاف السمع في اللحظات الأهم: عند مكتب الاستقبال في المستشفى، وفي قسم الطوارئ، وعند نافذة الخدمة. يحوّل Deafference الكلام إلى إشارة ونص، والإشارة إلى كلام. لا ينبغي أن يحتاج أحد إلى حجز المساعدة مسبقًا، فالمساعدة يجب أن تكون حاضرة لحظة بدء المحادثة.",
    visionTitle: "رؤيتنا",
    visionBody:
      "عالم لا يحتاج فيه الصمّ وضعاف السمع إلى التخطيط مسبقًا ليُفهَموا، عند الطبيب أو في أي مكان آخر. نريد أن يكون Deafference عاديًا وموثوقًا مثل الترجمة النصية أو المنحدر، ومتاحًا أينما يتحدث الناس.",
    missionPlaces: ["الاستقبال في المستشفى", "قسم الطوارئ", "نافذة الخدمة"],
    visionItems: ["الترجمة النصية", "المنحدر", "Deafference"],
    values: [
      {
        title: "إتاحة الوصول أولًا",
        description: "يبدأ كل قرار تصميمي من الشخص الأصمّ أو ضعيف السمع. إتاحة الوصول ليست إضافة في النهاية.",
      },
      {
        title: "سلامة المرضى",
        description: "في العيادة، قد تؤذي الترجمة الخاطئة شخصًا ما. لذلك نجعل الكلمات واضحة وبسيطة، خاصة في العبارات الطبية والطارئة.",
      },
      {
        title: "احترام الثقافة",
        description: "لغات الإشارة لغات كاملة، لها قواعدها وإشاراتها المحلية. لا نترجمها كلمة بكلمة من اللغة المنطوقة.",
      },
      {
        title: "عناية تقنية",
        description: "نحتاج إلى السرعة والدقة معًا. الإشارة المتأخرة أو الخاطئة تعني محادثة ضائعة.",
      },
      {
        title: "الصراحة بشأن الحدود",
        description: "نقول بوضوح ما لا يستطيع Deafference فعله بعد، ومتى يجب أن تستعين بمترجم مؤهّل بدلًا منه.",
      },
    ],
    teamIntro: "نعرّف فريقنا بما تفعله كل مجموعة. يساعد الصمّ وضعاف السمع في تشكيل المنتج، لا في اختباره فقط.",
    teamGroups: [
      {
        heading: "المنتج والشراكات",
        roles: [
          { role: "قيادة المنتج", note: "تحدد الاتجاه. إتاحة الوصول وسلامة المرضى أولًا." },
          { role: "شراكات الرعاية الصحية", note: "تعمل مع العيادات لتفهم كيف يجري العمل فعلًا في الاستقبال وغرف الفحص." },
        ],
      },
      {
        heading: "الهندسة",
        roles: [
          { role: "تعلّم الآلة", note: "يبني الذكاء الاصطناعي الذي يتعرّف على الإشارة والكلام، وهو مصمّم للمحادثة المباشرة." },
          { role: "هندسة المنتج", note: "يبني شاشات واضحة بالعربية والإنجليزية تعمل على الهواتف والحواسيب اليومية." },
        ],
      },
      {
        heading: "المجتمع وإتاحة الوصول",
        roles: [
          { role: "آراء مجتمع الصمّ", note: "يقدّم مستخدمو لغة الإشارة من الصمّ ملاحظات تشكّل الإشارة والمنتج." },
          { role: "إرشاد المترجمين", note: "يخبرنا مترجمو لغة الإشارة المحترفون متى يجب أن يتولى مترجم بشري المهمة." },
        ],
      },
    ],
    hiring: {
      title: "نحن نوظّف",
      body: "نبحث عن مهندسين وعن أشخاص للعمل مع مجتمع الصمّ. نرحّب كثيرًا بالمتقدّمين الصمّ وضعاف السمع.",
      cta: "تواصل معنا",
    },
    goals: [
      {
        title: "المزيد من لغات الإشارة واللهجات",
        timeframe: "التالي",
        description: "دعم الإشارات المحلية والمزيد من لغات الإشارة الوطنية.",
      },
      {
        title: "تكاملات للمؤسسات",
        timeframe: "مخطط له",
        description: "تسجيل دخول واحد للموظفين، وربط بأنظمة العيادات، وإدارة الفرق، لتبدأ المستشفيات والجهات قسمًا بعد قسم.",
      },
      {
        title: "العمل مع الاتصال الضعيف",
        timeframe: "مستمر",
        description: "جزء أكبر من العمل على الجهاز نفسه، لتستمر الترجمة حيث يكون الإنترنت ضعيفًا.",
      },
    ],
  },
  why: {
    eyebrow: "لماذا نحن",
    title: "مصمَّم للمحادثات التي لا تحتمل الانتظار",
    description: "صُمّم Deafference حول اللحظات الحقيقية التي ينقطع فيها التواصل — وحول الأشخاص الذين يعتمدون عليه أكثر من غيرهم.",
    reasons: [
      { title: "إتاحة الوصول أولًا", description: "حجم نص قابل للتعديل، وتباين عالٍ، وتقليل الحركة، كلها مدمجة." },
      { title: "لِلحظات الرعاية الصحية", description: "تسجيل الوصول والاستشارات والصيدليات والطوارئ." },
      { title: "في الاتجاهين وفي الوقت الفعلي", description: "من الإشارة إلى الكلام ومن الكلام إلى الإشارة في مسار واحد." },
      { title: "الخصوصية في التصميم", description: "تعمل الكاميرا والميكروفون أثناء الجلسة فقط، ولا تُحفظ التسجيلات في حسابك." },
    ],
    visual: {
      textSize: "حجم النص",
      contrast: "تباين عالٍ",
      motion: "تقليل الحركة",
      on: "مفعّل",
      patient: "المريض",
      clinician: "الطبيب",
      places: ["تسجيل الوصول", "الاستشارة", "الصيدلية", "الطوارئ"],
      sign: "إشارة",
      speech: "كلام",
      text: "نص",
      sessionOn: "الجلسة تعمل",
      sessionOff: "انتهت الجلسة",
      notSaved: "لا يُحفظ في حسابك",
    },
  },
  howItWorks: {
    eyebrow: "كيف يعمل",
    title: "3 خطوات من الكلمة المنطوقة إلى الإشارة المرئية.",
    description: "ينتقل التمييز من خطوة إلى أخرى تلقائيًا. يتوقف عند الخطوة التي تمرّر المؤشر فوقها أو تضغط عليها، ويوقف الوضع الهادئ الحركة تمامًا.",
    stages: [
      { title: "التقاط الكلام", caption: "يلتقط ميكروفون جهازك ما يقوله الشخص السامع.", tag: "إدخال صوتي" },
      { title: "المعالجة بالذكاء الاصطناعي", caption: "يفهم الذكاء الاصطناعي الجملة ويرتّبها بترتيب لغة الإشارة.", tag: "بنية الإشارة" },
      { title: "عرض الإشارة", caption: "يعرض مؤشّر متحرك الرسالة، مع نص مكتوب إلى جانبها.", tag: "جاهز للمشاهدة" },
    ],
    titleReverse: "3 خطوات من الإشارة المرئية إلى النص والكلام.",
    stagesReverse: [
      { title: "التقاط الإشارة", caption: "تتابع الكاميرا يدي الشخص الأصم ووجهه وحركته.", tag: "إدخال بالكاميرا" },
      { title: "المعالجة بالذكاء الاصطناعي", caption: "يقرأ الذكاء الاصطناعي الإشارات ويحوّلها إلى جملة طبيعية.", tag: "بنية الجملة" },
      { title: "عرض النص والكلام", caption: "يقرأ الشخص السامع الكلمات على الشاشة ويسمعها بصوت مسموع.", tag: "جاهز للقراءة والاستماع" },
    ],
    direction: {
      label: "اتجاه الترجمة",
      speech: "الكلام",
      sign: "الإشارة",
      textSpeech: "النص والكلام",
      switchTo: "التبديل إلى: من {from} إلى {to}",
    },
  },
  scenarios: {
    eyebrow: "السيناريوهات",
    title: "تجوّل في تفاصيل الحياة اليومية، وجودي ترشدك.",
    description:
      "من فحص في العيادة إلى تغيير بوابة في المطار، تزور جودي أماكن الحياة اليومية التي يساعد فيها Deafference الصمّ والسامعين على فهم بعضهم.",
    imageAlt:
      "خريطة مصوّرة بعنوان «حيث يُحدث Deafference فرقًا — في كل مكان، كل يوم». سبع غرف تحيط بمركز Deafference المضيء وتصل بينها ممرات: الرعاية الصحية (طبيب يتحدث مع مريض)، والضيافة (مكتب استقبال فندق)، وأماكن العمل (اجتماع فريق)، والطوارئ (موقف سيارة إسعاف)، والسفر (مكتب تسجيل في المطار)، والخدمات العامة (مكتب خدمة عامة)، والتعليم (فصل دراسي). تتنقّل جودي، المرشدة المتحركة، بين الغرف.",
    listLabel: "أماكن تزورها جودي",
    you: "أنت",
    items: [
      { label: "الرعاية الصحية", message: "كل مريض يفهم طبيبه.", with: "الطبيب" },
      { label: "الضيافة", message: "سجّل وصولك بلا حواجز.", with: "الاستقبال" },
      { label: "أماكن العمل", message: "صوتك مسموع في كل اجتماع.", with: "فريقك" },
      { label: "الطوارئ", message: "المساعدة تصل بسرعة ووضوح.", with: "المسعفون" },
      { label: "السفر", message: "تغيّرت البوابة؟ ستعرف فورًا.", with: "موظفو البوابة" },
      { label: "الخدمات العامة", message: "معاملاتك أصبحت أسهل.", with: "مكتب الخدمة" },
      { label: "التعليم", message: "تعلّم مباشرة بلغة الإشارة.", with: "المعلّم" },
    ],
    askJudy: "اسأل جودي عن {place}",
    rings: [
      "أشرح بالإشارة ما أشعر به، فيفهمني الطبيب فورًا.",
      "عند مكتب الفندق، تسجيل الوصول سريع، بلا أوراق وملاحظات.",
      "في الاجتماعات، يسمعني فريقي وأرى ما يقولونه.",
      "مقابلات العمل عادلة عندما يفهم الطرفان بعضهما.",
      "في الطوارئ كل ثانية مهمة، وأستطيع الشرح بسرعة.",
      "المسعفون يفهمونني، وأنا أفهمهم.",
      "نصيحة: زر «عبارات الطوارئ» فيه رسائل جاهزة.",
      "في المطار، أعرف بتغيير البوابة فورًا.",
      "ضعت في رحلة؟ أستطيع أن أسأل أي أحد عن الطريق.",
      "في الدوائر الحكومية، لا أحتاج لانتظار مترجم.",
      "الأسئلة عند الشبّاك تسير في الاتجاهين: بالإشارة وبالصوت.",
      "البنوك والبريد والبلدية، Deafference معي في كل مكان.",
      "في الصف، تصلني كلمات المعلّم مباشرة.",
      "أستطيع أن أطرح سؤالًا بالإشارة، فيسمعه الصف كله.",
    ],
  },
  demo: {
    eyebrow: "مركز العروض",
    title: "شاهده أثناء العمل، ثم تعرّف على طريقة إعداده.",
    description: "دروس مرئية وتفاعلية نُعدّها لمساعدتك على إعداد Deafference واستخدامه — والتطبيق المباشر جاهز متى شئت.",
    tutorialsTitle: "دروس مرئية وتفاعلية",
    media: {
      comingSoon: "الفيديو قريبًا",
      tryIt: "جرّبه في التطبيق",
    },
    tutorials: [
      {
        title: "البدء للمستخدمين الصمّ",
        description: "أعدّ ملفك الشخصي وإذن الكاميرا ولغة الإشارة المفضلة لديك.",
        audience: "مستخدمون جدد",
        steps: ["ملفك الشخصي", "اسمح بالكاميرا", "اختر لغة الإشارة"],
      },
      {
        title: "استخدام Deafference في الاستقبال",
        description: "كيف يستخدم الطاقم الصحي Deafference لتسجيل الوصول والاستشارات.",
        audience: "الطاقم الصحي",
        steps: ["المريض يؤشّر", "نص على الشاشة", "الطاقم يردّ"],
      },
      {
        title: "إعداد عبارات الطوارئ",
        description: "جهّز عبارات طوارئ بلمسة واحدة للمواقف العصيبة التي لا تحتمل التأخير.",
        audience: "المسؤولون",
        steps: ["افتح الطوارئ", "اختر عبارة", "تُعرض بملء الشاشة"],
      },
    ],
    ctaTitle: "جرّب تطبيق Deafference",
    ctaBody: "نسخة تجريبية مبكرة: ما زلنا نعمل على ربط التعرّف على الإشارة.",
    ctaButton: "افتح النسخة التجريبية",
    ctaImageAlt: "مساحة الاستماع في Deafference، مع لوحات الكاميرا المباشرة والحالة الحالية والترجمة المباشرة.",
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
        description: "تعمل الكاميرا والميكروفون فقط عندما تبدأ جلسة. لا تُحفظ تسجيلات محادثاتك في حسابك.",
      },
      {
        title: "دقة بعناية",
        description: "يركّز الذكاء الاصطناعي لدينا على قراءة الإشارة، مع عناية خاصة بالكلمات اليومية والطبية. في القرارات المهمة، تحقّق دائمًا مع مترجم مؤهّل.",
      },
    ],
    accuracyVisual: {
      everyday: "كلمات يومية",
      medical: "كلمات طبية",
      critical: "قرار حرج",
      interpreter: "مترجم مؤهّل",
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
    note: "الأسعار تقديرية وقد تتغير قبل الإطلاق. تواصل معنا لمعرفة السعر المناسب لمؤسستك.",
    paths: {
      label: "لمن صُمّم Deafference؟",
      back: "العودة إلى الخيارين",
      switchTo: "الانتقال إلى",
      personal: {
        title: "الاستخدام الشخصي",
        body: "للأشخاص الصمّ وضعاف السمع الذين يستخدمون Deafference في حياتهم اليومية.",
        cta: "اعرض الخطة الشخصية",
      },
      industries: {
        title: "القطاعات",
        body: "للعيادات والمستشفيات والمدارس والجهات والفرق التي تخدم الصمّ وضعاف السمع.",
        cta: "اعرض خيارات المؤسسات",
      },
      tracksLabel: "كيف تفضّل مؤسستك الدفع؟",
      subscription: {
        title: "اشتراك",
        body: "خطط شهرية للمواقع الفردية والفرق المتنامية: الاحترافية أو المميزة.",
      },
      enterprise: {
        title: "المؤسسات",
        body: "عقد سنوي مخصص للشبكات والمؤسسات متعددة الفروع.",
      },
      contract: "عقد سنوي",
      chooseHint: "اختر الاشتراك أو المؤسسات لعرض التفاصيل.",
    },
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
        name: "الاحترافية",
        audience: "للعيادات الصغيرة والممارسات الخاصة والمكاتب المجتمعية المحلية",
        price: "$500",
        cadence: "/شهريًا",
        features: ["ترجمة الإشارة في الوقت الفعلي", "بطاقات تواصل رقمية", "استخدام على جهاز واحد", "دعم عبر البريد الإلكتروني"],
        cta: "اختر الاحترافية",
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
    description: "ملخص قصير وبسيط لكيفية استخدام Deafference للكاميرا والميكروفون وبيانات حسابك. هذا الملخص ليس سياسة الخصوصية القانونية الكاملة.",
    badge: "ملخص بلغة بسيطة",
    principles: [
      {
        title: "الكاميرا والميكروفون عند طلبك فقط",
        description: "يسألك متصفحك أولًا. لا يعملان إلا أثناء الترجمة. يمكنك إيقافهما في أي وقت من إعدادات المتصفح.",
      },
      {
        title: "لا تُحفظ تسجيلات في حسابك",
        description: "يُستخدم الفيديو والصوت فقط لإنتاج الترجمة في تلك اللحظة. لا يحتفظ حسابك بتسجيلات لمحادثاتك.",
      },
      {
        title: "فقط ما يحتاجه حسابك",
        description: "نحتفظ فقط باسمك، وبريدك الإلكتروني، وكلمة المرور (مشفّرة)، وصورة الملف الشخصي إن أضفتها، ولغة الإشارة لديك، وهل سمحت باستخدام الكاميرا.",
      },
      {
        title: "التحكم بيدك",
        description: "من صفحة ملفك الشخصي يمكنك تعديل بياناتك أو تغيير كلمة المرور أو حذف حسابك.",
      },
    ],
    contact: "لديك أسئلة عن بياناتك؟ راسلنا على",
    rights: {
      title: "حقوقك",
      items: [
        "الاطلاع على معلومات ملفك الشخصي وتحديثها في أي وقت.",
        "حذف حسابك من صفحة ملفك الشخصي.",
        "طلب نسخة من بياناتك عبر مراسلتنا بالبريد الإلكتروني.",
        "حذف الإعدادات المحفوظة على هذا الجهاز (مثل الوضع الهادئ واختيارات الكاميرا) بمسح بيانات هذا الموقع من متصفحك.",
      ],
    },
    visual: {
      prompt: "استخدام الكاميرا والميكروفون؟",
      allow: "سماح",
      block: "حظر",
    },
  },
  faq: {
    eyebrow: "الأسئلة الشائعة",
    title: "أسئلة شائعة بإجابات بسيطة",
    viewMore: "عرض المزيد من الأسئلة ({count})",
    viewLess: "عرض أسئلة أقل",
    description: "كل ما تحتاج معرفته قبل تجربة Deafference. لم تجد إجابتك؟ تواصل معنا أدناه.",
    ask: {
      title: "لديك سؤال آخر؟",
      body: "راسلنا وسنجيبك عبر البريد الإلكتروني.",
      cta: "تواصل معنا",
    },
    items: [
      {
        question: "ما هو Deafference؟",
        answer:
          "Deafference تطبيق بالذكاء الاصطناعي يساعد الصمّ وضعاف السمع والسامعين على فهم بعضهم. صُمّم للترجمة بين لغة الإشارة والكلام والنص، في الرعاية الصحية والخدمات اليومية.",
      },
      {
        question: "ما لغات الإشارة المدعومة؟",
        answer: "نضيف لغات الإشارة خطوة بخطوة. يمكنك اختيار لغة الإشارة لديك في ملفك الشخصي. ومع الوقت سنضيف الإشارات المحلية والمزيد من لغات الإشارة الوطنية.",
      },
      {
        question: "ماذا يحدث لبيانات الكاميرا والميكروفون؟",
        answer:
          "لا تُستخدم إلا بعد أن تسمح بها وتبدأ جلسة. يُستخدم الفيديو والصوت لإنتاج الترجمة في تلك اللحظة. لا يُحفظان في حسابك. يمكنك إيقاف الوصول في أي وقت من متصفحك.",
      },
      {
        question: "هل يحلّ Deafference محل مترجم لغة الإشارة المحترف؟",
        answer: "لا. يساعد Deafference في اللحظات اليومية عندما لا يتوفر مترجم. في الموافقات الطبية والمسائل القانونية والقرارات المهمة الأخرى، احجز دائمًا مترجم لغة إشارة مؤهّلًا.",
      },
      {
        question: "كم التكلفة؟ هل يمكنني التجربة مجانًا؟",
        answer: "يمكن للأفراد البدء بالخطة المجانية. ويمكن للمؤسسات الاطلاع على الأسعار التقديرية في صفحة الأسعار، أو التواصل معنا لمعرفة السعر.",
      },
      {
        question: "هل يتوفر Deafference باللغة العربية؟",
        answer: "نعم. الموقع متاح بالعربية والإنجليزية. استخدم زر اللغة أعلى الصفحة للتبديل.",
      },
      {
        question: "ما مدى دقة الترجمة؟",
        answer:
          "تتحسّن الدقة باستمرار، مع عناية خاصة بالكلمات اليومية والطبية. لكنها قد تخطئ. في الموافقات الطبية والمسائل القانونية والقرارات المهمة الأخرى، تحقّق دائمًا مع مترجم مؤهّل.",
      },
      {
        question: "هل يعمل Deafference بدون إنترنت؟",
        answer:
          "تحتاج الترجمة المباشرة إلى الإنترنت. في الخطة المجانية بعض العبارات الأساسية المصمّمة للعمل دون اتصال. ونعمل على نقل جزء أكبر من العمل إلى الجهاز، ليستمر عندما يكون الإنترنت ضعيفًا.",
      },
    ],
  },
  contact: {
    eyebrow: "تواصل معنا",
    title: "لنتحدث عن خطة التطبيق لديكم",
    description: "أخبرنا عن فريقك أو حالة الاستخدام لديك وسنتواصل معك بالخطوات التالية، مهما كانت مرحلتك مبكرة.",
    formEyebrow: "ابدأ المحادثة",
    formTitle: "أرسل لنا رسالة",
    flow: ["اكتب رسالتك", "يفتح تطبيق البريد لديك", "نردّ عليك بالبريد"],
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
    method: "طريقة التواصل المفضّلة",
    methods: {
      email: "البريد الإلكتروني",
      video: "إرفاق فيديو بلغة الإشارة",
      chat: "محادثة نصية",
    },
    video: {
      choose: "اختر فيديو أو سجّل واحدًا",
      change: "تغيير الفيديو",
      remove: "إزالة الفيديو",
      hint: "بصيغة MP4 أو MOV أو WebM، بحجم 25 ميغابايت كحد أقصى (معظم تطبيقات البريد لا ترسل ملفات أكبر).",
      previewLabel: "معاينة الفيديو: {file}",
    },
    mailTopic: "الموضوع",
    mailOrganization: "المؤسسة",
    mailMethod: "طريقة التواصل المفضّلة",
    mailVideo: "الفيديو",
    errors: {
      nameRequired: "يُرجى إدخال اسمك.",
      emailRequired: "يُرجى إدخال بريدك الإلكتروني.",
      emailInvalid: "يُرجى إدخال بريد إلكتروني صالح، مثل name@example.com.",
      messageRequired: "يُرجى كتابة رسالة.",
      messageShort: "يُرجى كتابة 10 أحرف على الأقل.",
      videoRequired: "يُرجى اختيار فيديو لإرفاقه، أو اختيار طريقة تواصل أخرى.",
      videoTooBig: "حجم هذا الفيديو {size} ميغابايت. معظم تطبيقات البريد لا ترسل ملفات أكبر من 25 ميغابايت، لذا اختر مقطعًا أقصر.",
      summary: "يُرجى تصحيح الحقول المميزة.",
    },
    statusTitle: "من المفترض أن يفتح تطبيق البريد لديك ومعه رسالتك.",
    statusBody: "إن لم يفتح، راسلنا مباشرة على",
    statusAttach: "قبل الإرسال، أرفق الفيديو ({file}) بالرسالة. لا يستطيع المتصفح إرفاقه نيابةً عنك.",
    statusShared: "الفيديو والرسالة جاهزان في التطبيق الذي اخترته. أرسلهما من هناك.",
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
  explore: {
    eyebrow: "اعرف المزيد",
    title: "الأسعار والأسئلة والأمان والتواصل",
    items: {
      pricing: { title: "الأسعار", cta: "اطّلع على الأسعار" },
      faq: { title: "الأسئلة الشائعة", cta: "اقرأ الأسئلة الشائعة" },
      security: { title: "الأمان والخصوصية", cta: "تعرّف على طريقة الحماية" },
      contact: { title: "تواصل معنا", cta: "تواصل معنا" },
    },
  },
  home: {
    signed: "بالإشارة",
    spoken: "بالكلام",
    hero: {
      titleLead: "نكسر حواجز",
      titleAccent: "التواصل.",
      facts: ["ملء الشاشة بلمسة واحدة", "لا حاجة إلى التسجيل", "يحفظ خصوصيتك"],
      live: "مباشر",
      youSay: "مرحبًا، أنا أصم.",
      theySay: "أهلًا! كيف أساعدك؟",
    },
    how: {
      titleLead: "ثلاث خطوات.",
      titleAccent: "في الاتجاهين.",
      steps: ["افتح التطبيق", "أشِر أو تكلّم", "اقرأ أو شاهد"],
      stepLabel: "الخطوة {n}",
      or: "أو",
      flowTitle: "في الاتجاهين، في الوقت الفعلي",
      flowHint: "اضغط زر التبديل لتغيير الاتجاه",
      youSign: "أنت تؤشّر",
      theySpeak: "هم يتكلمون",
      translates: "Deafference يترجم",
      theyHearRead: "هم يسمعون ويقرؤون",
      youReadSee: "أنت تقرأ وترى الإشارة",
      sign: "إشارة",
      speech: "كلام",
      to: "إلى",
      swap: "بدّل الاتجاه",
      more: "اعرف كيف يعمل بالتفصيل",
      example: "مثال",
      saidAloud: "يُقال بصوت مسموع",
      captions: "الترجمة النصية",
      signedBy: "تعرضه الشخصية المؤشِّرة بالإشارة",
    },
    places: {
      titleLead: "تجوّل في",
      titleAccent: "الحياة اليومية.",
      lead: "مع جودي مرشدتك.",
      exchanges: [
        { you: "رأسي يؤلمني", them: "حبة واحدة، مرتين في اليوم" },
        { you: "غرفة لليلتين", them: "الغرفة 204" },
        { you: "الاجتماع الساعة 10؟", them: "نعم، في القاعة B" },
        { you: "لقد سقط. ساعدوني!", them: "نحن في الطريق إليكم" },
        { you: "أي بوابة؟", them: "البوابة 12، بعد 30 دقيقة" },
        { you: "أريد تجديد هويتي", them: "املأ هذا النموذج" },
        { you: "مرة أخرى، من فضلك؟", them: "الصفحة 12" },
      ],
    },
    sos: {
      kicker: "رسائل جاهزة",
      title: "عبارات الطوارئ",
      noSignup: "لا حاجة إلى التسجيل",
      how: ["المس", "اعرض", "احصل على المساعدة"],
      show: "اعرض بملء الشاشة",
      close: "إغلاق",
      sheetLabel: "عبارة معروضة بملء الشاشة",
      more: "كل عبارات الطوارئ",
    },
    videos: {
      titleLead: "شاهده أثناء العمل،",
      titleAccent: "ثم جهّزه.",
      lead: "دروس بالفيديو وتفاعلية، مع ترجمة نصية ولغة إشارة.",
      cc: "ترجمة",
      sign: "إشارة",
    },
    explore: {
      titleLead: "الأسعار والأسئلة،",
      titleAccent: "الأمان والتواصل.",
    },
    why: {
      titleLead: "صُمّم للمحادثات",
      titleAccent: "التي لا تحتمل الانتظار.",
      displayLabel: "إعدادات العرض",
      look: "المظهر",
      light: "فاتح",
      dark: "داكن",
      contrast: "تباين عالٍ",
      motion: "تقليل الحركة",
      chips: ["نسعى إلى WCAG 2.2 AA", "لوحة المفاتيح", "لا نعتمد على الصوت وحده"],
      private: ["الكاميرا والميكروفون أثناء الجلسة فقط", "لا تُحفظ التسجيلات"],
    },
    app: {
      kicker: "نسخة تجريبية مبكرة",
      title: "جرّب تطبيق Deafference.",
      list: ["في متصفحك", "على هاتفك", "التعرّف على الإشارة: قيد الربط"],
      browserTitle: "Deafference — مساحة الاستماع",
      workspace: "مساحة الاستماع",
      textSpeech: "نص / كلام",
      camera: "كاميرتك",
      avatar: "الشخصية المؤشِّرة",
      youSay: "مرحبًا، أنا أصم. لدي موعد.",
      theySay: "أهلًا بك! تفضّل بالجلوس.",
      imageLabel: "رسم لمساحة الاستماع في Deafference: كاميرتك في جهة، والشخصية المؤشِّرة في الجهة الأخرى، والمحادثة في الأسفل.",
    },
    footer: {
      badges: ["نسعى إلى WCAG 2.2 AA", "لوحة المفاتيح", "قارئات الشاشة", "من اليمين إلى اليسار", "تقليل الحركة", "لا نعتمد على الصوت وحده"],
    },
  },
  pages: {
    crumbs: "مسار التنقل",
    onThisPage: "في هذه الصفحة",
    howItWorks: {
      titleLead: "كيف يعمل",
      titleAccent: "Deafference؟",
      lead: "صُمّم Deafference ليحوّل الكلام إلى إشارة ونص، والإشارة إلى نص وكلام. إليك كل خطوة، في الاتجاهين.",
      steps: "خطوة بخطوة",
    },
    faq: {
      pills: ["إجابات قصيرة", "كلمات بسيطة", "بالعربية والإنجليزية"],
    },
    scenarios: {
      titleLead: "حيث يُحدث Deafference",
      titleAccent: "فرقًا.",
      lead: "في كل مكان، كل يوم. سبعة أماكن يومية لا يجب أن يعني فيها غياب المترجم ضياع المحادثة.",
    },
  },
  footer: {
    tagline: "تواصل فوري بالذكاء الاصطناعي بين لغة الإشارة والكلام والنص — مبني مع مجتمع الصمّ وضعاف السمع ومن أجله.",
    product: "المنتج",
    company: "الشركة",
    help: "المساعدة والشروط",
    openApp: "افتح التطبيق",
    terms: "شروط الخدمة",
    accessibility: "إمكانية الوصول",
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
