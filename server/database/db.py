import mysql.connector
import configparser

config = configparser.ConfigParser()
config.read("config/mysql.ini")
CONFIG = config["mysql"]


class DB:
    def __init__(self):
        """Connect to database

        Raises:
            mysql.connector.Error: Failed to connect to database

        """
        self._cnx = mysql.connector.connect(
            pool_size=5,  # maximum -> pooling.CNX_POOL_MAXSIZE
            pool_name="web_app_db_pool",
            **CONFIG
        )
        self._cursor = self._cnx.cursor()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Close database connection

        Args:
            exc_type (type): Exception type
            exc_val (object): Exception value
            exc_tb (traceback): Exception traceback
        """
        self._cnx.rollback()
        self._cursor.close()
        self._cnx.close()

    def fetch_db(
        self, sql_cmd: str, params: dict = {None: None}, is_fetch_one: bool = True
    ) -> list:
        """Database query operation

        j      Args:
                    sql_cmd (str): SQL command
                    params (dict): Parameters
                    is_fetch_one (bool): Whether to fetch one or all (default: True)

                Returns:
                    list: Result
        """
        self._cursor.execute(sql_cmd, params)
        return (
            [self._cursor.fetchone()]
            if is_fetch_one is True
            else self._cursor.fetchall()
        )

    def crud(self, sql_cmd, params=None) -> int:
        """CRUD operation

        Args:
            sql_cmd (str): SQL command
            params (dict): Parameters

        Returns:
            int: Affected rows
        """
        self._cursor.execute(sql_cmd, params)
        affected_rows = self._cursor.rowcount
        self._cnx.commit()
        return affected_rows

    def fetch_db_response_column_name(
        self, sql_cmd: str, params: dict = {1: 1} or tuple, is_fetch_one: bool = True
    ) -> list[dict]:
        """Database query operation

        Args:
            sql_cmd (str): SQL command
            params (dict): Parameters
            is_fetch_one (bool): Whether to fetch one or all (default: True)

        Returns:
            list[dict]: Result
        """
        self._cursor.execute(sql_cmd, params)
        columns = self._cursor.description
        result = [
            {columns[index][0]: column for index, column in enumerate(value)}
            for value in self._cursor.fetchall()
        ]
        return result
