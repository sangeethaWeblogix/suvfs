#!/usr/bin/env bash
# Vercel "Ignored Build Step" for the car sites.
# Every site's Vercel project builds from this repo; this decides per project
# whether a push needs a new build. Exit 0 = skip the build, exit 1 = build.
#
# Set in each project: Settings → Git → Ignored Build Step →
#   bash scripts/vercel-ignore.sh
#
# Rules, in order:
#   1. Commit message has "[sites: suv,utes]" → build only those sites.
#      "[sites: all]" builds everything.
#   2. No tag → skip only when every changed file is another site's own
#      asset (public/sites/<other-key>/...). Anything shared builds all sites.
#   3. When in doubt (no previous deploy, git error) → build.

KEY="${NEXT_PUBLIC_SITE_KEY:-suv}" # SUV's project has no key; code defaults to suv
MSG="${VERCEL_GIT_COMMIT_MESSAGE:-}"

build() { echo "▶ Building $KEY: $1"; exit 1; }
skip()  { echo "■ Skipping $KEY: $1"; exit 0; }

# 1. Explicit site list in the commit message.
TAG=$(printf '%s' "$MSG" | grep -oiE '\[sites?:[^]]*\]' | head -n1)
if [ -n "$TAG" ]; then
  LIST=$(printf '%s' "$TAG" | sed -E 's/^\[[^:]*:(.*)\]$/\1/' | tr 'A-Z' 'a-z' | tr ',' ' ')
  for s in $LIST; do
    if [ "$s" = "all" ] || [ "$s" = "$KEY" ]; then build "listed in $TAG"; fi
  done
  skip "not listed in $TAG"
fi

# 2. Changed files since this project's last successful deploy.
PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"
CUR="${VERCEL_GIT_COMMIT_SHA:-HEAD}"
[ -z "$PREV" ] && build "no previous deployment to compare against"

# Vercel clones shallowly; fetch the previous commit if it isn't present.
git cat-file -e "$PREV^{commit}" 2>/dev/null \
  || git fetch --quiet --depth=1 origin "$PREV" 2>/dev/null \
  || build "could not fetch previous commit $PREV"

CHANGED=$(git diff --name-only "$PREV" "$CUR" 2>/dev/null) || build "git diff failed"
[ -z "$CHANGED" ] && build "no file changes (manual redeploy)"

while IFS= read -r f; do
  case "$f" in
    public/sites/"$KEY"/*) build "own asset changed: $f" ;;
    public/sites/*/*) ;; # another site's asset — doesn't affect this site
    *) build "shared file changed: $f" ;;
  esac
done <<< "$CHANGED"

skip "only other sites' assets changed"
