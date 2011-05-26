from google.appengine.dist import use_library
use_library("django", "1.2")

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util, template

from google.appengine.runtime.apiproxy_errors import CapabilityDisabledError, OverQuotaError
import os, urllib, re

class UploadHandler(webapp.RequestHandler):
	def post(self):
		try:
			body = self.request.body;
			
			filename = re.search(r".*filename=\"(.*)\.(.*)\"", body)
			mime = re.search(".*Content-Type: (.*)/(.*)\\r\\n", body)
			
			if(filename != None and mime != None):
				filename = filename.groups()[0]
				
				mimetype = mime.groups()[0] +"/"+ mime.groups()[1]
				mime = mime.groups()[0]
				
				blob = self.request.get("file")
				if (mime == "audio"):
					if(len(blob) < 512000):
						blob64 = blob.encode('base64')
						blob64 = blob64.replace('\n', '')
						
						values = {
							'name' : filename,
							'mimetype': mimetype,
							'data' : blob64
						}
						
						path = os.path.join(os.path.dirname(__file__), 'templates/serve.html')
						self.response.out.write(template.render(path, values))
					else:
						self.redirect('/error/badRequest/Max file size is 512KB.')
				else:
					self.redirect('/error/badRequest/The file you uploaded is not an audio file.')
			else:
				self.redirect('/error/badRequest/Please upload a file.')
			
		except OverQuotaError, e:
			self.redirect('/error/overQuota/The server is busy. Try again tomorrow.')
		#except Exception, e:
		#	self.redirect('/error/unknown/Unknown error.')
	
	def get(self):
		self.redirect('/error/badRequest/Access denied.')
	
def main():
	util.run_wsgi_app(webapp.WSGIApplication([

		('.*', UploadHandler),
		], debug=True))

if __name__ == '__main__':
	main()