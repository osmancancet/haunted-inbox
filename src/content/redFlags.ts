// =====================================================================
// Haunted Inbox — Red-Flag Definitions
// Eight recognisable social-engineering / phishing signals.
// =====================================================================

export type RedFlagId =
  | 'urgency'
  | 'spoofed_sender'
  | 'mismatched_link'
  | 'credential_request'
  | 'too_good_to_be_true'
  | 'unexpected_attachment'
  | 'authority_pressure'
  | 'unusual_request'

export interface RedFlagDefinition {
  id: RedFlagId
  /** Short display name shown in the feedback panel. */
  name: string
  /** One-sentence explanation of why this is suspicious. */
  description: string
}

export const RED_FLAGS: RedFlagDefinition[] = [
  {
    id: 'urgency',
    name: 'False Urgency',
    description:
      'The message pressures you to act immediately ("Your account will be closed tonight!") to prevent careful thinking.',
  },
  {
    id: 'spoofed_sender',
    name: 'Spoofed Sender',
    description:
      'The sender is not who it claims to be: the address uses a different or misspelt domain, or a genuine-looking From address has been forged or taken over.',
  },
  {
    id: 'mismatched_link',
    name: 'Mismatched Link',
    description:
      'The visible link text points to one site, but the real destination URL leads somewhere completely different.',
  },
  {
    id: 'credential_request',
    name: 'Credential Request',
    description:
      'The message asks you to hand over passwords, card details or personal data through an emailed link or by reply.',
  },
  {
    id: 'too_good_to_be_true',
    name: 'Too Good to Be True',
    description:
      'Promises of unexpected prizes, inheritances, or huge discounts are a classic lure to lower your guard.',
  },
  {
    id: 'unexpected_attachment',
    name: 'Unexpected Attachment',
    description:
      'An attachment you did not ask for — especially an invoice, receipt, or "important document" — may contain malware.',
  },
  {
    id: 'authority_pressure',
    name: 'Authority Pressure',
    description:
      'Impersonating a bank, government agency, or senior official to make you comply without questioning.',
  },
  {
    id: 'unusual_request',
    name: 'Unusual Money or Secrecy Request',
    description:
      'Out-of-pattern asks such as buying gift vouchers, paying into a new bank account, calling a number given only in the message, or keeping the request confidential.',
  },
]

/** Convenience map for O(1) look-up by id. */
export const RED_FLAG_MAP = new Map<RedFlagId, RedFlagDefinition>(
  RED_FLAGS.map((f) => [f.id, f]),
)
