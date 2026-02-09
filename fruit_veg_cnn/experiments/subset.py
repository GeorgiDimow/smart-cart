import os
import shutil
import random

main_dataset_path = '..\.\data\input'
train_path = os.path.join(main_dataset_path, 'Training')
test_path = os.path.join(main_dataset_path, 'Test')

subset_path = '..\.\data\working'
os.makedirs(subset_path, exist_ok=True)
os.makedirs(os.path.join(subset_path, 'Training'), exist_ok=True)
os.makedirs(os.path.join(subset_path, 'Test'), exist_ok=True)

all_classes = os.listdir(train_path)
selected_classes = random.sample(all_classes, 20)
selected_classes.sort()

print("✓ Selected 20 classes for our subset:")
for i, class_name in enumerate(selected_classes, 1):
    print(f"  {i:2d}. {class_name}")

def copy_classes(source_path, dest_path, classes):
    for class_name in classes:
        source_class_path = os.path.join(source_path, class_name)
        dest_class_path = os.path.join(dest_path, class_name)
        
        if os.path.exists(source_class_path):
            shutil.copytree(source_class_path, dest_class_path)
            print(f"  ✓ Copied {class_name}")

print(f"\nCopying training data...")
copy_classes(train_path, os.path.join(subset_path, 'Training'), selected_classes)

print(f"Copying test data...")
copy_classes(test_path, os.path.join(subset_path, 'Test'), selected_classes)

print(f"\nSubset created at: {subset_path}")
print(f"Subset summary:")
train_subset_path = os.path.join(subset_path, 'Training')
test_subset_path = os.path.join(subset_path, 'Test')

train_subset_classes = len(os.listdir(train_subset_path))
test_subset_classes = len(os.listdir(test_subset_path))

train_subset_samples = sum(len(os.listdir(os.path.join(train_subset_path, cls))) for cls in os.listdir(train_subset_path))
test_subset_samples = sum(len(os.listdir(os.path.join(test_subset_path, cls))) for cls in os.listdir(test_subset_path))

print(f"Training: {train_subset_classes} classes, {train_subset_samples} samples")
print(f"Test: {test_subset_classes} classes, {test_subset_samples} samples")

print("\n✓ Subset creation completed!")