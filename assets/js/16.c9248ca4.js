(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{530:function(s,a,t){s.exports=t.p+"assets/img/git.90e14b75.jpg"},736:function(s,a,t){"use strict";t.r(a);var e=t(8),r=Object(e.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"git"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#git"}},[s._v("#")]),s._v(" Git")]),s._v(" "),a("h2",{attrs:{id:"git-常规操作"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#git-常规操作"}},[s._v("#")]),s._v(" Git 常规操作")]),s._v(" "),a("table",[a("thead",[a("tr",[a("th",[a("strong",[s._v("命令名称")])]),s._v(" "),a("th",[a("strong",[s._v("作用")])])])]),s._v(" "),a("tbody",[a("tr",[a("td",[a("code",[s._v("git config --global user.name 用户名")])]),s._v(" "),a("td",[s._v("设置用户签名")])]),s._v(" "),a("tr",[a("td",[a("code",[s._v("git config --global user.email 邮箱")])]),s._v(" "),a("td",[s._v("设置用户邮箱")])]),s._v(" "),a("tr",[a("td",[a("code",[s._v("git init")])]),s._v(" "),a("td",[s._v("初始化一个空的 Git 仓库")])]),s._v(" "),a("tr",[a("td",[a("code",[s._v("git status")])]),s._v(" "),a("td",[s._v("查看本地当前工作区和暂存区的状态")])]),s._v(" "),a("tr",[a("td",[a("code",[s._v("git add <file>")])]),s._v(" "),a("td",[s._v("将需要管理的文件添加到暂存区")])]),s._v(" "),a("tr",[a("td",[a("code",[s._v("git add .")])]),s._v(" "),a("td",[s._v("一次性将所有变更添加到暂存区")])]),s._v(" "),a("tr",[a("td",[a("code",[s._v('git commit -m "Initial commit"')])]),s._v(" "),a("td",[s._v("提交暂存区中的变更到本地仓库，并添加一个描述信息")])]),s._v(" "),a("tr",[a("td",[a("code",[s._v("git reflog")])]),s._v(" "),a("td",[s._v("查看提交历史记录")])]),s._v(" "),a("tr",[a("td",[a("code",[s._v("git log")])]),s._v(" "),a("td",[s._v("查看版本详细信息")])]),s._v(" "),a("tr",[a("td",[a("code",[s._v("git reset --hard 版本号")])]),s._v(" "),a("td",[s._v("版本穿梭")])]),s._v(" "),a("tr",[a("td",[a("code",[s._v("git branch")])]),s._v(" "),a("td",[s._v("管理分支")])]),s._v(" "),a("tr",[a("td",[a("code",[s._v("git remote")])]),s._v(" "),a("td",[s._v("管理远程仓库")])])])]),s._v(" "),a("h2",{attrs:{id:"设置用户签名"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#设置用户签名"}},[s._v("#")]),s._v(" 设置用户签名")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" config "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--global")]),s._v(" user.name 用户名\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" config "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--global")]),s._v(" user.email 邮箱\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" config "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--list")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看全局配置")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("cat")]),s._v(" ~/.gitconfig  "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# cat linux中查看文本的命令  ~ 家 [你当前用户的家]/ .gitconfig")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("blockquote",[a("p",[s._v("说明：签名的作用是区分不同操作者身份。用户的签名信息在每一个版本的提交信息中能够看到，以此确认本次提交是谁做的。Git 首次安装必须设置一下用户签名，否则无法提交代码。")]),s._v(" "),a("p",[s._v("注意：这里设置用户签名和将来登录 GitHub（或其他代码托管中心）的账号没有任何关系。")])]),s._v(" "),a("h2",{attrs:{id:"查看历史版本"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#查看历史版本"}},[s._v("#")]),s._v(" 查看历史版本")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看版本信息")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" reflog\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" reflog "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-n")]),s._v(" 数量\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看版本详细信息")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" log\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])]),a("h2",{attrs:{id:"版本穿梭-回退"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#版本穿梭-回退"}},[s._v("#")]),s._v(" 版本穿梭/回退")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" reset "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--hard")]),s._v(" 版本号\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("blockquote",[a("p",[s._v("Git 切换版本，底层其实是移动的 HEAD 指针。")])]),s._v(" "),a("p",[a("strong",[s._v("撤消上次提交并返回到上一个提交:")])]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" reset HEAD~1\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("这将使 HEAD 指向上一个提交，但"),a("strong",[s._v("不会删除您最新的更改")]),s._v("。如果您希望"),a("strong",[s._v("完全返回到以前的提交并放弃所有更改")]),s._v("，则可以添加 "),a("code",[s._v("--hard")]),s._v(" 选项：")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" reset "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--hard")]),s._v(" HEAD~1\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("blockquote",[a("p",[s._v("请注意，此操作将永久删除您最新的更改，请谨慎使用。如果您已经将更改推送到远程存储库，则在执行此操作之前应先备份这些更改。")]),s._v(" "),a("p",[s._v("上一个版本就是"),a("code",[s._v("HEAD^")]),s._v("，上上一个版本就是"),a("code",[s._v("HEAD^^")]),s._v("，当然往上 100 个版本写 100 个"),a("code",[s._v("^")]),s._v("比较容易数不过来，所以写成 "),a("code",[s._v("HEAD~100")]),s._v("。")])]),s._v(" "),a("h2",{attrs:{id:"撤销修改和删除文件操作"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#撤销修改和删除文件操作"}},[s._v("#")]),s._v(" 撤销修改和删除文件操作")]),s._v(" "),a("p",[a("strong",[s._v("撤销对文件的修改")]),s._v("，此命令将覆盖工作树中指定文件的更改，"),a("strong",[s._v("还原为最近提交或上次检出的状态")]),s._v("。")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" checkout -- "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("filename"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("blockquote",[a("ul",[a("li",[s._v("如果 "),a("code",[s._v("filename")]),s._v(" 自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态；")]),s._v(" "),a("li",[s._v("如果 "),a("code",[s._v("filename")]),s._v(" 已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态。")]),s._v(" "),a("li",[s._v("总之，就是让这个文件回到最近一次 "),a("code",[s._v("git commit")]),s._v(" 或 "),a("code",[s._v("git add")]),s._v(" 时的状态。")])])]),s._v(" "),a("p",[s._v("如果修改只是添加到了暂存区，还没有提交，以下命令可以"),a("strong",[s._v("把暂存区的修改撤销掉，重新放回工作区")]),s._v("：")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" reset HEAD "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("file"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[a("strong",[s._v("删除文件并将此更改提交到 Git 存储库中")])]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("rm")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("filename"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" commit "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-m")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Remove file"')]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])]),a("p",[s._v("这将从工作树和版本历史记录中删除指定的文件。如果只是想从 Git 版本库中删除文件但保留在工作树中")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("rm")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--cached")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("filename"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" commit "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-m")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Remove file from repository"')]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])]),a("h2",{attrs:{id:"远程仓库"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#远程仓库"}},[s._v("#")]),s._v(" 远程仓库")]),s._v(" "),a("p",[a("strong",[s._v("添加远程仓库")]),s._v("：")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 首先，将本地代码库初始化为Git仓库（如果尚未完成）：")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" init\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 添加远程仓库的URL，其中<remote-name>是自定义名称，<remote-url>是远程仓库的URL：")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" remote "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("remote-name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("remote-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 可以使用以下命令确认远程仓库是否已成功添加：")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" remote "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-v")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])]),a("blockquote",[a("p",[s._v("此后，就可以使用 "),a("code",[s._v("git push")]),s._v(" 命令将代码推送到远程仓库，或使用 "),a("code",[s._v("git pull")]),s._v(" 命令从远程仓库拉取代码。")])]),s._v(" "),a("p",[a("strong",[s._v("从远程仓库克隆代码到本地:")])]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" clone "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("remote-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("执行此命令后，Git 将"),a("strong",[s._v("在当前目录下创建一个新目录")]),s._v("，其中包含克隆的代码库副本。如果想指定不同的目录名，可以将目录名作为可选参数添加到命令中：")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" clone "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("remote-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("directory-name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("h2",{attrs:{id:"创建与合并分支"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#创建与合并分支"}},[s._v("#")]),s._v(" 创建与合并分支")]),s._v(" "),a("p",[a("strong",[s._v("创建一个新的分支：")])]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" branch "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branch_name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[a("strong",[s._v("切换到新创建的分支：")])]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" checkout "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branch_name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[a("strong",[s._v("创建并立即切换到该分支：")])]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" checkout "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-b")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branch_name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("合并分支：将 "),a("code",[s._v("<branch_name>")]),s._v(" 分支中的更改合并到当前分支。")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" merge "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branch_name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[a("strong",[s._v("处理冲突：")])]),s._v(" "),a("ol",[a("li",[s._v("运行 "),a("code",[s._v("git status")]),s._v(" 命令查看哪些文件包含冲突。")]),s._v(" "),a("li",[s._v("编辑有冲突的文件，手动解决文件中的冲突。")]),s._v(" "),a("li",[s._v("对编辑后的文件进行 "),a("code",[s._v("git add")]),s._v("，标记为已解决冲突的文件。")]),s._v(" "),a("li",[s._v("使用 "),a("code",[s._v("git commit")]),s._v(" 提交更改，Git 会自动生成一个合并提交，其中包含各自分支中的更改。")])]),s._v(" "),a("blockquote",[a("p",[s._v("注意：在解决冲突前，最好先备份当前的代码状态，以免不小心破坏代码库。另外，在处理冲突之前，可以通过运行 "),a("code",[s._v("git diff")]),s._v(" 命令来查看冲突的源代码，以便更好地理解要解决的问题。")])]),s._v(" "),a("h2",{attrs:{id:"推送和抓取分支"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#推送和抓取分支"}},[s._v("#")]),s._v(" 推送和抓取分支")]),s._v(" "),a("p",[a("strong",[s._v("推送分支：")])]),s._v(" "),a("ol",[a("li",[a("p",[s._v("推送当前分支到远程仓库，并与远程分支关联：")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" push "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-u")]),s._v(" origin "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branch-name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("推送当前分支到远程仓库，并与远程分支合并：")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" push origin "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branch-name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("强制推送当前分支到远程仓库：")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" push "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-f")]),s._v(" origin "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branch-name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("删除远程分支：")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" push origin :"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branch-name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 或")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" push "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--delete")]),s._v(" origin "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branch-name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])])])]),s._v(" "),a("blockquote",[a("p",[s._v("建议采用 pull request 和 code review 等工具和流程来对分支进行审查和反馈，以确保代码质量和稳定性。同时，也应该避免直接向主分支（如 master 分支）提交代码，而是应该使用分支管理策略来组织和管理代码。")])]),s._v(" "),a("p",[a("strong",[s._v("抓取分支：")])]),s._v(" "),a("ol",[a("li",[a("p",[s._v("拉取所有远程分支并更新本地分支：")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" fetch "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("--all"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("拉取一个特定的远程分支到本地：")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" fetch origin "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branch-name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("在本地创建基于远程分支的新分支：")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" checkout "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-b")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("new-branch-name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" origin/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("remote-branch-name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])])]),s._v(" "),a("li",[a("p",[s._v("拉取远程分支并自动与本地分支关联：")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" checkout "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--track")]),s._v(" origin/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("remote-branch-name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 或")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" checkout "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-t")]),s._v(" origin/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("remote-branch-name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])])])]),s._v(" "),a("blockquote",[a("p",[s._v("抓取分支时，需要注意避免覆盖当前分支中未提交的更改。如果本地分支和远程分支存在冲突，需要解决冲突后才能将更改合并到本地分支中。")])]),s._v(" "),a("h2",{attrs:{id:"git-fetch-pull"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#git-fetch-pull"}},[s._v("#")]),s._v(" git fetch & pull")]),s._v(" "),a("p",[a("img",{attrs:{src:t(530),alt:"img"}})]),s._v(" "),a("ul",[a("li",[a("code",[s._v("git fetch")]),s._v("是将远程主机的最新内容拉到本地，用户在检查了以后决定是否合并到工作本机分支中。")]),s._v(" "),a("li",[a("code",[s._v("git pull")]),s._v(" 则是将远程主机的最新内容拉下来后直接合并，即："),a("code",[s._v("git pull = git fetch + git merge")]),s._v("，这样可能会产生冲突，需要手动解决。")])]),s._v(" "),a("h2",{attrs:{id:"分支的基本操作"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#分支的基本操作"}},[s._v("#")]),s._v(" 分支的基本操作")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看本地所有分支 ")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" branch\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看远程所有分支")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" branch "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-r")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看本地和远程的所有分支")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" branch "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-a")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 新建分支")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" branch "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branchname"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 删除本地分支")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" branch "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-d")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branchname"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 删除远程分支，删除后还需推送到服务器")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" branch "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-d")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-r")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branchname"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" push origin:"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("branchname"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 删除后推送至服务器")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 重命名本地分支")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" branch "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-m")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("oldbranch"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("newbranch"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 重命名远程分支：")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 1、删除远程待修改分支")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 2、push本地新分支到远程服务器")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# git中一些选项解释:")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-d")]),s._v("\n--delete：删除\n\n"),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-D")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--delete")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--force")]),s._v(" 的快捷键\n\n"),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-f")]),s._v("\n--force：强制\n\n"),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-m")]),s._v("\n--move：移动或重命名\n\n"),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-M")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--move")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--force")]),s._v(" 的快捷键\n\n"),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-r")]),s._v("\n--remote：远程\n\n"),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-a")]),s._v("\n--all：所有\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br"),a("span",{staticClass:"line-number"},[s._v("23")]),a("br"),a("span",{staticClass:"line-number"},[s._v("24")]),a("br"),a("span",{staticClass:"line-number"},[s._v("25")]),a("br"),a("span",{staticClass:"line-number"},[s._v("26")]),a("br"),a("span",{staticClass:"line-number"},[s._v("27")]),a("br"),a("span",{staticClass:"line-number"},[s._v("28")]),a("br"),a("span",{staticClass:"line-number"},[s._v("29")]),a("br"),a("span",{staticClass:"line-number"},[s._v("30")]),a("br"),a("span",{staticClass:"line-number"},[s._v("31")]),a("br"),a("span",{staticClass:"line-number"},[s._v("32")]),a("br"),a("span",{staticClass:"line-number"},[s._v("33")]),a("br"),a("span",{staticClass:"line-number"},[s._v("34")]),a("br"),a("span",{staticClass:"line-number"},[s._v("35")]),a("br"),a("span",{staticClass:"line-number"},[s._v("36")]),a("br"),a("span",{staticClass:"line-number"},[s._v("37")]),a("br"),a("span",{staticClass:"line-number"},[s._v("38")]),a("br"),a("span",{staticClass:"line-number"},[s._v("39")]),a("br"),a("span",{staticClass:"line-number"},[s._v("40")]),a("br"),a("span",{staticClass:"line-number"},[s._v("41")]),a("br")])]),a("h2",{attrs:{id:"撤销本地提交-恢复远程仓库提交"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#撤销本地提交-恢复远程仓库提交"}},[s._v("#")]),s._v(" 撤销本地提交 & 恢复远程仓库提交")]),s._v(" "),a("h3",{attrs:{id:"撤销还没有推送到-remote-仓库的提交"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#撤销还没有推送到-remote-仓库的提交"}},[s._v("#")]),s._v(" 撤销还没有推送到 remote 仓库的提交")]),s._v(" "),a("h4",{attrs:{id:"完全撤销-舍弃全部改动-销毁提交"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#完全撤销-舍弃全部改动-销毁提交"}},[s._v("#")]),s._v(" 完全撤销-舍弃全部改动，销毁提交")]),s._v(" "),a("p",[s._v("当你新加了一些改动，并且添加这些改动，然后 commit 提交到本地，这时你发现的你的改动完全做错了，你想撤销这个提交，而且不需要保留之前的改动。")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" reset "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--hard")]),s._v(" HEAD~\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("blockquote",[a("p",[s._v("执行完 reset 命令后，执行 git status 命令来查看你 branch 状态，你可以发现你刚刚的提交消失了，并且之前的 change 改动也消失了")])]),s._v(" "),a("ul",[a("li",[a("p",[s._v("撤销提交后又想恢复刚刚销毁的提交：")]),s._v(" "),a("ul",[a("li",[s._v("当你用 "),a("code",[s._v("git reset --hard HEAD~")]),s._v("来撤销提交后，你销毁了你的提交，但假如这时你突然又想恢复刚刚销毁的提交，来看看之前做的改动")])]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#  执行git reflog命令来查看你刚刚销毁提交的记录及其哈希值。")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" reflog\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 找到相对应的哈希值，执行git checkout -b someNewBranchName shaYouDestroyed命令")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" checkout "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-b")]),s._v(" fix/recover-commit-remove-before 7144f51\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 你可以在“fix/recover-commit-remove-before”分支上查看该提交。     ")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br")])])])]),s._v(" "),a("h4",{attrs:{id:"撤销-但保留改动"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#撤销-但保留改动"}},[s._v("#")]),s._v(" 撤销-但保留改动")]),s._v(" "),a("p",[s._v("当你做了一些改动，并且添加这些改动，然后 commit 提交到本地，这时你发现的你的改动有点小问题，你想撤销这个 commit 提交，而且要保留之前的改动，方便在之前的改动基础上做一些新的改动。")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" reset HEAD~\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("执行完 reset 命令后，再执行 "),a("code",[s._v("git status")]),s._v(" 来查看你之前的那些改动，你会发现你之前的哪些改动都还在")]),s._v(" "),a("h4",{attrs:{id:"最安全轻微的撤销"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#最安全轻微的撤销"}},[s._v("#")]),s._v(" 最安全轻微的撤销")]),s._v(" "),a("p",[s._v("保留文件的改动及索引状态，撤销完成后将会到 git 添加改动的状态，实现方法为")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" reset "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--soft")]),s._v(" HEAD~\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("撤销完成，回到 git 添加改动后的状态。")]),s._v(" "),a("h3",{attrs:{id:"撤销已经推送到-remote-仓库的提交"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#撤销已经推送到-remote-仓库的提交"}},[s._v("#")]),s._v(" 撤销已经推送到 remote 仓库的提交")]),s._v(" "),a("h4",{attrs:{id:"利用-git-revert-来撤销远程提交"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#利用-git-revert-来撤销远程提交"}},[s._v("#")]),s._v(" 利用 git revert 来撤销远程提交")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" revert HEAD   （恢复HEAD提交）\n或者\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" revert "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("commit_hash"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" （恢复对应哈希值的提交）\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])])])}),[],!1,null,null,null);a.default=r.exports}}]);