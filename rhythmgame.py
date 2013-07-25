from object_models import BaseHandler
import os
import re

import webapp2
import jinja2
from google.appengine.api import users

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])

class game(BaseHandler):
    def get(self):
    	song = self.request.get('song')
    	back = self.request.get('back')
    	values = { 'song' : song , 'back' : back }
    	template = JINJA_ENVIRONMENT.get_template('templates/animation.html')
        self.response.write(template.render(values))

class randomGame(BaseHandler):
    def get(self):
        song = self.request.get('song')
        back = self.request.get('back')
        values = { 'song' : song , 'back' : back }
        
        template = JINJA_ENVIRONMENT.get_template('templates/animation.html')
        self.response.write(template.render(values))
