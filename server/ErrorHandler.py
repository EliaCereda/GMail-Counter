from google.appengine.dist import use_library
use_library("django", "1.2")

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util, template

import os, urllib

class ErrorHandler(webapp.RequestHandler):
	def get(self, type, message):
		values = {
			'type' : type,
			'message' : urllib.unquote(message),
		}
		path = os.path.join(os.path.dirname(__file__), 'templates/error.html')
		self.response.out.write(template.render(path, values))
		
def main():
	util.run_wsgi_app(webapp.WSGIApplication([
		('/error/(.*?)/(.*)', ErrorHandler),
		], debug=True))

if __name__ == '__main__':
	main()