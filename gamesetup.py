from google.appengine.api import users
from google.appengine.api import channel
from udacity.blog.object_models import BaseHandler
import os
import re

import webapp2
import jinja2
from google.appengine.api import users

import datetime

class CreateChannel(BaseHandler):
      def get(self): 
            self.write('HOME')

class GameRequest(BaseHandler):
      def get(self): 
            self.write('HOME')