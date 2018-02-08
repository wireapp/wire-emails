git checkout master \
&& yarn build \
&& ( \
  git add . \
  && git commit -m 'Otto build' \
  && npm version patch -m "Otto release %s"\
  && git push git@github.com:wireapp/wire-emails.git master \
  && git push git@github.com:wireapp/wire-emails.git --tags \
  || true \
)
