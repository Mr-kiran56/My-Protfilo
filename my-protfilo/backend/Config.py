from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database: str                    # postgresql
    database_user: str               # myprofileuser
    password: str                    # DB password
    host: str                        # localhost / RDS host
    database_port: int               # 5432
    db_name: str                     # myprofiledb 117.213.176.215

    secret_key: str
    algorithm: str
    expire_time: int

settings = Settings()
