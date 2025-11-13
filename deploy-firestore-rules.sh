#!/bin/bash

# Script para fazer deploy das regras do Firestore

echo "Deploying Firestore rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo "✓ Firestore rules deployed successfully!"
else
    echo "✗ Failed to deploy Firestore rules"
    echo "Make sure you are logged in with: firebase login"
    exit 1
fi
