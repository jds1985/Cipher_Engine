import os
import json
import glob
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer, AutoModelForCausalLM
from huggingface_hub import HfApi, create_repo

# Dynamically resolve paths relative to this script directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ISOLATED_DATA_DIR = os.path.join(SCRIPT_DIR, "training_env", "data_gold")
ISOLATED_CHECKPOINT_DIR = os.path.join(SCRIPT_DIR, "training_env", "weights_output")

# 1. Custom Dataset reading JSONL files from isolated training folder
class TernaryDataset(Dataset):
    def __init__(self, data_folder, tokenizer, max_length=512):
        self.examples = []
        self.tokenizer = tokenizer
        self.max_length = max_length

        search_path = os.path.join(data_folder, "*.jsonl")
        jsonl_files = sorted(glob.glob(search_path))

        if not jsonl_files:
            print(f"WARNING: No .jsonl files found in path: {data_folder}")
            return

        print(f"Found {len(jsonl_files)} dataset layers in targeted directory structure.")
        
        for file_path in jsonl_files:
            print(f"Loading data matrix from: {os.path.basename(file_path)}")
            with open(file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.strip():
                        try:
                            data = json.loads(line)
                            text = data.get('text', '') or data.get('input', '')
                            if text:
                                self.examples.append(text)
                        except json.JSONDecodeError:
                            continue
        
        print(f"Total dataset initialization complete. Total sequences: {len(self.examples)}")

    def __len__(self):
        return len(self.examples)

    def __getitem__(self, idx):
        text = self.examples[idx]
        inputs = self.tokenizer(
            text,
            max_length=self.max_length,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )
        return {
            "input_ids": inputs["input_ids"].squeeze(0),
            "attention_mask": inputs["attention_mask"].squeeze(0)
        }

# 2. Main Training Core
def main():
    print("Initializing Cipher Substrate Gated Training Pipeline...")
    
    epochs = 3
    batch_size = 8  # Optimized for 2B models on RunPod GPU
    learning_rate = 2e-5
    
    # Target foundation checkpoint
    model_id = "microsoft/bitnet-b1.58-2B-4T-bf16" 
    
    print(f"Requesting authorization to download native foundation weights: {model_id}")
    
    try:
        # Standard Hugging Face token parameter
        tokenizer = AutoTokenizer.from_pretrained(model_id, token=True)
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
            
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Loading model architecture onto compute device: {device}")
        
        model = AutoModelForCausalLM.from_pretrained(
            model_id, 
            token=True,
            torch_dtype=torch.bfloat16,
            device_map="auto"
        )
        
    except Exception as e:
        print("\nCRITICAL AUTHENTICATION ERROR:")
        print("Could not access the repository. Run 'huggingface-cli login' with a WRITE token first.")
        print(f"Error Details: {e}")
        return

    # Ingest data from isolated folder
    if not os.path.exists(ISOLATED_DATA_DIR):
        os.makedirs(ISOLATED_DATA_DIR, exist_ok=True)
        print(f"Directory created at '{ISOLATED_DATA_DIR}'. Place .jsonl dataset files here to train.")
        return
        
    dataset = TernaryDataset(ISOLATED_DATA_DIR, tokenizer)
    if len(dataset) == 0:
        print("CRITICAL ERROR: Dataset matrix is empty. Halting build pipeline.")
        return
        
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)
    
    model.train()
    
    for epoch in range(epochs):
        print(f"\n--- Epoch {epoch + 1}/{epochs} Initialized ---")
        total_loss = 0
        
        for batch_idx, batch in enumerate(dataloader):
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            
            optimizer.zero_grad()
            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=input_ids)
            loss = outputs.loss
            
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            
            if batch_idx % 10 == 0:
                print(f"Batch {batch_idx}/{len(dataloader)} | Current Loss: {loss.item():.4f}")
                
        print(f"Epoch {epoch + 1} Complete. Average Loss: {total_loss / len(dataloader):.4f}")
        
    # Local export
    print(f"\nTraining complete. Archiving weights to '{ISOLATED_CHECKPOINT_DIR}'...")
    os.makedirs(ISOLATED_CHECKPOINT_DIR, exist_ok=True)
    model.save_pretrained(ISOLATED_CHECKPOINT_DIR)
    tokenizer.save_pretrained(ISOLATED_CHECKPOINT_DIR)
    print("Local archival complete.")

    # 3. Cloud Artifact Push
    print("\nInitializing landing pad sync on Hugging Face...")
    try:
        api = HfApi()
        user_info = api.whoami()
        hf_username = user_info['name']
        
        destination_repo = f"{hf_username}/cipher-substrate-weights"
        print(f"Creating secure private destination: {destination_repo}")
        
        create_repo(repo_id=destination_repo, repo_type="model", private=True, exist_ok=True)
        
        print("Uploading trained substrate layers...")
        api.upload_folder(
            folder_path=ISOLATED_CHECKPOINT_DIR,
            repo_id=destination_repo,
            repo_type="model"
        )
        print(f"\n🚀 SUCCESS: Cipher substrate baked and secured at: https://huggingface.co/{destination_repo}")
        
    except Exception as e:
        print("\nWARNING: Local build succeeded, but cloud upload failed.")
        print(f"Upload Error Details: {e}")

if __name__ == "__main__":
    main()
