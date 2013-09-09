from object_models import BaseHandler
import os
import re

import webapp2
import jinja2
from google.appengine.api import users
from object_models import render_str

class game(BaseHandler):
    def get(self):
    	song = self.request.get('song')
    	back = self.request.get('back')
    	values = { 'song' : song , 'back' : back }
        self.response.write(render_str('animation.html', values))

