#!/bin/bash

OWNER="Hen17Ry"
PROJECT_NUMBER=1

echo "➕ Ajout des issues fermées au board..."

# Récupère toutes les issues fermées et les ajoute au projet
gh issue list \
  --repo "$OWNER/capali-platform" \
  --state closed \
  --limit 50 \
  --json url \
  --jq '.[].url' | while read URL; do
    gh project item-add $PROJECT_NUMBER \
      --owner $OWNER \
      --url "$URL"
    echo "✅ Ajoutée : $URL"
done

echo ""
echo "➕ Ajout des issues ouvertes au board..."

gh issue list \
  --repo "$OWNER/capali-platform" \
  --state open \
  --limit 50 \
  --json url \
  --jq '.[].url' | while read URL; do
    gh project item-add $PROJECT_NUMBER \
      --owner $OWNER \
      --url "$URL"
    echo "✅ Ajoutée : $URL"
done

echo ""
echo "🎉 Fait ! Les workflows vont automatiquement trier les issues."
echo "   • Issues fermées  → Done"
echo "   • Issues ouvertes → Todo"