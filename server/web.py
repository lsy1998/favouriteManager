from flask import Flask
from flask import jsonify
import cx_Oracle

app = Flask(__name__)


@app.route('/getFavouriteData')
def hello_world():
    create_conn_pool()
    connection = POOL.acquire()
    cursor = connection.cursor()
    cursor.execute('select * from FM_MASTER_DATA')
    columns = [col[0] for col in cursor.description]
    cursor.rowfactory = lambda *args: dict(zip(columns, args))

    data = {'data': cursor.fetchall()}
    # 将连接放回连接池
    POOL.release(connection)
    # 关闭连接池
    POOL.close()

    return jsonify(data)


def create_conn_pool():
    global POOL
    POOL = cx_Oracle.SessionPool("LSY", "123456", "localhost:1521/favourite", min=2, max=5, increment=1,
                                 encoding="UTF-8")


@app.route('/getFavouriteData1')
def get_favourite_data():
    connection = POOL.acquire()
    cursor = connection.cursor()
    cursor.execute('select * from FM_MASTER_DATA')
    columns = [col[0] for col in cursor.description]
    cursor.rowfactory = lambda *args: dict(zip(columns, args))
    print(cursor.fetchall())
    # 将连接放回连接池
    POOL.release(connection)
    # 关闭连接池
    POOL.close()


if __name__ == '__main__':
    create_conn_pool()
    app.run()
