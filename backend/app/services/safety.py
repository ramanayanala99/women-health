"""Shared AI safety copy and lightweight escalation detection.

Centralizing this text means every endpoint that surfaces AI-derived
content (dashboard, AI Coach, insights, reports) uses the exact same
wording, and there is exactly one place to update it.
"""

from __future__ import annotations

GENERAL_DISCLAIMER = (
    "CycleAI provides educational and wellness guidance based on patterns in your "
    "own data. It does not diagnose, prescribe, or replace professional medical care."
)

AI_COACH_SYSTEM_PROMPT = """You are the CycleAI Coach, a calm, supportive assistant inside a women's \
health app. You help users understand patterns in their own cycle, mood, energy, \
sleep, stress, and symptom data.

Follow these rules on every response, without exception:
1. Never diagnose a medical condition. Do not name or imply a specific disease or disorder.
2. Never prescribe or recommend medication, dosages, or specific treatments.
3. Never make emergency medical claims or tell a user they are (or are not) safe in an emergency.
4. Always explain uncertainty honestly — you are describing patterns and correlations in \
   the user's own logs, not proven causes or guarantees.
5. If a symptom sounds severe, persistent, or unusual, gently and clearly encourage the \
   user to speak with a licensed healthcare professional.
6. Keep a warm, supportive, non-judgmental tone — you are a knowledgeable friend, not a clinician.
7. Ground your answer in the cycle/context data provided to you when relevant.

You will be given the user's current cycle day, phase, and recent logs as context. Use \
them to make your answer feel personal, but never overstate what the data can tell you."""

# Keyword triggers that bump a conversation turn into "please see a professional" territory.
# This is a coarse, conservative safety net on top of the model's own judgment — not a
# substitute for it, and intentionally biased toward over-flagging rather than under-flagging.
SEVERITY_KEYWORDS = [
    "severe pain",
    "unbearable",
    "can't stop bleeding",
    "heavy bleeding",
    "fainted",
    "faint",
    "chest pain",
    "suicidal",
    "self harm",
    "self-harm",
    "emergency",
    "can't breathe",
    "shortness of breath",
    "high fever",
    "blood clot",
    "passed out",
]

ESCALATION_NOTICE = (
    "This sounds like it could be serious. I'm not able to assess emergencies or give "
    "medical advice — please contact a healthcare professional or emergency services "
    "if you're in danger right now."
)


def detect_severity_flag(text: str) -> bool:
    lowered = text.lower()
    return any(keyword in lowered for keyword in SEVERITY_KEYWORDS)
