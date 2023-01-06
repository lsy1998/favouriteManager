import json
import os
import socket
import traceback
from turtle import pd

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
                print(mark_name)
        pd.concat(df).to_csv("results.csv", encoding="gbk")

    def get_bookmarks(self):
        'update chrome data from chrome path'
        # parse bookmarks
        assert os.path.exists(os.path.join(self.chromePath,'Bookmarks')), "can't found ‘Bookmarks’ file,or path isn't a chrome browser cache path!"
        with open(os.path.join(self.chromePath, 'Bookmarks'), encoding='utf-8') as f:
            return json.loads(f.read())


def main():
    print('%s' % hostname)
    for kill_cmd, path in zip([EDGE_KILL], [EDGE_PATH]):
        if os.path.exists(path):
            # 获取收藏夹数据
            try:
                print('%s' % hostname)
                data=BookMark(path).get_bookmarks()
                # print(data['roots']['bookmark_bar'])
                for x in data['roots']['bookmark_bar']['children']:
                    print(x['name'])
                    print(x['date_added'])
                    print(x['id'])
                    for y in x['children']:
                        print(y)
                    print("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
            #     # 获取历史记录
            #     History(kill_cmd, path).get_history()
            #     History(kill_cmd, path).get_downloads()
            #     # 获取密码
            #     Password(kill_cmd, path).parse_password()
            except Exception as e:
                traceback.print_exc()


main()
