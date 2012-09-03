gitgrepweb
==========

A simple web-based UI to simultaneously grep several git repos.

Beware--this is quite early, and currently uses an utterly insecure
Werkzeug debug server.  Even if it didn't, I'd assume that there's
an injection in there somewhere.  Don't expose on the internet,
and be careful exposing at all.
