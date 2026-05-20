
import yaml
import os

def get_versioned_prompt(agent_key: str, version: str):
    """
    Retrieves a specific version of an agent's prompt from the YAML config.
    """
    # Navigate to the root of the project to find the yaml
    base_path = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    yaml_path = os.path.join(base_path, "app/core/prompts.yaml")
    
    with open(yaml_path, "r") as f:
        config = yaml.safe_load(f)
    
    version_data = config.get(agent_key, {}).get("versions", {}).get(version)
    
    if not version_data:
        raise ValueError(f"Prompt version {version} for {agent_key} not found.")
        
    return version_data["system_message"], version_data.get("human_template")