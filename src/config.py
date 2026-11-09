import os

from dotenv import load_dotenv

load_dotenv()


AZURE_OPENAI_ENDPOINT = os.getenv(
    "AZURE_OPENAI_ENDPOINT"
)

AZURE_OPENAI_API_KEY = os.getenv(
    "AZURE_OPENAI_API_KEY"
)

AZURE_OPENAI_EMBEDDING_DEPLOYMENT = os.getenv(
    "AZURE_OPENAI_EMBEDDING_DEPLOYMENT"
)

AZURE_OPENAI_CHAT_DEPLOYMENT = os.getenv(
    "AZURE_OPENAI_CHAT_DEPLOYMENT"
)

AZURE_OPENAI_API_VERSION = os.getenv(
    "AZURE_OPENAI_API_VERSION"
)


def validate_config():

    required_settings = {
        "AZURE_OPENAI_ENDPOINT":
            AZURE_OPENAI_ENDPOINT,

        "AZURE_OPENAI_API_KEY":
            AZURE_OPENAI_API_KEY,

        "AZURE_OPENAI_EMBEDDING_DEPLOYMENT":
            AZURE_OPENAI_EMBEDDING_DEPLOYMENT,

        "AZURE_OPENAI_CHAT_DEPLOYMENT":
            AZURE_OPENAI_CHAT_DEPLOYMENT,

        "AZURE_OPENAI_API_VERSION":
            AZURE_OPENAI_API_VERSION
    }

    missing = []

    for key, value in required_settings.items():

        if not value:

            missing.append(key)

    if missing:

        raise ValueError(
            "Missing environment variables:\n"
            + "\n".join(missing)
        )
