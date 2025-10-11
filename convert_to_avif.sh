#!/bin/bash

# Script para converter todas as imagens para AVIF

# Converter imagens na pasta img
for img in public/img/*.png public/img/*.jpg public/img/*.jpeg; do
  if [ -f "$img" ]; then
    filename=$(basename "$img" | cut -d. -f1)
    echo "Convertendo $img para AVIF..."
    convert "$img" "public/img_avif/${filename}.avif"
  fi
done

# Converter imagens na pasta img/menu_overlay
for img in public/img/menu_overlay/*.png public/img/menu_overlay/*.jpg public/img/menu_overlay/*.jpeg; do
  if [ -f "$img" ]; then
    filename=$(basename "$img" | cut -d. -f1)
    echo "Convertendo $img para AVIF..."
    convert "$img" "public/img_avif/menu_overlay/${filename}.avif"
  fi
done

# Converter imagens na pasta images/branding
for img in public/images/branding/*.png public/images/branding/*.jpg public/images/branding/*.jpeg; do
  if [ -f "$img" ]; then
    filename=$(basename "$img" | cut -d. -f1)
    echo "Convertendo $img para AVIF..."
    convert "$img" "public/img_avif/${filename}.avif"
  fi
done

echo "Conversão concluída!"