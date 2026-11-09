import logging

logging.basicConfig(
    filename="logs/rag.log",
    level=logging.INFO
)

logger = logging.getLogger(__name__)