#!/usr/bin/env python3
"""
Script pour ajouter un badge "Open in Colab" à tous les notebooks du bootcamp.
Usage: python add_colab_badge.py
"""

import json
import os
from pathlib import Path

# Configuration
GITHUB_USER = "diakite-data"
GITHUB_REPO = "data-engineering-bootcamp"
GITHUB_BRANCH = "main"

# Notebooks qui NE PEUVENT PAS tourner sur Colab (Docker, K8s, etc.)
EXCLUDE_NOTEBOOKS = [
    "14_docker",
    "15_kubernetes",
    "16_k8s",
    "21_spark_on_kubernetes",
]

def should_exclude(notebook_path: str) -> bool:
    """Vérifie si le notebook doit être exclu (Docker, K8s, etc.)"""
    for pattern in EXCLUDE_NOTEBOOKS:
        if pattern in notebook_path:
            return True
    return False

def create_colab_badge_cell(notebook_rel_path: str) -> dict:
    """Crée une cellule markdown avec le badge Colab"""
    colab_url = f"https://colab.research.google.com/github/{GITHUB_USER}/{GITHUB_REPO}/blob/{GITHUB_BRANCH}/{notebook_rel_path}"
    
    badge_markdown = f"""<a href="{colab_url}" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>

> 💡 **Conseil** : Cliquez sur le badge ci-dessus pour exécuter ce notebook directement dans Google Colab (aucune installation requise)."""

    return {
        "cell_type": "markdown",
        "metadata": {
            "id": "colab-badge"
        },
        "source": badge_markdown.split('\n')
    }

def has_colab_badge(notebook: dict) -> bool:
    """Vérifie si le notebook a déjà un badge Colab"""
    if not notebook.get("cells"):
        return False
    
    for cell in notebook["cells"][:3]:  # Vérifie les 3 premières cellules
        if cell.get("cell_type") == "markdown":
            source = "".join(cell.get("source", []))
            if "colab-badge.svg" in source or "Open In Colab" in source:
                return True
    return False

def add_colab_badge_to_notebook(notebook_path: Path, repo_root: Path) -> bool:
    """Ajoute le badge Colab à un notebook"""
    
    # Chemin relatif depuis la racine du repo
    rel_path = notebook_path.relative_to(repo_root)
    
    # Vérifier si on doit exclure ce notebook
    if should_exclude(str(notebook_path)):
        print(f"  ⏭️  Exclu (Docker/K8s) : {rel_path}")
        return False
    
    # Lire le notebook
    with open(notebook_path, 'r', encoding='utf-8') as f:
        notebook = json.load(f)
    
    # Vérifier si le badge existe déjà
    if has_colab_badge(notebook):
        print(f"  ✓  Badge déjà présent : {rel_path}")
        return False
    
    # Créer la cellule badge
    badge_cell = create_colab_badge_cell(str(rel_path))
    
    # Insérer au début (après le titre s'il existe)
    insert_position = 0
    
    # Si la première cellule est un titre (# xxx), insérer après
    if notebook.get("cells") and notebook["cells"][0].get("cell_type") == "markdown":
        first_source = "".join(notebook["cells"][0].get("source", []))
        if first_source.strip().startswith("#"):
            insert_position = 1
    
    notebook["cells"].insert(insert_position, badge_cell)
    
    # Sauvegarder
    with open(notebook_path, 'w', encoding='utf-8') as f:
        json.dump(notebook, f, indent=1, ensure_ascii=False)
    
    print(f"  ✅ Badge ajouté : {rel_path}")
    return True

def main():
    # Trouver la racine du repo
    script_dir = Path(__file__).parent
    repo_root = script_dir
    
    # Chercher le dossier notebooks
    notebooks_dir = repo_root / "notebooks"
    
    if not notebooks_dir.exists():
        print(f"❌ Dossier notebooks/ non trouvé dans {repo_root}")
        return
    
    print(f"🔍 Recherche des notebooks dans {notebooks_dir}\n")
    
    # Trouver tous les notebooks
    notebooks = list(notebooks_dir.rglob("*.ipynb"))
    
    # Filtrer les checkpoints
    notebooks = [nb for nb in notebooks if ".ipynb_checkpoints" not in str(nb)]
    
    print(f"📓 {len(notebooks)} notebooks trouvés\n")
    
    added = 0
    skipped = 0
    excluded = 0
    
    for level in ["beginner", "intermediate", "advanced"]:
        level_notebooks = [nb for nb in notebooks if f"/{level}/" in str(nb)]
        
        if level_notebooks:
            print(f"\n📁 {level.upper()}:")
            for nb_path in sorted(level_notebooks):
                if should_exclude(str(nb_path)):
                    excluded += 1
                elif add_colab_badge_to_notebook(nb_path, repo_root):
                    added += 1
                else:
                    skipped += 1
    
    print(f"\n" + "="*50)
    print(f"✅ Badges ajoutés : {added}")
    print(f"⏭️  Déjà présents : {skipped}")
    print(f"🚫 Exclus (Docker/K8s) : {excluded}")
    print(f"="*50)
    
    if added > 0:
        print(f"\n💡 N'oublie pas de commit :")
        print(f"   git add notebooks/")
        print(f"   git commit -m 'Add Colab badges to notebooks'")
        print(f"   git push")

if __name__ == "__main__":
    main()
