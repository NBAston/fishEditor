#### 捕鱼编辑器 使用说明

* 第一步：前置工作

  * 准备资源工作

  * 安装 TexturePacker 3.x（推荐项目data下面的）图集工具

  * 创建项目文件夹(方便编辑器选择使用) 例如：在桌面建立 fishLine 文件夹

  * 在桌面创建临时文件夹tmpFish 拷贝鱼图进入，依顺序重命名为 fish*_move1.png、fish*_move2.png ... 以此类推

    注意：为确保可以运行，需要严格遵守该命名规则，暂不支持其他格式的命名，例如:fish_move01.png ...

  * 通过图集软件制作好图集并且导出到 刚刚创建的 fishLine 文件夹  fish1.plist  fish1.png

* 第二步:  操作

  * 打开捕鱼编辑器 左上角菜单 ： 文件 >  选择鱼图资源文件夹 > 选择桌面的 fishLine 文件夹

  * 依次点击左边 鱼 编辑  信息 ，编辑完成 导出所有鱼数据Json ，名字为:fishResConfig.json

     注意：下次再次进入编辑器 只需  文件 >  选择鱼图资源文件夹 > 选择桌面的 fishLine 文件夹 > 导入鱼资源数据Json > 选择 fishResConfig.json 

  * 左上角菜单 ： 文件 >新建鱼组>填写相关信息 确定 > 资源列表选择某鱼 鼠标右键 > 创建鱼 > 填写参数 > 确定

    ​     PS:快捷键 F5 设置帮助界面，更多辅助功能通过F5 了解

  * 导出: 文件 > 鱼线导出 

    * 项目格式 为完整格式，以便下次进行增删查改操作，设计理念:类似ps软件的PSD源文件
    * 客户端格式 为仅需要客户端使用即可 会去除部分臃肿字段主要目的为降低包大小
    * 服务端格式 同上
    * 个性化 则为 修改键值，是否导出该键值对，高度定制需求

* 第三步:   二次编辑

  * 如果需要二次编辑数据则， 需要
    *  文件 >  选择鱼图资源文件夹 > 选择桌面的 fishLine 文件夹 
    * 文件 > 鱼线导入编辑器 > 选择上一次保存的 项目格式 的json文件

