from dotenv import load_dotenv
load_dotenv()
import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///' + os.path.join(basedir, 'ecommerce.db'))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    JWT_TOKEN_LOCATION  = ['headers', 'cookies']
    JWT_ACCESS_COOKIE_NAME = 'access_token'
    SMTP_HOST        = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT        = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER        = os.getenv("SMTP_USER", "")
    SMTP_PASS        = os.getenv("SMTP_PASS", "")

    # Savings threshold (numeric)
    SAVINGS_THRESHOLD = float(os.getenv("SAVINGS_THRESHOLD", 5000.0))

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False