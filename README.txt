gitgrepweb
==========

A simple web-based UI to simultaneously grep several git repos.

Beware--this is quite early, and currently uses an utterly insecure
Werkzeug debug server.  Even if it didn't, I'd assume that there's
an injection in there somewhere.  Don't expose on the internet,
and be careful exposing at all.

Installing
==========
gitgrepweb depends on 'flask' (and transitively several other things) as well
as 'gunicorn' (or another WSGI container).  To install into a virtual
env, use "make_virtualenv.sh".  To run,

  # Debug mode
  env/bin/python serve.py

  # gunicorn mode
  env/bin/gunicorn -w 4 -b 0.0.0.0:4000 serve:app

Before running, you'll need to create a repos.json file, following
the example.
