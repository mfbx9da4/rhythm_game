from object_models import BaseHandler
import os
import re

import webapp2
import jinja2
from google.appengine.api import users

class game(BaseHandler):
    def get(self):
    	song = self.request.get('song')
    	back = self.request.get('back')
    	values = { 'song' : song , 'back' : back }
        self.response.write(self.render_template_arg('animation.html', values))

