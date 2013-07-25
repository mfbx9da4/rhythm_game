"""
export PATH=$PATH:/home/david/Dropbox/Programming/Python/Miscellaneous/extensions/google_appengine
dev_appserver.py helloworld/
appcfg.py update helloworld/

"""

__website__ = 'http://rhythmludus.appspot.com/'


import os
import re

import webapp2
import jinja2

from udacity.blog.object_models import BaseHandler
from rhythmgame import game
from gamesetup import CreateChannel
from gamesetup import GameRequest
from song import RandomSong

class Home(BaseHandler):
      def get(self): 
            self.write('HOME')
    
config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
}

app = webapp2.WSGIApplication([('/', Home),
                               ('/game', game),
                               ('/randomsong', RandomSong)],
                               debug=True,
                               config=config)
