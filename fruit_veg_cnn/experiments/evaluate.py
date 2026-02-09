import torch
import torch.nn as nn
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix
import numpy as np
import os

from models.model import MiniVGG

IMG_SIZE = 100 
BATCH_SIZE = 32

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_DIR =  os.path.join(BASE_DIR,'.././data/input/Test')
MODEL_PATH = os.path.join(BASE_DIR, '.././model_dictionaries/model.pth')
CLASSES_FILE = os.path.join(BASE_DIR, '.././classes/classes.txt')

plt.switch_backend('Agg')

def load_classes():
    with open(CLASSES_FILE, 'r') as f:
        return [line.strip() for line in f]

def evaluate():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Evaluating on {device}...")

    if not os.path.exists(CLASSES_FILE):
        print("Error: classes.txt not found.")
        return
    class_names = load_classes()
    
    transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    test_dataset = datasets.ImageFolder(root=DATA_DIR, transform=transform)
    test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=True)

    model = MiniVGG(num_classes=len(class_names)).to(device)
    try:
        model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
        print("Model weights loaded successfully.")
    except FileNotFoundError:
        print("Error: model.pth not found. Train the model first!")
        return

    model.eval() 

    all_preds = []
    all_labels = []
    
    sample_inputs = None
    sample_labels = None
    sample_preds = None

    print("Running inference on Test set...")
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())


            if sample_inputs is None:
                sample_inputs = inputs.cpu()
                sample_labels = labels
                sample_preds = preds.cpu()

    print("Generating Confusion Matrix...")
    cm = confusion_matrix(all_labels, all_preds)
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=class_names, yticklabels=class_names)
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Confusion Matrix')
    plt.tight_layout()
    plt.savefig('confusion_matrix.png') 
    print("Saved: confusion_matrix.png")


    print("Generating Prediction Grid...")
    
    def denormalize(tensor):
        mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
        std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
        return tensor * std + mean

    fig, axes = plt.subplots(4, 4, figsize=(12, 12))
    axes = axes.ravel()

    for i in range(16):
        if i >= len(sample_inputs): break
        
        img = denormalize(sample_inputs[i]).permute(1, 2, 0).numpy()
        img = np.clip(img, 0, 1) 
        
        true_label = class_names[sample_labels[i]]
        pred_label = class_names[sample_preds[i]]
        
        axes[i].imshow(img)
        
        color = 'green' if true_label == pred_label else 'red'
        axes[i].set_title(f"True: {true_label}\nPred: {pred_label}", color=color, fontsize=10)
        axes[i].axis('off')

    plt.tight_layout()
    plt.savefig('predictions_grid.png')
    print("Saved: predictions_grid.png")
    
    acc = 100 * np.sum(np.array(all_preds) == np.array(all_labels)) / len(all_labels)
    print(f"Final Test Accuracy: {acc:.2f}%")

if __name__ == '__main__':
    evaluate()