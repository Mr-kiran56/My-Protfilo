from huggingface_hub import login, upload_folder

# (optional) Login with your Hugging Face credentials

login()

# Push your model files
upload_folder(folder_path="B:/Users/kiran/Downloads2/profileIntentLLM", repo_id="KiranPunna/profile_intent", repo_type="model")
