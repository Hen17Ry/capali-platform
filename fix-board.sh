#!/bin/bash

OWNER="Hen17Ry"
PROJECT_NUMBER=3        # ← corrigé

echo "🔍 Récupération des données du projet..."

DATA=$(gh api graphql -f query='
query {
  user(login: "'$OWNER'") {
    projectV2(number: '$PROJECT_NUMBER') {
      id
      fields(first: 20) {
        nodes {
          ... on ProjectV2SingleSelectField {
            id
            name
            options { id name }
          }
        }
      }
      items(first: 100) {
        nodes {
          id
          content {
            ... on Issue { number }
          }
        }
      }
    }
  }
}')

PROJECT_ID=$(echo $DATA | jq -r '.data.user.projectV2.id')
FIELD_ID=$(echo $DATA | jq -r '.data.user.projectV2.fields.nodes[] | select(.name=="Status") | .id')
TODO_OPT=$(echo $DATA | jq -r '.data.user.projectV2.fields.nodes[] | select(.name=="Status") | .options[] | select(.name=="Todo") | .id')
PROG_OPT=$(echo $DATA | jq -r '.data.user.projectV2.fields.nodes[] | select(.name=="Status") | .options[] | select(.name=="In Progress") | .id')
DONE_OPT=$(echo $DATA | jq -r '.data.user.projectV2.fields.nodes[] | select(.name=="Status") | .options[] | select(.name=="Done") | .id')

echo "Project  : $PROJECT_ID"
echo "Field    : $FIELD_ID"
echo "Todo     : $TODO_OPT"
echo "Progress : $PROG_OPT"
echo "Done     : $DONE_OPT"
echo ""

set_status() {
  local ISSUE_NUM=$1
  local OPT_ID=$2
  local LABEL=$3

  ITEM_ID=$(echo $DATA | jq -r '.data.user.projectV2.items.nodes[] | select(.content.number=='$ISSUE_NUM') | .id')

  if [ -z "$ITEM_ID" ] || [ "$ITEM_ID" = "null" ]; then
    echo "⚠️  #$ISSUE_NUM : pas trouvée dans le board"
    return
  fi

  gh api graphql -f query='
  mutation {
    updateProjectV2ItemFieldValue(input: {
      projectId: "'$PROJECT_ID'"
      itemId: "'$ITEM_ID'"
      fieldId: "'$FIELD_ID'"
      value: { singleSelectOptionId: "'$OPT_ID'" }
    }) { projectV2Item { id } }
  }' > /dev/null 2>&1

  echo "✅ #$ISSUE_NUM → $LABEL"
}

echo "✅ Passage en DONE (#25 → #40)..."
for N in 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40; do
  set_status $N $DONE_OPT "Done"
done

echo ""
echo "🔄 Passage en IN PROGRESS (#41 → #47)..."
for N in 41 42 43 44 45 46 47; do
  set_status $N $PROG_OPT "In Progress"
done

echo ""
echo "🎉 Board CAP ALI - Roadmap mis à jour !"