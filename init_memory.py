#!/usr/bin/env python3
"""
Direct ChromaDB integration for MemPalace
"""

import os
import glob
from pathlib import Path

PALACE_PATH = os.path.expanduser("~/.mempalace/palace")
os.makedirs(PALACE_PATH, exist_ok=True)

import chromadb
from chromadb.config import Settings

# Create persistent client
client = chromadb.PersistentClient(path=PALACE_PATH)

# Get or create collection
try:
    collection = client.get_collection("mempalace_drawers")
    print(f"Collection exists with {collection.count()} items")
except:
    collection = client.create_collection("mempalace_drawers")
    print("Created new collection")

# Sample documents about Blrsnacks
docs = [
    """Blrsnacks is a grocery and snacks e-commerce platform. Frontend is built with Next.js 14, React, TypeScript, and Tailwind CSS. Backend uses NestJS with TypeScript and Prisma ORM. Database is PostgreSQL. Authentication uses JWT tokens and Google OAuth. Payment method is Cash on Delivery (COD) only.""",
    """Frontend structure: app/ directory for Next.js App Router, components/ for React components, hooks/ for custom hooks, lib/ for utilities, types/ for TypeScript definitions. Key features: product catalog, shopping cart, user authentication, order management.""",
    """Backend structure: src/ with controllers, services, modules, prisma/ for database schema. API endpoints for products, cart, orders, users. Uses JWT guard for authentication. Prisma schema includes User, Product, Order, OrderItem, Cart models.""",
]

# Add documents
ids = [f"doc_{i}" for i in range(len(docs))]
collection.add(ids=ids, documents=docs, metadatas=[{"source": "blrsnacks"}] * len(docs))

print(f"Added {len(docs)} documents to collection")
print(f"Total items: {collection.count()}")

# Test search
print("\n--- Test Search ---")
results = collection.query(query_texts=["authentication"], n_results=2)
print(
    f"Search 'authentication': {results['documents'][0] if results['documents'] else 'No results'}"
)

results = collection.query(query_texts=["frontend structure"], n_results=2)
print(
    f"Search 'frontend': {results['documents'][0] if results['documents'] else 'No results'}"
)

print("\nMemPalace initialized successfully!")
