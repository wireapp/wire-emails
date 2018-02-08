git checkout master \
&& yarn build \
&& ( \
  git add . \
  && git commit -m 'Auto build' \
  && npm version patch -m "Auto release %s"\
  && git push git@github.com:wireapp/wire-emails.git master \
  && git push git@github.com:wireapp/wire-emails.git --tags \
  || true \
)
