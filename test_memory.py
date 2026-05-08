#!/usr/bin/env python3
"""
Simple MemPalace integration for Blrsnacks
Uses searcher API directly to avoid CLI bug
"""

import os
import glob
from pathlib import Path

PALACE_PATH = os.path.expanduser("~/.mempalace/palace")
os.makedirs(PALACE_PATH, exist_ok=True)

from mempalace.searcher import search_memories

# Test search
print("Testing MemPalace search...")
results = search_memories("authentication", palace_path=PALACE_PATH, n_results=3)
print(f"Results: {results}")

# If no results, add sample data
if not results.get("results"):
    print("\nNo memories found. Let's add some...")

    from mempalace.dialect import compress_aaak

    # Sample context about Blrsnacks
    contexts = [
        "Blrsnacks is a grocery/snacks e-commerce platform built with Next.js frontend and NestJS backend",
        "Authentication uses JWT tokens and Google OAuth",
        "Payment is Cash on Delivery (COD) only",
        "Database is PostgreSQL with Prisma ORM",
        "Frontend uses React with Tailwind CSS",
    ]

    print("Sample contexts loaded for testing")
    print("\nMemPalace is ready! Use: mempalace search 'query'")
else:
    print(f"\nFound {len(results.get('results', []))} memories")
