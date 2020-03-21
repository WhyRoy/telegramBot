# telegramBot
跟着峰哥在学着做tg机器人，记录学期过程

### 2020年3月20日：

用法：

1. 首先在tg上注册一个机器人，并得到机器人的Api Token，存在一处，这里不详表。

2. 下载js文件

3. 打开Google script，网址：<https://script.google.com/home>

4. 把js代码复制进自己在Google script建立的APP脚本编辑器里

5. 代码里有一段要换成tg机器人的Token。

   ![photo_2020-03-21_08-46-14](C:\Users\74049\OneDrive\tg机器人\photo_2020-03-21_08-46-14.jpg)

6. 确定脚本可以工作（验证方法是部署一次，点最新代码）。

7. 接下来要把谷歌脚本和机器人连在一起，用subline或其他文本编辑器编辑下面的链接

8. <https://api.telegram.org/bot这里放机器人的token/setWebhook?url=这里放urlEncode过的谷歌的发布链接>

9. 链接里第一处就是机器人的Token，但是第二个不是部署时的那一个，要encode一下

10. 部署代码时可以看到一个链接，复制它，打开这个网址：<https://www.url-encode-decode.com/>   encode以后复制下来

11. 替换第八条里面的第二处，并将整个链接在浏览器打开。

12. finish

​	

