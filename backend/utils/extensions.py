
# extensions.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from utils.config import Config

# If you plan to use async with SQLite, use the aiosqlite dialect:
DATABASE_URL = Config.SQLALCHEMY_DATABASE_URI.replace(
    "sqlite:///", "sqlite+aiosqlite:///"
)

engine = create_async_engine(DATABASE_URL, future=True)
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)