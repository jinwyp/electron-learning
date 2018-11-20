#### PUSH 工作内容

1. (1.1) 在storm发送时记录 (dhid+requetid) => (cname, nid, pushtype) (@王威)
2. (1.2) 接DC实时打点入kafka，实时统计PUSH曝光、点击绘成曲线(聚合维度包括：PUSH类别、实验ID、newsId) (@王威、@王宇鹏)
3. (1.3) 接JS实时点击打点(jsclick)入 kafka，绘制实时曲线(聚合维度包括：PUSH类别、chanId、newsId) (@谢俊华、@王宇鹏)
4. (2) AB测机制：cname规则、实验数据报表实时呈现 (@王威、@王宇鹏)

5. (2) PUSH落地页加载速度优化 (@王宇鹏)

