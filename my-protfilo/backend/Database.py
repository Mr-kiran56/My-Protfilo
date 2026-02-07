from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus
from Config import settings

password = quote_plus(settings.password)

POSTGRESQL_DATABASE = (
    f"{settings.database}://"
    f"{settings.database_user}:{password}"
    f"@{settings.host}:{settings.database_port}"
    f"/{settings.db_name}"
)

engine = create_engine(POSTGRESQL_DATABASE, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
