export type UserRole = "Admin" | "Individual"
export type UserStatus = "Active" | "Suspended"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joinedDate: string
}

export type FeedbackStatus = "New" | "Reviewed" | "Resolved" | "Archived"

export interface FeedbackEntry {
  id: string
  userEmail: string
  category: string
  rating: number | null
  text: string
  submittedDate: string
  status: FeedbackStatus
}

export interface ContactSubmission {
  id: string
  name: string
  organization: string | null
  email: string
  subject: string
  message: string
  receivedDate: string
  read: boolean
}

export const MOCK_FEEDBACK: FeedbackEntry[] = [
  { id: "fbk_501", userEmail: "diego.fernandez@example.com", category: "Translation accuracy", rating: 4, text: "Gloss output for follow-up questions is noticeably better this month, but idioms still trip it up sometimes.", submittedDate: "2026-07-02", status: "New" },
  { id: "fbk_502", userEmail: "priya.n@northline-clinic.com", category: "Front desk workflow", rating: 5, text: "Our intake staff picked it up in a single shift. Would love a bigger caption font option for the waiting room display.", submittedDate: "2026-07-09", status: "Reviewed" },
  { id: "fbk_503", userEmail: "malik.johnson@example.com", category: "Bug report", rating: 2, text: "Camera preview freezes if I switch browser tabs mid-session and doesn't recover until I refresh the page.", submittedDate: "2026-07-14", status: "New" },
  { id: "fbk_504", userEmail: "tunde.a@lagoscare-hospital.com", category: "Feature request", rating: null, text: "Any plan to support a second sign language preference per organization for multilingual clinics?", submittedDate: "2026-07-19", status: "Reviewed" },
  { id: "fbk_505", userEmail: "sofia.marchetti@example.com", category: "Translation accuracy", rating: 3, text: "Works well for short exchanges. Longer sentences sometimes get cut off before the sign animation finishes.", submittedDate: "2026-07-22", status: "Resolved" },
  { id: "fbk_506", userEmail: "hana.k@rivertown-bank.com", category: "Billing", rating: 1, text: "Invoice for June lists two active seats but our team only has one licensed reception terminal.", submittedDate: "2026-07-27", status: "New" },
]

export const MOCK_USERS: AdminUser[] = [
  { id: "user_001", name: "Aya Raneem", email: "aya@deafference.com", role: "Admin", status: "Active", joinedDate: "2026-01-15" },
  { id: "user_002", name: "Sarah Chen", email: "sarah.chen@deafference.com", role: "Admin", status: "Active", joinedDate: "2026-02-20" },
  { id: "user_003", name: "Marcus Williams", email: "marcus.w@clinic.org", role: "Individual", status: "Active", joinedDate: "2026-03-10" },
  { id: "user_004", name: "Emma Johnson", email: "emma.johnson@hospital.net", role: "Individual", status: "Active", joinedDate: "2026-03-18" },
  { id: "user_005", name: "James O'Brien", email: "james.obrien@example.com", role: "Individual", status: "Suspended", joinedDate: "2026-04-05" },
  { id: "user_006", name: "Sophia Martinez", email: "sophia.m@bank.com", role: "Individual", status: "Active", joinedDate: "2026-04-22" },
  { id: "user_007", name: "David Kim", email: "david.kim@school.edu", role: "Individual", status: "Active", joinedDate: "2026-05-11" },
  { id: "user_008", name: "Priya Patel", email: "priya.p@clinic.org", role: "Individual", status: "Active", joinedDate: "2026-05-28" },
]

export const MOCK_CONTACT_SUBMISSIONS: ContactSubmission[] = [
  { id: "ctc_301", name: "Rosa Mendes", organization: "Clearwater Family Dental", email: "rosa.mendes@clearwaterdental.com", subject: "Pilot for two clinic locations", message: "We run two dental offices and want to trial Deafference at our front desks for a month before committing to both sites. What does a pilot arrangement look like?", receivedDate: "2026-07-24", read: false },
  { id: "ctc_302", name: "Grace Whitfield", organization: null, email: "grace.whitfield@example.com", subject: "Question about personal use pricing", message: "I'm deaf and work as a freelance consultant. Is there an individual plan, or is Deafference aimed only at businesses right now?", receivedDate: "2026-07-26", read: false },
  { id: "ctc_303", name: "Kwame Boateng", organization: "Boateng & Iyer Legal Partners", email: "kwame.boateng@bilegal.com", subject: "Accessibility compliance documentation", message: "Our office needs to demonstrate ADA-aligned communication access for client intake. Can you send documentation we could include in a compliance review?", receivedDate: "2026-07-28", read: true },
  { id: "ctc_304", name: "Nadia Petrov", organization: "Union Street Pharmacy", email: "nadia.petrov@unionstreetrx.com", subject: "Integration with existing counter displays", message: "We already have small screens mounted at each pharmacy counter. Is there a way to route captions to those instead of a tablet?", receivedDate: "2026-07-29", read: false },
  { id: "ctc_305", name: "Owen Bryant", organization: "Bryant Realty Group", email: "owen.bryant@bryantrealty.com", subject: "Thank you", message: "Just wanted to say the front desk demo at the housing fair last week was the smoothest access tech demo I've seen. Following up about enterprise pricing separately.", receivedDate: "2026-07-15", read: true },
]
