next time we merge git repos, let us document the steps here

---------------------------- convert hg repo to git ----------------------------

http://hivelogic.com/articles/converting-from-mercurial-to-git/

--------------------------- my .git folder is too big --------------------------

git gc --prune=now --aggressive

------------------------------ split out subfolder -----------------------------

D() { [ -d "$1" ] || mkdir -p "$1"; echo "$1"; }

big_repo=~/ali/github/scratch
subfolder=ζ₀
new_repo=~/ali/github/lang-zeta-zero

cd "$big_repo"
git subtree split -P "$subfolder" -b "$subfolder-only"

cd $(D "$new_repo")
git init
git pull "$big_repo" "$subfolder-only"

cd "$big_repo"
# git rm -rf "$subfolder-only"
git filter-branch --index-filter "git rm -q -r -f --cached --ignore-unmatch ABC" --prune-empty HEAD

rm -rf .git/refs/original/ &&
git reflog expire --all &&
git gc --aggressive --prune=now
git reflog expire --all --expire-unreachable=0
git repack -A -d
git prune
