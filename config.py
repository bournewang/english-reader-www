import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    EXTENSION_URL = "https://chromewebstore.google.com/detail/english-reader/plipgafgeeplbfgpjednfhfbcjdeeejk"
    EMAIL = "service@englishreader.org"
    SCREENSHOTS = [
        {
            'filename': 'screenshot-reader.jpg',
            'alt': 'Reader Mode'
        },
        {
            'filename': 'history.jpg',
            'alt': 'Reading History'
        },
        {
            'filename': 'resource.jpg',
            'alt': 'Reading Resources'
        }
    ]    
