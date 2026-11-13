// =====================================================================
// Haunted Inbox — Letter Pool
//
// CONTENT RULES — read before editing:
//   • All companies, banks, couriers, and people are INVENTED FICTION.
//   • NEVER use real brand names, real domains, or real people.
//   • Links are text only — never real, never clickable.
//   • Domains: use .com / .net / .org / .co only.
//     Never use .gov, .gov.uk, .co.uk, or .edu.
//   • realUrl paths must look realistic: /login /verify /account /settings
//     Never use paths like /phish /harvest /steal /capture /creds.
//   • Use "silver marks" for all amounts — no real currencies.
//   • Tone: spooky and playful, never gory. Suitable for classroom use.
//   • Difficulty tiers: 1 = obvious signals, 3 = single subtle detail.
//   • Explanations: name the specific signal in THIS letter and the
//     safe action. Avoid absolute claims like "banks never email you".
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
  /** Fictional email address. Only .com / .net / .org / .co domains. */
  senderEmail: string
  subject: string
  body: string
  link?: LetterLink
  verdict: Verdict
  /** Empty array for legit letters; ≥ 1 entry for phishing letters. */
  redFlags: RedFlagId[]
  /** Names the specific signal in this letter and the safe action. */
  explanation: string
  /** 1 = obvious, 2 = moderate, 3 = single subtle detail. */
  difficulty: 1 | 2 | 3
}

// =====================================================================
// PHISHING LETTERS  (20 total)
// No-link letters (reply-based): flagged with [NO LINK] in comment
// =====================================================================

const phishingLetters: Letter[] = [

  // --- difficulty 1 --------------------------------------------------

  {
    id: 'gravewell-bank-01',
    sender: 'Gravewell Bank Security',
    senderEmail: 'security@gravewel-bank-alerts.com',   // misspelt domain
    subject: 'URGENT: Unusual activity — verify now or lose access',
    body: `Dear Valued Customer,

Suspicious activity was detected on your Gravewell Bank account. Your account will be SUSPENDED within 24 hours unless you verify your identity immediately by clicking the link below.`,
    link: {
      displayText: 'www.gravewell-bank.com/verify',
      realUrl: 'gravewel-bank-alerts.com/verify',       // misspelt real host
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link', 'credential_request'],
    explanation:
      'The sending domain is "gravewel-bank-alerts.com" — one letter different from the real bank. Check the domain carefully and open your bank account directly in a browser instead of clicking.',
    difficulty: 1,
  },

  {
    id: 'shadowvault-prize-01',
    sender: 'ShadowVault Prize Department',
    senderEmail: 'prizes@shadowvault-winners.org',
    subject: 'You have won 5 000 silver marks — claim within 72 hours',
    body: `Dear Lucky Winner,

Your email was randomly selected in the ShadowVault Annual Moonfall Lottery. You have won 5 000 silver marks!

To claim your prize, reply with your full name, home address, and date of birth. No purchase necessary.`,
    // [NO LINK]
    verdict: 'phishing',
    redFlags: ['too_good_to_be_true', 'urgency', 'credential_request'],
    explanation:
      'This letter offers an unexpected large prize and asks for personal data by reply — a classic social-engineering lure. Legitimate lottery operators do not ask for your details over email.',
    difficulty: 1,
  },

  {
    id: 'manor-it-01',
    sender: 'Manor IT Helpdesk',
    senderEmail: 'helpdesk@manor-it-supp0rt.com',       // zero instead of o
    subject: 'Your password expires today — reset required',
    body: `Hi,

Our records show your manor network password will expire at midnight tonight. To avoid being locked out, reset it now using the link below and enter your current password to confirm your identity.`,
    link: {
      displayText: 'manor-staff.internal/password-reset',
      realUrl: 'manor-it-supp0rt.com/account',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link', 'credential_request'],
    explanation:
      'The email address contains a zero ("supp0rt") in place of the letter "o". Inspect the sender domain closely and use the official IT portal to reset passwords.',
    difficulty: 1,
  },

  {
    id: 'crypt-tax-01',
    sender: 'Crypt Revenue Service',
    senderEmail: 'refunds@crypt-revenue-gov.co',
    subject: 'Tax refund of 312 silver marks is ready to claim',
    body: `Dear Taxpayer,

A tax refund of 312 silver marks has been approved for your account. To receive your refund you must verify your bank details within 5 working days or the refund will be cancelled.`,
    link: {
      displayText: 'cryptrevenue.net/refund',
      realUrl: 'crypt-revenue-gov.co/account',
    },
    verdict: 'phishing',
    redFlags: ['too_good_to_be_true', 'urgency', 'spoofed_sender', 'mismatched_link', 'authority_pressure'],
    explanation:
      'The sending domain is "crypt-revenue-gov.co" but the display link says "cryptrevenue.net" — hover over the link to see the mismatch. Tax authorities process refunds through official portals, not email links.',
    difficulty: 1,
  },

  {
    id: 'bonecrypt-hr-01',
    sender: 'Bonecrypt Manor HR Department',
    senderEmail: 'hr@bonecrypt-manor-staffing.net',
    subject: 'Urgent: Update your payroll bank details today',
    body: `Dear Staff Member,

Due to a payroll system migration, all employees must re-submit their bank account details by end of day. Please complete the form at the link below to ensure your salary payment is not delayed.`,
    link: {
      displayText: 'bonecryptmanor.co/hr/payroll-update',
      realUrl: 'bonecrypt-manor-staffing.net/account',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link', 'credential_request', 'authority_pressure'],
    explanation:
      'The link display says "bonecryptmanor.co" but the real destination is "bonecrypt-manor-staffing.net" — a different domain entirely. Payroll changes should be made through the internal HR system.',
    difficulty: 1,
  },

  // --- difficulty 2 --------------------------------------------------

  {
    id: 'moonpost-courier-01',
    sender: 'Moonpost Courier Notifications',
    senderEmail: 'noreply@moonpost-track1ng.net',       // "1" instead of "i"
    subject: 'Your parcel MP-77291 — small storage fee outstanding',
    body: `Hello,

Your parcel (MP-77291) arrived at our depot but could not be delivered because a small storage fee of 2 silver marks is outstanding. Please pay within 48 hours or the parcel will be returned.

Provide your payment details at the link below.`,
    link: {
      displayText: 'moonpostcourier.com/pay-fee',
      realUrl: 'moonpost-track1ng.net/account',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link', 'credential_request'],
    explanation:
      'The sending domain "moonpost-track1ng.net" uses a digit "1" instead of the letter "i". Compare the displayed link domain with the real destination — they differ. Go to the courier\'s official site to check for outstanding fees.',
    difficulty: 2,
  },

  {
    id: 'wraithnet-isp-01',
    sender: 'WraithNet Internet Support',
    senderEmail: 'billing@wraithnet-renewals.biz',
    subject: 'Service disconnection in 12 hours — payment required',
    body: `Dear Customer,

We were unable to process your monthly payment for WraithNet Broadband. Your service will be disconnected in 12 hours unless you update your payment details immediately.

Please open the attached document and update your card details.`,
    link: {
      displayText: 'wraithnet.com/account/billing',
      realUrl: 'wraithnet-renewals.biz/account',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link', 'unexpected_attachment'],
    explanation:
      'The sending domain is "wraithnet-renewals.biz" — different from "wraithnet.com" in the link display text. When an email mentions an attachment and urgent payment, log in to your account portal directly to verify.',
    difficulty: 2,
  },

  {
    id: 'spectre-cloud-01',
    sender: 'SpectreCloud Storage',
    senderEmail: 'noreply@spectre-cl0ud.com',           // zero in domain
    subject: 'Storage full — files deleted in 24 hours unless you act',
    body: `Hello,

Your SpectreCloud free storage is 100% full. All files older than 30 days will be permanently deleted in 24 hours unless you upgrade or verify your account.`,
    link: {
      displayText: 'spectrecloud.com/upgrade',
      realUrl: 'spectre-cl0ud.com/account',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link'],
    explanation:
      'The sender email contains "cl0ud" with a zero — easy to miss at a glance. The display link says "spectrecloud.com" but the real URL goes to "spectre-cl0ud.com". Open your cloud account directly to check storage.',
    difficulty: 2,
  },

  {
    id: 'phantom-pharmacy-01',
    sender: 'Phantom Pharmacy Prescriptions',
    senderEmail: 'rx@phantom-pharma-notify.com',
    subject: 'Your prescription is ready — confirm delivery address',
    body: `Dear Patient,

Your prescription order #PH-4421 is ready for dispatch. To complete delivery we need you to confirm your home address and date of birth. Please respond within 48 hours.

We have attached your prescription summary for your records.`,
    // [NO LINK] — reply-based with attachment lure
    verdict: 'phishing',
    redFlags: ['credential_request', 'unexpected_attachment', 'urgency'],
    explanation:
      'A pharmacy would collect your address through a secure booking system, not ask for it and your date of birth by email reply. The mention of an attachment you did not request is an additional warning sign.',
    difficulty: 2,
  },

  {
    id: 'tombstone-auctions-01',
    sender: 'Tombstone Auctions Support',
    senderEmail: 'support@tombst0ne-auctions.co',       // zero
    subject: 'Outstanding payment — account suspended in 24 hours',
    body: `Dear Member,

An outstanding payment of 27 silver marks is linked to your Tombstone Auctions account. If not settled within 24 hours your seller account will be suspended.

Please log in and confirm your payment method.`,
    link: {
      displayText: 'tombstoneauctions.com/payment/confirm',
      realUrl: 'tombst0ne-auctions.co/account',
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link'],
    explanation:
      'The email domain "tombst0ne-auctions.co" contains a zero in place of the letter "o". The displayed link domain differs from the real destination — log in to the platform directly to check your account.',
    difficulty: 2,
  },

  {
    id: 'mirewarden-gift-01',
    sender: 'Lord Mirewarden',                          // authority-impersonation, no link
    senderEmail: 'lord.mirewarden@mirewarden-estate.net',
    subject: 'Urgent favour — are you available right now?',
    body: `Hello,

I am attending an emergency meeting and cannot make calls. I need you to purchase three 200-silver-mark gift vouchers from Cobweb Emporium and send me the redemption codes by reply as soon as possible. I will reimburse you today.

Please treat this as confidential.`,
    // [NO LINK]
    verdict: 'phishing',
    redFlags: ['urgency', 'authority_pressure', 'unusual_request'],
    explanation:
      'The address looks like Lord Mirewarden\'s, but a From address can be forged or an account taken over, so a matching sender proves nothing. Buying vouchers and sending the codes in secret is the signal: confirm by calling him on a number you already know.',
    difficulty: 2,
  },

  {
    id: 'hollowgate-job-01',
    sender: 'Hollowgate Recruitment',
    senderEmail: 'careers@hollowgate-talent.org',
    subject: 'Job offer: night archivist, 900 silver marks a week',
    body: `Hello,

We found your details online and are pleased to offer you the post of night archivist: two hours a week from home, 900 silver marks a week, no interview needed.

To secure the position, reply today with your full name, date of birth and bank account number so we can set up your first payment.`,
    // [NO LINK]
    verdict: 'phishing',
    redFlags: ['too_good_to_be_true', 'credential_request', 'urgency'],
    explanation:
      'High pay for almost no work, offered without an interview to someone who never applied, is the signal. A real employer does not collect bank details by reply before you have even spoken to them.',
    difficulty: 2,
  },

  {
    id: 'tombstone-reward-01',
    sender: 'Tombstone Auctions Rewards',
    senderEmail: 'rewards@tombstoneauctions-gifts.com',
    subject: 'You have been selected for a 500 silver mark loyalty reward',
    body: `Dear Member,

As a thank-you for your custom, your account has been selected for a 500 silver mark loyalty reward. Sign in below to add it to your balance. The offer is reserved for you for 48 hours.`,
    link: {
      displayText: 'tombstoneauctions.com/rewards',
      realUrl: 'tombstoneauctions-gifts.com/login',
    },
    verdict: 'phishing',
    redFlags: ['too_good_to_be_true', 'spoofed_sender', 'mismatched_link', 'urgency'],
    explanation:
      'A large reward nobody asked for is the lure. The sender and the real link both use "tombstoneauctions-gifts.com", not the auction house\'s own "tombstoneauctions.com". Check rewards from inside your account instead.',
    difficulty: 2,
  },

  {
    id: 'nocturne-bank-02',
    sender: 'Nocturne Bank',
    senderEmail: 'secure@nocturne-bank.com',
    subject: 'Your account details have been updated',
    body: `Dear Customer,

Your account contact details were updated earlier today. If you did not make this change, please verify your identity immediately to secure your account.`,
    link: {
      displayText: 'nocturne-bank.com/security/verify',
      realUrl: 'nocturne-bank-secure.com/verify',       // extra "-secure" in real host
    },
    verdict: 'phishing',
    redFlags: ['urgency', 'spoofed_sender', 'mismatched_link'],
    explanation:
      'The From address matches the bank, which can be forged. The link is the signal: it shows "nocturne-bank.com" but leads to "nocturne-bank-secure.com", a different domain. For a security alert, type the bank\'s address yourself.',
    difficulty: 2,
  },

  // --- difficulty 3 --------------------------------------------------

  {
    id: 'nocturne-bank-01',
    sender: 'Nocturne Bank',
    senderEmail: 'statements@nocturne-bank.com',
    subject: 'Your monthly statement is now available',
    body: `Dear Customer,

Your Nocturne Bank statement for the period ending last month is now ready to view.

Please log in to review your transactions.`,
    link: {
      displayText: 'nocturne-bank.com/statements',
      realUrl: 'nocturne-b4nk.com/login',               // "4" in real host
    },
    verdict: 'phishing',
    redFlags: ['spoofed_sender', 'mismatched_link'],
    explanation:
      'The From address is the bank\'s real one, but From addresses can be forged, so it proves nothing. Revealing the link shows "nocturne-b4nk.com" with a "4" in place of the "a". Check the real destination before following any link.',
    difficulty: 3,
  },

  {
    id: 'wraithnet-isp-02',
    sender: 'WraithNet Broadband',
    senderEmail: 'renewals@wraithnet-broadband.net',    // slightly different domain
    subject: 'Your annual plan renews in 7 days — confirm to continue',
    body: `Dear Customer,

Your WraithNet annual broadband plan is due for renewal in 7 days. Your payment method will be charged automatically unless you cancel or update your preferences.

Review your plan here.`,
    link: {
      displayText: 'wraithnet.com/account/renew',
      realUrl: 'wraithnet-broadband.net/account',
    },
    verdict: 'phishing',
    redFlags: ['spoofed_sender', 'mismatched_link'],
    explanation:
      'The sender domain is "wraithnet-broadband.net" but the legitimate service uses "wraithnet.com". The link display text and real destination do not match — open your account directly to manage your plan.',
    difficulty: 3,
  },

  {
    id: 'manor-supplier-01',
    sender: 'Ashwick Supplies Co.',
    senderEmail: 'invoices@ashwick-supplies.co',
    subject: 'Invoice #ASH-2847 — payment details have changed',
    body: `Dear Finance Team,

Please note that our bank account details have changed with effect from this month. All future payments for Invoice #ASH-2847 (142 silver marks) should be directed to the new account provided in the attachment.

Please update your records accordingly.`,
    // [NO LINK]
    verdict: 'phishing',
    redFlags: ['unusual_request', 'unexpected_attachment', 'spoofed_sender'],
    explanation:
      'It comes from the supplier\'s usual address, yet that can be forged or the mailbox compromised. A request to pay into a new bank account is the signal: call the supplier on a number from your own records before changing anything.',
    difficulty: 3,
  },

  {
    id: 'spectre-cloud-02',
    sender: 'SpectreCloud',
    senderEmail: 'billing@spectrecloud.com',
    subject: 'Receipt: Your SpectreCloud plan was upgraded',
    body: `Hello,

Thank you for upgrading your SpectreCloud plan to Premium (48 silver marks/month). Your new storage is active immediately.

If you did not authorise this upgrade, sign in to review your plan.`,
    link: {
      displayText: 'spectrecloud.com/account/billing',
      realUrl: 'spectrecloud.net/login',                // .net vs .com
    },
    verdict: 'phishing',
    redFlags: ['spoofed_sender', 'mismatched_link'],
    explanation:
      'The From address shows the genuine "spectrecloud.com", but From addresses can be forged. The real link goes to "spectrecloud.net", a different domain. For a surprise charge, open the site yourself instead of using the link.',
    difficulty: 3,
  },

  {
    id: 'mirewarden-callback-01',
    sender: 'Mirewarden Estate Management',
    senderEmail: 'admin@mirewarden-estates.net',
    subject: 'Routine verification — please call to confirm',
    body: `Dear Resident,

We are updating resident contact records as part of our annual review. Please call our resident services line at the number below to confirm your details.

Resident Services: 555-0142`,
    // [NO LINK] — callback scam
    verdict: 'phishing',
    redFlags: ['spoofed_sender', 'unusual_request', 'credential_request'],
    explanation:
      'The sender domain is "mirewarden-estates.net" with an extra "s"; the real estate office uses "mirewarden-estate.net". A phone number that appears only in the message may lead to a fraudster, so look the number up yourself before confirming any details.',
    difficulty: 3,
  },

  {
    id: 'ravenmoor-council-01',
    sender: 'Ravenmoor Town Council',
    senderEmail: 'admin@ravenmoor-council.com',
    subject: 'Your planning application — reference DEC-00341',
    body: `Dear Resident,

Your planning application reference DEC-00341 has been received and is under review. Your case officer will be in touch within 10 working days.

No action is required at this time.`,
    link: {
      displayText: 'ravenmoor-council.com/planning/status',
      realUrl: 'ravenmoor-counci1.com/account',         // "1" for "l" in real host
    },
    verdict: 'phishing',
    redFlags: ['spoofed_sender', 'mismatched_link'],
    explanation:
      'Calm tone, genuine-looking sender, no demand at all. The only signal is the real destination "ravenmoor-counci1.com", with the digit "1" in place of the letter "l". A forged From address and a look-alike link can hide in a routine letter.',
    difficulty: 3,
  },
]

// =====================================================================
// LEGITIMATE LETTERS  (14 total)
// Letters with matching-domain links: flagged with [MATCH] in comment
// =====================================================================

const legitLetters: Letter[] = [

  // --- difficulty 1 --------------------------------------------------

  {
    id: 'gravewell-bank-legit-01',
    sender: 'Gravewell Bank',
    senderEmail: 'statements@gravewell-bank.com',
    subject: 'Your monthly statement is ready',
    body: `Dear Customer,

Your Gravewell Bank statement for the past month is now available to view in the Secure Messages section of your online banking account. No action is required.

If you have any questions, please call the number on the back of your card.`,
    // No link
    verdict: 'legit',
    redFlags: [],
    explanation:
      'This letter asks for nothing, provides no link, and directs you to call the number on your physical card — all consistent with a legitimate bank notification.',
    difficulty: 1,
  },

  {
    id: 'moonpost-courier-legit-01',
    sender: 'Moonpost Courier',
    senderEmail: 'track@moonpostcourier.com',
    subject: 'Your parcel MP-10234 has been delivered',
    body: `Hello,

Your parcel (MP-10234) was delivered to your address today at 14:32 and left with a neighbour at No. 4. If you have any concerns, please contact our helpline at 0800-MOONPOST.

Thank you for using Moonpost Courier.`,
    // No link
    verdict: 'legit',
    redFlags: [],
    explanation:
      'This confirmation email requires no action and makes no request for payment or personal data — a hallmark of a legitimate delivery notice.',
    difficulty: 1,
  },

  {
    id: 'wraithnet-isp-legit-01',
    sender: 'WraithNet Broadband',
    senderEmail: 'newsletter@wraithnet.com',
    subject: 'Scheduled maintenance this Sunday 02:00–04:00',
    body: `Dear Customer,

We are carrying out planned network maintenance on Sunday between 02:00 and 04:00. You may experience a brief interruption. No action is needed.

Apologies for any inconvenience.`,
    // No link
    verdict: 'legit',
    redFlags: [],
    explanation:
      'Maintenance notices that require no action and make no requests are typical of legitimate service communications.',
    difficulty: 1,
  },

  {
    id: 'bonecrypt-manor-legit-01',
    sender: 'Bonecrypt Manor',
    senderEmail: 'events@bonecryptmanor.co',
    subject: 'Reminder: Staff meeting Thursday 15:00 in the East Wing',
    body: `Dear All,

A reminder that the quarterly staff meeting takes place on Thursday at 15:00 in the East Wing drawing room. Tea and cobwebs will be provided.

Please bring your departmental reports.`,
    // No link
    verdict: 'legit',
    redFlags: [],
    explanation:
      'An internal reminder with no links and no requests for personal data is consistent with a routine workplace communication.',
    difficulty: 1,
  },

  // --- difficulty 2 --------------------------------------------------

  {
    id: 'spectre-cloud-legit-01',
    sender: 'SpectreCloud',
    senderEmail: 'hello@spectrecloud.com',
    subject: 'Welcome to SpectreCloud — your account is ready',  // [MATCH]
    body: `Hello,

Your SpectreCloud account has been created successfully. You can sign in at any time by visiting the link below.

If you did not create this account, contact our support team.`,
    link: {
      displayText: 'spectrecloud.com/login',
      realUrl: 'spectrecloud.com/login',                // matches sender domain
    },
    verdict: 'legit',
    redFlags: [],
    explanation:
      'The sending domain and the real link destination are both "spectrecloud.com", and the email makes no urgent demands — consistent with a legitimate welcome message.',
    difficulty: 2,
  },

  {
    id: 'tombstone-auctions-legit-01',
    sender: 'Tombstone Auctions',
    senderEmail: 'confirm@tombstoneauctions.com',
    subject: 'Your bid on Lot 442 was successful',  // [MATCH]
    body: `Dear Member,

Congratulations! Your bid of 18 silver marks on Lot 442 (antique brass candlestick) was successful. The seller will contact you within 2 business days.

You can view your win in My Bids.`,
    link: {
      displayText: 'tombstoneauctions.com/my-bids',
      realUrl: 'tombstoneauctions.com/my-bids',         // matches sender domain
    },
    verdict: 'legit',
    redFlags: [],
    explanation:
      'The email sender domain and the real link destination are identical ("tombstoneauctions.com"), and no payment or personal data is requested.',
    difficulty: 2,
  },

  {
    id: 'manor-it-legit-01',
    sender: 'Manor IT Helpdesk',
    senderEmail: 'helpdesk@bonecryptmanor.co',
    subject: 'Scheduled system update tonight at midnight',
    body: `Hi,

We will apply a routine security patch to manor workstations tonight at midnight. Your computer will restart automatically. Please save any open work before you leave this evening.

No action is required beyond saving your work.`,
    // No link
    verdict: 'legit',
    redFlags: [],
    explanation:
      'An IT update notice that asks only for you to save your work and contains no links or credential requests is consistent with a legitimate internal notification.',
    difficulty: 2,
  },

  {
    id: 'nocturne-bank-legit-01',
    sender: 'Nocturne Bank',
    senderEmail: 'security@nocturne-bank.com',
    subject: 'Your password was changed successfully',  // [MATCH]
    body: `Dear Customer,

Your online banking password was changed on the device you used earlier today. If you made this change, no further action is needed.

If you did not change your password, sign in to review your account security.`,
    link: {
      displayText: 'nocturne-bank.com/security',
      realUrl: 'nocturne-bank.com/security',            // matches sender domain
    },
    verdict: 'legit',
    redFlags: [],
    explanation:
      'The sending domain and the real link destination are both "nocturne-bank.com". The email provides a clear innocent explanation and directs you to act only if you did not initiate the change.',
    difficulty: 2,
  },

  {
    id: 'ashwick-supplies-legit-01',
    sender: 'Ashwick Supplies Co.',
    senderEmail: 'invoices@ashwick-supplies.co',
    subject: 'Invoice #ASH-2846 — 90 silver marks due in 14 days',  // [MATCH]
    body: `Dear Finance Team,

Please find attached Invoice #ASH-2846 for 90 silver marks, due in 14 days. Payment details are unchanged from previous invoices.

If you have any questions, please reply to this email.`,
    link: {
      displayText: 'ashwick-supplies.co/invoices/2846',
      realUrl: 'ashwick-supplies.co/invoices/2846',     // matches sender domain
    },
    verdict: 'legit',
    redFlags: [],
    explanation:
      'The sending domain and the real link destination are both "ashwick-supplies.co", and the email explicitly states bank details are unchanged — both are good signs that this is a legitimate invoice.',
    difficulty: 2,
  },

  // --- difficulty 3 --------------------------------------------------

  {
    id: 'ravenmoor-council-legit-01',
    sender: 'Ravenmoor Town Council',
    senderEmail: 'admin@ravenmoor-council.com',
    subject: 'Your planning application DEC-00341 — consultation open',  // [MATCH]
    body: `Dear Resident,

The public consultation period for planning application DEC-00341 (adjacent to your property) is now open and runs for 21 days. You may submit comments via the link below.

Your participation is entirely voluntary.`,
    link: {
      displayText: 'ravenmoor-council.com/planning/consult',
      realUrl: 'ravenmoor-council.com/planning/consult', // matches sender domain
    },
    verdict: 'legit',
    redFlags: [],
    explanation:
      'The sending domain and the real link destination are both "ravenmoor-council.com", and the email makes no urgent demands or requests for personal data.',
    difficulty: 3,
  },

  {
    id: 'mirewarden-estate-legit-01',
    sender: 'Mirewarden Estate Management',
    senderEmail: 'admin@mirewarden-estate.net',
    subject: 'Annual service charge statement — 240 silver marks',  // [MATCH]
    body: `Dear Resident,

Your annual service charge statement is now available. The charge for the coming year is 240 silver marks, payable by the first of next month.

Review and pay via the resident portal.`,
    link: {
      displayText: 'mirewarden-estate.net/residents/portal',
      realUrl: 'mirewarden-estate.net/residents/portal', // matches sender domain
    },
    verdict: 'legit',
    redFlags: [],
    explanation:
      'The sending domain and the real link destination are identical ("mirewarden-estate.net"). A routine annual statement with a real deadline is consistent with a legitimate management notice.',
    difficulty: 3,
  },

  {
    id: 'nocturne-bank-legit-02',
    sender: 'Nocturne Bank',
    senderEmail: 'noreply@nocturne-bank.com',
    subject: 'Direct debit amendment confirmed',
    body: `Dear Customer,

A direct debit amendment to your Nocturne Bank account has been processed as requested. The updated instruction will take effect from the next payment date.

If you did not authorise this change, contact us immediately by calling the number on the back of your card.`,
    // No link — instructs you to call, not click
    verdict: 'legit',
    redFlags: [],
    explanation:
      'This confirmation provides no link and directs you to call the number on your physical card if anything is wrong — a cautious and legitimate approach to sensitive account changes.',
    difficulty: 3,
  },

  {
    id: 'ashwick-supplies-legit-02',
    sender: 'Ashwick Supplies Co.',
    senderEmail: 'invoices@ashwick-supplies.co',
    subject: 'Reminder: Invoice #ASH-2846 due in 3 days',  // [MATCH]
    body: `Dear Finance Team,

This is a reminder that Invoice #ASH-2846 for 90 silver marks is due in 3 days. If payment has already been made, please disregard this message.

Review the invoice via the link below.`,
    link: {
      displayText: 'ashwick-supplies.co/invoices/2846',
      realUrl: 'ashwick-supplies.co/invoices/2846',     // matches sender domain
    },
    verdict: 'legit',
    redFlags: [],
    explanation:
      'A payment deadline reminder looks urgent at first glance, but both the sender domain and the real link destination are "ashwick-supplies.co" — consistent with a routine follow-up from a known supplier.',
    difficulty: 3,
  },

  {
    id: 'spectre-cloud-legit-02',
    sender: 'SpectreCloud',
    senderEmail: 'support@spectrecloud.com',
    subject: 'Storage nearly full — your files are safe',  // [MATCH]
    body: `Hello,

Your SpectreCloud storage is at 85% capacity. Your files are safe and will not be deleted. If you would like to upgrade your plan, you can do so from your account settings.

There is no urgency — this is a courtesy notice.`,
    link: {
      displayText: 'spectrecloud.com/account/settings',
      realUrl: 'spectrecloud.com/account/settings',     // matches sender domain
    },
    verdict: 'legit',
    redFlags: [],
    explanation:
      'The email explicitly states there is no urgency and your files are safe — the opposite of a threat. The sender and real link domain both match "spectrecloud.com".',
    difficulty: 3,
  },
]

// =====================================================================
// Combined pool — 20 phishing + 14 legit = 34 letters total
// =====================================================================

const letters: Letter[] = [...phishingLetters, ...legitLetters]

export default letters
