from object_models import BaseHandler
import os
import re

import webapp2
import jinja2
from google.appengine.api import users
from database.song import Song

class game(BaseHandler):
    def get(self):
        song = self.request.get('song')
        back = self.request.get('back')
        if song:
            context = { 'song' : song , 'back' : back }
            self.response.write(self.render_template_arg('animation.html', context))
        else:
            context = {'titles' : [song.title for song in Song.all()]}
            self.response.write(self.render_template_arg('select_a_song.html', context))


