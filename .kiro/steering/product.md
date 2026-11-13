# Product: Haunted Inbox

Haunted Inbox is a short browser game that teaches people to spot phishing and
social-engineering emails. The player works the night shift in the mail room of
a haunted manor. Letters arrive one by one; some are honest, some are "cursed"
(phishing). The player decides: deliver it, or burn it.

Entry for Kiroween 2026, category **Costume Contest** (a haunting, polished UI
is a core requirement, not decoration).

## Core loop
1. A letter (email) slides onto the desk: sender, address, subject, body, link.
2. The player can inspect it: hover a link to reveal the real destination,
   hold the letter to the candle to reveal hidden "curse marks" (red flags).
3. The player chooses **Deliver** (legit) or **Burn** (phishing).
4. Feedback: which red flags were present (urgency, spoofed sender domain,
   mismatched link, request for credentials, too-good-to-be-true reward,
   unexpected attachment, authority pressure) and a one-sentence lesson.
5. Wrong answers snuff a candle (3 candles = 3 lives). A night is 10 letters.
6. End of night: score, streak, the red-flag types the player missed most.

## Content rules (important)
- Every email is original fiction. All companies, banks, couriers and people
  are INVENTED (e.g. "Gravewell Bank", "Moonpost Courier"). Never use or imitate
  a real brand, logo, real domain or real person.
- Links are never real or clickable out of the game; they are text only.
- Tone: spooky and playful, never gory. Suitable for classroom use.
- Language: English UI and content. Keep text short and plain.
- The educational content comes from the author's field (social-engineering
  awareness teaching); lessons must be accurate and practical.

## Non-goals
No accounts, no backend, no tracking, no real email integration.

## Content design rules (added after first content review)
The pool must not be solvable by a shortcut. In particular:
- "Has a link" must NOT predict phishing. At least 40% of legit letters contain
  a link whose real destination matches the sender's genuine domain, and at
  least 25% of phishing letters contain no link at all (reply-based scams:
  gift-card request from "the boss", invoice/bank-detail change, callback
  number, "are you at your desk?" pretexts).
- Tone must NOT predict the verdict. Include legit letters with a real deadline
  or a request for action (renewal reminder, password changed notice, meeting
  RSVP, invoice from a known supplier), and calm, polite phishing letters with
  only one or two subtle red flags (a look-alike domain, a reply-to mismatch).
- Difficulty tiers: each letter has `difficulty: 1 | 2 | 3`. Tier 1 is obvious,
  tier 3 hinges on a single detail the player must inspect. A night ramps up:
  mostly tier 1 first, tier 3 last.
- The revealed real URL must look realistic and neutral (`/login`, `/verify`,
  `/account`). Never use giveaway paths such as `/phish`, `/harvest`,
  `/steal-creds`. The lesson is the DOMAIN, not the path.
- Domains: invented names on ordinary suffixes (.com, .net, .org, .co). Do not
  use real government or national suffixes (.gov, .gov.uk, .co.uk, .edu).
- Explanations must be accurate and practical: name the specific signal in THIS
  letter and the safe action (check the domain, open the site yourself, call a
  known number). Avoid absolute claims like "banks never..." or "IT never...".
- Use a neutral fictional currency ("silver marks") instead of real currencies,
  and no country-specific details.
- Each red-flag type must appear in at least 3 phishing letters.
