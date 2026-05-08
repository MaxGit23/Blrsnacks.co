#!/usr/bin/env python3
import os
import sys

PALACE_PATH = os.path.expanduser("~/.mempalace/palace")
os.makedirs(PALACE_PATH, exist_ok=True)

from mempalace.miner import mine

print("Mining frontend...")
try:
    mine(project_dir="frontend", palace_path=PALACE_PATH, wing_override="wing_frontend")
    print("Frontend complete!")
except Exception as e:
    print(f"Error: {e}")

print("\nMining backend...")
try:
    mine(project_dir="backend", palace_path=PALACE_PATH, wing_override="wing_backend")
    print("Backend complete!")
except Exception as e:
    print(f"Error: {e}")

print("\nDone!")
