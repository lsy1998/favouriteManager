import json
import os
import socket
import time
import traceback
from turtle import pd
import cx_Oracle

# chrome data path
hostname = "lsy"
CHROME_PATH = f"C:/Users/{hostname}/AppData/Local/Google/Chrome/User Data/Default"
EDGE_PATH = f"C:/Users/{hostname}/AppData/Local/Microsoft/Edge/User Data/Default"
EDGE_KILL = "taskkill /f /t /im msedge.exe"
CHROME_KILL = "taskkill /f /t /im chrome.exe"


class BookMark:

  def __init__(self, chromePath=CHROME_PATH):
    # chromepath
    self.chromePath = chromePath
    # refresh bookmarks
    self.bookmarks = self.get_bookmarks()

  def get_folder_data(self):
    """获取收藏夹所有的文件夹内容，合并后保存"""
    df = []
    for mark_name, item in self.bookmarks["roots"].items():
      try:
        data = pd.DataFrame(item["children"])
        data["folder_name"] = item["name"]
        df.append(data)
      except Exception:
        traceback.print_exc()
        # print(mark_name)
    pd.concat(df).to_csv("results.csv", encoding="gbk")

  def get_bookmarks(self):
    'update chrome data from chrome path'
    # parse bookmarks
    assert os.path.exists(os.path.join(self.chromePath,
                                       'Bookmarks')), "can't found ‘Bookmarks’ file,or path isn't a chrome browser cache path!"
    with open(os.path.join(self.chromePath, 'Bookmarks'), encoding='utf-8') as f:
      return json.loads(f.read())


# def connect_db():
#     connection = POOL.acquire()
#     cursor = connection.cursor()
#     cursor.execute('select column1,column2 from test')
#     columns = [col[0] for col in cursor.description]
#     print(columns)
#     cursor.rowfactory = lambda *args: dict(zip(columns, args))
#     print(cursor.fetchall())
#
#     # 将连接放回连接池
#     POOL.release(connection)
#     # 关闭连接池
#     POOL.close()


def insert_favourite_data():
  connection = POOL.acquire()
  cursor = connection.cursor()
  data = get_favourite_data()

  for link in data:
    sql = "INSERT INTO FM_MASTER_DATA (FOLDER_NAME, FOLDER_ID, FOLDER_ADD_DATE,FOLDER_MODIFIED_DATE, LINK_NAME, LINK_URL, LINK_ID, LINK_ADD_DATE, LINK_MODIFIED_DATE, PARENT_FOLDER_ID)VALUES( '"
    sql += link['folderName'].replace("'", "''")
    sql += "',  "
    sql += link['folderId']
    sql += ", TO_DATE( '"
    sql += link['folderAddDate']
    sql += "','YYYY-MM-DD HH24:MI:SS'),TO_DATE('"
    sql += link['folderModifiedDate']
    sql += "','YYYY-MM-DD HH24:MI:SS'), '"
    sql += link['linkName'].replace("'", "''")
    sql += "', '"
    sql += link['linkUrl']
    sql += "',  "
    sql += link['linkId']
    sql += ",TO_DATE('"
    sql += link['linkAddDate']
    sql += "','YYYY-MM-DD HH24:MI:SS'), TO_DATE('"
    sql += link['linkAddDate']
    sql += "','YYYY-MM-DD HH24:MI:SS'),"
    sql += link['parentFolderId']
    sql += ")"
    print(link)
    if link['linkId'] == '323':
      print(link)
    cursor.execute(sql)
  # sql = "INSERT INTO FM_MASTER_DATA (FOLDER_NAME, FOLDER_ID, FOLDER_ADD_DATE,
  #                FOLDER_MODIFIED_DATE, LINK_NAME, LINK_URL, LINK_ID, LINK_ADD_DATE, LINK_MODIFIED_DATE, PARENT_FOLDER_ID)
  #                    VALUES(:folderName, :folderId, sysdate,sysdate, :linkName, :linkUrl, :linkId, sysdate, sysdate, :folderId)"
  # print(link)

  connection.commit()
  POOL.release(connection)
  POOL.close()


def create_conn_pool():
  global POOL
  POOL = cx_Oracle.SessionPool("LSY", "123456",
                               "localhost:1521/favourite", min=2, max=5, increment=1, encoding="UTF-8")


def get_favourite_data():
  favourite1 = []
  for kill_cmd, path in zip([EDGE_KILL], [EDGE_PATH]):
    if os.path.exists(path):
      # 获取收藏夹数据
      try:
        data = BookMark(path).get_bookmarks()
        favourite1 += get_link(data['roots']['bookmark_bar']['children'], '')
      except Exception as e:
        traceback.print_exc()
  return favourite1


def get_link(data, parent_folder_id):
  favourite = []
  if len(data) > 0:
    for x in data:
      link = {}
      link['folderName'] = x['name']
      link['folderId'] = x['id']
      link['parentFolderId'] = parent_folder_id
      # 11644473600 = abs((datetime.datetime(1601, 1, 1)-datetime.datetime(1970, 1, 1)).total_seconds())
      link['folderAddDate'] = time.strftime('%Y-%m-%d %H:%M:%S',
                                            time.localtime(int(x['date_added']) / 1000000 - 11644473600))
      link['folderModifiedDate'] = time.strftime('%Y-%m-%d %H:%M:%S',
                                                 time.localtime(int(x['date_modified']) / 1000000 - 11644473600))

      if parent_folder_id == '':
        link['parentFolderId'] = '0'
      else:
        link['parentFolderId'] = parent_folder_id

      for y in x['children']:
        if y['type'] == 'folder':
          if x['id'] == '45':
            print(x['id'])
          favourite += get_link([y], x['id'])
        else:
          link['linkName'] = y['name']
          link['linkAddDate'] = time.strftime('%Y-%m-%d %H:%M:%S',
                                              time.localtime(int(y['date_added']) / 1000000 - 11644473600))
          link['linkModifiedDate'] = ''
          link['linkId'] = y['id']
          link['linkUrl'] = y['url']
          favourite.append(link.copy())

  return favourite


create_conn_pool()
get_favourite_data()
insert_favourite_data()
