#!/usr/bin/env bash
# Generate all images for industrialcontractorinsurance.com via HuggingFace FLUX.1-schnell
# Robust: retries up to 4 times, verifies each is a valid image >= 30KB
set -uo pipefail

OUT="/workspace/Websites/industrialcontractorinsurance.com/public/images"
mkdir -p "$OUT"

# gen <fname> <prompt> [steps] [width] [height]
gen() {
  local fname="$1"; shift
  local prompt="$1"; shift
  local steps="${1:-4}"; shift || true
  local w="${1:-1024}"; shift || true
  local h="${1:-1024}"; shift || true
  local dest="$OUT/$fname"
  local attempt=0
  while [ $attempt -lt 4 ]; do
    attempt=$((attempt+1))
    echo "[$fname] attempt $attempt (steps=$steps ${w}x${h})..."
    curl -s --max-time 200 \
      https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell \
      -H "Authorization: Bearer $HF_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$(jq -nc --arg p "$prompt" --argjson s "$steps" --argjson w "$w" --argjson h "$h" '{inputs:$p, parameters:{num_inference_steps:$s, width:$w, height:$h}}')" \
      -o "$dest"
    local ftype; ftype=$(file -b "$dest" 2>/dev/null)
    local sz; sz=$(stat -c%s "$dest" 2>/dev/null || echo 0)
    if echo "$ftype" | grep -qiE "image|jpeg|png" && [ "$sz" -ge 30000 ]; then
      echo "[$fname] OK ($sz bytes, $ftype)"
      return 0
    fi
    echo "[$fname] FAIL (size=$sz, type=$ftype)"
    if echo "$ftype" | grep -qi "text\|json"; then head -c 200 "$dest"; echo ""; fi
    sleep 4
  done
  echo "[$fname] GAVE UP after $attempt attempts"
  return 1
}

# === 12 images — INDUSTRIAL CONTRACTOR insurance ===

gen "hero.jpg" \
  "Photorealistic cinematic wide shot of a large industrial refinery or chemical plant at dusk: an industrial contractor crew in hard hats, safety vests, and flame-resistant gear working on steel piping and pressure vessels, dramatic industrial lighting, heavy machinery and smokestacks in background, professional industrial photography, no text, no watermark" 4

gen "coverage.jpg" \
  "Photorealistic elevated wide shot of an industrial contractor crew working inside a large petroleum refinery or chemical processing plant: steel scaffolding, pressure vessels, complex piping systems, workers in PPE, dramatic industrial atmosphere, professional photography, no text" 4

gen "about.jpg" \
  "Photorealistic authentic portrait of a confident industrial contractor manager in a hard hat and flame-resistant coveralls standing at an industrial facility with refinery equipment and steel structures in background, warm industrial lighting, genuine trustworthy expression, shallow depth of field, professional photography, no text" 4

gen "og-image.jpg" \
  "Photorealistic wide cinematic view of industrial contractors working at a large refinery or petrochemical plant: steel towers, pipe racks, heavy industrial equipment, workers in full PPE, dramatic industrial dawn light, professional commercial photography, no text, no watermark" 4 1216 640

gen "general-liability.jpg" \
  "Photorealistic photo of an industrial contractor crew performing maintenance work at a large industrial plant: workers in hard hats, safety vests, and PPE inspecting large steel pipes and industrial equipment, professional industrial photography, no text" 4

gen "workers-compensation.jpg" \
  "Photorealistic photo of industrial workers in full PPE — hard hats, flame-resistant suits, safety goggles — safely performing maintenance on heavy industrial equipment at a plant or refinery, teamwork visible, professional industrial photography, no text" 4

gen "industrial-gl.jpg" \
  "Photorealistic photo of industrial contractors performing hot work — welding with sparks — inside a large industrial facility with heavy steel structures and process equipment, safety equipment, controlled industrial environment, professional photography, no text" 4

gen "commercial-auto.jpg" \
  "Photorealistic photo of a fleet of heavy-duty industrial contractor trucks, crane transport vehicles, and service vans parked at an industrial job site with refinery equipment in background, professional commercial photography, no text" 4

gen "contractors-pollution.jpg" \
  "Photorealistic photo of industrial safety workers in full hazmat gear and respirators conducting a safe chemical handling operation at an industrial facility, professional industrial safety photography, no text" 4

gen "umbrella.jpg" \
  "Photorealistic photo of a professional insurance and risk management meeting between an industrial contractor executive and insurance advisors in a modern conference room, reviewing industrial project contract documents, business attire, clean corporate environment, professional photography, no text" 4

gen "tools-equipment.jpg" \
  "Photorealistic photo of specialized industrial contractor tools and equipment: wrenches, rigging hardware, specialized mechanical tools, and testing equipment arranged on a clean industrial work surface, professional product photography, no text" 4

gen "bonds.jpg" \
  "Photorealistic photo of a professional industrial contractor signing official performance bond documents on a desk in a business office, official surety contract paperwork, professional business attire, clean corporate environment, commercial photography, no text" 4

echo "=== ALL IMAGE GENERATION ATTEMPTS COMPLETE ==="
ls -la "$OUT"
