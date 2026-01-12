import torch
import torchvision
import torchvision.transforms as transforms
import matplotlib.pyplot as plt
import numpy as np
import os

# Configuration
BATCH_SIZE = 32      # Process 32 images at a time
IMG_SIZE = 64        # Resize all images to 64x64
DATA_DIR = './data'  # Path to your data folder