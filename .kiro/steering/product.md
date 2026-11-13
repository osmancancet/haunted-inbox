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
