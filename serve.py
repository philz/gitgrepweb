#!/usr/bin/env python
from flask import Flask, request, url_for, redirect
import subprocess
import json

app = Flask(__name__)

def parse_repos():
  ret = []
  for repo in json.load(file("repos.json")):
    ret.append(tuple([repo["path"], repo["name"], repo["tree"]]))
  return ret

# git dir, name, tree tuples
REPOS = parse_repos()
GIT = 'git'
MAX_RESULTS_TOTAL = 10000
MAX_RESULTS_WITHIN_REPO = 100


@app.route("/")
def hello():
    return redirect(url_for('static', filename='index.html'))

@app.route("/q")
def query():
  q_json = request.args.get("q")
  q = json.loads(q_json)
  re = q.get('re')

  all_results = []
  exited_early = False
  for repo in REPOS:
    results = gitgrep(repo, re)
    all_results += results
    if len(all_results) >= MAX_RESULTS_TOTAL:
      exited_early = True
      break
  return json.dumps({
    'results': all_results
  })

def gitgrep(repo, regexp):
  """
  repo is a (path, refname); regexp is an expression
  """
  path, name, tree = repo
  argv = [GIT, 
    "--git-dir", path, 
    "grep", 
    "--null", 
    "--line-number", 
    "-e", regexp, tree]
  app.logger.info("Executing: %s", argv)
  sub = subprocess.Popen(
    argv,
    stdin=None, stdout=subprocess.PIPE, stderr=subprocess.PIPE, close_fds=True, shell=False)
  results = []
  for line in sub.stdout.xreadlines():
    if line.startswith("Binary file"):
      continue
    filename, lineno, data = line.split("\000")
    results.append([name, tree, filename, lineno, data])
    if len(results) > MAX_RESULTS_WITHIN_REPO:
      break
  sub.terminate()
  return results
  
if __name__ == "__main__":
    app.run(debug=True)
