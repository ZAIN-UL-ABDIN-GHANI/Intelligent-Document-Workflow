import yaml
from pathlib import Path


# prompts.yaml is in the same folder as config.py
PROMPT_FILE = Path(__file__).parent / "prompts.yaml"


def get_versioned_prompt(agent_key: str, version: str):
    """
    Load a specific prompt version from prompts.yaml
    """

    # Debug (remove later if you want)
    print(f"PROMPT FILE: {PROMPT_FILE}")
    print(f"EXISTS: {PROMPT_FILE.exists()}")

    if not PROMPT_FILE.exists():
        raise FileNotFoundError(
            f"prompts.yaml not found at: {PROMPT_FILE}"
        )

    with open(PROMPT_FILE, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    version_data = (
        config.get(agent_key, {})
        .get("versions", {})
        .get(version)
    )

    if not version_data:
        raise ValueError(
            f"Prompt version '{version}' for '{agent_key}' not found."
        )

    return (
        version_data["system_message"],
        version_data.get("human_template", "")
    )