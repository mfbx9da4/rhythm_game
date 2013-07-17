import os
import re

import webapp2
import jinja2
from udacity.blog.object_models import BaseHandler

class RandomSong(BaseHandler):
      def get(self): 
            self.write('HOME')