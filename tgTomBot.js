// 真是对不起呀， 发布代码的时候我把doGet 给删除了，导致和视频里不一样， 现在加回去。。。
function doGet(e){
    return HtmlService.createHtmlOutput("Hello World!! No, this link should be hidden!!!");
}


function doPost(e){
    var dataFromTelegram = {
        "method": "post",
        "payload": e.postData.contents
    };
    var body = JSON.parse(e.postData.contents);
    var payload = preparePayload(body);

    postTelegram(payload);

    var dataToTelegram = {
        "method": "post",
        "payload": payload
    };


}
function postTelegram(payload) {    //出来做成了函数，
    var data = {
        "method": "post",
        "contentType":'application/json',
        "payload": JSON.stringify(payload)
    };

    UrlFetchApp.fetch("https://api.telegram.org/bot902868194:AAGm8NzaoB8EPKP8wNsRdGK-meHH2nPbV4o/", data);
}

//获取名字，不管有没有last name，总返回正确值
function getName(user) {
    var name = user.first_name;
    if (user.last_name) {
        var nameArray = user.last_name.split('');
        for (var i = 0, len = nameArray.length; i <len ; i++) {
            if (nameArray[i] >= 0x4E00 && nameArray[i] <= 0x29FA5){//lastname中是否有中文
                return user.last_name+user.first_name;
            }
        }
        name += " " + user.last_name;
    }
    return name;
}
function getMentionName(user) {
    var mentionName = '';

    var userName = getName(user);
    if (!userName) {
        userName = '无名氏';
    }

    mentionName = getMarkDownUserUrl(userName, user.id);

    return mentionName;
}
function getMarkDownUserUrl(userName, userId) {
    //return "["+userName+"](tg://user:id)=" + userId +")";
    //var name1 = "<a href='tg://user?id=userId'>+userName+</a>";
    //return  name1;
    return "<a href="+"'tg://user?id="+userId+"'>"+userName+"</a>";
}
/*function escapeMarkDown(toEscapeMsg) {//去除名字里的*或者下划线等Markdown语法
    var escapedMsg = toEscapeMsg
        .replace(/_/g,"\\_")
        .replace(/\*!/g,"\\*")
        .replace(/\[/g,"\\[")
        .replace(/`/g,"\\`");
    return escapedMsg;
}*/
function preparePayload(body){
    var payload;

    if (body.message) {
        body.message.chat.id = body.message.chat.id + '';       //如果有“发送的”（不是callback的）消息，就取出id，变为字符串
        
        
        if (body.message.new_chat_member) {//这是进群代码
            //这是机器人要发送的东西
            payload = {
                "method" : "sendMessage",
                "chat_id" : body.message.chat.id,
                "text" : "你好，欢迎进群，互联网非法外之地，言辞有度",
                "parse_mode" : "HTML",
                "disable_web_page_preview": true
            };

            //最好还能加入进群那个人的名字
            payload.text =" 互联网非法外之地，言辞需有度\n"+ "你好，" + getMentionName(body.message.new_chat_member);//去OneNote可以看到每个人入群的代码，里面可以找到名字

            return payload
        }

        if (body.message.left_chat_member) {//这是退群代码，差别就是left与new
            //这是机器人要发送的东西
            payload = {
                "method" : "sendMessage",
                "chat_id" : body.message.chat.id,
                "text" : "你好，欢迎进群，互联网非法外之地，言辞有度",
                "parse_mode" : "HTML",
                "disable_web_page_preview": true
            };

            //最好还能加入进群那个人的名字
            payload.text =" 很遗憾"+ getMentionName(body.message.left_chat_member) + "退出了本群";

            return payload
        }

        if (body.message.pinned_message) {

            payload = {
                "method" : "sendMessage",
                "chat_id" : body.message.chat.id,
                "text" : "你好，欢迎进群，互联网非法外之地，言辞有度",
                "parse_mode" : "HTML",
                "disable_web_page_preview": true
            };


            var whoPinned = getName(body.message.from);//把置顶消息的那个人定义一下
            var whoOwned = getName(body.message.pinned_message.from);//把谁发的消息置顶了

            payload.text = "<b>"+ whoPinned +"</b>"+ "置顶了"+ "<b>"+ whoOwned +"</b>" + "一则消息：\n"+body.message.pinned_message.text
                + "\n \n"
                +"请注意查收";
            return payload;
        }
        if (body.message.text){
            body.message.text = body.message.text.toLowerCase();
            body.message.text = body.message.text.replace(/@fileTans_bot/g);

            var paras = body.message.text.trim().split(' ');
            //移除多余空格
            paras = paras.filter(function (para) {
                if (para){
                    return true;
                }
            });
            payload = {
                "method": "sendMessage",
                "chat_id": body.message.chat.id,
                "text": "说的啥？",
                "parse_mode":"HTML"//这样就告诉tg，这个text是个HTML的文本
                //"disable_web_page_preview": true    //不显示预览
            };





            if(body.message.text.indexOf('/help') === 0) {



                //回复类型的键盘
                var  replyKeyboardMarkup1 = {};
                replyKeyboardMarkup1.keyboard = [];
                replyKeyboardMarkup1.resize_keyboard = false;
                replyKeyboardMarkup1.one_time_keyboard = true;
                replyKeyboardMarkup1.selective = true;

                //删除按钮，这里采用二级菜单的形式
                if (paras[1]){
                    if ('remove'.indexOf(paras[1]) >= 0) {
                        var replyKeyboardRemove ={
                            remove_keyboard : true,
                            selective : false
                        };
                        payload.reply_markup = replyKeyboardRemove;
                        payload.text = "已删除按钮";
                    }
                    return payload;
                }
                else {
                    var mentionName = getMentionName(body.message.from);
                    payload.text = "您好　" + mentionName+"！";
                    payload.text += '你好欢迎使用本机器人，本机器人现在可以说这句话，你也可以试试“/color”\n';
                    payload.text += '若要移除按钮，可以在/help后空格输入remove';
                    var command9 =[
                        "/colors",
                        "/list"
                    ];


                    var count = 0;
                    for (var i = 0; i < command9.length / 3; i++) {
                        var keyboardRow =[];
                        for (var j = 0; j < 3; j++) {
                            var keyboardButton ={
                                text: command9[i*3+j]
                            };
                            count++;
                            keyboardRow.push(keyboardButton);
                            if (count >= command9.length) {
                                break;
                            }
                        }
                        replyKeyboardMarkup1.keyboard.push(keyboardRow);
                    }
                    payload.reply_markup = replyKeyboardMarkup1;
                }



                return payload;
            }

            if(body.message.text.indexOf('/color') === 0){
                payload.text="欢迎尝试color，其实并没有什么卵用\n 我认识的颜色有：\n红\n黄\n蓝";
                return payload;
            }
            if(body.message.text.indexOf('/list') === 0){
                //定义按钮
                var inlineKeyboardMarkup = {};
                inlineKeyboardMarkup.inline_keyboard = [];
                //inlineKeyboardMarkup.resize_keyboard = [];
                //inlineKeyboardMarkup.one_time_keyboard =true;
                var  keyboardRow = [];
                var keyboardButton = [];
                /* for (var i = 0; i < 3; i++) {
                     keyboardButton[i] = {
                         text:'按钮'+(i+1),
                         url:'http://www.google.com'
                     };
                     keyboardRow.push(keyboardButton[i]);
                 }*/
                if (paras[1]) {
                    switch (paras[1].toLowerCase()) {
                        case "people":
                            if (paras[2]) {
                                //if (paras[2]=== 'Roy这名咋又不行'.toLowerCase()) {//这样要输入的太多了，使用体验极差，换种方式，有关键字就行
                                if ('Roy这名咋又不行'.toLowerCase().indexOf(paras[2]) >= 0) {
                                    //payload.text = "Roy这名咋又不行 - https://space.bilibili.com/35906765/video";
                                    payload.text = "Roy这名咋又不行";
                                    keyboardButton[0] = {
                                        text:'Roy这名咋又不行',
                                        url:'https://space.bilibili.com/35906765/video'
                                    };
                                    keyboardRow.push(keyboardButton[0]);
                                }
                                if ('8k8k'.toLowerCase().indexOf(paras[2]) >= 0) {
                                    //payload.text = "8k8k - https://space.bilibili.com/4345670?from=search&seid=17766778979352595086";
                                    payload.text = "8k8k";
                                    keyboardButton[0] = {
                                        text:'8k8k',
                                        url:'https://space.bilibili.com/4345670?from=search&seid=17766778979352595086'
                                    };
                                    keyboardRow.push(keyboardButton[0]);

                                }
                                if ('YuFeng Deng'.toLowerCase().indexOf(paras[2])>=0) {
                                    //payload.text = "YuFeng Deng - https://www.youtube.com/channel/UCG6xoef2xU86hnrCsS5m5Cw?view_as=subscriber";
                                    payload.text = "YuFeng Deng";
                                    keyboardButton[0] = {
                                        text:'YuFeng Deng',
                                        url:'https://www.youtube.com/channel/UCG6xoef2xU86hnrCsS5m5Cw?view_as=subscriber'
                                    };
                                    keyboardRow.push(keyboardButton[0]);
                                }

                                inlineKeyboardMarkup.inline_keyboard.push(keyboardRow);
                                payload.reply_markup = inlineKeyboardMarkup;
                                //return payload;
                            }
                            else{
                                payload.text = "我喜欢的自媒体有：Roy这名咋又不行、YuFeng Deng、8k8k\n其中最喜欢YuFeng Deng - https://www.youtube.com/channel/UCG6xoef2xU86hnrCsS5m5Cw?view_as=subscriber";
                                keyboardButton[0] = {
                                    text:'Roy这名咋又不行',
                                    url:'https://space.bilibili.com/35906765/video'
                                };
                                keyboardButton[1] = {
                                    text:'8k8k',
                                    url:'https://space.bilibili.com/4345670?from=search&seid=17766778979352595086'
                                };
                                keyboardButton[2] = {
                                    text:'YuFeng Deng',
                                    url:'https://www.youtube.com/channel/UCG6xoef2xU86hnrCsS5m5Cw?view_as=subscriber'
                                };
                                keyboardRow.push(keyboardButton[0]);
                                keyboardRow.push(keyboardButton[1]);
                                keyboardRow.push(keyboardButton[2]);

                                inlineKeyboardMarkup.inline_keyboard.push(keyboardRow);
                                payload.reply_markup = inlineKeyboardMarkup;
                            }
                            break;

                        case "color":
                            payload.text = "颜色有：\n红\n黄\n蓝\n";
                            break;

                        default:
                            payload.text = "在/list之后空格一下，输入people或者color，其他不支持，其中people还可继续空格，继续输入列表";

                            break;
                        //payload.text="Roy这名咋又不行\nYuFeng Deng\n8k8k\n";
                        //return payload;
                        /*case "roy这名咋又不行":
                            payload.text = "Roy这名咋又不行 - https://space.bilibili.com/35906765/video";
                            break;
    
                        case "8k8k":
                            payload.text = "8k8k - https://space.bilibili.com/4345670?from=search&seid=17766778979352595086";
                            break;
    
                        default:
                            payload.text = "YuFeng Deng - https://www.youtube.com/channel/UCG6xoef2xU86hnrCsS5m5Cw?view_as=subscriber";
                            break;*/
                    }
                    //payload.text = '你的命令带参数：' + paras[1];
                    //return payload;
                }
                else {
                        payload.text="<b>people</b>\n<b>color</b>\n<i>在/list之后空格一下，输入people或者color</i>" + "还可以关注roy的b站：<a href='https://space.bilibili.com/35906765/video/'>Roy这名咋又不行</a>";

                        keyboardButton[0] = {
                            text:'help',
                            //url:'https://space.bilibili.com/35906765/video'
                            //不用url了，url只是个链接，这次我用callback_data来召回help和color
                            callback_data:"/help"
                        };
                        keyboardButton[1] = {
                            text:'升级原消息',
                            //url:'https://space.bilibili.com/35906765/video'
                            //不用url了，url只是个链接，这次我用callback_data来召回help和color
                            callback_data:"update"
                        };
                        keyboardRow.push(keyboardButton[0]);
                        keyboardRow.push(keyboardButton[1]);
                        inlineKeyboardMarkup.inline_keyboard.push(keyboardRow);
                        payload.reply_markup = inlineKeyboardMarkup;

                        /*var keyboardButton[1] = {
                            text:'按钮1',
                            url:'http://www.google.com'
                        };
                        var keyboardButton2 = {
                            text:'按钮2',
                            url:'http://www.google.com'
                        };*/
                        /*for (var i = 0; i < 3; i++) {
                            keyboardRow.push(keyboardButton[i]);
                        }*/
                        //keyboardRow.push(keyboardButton1);
                        //keyboardRow.push(keyboardButton2);




                        // return payload;
                }
                return payload;
            }

            payload = {
                "method": "sendMessage",
                "chat_id": body.message.chat.id,
                "text": body.message.text
            }

        }
        else if (body.message.sticker){
            payload = {
                "method": "sendSticker",
                "chat_id": body.message.chat.id,
                "sticker": body.message.sticker.file_id
            }
        }
        else if (body.message.photo){
            array = body.message.photo;
            text = array[1];
            payload = {
                "method": "sendPhoto",
                "chat_id": body.message.chat.id,
                "photo": text.file_id
            }
        }
        else {
            payload = {
                "method": "sendMessage",
                "chat_id": body.message.chat.id,
                "text": "Try other stuff"
            }
        }
        return payload
    }
    if (body.callback_query){

        if ("/help".indexOf(body.callback_query.data>=0)){
            payload = {
                "method": "sendMessage",
                "chat_id": body.callback_query.message.chat.id,
                "text": "这是一个callback\n",
                "parse_mode":"HTML"//这样就告诉tg，这个text是个HTML的文本
                //"disable_web_page_preview": true    //不显示预览
            };
            payload.text = body.callback_query.data;
        }
        if ("update".indexOf(body.callback_query.data)>=0){

            payload = {
                "method": "editMessageText",
                "chat_id": body.callback_query.message.chat.id,
                "message_id": body.callback_query.message.message_id,
                "text": "",
                //"parse_mode": "markdown",
                "parse_mode":"HTML",
                "disable_web_page_preview": false
            };
            payload.text += "原消息被更新了,更新成了这句话";
            //payload.text += "\ncolor没有任何作用，只是为了演示我自己加的";
            return payload;
        }

        return payload;
    }
    
}