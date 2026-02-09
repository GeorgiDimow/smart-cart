import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import os

from fruit_veg_cnn.models.model import MiniVGG

IMG_SIZE = 100
BATCH_SIZE = 32
EPOCHS = 15
LEARNING_RATE = 0.001
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_DIR =  os.path.join(BASE_DIR,'.././data/input/Test')
MODEL_SAVE_PATH = os.path.join(BASE_DIR, '.././modelDictionaries/model.pth')
CLASSES_SAVE_PATH = os.path.join(BASE_DIR, '.././classes/classes.txt')

def train():
    print(f"Checking data directory: {DATA_DIR}")
    if not os.path.exists(DATA_DIR):
        print("ERROR: Path not found!")
        return

    print("Applying Data Augmentation...")
    transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomRotation(20),
        transforms.RandomHorizontalFlip(),
        transforms.ColorJitter(brightness=0.1, contrast=0.1),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    train_dataset = datasets.ImageFolder(root=DATA_DIR, transform=transform)
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=2)
    
    class_names = train_dataset.classes
    num_classes = len(class_names)
    print(f"Detected {num_classes} classes.")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    model = MiniVGG(num_classes=num_classes).to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

    print(f"Starting Training for {EPOCHS} epochs...")
    
    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        for batch_idx, (inputs, labels) in enumerate(train_loader):
            inputs, labels = inputs.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()

        epoch_loss = running_loss / len(train_loader)
        epoch_acc = 100. * correct / total
        print(f"Epoch {epoch+1}/{EPOCHS} | Loss: {epoch_loss:.4f} | Acc: {epoch_acc:.2f}%")

    print(f"Saving model to {MODEL_SAVE_PATH}...")
    torch.save(model.state_dict(), MODEL_SAVE_PATH)
    
    print(f"Saving classes to {CLASSES_SAVE_PATH}...")
    with open(CLASSES_SAVE_PATH, 'w') as f:
        for item in class_names:
            f.write("%s\n" % item)

    print("Training finished successfully!")


if __name__ == "__main__":
    train()