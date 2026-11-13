// =====================================================================
// Haunted Inbox — Letter Pool
//
// CONTENT RULES — read before editing:
//   • All companies, banks, couriers, and people are INVENTED FICTION.
//   • NEVER use real brand names, real domains, or real people.
//   • Links are text only — never real, never clickable.
//   • Tone: spooky and playful, never gory. Suitable for classroom use.
//   • Every phishing letter must have ≥1 red flag.
//   • Every legit letter must have redFlags: [].
// =====================================================================

import type { RedFlagId } from './redFlags'

export type Verdict = 'legit' | 'phishing'

export interface LetterLink {
  /** The URL text the reader sees in the message body. */
  displayText: string
  /** The actual destination — rendered as text only, never an href. */
  realUrl: string
}

export interface Letter {
  /** Unique kebab-case slug, e.g. "gravewell-bank-01". */
  id: string
  /** Display name of the sender, e.g. "Gravewell Bank". */
  sender: string
  /** Fictional email address. */
  senderEmail: string
  subject: string
  body: string
  link?: LetterLink
  verdict: Verdict
  /** Empty array for legit letters; ≥ 1 entry for phishing letters. */
  redFlags: RedFlagId[]
  /** One-sentence educational lesson shown in the feedback panel. */
  explanation: string
}

// =====================================================================
// --- PHISHING LETTERS (10) ---
// =====================================================================

const phishingLetters: Letter[] = [
  {
    id: 'gravewell-bank-01',
    sender: 'Gravewell Bank Security',
    senderEmail: 'security@gravewel-bank-alerts.com',
    subject: 'URGENT: Unusual activity on your account — verify now',
    body: `Dear Valued Customer,

We have detected suspicious activity on your Gravewell Bank account. Your account will be SUSPENDED within 24 hours unless you verify your identity immediately.

Click the link below to confirm your details and restore full access.`,
    link: {
      displayText: 'www.gravewell-bank.com/verify',
      realUrl: 'http://gravewel-bank-alerts.com/harvest?ref=urgent',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link', 'credential_request'],
    explanation:
      'Legitimate banks never ask you to verify credentials by clicking an email link — always go directly to the official website.',
  },
  {
    id: 'moonpost-courier-01',
    sender: 'Moonpost Courier Notifications',
    senderEmail: 'noreply@moonpost-track1ng.net',
    subject: 'Your parcel is held — pay storage fee to release',
    body: `Hello,

Your parcel (MP-77291) arrived at our depot but could not be delivered because a small storage fee of £1.49 is outstanding. Please pay within 48 hours or the parcel will be returned.

Provide your card details at the link below.`,
    link: {
      displayText: 'moonpostcourier.com/pay-fee',
      realUrl: 'http://moonpost-track1ng.net/card-details',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link', 'credential_request'],
    explanation:
      'Courier companies do not collect payment card details via email — delivery fee requests are almost always a phishing lure.',
  },
  {
    id: 'shadowvault-01',
    sender: 'ShadowVault Prize Department',
    senderEmail: 'prizes@shadowvault-winners.org',
    subject: 'Congratulations! You have won 5 000 Midnight Coins',
    body: `Dear Lucky Winner,

Your email was randomly selected in the ShadowVault Annual Moonfall Lottery. You have won 5 000 Midnight Coins (value: £850)!

To claim your prize, reply with your full name, home address, and date of birth within 72 hours. No purchase necessary.`,
    verdict: 'phishing',
    redFlags: ['too_good_to_be_true', 'urgency', 'credential_request'],
    explanation:
      'Unsolicited prize notifications asking for personal data are a common social-engineering trick — real lotteries do not require you to prove your identity by email.',
  },
  {
    id: 'manor-it-01',
    sender: 'Manor IT Helpdesk',
    senderEmail: 'helpdesk@manor-it-supp0rt.com',
    subject: 'Your password expires today — reset required',
    body: `Hi,

Our records show your manor network password will expire at midnight tonight. To avoid being locked out, reset it now using your current password at the link below.`,
    link: {
      displayText: 'manor-staff.internal/password-reset',
      realUrl: 'http://manor-it-supp0rt.com/phish',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link', 'credential_request'],
    explanation:
      'IT departments never send password-reset links via email that ask for your current password — that is the credential itself.',
  },
  {
    id: 'crypt-tax-01',
    sender: 'Crypt Revenue Service',
    senderEmail: 'refunds@crypt-revenue-gov.co',
    subject: 'Tax refund of £312.00 is ready to claim',
    body: `Dear Taxpayer,

A tax refund of £312.00 has been approved for your account. To receive your refund you must verify your bank details within 5 working days. Failure to do so will result in the refund being cancelled.`,
    link: {
      displayText: 'cryptrevenue.gov.uk/refund-claim',
      realUrl: 'http://crypt-revenue-gov.co/bank-details',
    },
    verdict: 'phishing',
    redFlags: ['too_good_to_be_true', 'urgency', 'spoofed_sender', 'mismatched_link', 'authority_pressure'],
    explanation:
      'Government tax authorities issue refunds through official processes — they never ask you to "verify bank details" by clicking an email link.',
  },
  {
    id: 'wraithnet-isp-01',
    sender: 'WraithNet Internet Support',
    senderEmail: 'billing@wraithnet-renewals.biz',
    subject: 'Your service is about to be disconnected',
    body: `Dear Customer,

We were unable to process your monthly payment for WraithNet Broadband. Your service will be disconnected in 12 hours unless you update your payment details immediately.

Please open the attached invoice to update your card information.`,
    link: {
      displayText: 'wraithnet.com/account/billing',
      realUrl: 'http://wraithnet-renewals.biz/update-card',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link', 'unexpected_attachment'],
    explanation:
      'Genuine ISPs give you time to update payment details through your account portal — an email threatening 12-hour disconnection with an attachment is a hallmark of phishing.',
  },
  {
    id: 'bonecrypt-hr-01',
    sender: 'Bonecrypt Manor HR Department',
    senderEmail: 'hr@bonecrypt-manor-staffing.net',
    subject: 'Urgent: Update your payroll information',
    body: `Dear Staff Member,

Due to a payroll system migration, all employees must re-submit their bank account details by end of day. Please complete the form at the link below to ensure your salary payment is not delayed.`,
    link: {
      displayText: 'bonecryptmanor.co.uk/hr/payroll-update',
      realUrl: 'http://bonecrypt-manor-staffing.net/bank-capture',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link', 'credential_request', 'authority_pressure'],
    explanation:
      'Payroll departments collect bank details through secure internal systems, not through emailed links — this is a business email compromise tactic.',
  },
  {
    id: 'spectre-cloud-01',
    sender: 'SpectreCloud Storage',
    senderEmail: 'noreply@spectre-cl0ud.com',
    subject: 'Your SpectreCloud account is full — data will be deleted',
    body: `Hello,

Your SpectreCloud free storage is 100% full. All files older than 30 days will be permanently deleted in 24 hours unless you upgrade or verify your account to extend storage.

Act now to save your files.`,
    link: {
      displayText: 'spectrecloud.com/upgrade',
      realUrl: 'http://spectre-cl0ud.com/login-harvest',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link'],
    explanation:
      'Storage services always warn you well in advance and through the app — an email threatening immediate deletion with a misspelt domain link is a phishing attempt.',
  },
  {
    id: 'tombstone-auctions-01',
    sender: 'Tombstone Auctions Support',
    senderEmail: 'support@tombst0ne-auctions.co',
    subject: 'You have a pending payment — confirm to avoid suspension',
    body: `Dear Member,

An outstanding payment of £27.00 is linked to your Tombstone Auctions account. If not settled within 24 hours your seller account will be suspended and your listings removed.

Please log in and confirm your payment method using the link below.`,
    link: {
      displayText: 'tombstoneauctions.com/payment/confirm',
      realUrl: 'http://tombst0ne-auctions.co/steal-creds',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link'],
    explanation:
      'Auction platforms send payment notices through your account dashboard — urgent emails with misspelt domains and account-suspension threats are almost certainly phishing.',
  },
  {
    id: 'phantom-pharmacy-01',
    sender: 'Phantom Pharmacy Prescriptions',
    senderEmail: 'rx@phantom-pharma-notify.com',
    subject: 'Your prescription is ready — confirm delivery address',
    body: `Dear Patient,

Your prescription order #PH-4421 is ready for dispatch. To complete delivery we require you to confirm your home address and date of birth. Please do so within 48 hours.

We have also attached your prescription summary for your records.`,
    verdict: 'phishing',
    redFlags: ['credential_request', 'unexpected_attachment', 'urgency'],
    explanation:
      'Pharmacies use secure patient portals for personal data — an unsolicited email asking for date of birth and address is a data-harvesting attempt.',
  },
]

// =====================================================================
// --- LEGITIMATE LETTERS (8) ---
// =====================================================================

const legitLetters: Letter[] = [
  {
    id: 'gravewell-bank-legit-01',
    sender: 'Gravewell Bank',
    senderEmail: 'statements@gravewell-bank.com',
    subject: 'Your monthly statement is ready',
    body: `Dear Customer,

Your Gravewell Bank statement for October is now available to view in the Secure Messages section of your online banking account. No action is required.

If you have any questions, please call the number on the back of your card.`,
    verdict: 'legit',
    redFlags: [],
    explanation:
      'This is a notification-only email — it asks for nothing, provides no links, and directs you to call the official number.',
  },
  {
    id: 'moonpost-courier-legit-01',
    sender: 'Moonpost Courier',
    senderEmail: 'track@moonpostcourier.com',
    subject: 'Your parcel MP-10234 has been delivered',
    body: `Hello,

Your parcel (MP-10234) was delivered to your address today at 14:32 and left with a neighbour at No. 4. If you have any concerns, please contact our customer helpline at 0800-MOONPOST.

Thank you for using Moonpost Courier.`,
    verdict: 'legit',
    redFlags: [],
    explanation:
      'Legitimate delivery notifications confirm completed deliveries with no requests for payment or personal data.',
  },
  {
    id: 'wraithnet-isp-legit-01',
    sender: 'WraithNet Broadband',
    senderEmail: 'newsletter@wraithnet.com',
    subject: 'Scheduled maintenance this Sunday 02:00–04:00',
    body: `Dear Customer,

We are carrying out planned network maintenance on Sunday between 02:00 and 04:00. You may experience a brief interruption to your service. No action is needed.

Apologies for any inconvenience.`,
    verdict: 'legit',
    redFlags: [],
    explanation:
      'Maintenance notices require no action and ask for nothing — a hallmark of a legitimate service email.',
  },
  {
    id: 'spectre-cloud-legit-01',
    sender: 'SpectreCloud',
    senderEmail: 'hello@spectrecloud.com',
    subject: 'Welcome to SpectreCloud — your account is ready',
    body: `Hello,

Your SpectreCloud account has been created successfully. You can log in at any time by visiting spectrecloud.com and entering your email address.

If you did not create this account, please contact our support team.`,
    verdict: 'legit',
    redFlags: [],
    explanation:
      'A welcome email that provides no link to click and no data to submit is a good sign — it simply confirms the action you just took.',
  },
  {
    id: 'tombstone-auctions-legit-01',
    sender: 'Tombstone Auctions',
    senderEmail: 'confirm@tombstoneauctions.com',
    subject: 'Your bid on Lot 442 was successful',
    body: `Dear Member,

Congratulations! Your bid of £18.50 on Lot 442 (antique brass candlestick) was successful. The seller will contact you within 2 business days to arrange payment and dispatch.

You can view your win in the My Bids section of your account.`,
    verdict: 'legit',
    redFlags: [],
    explanation:
      'This confirmation email makes no urgent demands and directs you to the platform itself for next steps — consistent with a legitimate auction notice.',
  },
  {
    id: 'crypt-tax-legit-01',
    sender: 'Crypt Revenue Service',
    senderEmail: 'contact@cryptrevenue.gov.uk',
    subject: 'Your tax return has been received',
    body: `Dear Taxpayer,

We have received your tax return for the year ending 5 April. You do not need to do anything further. We will write to you again once we have processed your return.

If you have queries, visit cryptrevenue.gov.uk or call the helpline.`,
    verdict: 'legit',
    redFlags: [],
    explanation:
      'Official acknowledgement emails confirm receipt only — they do not ask for further information or link to external payment pages.',
  },
  {
    id: 'bonecrypt-manor-legit-01',
    sender: 'Bonecrypt Manor',
    senderEmail: 'events@bonecryptmanor.co.uk',
    subject: 'Reminder: Staff meeting Thursday 15:00 in the East Wing',
    body: `Dear All,

This is a reminder that the quarterly staff meeting will take place on Thursday at 15:00 in the East Wing drawing room. Tea and cobwebs will be provided.

Please bring your departmental reports.`,
    verdict: 'legit',
    redFlags: [],
    explanation:
      'An internal reminder with no links, no attachments, and no requests for data is a typical legitimate workplace communication.',
  },
  {
    id: 'manor-it-legit-01',
    sender: 'Manor IT Helpdesk',
    senderEmail: 'helpdesk@bonecryptmanor.co.uk',
    subject: 'Scheduled system update tonight at midnight',
    body: `Hi,

We will be applying a routine security patch to manor workstations tonight at midnight. Your computer will restart automatically. Please save any open work before you leave this evening.

No action is required from you beyond saving your work.`,
    verdict: 'legit',
    redFlags: [],
    explanation:
      'IT update notices that ask only for you to save your work — with no links or credential requests — are consistent with legitimate internal communications.',
  },
]

// =====================================================================
// Combined pool — 10 phishing + 8 legit = 18 letters total
// =====================================================================

const letters: Letter[] = [...phishingLetters, ...legitLetters]

export default letters
