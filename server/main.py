#!/usr/bin/env python
from google.appengine.dist import use_library
use_library("django", "1.2")

import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

class MainHandler(webapp.RequestHandler):
	def get(self):
		path = os.path.join(os.path.dirname(__file__), 'templates/main.html')
		self.response.out.write(template.render(path, {}))

def main():
	run_wsgi_app(webapp.WSGIApplication([
		('.*', MainHandler),
		], debug=True))

if __name__ == '__main__':
	main()