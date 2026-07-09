from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.ai import ChatRequest, ChatResponse
from app.services.ai_coach import chat as ai_chat
from app.services.safety import GENERAL_DISCLAIMER

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/chat", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ChatResponse:
    reply, escalation_flagged, session_id = ai_chat(db, current_user, payload.message, payload.session_id)
    return ChatResponse(
        session_id=session_id,
        reply=reply,
        escalation_flagged=escalation_flagged,
        disclaimer=GENERAL_DISCLAIMER,
    )
