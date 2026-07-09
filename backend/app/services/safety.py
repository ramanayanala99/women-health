"""Shared AI safety copy and escalation detection.

Centralizing this text means every endpoint that surfaces AI-derived
content (dashboard, AI Coach, insights, reports) uses the exact same
wording, and there is exactly one place to update it.

CycleAI is not a doctor. It does not diagnose medical conditions, does
not prescribe medicine, and does not replace professional medical care.
It may explain general health and cycle-related patterns, give wellness
education, and suggest hydration, rest, gentle movement, nutrition,
sleep, and stress reduction — and it must recommend professional care
whenever a conversation looks like it needs more than that.

Escalation is checked two ways, deliberately overlapping:
1. `detect_severity_flag` — keyword/phrase matching against what the user
   just typed (severe pain, heavy bleeding, fear/danger/emergency language,
   pregnancy paired with a concerning symptom).
2. `has_persistent_or_worsening_pattern` — a data-driven check against the
   user's own recent logs, for the cases a single message can't reveal:
   symptoms that are persistent (recurring across recent days) or
   suddenly worse than the user's own recent baseline.
Either signal is enough to trigger the calm, professional-care nudge —
this is a conservative safety net on top of the model's own judgment,
not a substitute for it, and it is intentionally biased toward
over-flagging rather than under-flagging.
"""

from __future__ import annotations

from datetime import date, timedelta

from sqlalchemy.orm import Session

GENERAL_DISCLAIMER = (
    "CycleAI is not a doctor. It provides educational and wellness guidance based on "
    "patterns in your own data — it does not diagnose, prescribe, or replace professional "
    "medical care."
)

AI_COACH_SYSTEM_PROMPT = """You are the CycleAI Coach, a calm, supportive assistant inside a women's \
health app. You help users understand patterns in their own cycle, mood, energy, \
sleep, stress, and symptom data.

Hard rules — CycleAI is not a doctor:
1. Never diagnose a medical condition. Do not name or imply a specific disease or disorder.
2. Never prescribe or recommend medication, dosages, or specific treatments.
3. Never make emergency medical claims or tell a user they are (or are not) safe in an emergency.
4. Never replace professional medical care — you support it, you don't substitute for it.

What you may do:
- Explain general health and cycle-related patterns in the user's own data.
- Give wellness education in plain language.
- Suggest hydration, rest, gentle movement, nutrition, sleep, and stress reduction.
- Recommend professional care whenever it's warranted (see below).

Always recommend contacting a healthcare professional when the conversation involves:
- severe pain
- very heavy bleeding
- symptoms that are unusual for this particular user
- symptoms that are persistent (recurring over multiple days)
- symptoms that have suddenly worsened
- possible pregnancy paired with a concerning symptom
- the user expressing fear, danger, or emergency concerns

Always explain uncertainty honestly — you are describing patterns and correlations in the \
user's own logs, not proven causes or guarantees. Ground your answer in the cycle/context \
data you're given, but never overstate what that data can tell you.

Tone: calm, supportive, clear, and non-scary — even when you're encouraging someone to see \
a professional. You are a knowledgeable friend, not a clinician, and never an alarm bell."""

# --- Text-based triggers -----------------------------------------------------------

SEVERE_PAIN_PHRASES = ["severe pain", "unbearable pain", "worst pain", "excruciating", "unbearable"]

HEAVY_BLEEDING_PHRASES = [
    "heavy bleeding",
    "very heavy bleeding",
    "soaking through",
    "can't stop bleeding",
    "bleeding a lot",
    "blood clot",
]

UNUSUAL_OR_PERSISTENT_PHRASES = [
    "never happened before",
    "not normal for me",
    "isn't normal for me",
    "unusual for me",
    "won't go away",
    "keeps happening",
    "for weeks",
    "for days now",
    "getting worse",
    "worse than usual",
    "worse than before",
    "suddenly worse",
]

FEAR_OR_EMERGENCY_PHRASES = [
    "emergency",
    "scared",
    "afraid",
    "terrified",
    "is this dangerous",
    "am i okay",
    "am i going to be okay",
    "should i go to the er",
    "should i go to the hospital",
    "fainted",
    "passed out",
    "faint",
    "chest pain",
    "can't breathe",
    "shortness of breath",
    "high fever",
    "suicidal",
    "self harm",
    "self-harm",
]

PREGNANCY_MARKERS = ["pregnant", "pregnancy"]
PREGNANCY_CONCERN_MARKERS = ["bleeding", "cramping", "pain", "spotting", "clot", "dizzy", "faint"]

ESCALATION_NOTICE = (
    "What you're describing sounds like it's worth a closer look from a healthcare "
    "professional. I'm here to help you understand patterns, not to assess emergencies or "
    "give medical advice — please reach out to a doctor, nurse line, or emergency services "
    "if you're worried or in danger right now. You know your body best, and it's always "
    "okay to get it checked."
)


def detect_severity_flag(text: str) -> bool:
    """Coarse, conservative keyword check against a single message."""
    lowered = text.lower()

    if any(phrase in lowered for phrase in SEVERE_PAIN_PHRASES):
        return True
    if any(phrase in lowered for phrase in HEAVY_BLEEDING_PHRASES):
        return True
    if any(phrase in lowered for phrase in UNUSUAL_OR_PERSISTENT_PHRASES):
        return True
    if any(phrase in lowered for phrase in FEAR_OR_EMERGENCY_PHRASES):
        return True

    is_pregnancy_related = any(marker in lowered for marker in PREGNANCY_MARKERS)
    has_concerning_symptom = any(marker in lowered for marker in PREGNANCY_CONCERN_MARKERS)
    if is_pregnancy_related and has_concerning_symptom:
        return True

    return False


# --- Data-driven triggers (persistent / sudden worsening) --------------------------

PERSISTENCE_LOOKBACK_DAYS = 5
PERSISTENCE_MIN_OCCURRENCES = 3
HIGH_PAIN_THRESHOLD = 4
WORSENING_DELTA = 2.0


def has_persistent_or_worsening_pattern(db: Session, user_id: str, today: date | None = None) -> bool:
    """Looks at the user's own recent logs for persistence or a sudden worsening —
    the two escalation triggers a single message can't reveal on its own."""
    from app.models.symptom import Symptom  # local import avoids a circular import at module load

    today = today or date.today()
    since = today - timedelta(days=PERSISTENCE_LOOKBACK_DAYS)
    recent_logs = (
        db.query(Symptom)
        .filter(Symptom.user_id == user_id, Symptom.log_date >= since, Symptom.log_date <= today)
        .order_by(Symptom.log_date.asc())
        .all()
    )

    if len(recent_logs) < 2:
        return False

    # Persistent: high pain logged on most of the recent days.
    high_pain_days = sum(1 for log in recent_logs if (log.pain_level or 0) >= HIGH_PAIN_THRESHOLD)
    if high_pain_days >= PERSISTENCE_MIN_OCCURRENCES:
        return True

    # Persistent: the same named symptom shows up in most recent logs.
    symptom_counts: dict[str, int] = {}
    for log in recent_logs:
        for symptom in log.symptoms or []:
            symptom_counts[symptom] = symptom_counts.get(symptom, 0) + 1
    if any(count >= PERSISTENCE_MIN_OCCURRENCES for count in symptom_counts.values()):
        return True

    # Sudden worsening: today's pain is well above the recent baseline.
    *prior_logs, latest_log = recent_logs
    prior_pain = [log.pain_level for log in prior_logs if log.pain_level is not None]
    if prior_pain and latest_log.pain_level is not None:
        baseline = sum(prior_pain) / len(prior_pain)
        if latest_log.pain_level - baseline >= WORSENING_DELTA:
            return True

    return False
