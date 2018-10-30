# electron-learning
Learning demo for electron and nodejs



### GIT 入门

现在开发人员增多, 请各位 在自己的本地分支开发后再合并到develop 分支.
 
避免在develop分支开发导致过多的合并记录,现在合并记录太多不容易查找.
 
 
流程如下
 
1. 先获取远程分支的最新代码 git pull origin master  获取远程 master 分支最新代码
 
2. 根据最新的代码 新建一个本地分支, git checkout –b newxxx   以 当前 master 分支为基础创建本地新分支. 进行开发.
 
3. 开发完毕 先切换到 master 分支 , git checkout master 
4. 然后 git pull  获取新远程新代码 ,
5. 然后 git merge newxxx  分支 合并你的代码到 master 分支
6. 最后 git push origin master 上传代码
 
7. 如果在你的 newxxx 分支想更新合并远程分支最新的新代码 git fetch origin develop
git rebase develop 或 git merge develop


####  参考文献
1. git flow http://www.ruanyifeng.com/blog/2015/12/git-workflow.html
 
尽量减少merge 的注释, 使用rebase 合并 保持直线提交记录.
 
 
